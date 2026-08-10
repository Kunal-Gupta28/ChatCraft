import { memo, useState } from "react";
import { ExternalLink, RefreshCw, Globe, Copy, Check } from "lucide-react";

const PreviewPane = ({ iframeUrl }) => {
  const [key, setKey] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    if (!iframeUrl) return;
    navigator.clipboard.writeText(iframeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // if iframe Url is not present then show waiting for server...
  if (!iframeUrl)
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2.5 select-none bg-[#090d16]/90 p-4 text-center">
        <div className="w-9 h-9 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin" />
        <span className="text-xs font-mono text-slate-300">Waiting for WebContainer server to start...</span>
        <p className="text-[11px] text-slate-500 max-w-xs leading-relaxed">
          Click <span className="text-blue-400 font-semibold">Run</span> button in the top right to start Node.js server.
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-full w-full bg-[#090d16] select-none">
      {/* Top Address / Controls Bar */}
      <div className="h-9 px-3 border-b border-slate-800/80 bg-[#0d1322] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Globe size={13} className="text-cyan-400 shrink-0" />
          <span className="text-[11px] font-mono text-slate-300 truncate max-w-md bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {iframeUrl}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Copy Link Button */}
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy Live Preview URL"
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 transition cursor-pointer text-[10px] font-semibold"
          >
            {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => setKey((prev) => prev + 1)}
            title="Refresh Preview"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <RefreshCw size={13} />
          </button>

          {/* Open in New Tab Button */}
          <a
            href={iframeUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open preview in new tab"
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white transition cursor-pointer text-[10px] font-semibold shadow-sm"
          >
            <span>Open Tab</span>
            <ExternalLink size={11} />
          </a>
        </div>
      </div>

      {/* Preview Iframe */}
      <div className="flex-1 w-full h-full relative bg-white">
        <iframe
          key={`${iframeUrl}-${key}`}
          src={iframeUrl}
          sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
          allow="cross-origin-isolated; autoplay; camera; microphone; geolocation"
          className="w-full h-full border-0"
          title="Project Preview"
        />
      </div>
    </div>
  );
};

export default memo(PreviewPane);