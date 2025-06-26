// components/DashboardLayout.js
import Image from 'next/image';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4 flex flex-col justify-between">
        <div>
          <div className="text-2xl font-bold mb-6">BUZZ3</div>
          <nav className="space-y-4">
            <button className="hover:bg-gray-700 px-3 py-2 rounded w-full text-left">Updates</button>
            <button className="hover:bg-gray-700 px-3 py-2 rounded w-full text-left">Investors</button>
            <button className="hover:bg-gray-700 px-3 py-2 rounded w-full text-left">Unlocks</button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="flex justify-end items-center p-4 border-b border-gray-700">
          <button className="text-sm bg-gray-700 px-4 py-1 rounded hover:bg-gray-600">
            Download Buzz3 app
          </button>
          <div className="flex items-center gap-2 ml-4">
            <Image src="/google-play-badge.png" width={120} height={40} alt="Google Play" />
            <Image src="/app-store-badge.png" width={120} height={40} alt="App Store" />
          </div>
        </header>

        <main className="p-4 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
