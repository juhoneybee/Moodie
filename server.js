const express = require("express")
const cors = require("cors")

const app = express()
app.use(cors())

const KAKAO_REST_KEY = process.env.KAKAO_REST_KEY || "9990195802e2daeca3286221b4650b67"

// 감정 → 검색 키워드 매핑
const emotionKeywords = {
    "피곤해요": ["조용한 카페", "공원 산책", "북카페"],
    "우울해요": ["독립서점", "전시회", "분위기 좋은 카페"],
    "답답해요": ["산책로", "전망대", "루프탑 카페"],
    "설레요": ["맛집", "팝업스토어", "와인바"],
    "복잡해요": ["명상 카페", "공원", "조용한 카페"]
}

// 카카오 키워드 장소 검색 API 호출
async function searchPlaces(query, x, y, radius = 2000) {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json`
    const params = new URLSearchParams({
        query,
        x: String(x),
        y: String(y),
        radius: String(radius),
        size: "3",
        sort: "distance"
    })

    const res = await fetch(`${url}?${params}`, {
        headers: {
            Authorization: `KakaoAK ${KAKAO_REST_KEY}`
        }
    })

    if (!res.ok) {
        throw new Error(`Kakao API error: ${res.status}`)
    }

    return res.json()
}

// 추천 장소 API
app.get("/api/recommend", async (req, res) => {
    try {
        const { emotion, x, y } = req.query

        if (!emotion || !x || !y) {
            return res.status(400).json({
                error: "emotion, x, y 파라미터가 필요합니다"
            })
        }

        const keywords = emotionKeywords[emotion] || emotionKeywords["복잡해요"]

        // 각 키워드로 검색해서 결과 합치기
        const results = []

        for (const keyword of keywords) {
            try {
                const data = await searchPlaces(keyword, x, y)

                if (data.documents && data.documents.length > 0) {
                    // 이미 추가된 장소 중복 제거
                    const place = data.documents.find(
                        (doc) => !results.some((r) => r.id === doc.id)
                    )

                    if (place) {
                        results.push({
                            id: place.id,
                            name: place.place_name,
                            category: place.category_name.split(" > ").slice(-1)[0],
                            fullCategory: place.category_name,
                            address: place.road_address_name || place.address_name,
                            phone: place.phone,
                            distance: place.distance,
                            x: place.x,
                            y: place.y,
                            url: place.place_url
                        })
                    }
                }
            } catch (err) {
                console.error(`검색 실패 (${keyword}):`, err.message)
            }
        }

        // 결과가 3개 미만이면 일반 검색으로 보충
        if (results.length < 3) {
            try {
                const fallback = await searchPlaces("카페", x, y)
                for (const place of fallback.documents) {
                    if (results.length >= 3) break
                    if (!results.some((r) => r.id === place.id)) {
                        results.push({
                            id: place.id,
                            name: place.place_name,
                            category: place.category_name.split(" > ").slice(-1)[0],
                            fullCategory: place.category_name,
                            address: place.road_address_name || place.address_name,
                            phone: place.phone,
                            distance: place.distance,
                            x: place.x,
                            y: place.y,
                            url: place.place_url
                        })
                    }
                }
            } catch (err) {
                console.error("폴백 검색 실패:", err.message)
            }
        }

        res.json({
            emotion,
            count: results.length,
            places: results.slice(0, 3)
        })

    } catch (err) {
        console.error("추천 API 에러:", err)
        res.status(500).json({ error: "서버 오류" })
    }
})

// 상태 확인
app.get("/api/health", (req, res) => {
    res.json({ status: "ok" })
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
    console.log(`🟢 MOODMAP 백엔드 서버 실행 중: http://localhost:${PORT}`)
})
