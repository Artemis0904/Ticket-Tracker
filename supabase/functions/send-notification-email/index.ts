import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY") as string);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Types
interface RequestMeta {
  id?: string;
  title?: string;
  ticketNumber?: string;
  zone?: string | null;
  description?: string;
  status?: string;
  requestedBy?: string;
  requesterEmail?: string | null;
}

interface NotifyPayload {
  eventType:
    | "MR_CREATED_BY_ENGINEER"
    | "MR_CREATED_BY_RM"
    | "MR_APPROVED"
    | "MR_ITEMS_SENT"
    | "MRC_CREATED"
    | "MR_STATUS_CHANGED";
  zone?: string | null;
  request?: RequestMeta;
  targetDepartments?: Array<"regional_manager" | "store_manager" | "engineer" | "admin">;
  extraRecipients?: string[];
}

function uniq<T>(arr: T[]): T[] {
  return Array.from(new Set(arr.filter(Boolean))) as T[];
}

function subjectFor(event: NotifyPayload["eventType"], r?: RequestMeta) {
  const tkt = r?.ticketNumber ? `#${r.ticketNumber}` : r?.title ? r.title : "Material Request";
  switch (event) {
    case "MR_CREATED_BY_ENGINEER":
      return `New MR created ${tkt}`;
    case "MR_CREATED_BY_RM":
      return `RM created MR ${tkt}`;
    case "MR_APPROVED":
      return `MR approved ${tkt}`;
    case "MR_ITEMS_SENT":
      return `Items sent ${tkt}`;
    case "MRC_CREATED":
      return `New MRC submitted ${tkt}`;
    case "MR_STATUS_CHANGED":
      return `MR Status Changed to ${r?.status} - ${tkt}`;
  }
}

function htmlFor(event: NotifyPayload["eventType"], r?: RequestMeta) {
  const zone = r?.zone ?? "—";
  const desc = r?.description ? `<p>${r.description}</p>` : "";
  const rows = [
    r?.ticketNumber ? `<tr><td>Ticket</td><td>${r.ticketNumber}</td></tr>` : "",
    r?.title ? `<tr><td>Title</td><td>${r.title}</td></tr>` : "",
    `<tr><td>Zone</td><td>${zone}</td></tr>`,
    r?.requestedBy ? `<tr><td>Requested By</td><td>${r.requestedBy}</td></tr>` : "",
    r?.status ? `<tr><td>Status</td><td>${r.status}</td></tr>` : "",
  ]
    .filter(Boolean)
    .join("");

  const lead = (() => {
    switch (event) {
      case "MR_CREATED_BY_ENGINEER":
        return "A new Material Request has been created by the Engineer.";
      case "MR_CREATED_BY_RM":
        return "A Regional Manager has created a Material Request.";
      case "MR_APPROVED":
        return "The Material Request has been approved.";
      case "MR_ITEMS_SENT":
        return "The Store Manager has marked items as sent.";
      case "MRC_CREATED":
        return "A new Material Return (MRC) has been submitted.";
      case "MR_STATUS_CHANGED":
        return `The Material Request status has been changed to ${r?.status || 'unknown'}.`;
    }
  })();

  return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif;padding:16px">
      <h2 style="margin:0 0 8px 0">${lead}</h2>
      ${desc}
      <table cellpadding="6" cellspacing="0" style="margin-top:12px;border-collapse:collapse;border:1px solid #eee">
        <tbody>${rows}</tbody>
      </table>
      <p style="color:#666;margin-top:12px">This is an automated notification.</p>
    </div>
  `;
}

async function resolveRecipients(supabase: ReturnType<typeof createClient>, payload: NotifyPayload) {
  const out: string[] = [];
  if (payload.extraRecipients && payload.extraRecipients.length) out.push(...payload.extraRecipients);

  const zone = payload.zone ?? payload.request?.zone ?? null;

  for (const dept of payload.targetDepartments || []) {
    const { data, error } = await supabase.rpc("get_emails_by_department", {
      _department: dept,
      _zone: zone,
    });
    if (error) {
      console.error("get_emails_by_department error", error);
    } else if (Array.isArray(data)) {
      out.push(...(data as string[]));
    }
  }

  return uniq(out);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload = (await req.json()) as NotifyPayload;

    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const recipients = await resolveRecipients(supabase, payload);

    if (!recipients.length) {
      return new Response(JSON.stringify({ ok: false, reason: "no_recipients" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const subject = subjectFor(payload.eventType, payload.request);
    const html = htmlFor(payload.eventType, payload.request);

    const { error } = await resend.emails.send({
      from: "Lovable App <onboarding@resend.dev>",
      to: recipients,
      subject,
      html,
    });
    if (error) throw error;

    return new Response(JSON.stringify({ ok: true, recipients }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("send-notification-email error", error);
    return new Response(JSON.stringify({ ok: false, error: String(error?.message || error) }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
