import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, Play, Pause, RefreshCw, Sparkles, Image as ImageIcon, Activity, TrendingUp, Target, DollarSign } from "lucide-react";
import { useCampaigns } from "../../hooks/useCampaigns";
import type { Campaign } from "../../hooks/useCampaigns";
import { useMetrics } from "../../hooks/useMetrics";
import { generateAdCopy, generateAdImage, generateABVariant } from "../../lib/gemini";
import type { ABVariant } from "../../lib/gemini";
import StatCard from "../../components/dashboard/StatCard";
import PerformanceChart from "../../components/dashboard/PerformanceChart";
import AdPreview from "../../components/dashboard/AdPreview";
import ActivityLog from "../../components/dashboard/ActivityLog";
import LoadingSkeleton from "../../components/dashboard/LoadingSkeleton";
import ChannelBadge from "../../components/dashboard/ChannelBadge";
import StatusBadge from "../../components/dashboard/StatusBadge";
import { formatCurrency, formatPercent } from "../../lib/utils";
import { supabase } from "../../lib/supabase";

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { campaigns, loading: campaignsLoading, toggleStatus, deleteCampaign, updateCampaign } = useCampaigns();
  const { dailyMetrics, aggregateMetrics, loading: metricsLoading } = useMetrics(id, 30);

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [abVariants, setAbVariants] = useState<ABVariant[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingImageAI, setLoadingImageAI] = useState(false);
  const [loadingAB, setLoadingAB] = useState(false);
  const [errorAI, setErrorAI] = useState<string | null>(null);

  // Sync campaigns list with local state
  useEffect(() => {
    if (campaigns.length > 0 && id) {
      const found = campaigns.find((c) => c.id === id);
      if (found) {
        setCampaign(found);
      }
    }
  }, [campaigns, id]);

  const loading = campaignsLoading || metricsLoading || !campaign;

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <LoadingSkeleton width="150px" height="20px" />
        <LoadingSkeleton height="80px" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
        </div>
        <LoadingSkeleton height="350px" />
      </div>
    );
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently delete this campaign? This action cannot be undone.")) {
      await deleteCampaign(campaign.id);
      navigate("/dashboard/campaigns");
    }
  };

  const handleTogglePause = async () => {
    await toggleStatus(campaign.id, campaign.status);
  };

  const handleRegenerateCopy = async () => {
    setLoadingAI(true);
    setErrorAI(null);
    try {
      const response = await generateAdCopy({
        productName: campaign.product_name || campaign.name,
        productDescription: campaign.product_description || "",
        channel: campaign.channel,
        tone: (campaign.tone as any) || "bold",
        audience: campaign.audience_custom || "General",
        targetAgeRange: `${campaign.target_age_min}-${campaign.target_age_max}`,
        objective: campaign.objective,
      });

      if (response) {
        await updateCampaign(campaign.id, {
          generated_headline: response.headline,
          generated_body: response.body,
          generated_cta: response.cta,
          predicted_ctr: response.predictedCTR,
          predicted_cpa: response.predictedCPA,
          ai_confidence_score: response.confidenceScore,
        });

        // Insert into activity log
        await supabase.from("campaign_activity").insert({
          campaign_id: campaign.id,
          event_type: "copy_generated",
          description: "Ad copy regenerated using Gemini AI Flash.",
        });
      }
    } catch (err: any) {
      setErrorAI(err.message || "Failed to generate copy");
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateImage = async () => {
    setLoadingImageAI(true);
    try {
      const response = await generateAdImage({
        productName: campaign.product_name || campaign.name,
        productDescription: campaign.product_description || "",
        channel: campaign.channel,
        style: "vibrant",
      });

      if (response && response.imageUrl) {
        await updateCampaign(campaign.id, {
          generated_image_url: response.imageUrl,
        });

        await supabase.from("campaign_activity").insert({
          campaign_id: campaign.id,
          event_type: "image_generated",
          description: "Ad creative banner generated with Imagen AI.",
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate image. Please try again later.");
    } finally {
      setLoadingImageAI(false);
    }
  };

  const handleGenerateABVariants = async () => {
    setLoadingAB(true);
    try {
      const response = await generateABVariant({
        originalHeadline: campaign.generated_headline || "",
        originalBody: campaign.generated_body || "",
        originalCta: campaign.generated_cta || "",
        channel: campaign.channel,
        tone: campaign.tone || "bold",
        productName: campaign.product_name || campaign.name,
      });
      if (response) {
        setAbVariants(response);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAB(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Back button & Action items */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => navigate("/dashboard/campaigns")}
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-body font-semibold text-xs cursor-pointer self-start"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </button>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleTogglePause}
            className={`inline-flex items-center gap-2 rounded-full px-4.5 py-2 text-xs font-body font-semibold cursor-pointer active:scale-97 transition-all shadow-sm ${
              campaign.status === "active"
                ? "bg-slate-900 text-white hover:bg-slate-800"
                : "bg-white text-slate-800 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {campaign.status === "active" ? (
              <>
                <Pause className="h-3.5 w-3.5" />
                Pause Campaign
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5" />
                Resume Campaign
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 hover:bg-rose-100/60 text-rose-600 rounded-full px-4 py-2 text-xs font-body font-semibold cursor-pointer transition-all active:scale-97"
            title="Delete Campaign"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Campaign Details Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
        <h1 className="text-3xl font-heading italic text-slate-900 leading-tight">
          {campaign.name}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <ChannelBadge channel={campaign.channel} />
          <StatusBadge status={campaign.status} />
          <span className="text-xs font-body text-slate-400 font-light">
            Objective: <span className="font-semibold text-slate-600">{campaign.objective}</span>
          </span>
          <span className="text-xs font-body text-slate-400 font-light">·</span>
          <span className="text-xs font-body text-slate-400 font-light">
            Bid: <span className="font-semibold text-slate-600">{campaign.bid_strategy}</span>
          </span>
        </div>
      </div>

      {/* Metrics Stat Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Impressions"
          value={aggregateMetrics.totalImpressions.toLocaleString()}
          trend="+10% vs average"
          trendDirection="up"
          icon={Activity}
        />
        <StatCard
          label="Clicks"
          value={aggregateMetrics.totalClicks.toLocaleString()}
          trend="+5% vs average"
          trendDirection="up"
          icon={Activity}
        />
        <StatCard
          label="CTR"
          value={formatPercent(aggregateMetrics.avgCTR)}
          trend="-0.2% vs average"
          trendDirection="down"
          icon={TrendingUp}
        />
        <StatCard
          label="Conversions"
          value={aggregateMetrics.totalConversions}
          trend="+18% vs average"
          trendDirection="up"
          icon={Target}
        />
        <StatCard
          label="CPA"
          value={formatCurrency(aggregateMetrics.avgCPA)}
          trend="-5% vs average"
          trendDirection="up" // lower CPA is good
          icon={DollarSign}
        />
      </div>

      {/* History Performance Chart */}
      <div>
        <PerformanceChart data={dailyMetrics} />
      </div>

      {/* AI Creative section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: Ad creative Mockup */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-body font-bold text-slate-400 uppercase tracking-widest">
                Generated Ad Creative
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRegenerateCopy}
                  disabled={loadingAI}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-body font-semibold text-slate-600 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingAI ? "animate-spin" : ""}`} />
                  Regenerate Copy
                </button>
                <button
                  onClick={handleGenerateABVariants}
                  disabled={loadingAB}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-body font-semibold disabled:opacity-50 cursor-pointer"
                >
                  <Sparkles className="h-3 w-3" />
                  A/B Variants
                </button>
              </div>
            </div>

            {errorAI && (
              <span className="text-xs font-semibold text-red-500 font-body">{errorAI}</span>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Ad Preview Mockup */}
              <AdPreview
                headline={campaign.generated_headline}
                body={campaign.generated_body}
                cta={campaign.generated_cta}
                channel={campaign.channel}
                imageUrl={campaign.generated_image_url}
                productName={campaign.product_name || campaign.name}
                predictedCTR={campaign.predicted_ctr}
                predictedCPA={campaign.predicted_cpa}
                confidenceScore={campaign.ai_confidence_score}
              />

              {/* Imagen image creative controller */}
              <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-4 min-h-[250px]">
                {campaign.generated_image_url ? (
                  <div className="flex flex-col gap-4 w-full">
                    <div className="aspect-[1.91/1] rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
                      <img src={campaign.generated_image_url} alt="creative" className="w-full h-full object-cover" />
                    </div>
                    <button
                      onClick={handleGenerateImage}
                      disabled={loadingImageAI}
                      className="inline-flex items-center justify-center gap-2 border border-slate-200 rounded-full px-5 py-2 text-xs font-body font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3 w-3 ${loadingImageAI ? "animate-spin" : ""}`} />
                      Regenerate ad image
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                      <ImageIcon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <span className="text-xs font-body font-bold text-slate-800">No image generated</span>
                      <span className="text-[10px] font-body text-slate-400 font-light leading-normal">
                        Create high-converting ad imagery for your layouts with Imagen.
                      </span>
                    </div>
                    <button
                      onClick={handleGenerateImage}
                      disabled={loadingImageAI}
                      className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2 text-xs font-body font-semibold cursor-pointer active:scale-97 transition-all disabled:opacity-50"
                    >
                      {loadingImageAI ? (
                        <RefreshCw className="h-3 w-3 animate-spin" />
                      ) : (
                        <ImageIcon className="h-3 w-3" />
                      )}
                      Generate Image with AI
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* A/B variants preview if generated */}
          {abVariants.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <span className="text-xs font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
                AI Suggested A/B Copy Variants
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {abVariants.map((v, i) => (
                  <div key={i} className="border border-slate-100 bg-slate-50/20 rounded-2xl p-4.5 flex flex-col gap-3">
                    <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded-full self-start">
                      {v.differentiator}
                    </span>
                    <h5 className="text-xs font-body font-semibold text-slate-900">
                      Headline: {v.headline}
                    </h5>
                    <p className="text-[11px] font-body text-slate-500 font-light leading-relaxed">
                      Body: {v.body}
                    </p>
                    <span className="text-[10px] font-body font-medium text-slate-600 mt-auto">
                      CTA: {v.cta}
                    </span>
                    <button
                      onClick={async () => {
                        await updateCampaign(campaign.id, {
                          generated_headline: v.headline,
                          generated_body: v.body,
                          generated_cta: v.cta,
                        });
                        setAbVariants([]);
                      }}
                      className="border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-body font-semibold text-slate-700 py-1.5 rounded-lg mt-2 cursor-pointer transition-colors"
                    >
                      Apply Variant
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Budget tracker & Activity Timeline */}
        <div className="flex flex-col gap-6">
          {/* Budget tracker */}
          {campaign.total_budget && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4">
              <span className="text-[10px] font-body font-bold text-slate-400 uppercase tracking-widest leading-none">
                Campaign Budget
              </span>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center justify-between text-xs font-body leading-none text-slate-400">
                  <span>Spent: <span className="font-semibold text-slate-800">{formatCurrency(campaign.budget_spent)}</span></span>
                  <span>Cap: <span className="font-semibold text-slate-800">{formatCurrency(Number(campaign.total_budget))}</span></span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full rounded-full bg-slate-900"
                    style={{ width: `${Math.min(100, Math.round((campaign.budget_spent / Number(campaign.total_budget)) * 100))}%` }}
                  />
                </div>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="flex flex-col gap-3.5 text-xs font-body text-slate-500 font-light">
                <div className="flex justify-between">
                  <span>Daily budget:</span>
                  <span className="font-semibold text-slate-800">{campaign.daily_budget ? formatCurrency(Number(campaign.daily_budget)) : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Start date:</span>
                  <span className="font-semibold text-slate-800">{campaign.start_date || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span>End date:</span>
                  <span className="font-semibold text-slate-800">{campaign.end_date || "Run continuously"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Activity log */}
          <ActivityLog campaignId={campaign.id} />
        </div>
      </div>
    </div>
  );
}
