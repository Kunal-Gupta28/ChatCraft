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

    const idKey = message._id || message.id;
    const key = idKey
      ? String(idKey)
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
