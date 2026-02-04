import Image from 'next/image';
import { Button } from '@/components/ui/button';


export function PromotionalBanner() {
  return (
    <section className="container-custom py-8 md:py-12">
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-r from-[#FDFBF7] to-[#EAE6DD] px-6 py-8 md:px-16 md:py-20 shadow-sm">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
          {/* Content Side */}
          <div className="space-y-6 md:space-y-8 relative z-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-brand-black md:text-5xl lg:text-6xl">
              <span className="text-brand-copper">Upgrade</span> Together.<br />
              <span className="text-brand-copper">Save</span> Bigger.
            </h2>
            
            <div className="inline-flex flex-col md:flex-row flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 rounded-2xl border-2 border-dashed border-brand-copper/30 bg-white/50 p-4 backdrop-blur-sm">
              <div className="flex flex-col border-b md:border-b-0 md:border-r border-brand-copper/30 pb-4 md:pb-0 md:pr-6 w-full md:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Buy 2 & Get</span>
                <span className="text-xl font-bold text-brand-orange">15% OFF</span>
              </div>
              <div className="flex flex-col md:pl-2 w-full md:w-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Buy 3 & Get</span>
                <span className="text-xl font-bold text-brand-orange">25% OFF</span>
              </div>
            </div>
            
            <div className="pt-2">
                <Button className="rounded-full bg-brand-black px-8 py-6 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-brand-charcoal">
                    SHOP NOW
                </Button>
            </div>
          </div>
          
          {/* Image Side - Decorative Background Elements */}
          <div className="relative h-[250px] md:h-[300px] w-full lg:h-[400px]">
            {/* Abstract flowing shapes */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/20 blur-3xl rounded-full mix-blend-overlay"></div>
             
             {/* Product Image */}
             <div className="relative h-full w-full">
                <Image 
                    src="https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=2072&auto=format&fit=crop" 
                    alt="Smartwatches Bundle"
                    fill
                    className="object-contain object-center drop-shadow-2xl"
                    priority
                />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// hi there