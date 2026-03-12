const API = "https://nova-backend-neec.onrender.com";

export interface RecommendationInput {
  gender: string; age_group: string; occasion: string; skin_tone: string; style: string;
}

export async function getRecommendations(data: RecommendationInput) {
  const res = await fetch(`${API}/recommend`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error("Database waking up. Try again in 10s.");
  return res.json();
}

export async function analyzeImage(file: File) {
  const form = new FormData(); form.append("file", file);
  const res = await fetch(`${API}/analyze-image`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Vision engine waking up.");
  return res.json();
}

export async function rateOutfit(file: File) {
  const form = new FormData(); form.append("file", file);
  const res = await fetch(`${API}/rate-outfit`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Outfit rating engine offline.");
  return res.json();
}