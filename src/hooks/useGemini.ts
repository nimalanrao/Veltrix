import { useState } from "react";
import {
  generateAdCopy,
  generateAdImage,
  generatePersona,
  generateInsights,
  generateABVariant,
  isAIAvailable,
} from "../lib/gemini";
import type {
  AdCopyRequest,
  AdCopyResponse,
  AdImageRequest,
  AdImageResponse,
  PersonaRequest,
  GeneratedPersona,
  CampaignSummary,
  AIInsight,
  ABVariantRequest,
  ABVariant,
} from "../lib/gemini";

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async <T>(fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI generation failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    isAvailable: isAIAvailable(),
    generateAdCopy: (req: AdCopyRequest) => generate<AdCopyResponse>(() => generateAdCopy(req)),
    generateAdImage: (req: AdImageRequest) => generate<AdImageResponse>(() => generateAdImage(req)),
    generatePersona: (req: PersonaRequest) => generate<GeneratedPersona>(() => generatePersona(req)),
    generateInsights: (campaigns: CampaignSummary[], range: string) =>
      generate<AIInsight[]>(() => generateInsights(campaigns, range)),
    generateABVariant: (req: ABVariantRequest) => generate<ABVariant[]>(() => generateABVariant(req)),
  };
}
