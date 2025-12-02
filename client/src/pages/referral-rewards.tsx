import { useEffect, useState } from "react";

export default function ReferralRewards() {
  const [referralData, setReferralData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/referrals")
      .then((r) => r.json())
      .then(setReferralData)
      .catch(() => setReferralData(null));
  }, []);

  const handleCopyCode = () => {
    if (referralData?.code) {
      navigator.clipboard.writeText(referralData.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!referralData)
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-gray-600">Loading referral rewards...</p>
        </div>
      </div>
    );

  const progressPercent = (referralData.successfulReferrals / referralData.targetReferrals) * 100;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Referral Rewards</h1>

        {/* Gift Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-lg p-8 mb-6">
          <div className="text-center">
            <div className="text-5xl mb-2">🎁</div>
            <h2 className="text-2xl font-bold mb-2">Your Referral Code</h2>
            <div className="text-3xl font-mono bg-white bg-opacity-20 rounded p-4 mb-4">{referralData.code}</div>
            <button
              onClick={handleCopyCode}
              className="bg-white text-purple-600 font-bold px-6 py-2 rounded-lg hover:bg-opacity-90"
              data-testid="button-copy-referral"
            >
              {copied ? "✅ Copied!" : "📋 Copy Code"}
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-bold mb-4">Progress to Next Reward</h3>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-semibold">{referralData.successfulReferrals} referrals</span>
              <span className="text-sm text-gray-600">{referralData.targetReferrals} needed</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4" data-testid="progress-bar">
              <div
                className="bg-green-500 h-4 rounded-full transition-all"
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Unlock exclusive features when you reach {referralData.targetReferrals} referrals!</p>
        </div>

        {/* Rewards List */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Available Rewards</h3>
          <ul className="space-y-3">
            {[
              { referrals: 3, reward: "Free premium month" },
              { referrals: 5, reward: "Priority clinic support" },
              { referrals: 10, reward: "Lifetime discount" },
            ].map((item) => (
              <li key={item.referrals} className="p-3 bg-gray-50 rounded flex justify-between items-center" data-testid={`reward-${item.referrals}`}>
                <div>
                  <div className="font-semibold">{item.referrals} referrals</div>
                  <div className="text-sm text-gray-600">{item.reward}</div>
                </div>
                {referralData.successfulReferrals >= item.referrals ? (
                  <span className="text-2xl">✅</span>
                ) : (
                  <span className="text-gray-400">{item.referrals - referralData.successfulReferrals} more</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
