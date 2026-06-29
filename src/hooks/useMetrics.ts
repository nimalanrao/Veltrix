import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export interface Metric {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpa: number;
  roas: number;
  created_at: string;
}

export interface AggregateMetrics {
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  totalImpressions: number;
  totalClicks: number;
  avgCTR: number;
  avgCPA: number;
  avgROAS: number;
}

export function useMetrics(campaignId?: string, periodDays = 30) {
  const { user } = useAuth();
  const [dailyMetrics, setDailyMetrics] = useState<Metric[]>([]);
  const [aggregateMetrics, setAggregateMetrics] = useState<AggregateMetrics>({
    totalSpend: 0,
    totalRevenue: 0,
    totalConversions: 0,
    totalImpressions: 0,
    totalClicks: 0,
    avgCTR: 0,
    avgCPA: 0,
    avgROAS: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchMetrics = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - periodDays);
      const startDateStr = startDate.toISOString().split("T")[0];

      let query = supabase
        .from("campaign_metrics")
        .select("*")
        .gte("date", startDateStr)
        .order("date", { ascending: true });

      if (campaignId) {
        query = query.eq("campaign_id", campaignId);
      }

      const { data, error } = await query;
      if (!error && data) {
        setDailyMetrics(data);

        // Process Aggregates
        let totalSpend = 0;
        let totalRevenue = 0;
        let totalConversions = 0;
        let totalImpressions = 0;
        let totalClicks = 0;

        data.forEach((m) => {
          totalSpend += Number(m.spend || 0);
          totalRevenue += Number(m.revenue || 0);
          totalConversions += m.conversions || 0;
          totalImpressions += m.impressions || 0;
          totalClicks += m.clicks || 0;
        });

        const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
        const avgCPA = totalConversions > 0 ? totalSpend / totalConversions : 0;
        const avgROAS = totalSpend > 0 ? totalRevenue / totalSpend : 0;

        setAggregateMetrics({
          totalSpend,
          totalRevenue,
          totalConversions,
          totalImpressions,
          totalClicks,
          avgCTR,
          avgCPA,
          avgROAS,
        });
      }
    } catch (err) {
      console.error("Error fetching metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMetrics();
    } else {
      setDailyMetrics([]);
      setLoading(false);
    }
  }, [user, campaignId, periodDays]);

  return { dailyMetrics, aggregateMetrics, loading, refetch: fetchMetrics };
}
