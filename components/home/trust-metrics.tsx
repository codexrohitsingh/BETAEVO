import { TrendingUp, Users, Star, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const metrics = [
  {
    icon: ShoppingCart,
    label: "Units Sold",
    value: "50Mn+",
    description: "Trusted by millions"
  },
  {
    icon: Star,
    label: "Product Reviews",
    value: "05Mn+",
    description: "Rated 4.8/5 stars"
  },
  {
    icon: TrendingUp,
    label: "YOY Growth",
    value: "100%",
    description: "Fastest growing brand"
  },
  {
    icon: Users,
    label: "1 Unit Sold",
    value: "Every 05 Sec",
    description: "Global demand"
  }
];

export function TrustMetrics() {
  return (
    <section className="py-12 bg-white border-b border-gray-100">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric) => (
            <Card key={metric.label} className="bg-white border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardContent className="flex items-center p-6 space-x-4">
                <div className="p-3 rounded-full bg-orange-50 text-brand-orange">
                  <metric.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-brand-black">{metric.value}</h3>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
