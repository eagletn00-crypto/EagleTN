import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/dataService';

export default function LivreurDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTableData('orders', 'status', 'en_attente').then(setTasks);
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl font-bold">Livraisons Disponibles</h2>
      {tasks.map(t => (
        <div key={t.id} className="bg-green-900 p-3 mt-2 rounded">
          <p>Adresse: {t.customer_address}</p>
        </div>
      ))}
    </div>
  );
}
