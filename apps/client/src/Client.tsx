import React, { useState } from 'react';
import UltraFloatingHeader from './components/UltraFloatingHeader';
import CategoryPremiumNav from './components/CategoryPremiumNav';
import UltraMerchantCard from './components/UltraMerchantCard';

export const Client: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSelectCategory = (slug: string) => {
    setSelectedCategory(slug);
  };

  return (
    <div className="min-h-screen bg-[#000F2E] text-white">
      <UltraFloatingHeader 
        onSearchChange={(q) => console.log('Search:', q)} 
        onDroneClick={() => window.location.href = '/track/live'} 
      />
      <CategoryPremiumNav onSelectCategory={handleSelectCategory} />
      {/* باقي عناصر الصفحة */}
    </div>
  );
};

export default Client;
