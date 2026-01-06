'use client';

import { Sun, Droplets, Thermometer, Ruler, Clock, Leaf, Shield, PawPrint } from 'lucide-react';

interface ProductAttribute {
  id?: number;
  name: string;
  options: string[];
}

interface ProductSpecificationsProps {
  attributes: ProductAttribute[];
  categories?: { id: number; name: string; slug: string }[];
  stockQuantity?: number | null;
  weight?: string;
  dimensions?: {
    length: string;
    width: string;
    height: string;
  };
}

// Map attribute names to icons
const attributeIcons: Record<string, React.ReactNode> = {
  'light': <Sun className="w-5 h-5 text-yellow-400" />,
  'sunlight': <Sun className="w-5 h-5 text-yellow-400" />,
  'water': <Droplets className="w-5 h-5 text-blue-400" />,
  'watering': <Droplets className="w-5 h-5 text-blue-400" />,
  'temperature': <Thermometer className="w-5 h-5 text-orange-400" />,
  'size': <Ruler className="w-5 h-5 text-emerald-400" />,
  'height': <Ruler className="w-5 h-5 text-emerald-400" />,
  'growth': <Clock className="w-5 h-5 text-purple-400" />,
  'growth rate': <Clock className="w-5 h-5 text-purple-400" />,
  'difficulty': <Leaf className="w-5 h-5 text-green-400" />,
  'care level': <Leaf className="w-5 h-5 text-green-400" />,
  'pet safe': <PawPrint className="w-5 h-5 text-pink-400" />,
  'pet friendly': <PawPrint className="w-5 h-5 text-pink-400" />,
  'air purifying': <Shield className="w-5 h-5 text-cyan-400" />,
};

const getIcon = (attributeName: string): React.ReactNode => {
  const lowercaseName = attributeName.toLowerCase();
  for (const [key, icon] of Object.entries(attributeIcons)) {
    if (lowercaseName.includes(key)) {
      return icon;
    }
  }
  return <Leaf className="w-5 h-5 text-emerald-400" />;
};

export default function ProductSpecifications({ 
  attributes, 
  categories, 
  stockQuantity, 
  weight,
  dimensions 
}: ProductSpecificationsProps) {
  // Filter out internal/hidden attributes
  const visibleAttributes = attributes.filter(attr => 
    !attr.name.toLowerCase().startsWith('pa_') &&
    !attr.name.toLowerCase().includes('variation')
  );

  // Add computed specs if available
  const allSpecs: { name: string; value: string; icon: React.ReactNode }[] = [
    ...visibleAttributes.map(attr => ({
      name: attr.name,
      value: attr.options.join(', '),
      icon: getIcon(attr.name),
    })),
  ];

  // Add dimensions if available
  if (dimensions && (dimensions.length || dimensions.width || dimensions.height)) {
    const dimString = [
      dimensions.length && `L: ${dimensions.length}cm`,
      dimensions.width && `W: ${dimensions.width}cm`,
      dimensions.height && `H: ${dimensions.height}cm`,
    ].filter(Boolean).join(' × ');
    
    if (dimString) {
      allSpecs.push({
        name: 'Dimensions',
        value: dimString,
        icon: <Ruler className="w-5 h-5 text-emerald-400" />,
      });
    }
  }

  // Add weight if available
  if (weight) {
    allSpecs.push({
      name: 'Weight',
      value: `${weight} kg`,
      icon: <Ruler className="w-5 h-5 text-gray-400" />,
    });
  }

  if (allSpecs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white/5 rounded-2xl p-6 md:p-8 border border-white/10 backdrop-blur-md">
      <h3 className="text-xl font-bold text-white mb-6 antialiased flex items-center gap-2">
        <Leaf className="w-6 h-6 text-emerald-400" />
        Plant Specifications
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {allSpecs.map((spec, index) => (
          <div 
            key={index}
            className="flex items-center gap-4 p-4 bg-black/20 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
              {spec.icon}
            </div>
            <div>
              <p className="text-xs text-white/50 uppercase tracking-wide font-medium">
                {spec.name}
              </p>
              <p className="text-white font-medium">
                {spec.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Stock Status */}
      {stockQuantity !== undefined && stockQuantity !== null && (
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${stockQuantity > 10 ? 'bg-green-500' : stockQuantity > 0 ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${stockQuantity > 10 ? 'text-green-400' : stockQuantity > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {stockQuantity > 10 
                ? 'In Stock' 
                : stockQuantity > 0 
                  ? `Only ${stockQuantity} left!` 
                  : 'Out of Stock'}
            </span>
          </div>
        </div>
      )}

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map(cat => (
            <span 
              key={cat.id}
              className="px-3 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20"
            >
              {cat.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
