interface Props {
  icon: string
  title: string
  desc: string
}

function PermissionCard({ icon, title, desc }: Props) {
  return (
    <div className="flex gap-5 rounded-[36px] bg-white/60 p-6 shadow-sm backdrop-blur-xl">
      
      {/* Icon Wrapper */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EEE6FF] text-3xl">
        {icon}
      </div>

      {/* Text Content */}
      <div>
        <h3 className="text-2xl font-bold text-[#4D278C]">
          {title}
        </h3>
        <p className="mt-2 leading-relaxed text-[#9B7EEB]">
          {desc}
        </p>
      </div>

    </div>
  )
}

export default PermissionCard