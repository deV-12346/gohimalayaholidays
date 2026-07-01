import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";
const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Packages", href: "/packages" },
  { label: "About Us", href: "/about-us" },
  { label: "Contact Us", href: "/enquiry" },
];

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com", icon: FaFacebook },
  { label: "Instagram", href: "https://instagram.com", icon: FaInstagram },
  // { label: "YouTube", href: "https://youtube.com/@YOUR-CHANNEL", icon: FaInstagram },
];

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
        grid
        max-w-7xl
        grid-cols-1
        gap-10
        text-center
        sm:grid-cols-2
        sm:text-left
        lg:grid-cols-3
      "
      >
        {/* Logo, Description & Follow Us */}

        <div
          className="
          flex
          flex-col
          items-center
          sm:items-start
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

          <div className="mt-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Follow Us
            </p>
            <div className="mt-3 flex items-center justify-center gap-3 sm:justify-start">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/10
                    bg-white/5
                    text-gray-400
                    transition-colors
                    // hover:border-cyan-400/40
                    hover:text-white
                  "
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}

        <div className="flex flex-col items-center sm:items-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2.5">
            {quickLinks.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm text-gray-400 transition-colors hover:text-white sm:text-base"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}

        <div className="flex flex-col items-center sm:items-start">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Contact Us
          </p>
          <div className="mt-4 flex flex-col items-center gap-3 text-sm text-gray-400 sm:items-start sm:text-base">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white" />
              <span>Go Himalaya Holidays, VPO Deola, Distt. Shimla, HP 171007</span>
            </div>

            <a
              href="mailto:gohimalayaholidays.team@gmail.com"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 shrink-0 text-white" />
              <span>gohimalayaholidays.team@gmail.com</span>
            </a>

            <a
              href="tel:+917018674227"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <Phone className="h-4 w-4 shrink-0 text-white" />
              <span>+91 70186 74227</span>
              <span>+91 78766 02413</span>
            </a>
          </div>
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

        <p className="flex items-center gap-1.5">
          Developed by
          <a
            href="https://www.linkedin.com/in/dev-raj-b0b9a02b5/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-gray-400 transition-colors hover:text-cyan-400"
          >
            <FaLinkedin className="h-3.5 w-3.5" />
          </a>
        </p>
      </div>
    </footer>
  );
}
