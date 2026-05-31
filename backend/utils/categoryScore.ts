export function categoryScore(
  emotion:string,
  category:string
){

  if(
    emotion === "우울함" &&
    category.includes("와인바")
  ){
    return 100
  }

  if(
    emotion === "행복함" &&
    category.includes("펍")
  ){
    return 100
  }

  if(
    emotion === "스트레스" &&
    category.includes("산책")
  ){
    return 100
  }

  return 50

}