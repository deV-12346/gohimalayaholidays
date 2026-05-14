export default function HeroSection() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop')",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-4xl text-center text-white">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Explore The Beauty Of Himachal
          </h1>

          <p className="mt-6 text-sm md:text-xl text-gray-200">
            Discover breathtaking mountains and unforgettable adventures.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="rounded-full bg-indigo-600 px-4 py-1 text-[14px] font-semibold text-white hover:bg-indigo-500">
              Explore Packages
            </button>

            <button className="rounded-full border border-white px-4 py-1 text-[14px] font-semibold text-white hover:bg-white hover:text-black">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}