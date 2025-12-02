import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  { code: "pt", name: "Português" },
  { code: "hi", name: "हिंदी" },
  { code: "ar", name: "العربية" },
  { code: "zh", name: "中文" },
];

export function LanguageSelector() {
  const { toast } = useToast();

  const { data: preference } = useQuery({
    queryKey: ["/api/user/language-preference"],
  }) as { data?: any };

  const mutation = useMutation({
    mutationFn: (language: string) =>
      apiRequest("POST", "/api/user/language-preference", { language }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/language-preference"] });
      toast({ title: "Language updated" });
    },
  });

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <select
        value={preference?.language || "en"}
        onChange={(e) => mutation.mutate(e.target.value)}
        className="text-sm bg-transparent border-0 cursor-pointer"
        data-testid="select-language"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
}
