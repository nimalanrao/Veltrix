import { useState } from "react";
import { Plus, Sparkles, RefreshCw, X, Target } from "lucide-react";
import { usePersonas } from "../../hooks/usePersonas";
import { generatePersona } from "../../lib/gemini";
import PersonaCard from "../../components/dashboard/PersonaCard";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import EmptyState from "../../components/dashboard/EmptyState";

export default function Audience() {
  const { personas, loading, createPersona, deletePersona } = usePersonas();
  
  const [showBuilder, setShowBuilder] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  // AI Builder State
  const [businessDesc, setBusinessDesc] = useState("");
  const [industry, setIndustry] = useState("");
  const [aiPreview, setAiPreview] = useState<any>(null);

  // Manual Form State
  const [manualForm, setManualForm] = useState({
    name: "",
    description: "",
    ageMin: 18,
    ageMax: 65,
    gender: "all",
    incomeLevel: "any",
    interests: "",
    platforms: [] as string[],
    toneRecommendation: "professional",
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to permanently delete this persona?")) {
      await deletePersona(id);
    }
  };

  const handleGeneratePersona = async () => {
    if (!businessDesc) {
      alert("Please describe your business highlights first.");
      return;
    }
    setLoadingAI(true);
    setErrorAI(null);
    try {
      const response = await generatePersona({
        businessDescription: businessDesc,
        industry: industry || undefined,
      });
      if (response) {
        setAiPreview(response);
      }
    } catch (err: any) {
      setErrorAI(err.message || "Failed to generate persona.");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSaveAIPersona = async () => {
    if (!aiPreview) return;
    const { error } = await createPersona({
      name: aiPreview.name,
      description: aiPreview.description,
      age_min: aiPreview.ageMin,
      age_max: aiPreview.ageMax,
      gender: aiPreview.gender,
      income_level: aiPreview.incomeLevel,
      interests: aiPreview.interests,
      pain_points: aiPreview.painPoints || null,
      platforms: aiPreview.platforms,
      tone_recommendation: aiPreview.toneRecommendation,
      ai_generated: true,
    });

    if (!error) {
      setAiPreview(null);
      setBusinessDesc("");
      setIndustry("");
      setShowBuilder(false);
    } else {
      alert("Error saving persona: " + error.message);
    }
  };

  const handleSaveManual = async (e: React.FormEvent) => {
    e.preventDefault();
    const interestArray = manualForm.interests
      ? manualForm.interests.split(",").map((s) => s.trim())
      : [];

    const { error } = await createPersona({
      name: manualForm.name,
      description: manualForm.description,
      age_min: manualForm.ageMin,
      age_max: manualForm.ageMax,
      gender: manualForm.gender,
      income_level: manualForm.incomeLevel,
      interests: interestArray,
      pain_points: null,
      platforms: manualForm.platforms.length > 0 ? manualForm.platforms : ["meta"],
      tone_recommendation: manualForm.toneRecommendation,
      ai_generated: false,
    });

    if (!error) {
      setShowManualModal(false);
      setManualForm({
        name: "",
        description: "",
        ageMin: 18,
        ageMax: 65,
        gender: "all",
        incomeLevel: "any",
        interests: "",
        platforms: [],
        toneRecommendation: "professional",
      });
    } else {
      alert("Error saving persona: " + error.message);
    }
  };

  const togglePlatform = (p: string) => {
    setManualForm((prev) => {
      const platforms = prev.platforms.includes(p)
        ? prev.platforms.filter((x) => x !== p)
        : [...prev.platforms, p];
      return { ...prev, platforms };
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading italic text-slate-900 tracking-tight">Audience</h1>
          <p className="text-sm font-body text-slate-500 font-light mt-1">
            Build and manage target audience personas for optimized campaign ads.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setShowBuilder(!showBuilder);
              setShowManualModal(false);
            }}
            className="inline-flex items-center gap-2 border border-slate-250 hover:bg-slate-50 text-slate-700 rounded-full px-4.5 py-2.5 text-xs font-body font-bold cursor-pointer transition-all active:scale-97 shadow-xs"
          >
            <Sparkles className="h-4 w-4" />
            AI Builder
          </button>
          <button
            onClick={() => {
              setShowManualModal(true);
              setShowBuilder(false);
            }}
            className="inline-flex items-center gap-2 bg-slate-900 text-white rounded-full px-4.5 py-2.5 text-xs font-body font-bold cursor-pointer transition-all hover:bg-slate-800 active:scale-97 shadow-sm shadow-slate-900/10"
          >
            <Plus className="h-4 w-4" />
            New Persona
          </button>
        </div>
      </div>

      {/* AI Persona Builder Accordion */}
      {showBuilder && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-body font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-500" />
              AI Target Persona Builder
            </h3>
            <button
              onClick={() => setShowBuilder(false)}
              className="text-slate-400 hover:text-slate-800 p-1 rounded-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-semibold text-slate-500">Business or Product Highlights</label>
                <textarea
                  value={businessDesc}
                  onChange={(e) => setBusinessDesc(e.target.value)}
                  placeholder="Describe your product core value, target market, or business offering..."
                  rows={3}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-body text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-body font-semibold text-slate-500">Industry / Segment (Optional)</label>
                <input
                  type="text"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g. SaaS / Healthcare / Fintech"
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 outline-none focus:border-slate-300 focus:bg-white transition-all"
                />
              </div>

              <button
                onClick={handleGeneratePersona}
                disabled={loadingAI}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full py-2.5 text-xs font-body font-bold cursor-pointer active:scale-97 disabled:opacity-50"
              >
                {loadingAI ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate Persona with AI
              </button>
              
              {errorAI && (
                <span className="text-xs font-semibold text-red-500 font-body text-center">{errorAI}</span>
              )}
            </div>

            {/* Preview Box */}
            <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-center min-h-[220px]">
              {aiPreview ? (
                <div className="flex flex-col gap-4">
                  <h4 className="text-sm font-body font-bold text-slate-800">
                    💡 Suggested: {aiPreview.name}
                  </h4>
                  <p className="text-xs font-body text-slate-500 font-light leading-relaxed">
                    {aiPreview.description}
                  </p>
                  <div className="h-px bg-slate-200/60" />
                  <div className="flex flex-col gap-2 text-xs font-body text-slate-500 font-light">
                    <div className="flex justify-between">
                      <span>Age Group:</span>
                      <span className="font-semibold text-slate-800">{aiPreview.ageMin} - {aiPreview.ageMax} ({aiPreview.gender})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interests:</span>
                      <span className="font-semibold text-slate-800 truncate max-w-[200px]">{aiPreview.interests?.join(", ")}</span>
                    </div>
                  </div>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={() => setAiPreview(null)}
                      className="flex-1 border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-body font-bold py-2 rounded-lg cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleSaveAIPersona}
                      className="flex-1 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-body font-bold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3 w-3" /> Save Persona
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center gap-2 py-4">
                  <Sparkles className="h-5 w-5 text-slate-400" />
                  <span className="text-xs font-body font-bold text-slate-700">AI Persona Output</span>
                  <span className="text-[10px] font-body text-slate-400 font-light max-w-[200px] leading-relaxed">
                    Describe your offering and trigger the AI generation to receive demographic predictions.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid of Saved Personas */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LoadingSkeleton height="280px" />
          <LoadingSkeleton height="280px" />
          <LoadingSkeleton height="280px" />
        </div>
      ) : personas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((p) => (
            <PersonaCard key={p.id} persona={p} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Target}
          title="No audience personas saved"
          description="Build audience profiles with demographics, interests, and channel preferences. Use AI Builder or create manually."
          actionLabel="Open AI Builder"
          onAction={() => setShowBuilder(true)}
        />
      )}

      {/* Manual Persona Creator Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 md:p-8 flex flex-col gap-5 text-left relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowManualModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 p-1 rounded-lg cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-body font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
              Create New Persona
            </h3>

            <form onSubmit={handleSaveManual} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-body font-bold text-slate-500">Persona Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Young Professionals"
                  value={manualForm.name}
                  onChange={(e) => setManualForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-body font-bold text-slate-500">Description</label>
                <textarea
                  placeholder="Describe who these people are..."
                  value={manualForm.description}
                  onChange={(e) => setManualForm((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-body font-bold text-slate-500">Min Age</label>
                  <input
                    type="number"
                    value={manualForm.ageMin}
                    onChange={(e) => setManualForm((p) => ({ ...p, ageMin: Number(e.target.value) }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-body font-bold text-slate-500">Max Age</label>
                  <input
                    type="number"
                    value={manualForm.ageMax}
                    onChange={(e) => setManualForm((p) => ({ ...p, ageMax: Number(e.target.value) }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-body font-bold text-slate-500">Gender</label>
                  <select
                    value={manualForm.gender}
                    onChange={(e) => setManualForm((p) => ({ ...p, gender: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-700"
                  >
                    <option value="all">All</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-body font-bold text-slate-500">Tone Recommendation</label>
                  <select
                    value={manualForm.toneRecommendation}
                    onChange={(e) => setManualForm((p) => ({ ...p, toneRecommendation: e.target.value }))}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-700"
                  >
                    <option value="bold">Urgent & Bold</option>
                    <option value="witty">Witty</option>
                    <option value="professional">Professional</option>
                    <option value="inspiring">Inspiring</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-body font-bold text-slate-500">Interests (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. scaling, marketing, digital media"
                  value={manualForm.interests}
                  onChange={(e) => setManualForm((p) => ({ ...p, interests: e.target.value }))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-body text-slate-900"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-body font-bold text-slate-500">Target Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {["meta", "google", "x", "email"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-body font-bold uppercase border cursor-pointer ${
                        manualForm.platforms.includes(p)
                          ? "bg-slate-900 border-slate-800 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-full py-3 text-xs font-body font-bold cursor-pointer active:scale-[0.98] mt-2 shadow-md shadow-slate-900/10"
              >
                Save Target Persona
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
