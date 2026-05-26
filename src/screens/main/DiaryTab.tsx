import { useEffect, useState } from "react"
import {detectMood} from "../../utils/detectMood"

interface Diary {
  id:number
  date:string

  mood:string

  activity:string

  content:string

  detectedMood:string
}

function DiaryTab() {
  const [showWrite, setShowWrite] =
    useState(false)

  const [diaries, setDiaries] =
    useState<Diary[]>([])

    useEffect(()=>{

const saved=
localStorage.getItem(
"diaries"
)

if(saved){

setDiaries(
JSON.parse(saved)
)

}

},[])

  const [date, setDate] =
    useState(
      new Date()
        .toISOString()
        .slice(0, 10)
    )

  const [mood, setMood] =
    useState("")

  const [activity, setActivity] =
    useState("")

  const [content, setContent] =
    useState("")

  const saveDiary = () => {
    if (!mood || !content) {
      alert(
        "감정과 일기를 입력해주세요 ☁️"
      )
      return
    }

const newDiary:Diary={

id:Date.now(),

date,

mood,

activity,

content,

detectedMood:
detectMood(
`
${mood}
${activity}
${content}
`
)

}

const updated=[

newDiary,

...diaries

]

setDiaries(
updated
)

localStorage.setItem(
"diaries",

JSON.stringify(
updated
)
)

    setDate(
      new Date()
        .toISOString()
        .slice(0, 10)
    )

    setMood("")
    setActivity("")
    setContent("")

    setShowWrite(false)
  }

  if (showWrite) {
    return (
      <section className="h-full bg-[#f7f4ff] flex flex-col">

        {/* 상단 */}
        <div className="flex items-center justify-between px-6 pt-10">

          <button
            onClick={() =>
              setShowWrite(false)
            }
            className="text-xl"
          >
            ←
          </button>

          <h1 className="font-black text-xl text-[#6E31E8]">
            감정 일기
          </h1>

          <button
            onClick={saveDiary}
            className="
              text-[#7B49FF]
              font-black
            "
          >
            저장
          </button>

        </div>

        {/* 작성 */}
        <div className="flex-1 overflow-y-auto px-6 pt-8 pb-32 space-y-6">

          <div>
            <p className="font-bold mb-2">
              날짜
            </p>

            <input
              type="date"
              value={date}
              onChange={(e)=>
                setDate(
                  e.target.value
                )
              }
              className="
                w-full
                h-14
                rounded-3xl
                px-5
              "
            />
          </div>

          <div>
            <p className="font-bold mb-2">
              오늘 감정
            </p>

            <input
              value={mood}
              onChange={(e)=>
                setMood(
                  e.target.value
                )
              }
              placeholder="예: 행복했어요"
              className="
                w-full
                h-14
                rounded-3xl
                px-5
              "
            />
          </div>

          <div>
            <p className="font-bold mb-2">
              오늘 한 일
            </p>

            <input
              value={activity}
              onChange={(e)=>
                setActivity(
                  e.target.value
                )
              }
              placeholder="예: 친구 만나기"
              className="
                w-full
                h-14
                rounded-3xl
                px-5
              "
            />
          </div>

          <div>
            <p className="font-bold mb-2">
              일기
            </p>

            <textarea
              value={content}
              onChange={(e)=>
                setContent(
                  e.target.value
                )
              }
              placeholder="오늘 하루를 적어주세요"
              className="
                w-full
                h-[260px]
                rounded-[32px]
                p-5
                resize-none
              "
            />
          </div>

        </div>

      </section>
    )
  }

  return (
    <section
      className="
        h-full
        relative
        bg-[#f7f4ff]
      "
    >

      <div
        className="
          overflow-y-auto
          h-full
          px-6
          pt-12
          pb-36
        "
      >

        <h1
          className="
            text-[34px]
            font-black
            text-[#6E31E8]
          "
        >
          감정 일기
        </h1>

        {diaries.length === 0 ? (

          <div
            className="
              mt-40
              text-center
            "
          >

            <div className="text-6xl">
              📖
            </div>

            <p
              className="
                mt-6
                text-purple-400
              "
            >
              아직 작성한 일기가 없어요
            </p>

          </div>

        ) : (

          <div className="mt-8 space-y-4">

            {diaries.map((item)=>(
              <div
                key={item.id}
                className="
                  bg-white
                  rounded-[32px]
                  p-5
                "
              >

                <p className="text-sm text-gray-400">
                  {item.date}
                </p>

                <h3 className="mt-2 text-xl font-black">
                  {item.mood}
                </h3>

                <p className="mt-2">
                  {item.activity}
                </p>

                <p className="mt-4 text-gray-500">
                  {item.content}
                </p>

              </div>
            ))}

          </div>

        )}

      </div>

      {/* + 버튼 */}
      <button
        onClick={() =>
          setShowWrite(true)
        }
        className="
          absolute
          bottom-[-10px]
          right-6

          w-16
          h-16

          rounded-full

          bg-gradient-to-r
          from-[#7B49FF]
          to-[#B381FF]

          text-white
          text-4xl

          shadow-xl
        "
      >
        +
      </button>

    </section>
  )
}

export default DiaryTab