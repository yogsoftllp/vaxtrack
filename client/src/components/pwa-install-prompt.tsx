import { useState, useEffect } from "react";
import { X, Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = window.matchMedia("(display-mode: standalone)").matches;
    
    setIsIOS(isIOSDevice);

    if (isInStandaloneMode) {
      return;
    }

    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    if (isIOSDevice && !isInStandaloneMode) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-card border border-card-border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Smartphone className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground" data-testid="text-pwa-title">
            Install VaxTrack
          </h3>
          <p className="text-xs text-muted-foreground mt-1" data-testid="text-pwa-description">
            {isIOS
              ? "Tap the share button and select 'Add to Home Screen' to install"
              : "Install our app for quick access to your vaccination records"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8"
          onClick={handleDismiss}
          data-testid="button-dismiss-pwa"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {!isIOS && deferredPrompt && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleDismiss}
            data-testid="button-pwa-later"
          >
            Maybe later
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-2"
            onClick={handleInstall}
            data-testid="button-pwa-install"
          >
            <Download className="h-4 w-4" />
            Install
          </Button>
        </div>
      )}
    </div>
  );
}
