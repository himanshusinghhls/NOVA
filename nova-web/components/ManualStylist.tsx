"use client"

import { useState } from "react"
import OutfitGrid from "./OutfitGrid"
import {
  getRecommendations,
  OutfitItem,
  RecommendationInput
} from "../lib/api"

export default function ManualStylist() {

  const [results, setResults] = useState<OutfitItem[] | null>(null)

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<RecommendationInput>({
    gender: "male",
    age_group: "young",
    occasion: "casual",
    skin_tone: "medium",
    style: "streetwear"
  })

  async function submit() {

    setLoading(true)

    try {

      const res = await getRecommendations(form)

      setResults(res.results)

    } catch (err) {

      console.error(err)

      alert("Recommendation failed")

    }

    setLoading(false)

  }

  return (

    <div className="glass p-6">

      <h2 className="text-xl font-bold mb-4">
        Manual Stylist
      </h2>

      <select
        className="bg-black p-2 w-full mb-2"
        value={form.gender}
        onChange={(e) =>
          setForm({ ...form, gender: e.target.value })
        }
      >

        <option value="male">Male</option>
        <option value="female">Female</option>

      </select>

      <select
        className="bg-black p-2 w-full mb-2"
        value={form.occasion}
        onChange={(e) =>
          setForm({ ...form, occasion: e.target.value })
        }
      >

        <option value="casual">Casual</option>
        <option value="party">Party</option>
        <option value="formal">Formal</option>

      </select>

      <select
        className="bg-black p-2 w-full mb-2"
        value={form.skin_tone}
        onChange={(e) =>
          setForm({ ...form, skin_tone: e.target.value })
        }
      >

        <option value="fair">Fair</option>
        <option value="light">Light</option>
        <option value="medium">Medium</option>
        <option value="dark">Dark</option>

      </select>

      <button
        onClick={submit}
        className="bg-blue-500 px-4 py-2 rounded mt-2 w-full"
      >

        {loading ? "Finding outfits..." : "Find Outfits"}

      </button>

      {/* Results */}

      {results && <OutfitGrid items={results} />}

    </div>

  )
}