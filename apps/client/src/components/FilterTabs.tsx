import React from 'react';

interface FilterTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function FilterTabs({ activeTab, setActiveTab }: FilterTabsProps) {
  const tabs = [
    { id: 'all', label: 'TOUS' },
    { id: 'rated', label: 'MIEUX NOTÉS' },
    { id: 'fast', label: 'LE PLUS RAPIDE' },
    { id: 'cheap', label: 'LE MOINS CHER' }
  ];

  return (
    <div className="px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-white shrink-0">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-wider uppercase whitespace-nowrap transition-all border-none cursor-pointer ${
            activeTab === tab.id 
              ? 'bg-[#0F172A] text-white shadow-sm' 
              : 'bg-[#F1F5F9] text-slate-500 hover:bg-slate-200/70'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
