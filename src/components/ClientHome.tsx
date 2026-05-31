import React, { useEffect, useState } from 'react';
import { fetchTableData } from '../services/dataService';
import { Link } from 'react-router-dom';

export default function ClientHome() {
  const [restaurants, setRestaurants] = useState<any[]>([]);

  useEffect(() => {
    fetchTableData('restaurants').then(setRestaurants);
  }, []);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h2 className="text-xl font-bold mb-4">Nos Partenaires</h2>
      <div className="grid gap-4">
        {restaurants.map(rest => (
          <Link key={rest.id} to={`/restaurant/${rest.id}`} className="bg-gray-800 p-4 rounded-xl">
            <h3 className="font-bold">{rest.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}
