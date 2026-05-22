import BottomNav from "../components/BottomNav"
import HomeTab from "./main/HomeTab"
import MapTab from "./main/MapTab"
import ChatTab from "./main/ChatTab"
import DiaryTab from "./main/DiaryTab"
import SettingsTab from "./main/SettingsTab"

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
    setSpots
}: Props) {
    return (
        <section className="h-full bg-[#f7f4ff] relative">
            <div className="h-full pb-32">
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
                        />
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-400" />
                            <h1 className="mt-8 text-4xl font-black text-purple-700">
                                {name || "Moodie"}
                            </h1>
                            <p className="mt-4 text-purple-400">
                                오늘의 추천 완료 ☁️
                            </p>
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