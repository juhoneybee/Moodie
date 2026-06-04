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

const BASE = "/Moodie/"

const moodImageMap: any = {
    "\uD589\uBCF5\uD574\uC694": BASE + "mood_happy.png",
    "\uC124\uB808\uC694": BASE + "mood_excited.png",
    "\uC2E0\uB098\uC694": BASE + "mood_joyful.png",
    "\uCC28\uBD84\uD574\uC694": BASE + "mood_calm.png",
    "\uD53C\uACE4\uD574\uC694": BASE + "mood_tired.png",
    "\uBCF5\uC7A1\uD574\uC694": BASE + "mood_sad.png",
    "\uC6B0\uC6B8\uD574\uC694": BASE + "mood_sad.png",
    "\uC2AC\uD37C\uC694": BASE + "mood_crying.png",
    "\uB2F5\uB2F5\uD574\uC694": BASE + "mood_angry.png",
    "\uBA4D\uD574\uC694": BASE + "mood_tired.png",
    "\uD654\uB098\uC694": BASE + "mood_angry.png",
    "\uC678\uB85C\uC6CC\uC694": BASE + "mood_crying.png"
}

const spotSuggestions: any = {
    "\uD589\uBCF5\uD574\uC694": { name: "\uBD84\uC704\uAE30 \uC88B\uC740 \uB9DB\uC9D1", desc: "\uD589\uBCF5\uD55C \uB0A0\uC5D4 \uB9DB\uC788\uB294 \uC74C\uC2DD\uACFC \uD568\uAED8!" },
    "\uC124\uB808\uC694": { name: "\uC131\uC218 \uD31D\uC5C5\uC2A4\uD1A0\uC5B4", desc: "\uC124\uB808\uB294 \uB9C8\uC74C\uC5D0 \uD2B8\uB80C\uB514\uD55C \uACF5\uAC04 \uC5B4\uB54C\uC694?" },
    "\uC2E0\uB098\uC694": { name: "\uBD84\uC704\uAE30 \uBC14", desc: "\uC2E0\uB098\uB294 \uC5D0\uB108\uC9C0\uB97C \uC774\uC5B4\uAC00\uC694!" },
    "\uCC28\uBD84\uD574\uC694": { name: "\uC870\uC6A9\uD55C \uCE74\uD398", desc: "\uCC28\uBD84\uD55C \uC624\uB298, \uCEE4\uD53C \uD55C \uC794\uC758 \uC5EC\uC720" },
    "\uD53C\uACE4\uD574\uC694": { name: "\uACF5\uC6D0 \uC0B0\uCC45\uB85C", desc: "\uC790\uC5F0 \uC18D\uC5D0\uC11C \uC5D0\uB108\uC9C0\uB97C \uCDA9\uC804\uD574\uC694" },
    "\uBCF5\uC7A1\uD574\uC694": { name: "\uB3C5\uB9BD\uC11C\uC810", desc: "\uCC45 \uC0AC\uC774\uC5D0\uC11C \uB9C8\uC74C\uC744 \uC815\uB9AC\uD574\uBD10\uC694" },
    "\uC6B0\uC6B8\uD574\uC694": { name: "\uC804\uC2DC\uD68C", desc: "\uC608\uC220\uC774 \uC704\uB85C\uAC00 \uB418\uC5B4\uC904 \uAC70\uC608\uC694" },
    "\uC2AC\uD37C\uC694": { name: "\uD587\uBE5B \uC88B\uC740 \uCE74\uD398", desc: "\uB530\uB73B\uD55C \uBE5B\uC774 \uB9C8\uC74C\uC744 \uB179\uC5EC\uC904 \uAC70\uC608\uC694" },
    "\uB2F5\uB2F5\uD574\uC694": { name: "\uC804\uB9DD \uC88B\uC740 \uACF3", desc: "\uD0C1 \uD2B8\uC778 \uACF3\uC5D0\uC11C \uC228 \uC26C\uC5B4\uBD10\uC694" },
    "\uBA4D\uD574\uC694": { name: "\uC0B0\uCC45\uB85C", desc: "\uAC78\uC73C\uBA74 \uBA38\uB9AC\uAC00 \uB9D1\uC544\uC838\uC694" },
    "\uD654\uB098\uC694": { name: "\uACF5\uC6D0", desc: "\uBC14\uB78C\uC774 \uB9C8\uC74C\uC744 \uC2DD\uD600\uC904 \uAC70\uC608\uC694" },
    "\uC678\uB85C\uC6CC\uC694": { name: "\uB3D9\uB124 \uCE74\uD398", desc: "\uB530\uB73B\uD55C \uACF5\uAC04\uC5D0\uC11C \uC704\uB85C \uBC1B\uC544\uC694" }
}

function HomeScreen({
<<<<<<< HEAD
    name, tab, setTab, mood, setMood, place, setPlace,
    homeStep, setHomeStep, spots, setSpots
}: Props) {

=======
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
>>>>>>> 506145b99ad396653df03cba197d465f00d59572
    const logs = JSON.parse(localStorage.getItem("moodLogs") || "[]")
    const now = new Date()
    const todayStr = now.toISOString().slice(0, 10)

    const currentMonth = logs.filter((item: any) => {
        const date = new Date(item.createdAt)
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
    })

    const todayLog = logs.find((item: any) => item.createdAt?.slice(0, 10) === todayStr)

    const moodMap = Object.fromEntries(
        homeQuestions.mood.options.map((item: any) => [item.label, item.emoji])
    )

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
    const dayLabels = ["\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0", "\uC77C"]

    const dateToMood: any = {}
    logs.forEach((item: any) => {
        const d = item.createdAt?.slice(0, 10)
        if (d) dateToMood[d] = item.mood
    })

    const todayMoodLabel = todayLog?.mood || mood || ""
    const suggestion = spotSuggestions[todayMoodLabel] || spotSuggestions["\uCC28\uBD84\uD574\uC694"]

    const getPraiseMessage = () => {
        if (totalLogs === 0) return "\uC544\uC9C1 \uAE30\uB85D\uC774 \uC5C6\uC5B4\uC694.\n\uC624\uB298 \uCCAB \uAE30\uB85D\uC744 \uB0A8\uACA8\uBCFC\uAE4C\uC694?"
        if (totalLogs < 3) return "\uBCC4\uC368 " + totalLogs + "\uBC88\uC774\uB098 \uAE30\uB85D\uD588\uC5B4\uC694!\n\uC88B\uC740 \uC2DC\uC791\uC774\uC57C \u2728"
        const topMoodName = topMood ? topMood[0] : ""
        const topMoodCount = topMood ? topMood[1] : 0
        if (["\uD589\uBCF5\uD574\uC694", "\uC124\uB808\uC694", "\uC2E0\uB098\uC694"].includes(topMoodName)) {
            return "\uC774\uBC88 \uB2EC " + topMoodName + "\uAC00 " + topMoodCount + "\uBC88!\n\uC88B\uC740 \uD750\uB984\uC774 \uC774\uC5B4\uC9C0\uACE0 \uC788\uC5B4\uC694 \u2600\uFE0F"
        }
        if (["\uC6B0\uC6B8\uD574\uC694", "\uC2AC\uD37C\uC694", "\uC678\uB85C\uC6CC\uC694"].includes(topMoodName)) {
            return totalLogs + "\uBC88 \uAE30\uB85D\uD558\uBA74\uC11C \uC798 \uBC84\uD600\uC654\uC5B4\uC694.\n\uBB34\uB514\uAC00 \uD56D\uC0C1 \uACE1\uC5D0 \uC788\uC744\uAC8C\uC694 \uD83C\uDF19"
        }
        return "\uC774\uBC88 \uB2EC " + totalLogs + "\uBC88 \uAE30\uB85D!\n\uAFB8\uC900\uD788 \uAC10\uC815\uC744 \uB3CC\uBCF4\uB294 \uB2F9\uC2E0\uC774 \uBA4B\uC838\uC694 \uD83C\uDF3F"
    }

    const greetingByTime = () => {
        const h = now.getHours()
        if (h < 12) return "\uC88B\uC740 \uC544\uCE68\uC774\uC5D0\uC694"
        if (h < 18) return "\uC88B\uC740 \uC624\uD6C4\uC608\uC694"
        return "\uC88B\uC740 \uC800\uB141\uC774\uC5D0\uC694"
    }

    return (
<<<<<<< HEAD
        <section className="h-full bg-white relative">
            <div className="h-full pb-32">
=======
        <section className="h-full bg-[#f7f4ff] relative">
            <div className="h-full pb-20">
>>>>>>> 506145b99ad396653df03cba197d465f00d59572
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
<<<<<<< HEAD

                        <div className="h-full overflow-y-auto pb-32 bg-[#FAFAFE]">

                            {/* ===== \uD5E4\uB354 ===== */}
                            <div
                                className="px-6 pt-14 pb-8"
                                style={{
                                    background: "linear-gradient(180deg, #F3EDFF 0%, #FAFAFE 100%)"
                                }}
                            >
=======
                        <div className="h-full overflow-y-auto pb-20">
                            {/* ===== 1. 인사 헤더 ===== */}
                            <div className="px-6 pt-12">
>>>>>>> 506145b99ad396653df03cba197d465f00d59572
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "#9B7EEB" }}>
                                            {greetingByTime()} ☁️
                                        </p>
                                        <h1
                                            className="text-[32px] font-black mt-1"
                                            style={{
                                                color: "#2D1654",
                                                letterSpacing: "-1px",
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {name || "\uC0AC\uC6A9\uC790"}{"\uB2D8"}
                                        </h1>
                                    </div>
                                    <img
                                        src={BASE + "moodie_smile.png"}
                                        className="w-20 drop-shadow-lg"
                                        style={{
                                            animation: "float 3s ease-in-out infinite"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ===== \uC624\uB298\uC758 \uAC10\uC815 ===== */}
                            <div className="px-5 -mt-2">
                                {todayLog ? (
                                    <div
                                        className="rounded-[24px] p-5 flex items-center gap-4"
                                        style={{
                                            background: "#fff",
                                            border: "1.5px solid #EDE6FF",
                                            boxShadow: "0 2px 20px rgba(123,73,255,0.06)"
                                        }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden"
                                            style={{ background: "#F3EDFF" }}
                                        >
                                            <img src={moodImageMap[todayLog.mood] || BASE + "moodie_smile.png"} className="w-14 h-14 object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold" style={{ color: "#9B7EEB" }}>
                                                {"\uC624\uB298\uC758 \uAE30\uBD84"}
                                            </p>
                                            <h3
                                                className="text-xl font-black mt-0.5"
                                                style={{ color: "#2D1654" }}
                                            >
                                                {todayLog.mood}
                                            </h3>
                                            {todayLog.place && (
                                                <p className="text-xs mt-1" style={{ color: "#B9A3F0" }}>
                                                    📍 {todayLog.place}{"\uC5D0\uC11C"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setHomeStep(0)
                                            setMood("")
                                            setPlace("")
                                        }}
                                        className="w-full rounded-[24px] p-5 flex items-center gap-4 text-left"
                                        style={{
                                            background: "#fff",
                                            border: "1.5px dashed #D8CCFF",
                                            boxShadow: "0 2px 20px rgba(123,73,255,0.04)"
                                        }}
                                    >
                                        <div
                                            className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                            style={{ background: "#F3EDFF" }}
                                        >
                                            <img src={BASE + "moodie_smile.png"} className="w-12" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold" style={{ color: "#9B7EEB" }}>
                                                {"\uC624\uB298\uC758 \uAE30\uBD84"}
                                            </p>
                                            <h3
                                                className="text-base font-black mt-0.5"
                                                style={{ color: "#2D1654" }}
                                            >
                                                {"\uC544\uC9C1 \uAE30\uB85D\uD558\uC9C0 \uC54A\uC558\uC5B4\uC694"}
                                            </h3>
                                            <p className="text-xs font-bold mt-1" style={{ color: "#7B49FF" }}>
                                                {"\uC9C0\uAE08 \uAE30\uB85D\uD558\uAE30 \u2192"}
                                            </p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* ===== \uC774\uBC88 \uC8FC \uAC10\uC815 \uCE98\uB9B0\uB354 ===== */}
                            <div className="px-5 mt-5">
                                <div
                                    className="rounded-[24px] p-5"
                                    style={{
                                        background: "#fff",
                                        border: "1.5px solid #EDE6FF",
                                        boxShadow: "0 2px 20px rgba(123,73,255,0.06)"
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <h2
                                            className="text-base font-black"
                                            style={{ color: "#2D1654" }}
                                        >
                                            {"\uC774\uBC88 \uC8FC \uAC10\uC815"}
                                        </h2>
                                        <span
                                            className="text-xs font-bold px-3 py-1 rounded-full"
                                            style={{ background: "#F3EDFF", color: "#7B49FF" }}
                                        >
                                            {now.getMonth() + 1}{"\uC6D4"}
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        {weekDates.map((date, i) => {
                                            const dateStr = date.toISOString().slice(0, 10)
                                            const isToday = dateStr === todayStr
                                            const moodLabel = dateToMood[dateStr]
                                            return (
                                                <div key={i} className="flex flex-col items-center gap-1.5">
                                                    <p
                                                        className="text-[10px] font-bold"
                                                        style={{ color: isToday ? "#7B49FF" : "#B9A3F0" }}
                                                    >
                                                        {dayLabels[i]}
                                                    </p>
                                                    <div
                                                        className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden"
                                                        style={{
                                                            background: isToday
                                                                ? "linear-gradient(135deg, #7B49FF, #B381FF)"
                                                                : moodLabel
                                                                    ? "#F3EDFF"
                                                                    : "#F8F6FF",
                                                            boxShadow: isToday
                                                                ? "0 4px 12px rgba(123,73,255,0.3)"
                                                                : "none"
                                                        }}
                                                    >
                                                        {moodLabel
                                                            ? <img src={moodImageMap[moodLabel] || BASE + "moodie_smile.png"} className="w-9 h-9 object-contain" />
                                                            : isToday
                                                                ? <span style={{ color: "#fff", fontSize: 12, fontWeight: 900 }}>{date.getDate()}</span>
                                                                : ""
                                                        }
                                                    </div>
                                                    <p
                                                        className="text-[10px]"
                                                        style={{
                                                            color: isToday ? "#7B49FF" : "#D0C4F0",
                                                            fontWeight: isToday ? 900 : 700
                                                        }}
                                                    >
                                                        {date.getDate()}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {Object.keys(moodCount).length > 0 && (
                                        <div className="flex gap-2 flex-wrap mt-4 pt-4" style={{ borderTop: "1px solid #F3EDFF" }}>
                                            {Object.entries(moodCount)
                                                .sort((a: any, b: any) => b[1] - a[1])
                                                .slice(0, 4)
                                                .map(([m, c]: any) => (
                                                    <span
                                                        key={m}
                                                        className="text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5"
                                                        style={{ background: "#F3EDFF", color: "#6E31E8" }}
                                                    >
                                                        <img src={moodImageMap[m] || BASE + "moodie_smile.png"} className="w-5 h-5 object-contain" />
                                                        {m} {c}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== \uBB34\uB514\uC758 \uCE6D\uCC2C \uB9AC\uD3EC\uD2B8 ===== */}
                            <div className="px-5 mt-5">
                                <div
                                    className="rounded-[24px] p-5"
                                    style={{
                                        background: "#fff",
                                        border: "1.5px solid #EDE6FF",
                                        boxShadow: "0 2px 20px rgba(123,73,255,0.06)"
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={BASE + "moodie_write.png"}
                                            className="w-16 shrink-0"
                                            style={{ filter: "drop-shadow(0 4px 8px rgba(123,73,255,0.15))" }}
                                        />
                                        <div className="flex-1">
                                            <h2
                                                className="text-base font-black"
                                                style={{ color: "#2D1654" }}
                                            >
                                                {"\uBB34\uB514\uC758 \uCE6D\uCC2C \uB9AC\uD3EC\uD2B8"}
                                            </h2>
                                            <p
                                                className="text-sm font-bold mt-2 whitespace-pre-line"
                                                style={{ color: "#6E31E8", lineHeight: 1.6 }}
                                            >
                                                {getPraiseMessage()}
                                            </p>
                                        </div>
                                    </div>

                                    {totalLogs > 0 && (
                                        <div className="flex gap-3 mt-4">
                                            <div
                                                className="flex-1 rounded-2xl p-3 text-center"
                                                style={{ background: "#F3EDFF" }}
                                            >
                                                <p
                                                    className="text-xl font-black"
                                                    style={{ color: "#6E31E8" }}
                                                >
                                                    {totalLogs}{"\uD68C"}
                                                </p>
                                                <p className="text-[10px] font-bold mt-0.5" style={{ color: "#9B7EEB" }}>
                                                    {"\uC774\uBC88 \uB2EC \uAE30\uB85D"}
                                                </p>
                                            </div>
                                            <div
                                                className="flex-1 rounded-2xl p-3 text-center"
                                                style={{ background: "#F3EDFF" }}
                                            >
                                                <p className="text-xl font-black" style={{ color: "#6E31E8" }}>
                                                    {topMood ? <img src={moodImageMap[topMood[0]] || BASE + "moodie_smile.png"} className="w-8 h-8 object-contain mx-auto" /> : "\u2014"}
                                                </p>
                                                <p className="text-[10px] font-bold mt-0.5" style={{ color: "#9B7EEB" }}>
                                                    {topMood ? topMood[0] : "\uAC00\uC7A5 \uB9CE\uC740 \uAC10\uC815"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== \uC624\uB298\uC758 \uCD94\uCC9C \uC2A4\uD31F ===== */}
                            <div className="px-5 mt-5">
                                <button
                                    onClick={() => setTab("chat")}
                                    className="w-full rounded-[24px] p-5 text-left flex items-center gap-4"
                                    style={{
                                        background: "linear-gradient(135deg, #7B49FF, #9B6BFF)",
                                        boxShadow: "0 8px 30px rgba(123,73,255,0.25)"
                                    }}
                                >
                                    <img
                                        src={BASE + "moodie_search.png"}
                                        className="w-16 shrink-0"
                                        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
                                    />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
                                            {"\uC624\uB298\uC758 \uBB34\uB4DC \uC2A4\uD31F"}
                                        </p>
                                        <h3 className="text-lg font-black text-white mt-0.5">
                                            {suggestion.name}
                                        </h3>
                                        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                                            {suggestion.desc}
                                        </p>
                                    </div>
                                    <span className="text-white text-xl shrink-0">{"\u203A"}</span>
                                </button>
                            </div>

                            {/* ===== \uBE60\uB978 \uBA54\uB274 ===== */}
                            <div className="px-5 mt-5">
                                <h2
                                    className="text-base font-black mb-3"
                                    style={{ color: "#2D1654" }}
                                >
                                    {"\uBB34\uB514\uC640 \uD568\uAED8\uD558\uAE30"}
                                </h2>
                                <div className="grid grid-cols-3 gap-3">
                                    <button
                                        onClick={() => setTab("chat")}
                                        className="rounded-[20px] p-4 flex flex-col items-center gap-2"
                                        style={{
                                            background: "#fff",
                                            border: "1.5px solid #EDE6FF",
                                            boxShadow: "0 2px 12px rgba(123,73,255,0.04)"
                                        }}
                                    >
                                        <img src={BASE + "moodie_chat.png"} className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-black" style={{ color: "#2D1654" }}>
                                            {"\uB300\uD654\uD558\uAE30"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setTab("map")}
                                        className="rounded-[20px] p-4 flex flex-col items-center gap-2"
                                        style={{
                                            background: "#fff",
                                            border: "1.5px solid #EDE6FF",
                                            boxShadow: "0 2px 12px rgba(123,73,255,0.04)"
                                        }}
                                    >
                                        <img src={BASE + "moodie_map.png"} className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-black" style={{ color: "#2D1654" }}>
                                            {"\uC9C0\uB3C4 \uBCF4\uAE30"}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => setTab("diary")}
                                        className="rounded-[20px] p-4 flex flex-col items-center gap-2"
                                        style={{
                                            background: "#fff",
                                            border: "1.5px solid #EDE6FF",
                                            boxShadow: "0 2px 12px rgba(123,73,255,0.04)"
                                        }}
                                    >
                                        <img src={BASE + "moodie_write.png"} className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-black" style={{ color: "#2D1654" }}>
                                            {"\uC77C\uAE30 \uC4F0\uAE30"}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* ===== \uC6D4\uAC04 \uB9AC\uD3EC\uD2B8 ===== */}
                            <div className="mt-5">
                                <MonthlyReport />
                            </div>
<<<<<<< HEAD

                            <style>{`
                                @keyframes float {
                                    0%, 100% { transform: translateY(0); }
                                    50% { transform: translateY(-8px); }
                                }
                            `}</style>

=======
>>>>>>> 506145b99ad396653df03cba197d465f00d59572
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