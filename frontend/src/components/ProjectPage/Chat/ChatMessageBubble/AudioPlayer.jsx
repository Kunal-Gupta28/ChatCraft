import { useState, useRef, useEffect, memo } from "react";
import { Play, Pause, Mic } from "lucide-react";

const formatAudioDuration = (seconds) => {
  const totalSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  return `0:${String(totalSeconds).padStart(2, "0")}`;
};

let activeAudioElement = null;

const stopAllAudios = () => {
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
    } catch {}
    activeAudioElement = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

const AudioPlayer = ({ audioUrl, duration, isMine }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef(null);
  const blobUrlRef = useRef(null);
  const [resolvedSrc, setResolvedSrc] = useState(null);

  // Convert base64 data URL to blob URL for smooth native playback
  useEffect(() => {
    if (!audioUrl || typeof audioUrl !== "string") {
      setResolvedSrc(audioUrl);
      return;
    }

    if (!audioUrl.startsWith("data:audio")) {
      setResolvedSrc(audioUrl);
      return;
    }

    try {
      const parts = audioUrl.split(",");
      const match = parts[0].match(/:(.*?);/);
      const mime = match ? match[1] : "audio/webm";
      const binary = atob(parts[1]);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      const url = URL.createObjectURL(blob);
      blobUrlRef.current = url;
      setResolvedSrc(url);
    } catch {
      setResolvedSrc(audioUrl);
    }

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !resolvedSrc) return;

    try { el.load(); } catch {}

    const onPlay = () => {
      if (activeAudioElement && activeAudioElement !== el) {
        try { activeAudioElement.pause(); } catch {}
      }
      activeAudioElement = el;
      setIsPlaying(true);
    };

    const onPause = () => {
      if (activeAudioElement === el) {
        activeAudioElement = null;
      }
      setIsPlaying(false);
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      if (activeAudioElement === el) {
        activeAudioElement = null;
      }
    };
  }, [resolvedSrc]);

  if (!audioUrl || !resolvedSrc) return null;

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
    } else {
      stopAllAudios();
      try {
        if (el.ended || (el.duration && el.currentTime >= el.duration)) {
          el.currentTime = 0;
        }
        await el.play();
      } catch (err) {
        console.warn("Audio playback failed:", err);
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const toggleSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = nextRate;
    }
  };

  const handleSeek = (e) => {
    const el = audioRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    const targetDuration = el.duration || duration || 0;
    if (targetDuration) {
      el.currentTime = percent * targetDuration;
      setCurrentTime(el.currentTime);
    }
  };

  const progressPercent = audioRef.current?.duration || duration
    ? Math.min(100, (currentTime / (audioRef.current?.duration || duration)) * 100)
    : 0;

  return (
    <div className={`w-[220px] xs:w-[240px] rounded-xl p-2 font-sans select-none border transition-all ${
      isMine
        ? "bg-slate-900/60 border-cyan-400/30 text-white"
        : "bg-slate-950/80 border-slate-800 text-slate-200"
    }`}>
      <audio
        ref={audioRef}
        src={resolvedSrc}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="auto"
        playsInline
      />

      <div className="flex items-center gap-2">
        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 cursor-pointer shrink-0 shadow-md ${
            isMine
              ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950"
              : "bg-gradient-to-tr from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/20"
          }`}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <Pause size={14} fill="currentColor" />
          ) : (
            <Play size={14} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        {/* Waveform & Seekbar */}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div
            onClick={handleSeek}
            className="group flex items-center gap-0.5 h-4 cursor-pointer overflow-hidden relative py-1"
            title="Seek audio"
          >
            {[40, 70, 30, 90, 50, 80, 100, 60, 40, 80, 50, 90, 30, 60, 40].map((height, i) => {
              const barPercent = ((i + 1) / 15) * 100;
              const isFilled = progressPercent >= barPercent;
              return (
                <span
                  key={i}
                  className={`flex-1 rounded-full transition-all duration-150 ${
                    isFilled
                      ? isMine ? "bg-cyan-300" : "bg-cyan-400"
                      : isMine ? "bg-slate-700/80" : "bg-slate-800"
                  } ${isPlaying && isFilled ? "animate-pulse" : ""}`}
                  style={{
                    height: isPlaying ? `${Math.max(25, height * (i % 2 === 0 ? 1 : 0.7))}%` : `${height * 0.4}%`,
                  }}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 px-0.5">
            <span className="flex items-center gap-1">
              <Mic size={10} className="text-cyan-400 shrink-0" />
              <span>{formatAudioDuration(currentTime)}</span>
            </span>
            <span>{formatAudioDuration(duration || audioRef.current?.duration)}</span>
          </div>
        </div>

        {/* Speed Button */}
        <button
          type="button"
          onClick={toggleSpeed}
          className="px-1.5 py-0.5 rounded-lg bg-slate-800/90 border border-slate-700/80 text-cyan-300 font-mono text-[9px] font-bold hover:bg-slate-700 transition cursor-pointer shrink-0"
        >
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};

export default memo(AudioPlayer);
