import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const terminalContent = [
  "user@pierre-sikati:~$ sudo nmap -sV target_network",
  "[+] Scanning 192.168.1.0/24...",
  "[+] Active Host: 192.168.1.15 [LINUX]",
  "[+] Ports: 22/tcp OPEN, 80/tcp OPEN, 443/tcp OPEN",
  "user@pierre-sikati:~$ burpsuite --run-scanner",
  "[*] Intercepting HTTP traffic...",
  "[!] XSS Vulnerability detected in /contact-form",
  "user@pierre-sikati:~$ kali-linux --status",
  "[*] OSCP Training: 85% Complete",
  "[*] Kali Linux Tools: Active & Updated",
  "user@pierre-sikati:~$ whoami",
  "SIKATI PIERRE: Fullstack Developer & Cyber-Sec Specialist",
  "user@pierre-sikati:~$ _",
];

const CyberTerminal = () => {
  const [lines, setLines] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let currentLine = 0;
      const interval = setInterval(() => {
        if (currentLine < terminalContent.length) {
          setLines((prev) => [...prev, terminalContent[currentLine]]);
          currentLine++;
        } else {
          clearInterval(interval);
        }
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden shadow-2xl font-mono text-xs sm:text-sm"
    >
      {/* Terminal Header */}
      <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
        </div>
        <div className="text-white/40 text-[10px] ml-4 uppercase tracking-widest font-black">bash — 80x24</div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 h-64 overflow-y-auto custom-scrollbar">
        {lines.map((line, idx) => {
          if (!line) return null;
          const isUser = line.startsWith("user@");
          const isWarning = line.startsWith("[!]");
          return (
            <div key={idx} className="mb-1.5">
              <span className={`${isUser ? "text-emerald-400" : isWarning ? "text-red-400" : "text-blue-400"} mr-2`}>
                {isUser ? "❯" : "•"}
              </span>
              <span className="text-gray-300">{line}</span>
            </div>
          );
        })}
        {isInView && (
          <motion.div
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-emerald-400 ml-1"
          />
        )}
      </div>
    </motion.div>
  );
};

export default CyberTerminal;
