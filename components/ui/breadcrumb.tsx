
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex items-center text-sm text-gray-500 mb-6 overflow-x-auto no-scrollbar", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 whitespace-nowrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              )}
              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="hover:text-brand-orange transition-colors font-medium"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={cn("font-medium", isLast ? "text-brand-black" : "")}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
