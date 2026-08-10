const extractId = (m) => {
  if (!m) return "";
  if (typeof m._id === "string") return m._id;
  if (m._id && typeof m._id === "object") {
    if (m._id._id) return String(m._id._id);
    if (typeof m._id.toString === "function") return m._id.toString();
  }
  if (typeof m.id === "string") return m.id;
  if (m.id && typeof m.id === "object") {
    if (typeof m.id.toString === "function") return m.id.toString();
  }
  return "";
};

export const mergeMessages = (current = [], incoming = []) => {
  const merged = new Map();

  for (const rawMessage of [...current, ...incoming]) {
    if (!rawMessage) continue;
    let message = rawMessage;
    try {
      message = JSON.parse(JSON.stringify(rawMessage));
    } catch {
      message = { ...rawMessage };
    }

    const idKey = extractId(message);
    const key = idKey
      ? idKey
      : `${message.senderId || message.senderName}-${new Date(message.createdAt || 0).getTime()}`;

    if (merged.has(key)) {
      merged.set(key, { ...merged.get(key), ...message });
    } else {
      merged.set(key, { ...message });
    }
  }

  return [...merged.values()].sort(
    (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
  );
};
