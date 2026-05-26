interface Props{
diaries:any[]
}

const moodEmoji:any={

행복:"😊",

차분:"🌿",

답답:"☁️",

우울:"💧",

피곤:"😴"

}

function EmotionCalendar({
diaries
}:Props){

const recent=
diaries
.slice(0,7)

const count:any={}

diaries.forEach(
(item)=>{

count[
item.detectedMood
]=
(
count[
item.detectedMood
]
||
0
)+1

}
)

return(

<div
className="
mx-6
mt-10

rounded-[40px]

bg-gradient-to-b
from-[#2E005A]
to-[#3E0077]

p-6

text-white
"
>

<h2
className="
text-3xl
font-black
"
>
이번 달 감정 기록 🌷
</h2>

<p
className="
mt-2
text-purple-200
"
>
무디와 함께 기록한 하루
</p>

<div
className="
mt-8

flex

justify-between
"
>

{
recent.map(
(item:any)=>(

<div
key={item.id}

className="
flex
flex-col
items-center
gap-3
"
>

<div
className="
w-14
h-14

rounded-full

bg-purple-500

flex
items-center
justify-center

text-2xl
"
>

{
moodEmoji[
item.detectedMood
]
||
"🤍"
}

</div>

<p>

{
item.date
.slice(8)
}

</p>

</div>

))
}

</div>

<div
className="
mt-8

flex

gap-3

flex-wrap
"
>

{
Object.entries(
count
).map(
([key,value])=>(

<div
key={key}

className="
px-5
py-3

rounded-full

bg-white/10
"
>

{
moodEmoji[
key
]
}

{" "}

{key}

{" "}

{String(
value
)}

</div>

))
}

</div>

</div>

)

}

export default EmotionCalendar