export const triggerHaptic = () => {
  if (typeof window !== "undefined" && navigator.vibrate) {
    navigator.vibrate(40);
  }
};