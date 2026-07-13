import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const DOC_TYPES = ["aadhaar_front", "aadhaar_back", "pan", "selfie", "gst", "bank_proof"] as const;

export const listMyKyc = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("kyc_documents")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const recordKycDoc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z
      .object({
        doc_type: z.enum(DOC_TYPES),
        file_url: z.string().min(1).max(500),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("kyc_documents").insert({
      user_id: context.userId,
      doc_type: data.doc_type,
      file_url: data.file_url,
      status: "pending",
    });
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const submitKycForReview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z
      .object({
        full_name: z.string().trim().min(2).max(80),
        pan_number: z.string().trim().length(10).optional().or(z.literal("")),
        aadhaar_last4: z.string().regex(/^\d{4}$/).optional().or(z.literal("")),
        business_name: z.string().trim().max(120).optional(),
        address: z.string().trim().max(300).optional(),
        city: z.string().trim().max(80).optional(),
        state: z.string().trim().max(80).optional(),
        pincode: z.string().regex(/^\d{6}$/).optional().or(z.literal("")),
        gst_number: z.string().trim().max(20).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    const patch = {
      full_name: data.full_name,
      kyc_status: "pending" as const,
      pan_number: data.pan_number || null,
      aadhaar_last4: data.aadhaar_last4 || null,
      business_name: data.business_name || null,
      address: data.address || null,
      city: data.city || null,
      state: data.state || null,
      pincode: data.pincode || null,
      gst_number: data.gst_number || null,
    };
    const { error } = await context.supabase.from("profiles").update(patch).eq("id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });


/** Admin: approve or reject a user's KYC. */
export const reviewKyc = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw) =>
    z
      .object({
        user_id: z.string().uuid(),
        decision: z.enum(["approved", "rejected"]),
        remarks: z.string().max(300).optional(),
      })
      .parse(raw),
  )
  .handler(async ({ data, context }) => {
    // Verify admin via user_roles (readable by the user for own rows via RLS)
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isAdmin = (roles ?? []).some((r) => ["super_admin", "auditor", "support"].includes(r.role));
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const updates = [
      supabaseAdmin.from("profiles").update({ kyc_status: data.decision }).eq("id", data.user_id),
      supabaseAdmin
        .from("kyc_documents")
        .update({
          status: data.decision,
          reviewed_by: context.userId,
          reviewed_at: new Date().toISOString(),
          remarks: data.remarks ?? null,
        })
        .eq("user_id", data.user_id),
    ];
    const results = await Promise.all(updates);
    for (const r of results) if (r.error) throw new Error(r.error.message);
    return { ok: true as const };
  });

export const listPendingKyc = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: roles } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    const isAdmin = (roles ?? []).some((r) => ["super_admin", "auditor", "support"].includes(r.role));
    if (!isAdmin) return [];
    const { data } = await context.supabase
      .from("profiles")
      .select("id, full_name, mobile, kyc_status, city, state, created_at")
      .eq("kyc_status", "pending")
      .order("created_at", { ascending: false });
    return data ?? [];
  });
