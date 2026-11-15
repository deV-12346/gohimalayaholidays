import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-indigo-600 text-white py-2  px-2 flex flex-col 
    justify-center items-center gap-3">
      <h2 className="text-2xl font-bold">
        Ready For Your Next Adventure?
      </h2>

      <div className="pb-2">
      <Link href="packages" className="rounded-full bg-white px-4 py-2 border-2
      cursur-pointer text-[13px] font-semibold text-indigo-700">
        Plan Your Trip
      </Link>
      </div>
    </section>
  )
}