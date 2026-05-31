import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/dataService';

export default function PartnerDashboard() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchTableData('orders').then(setOrders);
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl font-bold mb-4">Commandes Reçues</h2>
      {orders.map(o => (
        <div key={o.id} className="bg-gray-800 p-3 mb-2 rounded">
          <p>Client: {o.customer_name}</p>
          <p>Total: {o.total_price} DT</p>
        </div>
      ))}
    </div>
  );
}
