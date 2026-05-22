export const chatQuestions = [
    {
        keywords: ["피곤", "지쳐", "힘들"],
        emotion: "피곤해요",
        reply: "오늘은 에너지를 조금 아껴야겠어요 ☁️",
        places: ["🌿 공원 산책", "☕ 조용한 카페", "📚 북카페"]
    },
    {
        keywords: ["우울", "슬퍼"],
        emotion: "우울해요",
        reply: "괜찮아요. 지금 감정을 같이 들여다볼게요.",
        places: ["🌳 한강 산책", "🎨 전시", "☕ 햇빛 좋은 카페"]
    },
    {
        keywords: ["답답", "짜증"],
        emotion: "답답해요",
        reply: "조금 환기할 공간이 필요해 보여요.",
        places: ["🚶 산책로", "🌊 전망 좋은 곳", "🍃 공원"]
    },
    {
        keywords: ["설레", "행복"],
        emotion: "설레요",
        reply: "좋은 에너지가 느껴져요 ✨",
        places: ["🍝 맛집", "🛍 쇼핑", "🍷 분위기 바"]
    }
]

// keyword가 포함된 사용자의 답변 -> emotion 매칭 -> reply + places 반환