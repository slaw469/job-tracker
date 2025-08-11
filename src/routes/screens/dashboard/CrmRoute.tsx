import React from 'react';
import App from '../../../App';

// For phase 2, we reuse the existing App which renders the CRM experience.
// In a later phase, we can extract the inner CRM content into this route directly.
export default function CrmRoute() {
  return <App />;
}

