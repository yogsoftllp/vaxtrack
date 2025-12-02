import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Users, TrendingUp, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ReferralStats {
  referralCode: string;
  successfulReferrals: number;
  totalReferrals: number;
  rewardStatus: "pending" | "earned" | "claimed";
  nextRewardAt: number;
}

export default function ReferralDashboard() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const { data: stats, isLoading } = useQuery<ReferralStats>({
    queryKey: ["/api/user/referral-stats"],
  });

  const handleCopyCode = () => {
    if (stats?.referralCode) {
      navigator.clipboard.writeText(stats.referralCode);
      setCopied(true);
      toast({ title: "Referral code copied!" });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const progressPercent = stats ? (stats.successfulReferrals / 5) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 pb-20">
      <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto w-full sm:max-w-2xl">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Referral Rewards</h1>
            <p className="text-xs text-slate-600 dark:text-slate-400">Earn Family Plan upgrade</p>
          </div>
          <Gift className="h-5 w-5 text-blue-600" />
        </div>
      </div>

      <div className="px-4 max-w-md mx-auto w-full sm:max-w-2xl pt-4 space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </>
        ) : (
          <>
            {/* Referral Code Card */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              <CardContent className="p-4">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Your Referral Code</p>
                <div className="flex items-center gap-2">
                  <code className="text-lg font-bold text-slate-900 dark:text-white bg-white/50 dark:bg-slate-800/50 px-3 py-2 rounded-lg flex-1">
                    {stats?.referralCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    data-testid="button-copy-referral-code"
                    aria-label="Copy referral code"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Family Plan Upgrade Progress
                  </h3>
                  <Badge>{stats?.successfulReferrals || 0}/5</Badge>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {5 - (stats?.successfulReferrals || 0)} more referrals until Family Plan upgrade
                  </p>
                </div>

                {stats?.rewardStatus === "earned" && (
                  <Button className="w-full gap-2" data-testid="button-claim-reward">
                    <Gift className="h-4 w-4" />
                    Claim Family Plan Upgrade
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Successful</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {stats?.successfulReferrals || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Shared</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white">
                      {stats?.totalReferrals || 0}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
