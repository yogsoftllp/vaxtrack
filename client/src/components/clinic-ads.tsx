import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { ExternalLink, Zap } from "lucide-react";
import { useEffect } from "react";
import type { ClinicAdvertisement } from "@shared/schema";

export function ClinicAds() {
  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["/api/dashboard/ads"],
  }) as { data: ClinicAdvertisement[]; isLoading: boolean };

  const handleAdClick = async (adId: string, ctaLink?: string) => {
    try {
      await apiRequest("POST", `/api/ads/${adId}/click`, {});
      if (ctaLink) {
        window.open(ctaLink, "_blank");
      }
    } catch (error) {
      console.error("Error tracking click:", error);
    }
  };

  useEffect(() => {
    ads.forEach((ad) => {
      apiRequest("POST", `/api/ads/${ad.id}/impression`, {}).catch((error) =>
        console.error("Error tracking impression:", error)
      );
    });
  }, [ads]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  if (ads.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {ads.map((ad) => (
        <Card
          key={ad.id}
          className="overflow-hidden hover-elevate cursor-pointer relative"
          data-testid={`ad-card-${ad.id}`}
        >
          {ad.bannerImageUrl && (
            <div
              className="h-24 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${ad.bannerImageUrl})` }}
              data-testid={`ad-banner-${ad.id}`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-black/20" />
            </div>
          )}

          <div
            className={`relative z-10 ${
              ad.bannerImageUrl ? "-mt-12 relative" : ""
            }`}
          >
            <Card
              className={`border-0 shadow-none ${
                ad.bannerImageUrl ? "bg-white/95 dark:bg-slate-900/95 backdrop-blur" : ""
              }`}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <CardTitle className="text-base" data-testid={`ad-title-${ad.id}`}>
                    {ad.title}
                  </CardTitle>
                  {ad.highlightText && (
                    <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded whitespace-nowrap flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      {ad.highlightText}
                    </span>
                  )}
                </div>

                <CardDescription className="text-sm mb-3" data-testid={`ad-description-${ad.id}`}>
                  {ad.description}
                </CardDescription>

                <Button
                  size="sm"
                  className="w-full gap-2"
                  onClick={() => handleAdClick(ad.id, ad.ctaLink || "")}
                  data-testid={`ad-button-${ad.id}`}
                >
                  {ad.ctaText}
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </Card>
      ))}
    </div>
  );
}
