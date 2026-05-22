import { homeQuestions } from "../../data/homeQuestions"

interface Props {
    name: string
    mood: string
    setMood: any
    place: string
    setPlace: any
    homeStep: number
    setHomeStep: any
    setSpots: any
}

function HomeTab({
    name,
    mood,
    setMood,
    place,
    setPlace,
    homeStep,
    setHomeStep,
    setSpots
}: Props) {
    const currentQuestion = homeStep === 0 ? homeQuestions.mood : homeStep === 1 ? homeQuestions.place : null
    if (!currentQuestion) return null

    const selected = homeStep === 0 ? mood : place

    return (
        <section className="h-full relative flex flex-col">
            <div className={`overflow-y-auto ${homeStep === 0 ? "h-[calc(100%-70px)]" : "h-[calc(100%-140px)]"} pb-8`}>
                <div className="px-8 pt-14">
                    {homeStep === 0 && (
                        <>
                            <img src="./moodie.png" className="w-40 mx-auto" />
                            <h1 className="mt-8 text-center text-[52px] leading-none font-black text-[#6E31E8]">
                                {name || "사용자"}님<br />환영해요 ☁️
                            </h1>
                        </>
                    )}
                    <p className={`text-center font-black tracking-[-0.03em] text-[#6E31E8] ${homeStep === 0 ? "mt-5 text-[22px]" : "mt-16 text-[40px]"}`}>
                        {currentQuestion.title}
                    </p>
                </div>

                <div className="mt-12 px-6 grid grid-cols-2 gap-6">
                    {homeStep === 0
                        ? currentQuestion.options.map((item: any) => (
                            <button key={item.label} onClick={() => setMood(item.label)}>
                                <div className="aspect-square rounded-full flex items-center justify-center" style={{ background: item.color }}>
                                    <div className="text-6xl">{item.emoji}</div>
                                </div>
                                <p className={`mt-4 text-2xl font-black ${mood === item.label ? "text-[#6E31E8]" : "text-[#8668C8]"}`}>
                                    {item.label}
                                </p>
                            </button>
                        ))
                        : currentQuestion.options.map((item: any) => (
                            <button
                                key={item}
                                onClick={() => setPlace(item)}
                                className={`h-[140px] rounded-[40px] bg-white font-black text-3xl shadow ${place === item ? "border-[6px] border-purple-500 scale-105" : ""}`}
                            >
                                {item}
                            </button>
                        ))}
                </div>
            </div>

            <div className="absolute bottom-[-10px] left-6 right-6 z-50">
                {homeStep === 1 && (
                    <button
                        onClick={() => {
                            setMood("")
                            setPlace("")
                            setHomeStep(0)
                        }}
                        className="mb-3 w-full h-16 rounded-full bg-white text-purple-500 text-lg font-black shadow-sm transition"
                    >
                        ← 이전 단계
                    </button>
                )}
                <button
                    disabled={!selected}
                    onClick={() => {
                        if (!selected) return
                        if (homeStep === 0) {
                            setHomeStep(1)
                            return
                        }
                        fetch(`http://localhost:3000/recommend?mood=${mood}&place=${place}`)
                            .then(r => r.json())
                            .then(data => {
                                console.log("추천 결과", data)
                                setSpots(data)
                            })
                            .catch(console.error)
                            .finally(() => {
                                setHomeStep(2)
                            })
                    }}
                    className={`w-full h-16 rounded-full text-lg font-black transition-all duration-300 ${selected ? "text-white bg-gradient-to-r from-[#7B49FF] to-[#B381FF] shadow-lg" : "bg-[#D8DCE6] text-white shadow-none"}`}
                >
                    다음 단계
                </button>
            </div>
        </section>
    )
}

export default HomeTab