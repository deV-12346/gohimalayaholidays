export default function Footer() {
  return (
    <footer
      className="
      border-t
      border-white/10
      bg-[#050816]
      px-4
      py-12
      text-gray-300
    "
    >
      <div
        className="
        mx-auto
        flex
        max-w-7xl
        flex-col
        items-center
        justify-center
        gap-10
        text-center
      "
      >
        {/* Logo & Description */}

        <div
          className="
          flex
          max-w-2xl
          flex-col
          items-center
        "
        >
          <h2
            className="
            text-2xl
            font-bold
            text-white
            sm:text-3xl
          "
          >
            Go Himalaya Holidays
          </h2>

          <p
            className="
            mt-4
            text-sm
            leading-7
            text-gray-400
            sm:text-base
          "
          >
            Discover the beauty of the Himalayas with
            unforgettable journeys, peaceful destinations,
            and premium travel experiences.
          </p>
        </div>
      </div>

      {/* Bottom */}

      <div
        className="
        mx-auto
        mt-10
        flex
        max-w-7xl
        flex-col
        items-center
        justify-center
        gap-3
        border-t
        border-white/10
        pt-6
        text-center
        text-sm
        text-gray-500
      "
      >
        <p>
          © 2026 Go Himalaya Holidays. All rights reserved.
        </p>
      </div>
    </footer>
  );
}