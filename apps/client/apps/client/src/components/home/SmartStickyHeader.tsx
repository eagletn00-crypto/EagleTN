import React, { memo, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { MapPin, ChevronDown, Search, SlidersHorizontal, User } from 'lucide-react';

interface SmartStickyHeaderProps {
  locationName?: string;
  onSearchFocus?: () => void;
}

const SmartStickyHeader: React.FC<SmartStickyHeaderProps> = memo(({ 
  locationName = 'Tunis, Tunisie',
  onSearchFocus 
}) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Update scrolled state for styling the background dynamically
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 20);
  });

  // Hardware-accelerated transformations for the search bar
  const searchHeight = useTransform(scrollY, [0, 80], [52, 0]);
  const searchOpacity = useTransform(scrollY, [0, 60], [1, 0]);
  const searchMargin = useTransform(scrollY, [0, 80], [16, 0]);
  const searchPointerEvents = useTransform(scrollY, [0, 60], ["auto", "none"]);

  return (
    <motion.header 
      className={`sticky top-0 z-50 w-full px-5 pt-3 pb-2 transition-colors duration-300 ${
        isScrolled ? 'bg-[#FAF9F6]/90 backdrop-blur-xl border-b border-stone-200/50 shadow-sm' : 'bg-[#FAF9F6]'
      }`}
    >
      {/* Top Row: Location & Profile/Actions */}
      <div className="flex items-center justify-between">
        {/* Compact Location Pill */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white shadow-sm border border-stone-100 hover:bg-stone-50 transition-colors outline-none">
          <MapPin className="w-3.5 h-3.5 text-[#A37836]" strokeWidth={2.5} />
          <span className="text-[11px] font-black text-stone-800 tracking-wider uppercase truncate max-w-[120px]">
            {locationName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-stone-400" strokeWidth={2} />
        </button>

        {/* User Profile / Notifications Skeleton */}
        <button className="w-8 h-8 rounded-full bg-white border border-stone-100 shadow-sm flex items-center justify-center text-stone-600 hover:text-[#A37836] transition-colors outline-none">
           <User className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>

      {/* Bottom Row: Dynamic Search Bar */}
      <motion.div 
        style={{ 
          height: searchHeight, 
          opacity: searchOpacity, 
          marginTop: searchMargin,
          pointerEvents: searchPointerEvents as any
        }}
        className="flex items-center gap-3 overflow-hidden origin-top"
      >
        <div className="relative flex-1 group h-[52px]">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-stone-400 group-focus-within:text-[#A37836] transition-colors duration-300" strokeWidth={2} />
          </div>
          <input
            type="text"
            placeholder="Plat, restaurant, article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={onSearchFocus}
            className="w-full h-full pl-10 pr-4 rounded-[1.25rem] bg-white border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 focus:outline-none focus:border-stone-200 focus:shadow-[0_8px_24px_rgba(0,0,0,0.04)] text-sm font-medium text-stone-800 placeholder-stone-400 outline-none"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="button"
          className="flex items-center justify-center w-[52px] h-[52px] rounded-[1.25rem] bg-white border border-stone-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] text-stone-700 hover:text-[#A37836] shrink-0 outline-none"
        >
          <SlidersHorizontal className="w-4 h-4" strokeWidth={2} />
        </motion.button>
      </motion.div>
    </motion.header>
  );
});

export default SmartStickyHeader;
