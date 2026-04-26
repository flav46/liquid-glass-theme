import { useState, useRef, useEffect } from "react";
import Window from "./Window";

interface TerminalHistory {
  command: string;
  output: string;
  type: "input" | "output";
}

function Terminal({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<TerminalHistory[]>([
    { command: "welcome", output: "Liquid Glass OS Terminal v1.0.0\nType 'help' for available commands.", type: "output" },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const commands: Record<string, (args: string[]) => string> = {
    help: () => "Available commands:\n  help     - Show this message\n  clear    - Clear terminal\n  date     - Show current date\n  time     - Show current time\n  whoami   - Current user\n  hostname- Show hostname\n  echo    - Print text\n  ls      - List files\n  pwd     - Print working directory\n  uname    - System info\n  neofetch- System information\n  calc    - Calculator\ne.g., echo Hello World",
    clear: () => { setHistory([]); return ""; },
    date: () => new Date().toDateString(),
    time: () => new Date().toLocaleTimeString(),
    whoami: () => "liquid-user",
    hostname: () => "liquid-glass",
    echo: (args) => args.join(" "),
    ls: () => "Documents  Downloads  Pictures  Music  Videos  Desktop",
    pwd: () => "/home/liquid-user",
    uname: () => "Liquid Glass OS 1.0.0 x86_64",
    neofetch: () => `                    ▀████████▀                    ████████    
                ▄██████████▄                ██     ██   
               ███▀    ▀████               ██       ██  
                  ▀█▄▄▄█▀                  ██       ██  
       ████         ██         ████     ██       ██  
     ████           ██           ████   ██       ██   
    ██              ██              ██  ████████    
    ██              ██              ██  ████████     
     ████           ██           ████   ██       
       ████         ██         ████     ██       
                  ▄█▄▄█▄                  ██       
               ███▀    ▀████               ██       
                ▀██████████▀                ██       
                    ▀████▀                    ████████\n\nOS: Liquid Glass OS 1.0.0\nKernel: Liquid 1.0\nShell: glass-sh 1.0.0\nResolution: 2560x1600\nDE: Liquid Desktop\nCPU: Apple Silicon\nRAM: 16GB`,
    calc: (args) => {
      try {
        const expr = args.join("");
        if (!expr) return "Usage: calc <expression>\ne.g., calc 2+2*3";
        const result = Function(`return ${expr}`)();
        return `${expr} = ${result}`;
      } catch {
        return "Error: Invalid expression";
      }
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const [cmd, ...args] = trimmed.split(" ");
    const output = commands[cmd]?.(args) ?? `Command not found: ${cmd}\nType 'help' for available commands.`;

    setHistory([...history, { command: trimmed, output, type: "input" }]);
    setInput("");
  };

  return (
    <Window
      title="Terminal"
      icon="⬛"
      isActive={isActive ?? true}
      defaultSize={{ width: 640, height: 420 }}
      minSize={{ width: 400, height: 300 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="terminal-app" onClick={() => inputRef.current?.focus()}>
        <div className="terminal-output">
          {history.map((item, idx) => (
            <div key={idx} className={`terminal-line terminal-${item.type}`}>
              {item.type === "input" && <span className="terminal-prompt">$ </span>}
              {item.type === "input" ? item.command : item.output}
            </div>
          ))}
          <div ref={historyEndRef} />
        </div>
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="terminal-prompt">$ </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="terminal-input"
            autoFocus
          />
        </form>
      </div>
    </Window>
  );
}

export default Terminal;