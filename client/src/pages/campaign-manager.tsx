import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Clock } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CampaignManager() {
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    channels: ["sms"] as ("sms" | "email")[],
    targetAudience: "all",
  });

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["/api/campaigns"],
  }) as { data?: any[]; isLoading: boolean };

  const createMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/campaigns", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setFormData({ title: "", message: "", channels: ["sms"], targetAudience: "all" });
      setIsCreating(false);
      toast({ title: "Success", description: "Campaign created" });
    },
  });

  const sendMutation = useMutation({
    mutationFn: (campaignId: string) => apiRequest("POST", `/api/campaigns/${campaignId}/send`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      toast({ title: "Success", description: "Campaign sent" });
    },
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to create campaign", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold" data-testid="heading-campaigns">Campaign Manager</h1>
        <p className="text-muted-foreground mt-2">Send email and SMS campaigns to parents</p>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-semibold">Title</label>
              <Input
                placeholder="Campaign title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                data-testid="input-campaign-title"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Message</label>
              <Textarea
                placeholder="Campaign message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                data-testid="textarea-campaign-message"
                className="min-h-24"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Channels</label>
              <div className="flex gap-4 mt-2">
                {["sms", "email"].map((ch) => (
                  <label key={ch} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.channels.includes(ch as any)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, channels: [...formData.channels, ch as any] });
                        } else {
                          setFormData({ ...formData, channels: formData.channels.filter((c) => c !== ch) });
                        }
                      }}
                      data-testid={`checkbox-channel-${ch}`}
                    />
                    <span className="capitalize">{ch}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} data-testid="button-create-campaign">
                Create
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)} data-testid="button-cancel-campaign">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Button onClick={() => setIsCreating(!isCreating)} data-testid="button-new-campaign">
        <Mail className="h-4 w-4 mr-2" />
        New Campaign
      </Button>

      {campaigns && campaigns.length > 0 ? (
        <div className="grid gap-4">
          {campaigns.map((campaign: any) => (
            <Card key={campaign.id} data-testid={`card-campaign-${campaign.id}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2" data-testid={`text-campaign-title-${campaign.id}`}>
                      {campaign.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{campaign.message}</p>
                    <div className="flex gap-2 flex-wrap">
                      {campaign.channels.map((ch: string) => (
                        <Badge key={ch} variant="secondary">
                          {ch.toUpperCase()}
                        </Badge>
                      ))}
                      <Badge variant={campaign.status === "sent" ? "default" : "outline"}>
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                  {campaign.status === "draft" && (
                    <Button
                      size="sm"
                      onClick={() => sendMutation.mutate(campaign.id)}
                      data-testid={`button-send-campaign-${campaign.id}`}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  )}
                  {campaign.status === "sent" && (
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Sent
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isCreating && (
          <Card>
            <CardContent className="p-12 text-center">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No campaigns yet</p>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
