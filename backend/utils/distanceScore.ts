export function distanceScore(
  distance:number
){

  if(distance <= 500){
    return 100
  }

  if(distance <= 1000){
    return 70
  }

  if(distance <= 2000){
    return 55
  }

  if(distance <= 3000){
    return 40
  }

  if(distance <= 5000){
    return 20
  }

  return 0

}