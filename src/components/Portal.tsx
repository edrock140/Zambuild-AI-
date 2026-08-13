import React, { useEffect, useState } from "react";
import { Users, Globe2, Code, ArrowUpRight, Cpu, TerminalSquare, Binary, Building2, Newspaper, Code2, Network } from "lucide-react";

export function Portal() {
  const [members, setMembers] = useState<{nickname: string, role: string, faction?: string}[]>([]);

  useEffect(() => {
    fetch("/api/users/directory")
      .then(res => res.json())
      .then(data => {
        if (data.members) {
          setMembers(data.members);
        }
      })
      .catch(err => console.error("Failed to load network directory", err));
  }, []);

  return (
    <div className="h-full overflow-y-auto p-8 lg:p-16">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="border-b border-white/10 pb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C67B58]/10 text-[#C67B58] rounded-full mb-6">
            <Globe2 className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-serif text-white italic tracking-widest uppercase mb-4">
            Zambian Tech Ecosystem
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
                Join the collective of engineers focusing on LLMs, intelligent agents, and automated system architecture.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("External route to AI Developers Group will be implemented here.");
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
                Connect with the traditional software crafters building the bedrock infrastructure and foundational systems.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("External route to Raw Code Programmers Group will be implemented here.");
              }}
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Connect to Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Cpu className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                BongoHive
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Zambia's first technology and innovation hub. Great for startups, networking, and incubating new tech ventures in Lusaka.
              </p>
            </div>
            <a
              href="https://bongohive.co.zm/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-black bg-[#C67B58] hover:bg-[#D98A66] px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Code className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                GDG Lusaka
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Google Developer Groups. Deepen your technical skills, learn about Google technologies, and meet local software engineers.
              </p>
            </div>
            <a
              href="https://gdg.community.dev/gdg-lusaka/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Users className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                Asikana Network
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                An organization empowering women in technology in Zambia. Join to support and connect with female developers and leaders.
              </p>
            </div>
            <a
              href="https://asikananetwork.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <TerminalSquare className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                ZamBuild AI Core
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                The foundational intelligence layer for Zambian system builders. Access raw code, AI agents, and sovereign architecture docs.
              </p>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Core System is under development and restricted to Operators.");
              }}
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Under Development
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Binary className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                Hackers Guild
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Zambia's premier coding bootcamp and developer community. Access training, intensive bootcamps, and a network of active coders.
              </p>
            </div>
            <a
              href="https://hackersguild.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Building2 className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                Jacaranda Hub
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                An ecosystem builder providing support to startups and entrepreneurs through technology and innovation spaces across Zambia.
              </p>
            </div>
            <a
              href="https://jacarandahub.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Newspaper className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                TechTrends Zambia
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                Stay updated with the latest technological news, product reviews, and insights into the rapidly growing Zambian tech ecosystem.
              </p>
            </div>
            <a
              href="https://techtrends.co.zm/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>

          <div className="bg-white/[0.02] border border-white/10 p-8 flex flex-col items-start gap-6 hover:border-[#C67B58] transition-colors group">
            <Code2 className="w-10 h-10 text-[#C67B58]" />
            <div>
              <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#C67B58] transition-colors">
                Python Zambia
              </h3>
              <p className="text-sm text-white/50 leading-relaxed mb-6">
                The community of Python developers in Zambia. Connect with data scientists, backend engineers, and AI enthusiasts.
              </p>
            </div>
            <a
              href="https://zm.pycon.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-auto inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#C67B58] border border-[#C67B58] hover:bg-[#C67B58] hover:text-black px-6 py-3 transition-colors"
            >
              Access Hub
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>

        <section className="bg-black/40 border border-white/5 p-8 text-center mt-12">
          <p className="text-sm text-white/40 uppercase tracking-widest mb-2">
            Network Status
          </p>
          <p className="text-[#C67B58] font-mono mb-8">
            Secure Connection Established • Local Systems Active
          </p>
          
          <div className="border-t border-white/10 pt-8 mt-8">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Network className="w-5 h-5 text-[#C67B58]" />
              <h3 className="text-xl font-serif text-white uppercase tracking-widest">Active Directory</h3>
            </div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-6">Showing Registered System Identities Only</p>
            
            <div className="flex flex-col gap-8 max-w-4xl mx-auto text-left">
              {members.length > 0 ? (
                <>
                  <div>
                    <h4 className="text-sm text-white/60 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">AI Developers Network</h4>
                    <div className="flex flex-wrap gap-3">
                      {members.filter(m => m.faction === 'AI Developers Network').map((member, i) => (
                        <div key={i} className={`px-4 py-2 text-sm uppercase tracking-widest border flex items-center gap-2 ${member.role === 'operator' ? 'border-[#C67B58] text-[#C67B58] bg-[#C67B58]/10' : 'border-white/10 text-white/60 bg-white/5'}`}>
                          {member.nickname}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm text-white/60 uppercase tracking-widest border-b border-white/10 pb-2 mb-4">Raw Code Programmers</h4>
                    <div className="flex flex-wrap gap-3">
                      {members.filter(m => m.faction === 'Raw Code Programmers').map((member, i) => (
                        <div key={i} className={`px-4 py-2 text-sm uppercase tracking-widest border flex items-center gap-2 ${member.role === 'operator' ? 'border-[#C67B58] text-[#C67B58] bg-[#C67B58]/10' : 'border-white/10 text-white/60 bg-white/5'}`}>
                          {member.nickname}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-white/40 text-sm text-center">Scanning for active nodes...</div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
