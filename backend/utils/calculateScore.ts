import { emotionWeights} from "../data/emotionWeights"
import { distanceScore } from "./distanceScore"
import { categoryScore } from "./categoryScore"

export function calculateScore(
    emotion:string,
    category:string,
    distance:number
){
    let emotionScore = 50
    const weights = emotionWeights[emotion as keyof typeof emotionWeights]
    
    if(weights){
        for(const key in weights){
            if(category.includes(key)){
                emotionScore = weights[key as keyof typeof weights]
            break
            }
        }
    }

    const distanceLayer = distanceScore(distance)
    const categoryLayer = categoryScore(emotion, category)

    return (
        emotionScore * 0.5 +
        distanceLayer * 0.1 +
        categoryLayer * 0.4
    )
}