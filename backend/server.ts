import dotenv from "dotenv"
dotenv.config()

import fs from "fs"
import path from "path"

import axios from "axios"
import express from "express"
import type { Request, Response } from "express"
import cors from "cors"
import { keywordMap } from "./data/keywordMap"
import { calculateScore } from "./utils/calculateScore"
import { places } from "./data/places"
import { recommend } from "./utils/recommend"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/recommend", async (req: Request, res: Response) => {
    try {
        const mood = (req.query.mood || req.query.emotion) as string | undefined
        const place = req.query.place as string | undefined
        const lat = req.query.lat as string | undefined
        const lng = req.query.lng as string | undefined

        // Build keywords robustly:
        // - If both mood and place are provided and exist in map, use that.
        // - If only mood is provided, gather all keywords for that mood.
        // - Otherwise fallback to using mood/place string as single keyword.
        let keywords: string[] = []

        const moodAliases: Record<string, string> = {
            "피곤해요": "피곤/멍함",
            "우울해요": "슬픔/우울",
            "답답해요": "화남/답답",
            "설레요": "행복/설렘",
            "행복해요": "행복/설렘",
            "차분해요": "차분/안정",
            "편안해요": "차분/안정"
        }

        // Normalize incoming mood (e.g. "피곤해요", "우울해요") to the canonical keys
        // used in keywordMap / emotionWeights (e.g. "피곤/멍함", "슬픔/우울").
        const findCanonicalMoodKey = (m?: string) => {
            if (!m) return undefined
            const str = String(m)
            if (moodAliases[str]) return moodAliases[str]
            const keys = Object.keys(keywordMap)
            // try to match by token overlap
            for (const k of keys) {
                const parts = k.split(/[^\p{L}\p{N}]+/u).filter(Boolean)
                for (const p of parts) {
                    if (str.includes(p)) return k
                }
            }
            // fallback: check if any key contains the whole mood string
            for (const k of keys) {
                if (k.includes(str)) return k
            }
            return undefined
        }

        const canonicalMoodKey = findCanonicalMoodKey(mood as string)
        const moodMap = canonicalMoodKey ? (keywordMap as any)[canonicalMoodKey] : undefined
        if (moodMap && place && moodMap[place as string]) {
            keywords = moodMap[place as string]
        } else if (moodMap) {
            // collect all keywords under this mood
            keywords = (Object.values(moodMap) as string[][]).flat()
        } else if (place) {
            keywords = [place as string]
        } else if (mood) {
            keywords = [mood as string]
        } else {
            keywords = [""]
        }

        console.log("canonicalMoodKey:", canonicalMoodKey)
        console.log("검색 키워드:", keywords)
        console.log("mood:", mood)
        console.log("place:", place)
        console.log("isArray:", Array.isArray(keywords))

        const allDocuments: any[] = []

        for (const keyword of keywords) {

            console.log("검색중:", keyword)

            const response = await axios.get(
                "https://dapi.kakao.com/v2/local/search/keyword.json",
                {
                    headers: {
                        Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}`
                    },
                    params: {
                        query: keyword,
                        x: lng,
                        y: lat,
                        radius: 3000,
                        size: 10
                    }
                }
            )

            console.log("kakao response meta:", response.data.meta)
            console.log("kakao documents count:", response.data.documents?.length)

            allDocuments.push(
                ...response.data.documents
            )
        }

        const documents = Array.from(
            new Map(
                allDocuments.map(
                    (doc: any) => [
                        doc.id,
                        doc
                    ]
                )
            ).values()
        )

        const spots = documents.map((p: any) => {

            const score = calculateScore(
                (canonicalMoodKey as string) || (mood as string),
                p.category_name,
                Number(p.distance)
            )

            console.log(
                p.place_name,
                p.distance,
                p.category_name,
                score
            )

            return {
                name: p.place_name,
                address: p.road_address_name,
                distance: Number(p.distance),
                lat: Number(p.y),
                lng: Number(p.x),
                category: p.category_name,
                score
            }
        })

        spots.sort(
            (a: any, b: any) =>
                b.score - a.score
        )

        console.log(
            spots.map((s: any) => ({
                name: s.name,
                score: s.score
            }))
        )

        res.json(
            spots.slice(0, 10)
        )

    } catch (err: any) {

        console.log("에러 발생")

        console.log(
            err.response?.data
        )

        console.log(
            err.message
        )

        res.status(500).json({
            error: "카카오 API 실패"
        })
    }
})

app.post("/feedback", (req, res) => {
    const { mood, place, rating } = req.body

    const filePath = path.join(
        __dirname,
        "data",
        "feedback.json"
    )

    const feedbacks = JSON.parse(
        fs.readFileSync(
            filePath,
            "utf-8"
        )
    )

    feedbacks.push({
        mood,
        place,
        rating
    })

    fs.writeFileSync(
        filePath,
        JSON.stringify(
            feedbacks,
            null,
            2
        )
    )

    res.json({
        success: true
    })
})

app.listen(3000, () => {
    console.log("서버 실행")
})