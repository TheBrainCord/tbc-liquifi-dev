"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  FileText,
  CreditCard,
  User,
  ArrowRight,
  CheckCircle,
  Loader2,
  AlertCircle,
  PhoneCall,
  MessageCircle,
  Send,
} from "lucide-react";
import { useAuth } from "@/lib/supabase/auth-provider";
import { ConsultationModal } from "@/components/ConsultationModal";

interface UserProfile {
  full_name: string | null;
  employment_type: string | null;
  monthly_income: number | null;
  pincode: string | null;
  city: string | null;
}

const EMPLOYMENT_LABELS: Record<string, string> = {
  salaried: "Salaried",
  self_employed: "Self-Employed",
  business_owner: "Business Owner",
};

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [expertModal, setExpertModal] = useState<"cibil_fix" | "loan" | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<"home" | "chat">("home");

  // Supabase stores phone as "+91XXXXXXXXXX" or "91XXXXXXXXXX" — strip country code robustly
  const phone = (user?.phone ?? "")
    .replace(/^\+?91/, "")
    .replace(/\D/g, "")
    .slice(-10);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }
    if (!user) return;

    fetch("/api/users/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) setProfile(data.profile);
      })
      .catch(() => null)
      .finally(() => setProfileLoading(false));
  }, [user, loading, router]);

  if (loading || profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 size={32} className="animate-spin text-[#1e3a8a]" />
      </div>
    );
  }

  if (!user) return null;

  const profileFields = [
    profile?.full_name,
    profile?.employment_type,
    profile?.monthly_income,
    profile?.pincode,
  ];
  const profilePercent =
    Math.round(
      (profileFields.filter(Boolean).length / profileFields.length) * 100,
    ) || 0;
  const profileComplete = profilePercent === 100;

  return (
    <div className="min-h-screen bg-slate-50">
      {expertModal && (
        <ConsultationModal
          phone={phone}
          name={profile?.full_name ?? undefined}
          consultationType={expertModal}
          initialStep="schedule"
          onClose={() => setExpertModal(null)}
        />
      )}
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        {/* Welcome banner */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1e3a8a] to-[#1d4ed8] p-6 text-white">
          <p className="text-sm font-semibold text-blue-200">Welcome back</p>
          <h1 className="mt-1 text-2xl font-black">
            {profile?.full_name ?? `+91 ${phone}`}
          </h1>
          <p className="mt-1 text-sm text-blue-200">
            {profileComplete
              ? "Your profile is complete. You're ready to apply for loans."
              : "Complete your profile to unlock personalised loan offers."}
          </p>
          {/* Tab toggle */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${activeTab === "home" ? "bg-white text-[#1e3a8a]" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              <FileText size={12} /> Dashboard
            </button>
            <button
              onClick={() => setActiveTab("chat")}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all ${activeTab === "chat" ? "bg-white text-[#1e3a8a]" : "bg-white/10 text-white hover:bg-white/20"}`}
            >
              <MessageCircle size={12} /> Chat with Lumi
            </button>
          </div>
        </div>

        {/* Chat tab */}
        {activeTab === "chat" && (
          <DashboardChat name={profile?.full_name ?? undefined} phone={phone} />
        )}

        {/* Home tab content */}
        {activeTab === "home" && (
          <>
            {/* Profile completion card */}
            {!profileComplete && (
              <ProfileCompletion
                profile={profile}
                onSaved={(updated) =>
                  setProfile((p) => ({ ...p!, ...updated }))
                }
              />
            )}

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={TrendingUp}
                iconBg="bg-blue-50"
                iconColor="text-[#1e3a8a]"
                title="CIBIL Score"
                value="—"
                sub="Available in Phase 2"
                comingSoon
              />
              <StatCard
                icon={FileText}
                iconBg="bg-orange-50"
                iconColor="text-[#ea580c]"
                title="Applications"
                value="0"
                sub="No applications yet"
              />
              <StatCard
                icon={CreditCard}
                iconBg="bg-green-50"
                iconColor="text-green-600"
                title="CIBIL Fix"
                value="—"
                sub="Available in Phase 2"
                comingSoon
              />
            </div>

            {/* Quick actions */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-black text-[#0f172a]">Quick Actions</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {QUICK_ACTIONS.map((action) => (
                  <QuickAction key={action.label} {...action} />
                ))}
              </div>
            </div>

            {/* Expert consultation card */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0f2460] to-[#1e3a8a] p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <PhoneCall size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="font-black text-white">Talk to Our Experts</h2>
                  <p className="mt-0.5 text-sm text-blue-200">
                    Free 15-minute call — loan advice, CIBIL fix, or credit
                    repair. No commitment.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => setExpertModal("loan")}
                      className="rounded-xl bg-white px-4 py-2 text-xs font-black text-[#1e3a8a] transition-all hover:bg-blue-50"
                    >
                      Loan Expert Call
                    </button>
                    <button
                      onClick={() => setExpertModal("cibil_fix")}
                      className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-black text-white transition-all hover:bg-white/20"
                    >
                      CIBIL Fix Expert Call
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Account info */}
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <h2 className="mb-4 font-black text-[#0f172a]">
                Account Details
              </h2>
              <div className="space-y-3">
                <InfoRow label="Mobile" value={`+91 ${phone}`} verified />
                <InfoRow
                  label="Name"
                  value={profile?.full_name ?? "Not set"}
                  empty={!profile?.full_name}
                />
                <InfoRow
                  label="Employment"
                  value={
                    profile?.employment_type
                      ? (EMPLOYMENT_LABELS[profile.employment_type] ?? "—")
                      : "Not set"
                  }
                  empty={!profile?.employment_type}
                />
                <InfoRow
                  label="Monthly Income"
                  value={
                    profile?.monthly_income
                      ? `₹${profile.monthly_income.toLocaleString("en-IN")}`
                      : "Not set"
                  }
                  empty={!profile?.monthly_income}
                />
                <InfoRow
                  label="Pincode"
                  value={profile?.pincode ?? "Not set"}
                  empty={!profile?.pincode}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard Chat ───────────────────────────────────────────────────────────

function DashboardChat({ name, phone }: { name?: string; phone: string }) {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setMessages((p) => [...p, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          session_id: sessionId,
          user_context: { name, phone },
        }),
      });
      const data = await res.json().catch(() => ({}));
      const reply =
        res.ok && data.reply
          ? data.reply
          : "Sorry, I couldn't process that. Please try again.";
      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-5 py-4 bg-[#1e3a8a]">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-base">
          🤖
        </div>
        <div>
          <div className="text-sm font-black text-white">Lumi</div>
          <div className="text-xs text-blue-200">
            Your personal AI financial advisor
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto px-5 py-4 space-y-3 bg-[#f8fafc]">
        <div className="flex gap-2.5 items-start">
          <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-sm shrink-0">
            🤖
          </div>
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-slate-700 shadow-sm max-w-lg leading-relaxed">
            Hi{name ? ` ${name}` : ""}! I&apos;m Lumi, your personal LiquiFi
            advisor. I know your profile and can give you personalised guidance
            on loans, CIBIL, and tax filing. What would you like to know?
          </div>
        </div>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-sm shrink-0">
                🤖
              </div>
            )}
            <div
              className={`rounded-2xl px-4 py-3 text-sm max-w-lg leading-relaxed shadow-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-[#1e3a8a] text-white rounded-tr-sm" : "bg-white text-slate-700 rounded-tl-sm"}`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full bg-[#1e3a8a]/10 flex items-center justify-center text-sm shrink-0">
              🤖
            </div>
            <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <Loader2 size={14} className="animate-spin text-[#1e3a8a]" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-[#f8fafc] px-3 py-2 focus-within:border-[#1e3a8a] focus-within:ring-2 focus-within:ring-[#1e3a8a]/10 transition-all">
          <input
            type="text"
            placeholder="Ask about your loan eligibility, CIBIL, ITR…"
            className="flex-1 bg-transparent text-sm text-[#0f172a] placeholder-slate-400 outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            disabled={loading}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg bg-[#1e3a8a] flex items-center justify-center text-white transition-all hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  sub,
  comingSoon,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  title: string;
  value: string;
  sub: string;
  comingSoon?: boolean;
}) {
  return (
    <div className="relative rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      {comingSoon && (
        <span className="absolute right-4 top-4 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
          Soon
        </span>
      )}
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg}`}
      >
        <Icon size={20} className={iconColor} />
      </div>
      <p className="text-sm font-semibold text-slate-500">{title}</p>
      <p className="text-2xl font-black text-[#0f172a]">{value}</p>
      <p className="mt-0.5 text-xs text-slate-400">{sub}</p>
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    label: "Apply for Loan",
    desc: "Personal, Home, Business & more",
    icon: FileText,
    color: "text-[#1e3a8a]",
    bg: "bg-blue-50",
    disabled: true,
  },
  {
    label: "Check CIBIL Score",
    desc: "Free soft-pull — no score impact",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
    disabled: true,
  },
  {
    label: "CIBIL Fix Program",
    desc: "+120 points in 90 days guaranteed",
    icon: CreditCard,
    color: "text-[#ea580c]",
    bg: "bg-orange-50",
    disabled: false,
    href: "/cibil-fix",
  },
  {
    label: "Upload Documents",
    desc: "Aadhaar, PAN, Salary Slip & more",
    icon: User,
    color: "text-purple-600",
    bg: "bg-purple-50",
    disabled: true,
  },
];

function QuickAction({
  label,
  desc,
  icon: Icon,
  color,
  bg,
  disabled,
  href,
}: (typeof QUICK_ACTIONS)[number]) {
  const cls =
    "flex w-full items-center gap-4 rounded-xl border border-slate-100 p-4 text-left transition-colors hover:border-[#1e3a8a]/20 hover:bg-blue-50/30 disabled:cursor-not-allowed disabled:opacity-50";
  const inner = (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bg}`}
      >
        <Icon size={18} className={color} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-[#0f172a]">{label}</p>
        <p className="text-xs text-slate-500">{desc}</p>
      </div>
      <ArrowRight size={16} className="shrink-0 text-slate-300" />
    </>
  );
  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

function InfoRow({
  label,
  value,
  verified,
  empty,
}: {
  label: string;
  value: string;
  verified?: boolean;
  empty?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span
        className={`flex items-center gap-1.5 text-sm font-semibold ${empty ? "text-slate-300" : "text-[#0f172a]"}`}
      >
        {value}
        {verified && <CheckCircle size={13} className="text-green-500" />}
      </span>
    </div>
  );
}

// ─── Profile completion form ──────────────────────────────────────────────────

const EMPLOYMENT_OPTIONS = [
  { value: "salaried", label: "Salaried" },
  { value: "self_employed", label: "Self-Employed" },
  { value: "business_owner", label: "Business Owner" },
];

function ProfileCompletion({
  profile,
  onSaved,
}: {
  profile: UserProfile | null;
  onSaved: (updated: Partial<UserProfile>) => void;
}) {
  const [form, setForm] = useState({
    full_name: profile?.full_name ?? "",
    employment_type: profile?.employment_type ?? "",
    monthly_income: profile?.monthly_income?.toString() ?? "",
    pincode: profile?.pincode ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    const payload: Record<string, string | number> = {};
    if (form.full_name) payload.full_name = form.full_name;
    if (form.employment_type) payload.employment_type = form.employment_type;
    if (form.monthly_income)
      payload.monthly_income = Number(form.monthly_income);
    if (form.pincode) payload.pincode = form.pincode;

    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to save. Please try again.");
      return;
    }

    setSaved(true);
    onSaved({
      full_name: form.full_name || null,
      employment_type: form.employment_type || null,
      monthly_income: form.monthly_income ? Number(form.monthly_income) : null,
      pincode: form.pincode || null,
    });
  };

  if (saved) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 p-5">
        <CheckCircle size={20} className="text-green-600 shrink-0" />
        <p className="text-sm font-semibold text-green-700">
          Profile updated! You&apos;re now eligible for more loan offers.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50">
          <AlertCircle size={18} className="text-[#ea580c]" />
        </div>
        <div>
          <h2 className="font-black text-[#0f172a]">Complete Your Profile</h2>
          <p className="text-sm text-slate-500">
            Takes 30 seconds — unlocks personalised loan offers from 50+
            lenders.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            type="text"
            placeholder="As per PAN card"
            className="input-field"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Monthly Income (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 50000"
            className="input-field"
            value={form.monthly_income}
            onChange={(e) =>
              setForm({ ...form, monthly_income: e.target.value })
            }
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Employment Type
          </label>
          <div className="flex gap-2">
            {EMPLOYMENT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, employment_type: opt.value })}
                className={`flex-1 rounded-lg border-2 py-2 text-xs font-semibold transition-all ${
                  form.employment_type === opt.value
                    ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                    : "border-slate-200 text-slate-600 hover:border-[#1e3a8a]"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold text-slate-700">
            Pincode
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="6-digit pincode"
            className="input-field"
            value={form.pincode}
            onChange={(e) =>
              setForm({ ...form, pincode: e.target.value.replace(/\D/g, "") })
            }
          />
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving || !form.full_name}
        className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Saving…
          </>
        ) : (
          <>
            Save Profile <ArrowRight size={16} />
          </>
        )}
      </button>
    </div>
  );
}
