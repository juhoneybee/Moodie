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
        const mood = req.query.mood
        const place = req.query.place
        const lat = req.query.lat
        const lng = req.query.lng
        const keyword = (keywordMap as any)[mood as string]?.[place as string] || place

        console.log("검색 키워드:", keyword)
        console.log("mood:", mood)
        console.log("place:", place)
        console.log("keyword:", keyword)

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

        const spots = response.data.documents.map((p: any) => {
            const score = calculateScore(
                mood as string,
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

        spots.sort((a: any, b: any) => b.score - a.score)

        console.log(
            spots.map((s: any) => ({
                name: s.name,
                score: s.score
            }))
        )

        res.json(spots.slice(0, 5))

    } catch (err: any) {
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