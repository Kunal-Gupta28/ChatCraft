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
          className={`inline-flex items-center rounded-md px-1.5 py-0.5 mx-0.5 text-[11px] font-semibold leading-none border ${
            isMe
              ? "bg-amber-400/10 text-amber-200 border-amber-300/25"
              : isAI
              ? "bg-cyan-400/10 text-cyan-200 border-cyan-300/25"
              : "bg-slate-700/35 text-slate-200 border-slate-600/35"
          }`}
        >
          {part}
        </span>
      );
    }
    return part;
  });
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
