import { supabase } from "@/integrations/supabase/client";

export type NotificationEventType =
  | "MR_CREATED_BY_ENGINEER"
  | "MR_CREATED_BY_RM"
  | "MR_APPROVED"
  | "MR_ITEMS_SENT"
  | "MRC_CREATED"
  | "MR_STATUS_CHANGED";

interface NotifyRequestMeta {
  id?: string;
  title?: string;
  ticketNumber?: string;
  zone?: string | null;
  description?: string;
  status?: string;
  requestedBy?: string;
  requesterEmail?: string | null;
}

interface NotifyOptions {
  eventType: NotificationEventType;
  zone?: string | null;
  request?: NotifyRequestMeta;
  targetDepartments?: Array<"regional_manager" | "store_manager" | "engineer" | "admin">;
  extraRecipients?: string[]; // direct emails if available
}

export async function notify(options: NotifyOptions) {
  try {
    const { eventType, zone = null, request, targetDepartments = [], extraRecipients = [] } = options;
    
    // Log notification for debugging
    console.log('Sending notification:', { eventType, zone, targetDepartments, extraRecipients });
    
    await supabase.functions.invoke("send-notification-email", {
      body: {
        eventType,
        zone,
        request,
        targetDepartments,
        extraRecipients,
      },
    });
  } catch (e) {
    // Non-blocking – log for debugging
    console.error("Notification error", e);
  }
}
