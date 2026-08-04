import React, { useState } from 'react';
import { MenuHeader } from './components/MenuHeader';      
import { CategorySelector } from './components/CategorySelector';                                                     
import { MenuItemRow } from './components/MenuItemRow'; 
import { FloatingEmeraldCart } from './components/FloatingEmeraldCart';
import { CheckoutDrawer } from './components/CheckoutDrawer';

export const RestaurantMenu: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  const mockItems = [                                          
    { id: "1", name: "Couscous Royal au Poisson", description: "Mérou frais du golfe de Tunis, légumes de saison mijotés à la vapeur traditionnelle.", price: "24,50 DT", tag: "CUISINE TUNISIENNE" },
    { id: "2", name: "Ojja Tunisienne aux Crevettes", description: "Sauce tomate concentrée au piment rouge frais, ail, œufs pochés et crevettes sauvages.", price: "19,80 DT", tag: "CUISINE TUNISIENNE" },
    { id: "3", name: "Limonade de Carthage à la Menthe", description: "Jus de citron pur extrait à froid infusé aux feuilles de menthe bio.", price: "5,00 DT", tag: "PREMIUM DESSERT" },
    { id: "4", name: "Khobz Tabouna Traditionnel", description: "Pain tunisien cuit de manière artisanale au feu de bois, servi مع الهريسة.", price: "1,20 DT", tag: "CUISINE TUNISIENNE" }
  ];

  const totalAmount = 44.300; 
  const itemCount = 2;

  return (                                                     
    <div className="min-h-screen bg-[#fcfbfa] text-[#1e1b18] antialiased pb-36 select-none transition-colors duration-300">                                                     
      <MenuHeader />                                             
      
      <div className="max-w-xl mx-auto px-4 py-1">                 
        <div className="text-[9px] font-mono tracking-[0.2em] text-[#1e1b18]/40 uppercase mt-5 block text-left pl-1">           
          Menu et Formules Disponibles                             
        </div>
        
        <CategorySelector />                                       
        
        <div className="grid grid-cols-1 gap-4 mt-1">                
          {mockItems.map((item) => (                                   
            <MenuItemRow key={item.id} item={item} />                
          ))}                                                      
        </div>                                                   
      </div>

      {/* 🛒 السلة العائمة المحدثة بالكامل مع زر الاستجابة الرئيسي الجاذب للعين والمركز بدقة */}
      <FloatingEmeraldCart 
        itemCount={itemCount} 
        total={totalAmount} 
        onCheckout={() => setIsCartOpen(true)} 
      />

      {isCartOpen && (
        <CheckoutDrawer 
          total={totalAmount} 
          onClose={() => setIsCartOpen(false)} 
          onSubmit={(info: any) => console.log(info)} 
        />
      )}
    </div>                                                   
  );
};
