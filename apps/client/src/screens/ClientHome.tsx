import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ClientHome() {
  const [searchQuery, setSearchQuery] = useState('');

  const restaurants = [
    { id: 1, name: 'مطعم البيتزا الإيطالية', rating: 4.8, deliveryTime: '30 دقيقة', image: '🍕' },
    { id: 2, name: 'مطعم الشاورما السريع', rating: 4.5, deliveryTime: '20 دقيقة', image: '🌯' },
    { id: 3, name: 'مطعم السوشي الياباني', rating: 4.9, deliveryTime: '40 دقيقة', image: '🍱' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
              <span className="text-amber-500">🚀</span>
              <span>MONO</span>
            </Link>
            <div className="text-sm text-zinc-400">👤 حسابي</div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن مطعم..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg focus:outline-none focus:border-amber-500 transition-colors text-gray-100 placeholder-zinc-500"
            />
            <span className="absolute left-4 top-3 text-zinc-500">🔍</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">المطاعم المشهورة</h2>
          <p className="text-zinc-400">اختر من قائمتنا الكاملة من المطاعم</p>
        </div>

        {/* Restaurants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-amber-500 transition-all duration-300 cursor-pointer group"
            >
              <div className="h-40 bg-gradient-to-br from-amber-500/20 to-amber-600/20 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                {restaurant.image}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 group-hover:text-amber-400 transition-colors">
                  {restaurant.name}
                </h3>
                <div className="flex items-center justify-between text-sm text-zinc-400 mb-3">
                  <span>⭐ {restaurant.rating}</span>
                  <span>⏱️ {restaurant.deliveryTime}</span>
                </div>
                <Link
                  to={`/restaurant-menu/${restaurant.id}`}
                  className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-lg transition-colors text-center block"
                >
                  شاهد القائمة
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
