
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { setupAccessories } from '@/app/actions/setup-accessories';

export default function SetupButton() {
  const [loading, setLoading] = useState(false);

  async function handleSetup() {
    setLoading(true);
    try {
      const result = await setupAccessories();
      if (result.success) {
        alert(result.message);
        window.location.reload();
      } else {
        alert('Error: ' + result.message);
      }
    } catch {
      alert('Failed to run setup');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button 
      onClick={handleSetup} 
      disabled={loading}
      variant="outline"
      className="ml-4"
    >
      {loading ? 'Setting up...' : 'Setup Accessories Category'}
    </Button>
  );
}
