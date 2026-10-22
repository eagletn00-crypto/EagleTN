const fs = require('fs');

// 1. التصحيح في routes.tsx (السطر 199) - إضافة النوع الصارم
const routesPath = 'src/routes.tsx';
if (fs.existsSync(routesPath)) {
    let routesCode = fs.readFileSync(routesPath, 'utf8');
    routesCode = routesCode.replace(/onRemoveItem=\{\(itemId\) =>/g, 'onRemoveItem={(itemId: string) =>');
    fs.writeFileSync(routesPath, routesCode);
    console.log('✅ src/routes.tsx corrigé : Typage strict de (itemId: string) ajouté.');
} else {
    console.log('❌ src/routes.tsx introuvable.');
}

// 2. التصحيح في CheckoutScreen (السطر 195) - تحديث الواجهة
const checkoutPath = 'src/screens/Checkout/index.tsx';
if (fs.existsSync(checkoutPath)) {
    let checkoutCode = fs.readFileSync(checkoutPath, 'utf8');
    const newInterface = `interface CheckoutScreenProps {
  partner?: any;
  cartItems?: any[];
  customerAddress?: string;
  customerPhone?: string;
  onRemoveItem?: (itemId: string) => void;
  onRequireAuth?: () => void;
  onConfirmOrder?: (orderData: any) => Promise<any>;
  onBack?: () => void;
  onOrderSuccess?: (orderId: string) => void;
}`;
    checkoutCode = checkoutCode.replace(/interface CheckoutScreenProps \{[\s\S]*?\}/, newInterface);
    fs.writeFileSync(checkoutPath, checkoutCode);
    console.log('✅ CheckoutScreen corrigé : Interface CheckoutScreenProps mise à jour.');
} else {
    console.log('❌ CheckoutScreen introuvable.');
}

// 3. التصحيح في ClientHome (السطر 158) - حقن الواجهة الجديدة
const homePath = 'src/screens/ClientHome.tsx';
if (fs.existsSync(homePath)) {
    let homeCode = fs.readFileSync(homePath, 'utf8');
    if (!homeCode.includes('interface ClientHomeProps')) {
        homeCode = homeCode.replace(
            'export const ClientHome: React.FC = () => {', 
`export interface ClientHomeProps {
  cartCount?: number;
  onSelectPartner?: (partner: any) => void;
  onNavigateCart?: () => void;
}

export const ClientHome: React.FC<ClientHomeProps> = () => {`
        );
        fs.writeFileSync(homePath, homeCode);
        console.log('✅ ClientHome corrigé : Interface ClientHomeProps injectée.');
    }
} else {
    console.log('❌ ClientHome introuvable.');
}
