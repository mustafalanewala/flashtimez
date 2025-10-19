"use client";

interface AdsProps {
  className?: string;
}

export default function Ads({ className = "" }: AdsProps) {
  return (
    <div
      className={`bg-gray-800 border border-gray-300 rounded-lg p-8 text-center ${className}`}
    >
      <div className="text-gray-600 font-medium text-lg">ADS</div>
    </div>
  );
}
