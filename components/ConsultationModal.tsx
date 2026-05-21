"use client";

import { useState } from "react";
import {
  X,
  Phone,
  Clock,
  CheckCircle,
  Loader2,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { OTPModal } from "@/components/OTPModal";

type ConsultationType = "cibil_fix" | "loan";

interface ConsultationModalProps {
  /** Pre-filled phone — user won't need to re-enter if already collected */
  phone: string;
  name?: string;
  consultationType: ConsultationType;
  loanType?: string;
  cibilScore?: number;
  onClose: () => void;
}

const TIME_SLOTS = [
  { id: "asap", label: "As soon as possible", icon: "⚡" },
  { id: "morning", label: "Morning (9 AM – 1 PM)", icon: "🌅" },
  { id: "afternoon", label: "Afternoon (1 PM – 5 PM)", icon: "☀️" },
  { id: "evening", label: "Evening (5 PM – 8 PM)", icon: "🌆" },
] as const;

type Step = "otp" | "schedule" | "success";

export function ConsultationModal({
  phone,
  name: initialName,
  consultationType,
  loanType,
  cibilScore,
  onClose,
}: ConsultationModalProps) {
  const [step, setStep] = useState<Step>("otp");
  const [name, setName] = useState(initialName ?? "");
  const [timePreference, setTimePreference] = useState<string>("asap");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [callbackBy, setCallbackBy] = useState<string | null>(null);

  async function handleSchedule() {
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/consultations/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name: name || undefined,
          consultation_type: consultationType,
          loan_type: loanType,
          cibil_score: cibilScore,
          time_preference: timePreference,
          notes: notes || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed to schedule. Please try again.");
        return;
      }

      setCallbackBy(data.callback_by);
      setStep("success");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    consultationType === "cibil_fix"
      ? "Schedule CIBIL Expert Call"
      : "Schedule Loan Expert Call";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 className="text-base font-black text-[#0f172a]">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* OTP step — verify phone before scheduling */}
        {step === "otp" && (
          <div className="p-0">
            <OTPModal
              phone={phone}
              name={name || undefined}
              loanType={loanType}
              onClose={onClose}
              onSuccess={() => setStep("schedule")}
            />
          </div>
        )}

        {/* Schedule step */}
        {step === "schedule" && (
          <div className="p-6 space-y-5">
            <p className="text-sm text-slate-500">
              Our expert will call{" "}
              <span className="font-bold text-[#0f172a]">+91 {phone}</span>{" "}
              within <span className="font-bold text-[#1e3a8a]">6 hours</span>.
            </p>

            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Full name"
                className="input-field"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Time preference */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Preferred Call Time
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setTimePreference(slot.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-xs font-semibold transition-all ${
                      timePreference === slot.id
                        ? "border-[#1e3a8a] bg-blue-50 text-[#1e3a8a]"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    <span>{slot.icon}</span>
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Anything specific to discuss?{" "}
                <span className="font-normal text-slate-400">(optional)</span>
              </label>
              <textarea
                rows={2}
                placeholder="e.g. My score dropped after a credit card default..."
                className="input-field resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              onClick={handleSchedule}
              disabled={submitting}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Scheduling…
                </>
              ) : (
                <>
                  <Calendar size={16} /> Confirm Expert Call
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-400">
              Free consultation · No commitment required
            </p>
          </div>
        )}

        {/* Success step */}
        {step === "success" && (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={28} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-black text-[#0f172a] text-lg">
                Call Scheduled!
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                Our expert will call{" "}
                <strong className="text-[#0f172a]">+91 {phone}</strong>
              </p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm text-[#1e3a8a] font-semibold">
                <Clock size={14} />
                Expected call by{" "}
                {callbackBy
                  ? new Date(callbackBy).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "within 6 hours"}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Phone size={12} />
                Keep your phone nearby — it may show as an unknown number
              </div>
            </div>

            {consultationType === "cibil_fix" && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 text-xs text-orange-800">
                <strong>After the call:</strong> If you&apos;d like to proceed,
                our expert will share a link to get your{" "}
                <strong>Full CIBIL Report + Fix Plan for ₹699</strong>.
              </div>
            )}

            <button onClick={onClose} className="btn-secondary w-full">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
