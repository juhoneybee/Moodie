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
}

const moodImageMap: any = {
    "?âÎ≥µ?¥Ïöî": "/Moodie/mood_happy.png",
    "?§Î†à??: "/Moodie/mood_excited.png",
    "?†ÎÇò??: "/Moodie/mood_joyful.png",
    "Ï∞®Î∂Ñ?¥Ïöî": "/Moodie/mood_calm.png",
    "?ºÍ≥§?¥Ïöî": "/Moodie/mood_tired.png",
    "Î≥µÏû°?¥Ïöî": "/Moodie/mood_sad.png",
    "?∞Ïö∏?¥Ïöî": "/Moodie/mood_sad.png",
    "?¨Ìçº??: "/Moodie/mood_crying.png",
    "?µÎãµ?¥Ïöî": "/Moodie/mood_angry.png",
    "Î©çÌï¥??: "/Moodie/mood_tired.png",
    "?îÎÇò??: "/Moodie/mood_angry.png",
    "?∏Î°ú?åÏöî": "/Moodie/mood_crying.png"
}

const spotSuggestions: any = {
    "?âÎ≥µ?¥Ïöî": { name: "Î∂ÑÏúÑÍ∏?Ï¢ãÏ? ÎßõÏßë", desc: "?âÎ≥µ???†Ïóî ÎßõÏûà???åÏãùÍ≥??®Íªò!" },
    "?§Î†à??: { name: "?±Ïàò ?ùÏóÖ?§ÌÜ†??, desc: "?§Î†à??ÎßàÏùå???∏Î†å?îÌïú Í≥µÍ∞Ñ ?¥Îïå??" },
    "?†ÎÇò??: { name: "Î∂ÑÏúÑÍ∏?Î∞?, desc: "?†ÎÇò???êÎÑàÏßÄÎ•??¥Ïñ¥Í∞Ä??" },
    "Ï∞®Î∂Ñ?¥Ïöî": { name: "Ï°∞Ïö©??Ïπ¥Ìéò", desc: "Ï∞®Î∂Ñ???§Îäò, Ïª§Ìîº ???îÏùò ?¨Ïú†" },
    "?ºÍ≥§?¥Ïöî": { name: "Í≥µÏõê ?∞Ï±ÖÎ°?, desc: "?êÏó∞ ?çÏóê???êÎÑàÏßÄÎ•?Ï∂©Ï†Ñ?¥Ïöî" },
    "Î≥µÏû°?¥Ïöî": { name: "?ÖÎ¶Ω?úÏ†ê", desc: "Ï±??¨Ïù¥?êÏÑú ÎßàÏùå???ïÎ¶¨?¥Î¥ê?? },
    "?∞Ïö∏?¥Ïöî": { name: "?ÑÏãú??, desc: "?àÏà†???ÑÎ°úÍ∞Ä ?òÏñ¥Ï§?Í±∞Ïòà?? },
    "?¨Ìçº??: { name: "?áÎπõ Ï¢ãÏ? Ïπ¥Ìéò", desc: "?∞Îúª??ÎπõÏù¥ ÎßàÏùå???πÏó¨Ï§?Í±∞Ïòà?? },
    "?µÎãµ?¥Ïöî": { name: "?ÑÎßù Ï¢ãÏ? Í≥?, desc: "???∏Ïù∏ Í≥≥Ïóê?????¨Ïñ¥Î¥êÏöî" },
    "Î©çÌï¥??: { name: "?∞Ï±ÖÎ°?, desc: "Í±∏ÏúºÎ©?Î®∏Î¶¨Í∞Ä ÎßëÏïÑ?∏Ïöî" },
    "?îÎÇò??: { name: "Í≥µÏõê", desc: "Î∞îÎûå??ÎßàÏùå???ùÌ?Ï§?Í±∞Ïòà?? },
    "?∏Î°ú?åÏöî": { name: "?ôÎÑ§ Ïπ¥Ìéò", desc: "?∞Îúª??Í≥µÍ∞Ñ?êÏÑú ?ÑÎ°ú Î∞õÏïÑ?? }
}

function HomeScreen({
    name, tab, setTab, mood, setMood, place, setPlace,
    homeStep, setHomeStep, spots, setSpots
}: Props) {

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
    const dayLabels = ["??, "??, "??, "Î™?, "Í∏?, "??, "??]

    const dateToMood: any = {}
    logs.forEach((item: any) => {
        const d = item.createdAt?.slice(0, 10)
        if (d) dateToMood[d] = item.mood
    })

    const todayMoodLabel = todayLog?.mood || mood || ""
    const suggestion = spotSuggestions[todayMoodLabel] || spotSuggestions["Ï∞®Î∂Ñ?¥Ïöî"]

    const getPraiseMessage = () => {
        if (totalLogs === 0) return "?ÑÏßÅ Í∏∞Î°ù???ÜÏñ¥??\n?§Îäò Ï≤?Í∏∞Î°ù???®Í≤®Î≥ºÍπå??"
        if (totalLogs < 3) return `Î≤åÏç® ${totalLogs}Î≤àÏù¥??Í∏∞Î°ù?àÏñ¥??\nÏ¢ãÏ? ?úÏûë?¥Ïïº ??
        const topMoodName = topMood ? topMood[0] : ""
        const topMoodCount = topMood ? topMood[1] : 0
        if (["?âÎ≥µ?¥Ïöî", "?§Î†à??, "?†ÎÇò??].includes(topMoodName)) {
            return `?¥Î≤à ??${topMoodName}Í∞Ä ${topMoodCount}Î≤?\nÏ¢ãÏ? ?êÎ¶Ñ???¥Ïñ¥ÏßÄÍ≥??àÏñ¥???ÄÔ∏?
        }
        if (["?∞Ïö∏?¥Ïöî", "?¨Ìçº??, "?∏Î°ú?åÏöî"].includes(topMoodName)) {
            return `${totalLogs}Î≤?Í∏∞Î°ù?òÎ©¥????Î≤ÑÌÖ®?îÏñ¥??\nÎ¨¥ÎîîÍ∞Ä ??ÉÅ Í≥ÅÏóê ?àÏùÑÍ≤åÏöî ?åô`
        }
        return `?¥Î≤à ??${totalLogs}Î≤?Í∏∞Î°ù!\nÍæ∏Ï???Í∞êÏ†ï???åÎ≥¥???πÏã†??Î©ãÏ†∏???åø`
    }

    const greetingByTime = () => {
        const h = now.getHours()
        if (h < 12) return "Ï¢ãÏ? ?ÑÏπ®?¥Ïóê??
        if (h < 18) return "Ï¢ãÏ? ?§ÌõÑ?àÏöî"
        return "Ï¢ãÏ? ?Ä?ÅÏù¥?êÏöî"
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
                        />
                    ) : (

                        <div className="h-full overflow-y-auto pb-32 bg-[#FAFAFE]">

                            {/* ===== ?§Îçî ===== */}
                            <div
                                className="px-6 pt-14 pb-8"
                                style={{
                                    background: "linear-gradient(180deg, #F3EDFF 0%, #FAFAFE 100%)"
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold" style={{ color: "#9B7EEB" }}>
                                            {greetingByTime()} ?ÅÔ∏è
                                        </p>
                                        <h1
                                            className="text-[32px] font-black mt-1"
                                            style={{
                                                color: "#2D1654",
                                                letterSpacing: "-1px",
                                                lineHeight: 1.2
                                            }}
                                        >
                                            {name || "?¨Ïö©??}??                                        </h1>
                                    </div>
                                    <img
                                        src="/Moodie/moodie_smile.png"
                                        className="w-20 drop-shadow-lg"
                                        style={{
                                            animation: "float 3s ease-in-out infinite"
                                        }}
                                    />
                                </div>
                            </div>

                            {/* ===== ?§Îäò??Í∞êÏ†ï ===== */}
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
                                            <img src={moodImageMap[todayLog.mood] || "/Moodie/moodie_smile.png"} className="w-14 h-14 object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold" style={{ color: "#9B7EEB" }}>
                                                ?§Îäò??Í∏∞Î∂Ñ
                                            </p>
                                            <h3
                                                className="text-xl font-black mt-0.5"
                                                style={{ color: "#2D1654" }}
                                            >
                                                {todayLog.mood}
                                            </h3>
                                            {todayLog.place && (
                                                <p className="text-xs mt-1" style={{ color: "#B9A3F0" }}>
                                                    ?ìç {todayLog.place}?êÏÑú
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
                                            <img src="/Moodie/moodie_smile.png" className="w-12" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold" style={{ color: "#9B7EEB" }}>
                                                ?§Îäò??Í∏∞Î∂Ñ
                                            </p>
                                            <h3
                                                className="text-base font-black mt-0.5"
                                                style={{ color: "#2D1654" }}
                                            >
                                                ?ÑÏßÅ Í∏∞Î°ù?òÏ? ?äÏïò?¥Ïöî
                                            </h3>
                                            <p className="text-xs font-bold mt-1" style={{ color: "#7B49FF" }}>
                                                ÏßÄÍ∏?Í∏∞Î°ù?òÍ∏∞ ??                                            </p>
                                        </div>
                                    </button>
                                )}
                            </div>

                            {/* ===== ?¥Î≤à Ï£?Í∞êÏ†ï Ï∫òÎ¶∞??===== */}
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
                                            ?¥Î≤à Ï£?Í∞êÏ†ï
                                        </h2>
                                        <span
                                            className="text-xs font-bold px-3 py-1 rounded-full"
                                            style={{ background: "#F3EDFF", color: "#7B49FF" }}
                                        >
                                            {now.getMonth() + 1}??                                        </span>
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
                                                            ? <img src={moodImageMap[moodLabel] || "/Moodie/moodie_smile.png"} className="w-9 h-9 object-contain" />
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
                                                        <img src={moodImageMap[m] || "/Moodie/moodie_smile.png"} className="w-5 h-5 object-contain" />
                                                        {m} {c}
                                                    </span>
                                                ))
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== Î¨¥Îîî??Ïπ?∞¨ Î¶¨Ìè¨??===== */}
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
                                            src="/Moodie/moodie_write.png"
                                            className="w-16 shrink-0"
                                            style={{ filter: "drop-shadow(0 4px 8px rgba(123,73,255,0.15))" }}
                                        />
                                        <div className="flex-1">
                                            <h2
                                                className="text-base font-black"
                                                style={{ color: "#2D1654" }}
                                            >
                                                Î¨¥Îîî??Ïπ?∞¨ Î¶¨Ìè¨??                                            </h2>
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
                                                    {totalLogs}??                                                </p>
                                                <p className="text-[10px] font-bold mt-0.5" style={{ color: "#9B7EEB" }}>
                                                    ?¥Î≤à ??Í∏∞Î°ù
                                                </p>
                                            </div>
                                            <div
                                                className="flex-1 rounded-2xl p-3 text-center"
                                                style={{ background: "#F3EDFF" }}
                                            >
                                                <p
                                                    className="text-xl font-black"
                                                    style={{ color: "#6E31E8" }}
                                                >
                                                    {topMood ? moodMap[topMood[0]] || "?ÅÔ∏è" : "??}
                                                </p>
                                                <p className="text-[10px] font-bold mt-0.5" style={{ color: "#9B7EEB" }}>
                                                    {topMood ? topMood[0] : "Í∞Ä??ÎßéÏ? Í∞êÏ†ï"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ===== ?§Îäò??Ï∂îÏ≤ú ?§Ìåü ===== */}
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
                                        src="/Moodie/moodie_search.png"
                                        className="w-16 shrink-0"
                                        style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))" }}
                                    />
                                    <div className="flex-1">
                                        <p className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>
                                            ?§Îäò??Î¨¥Îìú ?§Ìåü
                                        </p>
                                        <h3 className="text-lg font-black text-white mt-0.5">
                                            {suggestion.name}
                                        </h3>
                                        <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.8)" }}>
                                            {suggestion.desc}
                                        </p>
                                    </div>
                                    <span className="text-white text-xl shrink-0">??/span>
                                </button>
                            </div>

                            {/* ===== Îπ†Î•∏ Î©îÎâ¥ ===== */}
                            <div className="px-5 mt-5">
                                <h2
                                    className="text-base font-black mb-3"
                                    style={{ color: "#2D1654" }}
                                >
                                    Î¨¥Îîî?Ä ?®Íªò?òÍ∏∞
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
                                        <img src="/Moodie/moodie_chat.png" className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-black" style={{ color: "#2D1654" }}>
                                            ?Ä?îÌïòÍ∏?                                        </span>
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
                                        <img src="/Moodie/moodie_map.png" className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-black" style={{ color: "#2D1654" }}>
                                            ÏßÄ??Î≥¥Í∏∞
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
                                        <img src="/Moodie/moodie_write.png" className="w-12 h-12 object-contain" />
                                        <span className="text-xs font-black" style={{ color: "#2D1654" }}>
                                            ?ºÍ∏∞ ?∞Í∏∞
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* ===== ?îÍ∞Ñ Î¶¨Ìè¨??===== */}
                            <div className="mt-5">
                                <MonthlyReport />
                            </div>

                            {/* float ?†ÎãàÎ©îÏù¥??*/}
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
