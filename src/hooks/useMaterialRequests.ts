import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MaterialRequest } from '@/store/appStore';
import { useAuth } from './useAuth';

export function useMaterialRequests() {
  const { user, department } = useAuth();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, error } = useQuery({
    queryKey: ['material-requests'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('material_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map((item): MaterialRequest => ({
        id: item.id,
        title: item.title,
        items: (item.items as any) || [],
        requestedBy: item.requested_by,
        requesterEmail: item.requester_email || undefined,
        requesterId: item.requester_id || undefined,
        createdAt: item.created_at,
        status: item.status as any,
        ticketNumber: item.ticket_number || undefined,
        zone: item.zone || undefined,
        description: item.description || undefined,
        transportMode: (item.transport_mode as any) || undefined,
        edt: item.edt || undefined,
        trackingNo: item.tracking_no || undefined,
        sentAt: item.sent_at || undefined,
      }));
    },
    enabled: !!user,
    refetchInterval: 5000, // Refetch every 5 seconds as a fallback
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('material-requests-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'material_requests',
        },
        () => {
          console.log('Database change detected, refreshing data...');
          // Invalidate and refetch when any change occurs
          queryClient.invalidateQueries({ queryKey: ['material-requests'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  const deleteRequest = async (id: string) => {
    if (department !== 'regional_manager') {
      throw new Error('Only regional managers can delete requests');
    }

    const { error } = await supabase
      .from('material_requests')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: ['material-requests'] });
  };

  return {
    requests,
    isLoading,
    error,
    deleteRequest,
    refreshRequests: () => queryClient.invalidateQueries({ queryKey: ['material-requests'] }),
  };
}