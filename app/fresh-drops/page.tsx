import { Navbar } from "@/components/layout/navbar";
import { FreshDropsList } from "@/components/fresh-drops/fresh-drops-list";

export default function FreshDropsPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <FreshDropsList />
      
      {/* Footer Placeholder */}
      <footer className="py-12 border-t border-gray-100 text-center text-gray-500 bg-white">
        <p>© 2026 BetaEvo Electronics. All rights reserved.</p>
      </footer>
    </main>
  );
}
