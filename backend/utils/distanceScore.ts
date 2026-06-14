export function distanceScore(
    distance: number
) {
    // 200m 이내: 만점 (바로 근처)
    if (distance <= 200) {
        return 100
    }

    // 200~500m: 100→90 점진 감소
    if (distance <= 500) {
        return Math.round(100 - (distance - 200) * 0.033)
    }

    // 500~1000m: 90→75 점진 감소
    if (distance <= 1000) {
        return Math.round(90 - (distance - 500) * 0.03)
    }

    // 1~2km: 75→50 점진 감소
    if (distance <= 2000) {
        return Math.round(75 - (distance - 1000) * 0.025)
    }

    // 2~4km: 50→20 점진 감소
    if (distance <= 4000) {
        return Math.round(50 - (distance - 2000) * 0.015)
    }

    // 4~6km: 20→0 점진 감소
    if (distance <= 6000) {
        return Math.round(20 - (distance - 4000) * 0.01)
    }

    // 6km 초과: 0점
    return 0
}