const STORAGE_KEY = "netto-feedback-replies";

export function loadFeedbackReplies() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Gagal memuat balasan feedback:", error);
    return {};
  }
}

export function saveFeedbackReply(reviewKey, reply) {
  if (typeof window === "undefined") return;

  const currentReplies = loadFeedbackReplies();
  const updatedReplies = {
    ...currentReplies,
    [reviewKey]: reply,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReplies));
  return updatedReplies;
}

export function clearFeedbackReply(reviewKey) {
  if (typeof window === "undefined") return;

  const currentReplies = loadFeedbackReplies();
  const { [reviewKey]: _, ...rest } = currentReplies;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
  return rest;
}
