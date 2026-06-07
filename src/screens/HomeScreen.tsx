import { useEffect } from "react"
import BottomNav from "../components/BottomNav"
import HomeTab from "./main/HomeTab"
import MapTab from "./main/MapTab"
import ChatTab from "./main/ChatTab"
import DiaryTab from "./main/DiaryTab"
import SettingsTab from "./main/SettingsTab"
import MonthlyReport from "./main/MonthlyReport"

interface Props {
    name: string
    tab: string
    setTab: any
    mood: string
    setMood: any
    place: string
    setPlace: any
    homeStep: number
    setHomeStep: any
    spots: any
    setSpots: any
    location: any
    setLocation: any
}

const BASE = "/Moodie/"

const moodImageMap: any = {
    "행복/설렘": BASE + "무디 기분좋아.png",
    "차분/안정": BASE + "무디 편안해.png",
    "피곤/멍함": BASE + "무디 피곤.png",
    "슬픔/우울": BASE + "무디 우울해.png",
    "화남/답답": BASE + "무디 화나.png",
    "외로움":   BASE + "무디 우울해.png",
}

const spotSuggestions: any = {
    "행복/설렘": { name: "분위기 좋은 맛집", desc: "행복한 날엔 맛있는 음식과 함께!" },
    "차분/안정": { name: "조용한 카페", desc: "차분한 오늘, 커피 한 잔의 여유" },
    "피곤/멍함": { name: "공원 산책로", desc: "자연 속에서 에너지를 충전해요" },
    "슬픔/우울": { name: "햇빛 좋은 카페", desc: "따뜻한 빛이 마음을 녹여줄 거예요" },
    "화남/답답": { name: "전망 좋은 곳", desc: "탁 트인 곳에서 숨 쉬어봐요" },
    "외로움":   { name: "동네 카페", desc: "따뜻한 공간에서 위로 받아요" },
}

function HomeScreen({
    name, tab, setTab, mood, setMood, place, setPlace,
    homeStep, setHomeStep, spots, setSpots, location, setLocation
}: Props) {

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
            },
            (error) => { console.log(error) }
        )
    }, [])

    const logs = JSON.parse(localStorage.getItem("moodLogs") || "[]")
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)

    const currentMonth = logs.filter((item: any) => {
        const date = new Date(item.createdAt)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    const todayLog = logs.find((item: any) => item.createdAt?.slice(0, 10) === todayStr)

    const moodCount: any = {}
    currentMonth.forEach((item: any) => {
        moodCount[item.mood] = (moodCount[item.mood] || 0) + 1
    })
    const totalLogs = currentMonth.length
    const topMood = Object.entries(moodCount).sort((a: any, b: any) => b[1] - a[1])[0]

    const getWeekDates = () => {
        const dates = []
        const day = now.getDay()
        const mondayOffset = day === 0 ? -6 : 1 - day
        for (let i = 0; i < 7; i++) {
            const d = new Date(now)
            d.setDate(now.getDate() + mondayOffset + i)
            dates.push(d)
        }
        return dates
    }
    const weekDates = getWeekDates()
    const dayLabels = ["월", "화", "수", "목", "금", "토", "일"]

    const dateToMood: any = {}
    logs.forEach((item: any) => {
        const d = item.createdAt?.slice(0, 10)
        if (d) dateToMood[d] = item.mood
    })

    const todayMoodLabel = todayLog?.mood || mood || ""
    const suggestion = spotSuggestions[todayMoodLabel] || spotSuggestions["차분/안정"]

    const getPraiseMessage = () => {
        if (totalLogs === 0) return "아직 기록이 없어요.\n오늘 첫 기록을 남겨볼까요?"
        if (totalLogs < 3) return "벌써 " + totalLogs + "번이나 기록했어요!\n좋은 시작이야 ✨"
        const topMoodName = topMood ? topMood[0] : ""
        const topMoodCount = topMood ? topMood[1] : 0
        if (["행복/설렘"].includes(topMoodName)) {
            return "이번 달 " + topMoodName + "가 " + topMoodCount + "번!\n좋은 흐름이 이어지고 있어요 ☀️"
        }
        if (["슬픔/우울", "외로움"].includes(topMoodName)) {
            return totalLogs + "번 기록하면서 잘 버텨왔어요.\n무디가 항상 곁에 있을게요 🌙"
        }
        return "이번 달 " + totalLogs + "번 기록!\n꾸준히 감정을 돌보는 당신이 멋져요 🌿"
    }

    const greetingByTime = () => {
        const h = now.getHours()
        if (h < 12) return "좋은 아침이에요"
        if (h < 18) return "좋은 오후예요"
        return "좋은 저녁이에요"
    }

    return (
        <section className="h-full bg-white relative">
            <div className="h-full pb-32">
                {tab === "home" && (
                    homeStep < 2 ? (
                        <HomeTab
                            name={name} mood={mood} setMood={setMood}
                            place={place} setPlace={setPlace}
                            homeStep={homeStep} setHomeStep={setHomeStep}
                            setSpots={setSpots}
                            location={location}
                        />
                    ) : (
                        <div className="h-full overflow-y-auto pb-32 bg-[#FAFAFE]">

                            {/* 헤더 */}
                            <div className="px-6 pt-14 pb-8" style={{ background: "linear-gradient(180deg, #F3EDFF 0%, #FAFAFE 100%)" }}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "#9B7EEB" }}>{greetingByTime()} ☁️</p>
                                        <h1 className="text-[32px] font-black mt-1" style={{ color: "#2D1654", letterSpacing: "-1px", lineHeight: 1.2 }}>
                                            {name || "사용자"}님
                                        </h1>
                                    </div>
                                    <img src={BASE + "moodie_smile.png"} className="w-20 drop-shadow-lg" style={{ animation: "float 3s ease-in-out infinite" }} />
                                </div>
                            </div>

                            {/* 오늘의 감정 */}
                            <div className="px-5 -mt-2">
                                {todayLog ? (
                                    <div className="rounded-[24px] p-5 flex items-center gap-4" style={{ background: "#fff", border: "1.5px solid #EDE6FF", boxShadow: "0 2px 20px rgba(123,73,255,0.06)" }}>
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden" style={{ background: "#F3EDFF" }}>
                                            <img src={moodImageMap[todayLog.mood] || BASE + "moodie_smile.png"} className="w-14 h-14 object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold" style={{ color: "#9B7EEB" }}>오늘의 기분</p>
                                            <h3 className="text-xl font-black mt-0.5" style={{ color: "#2D1654" }}>{todayLog.mood}</h3>
                                            {todayLog.place && (
                                                <p className="text-xs mt-1" style={{ color: "#B9A3F0" }}>📍 {todayLog.place}에서</p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <button onClick={() => { setHomeStep(0); setMood(""); setPlace("") }}
                                        className="w-full rounded-[24px] p-5 flex items-center gap-4 text-left"
                                        style={{ background: "#fff", border: "1.5px dashed #D8CCFF", boxShadow: "0 2px 20px rgba(123,73,255,0.04)" }}>
                                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "#F3EDFF" }}>
                                            <img src={BASE + "moodie_smile.png"} className="w-12" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold" style={{ color: "#9B7EEB" }}>오늘의 기분</p>
                                            <h3 className="text-base font-black mt-0.5" style={{ color: "#2D1654" }}>아직 기록하지 않았어요</h3>
                                            <p className="text-xs font-bold mt-1" style={{ color: "#7B49FF" }}>지금 기록하기 →</p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* 이번 주 감정 캘린더 */}
                            <div className="px-5 mt-5">
                                <div className="rounded-[24px] p-5" style={{ background: "#fff", border: "1.5px solid #EDE6FF", boxShadow: "0 2px 20px rgba(123,73,255,0.06)" }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-base font-black" style={{ color: "#2D1654" }}>이번 주 감정</h2>
                                        <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "#F3EDFF", color: "#7B49FF" }}>{now.getMonth() + 1}월</span>
                                    </div>
                                    <div className="flex justify-between">
                                        {weekDates.map((date, i) => {
                                            const dateStr = date.toISOString().slice(0, 10)
                                            const isToday = dateStr === todayStr
                                            const moodLabel = dateToMood[dateStr]
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-1.5">
                                                    <p className="text-[10px] font-bold" style={{ color: isToday ? "#7B49FF" : "#B9A3F0" }}>{dayLabels[i]}</p>
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                                                        style={{ background: isToday ? "linear-gradient(135deg, #7B49FF, #B381FF)" : moodLabel ? "#F3EDFF" : "#F8F6FF", boxShadow: isToday ? "0 4px 12px rgba(123,73,255,0.3)" : "none" }}>
                                                        {moodLabel
                                                            ? <img src={moodImageMap[moodLabel] || BASE + "moodie_smile.png"} className="w-9 h-9 object-contain" />
                                                            : isToday ? <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>{date.getDate()}</span> : ""}
                                                    </div>
                                                    <p className="text-[10px]" style={{ color: isToday ? "#7B49FF" : "#D0C4F0", fontWeight: isToday ? 900 : 700 }}>{date.getDate()}</p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {Object.keys(moodCount).length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-4 pt-4" style={{ borderTop: "1px solid #F3EDFF" }}>
                                            {Object.entries(moodCount).sort((a: any, b: any) => b[1] - a[1]).slice(0, 4).map(([m, c]: any) => (
                                                <span key={m} className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{ background: "#F3EDFF", color: "#6E31E8" }}>
                                                    <img src={moodImageMap[m] || BASE + "moodie_smile.png"} className="w-5 h-5 object-contain" />
                                                    {m} {c}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 무디의 칭찬 리포트 */}
                            <div className="px-5 mt-5">
                                <div className="rounded-[24px] p-5" style={{ background: "#fff", border: "1.5px solid #EDE6FF", boxShadow: "0 2px 20px rgba(123,73,255,0.06)" }}>
                                    <div className="flex items-start gap-4">
                                        <img src={BASE + "moodie_write.png"} className="w-16 shrink-0" style={{ filter: "drop-shadow(0 4px 8px rgba(123,73,255,0.15))" }} />
                                        <div className="flex-1">
                                            <h2 className="text-base font-black" style={{ color: "#2D1654" }}>무디의 칭찬 리포트</h2>
                                            <p className="text-sm font-bold mt-2 whitespace-pre-line" style={{ color: "#6E31E8", lineHeight: 1.6 }}>{getPraiseMessage()}</p>
                                            {totalLogs > 0 && (
                                                <div className="flex gap-3 mt-4">
                                                    <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: "#F3EDFF" }}>
                                                        <p className="text-xl font-black" style={{ color: "#6E31E8" }}>{totalLogs}회</p>
                                                        <p className="text-[10px] font-bold mt-0.5" style={{ color: "#9B7EEB" }}>이번 달 기록</p>
                                                    </div>
                                                    <div className="flex-1 rounded-2xl p-3 text-center" style={{ background: "#F3EDFF" }}>
                                                        <p className="text-xl font-black" style={{ color: "#6E31E8" }}>
                                                            {topMood ? <img src={moodImageMap[topMood[0]] || BASE + "moodie_smile.png"} className="w-8 h-8 object-contain mx-auto" /> : "—"}
                                                        </p>
                                                        <p className="text-[10px] font-bold mt-0.5" style={{ color: "#9B7EEB" }}>{topMood ? topMood[0] : "가장 많은 감정"}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 오늘의 추천 스팟 */}
                            <div className="px-5 mt-5">
                                <button onClick={() => setTab("chat")} className="w-full rounded-[24px] p-5 text-left flex items-center gap-4"
                                    style={{ background: "linear-gradient(135deg, #7B49FF, #9B6BFF)", boxShadow: "0 8px 30px rgba(123,73,255,0.25)" }}>
                                    <img src={BASE + "moodie_search.png"} className="w-16 shrink-0" style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }} />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>오늘의 무드 스팟</p>
                                        <h3 className="text-lg font-black text-white mt-0.5">{suggestion.name}</h3>
                                        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>{suggestion.desc}</p>
                                    </div>
                                    <span className="text-white text-xl shrink-0">›</span>
                                </button>
                            </div>

                            {/* 빠른 메뉴 */}
                            <div className="px-5 mt-5">
                                <h2 className="text-base font-black mb-3" style={{ color: "#2D1654" }}>무디와 함께하기</h2>
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { tab: "chat", img: "moodie_chat.png", label: "대화하기" },
                                        { tab: "map", img: "moodie_map.png", label: "지도 보기" },
                                        { tab: "diary", img: "moodie_write.png", label: "일기 쓰기" },
                                    ].map((item) => (
                                        <button key={item.tab} onClick={() => setTab(item.tab)}
                                            className="rounded-[20px] p-4 flex flex-col items-center gap-2"
                                            style={{ background: "#fff", border: "1.5px solid #EDE6FF", boxShadow: "0 2px 12px rgba(123,73,255,0.04)" }}>
                                            <img src={BASE + item.img} className="w-12 h-12 object-contain" />
                                            <span className="text-xs font-black" style={{ color: "#2D1654" }}>{item.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 월간 리포트 */}
                            <div className="mt-5"><MonthlyReport /></div>

                            <style>{`
                                @keyframes float {
                                    0%, 100% { transform: translateY(0); }
                                    50% { transform: translateY(-8px); }
                                }
                            `}</style>
                        </div>
                    )
                )}

                {tab === "map" && <MapTab spots={spots} />}
                {tab === "chat" && <ChatTab />}
                {tab === "diary" && <DiaryTab />}
                {tab === "settings" && <SettingsTab />}
            </div>
            <BottomNav tab={tab} setTab={setTab} />
        </section>
    )
}

export default HomeScreen