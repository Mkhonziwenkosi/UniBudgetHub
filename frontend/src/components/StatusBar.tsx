"use client";

import { useEffect, useState } from "react";
import { Wifi, Signal, BatteryFull } from "lucide-react";

export default function StatusBar() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const formattedTime = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      setTime(formattedTime);
    };

    updateTime();

    const interval = setInterval(updateTime, 60000); //every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex items-center justify-between px-6 pt-3 text-white">
      
      <span className="text-lg font-semibold tracking-wide">
        {time}
      </span>

      <div className="flex items-center gap-2">
        <Signal size={22} strokeWidth={2} />
        <Wifi size={22} strokeWidth={2} />
        <BatteryFull size={24} strokeWidth={1.8} fill="white" />
      </div>

    </div>
  );
}