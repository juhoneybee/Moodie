import { useState } from "react"
import { chatQuestions } from "../../data/chatQuestions"

type Message = {
    role: "bot" | "user"
    text: string
    places?: string[]
}

function ChatTab() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: "bot",
            text: "안녕 오늘 기분이 어때?"
        }
    ])
    const [input, setInput] = useState("")

    const detectMood = (text: string) => {
        const found = chatQuestions.find((item) =>
            item.keywords.some((keyword) => text.includes(keyword))
        )
        if (found) {
            return found
        }
        return {
            emotion: "복잡해요",
            reply: "조금 더 이야기해줄래?",
            places: ["☁️ 무드 스팟"]
        }
    }

    const send = () => {
        if (!input.trim()) return
        const result = detectMood(input)
        setMessages([
            ...messages,
            { role: "user", text: input },
            { role: "bot", text: result.reply, places: result.places }
        ])
        setInput("")
    }

    return (
        <section className="h-full flex flex-col">
            {/* 채팅 */}
            <div className="flex-1 overflow-y-auto px-6 pt-10 pb-28">
                <h1 className="text-4xl font-black text-[#6E31E8] mb-8">
                    무디와 대화하기 ☁️
                </h1>
                <div className="space-y-4">
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[80%] px-5 py-4 rounded-[28px] ${msg.role === "user" ? "bg-[#7B49FF] text-white" : "bg-white text-[#5D3EBF]"}`}>
                                <p>{msg.text}</p>
                                {msg.places && (
                                    <div className="mt-4 space-y-2">
                                        {msg.places.map((place) => (
                                            <div key={place} className="bg-white/60 rounded-2xl px-4 py-3 text-sm">
                                                {place}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 입력 */}
            <div className="absolute bottom-28 left-5 right-5">
                <div className="flex gap-3">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="지금 기분 이야기하기"
                        className="flex-1 h-14 rounded-full px-6 outline-none"
                    />
                    <button onClick={send} className="w-16 rounded-full bg-[#7B49FF] text-white">
                        ↑
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ChatTab