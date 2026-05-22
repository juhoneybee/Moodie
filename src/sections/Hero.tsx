function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black flex items-center justify-center">
      
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-7xl md:text-9xl font-black tracking-tight">
          HY ROAD
        </h1>

        <p className="mt-6 text-zinc-400 text-lg tracking-wide">
          Creative Frontend Experience
        </p>
      </div>

    </section>
  )
}

export default Hero