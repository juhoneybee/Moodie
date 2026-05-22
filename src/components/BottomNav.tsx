interface Props {

  tab: string

  setTab: any

}

function BottomNav({
  tab,
  setTab
}: Props) {

  const item = (
    key: string,
    icon: string,
    label: string
  ) => (

    <button
      onClick={() =>
        setTab(key)
      }

      className="
        flex
        flex-col

        items-center

        gap-1
      "
    >

      <div
        className={`
          text-xl

          ${
            tab === key
              ? "text-purple-600"
              : "text-purple-300"
          }
        `}
      >

        {icon}

      </div>

      <p
        className={`
          text-xs

          ${
            tab === key
              ? "text-purple-600"
              : "text-purple-300"
          }
        `}
      >

        {label}

      </p>

    </button>

  )

  return (

    <div
      className="
        absolute

        bottom-0

        left-0
        right-0

        h-24

        bg-white/80

        backdrop-blur-xl

        rounded-t-[36px]

        flex

        justify-around

        items-center
      "
    >

      {item(
        "home",
        "🏠",
        "홈"
      )}

      {item(
        "map",
        "🗺️",
        "지도"
      )}

      {item(
        "chat",
        "💬",
        "Moodie"
      )}

      {item(
        "diary",
        "📖",
        "일기"
      )}

      {item(
        "settings",
        "⚙️",
        "설정"
      )}

    </div>

  )

}

export default BottomNav