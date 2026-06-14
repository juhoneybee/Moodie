import { useEffect, useState } from 'react'
import OptionCard from './components/OptionCard'
import StepCard from './components/StepCard'
import { questions } from './data/questions'
import PermissionScreen from "./screens/PermissionScreen"
import HomeScreen from "./screens/HomeScreen"

function App() {
    const [step, setStep] = useState(-1)
    const [screen, setScreen] = useState("")
    const [tab, setTab] = useState("home")
    const [mood, setMood] = useState("")
    const [place, setPlace] = useState("")
    const [homeStep, setHomeStep] = useState(0)
    const [name, setName] = useState(localStorage.getItem("username") || "")
    const [location, setLocation] = useState({lat:0, lng:0})
    const [selected, setSelected] = useState<string[]>([])
    const [spots, setSpots] = useState<any[]>([])
    const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null)

    const toggleOption = (option: string) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option))
        } else {
            setSelected([...selected, option])
        }
    }

   useEffect(() => {
    const savedName = localStorage.getItem("username")
    if (savedName) {
        setTimeout(() => {
            setName(savedName)
            setScreen("home")
        }, 0)
    } else {
        setTimeout(() => setScreen("onboarding"), 0)
    }
}, [])
    return (
        <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#f5edff] to-[#e9ddff] p-4">
            <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[40px] border border-white bg-white/40 shadow-2xl backdrop-blur-2xl">
                
                {/* ONBOARDING SCREEN */}
                {screen === "onboarding" && (
                    <>
                        <div className="h-full overflow-y-auto p-6 pb-[180px]">
                            {/* Header */}
                            <div className="mb-10 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {step >= 0 && (
                                        <button
                                            onClick={() => setStep(step - 1)}
                                            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow"
                                        >
                                            ←
                                        </button>
                                    )}
                                    <h1 className="text-2xl font-black text-purple-700">MOODMAP</h1>
                                </div>
                                {step === -1 ? (
                                    <button
                                        onClick={() => { setScreen("home") }}
                                        className="text-purple-400 font-medium"
                                    >
                                        건너뛰기
                                    </button>
                                ) : (
                                    <p className="text-purple-400">
                                        {step}/{questions.length}
                                    </p>
                                )}
                            </div>

                            {/* Intro (Step -1) */}
                            {step === -1 && (
                                <div className="text-center">
                                    <img src="./moodie.png" className="mx-auto w-56" alt="Moodie" />
                                    <h2 className="mt-8 text-4xl font-black text-purple-700">
                                        나에게 딱 맞는<br />공간을 찾아볼까요?
                                    </h2>
                                </div>
                            )}

                            {/* Questions (Step >= 0) */}
                            {step === 0 && (
                                <>
                                    <StepCard step={1} />
                                    <h2 className="text-4xl font-black mt-6 text-[#33215f]">
                                        어떻게<br />불러드릴까요?
                                    </h2>
                                    <p className="mt-4 text-purple-400">
                                        이름 또는 닉네임 입력
                                    </p>
                                    <input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="예: 무디"
                                        className="mt-10 w-full h-16 rounded-full px-8 text-xl outline-none bg-white shadow-sm"
                                    />
                                </>
                            )}

                            {step > 0 && step <= questions.length && (
                                <>
                                    <StepCard step={step} />
                                    <h2 className="text-4xl font-black mt-6">
                                        {questions[step - 1].title}
                                    </h2>
                                    <p className="mt-3 text-purple-400">
                                        복수 선택 가능
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mt-10">
                                       {questions[step - 1].options.map((option: any) => (
                                        <OptionCard
                                        key={option.label}  
                                        label={option.label}
                                        selected={selected.includes(option.label)}
                                        onClick={() => toggleOption(option.label)}    />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Bottom Button */}
                        <div className="absolute bottom-8 left-6 right-6 z-50">
                            <button
                                onClick={() => {
                                    if (step === 0 && !name.trim()) {
                                        alert("이름을 입력해주세요 ☁️")
                                        return
                                    }
                                    if (step === 0){
                                        localStorage.setItem("username", name)
                                    }
                                    if (step < questions.length) {
                                        setStep(step + 1)
                                    } else {
                                        setScreen("permission")
                                    }
                                }}
                                className="h-[68px] w-full rounded-full bg-gradient-to-r from-[#7B49FF] to-[#B381FF] font-bold text-white text-xl shadow-xl"
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}

                {/* PERMISSION SCREEN */}
                {screen === "permission" && (
                    <PermissionScreen
                        onFinish={() => setScreen("home")}
                        setLocation={setLocation}
                    />
                )}

                {/* HOME SCREEN */}
                {screen === "home" && (
                    <>
                        <HomeScreen 
                            name={name}
                            tab={tab}
                            setTab={setTab}
                            mood={mood}
                            setMood={setMood}
                            place={place}
                            setPlace={setPlace}
                            homeStep={homeStep}
                            setHomeStep={setHomeStep}
                            spots={spots}
                            setSpots={setSpots}
                            selectedSpotId={selectedSpotId}
                            setSelectedSpotId={setSelectedSpotId}
                            location={location}
                            setLocation={setLocation}
                        />
                    </>  
                )}

            </div>
        </main>
    )
}

export default App