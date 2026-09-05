export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm h-80 flex items-center justify-center">
          <p className="text-gray-500 italic">Gamma: Inject Traffic Graph here</p>
        </div>
        <div className="glass p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm h-80 flex items-center justify-center">
          <p className="text-gray-500 italic">Gamma: Inject Conversion Funnel here</p>
        </div>
      </div>
    </div>
  );
}
