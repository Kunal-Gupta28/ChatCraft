import React from "react";
import { AlertCircle, RotateCcw, Home, Copy, Check } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  handleCopyError = () => {
    const errorText = `ChatCraft Error:\n${this.state.error?.message}\n\nStack:\n${this.state.error?.stack}`;
    navigator.clipboard.writeText(errorText);
    this.setState({ copied: true });
    setTimeout(() => this.setState({ copied: false }), 2000);
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[100dvh] bg-[#07090e] text-slate-100 flex items-center justify-center p-4 sm:p-6 select-none font-sans">
          <div className="w-full max-w-md rounded-2xl border border-slate-800/90 bg-[#0c0f17] p-6 shadow-2xl backdrop-blur-xl">
            {/* Minimal Header */}
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-wider">
                  Application Error
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">
                React Boundary
              </span>
            </div>

            {/* Title & Description */}
            <div className="mb-5">
              <div className="flex items-center gap-2.5 mb-1.5">
                <AlertCircle size={18} className="text-rose-400 shrink-0" />
                <h3 className="text-base font-semibold text-white tracking-tight">
                  Something went wrong
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-7">
                An unhandled error occurred in this view. You can reload the page or return to the dashboard.
              </p>
            </div>

            {/* Error Message Box */}
            {this.state.error?.message && (
              <div className="mb-5 rounded-xl border border-slate-800/80 bg-[#06080f] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono font-medium text-slate-500 uppercase">
                    Details
                  </span>
                  <button
                    type="button"
                    onClick={this.handleCopyError}
                    className="flex items-center gap-1 text-[10px] font-mono text-slate-400 hover:text-white transition cursor-pointer"
                  >
                    {this.state.copied ? (
                      <>
                        <Check size={11} className="text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={11} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-mono text-xs text-rose-300/90 break-words leading-normal max-h-28 overflow-y-auto selection:bg-rose-900/40">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-2 px-3.5 rounded-lg bg-white text-black font-medium text-xs hover:bg-slate-200 transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm active:scale-[0.98]"
              >
                <RotateCcw size={13} />
                <span>Try Again</span>
              </button>

              <a
                href="/dashboard"
                className="flex-1 py-2 px-3.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.98]"
              >
                <Home size={13} />
                <span>Dashboard</span>
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
