interface Props {
  label: string
  selected: boolean
  onClick: () => void
}

function OptionCard({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        h-36
        rounded-3xl
        p-4
        transition-all
        duration-300
        shadow-lg
        backdrop-blur-xl
        flex
        flex-col
        justify-end
        text-left
        border

        ${selected
          ? 'bg-purple-200 border-purple-400 scale-105'
          : 'bg-white/70 border-white'}
      `}
    >
      <div className="flex-1 flex items-center justify-center text-5xl">
        ☁️
      </div>

      <p className="font-semibold text-purple-900">
        {label}
      </p>
    </button>
  )
}

export default OptionCard