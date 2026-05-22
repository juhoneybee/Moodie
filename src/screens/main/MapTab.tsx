import { useEffect, useRef } from "react"

interface Props {
    spots: any[]
}

declare global {
    interface Window {
        naver: any
    }
}

function MapTab({ spots }: Props) {
    const mapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!window.naver || !mapRef.current) return

        const center = spots[0] ?? { lat: 37.5665, lng: 126.9780 }
        const map = new window.naver.maps.Map(mapRef.current, {
            center: new window.naver.maps.LatLng(center.lat, center.lng),
            zoom: 15
        })

        spots.forEach((spot: any) => {
            new window.naver.maps.Marker({
                position: new window.naver.maps.LatLng(spot.lat, spot.lng),
                map
            })
        })
    }, [spots])

    return (
        <div className="absolute top-0 left-0 right-0 bottom-24 overflow-hidden rounded-t-[40px]">
            <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </div>
    )
}

export default MapTab