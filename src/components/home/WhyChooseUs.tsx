const features = [
  {
    title: "Best Packages",
    desc: "Affordable and customizable tour packages.",
  },
  {
    title: "Trusted Guides",
    desc: "Experienced local travel experts.",
  },
  {
    title: "Luxury Stay",
    desc: "Comfortable hotels and camps.",
  },
  {
    title: "24/7 Support",
    desc: "We are always available for help.",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-4xl font-bold">Why Choose Us</h2>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white p-8 shadow-md"
            >
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}