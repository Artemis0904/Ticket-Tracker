import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { notify } from '@/lib/notifications';
import { useAuth } from '@/hooks/useAuth';

// Types
export type SourceOption = 'Store' | 'CSD' | 'Site Purchase';
export type UrgencyOption = 'Low' | 'Medium' | 'High';
export type RequestStatus = 'pending' | 'approved' | 'in-process' | 'in-transit' | 'delivered' | 'rejected';

export interface MaterialItemRow {
  id: string; // unique per row
  description: string;
  quantity: number;
  source: SourceOption;
  urgency: UrgencyOption;
  approvedQty?: number;
  // Store Manager editable fields
  sentQty?: number;
  mrfNo?: string;
  mifNo?: string;
  remarks?: string;
  // Returns/MRC optional fields
  returnQty?: number;
  receivedQty?: number;
  mrcNo?: string;
  transportModeRow?: 'Train' | 'Bus' | 'Courier';
}

export interface MaterialRequest {
  id: string;
  title: string;
  items: MaterialItemRow[];
  requestedBy: string; // username
  requesterEmail?: string; // email of requester
  requesterId?: string; // auth user id
  createdAt: string; // ISO date
  status: RequestStatus;
  // Optional metadata
  ticketNumber?: string;
  zone?: string;
  description?: string;
  // Shipment metadata
  transportMode?: 'Train' | 'Bus' | 'Courier';
  edt?: string; // ISO date for estimated delivery time/date
  trackingNo?: string;
  sentAt?: string; // ISO datetime when marked as sent
}

interface AppState {
  materialRequests: MaterialRequest[];
  currentUser: string | null;
}

// Actions
 type Action =
  | { type: 'INIT_FROM_STORAGE'; payload: AppState }
  | { type: 'SET_CURRENT_USER'; payload: string | null }
  | { type: 'ADD_REQUEST'; payload: { title: string; items: MaterialItemRow[]; ticketNumber?: string; zone?: string; description?: string; initialStatus?: RequestStatus; requesterEmail?: string; requesterId?: string; transportMode?: 'Train' | 'Bus' | 'Courier'; edt?: string; trackingNo?: string } }
  | { type: 'APPROVE_REQUEST'; payload: { id: string } }
  | { type: 'REJECT_REQUEST'; payload: { id: string } }
  | { type: 'UPDATE_STATUS'; payload: { id: string; status: RequestStatus } }
  | { type: 'UPDATE_REQUEST'; payload: { id: string; patch: Partial<Pick<MaterialRequest, 'items' | 'ticketNumber' | 'zone' | 'description' | 'title' | 'transportMode' | 'edt' | 'trackingNo' | 'sentAt'>> } };
const initialState: AppState = {
  materialRequests: [],
  currentUser: null,
};

function uid(prefix = 'req') {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'INIT_FROM_STORAGE':
      return { ...state, ...action.payload };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'ADD_REQUEST': {
      const username = state.currentUser || localStorage.getItem('currentUser') || 'Engineer';
      const { title, items, ticketNumber, zone, description, initialStatus, requesterEmail, requesterId, transportMode, edt, trackingNo } = action.payload;
      const newReq: MaterialRequest = {
        id: uid('MR'),
        title,
        items,
        requestedBy: username,
        requesterEmail,
        requesterId,
        createdAt: new Date().toISOString(),
        status: initialStatus ?? 'pending',
        ticketNumber,
        zone,
        description,
        transportMode,
        edt,
        trackingNo,
      };
      return { ...state, materialRequests: [newReq, ...state.materialRequests] };
    }
    case 'APPROVE_REQUEST': {
      return {
        ...state,
        materialRequests: state.materialRequests.map(r => r.id === action.payload.id ? { ...r, status: 'approved' } : r)
      };
    }
    case 'REJECT_REQUEST': {
      return {
        ...state,
        materialRequests: state.materialRequests.map(r => r.id === action.payload.id ? { ...r, status: 'rejected' } : r)
      };
    }
    case 'UPDATE_STATUS': {
      return {
        ...state,
        materialRequests: state.materialRequests.map(r => r.id === action.payload.id ? { ...r, status: action.payload.status } : r)
      };
    }
    case 'UPDATE_REQUEST': {
      return {
        ...state,
        materialRequests: state.materialRequests.map(r => r.id === action.payload.id ? { ...r, ...action.payload.patch } : r)
      };
    }
    default:
      return state;
  }
}

const STORAGE_KEY = 'appStore_v1';

const AppStoreContext = createContext<{
  state: AppState;
  addMaterialRequest: (
    title: string,
    items: MaterialItemRow[],
    extra?: {
      ticketNumber?: string;
      zone?: string;
      description?: string;
      initialStatus?: RequestStatus;
      requesterEmail?: string;
      requesterId?: string;
      transportMode?: 'Train' | 'Bus' | 'Courier';
      edt?: string;
      trackingNo?: string;
    }
  ) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  updateStatus: (id: string, status: RequestStatus) => void;
  updateRequest: (id: string, patch: Partial<Pick<MaterialRequest, 'items' | 'ticketNumber' | 'zone' | 'description' | 'title' | 'transportMode' | 'edt' | 'trackingNo' | 'sentAt'>>) => void;
  setCurrentUser: (username: string | null) => void;
} | null>(null);
export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, department } = useAuth();

  // Init from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const currentUser = localStorage.getItem('currentUser');
      if (raw) {
        const parsed = JSON.parse(raw) as AppState;
        dispatch({ type: 'INIT_FROM_STORAGE', payload: { ...initialState, ...parsed, currentUser: currentUser || parsed.currentUser || null } });
      } else if (currentUser) {
        dispatch({ type: 'SET_CURRENT_USER', payload: currentUser });
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    const { currentUser, materialRequests } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentUser, materialRequests }));
  }, [state.currentUser, state.materialRequests]);

  const addMaterialRequest = async (title: string, items: MaterialItemRow[], extra?: { ticketNumber?: string; zone?: string; description?: string; initialStatus?: RequestStatus; requesterEmail?: string; requesterId?: string; transportMode?: 'Train' | 'Bus' | 'Courier'; edt?: string; trackingNo?: string; requestType?: 'MR' | 'MRC' }) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('material_requests')
        .insert({
          title,
          request_type: extra?.requestType || 'MR',
          items: items as any,
          requested_by: state.currentUser || 'User',
          requester_email: user.email,
          requester_id: user.id,
          ticket_number: extra?.ticketNumber,
          zone: extra?.zone,
          description: extra?.description,
          status: extra?.initialStatus || 'pending',
          transport_mode: extra?.transportMode,
          edt: extra?.edt,
          tracking_no: extra?.trackingNo,
        })
        .select()
        .single();

      if (error) throw error;

      // Send email notification
      const isRMCreated = department === 'regional_manager';
      const eventType = extra?.requestType === 'MRC' ? 'MRC_CREATED' : (isRMCreated ? 'MR_CREATED_BY_RM' : 'MR_CREATED_BY_ENGINEER');
      const targetDepartments = extra?.requestType === 'MRC' 
        ? ['regional_manager' as const, 'store_manager' as const] 
        : (isRMCreated ? ['store_manager' as const] : ['regional_manager' as const]);

      await notify({
        eventType,
        zone: extra?.zone,
        request: {
          id: data.id,
          title,
          ticketNumber: extra?.ticketNumber,
          zone: extra?.zone,
          description: extra?.description,
          status: extra?.initialStatus || 'pending',
          requestedBy: state.currentUser || 'User',
          requesterEmail: user.email,
        },
        targetDepartments,
      });

      // Update local state
      dispatch({ type: 'ADD_REQUEST', payload: { title, items, ...(extra || {}) } });
    } catch (error) {
      console.error('Error adding material request:', error);
    }
  };

  const approveRequest = async (id: string) => {
    try {
      const currentUser = state.currentUser || localStorage.getItem('currentUser') || 'Regional Manager';
      const currentUserEmail = user?.email || '';

      const { error } = await supabase
        .from('material_requests')
        .update({ 
          status: 'approved',
          approved_by: currentUser,
          approved_at: new Date().toISOString(),
          approved_by_email: currentUserEmail
        })
        .eq('id', id);

      if (error) throw error;

      // Get request details for notification
      const { data: request } = await supabase
        .from('material_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (request) {
        await notify({
          eventType: 'MR_APPROVED',
          zone: request.zone,
          request: {
            id: request.id,
            title: request.title,
            ticketNumber: request.ticket_number,
            zone: request.zone,
            description: request.description,
            status: 'approved',
            requestedBy: request.requested_by,
            requesterEmail: request.requester_email,
          },
          targetDepartments: ['store_manager' as const, 'engineer' as const],
        });
      }

      dispatch({ type: 'APPROVE_REQUEST', payload: { id } });
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const updateStatus = async (id: string, status: RequestStatus) => {
    try {
      const { error } = await supabase
        .from('material_requests')
        .update({ status, ...(status === 'in-transit' ? { sent_at: new Date().toISOString() } : {}) })
        .eq('id', id);

      if (error) {
        console.error('Database update failed:', error);
        throw error;
      }

      // Get request details for notifications
      const { data: request } = await supabase
        .from('material_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (request) {
        // Send notification for items sent
        if (status === 'in-transit') {
          // Determine target departments based on request type
          const targetDepartments = request.request_type === 'MRC' || request.requested_by.includes('RM') 
            ? ['regional_manager' as const] 
            : ['engineer' as const, 'regional_manager' as const];

          await notify({
            eventType: 'MR_ITEMS_SENT',
            zone: request.zone,
            request: {
              id: request.id,
              title: request.title,
              ticketNumber: request.ticket_number,
              zone: request.zone,
              description: request.description,
              status: 'in-transit',
              requestedBy: request.requested_by,
              requesterEmail: request.requester_email,
            },
            targetDepartments,
          });
        }

        // Send status change notification to engineer and regional manager
        const extraRecipients: string[] = [];
        
        // Add engineer's email if available
        if (request.requester_email) {
          extraRecipients.push(request.requester_email);
        }

        // Add regional manager's email who approved the request
        if (request.approved_by_email) {
          extraRecipients.push(request.approved_by_email);
        }

        // Send notification to the specific people involved
        await notify({
          eventType: 'MR_STATUS_CHANGED',
          zone: request.zone,
          request: {
            id: request.id,
            title: request.title,
            ticketNumber: request.ticket_number,
            zone: request.zone,
            description: request.description,
            status: status,
            requestedBy: request.requested_by,
            requesterEmail: request.requester_email,
          },
          extraRecipients,
        });
      }

      // Only update local state if database update was successful
      dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
    } catch (error) {
      console.error('Error updating status:', error);
      // Don't update local state if database update failed
      throw error;
    }
  };

  const value = useMemo(() => ({
    state,
    setCurrentUser: (username: string | null) => dispatch({ type: 'SET_CURRENT_USER', payload: username }),
    addMaterialRequest,
    approveRequest,
    rejectRequest: (id: string) => dispatch({ type: 'REJECT_REQUEST', payload: { id } }),
    updateStatus,
    updateRequest: async (id: string, patch: Partial<Pick<MaterialRequest, 'items' | 'ticketNumber' | 'zone' | 'description' | 'title' | 'transportMode' | 'edt' | 'trackingNo' | 'sentAt'>>) => {
      try {
        const updateData: any = {};
        if (patch.items !== undefined) updateData.items = patch.items;
        if (patch.ticketNumber !== undefined) updateData.ticket_number = patch.ticketNumber;
        if (patch.zone !== undefined) updateData.zone = patch.zone;
        if (patch.description !== undefined) updateData.description = patch.description;
        if (patch.title !== undefined) updateData.title = patch.title;
        if (patch.transportMode !== undefined) updateData.transport_mode = patch.transportMode;
        if (patch.edt !== undefined) updateData.edt = patch.edt;
        if (patch.trackingNo !== undefined) updateData.tracking_no = patch.trackingNo;
        if (patch.sentAt !== undefined) updateData.sent_at = patch.sentAt;

        const { error } = await supabase
          .from('material_requests')
          .update(updateData)
          .eq('id', id);

        if (error) {
          console.error('Database update failed:', error);
          throw error;
        }

        // Only update local state if database update was successful
        dispatch({ type: 'UPDATE_REQUEST', payload: { id, patch } });
      } catch (error) {
        console.error('Error updating request:', error);
        // Don't update local state if database update failed
        throw error;
      }
    },
  }), [state, user, department]);
  return (
    <AppStoreContext.Provider value={value}>
      {children}
    </AppStoreContext.Provider>
  );
};

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error('useAppStore must be used within AppStoreProvider');
  return ctx;
}
