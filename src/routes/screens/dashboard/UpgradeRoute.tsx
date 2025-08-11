import React from 'react';

export default function UpgradeRoute() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Upgrade Your Plan</h2>
      <p className="text-gray-500">Freemium: 25 tracks/month. Upgrade for $10/month to get 100 tracks/month.</p>
      <button className="px-6 py-3 bg-black text-white">Upgrade for $10/month</button>
    </div>
  );
}

