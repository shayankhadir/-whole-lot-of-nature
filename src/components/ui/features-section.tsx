import { cn } from "@/lib/utils";
import {
  Truck,
  Leaf,
  Shield,
  Headphones,
  Award,
  Clock,
  RefreshCw,
  Heart,
} from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeaturesSectionProps {
  features?: Feature[];
}

export default function FeaturesSection({ features: customFeatures }: FeaturesSectionProps = {}) {
  const defaultFeatures = [
    {
      title: "Free Shipping",
      description: "Free delivery on orders above ₹999 across India",
      icon: <Truck className="w-6 h-6" />,
    },
    {
      title: "100% Organic",
      description: "Certified organic products with no harmful chemicals",
      icon: <Leaf className="w-6 h-6" />,
    },
    {
      title: "7-Day Guarantee",
      description: "Replace damaged plants within 7 days, no questions asked",
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: "Expert Support",
      description: "Get gardening advice from our plant experts",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      title: "Premium Quality",
      description: "Hand-picked products from trusted suppliers",
      icon: <Award className="w-6 h-6" />,
    },
    {
      title: "Fast Delivery",
      description: "Quick delivery in 2-5 business days",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Sustainable",
      description: "Eco-friendly packaging and sustainable practices",
      icon: <RefreshCw className="w-6 h-6" />,
    },
    {
      title: "Made with Love",
      description: "Each product is prepared with care and expertise",
      icon: <Heart className="w-6 h-6" />,
    },
  ];

  const featuresToDisplay = customFeatures || defaultFeatures;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {featuresToDisplay.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800 border-[#2E7D32]/20",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800 border-[#2E7D32]/20",
        index < 4 && "lg:border-b dark:border-neutral-800 border-[#2E7D32]/20"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-[#2E7D32]/10 dark:from-[#2E7D32]/20 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-[#2E7D32]/10 dark:from-[#2E7D32]/20 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-[#66BB6A] dark:text-[#66BB6A]">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10 antialiased">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-[#2E7D32]/30 dark:bg-[#2E7D32]/50 group-hover/feature:bg-[#66BB6A] transition-all duration-200 origin-center backdrop-blur-md" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-white dark:text-white">
          {title}
        </span>
      </div>
      <p className="text-sm max-w-xs relative z-10 px-10 antialiased text-[#86efac]">
        {description}
      </p>
    </div>
  );
};
