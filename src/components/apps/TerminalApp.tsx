"use client";

import { useEffect, useRef, useState } from "react";

export default function TerminalApp() {
    const [history, setHistory] = useState([
        "PhishOS v1.0.0 [Secure Boot]",
        "(c) 2024 PhishNet Corp. All rights reserved.",
        "",
        "Type 'help' for a list of commands."
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }, [history]);

    const handleCommand = (cmd: string) => {
        let response = "";
        const command = cmd.trim().toLowerCase();

        switch (command) {
            case "help":
                response = "Available commands: help, clear, date, whoami, ls";
                break;
            case "clear":
                setHistory([]);
                return;
            case "date":
                response = new Date().toString();
                break;
            case "whoami":
                response = "root (just kidding, you are employee_427)";
                break;
            case "ls":
                response = "Documents  Downloads  Desktop  secrets.txt";
                break;
            default:
                if (command !== "") response = `command not found: ${command}`;
        }

        setHistory(prev => [...prev, `user@phishnet:~$ ${cmd}`, ...(response ? [response] : [])]);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
            setInput("");
        }
    };

    return (
        <div
            className="h-full bg-black p-3 font-mono text-sm text-green-500 overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap">{line}</div>
            ))}

            <div className="flex mt-1">
                <span className="text-blue-400 mr-2">user@phishnet:~$</span>
                <input
                    ref={inputRef}
                    className="flex-1 bg-transparent border-none outline-none text-green-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
            </div>
            <div ref={bottomRef} />
        </div>
    );
}
