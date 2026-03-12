"use client"

import { useState } from "react"
import { analyzeImage, ImageAnalysisResponse } from "../lib/api"

export default function UploadStylist() {

  const [file, setFile] = useState<File | null>(null)

  const [data, setData] = useState<ImageAnalysisResponse | null>(null)

  const [loading, setLoading] = useState(false)

  async function upload() {

    if (!file) return

    setLoading(true)

    try {

      const res = await analyzeImage(file)

      setData(res)

    } catch (err) {

      console.error(err)

      alert("Image analysis failed")

    }

    setLoading(false)
  }

  return (

    <div className="glass p-6">

      <h2 className="text-xl font-bold mb-4">
        AI Photo Stylist
      </h2>

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button
        onClick={upload}
        className="bg-purple-500 px-4 py-2 mt-3 rounded"
      >

        {loading ? "Analyzing..." : "Analyze Photo"}

      </button>

      {data && (

        <div className="mt-4">

          <p>
            Age: {data.age}
          </p>

          <p>
            Gender: {data.gender}
          </p>

          <div className="flex gap-2 mt-2">

            {data.palette.map((color, i) => (

              <div
                key={i}
                className="w-8 h-8 rounded"
                style={{ backgroundColor: color }}
              />

            ))}

          </div>

        </div>

      )}

    </div>

  )
}