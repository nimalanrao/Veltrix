import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  objective: string;
  channel: "meta" | "google" | "x" | "email";
  status: "draft" | "active" | "paused" | "completed";
  audience_persona_id: string | null;
  audience_custom: string | null;
  target_age_min: number;
  target_age_max: number;
  target_location: string | null;
  target_interests: string[] | null;
  tone: "bold" | "witty" | "professional" | "inspiring" | null;
  product_name: string | null;
  product_description: string | null;
  generated_headline: string | null;
  generated_body: string | null;
  generated_cta: string | null;
  generated_image_url: string | null;
  daily_budget: number | null;
  total_budget: number | null;
  budget_spent: number;
  bid_strategy: string;
  start_date: string | null;
  end_date: string | null;
  ai_confidence_score: number | null;
  predicted_ctr: number | null;
  predicted_cpa: number | null;
  created_at: string;
  updated_at: string;
  roas?: number | null;
}

export function useCampaigns() {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCampaigns = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("campaigns")
        .select("*, campaign_metrics(spend, revenue)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        const campaignsWithRoas = data.map((c: any) => {
          const metrics = c.campaign_metrics || [];
          const totalSpend = metrics.reduce((sum: number, m: any) => sum + Number(m.spend || 0), 0);
          const totalRevenue = metrics.reduce((sum: number, m: any) => sum + Number(m.revenue || 0), 0);
          const roas = totalSpend > 0 ? totalRevenue / totalSpend : null;
          return {
            ...c,
            roas
          };
        });
        setCampaigns(campaignsWithRoas);
      }
    } catch (err) {
      console.error("Error fetching campaigns:", err);
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaign: Omit<Campaign, "id" | "user_id" | "created_at" | "updated_at" | "budget_spent">) => {
    if (!user) return { data: null, error: new Error("No authenticated user") };
    const { data, error } = await supabase
      .from("campaigns")
      .insert({ ...campaign, user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      setCampaigns((prev) => [data, ...prev]);
    }
    return { data, error };
  };

  const updateCampaign = async (id: string, updates: Partial<Campaign>) => {
    if (!user) return { data: null, error: new Error("No authenticated user") };
    const { data, error } = await supabase
      .from("campaigns")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setCampaigns((prev) => prev.map((c) => (c.id === id ? data : c)));
    }
    return { data, error };
  };

  const deleteCampaign = async (id: string) => {
    if (!user) return { error: new Error("No authenticated user") };
    const { error } = await supabase
      .from("campaigns")
      .delete()
      .eq("id", id);
    if (!error) {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
    }
    return { error };
  };

  const toggleStatus = async (id: string, currentStatus: Campaign["status"]) => {
    const newStatus: Campaign["status"] = currentStatus === "active" ? "paused" : "active";
    return updateCampaign(id, { status: newStatus });
  };

  const duplicateCampaign = async (campaign: Campaign) => {
    const { id, created_at, updated_at, budget_spent, ...rest } = campaign;
    return createCampaign({
      ...rest,
      name: `${campaign.name} (Copy)`,
      status: "draft",
    });
  };

  useEffect(() => {
    if (user) {
      fetchCampaigns();
    } else {
      setCampaigns([]);
      setLoading(false);
    }
  }, [user]);

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    toggleStatus,
    duplicateCampaign,
    refetch: fetchCampaigns,
  };
}
