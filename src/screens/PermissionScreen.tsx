import PermissionCard from "../components/PermissionCard"

interface Props {
    onFinish: () => void
    setLocation: any
}

function PermissionScreen({
    onFinish,
    setLocation
}: Props) {
    return (
        <section
            className="
            h-full
            overflow-y-auto
            px-8
            pt-6
            pb-6
            bg-[#f7f4ff]
            "
        >
            <div className="flex items-center justify-between mb-10">
                <h1 className="text-2xl font-black text-purple-700">
                    MOODMAP
                </h1>
            </div>

            {/* Character */}
            <div className="flex justify-center">
                <img
                    src="./moodie.png"
                    className="
                    w-44
                    drop-shadow-xl
                    "
                />
            </div>

            {/* Title */}
            <div className="mt-6 text-center">
                <h1
                    className="
                    text-[28px]
                    leading-[1.15]
                    font-black
                    text-[#6E31E8]
                    "
                >
                    원활한 서비스 이용을 위해
                    <br />
                    권한이 필요해요!
                </h1>

                <p
                    className="
                    mt-5
                    text-xl
                    text-[#A57AFF]
                    leading-relaxed
                    "
                >
                    무디와 함께
                    <br />
                    감정 지도를 완성해봐요!
                </p>
            </div>

            {/* Cards */}
            <div className="mt-5 space-y-6">
                <PermissionCard
                    icon="📍"
                    title="위치 권한"
                    desc="주변 무드스팟을 추천해드려요"
                />
                <PermissionCard
                    icon="🔔"
                    title="알림 설정"
                    desc="감정 리포트를 놓치지 마세요"
                />
            </div>

            {/* CTA */}
            <button
                onClick={() => {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setLocation({
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            })
                            onFinish()
                        },
                        (error) => {
                            console.error(error)
                            alert("위치 권한이 필요해요 ☁️")
                        }
                    )
                }}
                className="
                mt-12
                h-16
                w-full
                rounded-full
                bg-gradient-to-r
                from-[#7B49FF]
                to-[#B381FF]
                text-white
                text-xl
                font-bold
                shadow-xl
                shrink-0
                "
            >
                좋아요! 권한 허용하기 →
            </button>

            <button
                onClick={onFinish}
                className="
                w-full
                h-[56px]
                mt-3
                text-[#B497F9]
                text-lg
                font-semibold
                shrink-0
                "
            >
                나중에 할래요
            </button>
        </section>
    )
}

export default PermissionScreen