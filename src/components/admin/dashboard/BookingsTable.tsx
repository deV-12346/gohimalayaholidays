import { MoreVertical, User } from "lucide-react";
import { cn } from "@/lib/utils";

const bookings = [
  {
    id: "BK-8821",
    customer: "John Doe",
    destination: "Manali Trekking",
    amount: "$1,200",
    status: "Confirmed",
    date: "24 May 2024"
  },
  {
    id: "BK-8822",
    customer: "Sarah Smith",
    destination: "Leh Ladakh Tour",
    amount: "$3,500",
    status: "Pending",
    date: "23 May 2024"
  },
  {
    id: "BK-8823",
    customer: "Mike Johnson",
    destination: "Everest Base Camp",
    amount: "$4,800",
    status: "Cancelled",
    date: "22 May 2024"
  },
  {
    id: "BK-8824",
    customer: "Emily Brown",
    destination: "Shimla Getaway",
    amount: "$950",
    status: "Confirmed",
    date: "21 May 2024"
  },
  {
    id: "BK-8825",
    customer: "David Wilson",
    destination: "Spiti Valley Expedition",
    amount: "$2,100",
    status: "Confirmed",
    date: "20 May 2024"
  }
];

const statusStyles = {
  Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function BookingsTable() {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
      <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
        <h3 className="font-semibold text-white">Recent Bookings</h3>
        <button className="text-zinc-500 hover:text-white transition-colors">
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-zinc-950/50 text-zinc-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-medium">Customer</th>
              <th className="px-6 py-4 font-medium">Destination</th>
              <th className="px-6 py-4 font-medium">Amount</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/5 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-zinc-200">{booking.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-400">{booking.destination}</td>
                <td className="px-6 py-4 text-sm font-semibold text-white">{booking.amount}</td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border",
                    statusStyles[booking.status as keyof typeof statusStyles]
                  )}>
                    {booking.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-zinc-500">{booking.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
