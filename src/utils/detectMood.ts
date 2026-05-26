export function detectMood(
text:string
){

const lower =
text.toLowerCase()

if(
lower.includes("행복")
||
lower.includes("좋")
||
lower.includes("즐")
||
lower.includes("기뻐")
){
return "행복"
}

if(
lower.includes("우울")
||
lower.includes("슬퍼")
||
lower.includes("눈물")
){
return "우울"
}

if(
lower.includes("답답")
||
lower.includes("짜증")
||
lower.includes("화")
){
return "답답"
}

if(
lower.includes("피곤")
||
lower.includes("지쳐")
||
lower.includes("힘들")
){
return "피곤"
}

return "차분"

}