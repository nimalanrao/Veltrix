import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./useAuth";

export interface Persona {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  age_min: number;
  age_max: number;
  gender: string;
  income_level: string | null;
  interests: string[] | null;
  pain_points: string[] | null;
  platforms: string[] | null;
  tone_recommendation: string | null;
  ai_generated: boolean;
  campaigns_used_count: number;
  created_at: string;
  updated_at: string;
}

export function usePersonas() {
  const { user } = useAuth();
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPersonas = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("audience_personas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (!error && data) {
        setPersonas(data);
      }
    } catch (err) {
      console.error("Error fetching personas:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPersona = async (persona: Omit<Persona, "id" | "user_id" | "created_at" | "updated_at" | "campaigns_used_count">) => {
    if (!user) return { data: null, error: new Error("No authenticated user") };
    const { data, error } = await supabase
      .from("audience_personas")
      .insert({ ...persona, user_id: user.id })
      .select()
      .single();
    if (!error && data) {
      setPersonas((prev) => [data, ...prev]);
    }
    return { data, error };
  };

  const updatePersona = async (id: string, updates: Partial<Persona>) => {
    if (!user) return { data: null, error: new Error("No authenticated user") };
    const { data, error } = await supabase
      .from("audience_personas")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setPersonas((prev) => prev.map((p) => (p.id === id ? data : p)));
    }
    return { data, error };
  };

  const deletePersona = async (id: string) => {
    if (!user) return { error: new Error("No authenticated user") };
    const { error } = await supabase
      .from("audience_personas")
      .delete()
      .eq("id", id);
    if (!error) {
      setPersonas((prev) => prev.filter((p) => p.id !== id));
    }
    return { error };
  };

  useEffect(() => {
    if (user) {
      fetchPersonas();
    } else {
      setPersonas([]);
      setLoading(false);
    }
  }, [user]);

  return {
    personas,
    loading,
    createPersona,
    updatePersona,
    deletePersona,
    refetch: fetchPersonas,
  };
}
