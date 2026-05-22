import express from "express"
import type {
Request,
Response
} from "express"

import cors from "cors"

import {
  places
} from "./data/places"

import {
  recommend
} from "./utils/recommend"

const app =
express()

app.use(
  cors()
)

app.get(
"/recommend",

(
req:Request,
res:Response
)=>{

const mood=
req.query.mood

const place=
req.query.place

console.log(
"받은 place:",
place
)

console.log(
"전체 places:",
places
)

const filtered=

places.filter(
p=>
p.category===
place
)

console.log(
"필터 결과:",
filtered
)

const result=

recommend(
filtered,
mood as string
)

res.json(
result
)

}

)

app.listen(
3000,
()=>{

console.log(
"서버 실행"
)

}
)