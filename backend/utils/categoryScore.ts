export function categoryScore(
    emotion: string,
    category: string
) {
    // 1. 행복/설렘 일 때 로맨틱하거나 힙한 플레이스 타겟팅
    if (emotion === "행복/설렘") {
        if (
            category.includes("와인바") ||
            category.includes("칵테일바") ||
            category.includes("디저트") ||
            category.includes("이탈리안") ||
            category.includes("미술관") ||
            category.includes("전시")
        ) {
            return 100
        }
    }

    // 2. 차분/안정 일 때 조용하고 힐링할 수 있는 공간 타겟팅
    if (emotion === "차분/안정") {
        if (
            category.includes("조용한") ||
            category.includes("북카페") ||
            category.includes("서점") ||
            category.includes("일식") ||
            category.includes("산책") ||
            category.includes("공원")
        ) {
            return 100
        }
    }

    // 3. 피곤/멍함 일 때 몸과 마음을 푹 쉴 수 있는 휴식 시설 타겟팅
    if (emotion === "피곤/멍함") {
        if (
            category.includes("스파") ||
            category.includes("마사지") ||
            category.includes("안마") ||
            category.includes("사우나") ||
            category.includes("찜질방") ||
            category.includes("만화카페")
        ) {
            return 100
        }
    }

    // 4. 슬픔/우울 일 때 감성적이거나 조용히 마음을 추스를 수 있는 공간 타겟팅
    if (emotion === "슬픔/우울") {
        if (
            category.includes("감성카페") ||
            category.includes("바(BAR)") ||
            category.includes("한강공원") ||
            category.includes("독립서점")
        ) {
            return 100
        }
    }

    // 5. 화남/답답 일 때 스트레스를 풀거나 시원하게 탁 트인 공간 타겟팅
    if (emotion === "화남/답답") {
        if (
            category.includes("매운") ||
            category.includes("노래방") ||
            category.includes("오락실") ||
            category.includes("전망") ||
            category.includes("루프탑") ||
            category.includes("펍")
        ) {
            return 100
        }
    }

    // 6. 외로움 일 때 온기를 느끼거나 무언가에 집중할 수 있는 공간 타겟팅
    if (emotion === "외로움") {
        if (
            category.includes("애견") ||
            category.includes("고양이") ||
            category.includes("북카페") ||
            category.includes("보드게임") ||
            category.includes("서점")
        ) {
            return 100
        }
    }

    // 조건에 맞지 않는 일반적인 장소들은 기본 점수 부여
    return 50
}