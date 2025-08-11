import React from 'react';
import { useParams } from 'react-router-dom';

export default function ApplicationDetailRoute() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-2">Application Detail</h2>
      <p className="text-gray-500">ID: {id}</p>
      {/* TODO: Render detail using existing ApplicationModal content inline, or navigate here from row click. */}
    </div>
  );
}

