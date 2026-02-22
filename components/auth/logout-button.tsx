'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { button } from 'framer-motion/client';

export function LogoutButton() {
  return (
    <Button 
      variant="outline" 
      onClick={() => signOut({ callbackUrl: '/auth/signin' })}
      className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
    >
      <LogOut className="w-4 h-4" />
      Log Out
    </Button>
  );
}
