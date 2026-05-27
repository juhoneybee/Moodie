import { useState } from "react"

function SettingsTab() {
    const [name, setName] = useState(
        localStorage.getItem("username") || ""
    )
    const [editName, setEditName] = useState(false)
    const [tempName, setTempName] = useState(name)
    const [notify, setNotify] = useState(
        localStorage.getItem("notify") !== "false"
    )

    const saveName = () => {
        if (!tempName.trim()) {
            alert("이름을 입력해주세요 ☁️")
            return
        }
        localStorage.setItem("username", tempName)
        setName(tempName)
        setEditName(false)
    }

    const toggleNotify = () => {
        const next = !notify
        setNotify(next)
        localStorage.setItem("notify", String(next))
    }

    const resetAll = () => {
        const ok = confirm(
            "모든 기록이 사라져요. 정말 초기화할까요?"
        )
        if (!ok) return
        localStorage.clear()
        location.reload()
    }

    return (
        <div className="h-full overflow-y-auto px-6 pt-12 pb-32 bg-[#f7f4ff]">
            <h1 className="text-[34px] font-black text-[#6E31E8]">
                설정
            </h1>
            <p className="mt-2 text-purple-400">
                무디와의 시간을 나에게 맞게
            </p>

            {/* 내 정보 */}
            <p className="mt-8 mb-3 text-sm font-black text-[#8668C8]">
                내 정보
            </p>
            <div className="bg-white rounded-[28px] p-5">
                {editName ? (
                    <div className="flex gap-3">
                        <input
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            placeholder="닉네임"
                            className="flex-1 h-12 rounded-2xl px-4 bg-[#f7f4ff] outline-none"
                        />
                        <button
                            onClick={saveName}
                            className="px-5 rounded-2xl bg-[#7B49FF] text-white font-black"
                        >
                            저장
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setTempName(name)
                            setEditName(true)
                        }}
                        className="w-full flex items-center justify-between"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#EEE6FF] flex items-center justify-center text-2xl">
                                ☁️
                            </div>
                            <div className="text-left">
                                <p className="font-black text-lg text-[#4D278C]">
                                    {name || "사용자"}
                                </p>
                                <p className="text-sm text-purple-400">
                                    닉네임 변경
                                </p>
                            </div>
                        </div>
                        <span className="text-purple-300 text-xl">›</span>
                    </button>
                )}
            </div>

            {/* 알림 */}
            <p className="mt-8 mb-3 text-sm font-black text-[#8668C8]">
                알림
            </p>
            <div className="bg-white rounded-[28px] p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-[#EEE6FF] flex items-center justify-center text-2xl">
                            🔔
                        </div>
                        <div>
                            <p className="font-black text-lg text-[#4D278C]">
                                감정 기록 알림
                            </p>
                            <p className="text-sm text-purple-400">
                                오늘 기분을 잊지 않도록
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={toggleNotify}
                        className={`
                            relative w-14 h-8 rounded-full transition
                            ${notify ? "bg-[#7B49FF]" : "bg-[#D8DCE6]"}
                        `}
                    >
                        <div
                            className={`
                                absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-all
                                ${notify ? "left-7" : "left-1"}
                            `}
                        />
                    </button>
                </div>
            </div>

            {/* 데이터 */}
            <p className="mt-8 mb-3 text-sm font-black text-[#8668C8]">
                데이터
            </p>
            <button
                onClick={resetAll}
                className="w-full bg-white rounded-[28px] p-5 flex items-center justify-between"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#FFE6E6] flex items-center justify-center text-2xl">
                        🗑️
                    </div>
                    <div className="text-left">
                        <p className="font-black text-lg text-[#E04444]">
                            전체 데이터 초기화
                        </p>
                        <p className="text-sm text-purple-400">
                            모든 기록과 설정 삭제
                        </p>
                    </div>
                </div>
                <span className="text-purple-300 text-xl">›</span>
            </button>

            {/* 앱 정보 */}
            <p className="mt-8 mb-3 text-sm font-black text-[#8668C8]">
                앱 정보
            </p>
            <div className="bg-white rounded-[28px] p-5 text-center">
                <p className="text-2xl font-black text-[#6E31E8]">
                    MOODMAP
                </p>
                <p className="mt-1 text-sm text-purple-400">
                    v1.0.0
                </p>
            </div>
        </div>
    )
}

export default SettingsTab