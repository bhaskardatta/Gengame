"use client";

import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/stores/gameStore";

const FILE_SYSTEM: any = {
    'home': {
        'user': {
            'documents': {
                'secret_project.txt': 'Project PhishNet: Classified',
                'notes.txt': 'Remember to check the emails thoroughly.'
            },
            'downloads': {},
            'desktop': {}
        }
    },
    'etc': {
        'passwd': 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash'
    }
};

export default function TerminalApp() {
    const [history, setHistory] = useState([
        "PhishOS v1.0.0 [Secure Boot]",
        "(c) 2024 PhishNet Corp. All rights reserved.",
        "",
        "Type 'help' for a list of commands."
    ]);
    const [input, setInput] = useState("");
    const [pwd, setPwd] = useState(['home', 'user']); // Current Path
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const updateElo = useGameStore(s => s.updateElo);

    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const getDir = (path: string[]) => {
        let current = FILE_SYSTEM;
        for (const segment of path) {
            if (current[segment]) {
                current = current[segment];
            } else {
                return null;
            }
        }
        return current;
    };

    const handleCommand = (cmd: string) => {
        const parts = cmd.trim().split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        let response = "";

        switch (command) {
            case "help":
                response =
                    `Available commands:
  help     - Show this list
  clear    - Clear terminal
  ls       - List directory contents
  cat      - Read file contents
  pwd      - Print working directory
  whoami   - Print current user
  date     - Print system date
  scan     - Run network security scan`;
                break;
            case "clear":
                setHistory([]);
                return;
            case "date":
                response = new Date().toString();
                break;
            case "whoami":
                response = "employee_427";
                break;
            case "pwd":
                response = "/" + pwd.join("/");
                break;
            case "ls":
                const dir = getDir(pwd);
                if (dir && typeof dir === 'object') {
                    // Distinguish files from dirs
                    const items = Object.keys(dir).map(key => {
                        const isDir = typeof dir[key] === 'object';
                        return isDir ? `\x1b[1;34m${key}/\x1b[0m` : key;
                    });
                    response = items.join("  ");
                } else {
                    response = "Error: Invalid directory";
                }
                break;
            case "cat":
                if (args.length === 0) {
                    response = "Usage: cat <filename>";
                } else {
                    const dir = getDir(pwd);
                    const filename = args[0];
                    if (dir && dir[filename]) {
                        if (typeof dir[filename] === 'string') {
                            response = dir[filename];
                        } else {
                            response = `cat: ${filename}: Is a directory`;
                        }
                    } else {
                        response = `cat: ${filename}: No such file or directory`;
                    }
                }
                break;
            case "scan":
                // Easter egg feature
                setHistory(prev => [...prev, `user@phishnet:/${pwd.join('/')}$ ${cmd}`, "Starting network scan...", "Scanning ports...", "Analyzing packets..."]);
                setTimeout(() => {
                    setHistory(prev => [...prev, "Scan Complete: No active threats detected on local interface."]);
                }, 1500);
                return; // Async handled above
            default:
                if (command !== "") response = `command not found: ${command}`;
        }

        setHistory(prev => [...prev, `user@phishnet:/${pwd.join('/')}$ ${cmd}`, ...(response ? [response] : [])]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput("");
        }
    };

    return (
        <div
            className="h-full bg-[#1e1e1e] p-3 font-mono text-sm text-[#d4d4d4] overflow-y-auto selection:bg-[#264f78]"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap leading-tight mb-0.5">{line}</div>
            ))}

            <div className="flex mt-1">
                <span className="text-green-500 font-bold mr-2">user@phishnet</span>
                <span className="text-white mr-2">:</span>
                <span className="text-blue-400 font-bold mr-2">/{pwd.join('/')}</span>
                <span className="text-white mr-2">$</span>
                <input
                    ref={inputRef}
                    className="flex-1 bg-transparent border-none outline-none text-[#d4d4d4]"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    spellCheck={false}
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
}
