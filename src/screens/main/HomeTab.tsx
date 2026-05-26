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

    const currentQuestion =
        homeStep === 0
            ? homeQuestions.mood
            : homeStep === 1
            ? homeQuestions.place
            : null

    const selected =
        homeStep === 0
            ? mood
            : place

    return (

<section className="h-full relative flex flex-col">

<div className="flex-1 overflow-y-auto pb-[140px]">

<div className="px-8 pt-6">

{/* HEADER */}

<div className="mb-10 flex items-center">

{homeStep === 1 && (

<button
onClick={() => {
setMood("")
setPlace("")
setHomeStep(0)
}}

className="
w-12
h-12

rounded-full

bg-white

shadow-md

flex
items-center
justify-center
"
>

←

</button>

)}

<h1
className={`
text-2xl
font-black
text-purple-700

${
homeStep === 1
? "ml-4"
: "ml-0"
}
`}
>

MOODMAP

</h1>

</div>

{/* STEP 0 */}

{homeStep === 0 && (

<>

<img
src="./moodie.png"
className="
w-40
mx-auto
"
/>

<h1
className="
mt-8
text-center
text-[52px]
leading-none
font-black
text-[#6E31E8]
"
>

{name || "사용자"}님

<br />

환영해요 ☁️

</h1>

</>

)}

{/* QUESTION */}

{homeStep < 2 && (

<p
className={`
text-center
font-black
tracking-[-0.03em]
text-[#6E31E8]

${
homeStep === 0
? "mt-5 text-[22px]"
: "mt-16 text-[40px]"
}
`}
>

{currentQuestion?.title}

</p>

)}

</div>

{homeStep < 2 && (

<div className="mt-12 px-6 grid grid-cols-2 gap-6">

{
homeStep === 0

?

currentQuestion?.options.map((item:any)=>(

<button
key={item.label}

onClick={() =>
setMood(item.label)
}

className={`
h-[140px]

rounded-[40px]

bg-white

shadow

${
mood===item.label
? "border-[6px] border-purple-500 scale-105"
: ""
}
`}
>

<div className="text-5xl">
{item.emoji}
</div>

<div className="mt-2 font-black text-2xl">

{item.label}

</div>

</button>

))

:

currentQuestion?.options.map((item:any)=>(

<button
key={item.label}

onClick={() =>
setPlace(item.label)
}

className={`
h-[140px]

rounded-[40px]

bg-white

shadow

flex
flex-col

items-center
justify-center

${
place===item.label
? "border-[6px] border-purple-500 scale-105"
: ""
}
`}
>

<div className="text-5xl">

{item.emoji}

</div>

<div
className="
mt-3

text-2xl
font-black

text-[#6E31E8]
"
>

{item.label}

</div>

</button>

))

}

</div>

)}

</div>

{homeStep < 2 && (

<div
className="
absolute

bottom-[-20px]

left-6
right-6

z-50
"
>

<button

disabled={!selected}

onClick={() => {

if (!selected)
return

if (
homeStep === 0
) {

setHomeStep(1)

return

}

const logs =
JSON.parse(
localStorage.getItem("moodLogs") || "[]"
)

logs.push({

mood,
place,

createdAt:
new Date().toISOString()

})

localStorage.setItem(
"moodLogs",
JSON.stringify(logs)
)

fetch(
`https://moodie-api.onrender.com/recommend?mood=${mood}&place=${place}`
)

.then(r=>r.json())

.then(data=>{

setSpots(data)

setHomeStep(2)

})

.catch(()=>{

setHomeStep(2)

})

}}

className={`
w-full

h-16

rounded-full

text-lg

font-black

transition

${
selected

?

`
text-white

bg-gradient-to-r
from-[#7B49FF]
to-[#B381FF]
`

:

`
bg-[#D8DCE6]
text-white
`
}
`}
>

다음 단계

</button>

</div>

)}

</section>

)

}

export default HomeTab