"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/auth-provider";

export function DashboardNav() {
  const { user } = useAuth();
  const router = useRouter();

  const phone = user?.phone?.replace("+91", "") ?? "";

  const handleLogout = async () => {
    const supabase = getSupabaseClient();
    await supabase?.auth.signOut();
    router.push("/");
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e3a8a]">
            <span className="text-xs font-black text-white">LF</span>
          </div>
          <span className="text-lg font-black text-[#1e3a8a]">LiquiFi</span>
        </Link>

        <div className="flex items-center gap-3">
          {phone && (
            <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5">
              <User size={13} className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">
                +91 {phone}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-[#ea580c]"
          >
            <LogOut size={15} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
