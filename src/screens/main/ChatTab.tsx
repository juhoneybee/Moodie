import { useState, useRef, useEffect } from "react"
import { chatQuestions } from "../../data/chatQuestions"

const BASE = "/Moodie/"

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

const quickChips = [
    { text: "\uBE44\uAC00 \uC640\uC11C \uC6B0\uC6B8\uD574", color: "#EDE6FF", textColor: "#6E31E8" },
    { text: "\uC77C\uC774 \uB9CE\uC544\uC11C \uC9C0\uCCD0", color: "#EDE6FF", textColor: "#6E31E8" },
    { text: "\uD63C\uC790 \uC788\uACE0 \uC2F6\uC5B4", color: "#EDE6FF", textColor: "#6E31E8" },
    { text: "\uAE30\uBD84 \uC804\uD658\uC774 \uD544\uC694\uD574", color: "#EDE6FF", textColor: "#6E31E8" },
    { text: "\uC124\uB808\uB294 \uD558\uB8E8\uC57C!", color: "#FDE6F0", textColor: "#D64B8A" },
]

function ChatTab() {
    const [started, setStarted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [showReco, setShowReco] = useState(false)
    const [recoEmotion, setRecoEmotion] = useState("")
    const [recoPlaces, setRecoPlaces] = useState<Place[]>([])
    const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => setUserLocation({ x: pos.coords.longitude, y: pos.coords.latitude }),
            () => setUserLocation({ x: 126.9780, y: 37.5665 })
        )
    } else {
        // 동기 setState 제거 → setTimeout으로 감싸기
        setTimeout(() => setUserLocation({ x: 126.9780, y: 37.5665 }), 0)
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
            emotion: "\uBCF5\uC7A1\uD574\uC694",
            reply: "\uC870\uAE08 \uB354 \uC774\uC57C\uAE30\uD574\uC990\uB798\uC694? \uBB34\uB514\uAC00 \uADC0 \uAE30\uC6B8\uC774\uACE0 \uC788\uC5B4\uC694.",
            places: ["\u2601\uFE0F \uBB34\uB4DC \uC2A4\uD31F"]
        }
    }

    const fetchPlaces = async (emotion: string) => {
        if (!userLocation) return []
        try {
            const params = new URLSearchParams({
                mood: emotion,
                place: "",
                lat: String(userLocation.y),
                lng: String(userLocation.x)
            })
            const url = `https://moodie-api.onrender.com/recommend?${params}`
            console.log("fetchPlaces -> url:", url)
            const res = await fetch(url)
            console.log("fetchPlaces -> status:", res.status)
            const data = await res.json()
            console.log("fetchPlaces -> raw response:", data)

            const arr = Array.isArray(data) ? data : (data.places || [])

            // map backend place shape to frontend `Place` type
            const mapped: Place[] = arr.map((p: any, idx: number) => ({
                id: String(p.id ?? p.place_id ?? p.name ?? idx),
                name: p.name ?? p.place_name ?? "",
                category: p.category ?? p.category_name ?? "",
                address: p.address ?? p.road_address_name ?? p.address_name ?? "",
                distance: String(p.distance ?? p.dist ?? 0),
                phone: p.phone ?? "",
                url: p.url ?? "",
                x: String(p.lng ?? p.x ?? p.longitude ?? ""),
                y: String(p.lat ?? p.y ?? p.latitude ?? "")
            }))

            console.log("fetchPlaces -> mapped places:", mapped)
            return mapped
        } catch  {
            return []
        }
    }

    const formatDistance = (meters: string) => {
        const m = parseInt(meters)
        if (m < 1000) return m + "m"
        return (m / 1000).toFixed(1) + "km"
    }

    const getCategoryEmoji = (category: string) => {
        if (category.includes("\uCE74\uD398") || category.includes("\uCEE4\uD53C")) return "\u2615"
        if (category.includes("\uC74C\uC2DD") || category.includes("\uC2DD\uB2F9")) return "\uD83C\uDF7D\uFE0F"
        if (category.includes("\uC11C\uC810")) return "\uD83D\uDCDA"
        if (category.includes("\uACF5\uC6D0")) return "\uD83C\uDF3F"
        if (category.includes("\uC804\uC2DC") || category.includes("\uBBF8\uC220")) return "\uD83C\uDFA8"
        if (category.includes("\uBC14") || category.includes("\uC8FC\uC810")) return "\uD83C\uDF77"
        return "\uD83D\uDCCD"
    }

    const sendMessage = async (text: string) => {
        if (!text.trim()) return

        if (!started) {
            setStarted(true)
            setMessages([
                { role: "bot", text: "\uC548\uB155\uD558\uC138\uC694! \uB2F9\uC2E0\uC758 \uB9C8\uC74C\uC744 \uC77D\uB294 \uBB34\uB514\uC608\uC694. \u2728" }
            ])
        }

        const result = detectMood(text)
        const emotionKey = result.emotion

        setMessages((prev) => [
            ...prev,
            { role: "user", text: text },
            {
                role: "bot",
                text: result.reply + "\n\n\uC8FC\uBCC0\uC5D0\uC11C \uAE30\uBD84\uC5D0 \uB9DE\uB294 \uACF3\uC744 \uCC3E\uACE0 \uC788\uC5B4\uC694...",
                loading: true
            }
        ])

        const places = await fetchPlaces(emotionKey)

        setMessages((prev) => {
            const updated = prev.slice(0, -1)
            if (places.length > 0) {
                updated.push({
                    role: "bot",
                    text: result.reply + "\n\n\uB0B4 \uC8FC\uBCC0\uC5D0\uC11C " + emotionKey + "\uC744 \uB2AC\uB798\uC904 \uACF3 " + places.length + "\uAD70\uB370\uB97C \uCC3E\uC558\uC5B4!",
                    emotion: emotionKey,
                    places: places
                })
            } else {
                updated.push({
                    role: "bot",
                    text: result.reply + "\n\n\uADFC\uCC98\uC5D0\uC11C \uC7A5\uC18C\uB97C \uCC3E\uAE30 \uC5B4\uB824\uC6E0\uC5B4\uC694. \uC704\uCE58 \uAD8C\uD55C\uC744 \uD655\uC778\uD574\uC8FC\uC138\uC694!"
                })
            }
            return updated
        })

        if (places.length > 0) {
            setRecoEmotion(emotionKey)
            setRecoPlaces(places)
        }
    }

    const handleSend = () => {
        if (!input.trim()) return
        const text = input
        setInput("")
        sendMessage(text)
    }

    const handleChip = (text: string) => {
        sendMessage(text)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
            handleSend()
        }
    }

    /* ===== 초기 화면 (대화 시작 전) ===== */
    if (!started) {
        return (
            <section className="h-full flex flex-col bg-[#FAFAFE] relative">
                <div className="flex-1 overflow-y-auto pb-28">

                    {/* 무디 캐릭터 + 말풍선 */}
                    <div className="flex flex-col items-center pt-14 px-6">
                        {/* 말풍선 */}
                        <div
                            className="relative px-5 py-3 rounded-[20px] mb-3"
                            style={{
                                background: "#fff",
                                border: "1.5px solid #EDE6FF",
                                boxShadow: "0 2px 12px rgba(123,73,255,0.06)"
                            }}
                        >
                            <p className="text-sm font-bold" style={{ color: "#4D278C" }}>
                                {"\uC624\uB298\uC740 \uC5B4\uB5A4 \uD558\uB8E8\uC600\uB098\uC694?"} ☁️
                            </p>
                            {/* 말풍선 꼬리 */}
                            <div
                                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45"
                                style={{
                                    background: "#fff",
                                    borderRight: "1.5px solid #EDE6FF",
                                    borderBottom: "1.5px solid #EDE6FF"
                                }}
                            />
                        </div>

                        {/* 무디 이미지 */}
                        <img
                            src={BASE + "moodie_smile.png"}
                            className="w-40"
                            style={{
                                filter: "drop-shadow(0 12px 30px rgba(123,73,255,0.2))",
                                animation: "float 3s ease-in-out infinite"
                            }}
                        />

                        {/* 타이틀 */}
                        <h1
                            className="mt-6 text-center text-[28px] font-black leading-tight"
                            style={{ color: "#2D1654", letterSpacing: "-1px" }}
                        >
                            {"\uBB34\uB514\uC5D0\uAC8C"}<br />{"\uC774\uC57C\uAE30\uD574\uBCF4\uC138\uC694"}
                        </h1>
                    </div>

                    {/* 입력창 */}
                    <div className="px-6 mt-8">
                        <div
                            className="flex items-center rounded-full overflow-hidden"
                            style={{
                                background: "#fff",
                                border: "1.5px solid #EDE6FF",
                                boxShadow: "0 2px 16px rgba(123,73,255,0.06)",
                                padding: "4px 4px 4px 20px"
                            }}
                        >
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={"\uC608) \uC624\uB298 \uBE44\uAC00 \uC640\uC11C \uC880 \uC6B0\uC6B8\uD574..."}
                                className="flex-1 outline-none text-sm bg-transparent"
                                style={{ color: "#2D1654" }}
                            />
                            <button
                                onClick={handleSend}
                                className="w-11 h-11 rounded-full flex items-center justify-center text-white text-lg shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, #7B49FF, #B381FF)"
                                }}
                            >
                                {"\u279C"}
                            </button>
                        </div>
                    </div>

                    {/* 빠른 선택 */}
                    <div className="px-6 mt-8">
                        <p className="text-sm font-bold mb-4" style={{ color: "#9B7EEB" }}>
                            {"\uB610\uB294 \uBE60\uB974\uAC8C \uC120\uD0DD\uD574\uB3C4 \uC88B\uC544\uC694"}
                        </p>
                        <div className="flex flex-col gap-3">
                            {quickChips.map((chip) => (
                                <button
                                    key={chip.text}
                                    onClick={() => handleChip(chip.text)}
                                    className="w-full text-left px-5 py-4 rounded-[20px] text-sm font-bold transition-all active:scale-[0.98]"
                                    style={{
                                        background: "#fff",
                                        border: "1.5px solid #EDE6FF",
                                        color: chip.textColor,
                                        boxShadow: "0 2px 8px rgba(123,73,255,0.04)"
                                    }}
                                >
                                    {chip.text}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-8px); }
                    }
                `}</style>
            </section>
        )
    }

    /* ===== 대화 모드 ===== */
    return (
        <section className="h-full flex flex-col bg-[#FAFAFE] relative">

            {/* 헤더 */}
            <div
                className="px-6 pt-10 pb-4 flex items-center justify-between"
                style={{ background: "linear-gradient(180deg, #F3EDFF 0%, #FAFAFE 100%)" }}
            >
                <div className="flex items-center gap-3">
                    <img src={BASE + "moodie_smile.png"} className="w-10 h-10 object-contain" />
                    <div>
                        <h1 className="text-lg font-black" style={{ color: "#2D1654" }}>
                            MOODMAP
                        </h1>
                        <p className="text-[10px] font-bold" style={{ color: "#9B7EEB" }}>
                            {"\uBB34\uB514\uAC00 \uADC0 \uAE30\uC6B8\uC774\uACE0 \uC788\uC5B4\uC694"}
                        </p>
                    </div>
                </div>
                <div className="text-xs font-bold" style={{ color: "#B9A3F0" }}>
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
                className="flex-1 overflow-y-auto px-5 pb-20"
            >
                <div className="space-y-3 mt-2">
                    {messages.map((msg, i) => (
                        <div key={i}>
                            {msg.role === "bot" && (
                                <p className="text-[10px] font-bold mb-1 ml-1" style={{ color: "#B9A3F0" }}>
                                    Moodi
                                </p>
                            )}

                            <div className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
                                <div
                                    className="max-w-[82%] px-5 py-4"
                                    style={msg.role === "user"
                                        ? {
                                            background: "linear-gradient(135deg, #7B49FF, #B381FF)",
                                            color: "#fff",
                                            borderRadius: "24px 8px 24px 24px"
                                        }
                                        : {
                                            background: "#fff",
                                            color: "#4D278C",
                                            borderRadius: "8px 24px 24px 24px",
                                            border: "1.5px solid #EDE6FF",
                                            boxShadow: "0 2px 8px rgba(123,73,255,0.04)"
                                        }
                                    }
                                >
                                    {msg.loading && (
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#B9A3F0", animationDelay: "0ms" }} />
                                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#B9A3F0", animationDelay: "150ms" }} />
                                                <div className="w-2 h-2 rounded-full animate-bounce" style={{ background: "#B9A3F0", animationDelay: "300ms" }} />
                                            </div>
                                            <span className="text-xs" style={{ color: "#B9A3F0" }}>{"\uC8FC\uBCC0 \uC7A5\uC18C \uAC80\uC0C9 \uC911..."}</span>
                                        </div>
                                    )}

                                    <p className="whitespace-pre-line leading-relaxed text-sm">
                                        {msg.text}
                                    </p>

                                    {msg.places && msg.places.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {msg.places.map((place) => (
                                                <button
                                                    key={place.id}
                                                    onClick={() => window.open(place.url, "_blank")}
                                                    className="w-full rounded-2xl px-4 py-3 text-left flex items-center gap-3 active:scale-[0.98] transition"
                                                    style={{ background: "#F3EDFF" }}
                                                >
                                                    <div
                                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                                                        style={{ background: "#EDE6FF" }}
                                                    >
                                                        {getCategoryEmoji(place.category)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-black text-sm truncate" style={{ color: "#2D1654" }}>
                                                            {place.name}
                                                        </p>
                                                        <p className="text-[11px] truncate" style={{ color: "#9B7EEB" }}>
                                                            {place.category} · {formatDistance(place.distance)}
                                                        </p>
                                                    </div>
                                                    <span style={{ color: "#B9A3F0" }} className="text-xs shrink-0">{"\u2192"}</span>
                                                </button>
                                            ))}

                                            <button
                                                onClick={() => {
                                                    setRecoEmotion(msg.emotion || "")
                                                    setRecoPlaces(msg.places || [])
                                                    setShowReco(true)
                                                }}
                                                className="w-full mt-1 rounded-2xl py-2.5 text-xs font-black text-white"
                                                style={{ background: "linear-gradient(135deg, #7B49FF, #B381FF)" }}
                                            >
                                                {"\uD83D\uDCCD \uCD94\uCC9C \uD050\uB808\uC774\uC158 \uC790\uC138\uD788 \uBCF4\uAE30"}
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
                <div
                    className="flex items-center rounded-full overflow-hidden"
                    style={{
                        background: "#fff",
                        border: "1.5px solid #EDE6FF",
                        boxShadow: "0 4px 20px rgba(123,73,255,0.08)",
                        padding: "4px 4px 4px 20px"
                    }}
                >
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={"\uBB34\uB514\uC5D0\uAC8C \uC774\uC57C\uAE30\uD558\uAE30..."}
                        className="flex-1 h-10 outline-none text-sm bg-transparent"
                        style={{ color: "#2D1654" }}
                    />
                    <button
                        onClick={handleSend}
                        className="w-11 h-11 rounded-full flex items-center justify-center text-white text-lg shrink-0"
                        style={{ background: "linear-gradient(135deg, #7B49FF, #B381FF)" }}
                    >
                        {"\u25B8"}
                    </button>
                </div>
            </div>

            {/* 추천 큐레이션 패널 */}
            {showReco && (
                <div
                    className="absolute inset-0 z-50 flex flex-col"
                    style={{ animation: "slideUp 0.4s ease-out" }}
                >
                    <div
                        className="h-[80px]"
                        style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}
                        onClick={() => setShowReco(false)}
                    />

                    <div
                        className="flex-1 rounded-t-[32px] overflow-y-auto pb-10"
                        style={{ background: "linear-gradient(180deg, #1A0038, #2D0066)" }}
                    >
                        <div className="flex justify-center pt-3 pb-2">
                            <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                        </div>

                        <div className="px-6 pt-2">
                            <p className="text-sm font-bold" style={{ color: "#B9A3F0" }}>
                                {recoEmotion}{"\uC744 \uB2EC\uB798\uC904"}
                            </p>
                            <h2 className="text-2xl font-black text-white mt-1">
                                {"\uCD94\uCC9C \uD050\uB808\uC774\uC158 \u2728"}
                            </h2>
                            <p className="text-xs mt-2" style={{ color: "#9B7EEB" }}>
                                {"\uC624\uB298\uC758 \uAC10\uC815 \uAE30\uBC18 \xB7 \uB0B4 \uC8FC\uBCC0 \uC2E4\uC81C \uC7A5\uC18C"}
                            </p>
                        </div>

                        <div className="mt-6 px-5 space-y-4">
                            {recoPlaces.map((place) => (
                                <button
                                    key={place.id}
                                    onClick={() => window.open(place.url, "_blank")}
                                    className="w-full rounded-[24px] p-5 text-left active:scale-[0.98] transition"
                                    style={{
                                        background: "rgba(255,255,255,0.1)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.1)"
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                                            style={{ background: "linear-gradient(135deg, #7B49FF, #B381FF)" }}
                                        >
                                            {getCategoryEmoji(place.category)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-black text-white truncate">
                                                    {place.name}
                                                </h3>
                                                <span className="text-xs font-bold shrink-0 ml-2" style={{ color: "#B9A3F0" }}>
                                                    {formatDistance(place.distance)}
                                                </span>
                                            </div>
                                            <p className="text-xs mt-1" style={{ color: "#B9A3F0" }}>{place.category}</p>
                                            <p className="text-xs mt-1 truncate" style={{ color: "#9B7EEB" }}>{place.address}</p>
                                            {place.phone && (
                                                <p className="text-xs mt-1" style={{ color: "#9B7EEB" }}>{"\uD83D\uDCDE"} {place.phone}</p>
                                            )}
                                            <div className="mt-3">
                                                <span
                                                    className="text-[10px] font-bold rounded-full px-2.5 py-1"
                                                    style={{ color: "#B381FF", background: "rgba(123,73,255,0.2)" }}
                                                >
                                                    {"\uCE74\uCE74\uC624\uB9F5\uC5D0\uC11C \uBCF4\uAE30 \u2192"}
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
                                className="w-full h-14 rounded-full text-white text-lg font-black flex items-center justify-center gap-2"
                                style={{
                                    background: "linear-gradient(135deg, #7B49FF, #B381FF)",
                                    boxShadow: "0 8px 30px rgba(123,73,255,0.3)"
                                }}
                            >
                                {"\uD83D\uDCAC \uBB34\uB514\uC640 \uB354 \uB300\uD654\uD558\uAE30"}
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
