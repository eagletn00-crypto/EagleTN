import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/dataService';

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => {
    fetchTableData('restaurants').then(setStats);
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl font-bold">Admin: Total Restaurants: {stats.length}</h2>
    </div>
  );
}
