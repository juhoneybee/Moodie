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

<div
className="
h-full
overflow-y-auto
pb-32
"
>

<div
className="
px-6
pt-12
"
>

<h1
className="
text-[42px]
font-black
text-[#6E31E8]
"
>

{name || "사용자"}님

</h1>

<p
className="
mt-2
pb-4
text-purple-400
"
>

오늘도 무디와 함께해요

</p>

</div>

<MonthlyReport />

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