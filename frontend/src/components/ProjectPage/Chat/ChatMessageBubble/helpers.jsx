import { Sparkles, UserCheck } from "lucide-react";

export const renderMessageWithMentions = (text, currentUsername) => {
  if (typeof text !== "string") return text;
  const parts = text.split(/(@[a-zA-Z0-9_-]+)/g);

  return parts.map((part, index) => {
    if (part.startsWith("@")) {
      const isAI = part.toLowerCase() === "@ai";
      const isMe = currentUsername && part.toLowerCase() === `@${currentUsername.toLowerCase()}`;
      return (
        <span
          key={index}
          className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 mx-0.5 text-[11px] font-bold leading-tight border transition-all shadow-xs ${
            isMe
              ? "bg-gradient-to-r from-purple-500/25 to-pink-500/25 text-purple-200 border-purple-400/40 shadow-purple-500/20"
              : isAI
              ? "bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 border-cyan-400/40 shadow-cyan-500/20"
              : "bg-indigo-500/20 text-indigo-200 border-indigo-500/30"
          }`}
        >
          {isAI ? <Sparkles size={11} className="text-cyan-300 animate-pulse shrink-0" /> : null}
          {isMe ? <UserCheck size={11} className="text-purple-300 shrink-0" /> : null}
          <span>{part}</span>
        </span>
      );
    }
    return part;
  });
};

export const groupReactions = (reactions = []) => {
  if (!Array.isArray(reactions) || reactions.length === 0) return [];
  const map = new Map();
  for (const r of reactions) {
    if (!r?.emoji) continue;
    const count = map.get(r.emoji) || 0;
    map.set(r.emoji, count + 1);
  }
  return Array.from(map.entries()).map(([emoji, count]) => ({ emoji, count }));
};

export const getAppliedKey = (msgObj, pId) => {
  const projId = pId || msgObj?.projectId || msgObj?.project || "global";
  return `applied_suggestions_${projId}`;
};

export const checkIsApplied = (msgObj, pId) => {
  if (!msgObj) return false;
  if (msgObj.isApplied || msgObj.applied) return true;
  const msgId = msgObj._id || msgObj.id;
  if (!msgId) return false;
  try {
    const key = getAppliedKey(msgObj, pId);
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    return list.includes(String(msgId));
  } catch {
    return false;
  }
};

export const markAsApplied = (msgObj, pId) => {
  if (!msgObj) return;
  const msgId = msgObj._id || msgObj.id;
  if (!msgId) return;
  try {
    const key = getAppliedKey(msgObj, pId);
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const idStr = String(msgId);
    if (!list.includes(idStr)) {
      list.push(idStr);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    console.error("Failed to store applied suggestion:", e);
  }
};

export const getCancelledKey = (msgObj, pId) => {
  const projId = pId || msgObj?.projectId || msgObj?.project || "global";
  return `cancelled_suggestions_${projId}`;
};

export const checkIsCancelled = (msgObj, pId) => {
  if (!msgObj) return false;
  const msgId = msgObj._id || msgObj.id;
  if (!msgId) return false;
  try {
    const key = getCancelledKey(msgObj, pId);
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    return list.includes(String(msgId));
  } catch {
    return false;
  }
};

export const markAsCancelled = (msgObj, pId) => {
  if (!msgObj) return;
  const msgId = msgObj._id || msgObj.id;
  if (!msgId) return;
  try {
    const key = getCancelledKey(msgObj, pId);
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const idStr = String(msgId);
    if (!list.includes(idStr)) {
      list.push(idStr);
      localStorage.setItem(key, JSON.stringify(list));
    }
  } catch (e) {
    console.error("Failed to store cancelled suggestion:", e);
  }
};

export const unmarkAsCancelled = (msgObj, pId) => {
  if (!msgObj) return;
  const msgId = msgObj._id || msgObj.id;
  if (!msgId) return;
  try {
    const key = getCancelledKey(msgObj, pId);
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    const idStr = String(msgId);
    const updated = list.filter((id) => id !== idStr);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to remove cancelled suggestion:", e);
  }
};

export const stopAllAudios = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};
