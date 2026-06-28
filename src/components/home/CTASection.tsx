import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-indigo-600 px-6 py-10 text-white text-center">
      <h2 className="text-2xl font-bold">
        Ready For Your Next Adventure?
      </h2>

      <Link href="packages" className="mt-10 rounded-full bg-white px-4 py-2 cursur-pointer text-[13px] font-semibold text-indigo-700">
        Plan Your Trip
      </Link>
    </section>
  )
}