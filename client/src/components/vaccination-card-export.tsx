import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VaccinationRecord } from "@shared/schema";

interface ExportProps {
  record: VaccinationRecord & { childName?: string };
}

export function VaccinationExportButtons({ record }: ExportProps) {
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    try {
      const response = await fetch(`/api/vaccinations/${record.id}/pdf`);
      if (!response.ok) throw new Error("Failed to generate PDF");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vaccination-${record.vaccineName}-${record.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "PDF downloaded successfully" });
    } catch (error) {
      toast({ title: "Failed to download PDF", variant: "destructive" });
    }
  };

  const handleShare = async () => {
    const text = `Vaccination Record: ${record.vaccineName} for ${record.childName || "child"} on ${new Date(record.scheduledDate).toLocaleDateString()}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Vaccination Record",
          text,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({ title: "Failed to share", variant: "destructive" });
        }
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(text);
      toast({ title: "Vaccination info copied to clipboard" });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownloadPDF}
        data-testid={`button-export-pdf-${record.id}`}
        aria-label="Download vaccination record as PDF"
        className="gap-1"
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">PDF</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleShare}
        data-testid={`button-share-${record.id}`}
        aria-label="Share vaccination record"
        className="gap-1"
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share</span>
      </Button>
    </div>
  );
}
