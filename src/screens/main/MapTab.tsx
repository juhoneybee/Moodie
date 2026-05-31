import { useEffect, useRef } from "react"

interface Props {
  spots: any[]
}

declare global {
  interface Window {
    kakao: any
  }
}

function MapTab({ spots }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)

  useEffect(() => {
    if (!window.kakao || !mapRef.current) return

    const center = spots[0]
      ? new window.kakao.maps.LatLng(
          spots[0].lat,
          spots[0].lng
        )
      : new window.kakao.maps.LatLng(
          37.5665,
          126.978
        )

    const map = new window.kakao.maps.Map(
      mapRef.current,
      {
        center,
        level: 4
      }
    )

    mapInstance.current = map

    spots.forEach((spot: any) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(
          spot.lat,
          spot.lng
        )
      })

      marker.setMap(map)

      const infoWindow =
        new window.kakao.maps.InfoWindow({
          content: `
            <div style="
              padding:10px;
              min-width:180px;
            ">
              <strong>${spot.name}</strong>
              <br/>
              ⭐ ${spot.score}
            </div>
          `
        })

      window.kakao.maps.event.addListener(
        marker,
        "click",
        () => {
          infoWindow.open(map, marker)
        }
      )
    })
  }, [spots])

  const moveToSpot = (spot: any) => {
    if (!mapInstance.current) return

    const moveLatLng =
      new window.kakao.maps.LatLng(
        spot.lat,
        spot.lng
      )

    mapInstance.current.panTo(moveLatLng)
  }

  return (
    <div className="absolute inset-0 pb-20 flex flex-col bg-[#f7f4ff]">

      {/* 지도 */}
      <div
        ref={mapRef}
        className="h-[70%] w-full"
      />

      {/* 추천 리스트 */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-[24px] -mt-16 relative z-10">
        <div className="p-5">
          <h2 className="text-xl font-black text-[#6E31E8]">
            추천 장소
          </h2>

          <div className="mt-4 space-y-3">
            {spots.map(
              (
                spot: any,
                index: number
              ) => (
                <button
                  key={index}
                  onClick={() =>
                    moveToSpot(spot)
                  }
                  className="
                    w-full
                    bg-[#F7F4FF]
                    rounded-[20px]
                    p-4
                    text-left
                    transition
                    hover:scale-[1.01]
                  "
                >
                  <div className="flex justify-between items-center">
                    <p className="font-black text-lg text-[#6E31E8]">
                      {spot.name}
                    </p>

                    <div className="font-bold text-purple-500">
                      ⭐ {spot.score}
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {spot.address}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {spot.distance}m
                  </p>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapTab