import React from "react";
import { Users, Globe2, Code, ArrowUpRight } from "lucide-react";

export function Portal() {
  return (
    <div className="h-full overflow-y-auto p-8 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-white/10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C67B58]/10 text-[#C67B58] rounded-full mb-6">
            <Globe2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif text-white italic tracking-widest uppercase mb-4">
            Zambian Programmers Portal
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto leading-relaxed">
            Connect with the core network of Zambian developers. This portal
            bridges our local efforts with global initiatives. Align your code,
            share intelligence, and build sovereign systems together.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Users className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                AI Developers Network
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Join the collective of engineers focusing on LLMs, intelligent
                agents, and automated system architecture.
              </p>
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(
                  "External route to AI Developers Group will be implemented here.",
                );
              }}
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black bg-[#C67B58] hover:bg-[#D98A66] px-6 py-3 transition-colors"
            >
              Connect to Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Code className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                Raw Code Programmers
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Connect with the traditional software crafters building the
                bedrock infrastructure and foundational systems.
              </p>
            </div>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert(
                  "External route to Raw Code Programmers Group will be implemented here.",
                );
              }}
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Connect to Hub
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <section className="bg-black/40 border border-white/5 p-8 text-center mt-12">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-2">
            Network Status
          </p>
          <p className="text-[#C67B58] font-mono">
            Secure Connection Established • Local Systems Active
          </p>
        </section>
      </div>
    </div>
  );
}
