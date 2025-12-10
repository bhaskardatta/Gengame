"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 text-white p-8 border-4 border-red-900/50">
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                        <AlertTriangle size={48} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-red-400 mb-2">System Critical Error</h2>
                    <p className="text-zinc-400 text-center max-w-md mb-4">
                        The Virtual OS encountered a fatal exception.
                    </p>
                    <div className="bg-black/50 p-4 rounded text-xs font-mono text-red-300 w-full max-w-lg overflow-auto">
                        {this.state.error?.toString()}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
