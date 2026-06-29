import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  RefreshCw,
  DollarSign,
  Users,
  Rocket,
  Target,
  Smartphone,
  Search,
  X,
  Mail,
  Zap,
  Smile,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useCampaigns } from "../../hooks/useCampaigns";
import { usePersonas } from "../../hooks/usePersonas";
import { generateAdCopy, generateAdImage } from "../../lib/gemini";
import AdPreview from "../../components/dashboard/AdPreview";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";

const steps = ["Basics", "Audience", "AI Copywriting", "Budget & Date", "Review & Launch"];

const objectives = [
  { id: "conversions", label: "Conversions", desc: "Drive sales, sign-ups, or purchases.", icon: DollarSign },
  { id: "leads", label: "Lead Generation", desc: "Collect customer contact info.", icon: Users },
  { id: "traffic", label: "Traffic", desc: "Send visitors to your site.", icon: Rocket },
  { id: "awareness", label: "Brand Awareness", desc: "Introduce your brand to users.", icon: Target },
];

const channels = [
  { id: "meta", label: "Meta Sponsored Ad", icon: Smartphone },
  { id: "google", label: "Google Search Ad", icon: Search },
  { id: "x", label: "X / Twitter Post", icon: X },
  { id: "email", label: "Email Newsletter", icon: Mail },
];

const tones = [
  { id: "bold", label: "Urgent & Bold", icon: Zap },
  { id: "witty", label: "Witty & Humorous", icon: Smile },
  { id: "professional", label: "Professional", icon: Briefcase },
  { id: "inspiring", label: "Inspiring", icon: Sparkles },
];

export default function CampaignNew() {
  const navigate = useNavigate();
  const { createCampaign } = useCampaigns();
  const { personas, loading: loadingPersonas } = usePersonas();

  const [step, setStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingImageAI, setLoadingImageAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    objective: "conversions",
    channel: "meta",
    audienceType: "persona",
    audiencePersonaId: "",
    audienceCustom: "",
    targetAgeMin: 18,
    targetAgeMax: 65,
    targetLocation: "",
    targetInterests: "",
    productName: "",
    productDescription: "",
    tone: "bold",
    generatedHeadline: "",
    generatedBody: "",
    generatedCta: "",
    generatedImageUrl: "",
    generatedImageBase64: "", // local preview
    dailyBudget: "50",
    totalBudget: "1500",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    runContinuously: true,
    bidStrategy: "lowest_cost",
    aiConfidenceScore: 85,
    predictedCtr: 3.2,
    predictedCpa: 4.5,
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const updateForm = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateCopy = async () => {
    if (!formData.productName || !formData.productDescription) {
      alert("Please fill in Product Name and Hook Description first.");
      return;
    }
    setLoadingAI(true);
    setErrorAI(null);
    try {
      const audienceLabel =
        formData.audienceType === "persona"
          ? personas.find((p) => p.id === formData.audiencePersonaId)?.name || "General"
          : formData.audienceCustom;

      const response = await generateAdCopy({
        productName: formData.productName,
        productDescription: formData.productDescription,
        channel: formData.channel as any,
        tone: formData.tone as any,
        audience: audienceLabel,
        targetAgeRange: `${formData.targetAgeMin}-${formData.targetAgeMax}`,
        objective: formData.objective,
      });

      if (response) {
        setFormData((prev) => ({
          ...prev,
          generatedHeadline: response.headline,
          generatedBody: response.body,
          generatedCta: response.cta,
          predictedCtr: response.predictedCTR,
          predictedCpa: response.predictedCPA,
          aiConfidenceScore: response.confidenceScore,
        }));
      }
    } catch (err: any) {
      setErrorAI(err.message || "Failed to generate ad copy.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!formData.productName || !formData.productDescription) {
      alert("Please fill in Product Name and Hook Description first.");
      return;
    }
    setLoadingImageAI(true);
    try {
      const response = await generateAdImage({
        productName: formData.productName,
        productDescription: formData.productDescription,
        channel: formData.channel as any,
        style: "vibrant",
      });

      if (response) {
        setFormData((prev) => ({
          ...prev,
          generatedImageUrl: response.imageUrl,
          generatedImageBase64: response.base64,
        }));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setLoadingImageAI(false);
    }
  };

  const handleLaunch = async (status: "active" | "draft") => {
    const interestArray = formData.targetInterests
      ? formData.targetInterests.split(",").map((s) => s.trim())
      : [];

    const campaignData: any = {
      name: formData.name || `Campaign - ${new Date().toLocaleDateString()}`,
      objective: formData.objective,
      channel: formData.channel,
      status,
      audience_persona_id: formData.audienceType === "persona" ? formData.audiencePersonaId || null : null,
      audience_custom: formData.audienceType === "custom" ? formData.audienceCustom : null,
      target_age_min: formData.targetAgeMin,
      target_age_max: formData.targetAgeMax,
      target_location: formData.targetLocation || null,
      target_interests: interestArray,
      tone: formData.tone,
      product_name: formData.productName || null,
      product_description: formData.productDescription || null,
      generated_headline: formData.generatedHeadline || null,
      generated_body: formData.generatedBody || null,
      generated_cta: formData.generatedCta || null,
      generated_image_url: formData.generatedImageUrl || null,
      daily_budget: Number(formData.dailyBudget) || null,
      total_budget: Number(formData.totalBudget) || null,
      bid_strategy: formData.bidStrategy,
      start_date: formData.startDate || null,
      end_date: formData.runContinuously ? null : formData.endDate || null,
      ai_confidence_score: formData.aiConfidenceScore,
      predicted_ctr: formData.predictedCtr,
      predicted_cpa: formData.predictedCpa,
    };

    const { data, error } = await createCampaign(campaignData);
    if (!error && data) {
      navigate(`/dashboard/campaigns/${data.id}`);
    } else {
      alert("Failed to create campaign: " + (error?.message || "unknown error"));
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">New Campaign</h1>
        <p className="text-sm font-body text-slate-500 font-light mt-1">
          Follow the steps to configure and launch your AI campaign.
        </p>
      </div>

      {/* Progress Stepper */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full flex-1 transition-colors duration-300 ${
                idx + 1 <= step ? "bg-slate-900" : "bg-slate-100"
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between items-center text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
          <span>Step {step} of 5</span>
          <span>Current: {steps[step - 1]}</span>
        </div>
      </div>

      {/* Forms Multi-step Body */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {/* STEP 1: BASICS */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
                <h4 className="text-sm font-body font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
                  1. Campaign Basics
                </h4>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Campaign Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="e.g. FitTrack Pro Launch"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-body font-semibold text-slate-500">Campaign Objective</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {objectives.map((obj) => (
                      <button
                        key={obj.id}
                        onClick={() => updateForm("objective", obj.id)}
                        className={`p-4 rounded-xl border text-left cursor-pointer active:scale-98 transition-all flex items-start gap-3.5 ${
                          formData.objective === obj.id
                            ? "bg-slate-900 border-slate-800 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                        }`}
                      >
                        <obj.icon className="h-5 w-5 mt-0.5 shrink-0" />
                        <div className="flex flex-col gap-0.5">
                          <span className={`text-xs font-body font-bold ${formData.objective === obj.id ? "text-white" : "text-slate-800"}`}>
                            {obj.label}
                          </span>
                          <span className={`text-[10px] font-body ${formData.objective === obj.id ? "text-slate-300" : "text-slate-400"}`}>
                            {obj.desc}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-body font-semibold text-slate-500">Marketing Channel</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {channels.map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => updateForm("channel", ch.id)}
                        className={`p-4 rounded-xl border text-center cursor-pointer active:scale-98 transition-all flex flex-col items-center justify-center gap-2.5 ${
                          formData.channel === ch.id
                            ? "bg-slate-900 border-slate-800 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                        }`}
                      >
                        <ch.icon className="h-5 w-5 text-current" />
                        <span className="text-xs font-body font-bold">{ch.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: AUDIENCE TARGETING */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
                <h4 className="text-sm font-body font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
                  2. Target Audience
                </h4>

                <div className="flex gap-2 p-1 bg-slate-50 border border-slate-100 rounded-xl self-start">
                  <button
                    onClick={() => updateForm("audienceType", "persona")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-bold transition-all cursor-pointer ${
                      formData.audienceType === "persona" ? "bg-slate-900 text-white" : "text-slate-500"
                    }`}
                  >
                    Use Saved Persona
                  </button>
                  <button
                    onClick={() => updateForm("audienceType", "custom")}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-body font-bold transition-all cursor-pointer ${
                      formData.audienceType === "custom" ? "bg-slate-900 text-white" : "text-slate-500"
                    }`}
                  >
                    Custom Targeting
                  </button>
                </div>

                {formData.audienceType === "persona" ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Audience Persona</label>
                    {loadingPersonas ? (
                      <LoadingSkeleton height="40px" />
                    ) : personas.length > 0 ? (
                      <select
                        value={formData.audiencePersonaId}
                        onChange={(e) => {
                          const id = e.target.value;
                          const found = personas.find((p) => p.id === id);
                          updateForm("audiencePersonaId", id);
                          if (found) {
                            updateForm("targetAgeMin", found.age_min || 18);
                            updateForm("targetAgeMax", found.age_max || 65);
                            updateForm("targetInterests", found.interests?.join(", ") || "");
                          }
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-700 outline-none cursor-pointer focus:border-slate-400 focus:bg-white"
                      >
                        <option value="" disabled>Select a persona...</option>
                        {personas.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-slate-400 font-light border border-dashed border-slate-200 rounded-xl p-4 text-center">
                        No personas created. Create one on the <button onClick={() => navigate("/dashboard/audience")} className="font-semibold text-slate-800 underline">Audience Page</button> or select Custom Targeting.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Audience Target Description</label>
                    <textarea
                      value={formData.audienceCustom}
                      onChange={(e) => updateForm("audienceCustom", e.target.value)}
                      placeholder="e.g. Health-conscious millennials interested in fitness tracking and tech gadgets..."
                      rows={3}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 focus:bg-white transition-all resize-none"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Min Age</label>
                    <input
                      type="number"
                      value={formData.targetAgeMin}
                      onChange={(e) => updateForm("targetAgeMin", Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Max Age</label>
                    <input
                      type="number"
                      value={formData.targetAgeMax}
                      onChange={(e) => updateForm("targetAgeMax", Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Target Location</label>
                  <input
                    type="text"
                    value={formData.targetLocation}
                    onChange={(e) => updateForm("targetLocation", e.target.value)}
                    placeholder="e.g. Malaysia, Singapore"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Interests (Comma separated)</label>
                  <input
                    type="text"
                    value={formData.targetInterests}
                    onChange={(e) => updateForm("targetInterests", e.target.value)}
                    placeholder="e.g. fitness, wearables, gym, startups"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: AI COPY GENERATION */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Left Form */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
                <h4 className="text-sm font-body font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
                  3. AI Creative Parameters
                </h4>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Product Name</label>
                  <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => updateForm("productName", e.target.value)}
                    placeholder="e.g. FitTrack Pro"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Product Hook & Description</label>
                  <textarea
                    value={formData.productDescription}
                    onChange={(e) => updateForm("productDescription", e.target.value)}
                    placeholder="Describe product highlights and core benefits..."
                    rows={3}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900 placeholder-slate-400 outline-none focus:border-slate-400 transition-all resize-none"
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-body font-semibold text-slate-500">Ad Copy Tone</label>
                  <div className="grid grid-cols-2 gap-3">
                    {tones.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => updateForm("tone", t.id)}
                        className={`p-3 rounded-xl border text-center cursor-pointer active:scale-98 transition-all flex items-center justify-center gap-2 ${
                          formData.tone === t.id
                            ? "bg-slate-900 border-slate-800 text-white shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 text-slate-800"
                        }`}
                      >
                        <t.icon className="h-4 w-4 text-current" />
                        <span className="text-xs font-body font-bold">{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleGenerateCopy}
                  disabled={loadingAI}
                  className="mt-2 w-full inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full py-3 text-xs font-body font-semibold cursor-pointer active:scale-97 disabled:opacity-50 shadow-sm"
                >
                  {loadingAI ? (
                    <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-4.5 w-4.5" />
                  )}
                  Generate Ad Copy with AI
                </button>

                {errorAI && (
                  <span className="text-xs font-semibold text-red-500 font-body text-center">{errorAI}</span>
                )}

                {formData.generatedHeadline && (
                  <button
                    onClick={handleGenerateImage}
                    disabled={loadingImageAI}
                    className="w-full inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-full py-3 text-xs font-body font-semibold cursor-pointer active:scale-97 disabled:opacity-50 shadow-xs"
                  >
                    {loadingImageAI ? (
                      <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                    ) : (
                      <ImageIcon className="h-4.5 w-4.5" />
                    )}
                    Generate Ad Image with AI
                  </button>
                )}
              </div>

              {/* Right preview container */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center min-h-[350px]">
                {formData.generatedHeadline ? (
                  <div className="flex flex-col gap-4">
                    <span className="text-xs font-body font-bold text-slate-400 uppercase tracking-widest text-left leading-none">
                      Generated Creative Preview
                    </span>
                    <AdPreview
                      headline={formData.generatedHeadline}
                      body={formData.generatedBody}
                      cta={formData.generatedCta}
                      channel={formData.channel}
                      imageUrl={formData.generatedImageBase64 || formData.generatedImageUrl}
                      productName={formData.productName}
                      predictedCTR={formData.predictedCtr}
                      predictedCPA={formData.predictedCpa}
                      confidenceScore={formData.aiConfidenceScore}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h5 className="text-sm font-body font-semibold text-slate-800">Generate copy</h5>
                    <p className="text-xs font-body text-slate-400 font-light max-w-[200px] leading-relaxed">
                      Configure your product metrics on the left, then click Generate to construct campaign creatives.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 4: BUDGET & DATES */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
                <h4 className="text-sm font-body font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
                  4. Budget & Schedule
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Daily Budget (MYR)</label>
                    <input
                      type="number"
                      required
                      value={formData.dailyBudget}
                      onChange={(e) => updateForm("dailyBudget", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Total Budget Cap (MYR)</label>
                    <input
                      type="number"
                      required
                      value={formData.totalBudget}
                      onChange={(e) => updateForm("totalBudget", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="text-xs font-body font-semibold text-slate-500">Schedule options</label>
                  <div className="flex items-center gap-2 cursor-pointer self-start" onClick={() => updateForm("runContinuously", !formData.runContinuously)}>
                    <input
                      type="checkbox"
                      checked={formData.runContinuously}
                      onChange={() => {}} // handled by click
                      className="rounded border-slate-350 text-slate-900 focus:ring-slate-900 h-4 w-4 cursor-pointer"
                    />
                    <span className="text-xs font-body font-medium text-slate-700 select-none">Run continuously until budget is spent</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-body font-semibold text-slate-500">Start Date</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => updateForm("startDate", e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900"
                    />
                  </div>
                  {!formData.runContinuously && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-body font-semibold text-slate-500">End Date</label>
                      <input
                        type="date"
                        required
                        value={formData.endDate}
                        onChange={(e) => updateForm("endDate", e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-900"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-body font-semibold text-slate-500">Bidding Optimization Strategy</label>
                  <select
                    value={formData.bidStrategy}
                    onChange={(e) => updateForm("bidStrategy", e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-body text-slate-700 outline-none cursor-pointer focus:border-slate-400 focus:bg-white"
                  >
                    <option value="lowest_cost">Lowest Cost-per-Acquisition (CPA)</option>
                    <option value="target_cpa">Fixed Target CPA</option>
                    <option value="target_roas">Target Return-on-Ad-Spend (ROAS)</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW & LAUNCH */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Left Summary */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
                <h4 className="text-sm font-body font-semibold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2.5">
                  5. Review Campaign parameters
                </h4>

                <div className="flex flex-col gap-3.5 text-xs font-body text-slate-500 font-light">
                  <div className="flex justify-between">
                    <span>Campaign Name:</span>
                    <span className="font-semibold text-slate-800">{formData.name || "Unnamed Campaign"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Objective:</span>
                    <span className="font-semibold text-slate-800 capitalize">{formData.objective}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing Channel:</span>
                    <span className="font-semibold text-slate-800 capitalize">{formData.channel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Age:</span>
                    <span className="font-semibold text-slate-800">{formData.targetAgeMin} - {formData.targetAgeMax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Location:</span>
                    <span className="font-semibold text-slate-800">{formData.targetLocation || "Global"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Budget configuration:</span>
                    <span className="font-semibold text-slate-800">MYR {formData.dailyBudget}/day (Cap: MYR {formData.totalBudget})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Schedule:</span>
                    <span className="font-semibold text-slate-800">
                      Starts {formData.startDate} {formData.runContinuously ? "continuously" : `ends ${formData.endDate}`}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleLaunch("draft")}
                    className="flex-1 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-full py-3.5 text-xs font-body font-bold cursor-pointer transition-colors text-center"
                  >
                    Save as Draft
                  </button>
                  <button
                    onClick={() => handleLaunch("active")}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full py-3.5 text-xs font-body font-bold cursor-pointer transition-colors shadow-sm shadow-emerald-500/20 text-center"
                  >
                    🚀 Launch Campaign
                  </button>
                </div>
              </div>

              {/* Right Ad mockup preview */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center">
                <div className="flex flex-col gap-4">
                  <span className="text-xs font-body font-bold text-slate-400 uppercase tracking-widest text-left leading-none">
                    Ad Format Mockup
                  </span>
                  <AdPreview
                    headline={formData.generatedHeadline}
                    body={formData.generatedBody}
                    cta={formData.generatedCta}
                    channel={formData.channel}
                    imageUrl={formData.generatedImageBase64 || formData.generatedImageUrl}
                    productName={formData.productName}
                    predictedCTR={formData.predictedCtr}
                    predictedCPA={formData.predictedCpa}
                    confidenceScore={formData.aiConfidenceScore}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons footer */}
      {step < 5 && (
        <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="inline-flex items-center gap-2 border border-slate-250 hover:bg-slate-50 text-slate-600 rounded-full px-5 py-2.5 text-xs font-body font-bold disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <button
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-xs font-body font-bold cursor-pointer active:scale-97 transition-all shadow-md shadow-slate-900/5"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
