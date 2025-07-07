import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface UidContextValue {
  uid: string | null;
}

const UidContext = createContext<UidContextValue>({ uid: null });

/**
 * Detects Telegram Mini-App user id from query params or initData.
 * This provider parses the URL or telegram initData and exposes `uid`.
 */
export function UidProvider({ children }: { children: ReactNode }) {
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    // Attempt to read from telegram initData if available
    // @ts-ignore – global var from telegram script
    const tg = (window as any).Telegram?.WebApp;
    let detected: string | null = null;
    if (tg?.initDataUnsafe?.user?.id) {
      detected = tg.initDataUnsafe.user.id.toString();
    }

    // Fallback to URL search params (?uid=xxx or start_param)
    const params = new URLSearchParams(window.location.search);
    if (!detected && params.get("uid")) {
      detected = params.get("uid");
    }
    if (!detected && params.get("start_param")) {
      detected = params.get("start_param");
    }

    setUid(detected);
  }, []);

  return (
    <UidContext.Provider value={{ uid }}>
      {children}
    </UidContext.Provider>
  );
}

export function useUid() {
  return useContext(UidContext).uid;
} 