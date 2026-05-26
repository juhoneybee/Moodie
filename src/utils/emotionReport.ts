export function getEmotionReport(
diaries:any[]
){

if(
diaries.length===0
){

return{
topMood:"없음",
message:
"아직 기록된 감정이 없어요"
}

}

const count:
Record<string,number>
={}

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

const topMood =
Object
.entries(
count
)
.sort(
(a,b)=>
b[1]-a[1]
)[0][0]

const messages:any={

행복:
"좋은 흐름이 이어지고 있어요 ☀️",

우울:
"조금 쉬어가는 시간이 필요해요 🌙",

답답:
"가볍게 산책해보는 건 어때요 🍃",

피곤:
"오늘은 충전이 먼저예요 ☁️",

차분:
"안정적인 하루를 보내고 있어요 🌿"

}

return{

topMood,

message:
messages[
topMood
]

}

}