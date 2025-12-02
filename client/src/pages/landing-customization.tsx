import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

export default function LandingCustomization() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    logoUrl: "",
    headerText: "VaxTrack",
    headerDescription: "Smart vaccination management for parents and clinics worldwide",
    primaryColor: "#3b82f6",
    secondaryColor: "#1f2937",
    footerText: "",
    featuredImageUrl: "",
  });

  const { data: branding, isLoading } = useQuery({
    queryKey: ["/api/public/landing-branding"],
  });

  const updateMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      apiRequest("POST", "/api/admin/landing-branding", data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Landing page customization updated",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/public/landing-branding"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update customization",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="heading-landing-customization">
            Landing Page Customization
          </h1>
          <p className="text-muted-foreground mt-2">Customize the parent-facing landing page with your branding</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Header Section</CardTitle>
              <CardDescription>Customize the main header of your landing page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Logo URL</label>
                <Input
                  value={formData.logoUrl}
                  onChange={(e) => handleInputChange("logoUrl", e.target.value)}
                  placeholder="https://example.com/logo.png"
                  data-testid="input-logo-url"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Header Text</label>
                <Input
                  value={formData.headerText}
                  onChange={(e) => handleInputChange("headerText", e.target.value)}
                  placeholder="VaxTrack"
                  data-testid="input-header-text"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Header Description</label>
                <Textarea
                  value={formData.headerDescription}
                  onChange={(e) => handleInputChange("headerDescription", e.target.value)}
                  placeholder="Your tagline here"
                  data-testid="textarea-header-desc"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
              <CardDescription>Set primary and secondary brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Primary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      className="h-10 w-16 rounded border cursor-pointer"
                      data-testid="input-primary-color"
                    />
                    <Input
                      value={formData.primaryColor}
                      onChange={(e) => handleInputChange("primaryColor", e.target.value)}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Secondary Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      className="h-10 w-16 rounded border cursor-pointer"
                      data-testid="input-secondary-color"
                    />
                    <Input
                      value={formData.secondaryColor}
                      onChange={(e) => handleInputChange("secondaryColor", e.target.value)}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer & Media</CardTitle>
              <CardDescription>Add footer text and featured image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Footer Text</label>
                <Textarea
                  value={formData.footerText}
                  onChange={(e) => handleInputChange("footerText", e.target.value)}
                  placeholder="Copyright and footer information"
                  data-testid="textarea-footer-text"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Featured Image URL</label>
                <Input
                  value={formData.featuredImageUrl}
                  onChange={(e) => handleInputChange("featuredImageUrl", e.target.value)}
                  placeholder="https://example.com/hero.jpg"
                  data-testid="input-featured-image"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-testid="button-save-customization"
            >
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Customization
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
