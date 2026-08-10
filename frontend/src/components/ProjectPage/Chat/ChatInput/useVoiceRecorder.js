import { useState, useRef, useCallback } from "react";

const MAX_RECORDING_SECONDS = 60;

const toDataUrl = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not prepare the voice note"));
    reader.readAsDataURL(blob);
  });

export const useVoiceRecorder = (handleSendVoiceMessage) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioError, setAudioError] = useState("");

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingTimerRef = useRef(null);
  const autoStopTimerRef = useRef(null);
  const recordingStartedAtRef = useRef(0);
  const shouldSendVoiceRef = useRef(true);

  const clearRecordingTimers = useCallback(() => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  }, []);

  const releaseMicrophone = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const completeRecording = useCallback(async (sendToAI = false) => {
    clearRecordingTimers();
    releaseMicrophone();
    setIsRecording(false);

    const recorder = mediaRecorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    const stopPromise = new Promise((resolve) => {
      recorder.onstop = resolve;
    });

    recorder.stop();
    await stopPromise;

    if (!shouldSendVoiceRef.current) return;

    const chunks = audioChunksRef.current;
    if (!chunks.length) return;

    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    if (blob.size === 0) return;

    try {
      const dataUrl = await toDataUrl(blob);
      const elapsedSeconds = Math.max(
        1,
        Math.round((Date.now() - recordingStartedAtRef.current) / 1000)
      );

      if (typeof handleSendVoiceMessage === "function") {
        await handleSendVoiceMessage({
          audioUrl: dataUrl,
          audioDuration: elapsedSeconds,
          sendToAI,
        });
      }
    } catch (err) {
      setAudioError(err.message || "Failed to send voice note");
    }
  }, [clearRecordingTimers, releaseMicrophone, handleSendVoiceMessage]);

  const startRecording = useCallback(async () => {
    setAudioError("");
    shouldSendVoiceRef.current = true;
    audioChunksRef.current = [];

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setAudioError("Microphone recording is not supported in this browser.");
      return;
    }

    let stream;
    try {
      // Request mic permission FIRST — don't show recording UI until granted
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setAudioError("Could not access microphone. Please check browser permissions.");
      return;
    }

    // Only enter recording state AFTER permission is granted
    mediaStreamRef.current = stream;

    const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
      ? "audio/webm;codecs=opus"
      : MediaRecorder.isTypeSupported("audio/mp4")
      ? "audio/mp4"
      : "";

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    recorder.start(100);
    recordingStartedAtRef.current = Date.now();

    // NOW set recording state — mic is confirmed active
    setIsRecording(true);
    setRecordingSeconds(0);

    recordingTimerRef.current = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);

    autoStopTimerRef.current = setTimeout(() => {
      completeRecording(false);
    }, MAX_RECORDING_SECONDS * 1000);
  }, [completeRecording, releaseMicrophone]);

  const cancelRecording = useCallback(() => {
    shouldSendVoiceRef.current = false;
    clearRecordingTimers();
    releaseMicrophone();

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  }, [clearRecordingTimers, releaseMicrophone]);

  return {
    isRecording,
    recordingSeconds,
    audioError,
    startRecording,
    cancelRecording,
    completeRecording,
  };
};
