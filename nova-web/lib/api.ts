const API = "https://nova-backend-neec.onrender.com"

export interface RecommendationInput {
  gender: string
  age_group: string
  occasion: string
  skin_tone: string
  style: string
}

export interface OutfitItem {
  item: string
  brand: string
  price: number
  image_url: string
  product_url: string
}

export interface RecommendationResponse {
  results: OutfitItem[]
}

export interface ImageAnalysisResponse {
  age: number
  gender: string
  palette: string[]
}

export interface OutfitScoreResponse {
  score: number
  feedback: string
}

export async function getRecommendations(
  data: RecommendationInput
): Promise<RecommendationResponse> {

  const res = await fetch(`${API}/recommend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })

  if (!res.ok) {
    throw new Error("Recommendation API failed")
  }

  return res.json()
}

export async function analyzeImage(
  file: File
): Promise<ImageAnalysisResponse> {

  const form = new FormData()

  form.append("file", file)

  const res = await fetch(`${API}/analyze-image`, {
    method: "POST",
    body: form
  })

  if (!res.ok) {
    throw new Error("Image analysis failed")
  }

  return res.json()
}

export async function rateOutfit(
  file: File
): Promise<OutfitScoreResponse> {

  const form = new FormData()

  form.append("file", file)

  const res = await fetch(`${API}/rate-outfit`, {
    method: "POST",
    body: form
  })

  if (!res.ok) {
    throw new Error("Outfit rating failed")
  }

  return res.json()
}