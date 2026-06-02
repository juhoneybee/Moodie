import { useState, useRef, useEffect } from "react"
import { chatQuestions } from "../../data/chatQuestions"

type Place = {
    id: string
    name: string
    category: string
    address: string
    distance: string
    phone: string
    url: string
    x: string
    y: string
}

type Message = {
    role: "bot" | "user"
    text: string
    places?: Place[]
    emotion?: string
    loading?: boolean
}

function ChatTab() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "안녕하세요! 당신의 마음을 읽는 무디예요. ✨\n오늘 기분이 어때요?"
        }
    ])
    const [input, setInput] = useState("")
    const [showReco, setShowReco] = useState(false)
    const [recoEmotion, setRecoEmotion] = useState("")
    const [recoPlaces, setRecoPlaces] = useState<Place[]>([])
    const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    // 위치 가져오기
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({
                        x: pos.coords.longitude,
                        y: pos.coords.latitude
                    })
                },
                () => {
                    // 위치 거부 시 서울 기본값
                    setUserLocation({ x: 126.9780, y: 37.5665 })
                }
            )
        } else {
            setUserLocation({ x: 126.9780, y: 37.5665 })
        }
    }, [])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const detectMood = (text: string) => {
        const found = chatQuestions.find((item) =>
            item.keywords.some((keyword) => text.includes(keyword))
        )
        if (found) return found
        return {
            emotion: "복잡해요",
            reply: "조금 더 이야기해줄래요? 무디가 귀 기울이고 있어요.",
            places: ["☁️ 무드 스팟"]
        }
    }

    const fetchPlaces = async (emotion: string) => {
        if (!userLocation) return []

        try {
            const params = new URLSearchParams({
                emotion,
                x: String(userLocation.x),
                y: String(userLocation.y)
            })

            const res = await fetch(`http://localhost:4000/api/recommend?${params}`)
            const data = await res.json()
            return data.places || []
        } catch (err) {
            console.error("장소 추천 실패:", err)
            return []
        }
    }

    const formatDistance = (meters: string) => {
        const m = parseInt(meters)
        if (m < 1000) return `${m}m`
        return `${(m / 1000).toFixed(1)}km`
    }

    const getCategoryEmoji = (category: string) => {
        if (category.includes("카페") || category.includes("커피")) return "☕"
        if (category.includes("음식") || category.includes("맛집") || category.includes("식당")) return "🍽️"
        if (category.includes("서점") || category.includes("북")) return "📚"
        if (category.includes("공원") || category.includes("산책")) return "🌿"
        if (category.includes("전시") || category.includes("갤러리") || category.includes("미술")) return "🎨"
        if (category.includes("바") || category.includes("주점") || category.includes("와인")) return "🍷"
        if (category.includes("쇼핑") || category.includes("팝업")) return "🛍️"
        if (category.includes("전망")) return "🌊"
        return "📍"
    }

    const send = async () => {
        if (!input.trim()) return
        const userText = input
        setInput("")

        const result = detectMood(userText)
        const emotionKey = result.emotion

        // 유저 메시지 + 로딩 메시지 추가
        setMessages((prev) => [
            ...prev,
            { role: "user", text: userText },
            {
                role: "bot",
                text: `${result.reply}\n\n주변에서 기분에 맞는 곳을 찾고 있어요...`,
                loading: true
            }
        ])

        // 카카오 API로 실제 장소 검색
        const places = await fetchPlaces(emotionKey)

        // 로딩 메시지를 실제 결과로 교체
        setMessages((prev) => {
            const updated = prev.slice(0, -1)

            if (places.length > 0) {
                updated.push({
                    role: "bot",
                    text: `${result.reply}\n\n내 주변에서 ${emotionKey}을 달래줄 곳 ${places.length}군데를 찾았어!`,
                    emotion: emotionKey,
                    places: places
                })
            } else {
                updated.push({
                    role: "bot",
                    text: `${result.reply}\n\n근처에서 장소를 찾기 어려웠어요. 위치 권한을 확인해주세요!`
                })
            }

            return updated
        })

        if (places.length > 0) {
            setRecoEmotion(emotionKey)
            setRecoPlaces(places)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            send()
        }
    }

    const openRecoPanel = (emotion: string, places: Place[]) => {
        setRecoEmotion(emotion)
        setRecoPlaces(places)
        setShowReco(true)
    }

    return (
        <section className="h-full flex flex-col bg-[#f7f4ff] relative">

            {/* 헤더 */}
            <div className="px-6 pt-10 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B49FF] to-[#B381FF] flex items-center justify-center text-lg">
                        ☁️
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-[#6E31E8]">
                            MOODMAP
                        </h1>
                        <p className="text-xs text-purple-400">
                            무디가 귀 기울이고 있어요
                        </p>
                    </div>
                </div>
                <div className="text-xs text-purple-300 font-bold">
                    {new Date().toLocaleDateString("ko-KR", {
                        month: "long",
                        day: "numeric",
                        weekday: "short"
                    })}
                </div>
            </div>

            {/* 채팅 영역 */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-5 pb-28"
            >
                <div className="space-y-3 mt-2">
                    {messages.map((msg, i) => (
                        <div key={i}>
                            {msg.role === "bot" && (
                                <p className="text-[10px] text-purple-300 mb-1 ml-1">
                                    Moodi
                                </p>
                            )}

                            <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`
                                        max-w-[82%] px-5 py-4
                                        ${msg.role === "user"
                                            ? "bg-[#7B49FF] text-white rounded-[24px] rounded-tr-[8px]"
                                            : "bg-white text-[#4D278C] rounded-[24px] rounded-tl-[8px] shadow-sm"
                                        }
                                    `}
                                >
                                    {/* 로딩 표시 */}
                                    {msg.loading && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                            </div>
                                            <span className="text-xs text-purple-300">주변 장소 검색 중...</span>
                                        </div>
                                    )}

                                    <p className="whitespace-pre-line leading-relaxed">
                                        {msg.text}
                                    </p>

                                    {/* 실제 장소 추천 카드 */}
                                    {msg.places && msg.places.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.places.map((place) => (
                                                <button
                                                    key={place.id}
                                                    onClick={() => window.open(place.url, "_blank")}
                                                    className="
                                                        w-full
                                                        bg-[#f7f4ff]
                                                        rounded-2xl
                                                        px-4 py-3
                                                        text-left
                                                        flex items-center gap-3
                                                        active:scale-[0.98]
                                                        transition
                                                    "
                                                >
                                                    <div className="w-10 h-10 rounded-xl bg-[#EEE6FF] flex items-center justify-center text-xl shrink-0">
                                                        {getCategoryEmoji(place.category)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-black text-sm text-[#4D278C] truncate">
                                                            {place.name}
                                                        </p>
                                                        <p className="text-[11px] text-purple-400 truncate">
                                                            {place.category} · {formatDistance(place.distance)}
                                                        </p>
                                                    </div>
                                                    <span className="text-purple-300 text-xs shrink-0">→</span>
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => openRecoPanel(msg.emotion || "", msg.places || [])}
                                                className="
                                                    w-full
                                                    mt-1
                                                    bg-[#7B49FF]
                                                    text-white
                                                    rounded-2xl
                                                    py-2.5
                                                    text-xs
                                                    font-black
                                                "
                                            >
                                                📍 추천 큐레이션 자세히 보기
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 입력창 */}
            <div className="absolute bottom-28 left-4 right-4">
                <div className="flex gap-2 items-center">
                    <div className="flex-1 flex bg-white rounded-full shadow overflow-hidden">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="무디에게 이야기하기..."
                            className="flex-1 h-12 px-5 outline-none text-sm bg-transparent"
                        />
                        <button
                            onClick={send}
                            className="w-12 h-12 bg-gradient-to-r from-[#7B49FF] to-[#B381FF] text-white rounded-full flex items-center justify-center text-lg font-bold"
                        >
                            ▸
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== 추천 큐레이션 패널 ========== */}
            {showReco && (
                <div
                    className="absolute inset-0 z-50 flex flex-col"
                    style={{ animation: "slideUp 0.4s ease-out" }}
                >
                    <div
                        className="h-[80px] bg-black/30 backdrop-blur-sm"
                        onClick={() => setShowReco(false)}
                    />

                    <div className="flex-1 bg-gradient-to-b from-[#1A0038] to-[#2D0066] rounded-t-[32px] overflow-y-auto pb-10">
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 rounded-full bg-white/30" />
                        </div>

                        <div className="px-6 pt-2">
                            <p className="text-purple-300 text-sm font-bold">
                                {recoEmotion}을 달래줄
                            </p>
                            <h2 className="text-white text-2xl font-black mt-1">
                                추천 큐레이션 ✨
                            </h2>
                            <p className="text-purple-400 text-xs mt-2">
                                오늘의 감정 기반 · 내 주변 실제 장소
                            </p>
                        </div>

                        <div className="mt-6 px-5 space-y-4">
                            {recoPlaces.map((place) => (
                                <button
                                    key={place.id}
                                    onClick={() => window.open(place.url, "_blank")}
                                    className="
                                        w-full
                                        bg-white/10
                                        backdrop-blur
                                        rounded-[24px]
                                        p-5
                                        text-left
                                        border border-white/10
                                        active:scale-[0.98]
                                        transition
                                    "
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B49FF] to-[#B381FF] flex items-center justify-center text-2xl shrink-0">
                                            {getCategoryEmoji(place.category)}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-white text-lg font-black truncate">
                                                    {place.name}
                                                </h3>
                                                <span className="text-purple-300 text-xs font-bold shrink-0 ml-2">
                                                    {formatDistance(place.distance)}
                                                </span>
                                            </div>

                                            <p className="text-purple-300 text-xs mt-1">
                                                {place.category}
                                            </p>

                                            <p className="text-purple-400 text-xs mt-1 truncate">
                                                {place.address}
                                            </p>

                                            {place.phone && (
                                                <p className="text-purple-400 text-xs mt-1">
                                                    📞 {place.phone}
                                                </p>
                                            )}

                                            <div className="mt-3">
                                                <span className="text-[10px] font-bold text-[#B381FF] bg-[#7B49FF]/20 rounded-full px-2.5 py-1">
                                                    카카오맵에서 보기 →
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 px-6">
                            <button
                                onClick={() => setShowReco(false)}
                                className="w-full h-14 rounded-full bg-gradient-to-r from-[#7B49FF] to-[#B381FF] text-white text-lg font-black shadow-xl flex items-center justify-center gap-2"
                            >
                                <span>💬</span>
                                <span>무디와 더 대화하기</span>
                            </button>
                        </div>
                    </div>

                    <style>{`
                        @keyframes slideUp {
                            from { transform: translateY(100%); }
                            to { transform: translateY(0); }
                        }
                    `}</style>
                </div>
            )}
        </section>
    )
}

export default ChatTab
