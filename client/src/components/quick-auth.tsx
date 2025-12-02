import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function QuickAuth({ onSuccess }: { onSuccess: (user: any) => void }) {
  const { toast } = useToast();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/send-otp", { phone, method: "sms" });
      if (res.ok) {
        setOtpSent(true);
        toast({ title: "OTP Sent", description: `Code sent to ${phone}` });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/verify-otp", { phone, otp });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data);
      }
    } catch (error) {
      toast({ title: "Error", description: "Invalid OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Quick Sign In</CardTitle>
        <CardDescription>Choose your preferred method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="phone" className="w-full">
          <TabsList className="grid w-full grid-cols-3" data-testid="tabs-auth-methods">
            <TabsTrigger value="google" data-testid="tab-google">
              <Mail className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="phone" data-testid="tab-phone">
              <Phone className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="whatsapp" data-testid="tab-whatsapp">
              <MessageCircle className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          <TabsContent value="google" className="space-y-4 mt-4">
            <Button className="w-full" variant="outline" data-testid="button-google-signin">
              <Mail className="h-4 w-4 mr-2" />
              Sign in with Google
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Secure OAuth login via your Google account
            </p>
          </TabsContent>

          <TabsContent value="phone" className="space-y-4 mt-4">
            {!otpSent ? (
              <>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="input-phone"
                  className="font-mono"
                />
                <Button onClick={handleSendOtp} disabled={!phone || loading} className="w-full" data-testid="button-send-sms">
                  {loading ? "Sending..." : "Send OTP via SMS"}
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  maxLength={6}
                  data-testid="input-otp"
                  className="text-center font-mono text-2xl tracking-widest"
                />
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || loading} className="w-full" data-testid="button-verify-otp">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => { setOtpSent(false); setOtp(""); }} className="w-full" data-testid="button-resend">
                  Resend or change number
                </Button>
              </>
            )}
          </TabsContent>

          <TabsContent value="whatsapp" className="space-y-4 mt-4">
            {!otpSent ? (
              <>
                <Input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  data-testid="input-whatsapp-phone"
                  className="font-mono"
                />
                <Button onClick={async () => { await apiRequest("POST", "/api/auth/send-otp", { phone, method: "whatsapp" }); setOtpSent(true); }} disabled={!phone || loading} className="w-full" data-testid="button-send-whatsapp">
                  {loading ? "Sending..." : "Send OTP via WhatsApp"}
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  maxLength={6}
                  data-testid="input-whatsapp-otp"
                  className="text-center font-mono text-2xl tracking-widest"
                />
                <Button onClick={handleVerifyOtp} disabled={otp.length !== 6 || loading} className="w-full" data-testid="button-verify-whatsapp">
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
