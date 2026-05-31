import { useEffect } from "react"
import BottomNav from "../components/BottomNav"
import HomeTab from "./main/HomeTab"
import MapTab from "./main/MapTab"
import ChatTab from "./main/ChatTab"
import DiaryTab from "./main/DiaryTab"
import SettingsTab from "./main/SettingsTab"
import MonthlyReport from "./main/MonthlyReport"
import { homeQuestions } from "../data/homeQuestions"

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

/* ──── 감정별 추천 장소 (하드코딩 - 백엔드 연결 전) ──── */
const spotSuggestions: any = {
    "행복해요": { emoji: "🍝", name: "분위기 좋은 맛집", desc: "행복한 날엔 맛있는 음식과 함께!" },
    "설레요": { emoji: "🛍️", name: "성수 팝업스토어", desc: "설레는 마음에 트렌디한 공간 어때요?" },
    "신나요": { emoji: "🍷", name: "분위기 바", desc: "신나는 에너지를 이어가요!" },
    "차분해요": { emoji: "☕", name: "조용한 카페", desc: "차분한 오늘, 커피 한 잔의 여유" },
    "피곤해요": { emoji: "🌿", name: "공원 산책로", desc: "자연 속에서 에너지를 충전해요" },
    "복잡해요": { emoji: "📚", name: "독립서점", desc: "책 사이에서 마음을 정리해봐요" },
    "우울해요": { emoji: "🎨", name: "전시회", desc: "예술이 위로가 되어줄 거예요" },
    "슬퍼요": { emoji: "☕", name: "햇빛 좋은 카페", desc: "따뜻한 빛이 마음을 녹여줄 거예요" },
    "답답해요": { emoji: "🌊", name: "전망 좋은 곳", desc: "탁 트인 곳에서 숨 쉬어봐요" },
    "멍해요": { emoji: "🚶", name: "산책로", desc: "걸으면 머리가 맑아져요" },
    "화나요": { emoji: "🍃", name: "공원", desc: "바람이 마음을 식혀줄 거예요" },
    "외로워요": { emoji: "☕", name: "동네 카페", desc: "따뜻한 공간에서 위로 받아요" }
}

function HomeScreen({
    name,
    tab,
    setTab,
    mood,
    setMood,
    place,
    setPlace,
    homeStep,
    setHomeStep,
    spots,
    setSpots,
    location,
    setLocation
}: Props) {

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            },
            (error) => {
                console.log(error)
            }
        )
    }, [])

    /* ──── 데이터 가져오기 ──── */
    const logs = JSON.parse(localStorage.getItem("moodLogs") || "[]")
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)

    // 이번 달 로그
    const currentMonth = logs.filter((item: any) => {
        const date = new Date(item.createdAt)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    // 오늘 기록
    const todayLog = logs.find((item: any) => item.createdAt?.slice(0, 10) === todayStr)

    // 감정 이모지 맵
    const moodMap = Object.fromEntries(
        homeQuestions.mood.options.map((item: any) => [item.label, item.emoji])
    )
    const moodColorMap = Object.fromEntries(
        homeQuestions.mood.options.map((item: any) => [item.label, item.color])
    )

    // 이번 달 감정 카운트
    const moodCount: any = {}
    currentMonth.forEach((item: any) => {
        moodCount[item.mood] = (moodCount[item.mood] || 0) + 1
    })
    const totalLogs = currentMonth.length

    // 가장 많은 감정
    const topMood = Object.entries(moodCount).sort((a: any, b: any) => b[1] - a[1])[0]

    // 이번 주 날짜 + 감정 매핑
    const getWeekDates = () => {
        const dates = []
        const day = now.getDay() // 0=일, 1=월, ...
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

    // 날짜별 감정 매핑
    const dateToMood: any = {}
    logs.forEach((item: any) => {
        const d = item.createdAt?.slice(0, 10)
        if (d) dateToMood[d] = item.mood
    })

    // 추천 장소
    const todayMoodLabel = todayLog?.mood || mood || ""
    const suggestion = spotSuggestions[todayMoodLabel] || spotSuggestions["차분해요"]

    // 칭찬 리포트 생성
    const getPraiseMessage = () => {
        if (totalLogs === 0) return "아직 기록이 없어요. 오늘 첫 기록을 남겨볼까요? ☁️"
        if (totalLogs < 3) return `벌써 ${totalLogs}번이나 기록했어요! 좋은 시작이야 ✨`

        const topMoodName = topMood ? topMood[0] : ""
        const topMoodCount = topMood ? topMood[1] : 0

        if (["행복해요", "설레요", "신나요"].includes(topMoodName)) {
            return `이번 달 ${topMoodName}가 ${topMoodCount}번! 좋은 흐름이 이어지고 있어요 ☀️`
        }
        if (["우울해요", "슬퍼요", "외로워요"].includes(topMoodName)) {
            return `${totalLogs}번 기록하면서 잘 버텨왔어요. 무디가 항상 곁에 있을게요 🌙`
        }
        return `이번 달 ${totalLogs}번 기록! 꾸준히 감정을 돌보는 당신이 멋져요 🌿`
    }

    return (
        <section className="h-full bg-[#f7f4ff] relative">
            <div className="h-full pb-20">
                {tab === "home" && (
                    homeStep < 2 ? (
                        <HomeTab
                            name={name}
                            mood={mood}
                            setMood={setMood}
                            place={place}
                            setPlace={setPlace}
                            homeStep={homeStep}
                            setHomeStep={setHomeStep}
                            setSpots={setSpots}
                            location={location}
                        />
                    ) : (
                        <div className="h-full overflow-y-auto pb-20">
                            {/* ===== 1. 인사 헤더 ===== */}
                            <div className="px-6 pt-12">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h1 className="text-[38px] font-black text-[#6E31E8]">
                                            {name || "사용자"}님
                                        </h1>
                                        <p className="mt-1 text-purple-400">
                                            오늘도 무디와 함께해요 ☁️
                                        </p>
                                    </div>
                                    <img
                                        src="./moodie.png"
                                        className="w-16 drop-shadow-lg"
                                    />
                                </div>
                            </div>

                            {/* ===== 2. 오늘의 감정 카드 ===== */}
                            <div className="px-6 mt-6">
                                {todayLog ? (
                                    <div
                                        className="rounded-[28px] p-6 shadow-sm"
                                        style={{
                                            background: `linear-gradient(135deg, ${moodColorMap[todayLog.mood] || "#EEE6FF"}33, #ffffff)`
                                        }}
                                    >
                                        <p className="text-sm font-bold text-purple-400">오늘의 기분</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="text-5xl">
                                                {moodMap[todayLog.mood] || "☁️"}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-[#4D278C]">
                                                    {todayLog.mood}
                                                </h3>
                                                <p className="text-sm text-purple-400 mt-1">
                                                    {todayLog.place && `📍 ${todayLog.place}에서`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setHomeStep(0)
                                            setMood("")
                                            setPlace("")
                                        }}
                                        className="w-full rounded-[28px] bg-white p-6 shadow-sm text-left"
                                    >
                                        <p className="text-sm font-bold text-purple-400">오늘의 기분</p>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="text-5xl">☁️</div>
                                            <div>
                                                <h3 className="text-lg font-black text-[#4D278C]">
                                                    아직 기록하지 않았어요
                                                </h3>
                                                <p className="text-sm text-[#7B49FF] font-bold mt-1">
                                                    지금 기분 기록하기 →
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* ===== 3. 감정 캘린더 (이번 주) ===== */}
                            <div className="px-6 mt-6">
                                <div className="rounded-[28px] bg-gradient-to-br from-[#2E005A] to-[#3E0077] p-6 shadow">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-black text-white">
                                            이번 주 감정 기록 🌷
                                        </h2>
                                        <p className="text-xs text-purple-300">
                                            {now.getMonth() + 1}월
                                        </p>
                                    </div>

                                    <div className="mt-5 flex justify-between">
                                        {weekDates.map((date, i) => {
                                            const dateStr = date.toISOString().slice(0, 10)
                                            const isToday = dateStr === todayStr
                                            const moodLabel = dateToMood[dateStr]
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-2">
                                                    <p className={`text-xs ${isToday ? "text-white font-black" : "text-purple-300"}`}>
                                                        {dayLabels[i]}
                                                    </p>
                                                    <div
                                                        className={`
                                                            w-11 h-11 rounded-full
                                                            flex items-center justify-center text-xl
                                                            ${isToday
                                                                ? "bg-[#7B49FF] ring-2 ring-white/50"
                                                                : moodLabel
                                                                    ? "bg-purple-500/50"
                                                                    : "bg-white/10"
                                                            }
                                                        `}
                                                    >
                                                        {moodLabel ? moodMap[moodLabel] || "☁️" : ""}
                                                    </div>
                                                    <p className={`text-xs ${isToday ? "text-white font-bold" : "text-purple-400"}`}>
                                                        {date.getDate()}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* 이번 달 감정 요약 칩 */}
                                    {Object.keys(moodCount).length > 0 && (
                                        <div className="mt-5 flex gap-2 flex-wrap">
                                            {Object.entries(moodCount)
                                                .sort((a: any, b: any) => b[1] - a[1])
                                                .slice(0, 4)
                                                .map(([m, c]: any) => (
                                                    <div
                                                        key={m}
                                                        className="px-3 py-1.5 rounded-full bg-white/10 text-xs text-white font-bold"
                                                    >
                                                        {moodMap[m]} {m} {c}
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== 4. 무디의 칭찬 리포트 ===== */}
                            <div className="px-6 mt-6">
                                <div className="rounded-[28px] bg-white p-6 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-[#FFF3D6] flex items-center justify-center text-2xl">
                                            ⭐
                                        </div>
                                        <div>
                                            <h2 className="text-sm font-black text-[#8668C8]">
                                                무디의 칭찬 리포트
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-[#F7F4FF] rounded-2xl p-4">
                                        <p className="text-[#4D278C] font-bold leading-relaxed">
                                            {getPraiseMessage()}
                                        </p>
                                    </div>
                                    {totalLogs > 0 && (
                                        <div className="mt-4 flex gap-4">
                                            <div className="flex-1 bg-[#F7F4FF] rounded-2xl p-4 text-center">
                                                <p className="text-2xl font-black text-[#6E31E8]">
                                                    {totalLogs}회
                                                </p>
                                                <p className="text-xs text-purple-400 mt-1">
                                                    이번 달 기록
                                                </p>
                                            </div>
                                            <div className="flex-1 bg-[#F7F4FF] rounded-2xl p-4 text-center">
                                                <p className="text-2xl font-black text-[#6E31E8]">
                                                    {topMood ? `${moodMap[topMood[0]] || "☁️"}` : "—"}
                                                </p>
                                                <p className="text-xs text-purple-400 mt-1">
                                                    {topMood ? topMood[0] : "가장 많은 감정"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== 5. 오늘의 추천 스팟 ===== */}
                            <div className="px-6 mt-6">
                                <button
                                    onClick={() => setTab("chat")}
                                    className="w-full rounded-[28px] bg-gradient-to-r from-[#7B49FF] to-[#B381FF] p-6 shadow-lg text-left"
                                >
                                    <p className="text-xs font-bold text-purple-200">
                                        오늘의 무드 스팟
                                    </p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl">
                                            {suggestion.emoji}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-white">
                                                {suggestion.name}
                                            </h3>
                                            <p className="text-sm text-purple-100 mt-1">
                                                {suggestion.desc}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/70 mt-4 text-right font-bold">
                                        무디에게 더 추천받기 →
                                    </p>
                                </button>
                            </div>

                            {/* ===== 6. 월간 리포트 ===== */}
                            <div className="mt-6">
                                <MonthlyReport />
                            </div>
                        </div>
                    )
                )}

                {tab === "map" && (
                    <MapTab spots={spots} />
                )}

                {tab === "chat" && (
                    <ChatTab />
                )}

                {tab === "diary" && (
                    <DiaryTab />
                )}

                {tab === "settings" && (
                    <SettingsTab />
                )}
            </div>

            <BottomNav
                tab={tab}
                setTab={setTab}
            />
        </section>
    )
}

export default HomeScreen