import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findLocalUserById, listLocalUsers, updateLocalUser, type LocalUserRecord } from "@/lib/local-store";
import { resolveCallerRoles } from "@/lib/role-utils";

const DOC_TYPES = ["aadhaar_front", "aadhaar_back", "pan", "selfie", "gst", "bank_proof"] as const;

// Simple in-memory KYC docs storage (in production, use database)
const kycDocs: Array<{
  id: string;
  user_id: string;
  doc_type: (typeof DOC_TYPES)[number];
  file_url: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewed_by?: string;
  reviewed_at?: string;
  remarks?: string;
}> = [];

export const listMyKyc = createServerFn({ method: "GET" })
  .handler(async (args: any) => {
    const { context } = args as { context?: { userId: string } };
    if (!context?.userId) {
      throw new Error("Unauthorized");
    }
    return kycDocs
      .filter((d) => d.user_id === context.userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

export const recordKycDoc = createServerFn({ method: "POST" })
  .validator((raw) =>
    z
      .object({
        doc_type: z.enum(DOC_TYPES),
        file_url: z.string().min(1).max(500),
      })
      .parse(raw),
  )
  .handler(async (args: any) => {
    const { data, context } = args as { data: any; context?: { userId: string } };
    if (!context?.userId) {
      throw new Error("Unauthorized");
    }
    kycDocs.push({
      id: crypto.randomUUID(),
      user_id: context.userId,
      doc_type: data.doc_type,
      file_url: data.file_url,
      status: "pending",
      created_at: new Date().toISOString(),
    });
    return { ok: true as const };
  });

export const submitKycForReview = createServerFn({ method: "POST" })
  .validator((raw) =>
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
  .handler(async (args: any) => {
    const { data, context } = args as { data: any; context?: { userId: string } };
    if (!context?.userId) {
      throw new Error("Unauthorized");
    }
    const user = findLocalUserById(context.userId);
    if (!user) throw new Error("User not found");

    updateLocalUser(context.userId, {
      full_name: data.full_name,
      pan_number: data.pan_number && data.pan_number.length > 0 ? data.pan_number : null,
      aadhaar_last4: data.aadhaar_last4 && data.aadhaar_last4.length > 0 ? data.aadhaar_last4 : null,
      business_name: data.business_name ?? user.business_name,
      address: data.address && data.address.length > 0 ? data.address : null,
      city: data.city ?? user.city,
      state: data.state ?? user.state,
      pincode: data.pincode && data.pincode.length > 0 ? data.pincode : null,
      gst_number: data.gst_number && data.gst_number.length > 0 ? data.gst_number : null,
      kyc_status: "pending",
    });

    return { ok: true as const };
  });

export const reviewKyc = createServerFn({ method: "POST" })
  .validator((raw) =>
    z
      .object({
        user_id: z.string().uuid(),
        decision: z.enum(["approved", "rejected"]),
        remarks: z.string().max(300).optional(),
      })
      .parse(raw),
  )
  .handler(async (args: any) => {
    const { data, context } = args as { data: any; context?: { userId: string; claims?: Record<string, unknown> } };
    if (!context?.userId) {
      throw new Error("Unauthorized");
    }
    const roles = await resolveCallerRoles({ userId: context.userId, claims: context.claims });
    const isAdmin = roles.some((r) => ["super_admin", "auditor", "support"].includes(r));
    if (!isAdmin) throw new Error("Forbidden");
    
    // Update KYC docs status
    const updated = updateLocalUser(data.user_id, {
      kyc_status: data.decision,
    });

    kycDocs
      .filter((d) => d.user_id === data.user_id)
      .forEach((d) => {
        d.status = data.decision;
        d.reviewed_by = context.userId;
        d.reviewed_at = new Date().toISOString();
        d.remarks = data.remarks;
      });
    
    return { ok: true as const, updatedUser: updated };
  });

export const listPendingKyc = createServerFn({ method: "GET" })
  .handler(async (args: any) => {
    const { context } = args as { context?: { userId: string; claims?: Record<string, unknown> } };
    if (!context?.userId) {
      throw new Error("Unauthorized");
    }
    const roles = await resolveCallerRoles({ userId: context.userId, claims: context.claims });
    const isAdmin = roles.some((r) => ["super_admin", "auditor", "support"].includes(r));
    if (!isAdmin) return [];
    
    return listLocalUsers()
      .filter((u) => u.kyc_status === "pending")
      .map((u) => ({
        id: u.id,
        full_name: u.full_name,
        mobile: u.mobile,
        kyc_status: u.kyc_status,
        city: u.city,
        state: u.state,
        created_at: u.created_at,
      }))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

