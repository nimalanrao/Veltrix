-- ============================================================
-- VELTRIX DASHBOARD — COMPLETE DATABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- 1. AUDIENCE PERSONAS (must be created first, campaigns references it)
CREATE TABLE IF NOT EXISTS public.audience_personas (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name            TEXT NOT NULL,
  description     TEXT,
  age_min         INT DEFAULT 18,
  age_max         INT DEFAULT 65,
  gender          TEXT DEFAULT 'all',
  income_level    TEXT,
  interests       TEXT[],
  pain_points     TEXT[],
  platforms       TEXT[],
  tone_recommendation TEXT,
  ai_generated    BOOLEAN DEFAULT false,
  campaigns_used_count INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_personas_user_id ON public.audience_personas(user_id);

-- 2. CAMPAIGNS
CREATE TABLE IF NOT EXISTS public.campaigns (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name            TEXT NOT NULL,
  objective       TEXT NOT NULL,
  channel         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'draft',
  audience_persona_id UUID REFERENCES public.audience_personas(id) ON DELETE SET NULL,
  audience_custom TEXT,
  target_age_min  INT DEFAULT 18,
  target_age_max  INT DEFAULT 65,
  target_location TEXT,
  target_interests TEXT[],
  tone            TEXT,
  product_name    TEXT,
  product_description TEXT,
  generated_headline TEXT,
  generated_body  TEXT,
  generated_cta   TEXT,
  generated_image_url TEXT,
  daily_budget    DECIMAL(10,2),
  total_budget    DECIMAL(10,2),
  budget_spent    DECIMAL(10,2) DEFAULT 0,
  bid_strategy    TEXT DEFAULT 'lowest_cost',
  start_date      DATE,
  end_date        DATE,
  ai_confidence_score INT,
  predicted_ctr   DECIMAL(5,2),
  predicted_cpa   DECIMAL(10,2),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_channel ON public.campaigns(channel);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_at ON public.campaigns(created_at DESC);

-- 3. CAMPAIGN METRICS
CREATE TABLE IF NOT EXISTS public.campaign_metrics (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id     UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  date            DATE NOT NULL,
  impressions     INT DEFAULT 0,
  clicks          INT DEFAULT 0,
  conversions     INT DEFAULT 0,
  spend           DECIMAL(10,2) DEFAULT 0,
  revenue         DECIMAL(10,2) DEFAULT 0,
  ctr             DECIMAL(5,4) DEFAULT 0,
  cpa             DECIMAL(10,2) DEFAULT 0,
  roas            DECIMAL(5,2) DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(campaign_id, date)
);

CREATE INDEX IF NOT EXISTS idx_metrics_campaign_date ON public.campaign_metrics(campaign_id, date DESC);

-- 4. INTEGRATIONS
CREATE TABLE IF NOT EXISTS public.integrations (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  channel         TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'disconnected',
  account_name    TEXT,
  account_id      TEXT,
  api_key_hash    TEXT,
  permissions     TEXT[],
  last_synced_at  TIMESTAMPTZ,
  error_message   TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_integrations_user_id ON public.integrations(user_id);

-- 5. CAMPAIGN ACTIVITY LOG
CREATE TABLE IF NOT EXISTS public.campaign_activity (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id     UUID REFERENCES public.campaigns(id) ON DELETE CASCADE NOT NULL,
  event_type      TEXT NOT NULL,
  description     TEXT NOT NULL,
  metadata        JSONB,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_campaign_id ON public.campaign_activity(campaign_id, created_at DESC);

-- 6. GEMINI LOG
CREATE TABLE IF NOT EXISTS public.gemini_log (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  request_type    TEXT NOT NULL,
  prompt          TEXT NOT NULL,
  response_text   TEXT,
  response_image_url TEXT,
  model_used      TEXT,
  tokens_used     INT,
  latency_ms      INT,
  success         BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gemini_log_user_id ON public.gemini_log(user_id, created_at DESC);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.audience_personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gemini_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own personas" ON public.audience_personas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own campaigns" ON public.campaigns FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own metrics" ON public.campaign_metrics FOR SELECT USING (campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid()));
CREATE POLICY "Users insert own metrics" ON public.campaign_metrics FOR INSERT WITH CHECK (campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid()));
CREATE POLICY "Users manage own integrations" ON public.integrations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users read own activity" ON public.campaign_activity FOR SELECT USING (campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid()));
CREATE POLICY "Users insert own activity" ON public.campaign_activity FOR INSERT WITH CHECK (campaign_id IN (SELECT id FROM public.campaigns WHERE user_id = auth.uid()));
CREATE POLICY "Users manage own gemini log" ON public.gemini_log FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE OR REPLACE TRIGGER personas_updated_at BEFORE UPDATE ON public.audience_personas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE OR REPLACE TRIGGER integrations_updated_at BEFORE UPDATE ON public.integrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.log_campaign_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.campaign_activity (campaign_id, event_type, description, metadata)
    VALUES (
      NEW.id,
      CASE NEW.status WHEN 'active' THEN 'launched' WHEN 'paused' THEN 'paused' WHEN 'completed' THEN 'completed' ELSE 'status_changed' END,
      'Campaign status changed from ' || OLD.status || ' to ' || NEW.status,
      jsonb_build_object('old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_campaign_status_change AFTER UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.log_campaign_status_change();

CREATE OR REPLACE FUNCTION public.log_campaign_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.campaign_activity (campaign_id, event_type, description)
  VALUES (NEW.id, 'created', 'Campaign "' || NEW.name || '" was created');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_campaign_created AFTER INSERT ON public.campaigns FOR EACH ROW EXECUTE FUNCTION public.log_campaign_created();

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaigns;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_activity;
