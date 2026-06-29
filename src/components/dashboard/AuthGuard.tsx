import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import logoSvg from "../../assets/Veltrix logo.svg";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session) {
            setAuthenticated(true);
          } else {
            navigate("/login", { state: { from: location.pathname } });
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        if (mounted) {
          navigate("/login");
          setLoading(false);
        }
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        if (session) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
          navigate("/login", { state: { from: location.pathname } });
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-4">
          <img src={logoSvg} alt="Veltrix" className="h-10 w-10 animate-pulse" />
          <span className="text-xs font-body text-slate-400 font-medium">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
