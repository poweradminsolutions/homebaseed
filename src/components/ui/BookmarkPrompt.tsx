"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Bookmark, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function BookmarkPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptType, setPromptType] = useState<"pwa" | "bookmark">("bookmark");
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed
    try {
      const dismissed = localStorage.getItem("bookmark-prompt-dismissed");
      if (dismissed) return;
    } catch {
      // localStorage not available
    }

    // Detect platform
    const ua = navigator.userAgent;
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const mac = /Macintosh|MacIntel/.test(ua) && navigator.maxTouchPoints <= 1;
    setIsIOS(ios);
    setIsMac(mac);

    // Check if already installed as PWA
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as any).standalone === true;
    if (isStandalone) return;

    // Listen for the PWA install prompt (Chrome/Edge/Android)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setPromptType("pwa");
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Show the prompt after a short delay (2nd pageview or after 5s on first visit)
    const visitCount = parseInt(
      localStorage.getItem("visit-count") || "0",
      10
    );
    localStorage.setItem("visit-count", String(visitCount + 1));

    const delay = visitCount >= 1 ? 2000 : 8000;
    const timer = setTimeout(() => {
      setShowPrompt(true);
    }, delay);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      clearTimeout(timer);
    };
  }, []);

  // If the PWA prompt fires after initial load, upgrade the prompt type
  useEffect(() => {
    if (deferredPrompt) {
      setPromptType("pwa");
    }
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    try {
      localStorage.setItem("bookmark-prompt-dismissed", "true");
    } catch {
      // ignore
    }
  }, []);

  const handleInstallPWA = useCallback(async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowPrompt(false);
      try {
        localStorage.setItem("bookmark-prompt-dismissed", "true");
      } catch {
        // ignore
      }
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  if (!showPrompt) return null;

  // PWA install prompt (Android / Chrome desktop)
  if (promptType === "pwa" && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-slide-up">
        <div className="bg-white rounded-xl shadow-lg border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">
                Install The Homeschool Source
              </h3>
              <p className="text-muted text-xs mt-1 leading-relaxed">
                Add to your home screen for quick access. Works offline too.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleInstallPWA}
                  className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Install App
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-muted text-xs font-medium hover:text-foreground transition-colors"
                >
                  Not now
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-muted hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // iOS "Add to Home Screen" instructions
  if (isIOS) {
    return (
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-slide-up">
        <div className="bg-white rounded-xl shadow-lg border border-border p-5">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">
                Save to Home Screen
              </h3>
              <p className="text-muted text-xs mt-1 leading-relaxed">
                Tap the{" "}
                <span className="inline-flex items-center">
                  <svg
                    className="w-3.5 h-3.5 inline text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </span>{" "}
                share button, then &quot;Add to Home Screen&quot; for instant access.
              </p>
              <button
                onClick={handleDismiss}
                className="mt-3 px-4 py-2 text-muted text-xs font-medium hover:text-foreground transition-colors"
              >
                Got it
              </button>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-1 text-muted hover:text-foreground transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Desktop bookmark reminder
  const shortcutKey = isMac ? "\u2318+D" : "Ctrl+D";

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-50 animate-slide-up">
      <div className="bg-white rounded-xl shadow-lg border border-border p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
            <Bookmark className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm">
              Bookmark this for later?
            </h3>
            <p className="text-muted text-xs mt-1 leading-relaxed">
              Press{" "}
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono font-semibold text-foreground">
                {shortcutKey}
              </kbd>{" "}
              to save The Homeschool Source to your bookmarks so you can find it again.
            </p>
            <button
              onClick={handleDismiss}
              className="mt-3 px-4 py-2 text-muted text-xs font-medium hover:text-foreground transition-colors"
            >
              Got it, thanks
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 text-muted hover:text-foreground transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
