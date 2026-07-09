import Navbar from "@/components/layouts/Navbar";
import { Mountain, ShieldCheck, Compass, HeartHandshake } from "lucide-react";

const features = [
  {
    icon: Mountain,
    title: "Beautiful Destinations",
    description: "Explore peaceful mountains, valleys, lakes, and unforgettable Himalayan views.",
  },
  {
    icon: Compass,
    title: "Best Travel Experience",
    description: "Carefully planned trips with comfort, adventure, and memorable experiences.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Trusted",
    description: "We focus on safe journeys, verified stays, and customer satisfaction.",
  },
  {
    icon: HeartHandshake,
    title: "Customer Support",
    description: "Friendly support and smooth travel planning from booking to journey completion.",
  },
];

export default function AboutUs() {
  return (
    <div >
      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 py-4">
        {/* Background */}
        <div className="absolute left-1/2 top-0 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-cyan-100 blur-[120px]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">
            About Go Himalaya Holidays
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            Discover the beauty of the Himalayas with unforgettable journeys.
          </h1>

          <p className="mt-6 max-w-3xl text-base leading-8 text-gray-600 sm:text-lg">
            Go Himalaya Holidays is a growing travel startup focused on providing memorable travel experiences, 
            peaceful destinations, and comfortable journeys across the Himalayas. We aim to make travel simple, 
            safe, and enjoyable for everyone.
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="px-6 pb-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
          {/* Left */}
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Who We Are</h2>
            <p className="mt-6 text-base leading-8 text-gray-600">
              We started Go Himalaya Holidays with a passion for travel, adventure, and nature. Our goal is to help 
              travelers explore the beauty of the Himalayas with comfort and confidence.
            </p>
            <p className="mt-4 text-base leading-8 text-gray-600">
              From family trips to adventure tours, we create travel experiences that leave unforgettable memories.
            </p>
          </div>

          {/* Right Card */}
          <div className="rounded-3xl border border-gray-200 bg-gray-50 p-8">
            <h3 className="text-2xl font-bold">Our Mission</h3>
            <p className="mt-5 leading-8 text-gray-600">
              To provide safe, affordable, and unforgettable Himalayan travel experiences while delivering 
              excellent customer satisfaction.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">
                Adventure
              </span>
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">
                Mountains
              </span>
              <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-medium text-cyan-700">
                Trusted Travel
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-10">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">Why Choose Us</h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              We focus on providing comfortable, reliable, and memorable travel experiences for every traveler.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="rounded-3xl border border-gray-200 bg-gray-50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 text-cyan-700">
                    <Icon className="h-7 w-7" />
                  </div>

                  <h3 className="mt-5 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-4 leading-7 text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}