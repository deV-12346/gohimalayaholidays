// components/WhatsappButton.tsx

"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsappButton() {
    const phoneNumber="917018674227";
    const message =encodeURIComponent(`Hello Go Himalaya Holidays,I want to enquire about your travel packages.`);
    const whatsappUrl=`https://wa.me/${phoneNumber}?text=${message}`;
    return (
        <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full bg-[#25D366] px-2 py-2
        text-white shadow-2xl transition-all duration-300 hover:scale-105 ">
            <FaWhatsapp className="h-8 w-8 "/>
        </a>
    );
}