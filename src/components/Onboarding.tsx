import React, { useState } from "react";
import { UserState } from "../types";
import {
  Terminal,
  Shield,
  ArrowRight,
  Mail,
  Phone,
  KeyRound,
} from "lucide-react";

interface OnboardingProps {
  onComplete: (user: UserState) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState<"details" | "verify">("details");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim() || !phone.trim() || !email.trim()) return;

    // Local naive check before sending
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!/^(?:\+260|0)(95|96|97|76|77)\d{7}$/.test(cleanPhone)) {
      setError("Only Zambian phone numbers are permitted (+260 or 09X/07X).");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send code.");

      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
      }
      setStep("verify");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || code.length !== 4) {
      setError("Please enter a valid 4-digit code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, nickname }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify code.");

      onComplete({
        nickname: data.nickname || nickname,
        digitalId: data.digitalId,
        language: "English",
        startTime: Date.now(),
        email: data.email,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 text-[#E0E0E0] font-sans">
      <div className="w-full max-w-md bg-white/[0.02] border border-white/10 p-10 shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <div className="w-12 h-12 bg-[#C67B58] flex items-center justify-center font-serif text-2xl font-bold text-black">
            M
          </div>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif text-white uppercase tracking-widest italic mb-2">
            ZamBuild AI
          </h1>
          <p className="text-white/50 text-sm uppercase tracking-wider">
            System Gateway Authentication
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#FF4444]/10 border border-[#FF4444]/30 text-[#FF4444] text-xs text-center">
            {error}
          </div>
        )}

        {step === "details" ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
                Developer Nickname
              </label>
              <div className="relative">
                <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. CodeSmith"
                  className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-white placeholder-white/20 focus:outline-none focus:border-[#C67B58] transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
                Zambian Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="097XXXXXXX"
                  className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-white placeholder-white/20 focus:outline-none focus:border-[#C67B58] transition-colors"
                  required
                />
              </div>
              <p className="text-[10px] text-white/30 italic">
                Only valid +260 or 09X/07X prefixes are accepted.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
                Receiving Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="developer@example.com"
                  className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-white placeholder-white/20 focus:outline-none focus:border-[#C67B58] transition-colors"
                  required
                />
              </div>
              <p className="text-[10px] text-white/30 italic">
                A 4-digit verification code will be sent here.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 flex items-center justify-center gap-3 p-4 border border-[#C67B58] text-[#C67B58] hover:bg-[#C67B58] hover:text-black transition-colors uppercase tracking-widest text-xs font-bold disabled:opacity-50"
            >
              {loading ? "Initializing..." : "Request Access Code"}
              <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="p-4 bg-white/5 border border-white/10 text-center mb-6">
              <p className="text-sm text-white/70 mb-2">
                Authentication code dispatched to:
              </p>
              <p className="text-[#C67B58] font-mono">{email}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-[#C67B58]">
                4-Digit Gateway Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="0000"
                  className="w-full bg-black/50 border border-white/10 p-3 pl-10 text-white placeholder-white/20 focus:outline-none focus:border-[#C67B58] transition-colors text-center text-xl tracking-[0.5em]"
                  required
                />
              </div>
            </div>

            {previewUrl && (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs text-[#C67B58] underline mt-2"
              >
                (Dev Mode: Click to view email code)
              </a>
            )}

            <button
              type="submit"
              disabled={loading || code.length !== 4}
              className="w-full mt-8 flex items-center justify-center gap-3 p-4 bg-[#C67B58] text-black hover:bg-[#D98A66] transition-colors uppercase tracking-widest text-xs font-bold disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm & Enter Network"}
              <Shield size={16} />
            </button>
            <button
              type="button"
              onClick={() => setStep("details")}
              className="w-full flex items-center justify-center p-2 text-white/40 hover:text-white transition-colors text-[10px] uppercase tracking-widest"
            >
              Modify Details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
