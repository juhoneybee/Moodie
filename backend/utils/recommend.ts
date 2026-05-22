const moodProfile:any={

"피곤해요":{
calm:100,
energy:10,
social:20
},

"설레요":{
calm:30,
energy:100,
social:80
},

"우울해요":{
calm:90,
energy:20,
social:10
},

"차분해요":{
calm:90,
energy:30,
social:40
}

}

export function recommend(
places:any,
mood:string
){

const user=
moodProfile[mood]

return places
.map((p:any)=>({

...p,

total:

100-
Math.abs(
user.calm-
p.score.calm
)

+

100-
Math.abs(
user.energy-
p.score.energy
)

+

100-
Math.abs(
user.social-
p.score.social
)

}))

.sort(
(
a:any,
b:any
)=>

b.total-
a.total
)

}