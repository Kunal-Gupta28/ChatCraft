import { memo, useState } from "react";
import { ExternalLink, RefreshCw, Globe } from "lucide-react";

const PreviewPane = ({ iframeUrl }) => {
  const [key, setKey] = useState(0);

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
      <div className="h-8 px-3 border-b border-slate-800/80 bg-[#0d1322] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Globe size={13} className="text-slate-400 shrink-0" />
          <span className="text-[11px] font-mono text-slate-400 truncate max-w-md">
            {iframeUrl}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => setKey((prev) => prev + 1)}
            title="Refresh Preview"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <RefreshCw size={13} />
          </button>

          {/* Open in New Tab Button (for local / blob previews) */}
          {iframeUrl && !iframeUrl.includes("webcontainer-api.io") && (
            <a
              href={iframeUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Open preview in new tab"
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-600/15 border border-blue-500/30 text-blue-400 hover:bg-blue-600/25 transition cursor-pointer text-[10px] font-semibold"
            >
              <span>Open in New Tab</span>
              <ExternalLink size={11} />
            </a>
          )}
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