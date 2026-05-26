import { homeQuestions } from "../../data/homeQuestions"

function MonthlyReport() {
    const logs = JSON.parse(localStorage.getItem("moodLogs") || "[]")
    const now = new Date()

    const currentMonth = logs.filter((item: any) => {
        const date = new Date(item.createdAt)
        return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        )
    })

    const moodCount: any = {}
    const placeCount: any = {}

    currentMonth.forEach((item: any) => {
        moodCount[item.mood] = (moodCount[item.mood] || 0) + 1
        placeCount[item.place] = (placeCount[item.place] || 0) + 1
    })

    const moodMap = Object.fromEntries(
        homeQuestions.mood.options.map((item: any) => [item.label, item.emoji])
    )

    const placeMap = Object.fromEntries(
        homeQuestions.place.options.map((item: any) => {
            if (typeof item === "string") {
                return [item, "📍"]
            }
            return [item.label, item.emoji || "📍"]
        })
    )

    return (
        <div className="px-6 pb-10">
            <div className="rounded-[36px] bg-white p-8 shadow">
                <h2 className="text-2xl font-black text-[#6E31E8]">
                    이번 달 리포트
                </h2>

                {/* 감정 */}
                <p className="mt-6 text-xl font-black text-[#8668C8]">
                    감정 기록
                </p>
                <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                    {Object.entries(moodCount)
                        .sort((a: any, b: any) => b[1] - a[1])
                        .map(([mood, count]: any) => (
                            <div
                                key={mood}
                                className="flex-shrink-0 w-[72px] h-[96px] rounded-[20px] bg-[#F7F4FF] flex flex-col justify-center items-center px-1"
                            >
                                <div className="text-3xl">{moodMap[mood] || "☁️"}</div>
                                <div className="mt-1 text-[16px] leading-none font-black text-[#6E31E8]">
                                    {mood}
                                </div>
                                <div className="mt-1 text-[12px] text-purple-400">
                                    {count}회
                                </div>
                            </div>
                        ))}
                </div>

                {/* 장소 */}
                <p className="mt-4 text-xl font-black text-[#8668C8]">
                    장소 기록
                </p>
                <div className="mt-5 flex gap-2 overflow-x-auto pb-2 pr-6">
                    {Object.entries(placeCount)
                        .sort((a: any, b: any) => b[1] - a[1])
                        .map(([place, count]: any) => (
                            <div
                                key={place}
                                className="flex-shrink-0 w-[72px] h-[96px] rounded-[20px] bg-[#F7F4FF] flex flex-col justify-center items-center px-1"
                            >
                                <div className="text-3xl">{placeMap[place] || "📍"}</div>
                                <div className="mt-1 text-[16px] leading-none font-black text-[#6E31E8]">
                                    {place}
                                </div>
                                <div className="mt-1 text-[12px] text-purple-400">
                                    {count}회
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default MonthlyReport