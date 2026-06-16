"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Destination } from "@/services/destinations/destinationApi";

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  index,
}) => {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      viewport={{ once: true }}
      className="group overflow-hidden rounded-3xl shadow-lg"
    >
      <div className="relative h-[350px] overflow-hidden">
        <Image
          src={destination.image}
          alt={destination.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-6 text-white">
          <h3 className="text-3xl font-bold">{destination.title}</h3>
          <p className="mt-2 text-sm text-gray-200">
            {destination.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default DestinationCard;