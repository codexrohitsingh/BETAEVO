 'use client';
 
 import { useState } from 'react';
 import { Button } from '@/components/ui/button';
 import { setupHeadphones } from '@/app/actions/setup-headphones';
 
 export default function SetupHeadphonesButton() {
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState<string | null>(null);
 
   async function handleSetup() {
     setLoading(true);
     setMessage(null);
     const result = await setupHeadphones();
     setLoading(false);
     setMessage(result.message);
   }
 
   return (
     <div className="flex items-center gap-4">
       <Button 
         onClick={handleSetup} 
         disabled={loading}
         variant="outline"
       >
         {loading ? 'Setting up Headphones...' : 'Setup Headphones (Smart Audio)'}
       </Button>
       {message && <p className="text-sm">{message}</p>}
     </div>
   );
 }
