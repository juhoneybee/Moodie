import { useState } from "react"

const BASE = "/Moodie/"

function SettingsTab() {
    const [name, setName] = useState(localStorage.getItem("username") || "Moodi")
    const [editName, setEditName] = useState(false)
    const [tempName, setTempName] = useState(name)
    const [notify, setNotify] = useState(localStorage.getItem("notify") !== "false")

    const logs = JSON.parse(localStorage.getItem("moodLogs") || "[]")
    const visitedPlaces = new Set(logs.map((l: any) => l.place).filter(Boolean)).size
    const likedPlaces = parseInt(localStorage.getItem("likedCount") || "0")
    const xp = logs.length * 40
    const level = Math.floor(xp / 1000) + 1
    const xpInLevel = xp % 1000

    const saveName = () => {
        if (!tempName.trim()) { alert("이름을 입력해주세요"); return }
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
        if (!confirm("모든 기록이 사라져요. 정말 초기화할까요?")) return
        localStorage.clear()
        location.reload()
    }

    const menuItems = [
        { label: "취향 & 선호 설정" },
        { label: "활동 지역 설정" },
        { label: "알림 설정", toggle: true },
        { label: "개인정보 및 보안" },
        { label: "앱 정보" },
    ]

    return (
        <div className="h-full overflow-y-auto bg-[#f7f4ff] pb-32">

            {/* 상단 헤더 */}
            <div className="px-5 pt-12 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <img src={BASE + "moodie_smile.png"} className="w-7 h-7 object-contain" />
                    <span className="text-base font-black text-[#2D1654]">MOODMAP</span>
                </div>
                <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B7EEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                    </button>
                    <button className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9B7EEB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                    </button>
                </div>
            </div>

            {/* 프로필 카드 */}
            <div className="px-5 mt-2">
                <div className="bg-white rounded-[28px] p-5">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-full bg-[#EEE6FF] flex items-center justify-center overflow-hidden">
                                <img src={BASE + "moodie_smile.png"} className="w-10 h-10 object-contain" />
                            </div>
                            <button className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#7B49FF] flex items-center justify-center shadow"
                                style={{ fontSize: 12, color: "#fff", fontWeight: 900 }}>+</button>
                        </div>
                        <div className="flex-1">
                            {editName ? (
                                <div className="flex gap-2">
                                    <input
                                        value={tempName}
                                        onChange={(e) => setTempName(e.target.value)}
                                        className="flex-1 h-9 rounded-xl px-3 bg-[#f7f4ff] outline-none text-sm font-black text-[#4D278C]"
                                        autoFocus
                                    />
                                    <button onClick={saveName} className="px-3 rounded-xl bg-[#7B49FF] text-white text-xs font-black">저장</button>
                                </div>
                            ) : (
                                <div>
                                    <p className="font-black text-lg text-[#2D1654]">안녕하세요, {name}님</p>
                                    <p className="text-xs text-purple-400 mt-0.5">moodi@example.com</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => { setTempName(name); setEditName(true) }}
                        className="mt-4 w-full h-9 rounded-xl bg-[#f7f4ff] text-[#7B49FF] text-sm font-black"
                    >
                        프로필 편집
                    </button>
                </div>
            </div>

            {/* Moodi 등급 */}
            <div className="px-5 mt-3">
                <div className="rounded-[28px] p-5 flex items-center gap-4"
                    style={{ background: "linear-gradient(135deg, #7B49FF, #B381FF)" }}>
                    <div className="flex-1">
                        <p className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.7)" }}>Moodie 등급</p>
                        <p className="text-2xl font-black text-white mt-0.5">Lv. {level}</p>
                        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.25)" }}>
                            <div className="h-full rounded-full bg-white" style={{ width: `${(xpInLevel / 1000) * 100}%` }} />
                        </div>
                        <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{xpInLevel} / 1,000</p>
                    </div>
                    <img src={BASE + "moodie_smile.png"} className="w-16 h-16 object-contain" style={{ opacity: 0.9 }} />
                </div>
            </div>

            {/* 나의 통계 */}
            <div className="px-5 mt-3">
                <p className="text-sm font-black text-[#8668C8] mb-3">나의 통계</p>
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { value: logs.length, label: "기록한 날" },
                        { value: visitedPlaces, label: "방문한 장소" },
                        { value: likedPlaces, label: "좋아한 장소" },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-[20px] p-4 text-center">
                            <p className="text-2xl font-black text-[#2D1654]">{stat.value}</p>
                            <p className="text-[10px] text-purple-400 mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 내 정보 메뉴 */}
            <div className="px-5 mt-3">
                <p className="text-sm font-black text-[#8668C8] mb-3">내 정보</p>
                <div className="bg-white rounded-[28px] overflow-hidden">
                    {menuItems.map((item, i) => (
                        <div key={item.label}>
                            {i > 0 && <div className="mx-5 h-[0.5px] bg-[#F3EDFF]" />}
                            <div className="flex items-center justify-between px-5 py-4">
                                <span className="text-sm font-bold text-[#2D1654]">{item.label}</span>
                                {item.toggle ? (
                                    <button
                                        onClick={toggleNotify}
                                        className={`relative w-12 h-6 rounded-full transition-colors ${notify ? "bg-[#7B49FF]" : "bg-[#D8DCE6]"}`}
                                    >
                                        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${notify ? "left-6" : "left-0.5"}`} />
                                    </button>
                                ) : (
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4B5F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"/>
                                    </svg>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Moodi Premium */}
            <div className="px-5 mt-3">
                <button className="w-full bg-white rounded-[28px] p-5 flex items-center gap-4 text-left"
                    style={{ border: "1.5px solid #EDE6FF" }}>
                    <img src={BASE + "moodie_smile.png"} className="w-10 h-10 object-contain" />
                    <div className="flex-1">
                        <p className="font-black text-[#2D1654] text-sm">Moodie Premium</p>
                        <p className="text-xs text-purple-400 mt-0.5">더 자세한 분석과 맞춤 추천을 경험해보세요!</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4B5F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            </div>

            {/* 데이터 초기화 */}
            <div className="px-5 mt-3">
                <button onClick={resetAll}
                    className="w-full bg-white rounded-[28px] p-5 flex items-center justify-between text-left">
                    <span className="text-sm font-bold text-[#E04444]">전체 데이터 초기화</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4B5F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                    </svg>
                </button>
            </div>

            <p className="text-center text-[11px] text-purple-300 mt-6 mb-2">MOODMAP v1.0.0</p>
        </div>
    )
}

export default SettingsTab