"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { LineProfile } from "@/lib/types";

declare global {
  interface Window {
    liff: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: () => void;
      getProfile: () => Promise<{
        userId: string;
        displayName: string;
        pictureUrl?: string;
        statusMessage?: string;
      }>;
      closeWindow: () => void;
      isInClient: () => boolean;
    };
  }
}

interface LiffContextType {
  profile: LineProfile | null;
  isLoading: boolean;
  error: string | null;
  isInClient: boolean;
}

const LiffContext = createContext<LiffContextType>({
  profile: null,
  isLoading: true,
  error: null,
  isInClient: false,
});

export function useLiff() {
  return useContext(LiffContext);
}

interface LiffProviderProps {
  liffId: string;
  children: React.ReactNode;
}

export function LiffProvider({ liffId, children }: LiffProviderProps) {
  const [profile, setProfile] = useState<LineProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInClient, setIsInClient] = useState(false);

  useEffect(() => {
    if (!liffId) {
      setError("LIFF ID ไม่ได้ตั้งค่า");
      setIsLoading(false);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://static.line-scdn.net/liff/edge/versions/2.22.3/sdk.js";
    script.onload = async () => {
      try {
        await window.liff.init({ liffId });
        setIsInClient(window.liff.isInClient());

        if (!window.liff.isLoggedIn()) {
          window.liff.login();
          return;
        }

        const p = await window.liff.getProfile();
        setProfile(p);
      } catch (err) {
        console.error("LIFF init error:", err);
        setError("ไม่สามารถเชื่อมต่อ LINE ได้");
      } finally {
        setIsLoading(false);
      }
    };
    script.onerror = () => {
      setError("ไม่สามารถโหลด LINE SDK ได้");
      setIsLoading(false);
    };
    document.head.appendChild(script);
  }, [liffId]);

  return (
    <LiffContext.Provider value={{ profile, isLoading, error, isInClient }}>
      {children}
    </LiffContext.Provider>
  );
}
