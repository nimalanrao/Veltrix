import { Trash2, Target, Cpu, User } from "lucide-react";
import type { Persona } from "../../hooks/usePersonas";

interface PersonaCardProps {
  persona: Persona;
  onDelete: (id: string) => void;
}

export default function PersonaCard({ persona, onDelete }: PersonaCardProps) {
  const getGenderLabel = (g: string) => {
    if (g === "all") return "All genders";
    return g;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-md hover:border-slate-350 transition-all duration-200 group relative text-left">
      <div className="flex flex-col gap-3">
        {/* Name and Delete */}
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-base font-body font-bold text-slate-900 group-hover:text-slate-800 flex items-center gap-1.5">
            <Target className="h-4 w-4 text-slate-800 shrink-0" /> {persona.name}
          </h4>
          <button
            onClick={() => onDelete(persona.id)}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 border border-slate-100/50 hover:border-rose-100 text-slate-400 hover:text-rose-600 cursor-pointer transition-all active:scale-95"
            title="Delete Persona"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <p className="text-xs font-body text-slate-400 font-light leading-relaxed">
          {persona.description || "No description provided."}
        </p>

        <div className="h-px bg-slate-100/80 my-1" />

        {/* Details list */}
        <div className="flex flex-col gap-2.5 text-xs font-body text-slate-500 font-light">
          <div className="flex justify-between">
            <span>Age:</span>
            <span className="font-semibold text-slate-800">
              {persona.age_min} - {persona.age_max} · {getGenderLabel(persona.gender)}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Income:</span>
            <span className="font-semibold text-slate-800 capitalize">
              {persona.income_level || "Any"}
            </span>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <span>Interests:</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {persona.interests && persona.interests.length > 0 ? (
                persona.interests.map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] font-body font-bold text-slate-600 bg-slate-100 rounded-full px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 font-light italic">None</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1 mt-1">
            <span>Target Channels:</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {persona.platforms && persona.platforms.length > 0 ? (
                persona.platforms.map((plat) => (
                  <span
                    key={plat}
                    className="text-[9px] font-body font-bold text-slate-600 bg-slate-100 rounded-full px-2 py-0.5 uppercase"
                  >
                    {plat}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 font-light italic">None</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[9px] font-body font-bold text-slate-400 uppercase tracking-wider">
        <span>Tone: <span className="text-slate-700 font-semibold">{persona.tone_recommendation || "Professional"}</span></span>
        {persona.ai_generated ? (
          <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
            <Cpu className="h-3 w-3" /> AI Persona
          </span>
        ) : (
          <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-150 flex items-center gap-1.5">
            <User className="h-3 w-3" /> Manual
          </span>
        )}
      </div>
    </div>
  );
}
