import { createFileRoute, redirect } from "@tanstack/react-router";
import { getLocalSession, findLocalUserById } from "@/lib/local-store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined") {
      const session = getLocalSession();
      const validSession = session?.userId && findLocalUserById(session.userId);
      throw redirect({ to: validSession ? "/dashboard" : "/auth" });
    }

    // Fallback for environments without window
    throw redirect({ to: "/auth" });
  },
});
