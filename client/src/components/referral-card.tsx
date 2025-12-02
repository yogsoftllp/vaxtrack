import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Gift, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ReferralCard() {
  const { toast } = useToast();
  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/user/referral-stats"],
  }) as { data?: { code: string; count: number; status: string }; isLoading: boolean };

  const handleCopyCode = () => {
    if (stats?.code) {
      navigator.clipboard.writeText(stats.code);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    }
  };

  const handleShareLink = () => {
    if (stats?.code) {
      const link = `${window.location.origin}?ref=${stats.code}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Shared!",
        description: "Share link copied to clipboard",
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const progress = stats ? (stats.count / 5) * 100 : 0;
  const isEligible = stats && stats.count >= 5;

  return (
    <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2" data-testid="heading-referral">
              <Gift className="h-5 w-5 text-blue-600" />
              Refer & Earn
            </CardTitle>
            <CardDescription>Invite friends and upgrade to Family Plan</CardDescription>
          </div>
          {isEligible && <CheckCircle className="h-5 w-5 text-green-600" data-testid="icon-eligible" />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Referral Code */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-foreground">Your Referral Code:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={stats?.code || ""}
              readOnly
              className="flex-1 px-3 py-2 border rounded-md bg-white dark:bg-slate-950 text-sm font-mono"
              data-testid="input-referral-code"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopyCode}
              data-testid="button-copy-code"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Share Link */}
        <Button
          size="sm"
          variant="outline"
          className="w-full gap-2"
          onClick={handleShareLink}
          data-testid="button-share-link"
        >
          <Share2 className="h-4 w-4" />
          Copy Share Link
        </Button>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-foreground">Progress to Reward:</p>
            <Badge
              variant={isEligible ? "default" : "secondary"}
              data-testid="badge-progress"
            >
              {stats?.count || 0}/5
            </Badge>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-referrals" />
        </div>

        {/* Reward Info */}
        {isEligible ? (
          <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-md border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-900 dark:text-green-100 font-semibold" data-testid="text-eligible">
              🎉 You've earned the Family Plan upgrade!
            </p>
            <p className="text-xs text-green-700 dark:text-green-200 mt-1">
              Unlock multiple children, advanced analytics, and priority support.
            </p>
          </div>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>{5 - (stats?.count || 0)} more referrals</strong> to unlock Family Plan
            </p>
            <ul className="text-xs text-blue-700 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
              <li>Manage multiple children</li>
              <li>Advanced vaccination analytics</li>
              <li>Priority clinic support</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
