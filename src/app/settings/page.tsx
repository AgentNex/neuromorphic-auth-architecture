export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="glass p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Name</label>
              <input type="text" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
            </div>
          </div>
        </div>
        
        <hr className="border-white/10" />
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Preferences</h2>
          {/* Gamma will inject animated toggle switches here */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Email Notifications</span>
              <div className="w-11 h-6 bg-blue-500 rounded-full border border-white/10 relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Dark Mode</span>
              <div className="w-11 h-6 bg-blue-500 rounded-full border border-white/10 relative cursor-pointer">
                <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
