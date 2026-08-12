import React from "react";
import { UserState } from "../types";
import { Activity, Target, ShieldCheck, Zap, Mail } from "lucide-react";
import { getUserFromDb } from "../lib/firebase";
import { useState, useEffect } from "react";

interface DashboardProps {
  user: UserState;
}

export function Dashboard({ user }: DashboardProps) {
  // Try to load scores from local storage if available
  const savedScoreStr = localStorage.getItem(
    `zambuild_score_${user.digitalId}`,
  );

  const [score, setScore] = useState(
    savedScoreStr ? parseInt(savedScoreStr, 10) : 0,
  );

  useEffect(() => {
    const fetchScore = async () => {
      const dbUser = await getUserFromDb(user.digitalId);
      if (dbUser && dbUser.score !== undefined) {
        setScore(dbUser.score);
        localStorage.setItem(
          `zambuild_score_${user.digitalId}`,
          dbUser.score.toString(),
        );
      }
    };
    fetchScore();
  }, [user.digitalId]);

  const stats = [
    {
      label: "Gateway Registration",
      value: "Email Verified",
      icon: Mail,
    },
    {
      label: "Raw Code Mastery",
      value: score > 0 ? `${score}%` : "Pending",
      icon: Activity,
    },
    { label: "AI Utilization", value: "Optimized", icon: Zap },
    { label: "Security Level", value: "Encrypted", icon: ShieldCheck },
    {
      label: "Network Standing",
      value: score > 80 ? "Architect" : score > 40 ? "Weaver" : "Initiate",
      icon: Target,
    },
  ];

  return (
    <div className="h-full overflow-y-auto p-8 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-white/10 pb-8">
          <h2 className="text-3xl font-serif text-white italic tracking-widest uppercase mb-4">
            Command Center
          </h2>
          <p className="text-white/60">
            Welcome back,{" "}
            <span className="text-[#C67B58]">@{user.digitalId}</span>. This is
            your personal dashboard for tracking cognitive progression and
            architectural milestones.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/[0.02] border border-white/10 p-6 flex flex-col gap-4 hover:border-[#C67B58]/50 transition-colors"
            >
              <stat.icon className="w-8 h-8 text-[#C67B58]" />
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-mono text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-[#C67B58]/5 border border-[#C67B58]/30 p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#C67B58]/10 text-[#C67B58]">
              <Target size={24} />
            </div>
            <div>
              <h3 className="text-xl font-serif text-[#C67B58] italic mb-2">
                System Definition & Mission
              </h3>
              <p className="text-white/70 text-sm leading-relaxed mb-4">
                <strong>ZamBuild AI</strong> is designed pragmatically for the
                Zambian developer ecosystem. We recognize the realities of local
                infrastructure: this platform is lightweight, mobile-responsive,
                and engineered for low-bandwidth environments. We are not just
                an assessment tool; we are a bridge. Our goal is to cut through
                the noise and connect you directly to real-world local hubs,
                jobs, and developer networks across Zambia.
              </p>
              <div className="flex gap-4">
                <span className="text-[10px] uppercase tracking-widest text-[#C67B58] border border-[#C67B58]/30 px-2 py-1">
                  👍 Pragmatic
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C67B58] border border-[#C67B58]/30 px-2 py-1">
                  ⚡ Low-Bandwidth
                </span>
                <span className="text-[10px] uppercase tracking-widest text-[#C67B58] border border-[#C67B58]/30 px-2 py-1">
                  🔗 Community Bridge
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white/[0.02] border border-white/10 p-8">
          <h3 className="text-xl font-serif text-white italic mb-6">
            Recent Activity Logs
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border border-white/5 bg-black/20">
              <div className="w-2 h-2 rounded-full bg-[#C67B58] mt-1.5 shrink-0" />
              <div>
                <p className="text-sm text-white mb-1">
                  Initialized developer profile
                </p>
                <p className="text-xs text-white/40 font-mono">
                  Timestamp: {new Date(user.startTime).toISOString()}
                </p>
              </div>
            </div>
            {score > 0 && (
              <div className="flex items-start gap-4 p-4 border border-white/5 bg-black/20">
                <div className="w-2 h-2 rounded-full bg-[#C67B58] mt-1.5 shrink-0" />
                <div>
                  <p className="text-sm text-white mb-1">
                    Completed Raw Intelligence Assessment
                  </p>
                  <p className="text-xs text-[#C67B58] uppercase tracking-widest mt-2">
                    Score: {score}/101
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
