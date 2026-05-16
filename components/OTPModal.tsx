"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Loader2, X } from "lucide-react";

interface OTPModalProps {
  phone: string;
  name?: string;
  loanType?: string;
  onVerified: () => void;
  onClose: () => void;
}

type Stage = "sending" | "ready" | "verifying" | "error";

export function OTPModal({
  phone,
  name,
  loanType,
  onVerified,
  onClose,
}: OTPModalProps) {
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<Stage>("sending");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const sendOTP = async () => {
    setStage("sending");
    setError("");

    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Failed to send OTP");
      setStage("error");
      return;
    }

    setStage("ready");
    // 30-second cooldown before allowing resend
    setCooldown(30);
  };

  useEffect(() => {
    sendOTP();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const verifyOTP = async () => {
    setStage("verifying");
    setError("");

    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, token: otp, name, loan_type: loanType }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Invalid OTP");
      setStage("ready");
      return;
    }

    onVerified();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-black text-[#0f172a]">
            Verify Your Number
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-600">
          We sent a 6-digit OTP to{" "}
          <span className="font-bold text-[#1e3a8a]">+91 {phone}</span>
        </p>

        {stage === "sending" && (
          <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
            <Loader2 size={16} className="animate-spin" />
            Sending OTP…
          </div>
        )}

        {stage === "error" && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
            <button
              onClick={sendOTP}
              className="block mt-1 font-semibold underline"
            >
              Try again
            </button>
          </div>
        )}

        {(stage === "ready" || stage === "verifying") && (
          <>
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-1.5">
                Enter 6-digit OTP
              </label>
              <input
                type="tel"
                maxLength={6}
                placeholder="• • • • • •"
                className="input-field text-center text-2xl tracking-[0.4em] font-bold"
                value={otp}
                autoFocus
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && otp.length === 6 && verifyOTP()
                }
              />
            </div>

            {error && <p className="text-sm text-red-600 -mt-2">{error}</p>}

            <button
              onClick={verifyOTP}
              disabled={otp.length < 6 || stage === "verifying"}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {stage === "verifying" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Verifying…
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Verify &amp; Continue
                </>
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Didn&apos;t receive it?{" "}
              {cooldown > 0 ? (
                <span className="text-slate-400">Resend in {cooldown}s</span>
              ) : (
                <button
                  onClick={sendOTP}
                  className="font-semibold text-[#1e3a8a] underline"
                >
                  Resend OTP
                </button>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
