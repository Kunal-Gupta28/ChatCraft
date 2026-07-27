import React from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#080b11] text-white flex items-center justify-center p-6 select-none relative overflow-hidden">
          {/* Ambient Background Flares */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="bg-[#0d121f]/90 border border-red-500/20 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-2xl max-w-md w-full text-center relative z-10">
            {/* Warning Icon Badge */}
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mx-auto mb-6 shadow-lg shadow-red-500/10">
              <AlertTriangle size={32} />
            </div>

            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-2">
              Something Went Wrong
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
              An unexpected application error occurred in this view. Don't worry, your work is safe.
            </p>

            {this.state.error?.message && (
              <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl text-left font-mono text-xs text-red-300 mb-6 overflow-x-auto max-h-32">
                <span className="text-slate-500 font-bold block mb-1">Error Details:</span>
                {this.state.error.message}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Try Again</span>
              </button>

              <a
                href="/dashboard"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Home size={15} />
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
