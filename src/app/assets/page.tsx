"use client";
import { useAssets } from "@/hooks/useBackend";
import TiltCard from "@/components/motion/TiltCard";

export default function Assets() {
  const { data, loading, error } = useAssets();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Assets</h1>
        <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors border border-white/10 backdrop-blur-md">
          Upload New
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {loading ? (
          <p className="text-gray-400">Loading assets...</p>
        ) : error ? (
          <p className="text-red-400">Error loading assets: {error.message}</p>
        ) : data.length > 0 ? (
          data.map((asset) => (
            <TiltCard key={asset.id}>
              <div className="glass aspect-square rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-gray-400">{asset.name}</span>
              </div>
            </TiltCard>
          ))
        ) : (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <TiltCard key={i}>
              <div className="glass aspect-square rounded-xl border border-white/10 bg-white/5 flex flex-col items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
                <span className="text-gray-400">Asset {i}</span>
              </div>
            </TiltCard>
          ))
        )}
      </div>
    </div>
  );
}
