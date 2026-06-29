import { formatCurrency, formatPercent } from "../../lib/utils";

interface AdPreviewProps {
  headline?: string | null;
  body?: string | null;
  cta?: string | null;
  channel: "meta" | "google" | "x" | "email" | string;
  imageUrl?: string | null;
  productName?: string | null;
  predictedCTR?: number | null;
  predictedCPA?: number | null;
  confidenceScore?: number | null;
}

export default function AdPreview({
  headline,
  body,
  cta,
  channel,
  imageUrl,
  productName,
  predictedCTR,
  predictedCPA,
  confidenceScore,
}: AdPreviewProps) {
  const displayHeadline = headline || "AI Ad Copywriting Title";
  const displayBody = body || "AI-generated advertisement body copy will show up here. Describe your product features and choose a copy tone.";
  const displayCta = cta || "Learn More";

  const renderMetaPreview = () => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-sm mx-auto font-sans text-left">
      {/* Header */}
      <div className="p-3.5 flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
          V
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-800 leading-none">
            {productName || "Veltrix Brand"}
          </span>
          <span className="text-[10px] text-slate-400 font-light mt-0.5 leading-none">
            Sponsored
          </span>
        </div>
      </div>
      
      {/* Ad Body */}
      <div className="px-3.5 pb-3.5 text-xs text-slate-700 leading-relaxed font-light">
        {displayBody}
      </div>

      {/* Ad Media/Image */}
      <div className="aspect-[1.91/1] bg-slate-100 border-y border-slate-150 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img src={imageUrl} alt="Ad creative" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-body text-slate-400 font-light">Ad Image Creative Placeholder</span>
        )}
      </div>

      {/* Footer / CTA Area */}
      <div className="p-3.5 bg-slate-50 flex items-center justify-between gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
            VELTRIX.COM
          </span>
          <span className="text-xs font-semibold text-slate-800 truncate mt-1 leading-tight">
            {displayHeadline}
          </span>
        </div>
        <button className="bg-slate-200/80 hover:bg-slate-200 border border-slate-300 text-[11px] font-semibold text-slate-800 rounded px-3.5 py-1.5 shrink-0 active:scale-95 transition-transform">
          {displayCta}
        </button>
      </div>
    </div>
  );

  const renderGooglePreview = () => (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm max-w-xl mx-auto font-sans text-left flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-500 font-medium">Google Ad</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span className="text-xs text-slate-800 font-semibold truncate">
          https://www.veltrix.com/{productName?.toLowerCase().replace(/\s+/g, "-") || "ad"}
        </span>
      </div>
      <h3 className="text-lg font-normal text-blue-800 hover:underline leading-tight">
        {displayHeadline}
      </h3>
      <p className="text-xs text-slate-600 leading-relaxed font-light">
        {displayBody}
      </p>
      {cta && (
        <span className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wide">
          Action: {displayCta}
        </span>
      )}
    </div>
  );

  const renderXPreview = () => (
    <div className="bg-white border border-slate-200 rounded-xl p-4.5 shadow-sm max-w-md mx-auto font-sans text-left flex gap-3">
      <div className="h-9 w-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
        V
      </div>
      <div className="flex flex-col gap-2 min-w-0">
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-xs font-bold text-slate-800">
            {productName || "Veltrix Brand"}
          </span>
          <span className="text-xs text-slate-400 font-light">
            @{productName?.toLowerCase().replace(/\s+/g, "") || "veltrix"}
          </span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ad</span>
        </div>
        <p className="text-xs text-slate-800 leading-relaxed font-light whitespace-pre-wrap">
          {displayBody}
        </p>
        
        {/* Media */}
        {imageUrl && (
          <div className="aspect-[16/9] rounded-xl bg-slate-100 overflow-hidden border border-slate-150 mt-1">
            <img src={imageUrl} alt="Ad creative" className="w-full h-full object-cover" />
          </div>
        )}

        <span className="text-[10px] font-semibold text-blue-500 hover:underline cursor-pointer self-start">
          {displayCta}
        </span>
      </div>
    </div>
  );

  const renderEmailPreview = () => (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm max-w-lg mx-auto font-sans text-left overflow-hidden flex flex-col">
      {/* Email Client Bar */}
      <div className="bg-slate-50 border-b border-slate-150 p-3.5 flex flex-col gap-1 text-[11px] font-body text-slate-500 font-light leading-none">
        <div>
          <span className="font-semibold text-slate-700">Subject: </span>
          <span className="text-slate-800 font-medium">{displayHeadline}</span>
        </div>
        <div className="mt-1">
          <span className="font-semibold text-slate-700">To: </span>
          <span>your-audience@veltrix.com</span>
        </div>
      </div>
      
      {/* Email Body */}
      <div className="p-6 flex flex-col gap-4 text-xs text-slate-700 leading-relaxed font-light">
        <p className="font-semibold text-slate-800">Dear Customer,</p>
        <p className="whitespace-pre-wrap">{displayBody}</p>
        
        {imageUrl && (
          <div className="w-full max-w-sm rounded-lg bg-slate-100 border border-slate-150 overflow-hidden my-2 self-center aspect-[2/1]">
            <img src={imageUrl} alt="Email creative banner" className="w-full h-full object-cover" />
          </div>
        )}

        <button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-xs font-semibold self-start shadow-sm mt-2 active:scale-97 transition-transform">
          {displayCta}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Metric predictions (if present) */}
      {(predictedCTR !== undefined || predictedCPA !== undefined || confidenceScore !== undefined) && (
        <div className="grid grid-cols-3 gap-3 border-b border-slate-100 pb-4">
          {predictedCTR !== undefined && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-lg font-heading italic text-slate-900 leading-none">
                {predictedCTR ? formatPercent(predictedCTR) : "—"}
              </span>
              <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-widest block mt-1 leading-none">
                Est. CTR
              </span>
            </div>
          )}
          {predictedCPA !== undefined && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-lg font-heading italic text-slate-900 leading-none">
                {predictedCPA ? formatCurrency(predictedCPA) : "—"}
              </span>
              <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-widest block mt-1 leading-none">
                Est. CPA
              </span>
            </div>
          )}
          {confidenceScore !== undefined && (
            <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-3 text-center">
              <span className="text-lg font-heading italic text-slate-900 leading-none">
                {confidenceScore ? `${confidenceScore}/100` : "—"}
              </span>
              <span className="text-[9px] font-body font-bold text-slate-400 uppercase tracking-widest block mt-1 leading-none">
                AI Confidence
              </span>
            </div>
          )}
        </div>
      )}

      {/* Simulated Preview Box */}
      <div>
        {channel === "meta" && renderMetaPreview()}
        {channel === "google" && renderGooglePreview()}
        {channel === "x" && renderXPreview()}
        {channel === "email" && renderEmailPreview()}
      </div>
    </div>
  );
}
