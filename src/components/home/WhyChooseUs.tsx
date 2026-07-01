import {
  Car,
  UtensilsCrossed,
  Wifi,
  Camera,
  Hotel,
  Headphones,
  Mountain,
  Wallet,
} from "lucide-react"

const features = [
  {
    title: "Cab Transfer",
    desc: "Your safety is our top priority.",
    icon: Car,
  },
  {
    title: "Best Food",
    desc: "Food is not just about nourishment it's a reflection of culture and tradition.",
    icon: UtensilsCrossed,
  },
  {
    title: "Wifi",
    desc: "With our WiFi facilities, you can work from anywhere with an internet connection.",
    icon: Wifi,
  },
  {
    title: "Sightseeing",
    desc: "Sightseeing offers a unique opportunity to immerse yourself in different regions.",
    icon: Camera,
  },
  {
    title: "Best Hotel",
    desc: "Our dedicated team of hospitality professionals is committed to exceeding your every expectation.",
    icon: Hotel,
  },
  {
    title: "Adventure Activities",
    desc: "Enjoy thrilling mountain adventures including trekking, camping, and river rafting.",
    icon: Mountain,
  },
  {
    title: "Affordable Pricing",
    desc: "Get the best travel experience at budget-friendly prices without compromising quality.",
    icon: Wallet,
  },
  {
    title: "24/7 Support",
    desc: "No matter what time it is, our team is available to assist you whenever you need it.",
    icon: Headphones,
  },
]

export default function WhyChooseUs() {
  return (
    <section className="bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Why Choose Us
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-600">
            Experience unforgettable journeys with premium services,
            comfortable stays, and trusted travel support.
          </p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="group rounded-2xl bg-white p-6 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500 transition-all duration-300 group-hover:bg-orange-500 group-hover:text-white">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}