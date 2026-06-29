import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabase";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  console.warn(
    "VITE_GEMINI_API_KEY is not set. AI features (copy generation, image generation, insights) will be disabled."
  );
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;
const textModel = genAI?.getGenerativeModel({ model: "gemini-2.5-flash" }) ?? null;

export function isAIAvailable(): boolean {
  return !!genAI;
}

// ─── Helpers ───────────────────────────────────────────────

function parseGeminiJSON(text: string): unknown {
  let cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const jsonStart = cleaned.indexOf("{") !== -1 ? cleaned.indexOf("{") : cleaned.indexOf("[");
  const jsonEnd =
    cleaned.lastIndexOf("}") !== -1 ? cleaned.lastIndexOf("}") + 1 : cleaned.lastIndexOf("]") + 1;
  if (jsonStart === -1 || jsonEnd === 0) throw new Error("No JSON found in AI response");
  cleaned = cleaned.slice(jsonStart, jsonEnd);
  return JSON.parse(cleaned);
}

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: unknown) {
      const status = (error as { status?: number }).status;
      if (status === 429 && i < maxRetries - 1) {
        await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
        continue;
      }
      throw error;
    }
  }
  throw new Error("Max retries exceeded");
}

// ─── Types ─────────────────────────────────────────────────

export interface AdCopyRequest {
  productName: string;
  productDescription: string;
  channel: "meta" | "google" | "x" | "email";
  tone: "bold" | "witty" | "professional" | "inspiring";
  audience: string;
  targetAgeRange?: string;
  objective?: string;
}

export interface AdCopyResponse {
  headline: string;
  body: string;
  cta: string;
  predictedCTR: number;
  predictedCPA: number;
  confidenceScore: number;
}

export interface PersonaRequest {
  businessDescription: string;
  industry?: string;
  existingCustomerInfo?: string;
}

export interface GeneratedPersona {
  name: string;
  description: string;
  ageMin: number;
  ageMax: number;
  gender: string;
  incomeLevel: string;
  interests: string[];
  painPoints: string[];
  platforms: string[];
  toneRecommendation: string;
}

export interface CampaignSummary {
  name: string;
  channel: string;
  spend: number;
  revenue: number;
  ctr: number;
  cpa: number;
  roas: number;
  status: string;
}

export interface AIInsight {
  title: string;
  description: string;
  type: "opportunity" | "warning" | "success";
  priority: "high" | "medium" | "low";
  actionable: string;
}

export interface ABVariantRequest {
  originalHeadline: string;
  originalBody: string;
  originalCta: string;
  channel: string;
  tone: string;
  productName: string;
  variantCount?: number;
}

export interface ABVariant {
  headline: string;
  body: string;
  cta: string;
  differentiator: string;
}

export interface AdImageRequest {
  productName: string;
  productDescription: string;
  channel: "meta" | "google" | "x" | "email";
  style?: "minimal" | "vibrant" | "corporate" | "lifestyle";
}

export interface AdImageResponse {
  imageUrl: string;
  base64: string;
}

// ─── Ad Copy Generation ───────────────────────────────────

export async function generateAdCopy(request: AdCopyRequest): Promise<AdCopyResponse> {
  if (!textModel) throw new Error("AI not configured. Add VITE_GEMINI_API_KEY to your environment.");

  const channelRules: Record<string, string> = {
    meta: "Headline max 40 chars. Body max 125 chars. Use emojis sparingly. Include social proof or urgency.",
    google:
      "Headline max 30 chars. Description max 90 chars. No emojis. Focus on keywords and benefits.",
    x: "Single tweet max 280 chars. Can use 1-2 emojis. Must be conversational and shareable.",
    email:
      "Subject line max 60 chars. Preview text max 100 chars. Body max 200 words. Personal tone.",
  };

  const prompt = `You are an expert performance marketer and copywriter.

Generate high-converting ad copy for:
PRODUCT: ${request.productName}
DESCRIPTION: ${request.productDescription}
CHANNEL: ${request.channel}
TONE: ${request.tone}
TARGET AUDIENCE: ${request.audience}
AGE RANGE: ${request.targetAgeRange || "18-65"}
OBJECTIVE: ${request.objective || "conversions"}

CHANNEL RULES: ${channelRules[request.channel]}

TONE RULES:
- Bold: Urgent, direct, power words, FOMO.
- Witty: Clever wordplay, light humor, memorable.
- Professional: Clean, authoritative, data-driven.
- Inspiring: Aspirational, emotional, transformation-focused.

Return ONLY valid JSON:
{"headline":"...","body":"...","cta":"...","predicted_ctr":3.8,"predicted_cpa":4.20,"confidence_score":88}`;

  const result = await callWithRetry(() => textModel.generateContent(prompt));
  const text = result.response.text();
  const parsed = parseGeminiJSON(text) as Record<string, unknown>;

  return {
    headline: (parsed.headline as string) || "Your product, reimagined.",
    body: (parsed.body as string) || "Discover what's possible.",
    cta: (parsed.cta as string) || "Learn More →",
    predictedCTR: (parsed.predicted_ctr as number) ?? 2.5,
    predictedCPA: (parsed.predicted_cpa as number) ?? 5.0,
    confidenceScore: (parsed.confidence_score as number) ?? 70,
  };
}

// ─── Ad Image Generation ──────────────────────────────────

export async function generateAdImage(request: AdImageRequest): Promise<AdImageResponse> {
  if (!genAI) throw new Error("AI not configured. Add VITE_GEMINI_API_KEY to your environment.");

  const aspectRatios: Record<string, string> = {
    meta: "1:1 square",
    google: "1.91:1 landscape",
    x: "16:9 landscape",
    email: "2:1 landscape",
  };

  const prompt = `Create a professional marketing advertisement image for:
PRODUCT: ${request.productName}
DESCRIPTION: ${request.productDescription}
PLATFORM: ${request.channel}
STYLE: ${request.style || "vibrant"}
Aspect ratio: ${aspectRatios[request.channel]}
Requirements: Clean, modern, premium look. Product-focused. No text overlays. High contrast, vivid colors.`;

  const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await callWithRetry(() =>
    imageModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ["image", "text"] as unknown as undefined,
      } as never,
    })
  );

  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts;
  const imagePart = parts?.find((p: { inlineData?: unknown }) => p.inlineData);

  if (!imagePart?.inlineData) {
    throw new Error("No image generated. The model may not support image generation with this prompt.");
  }

  const inlineData = imagePart.inlineData as { data: string; mimeType: string };
  const base64 = inlineData.data;
  const mimeType = inlineData.mimeType || "image/png";

  // Upload to Supabase Storage
  const fileName = `campaign-${Date.now()}.png`;
  const fileBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  const { data, error } = await supabase.storage
    .from("campaign-images")
    .upload(fileName, fileBuffer, { contentType: mimeType, upsert: false });

  if (error) {
    console.warn("Storage upload failed, returning base64 only:", error);
    return { imageUrl: "", base64: `data:${mimeType};base64,${base64}` };
  }

  const { data: urlData } = supabase.storage.from("campaign-images").getPublicUrl(data.path);
  return {
    imageUrl: urlData.publicUrl,
    base64: `data:${mimeType};base64,${base64}`,
  };
}

// ─── Persona Generation ───────────────────────────────────

export async function generatePersona(request: PersonaRequest): Promise<GeneratedPersona> {
  if (!textModel) throw new Error("AI not configured.");

  const prompt = `You are an expert audience strategist for digital marketing.
Generate a detailed target audience persona for:
BUSINESS: ${request.businessDescription}
${request.industry ? `INDUSTRY: ${request.industry}` : ""}
${request.existingCustomerInfo ? `EXISTING CUSTOMERS: ${request.existingCustomerInfo}` : ""}

Return ONLY valid JSON:
{"name":"...","description":"...","age_min":25,"age_max":45,"gender":"all","income_level":"high","interests":["..."],"pain_points":["..."],"platforms":["meta","google"],"tone_recommendation":"professional"}`;

  const result = await callWithRetry(() => textModel.generateContent(prompt));
  const parsed = parseGeminiJSON(result.response.text()) as Record<string, unknown>;

  return {
    name: (parsed.name as string) || "Target Audience",
    description: (parsed.description as string) || "",
    ageMin: (parsed.age_min as number) ?? 18,
    ageMax: (parsed.age_max as number) ?? 65,
    gender: (parsed.gender as string) || "all",
    incomeLevel: (parsed.income_level as string) || "any",
    interests: (parsed.interests as string[]) || [],
    painPoints: (parsed.pain_points as string[]) || [],
    platforms: (parsed.platforms as string[]) || ["meta"],
    toneRecommendation: (parsed.tone_recommendation as string) || "professional",
  };
}

// ─── AI Performance Insights ──────────────────────────────

export async function generateInsights(
  campaigns: CampaignSummary[],
  dateRange: string
): Promise<AIInsight[]> {
  if (!textModel) throw new Error("AI not configured.");

  const prompt = `You are an AI marketing strategist analyzing campaign performance data for ${dateRange}:

${JSON.stringify(campaigns, null, 2)}

Generate 3-5 actionable insights. Compare channels, identify patterns, suggest optimizations.

Return ONLY valid JSON array:
[{"title":"...","description":"...","type":"opportunity|warning|success","priority":"high|medium|low","actionable":"Specific action to take"}]`;

  const result = await callWithRetry(() => textModel.generateContent(prompt));
  const parsed = parseGeminiJSON(result.response.text()) as AIInsight[];
  return Array.isArray(parsed) ? parsed : [];
}

// ─── A/B Variant Generation ───────────────────────────────

export async function generateABVariant(request: ABVariantRequest): Promise<ABVariant[]> {
  if (!textModel) throw new Error("AI not configured.");

  const prompt = `You are an A/B testing expert. Original ad:
HEADLINE: ${request.originalHeadline}
BODY: ${request.originalBody}
CTA: ${request.originalCta}
CHANNEL: ${request.channel} | TONE: ${request.tone} | PRODUCT: ${request.productName}

Generate ${request.variantCount || 2} alternative versions testing different angles.

Return ONLY valid JSON:
[{"headline":"...","body":"...","cta":"...","differentiator":"Tests social proof angle"}]`;

  const result = await callWithRetry(() => textModel.generateContent(prompt));
  const parsed = parseGeminiJSON(result.response.text()) as ABVariant[];
  return Array.isArray(parsed) ? parsed : [];
}
