"use client";

import React from 'react';
import { useRealtimeState } from '@/lib/RealtimeStateContext';

const RealtimeHandler = () => {
    const { connected, stopCall, startCall, toggleLive, isLive} = useRealtimeState();

    return (
        <div className="w-fit h-fit flex items-center gap-[8px]">
            {/* BUTTON 1 — CONNECT/DISCONNECT */}
            <button
                onClick={() => {
                    if (connected) {
                        stopCall();
                    } else {
                        startCall().catch((err) => {
                            console.error("Unable to start call", err);
                        });
                    }
                }}
                className={`w-[32px] h-[32px] rounded-full flex items-center justify-center duration-150 transition-all ${connected
                    ? "bg-inf2 hover:bg-ine5 text-in1212"
                    : "text-infa bg-in2b hover:bg-in39 active:bg-in39"
                    }`}
            >
                {reportsIcon}
            </button>

            {/* BUTTON 2 — TRIGGER AI RESPONSE */}
            <button
                onClick={toggleLive}
                disabled={!connected}
                className={`w-[32px] h-[32px] rounded-full flex items-center justify-center duration-150 transition-all ${isLive
                    ? "bg-inf2 hover:bg-ine5 text-in1212"
                    : "text-infa bg-in2b hover:bg-in39 active:bg-in39"
                    }`}
            >
                {callIcon}
            </button>
        </div>
    )
};

export default RealtimeHandler;

// icons
const reportsIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M5 6H2V12H5V6ZM9.5 1H6.5V12H9.5V1ZM14 4H11V12H14V4ZM2 13.5V15H14V13.5H2Z"></path></svg>

const callIcon = <svg fill='currentColor' width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M4.77 11.23C6.63 13.09 8.93001 14.25 11.33 14.71C11.99 14.84 12.67 14.63 13.15 14.16L14.56 12.75C14.83 12.48 14.83 12.03 14.56 11.76L12.01 9.21001C11.74 8.94001 11.29 8.94001 11.02 9.21001L9.73001 10.5C9.51001 10.72 9.17 10.78 8.89 10.62C8.17 10.21 7.5 9.71001 6.88 9.10001C6.26 8.49001 5.77 7.81 5.36 7.09C5.21 6.82 5.26001 6.47 5.48001 6.25L6.77 4.96C7.04 4.69 7.04 4.24 6.77 3.97L4.22001 1.42C3.95001 1.15 3.50001 1.15 3.23001 1.42L1.82 2.83C1.34 3.31 1.14 3.99 1.27 4.65C1.73 7.05 2.89 9.35001 4.75 11.21L4.77 11.23Z"></path></svg>
// icons