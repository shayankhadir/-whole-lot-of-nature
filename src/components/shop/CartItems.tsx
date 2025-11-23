import Image from 'next/image';
import { X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';

export default function CartItems() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce(
    (total, item) => total + parseFloat(item.price) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <motion.div layout>
      <AnimatePresence mode="popLayout">
        {items.length > 0 ? (
          <motion.ul
            role="list"
            className="divide-y divide-gray-200 bg-white rounded-lg shadow-sm overflow-hidden"
            layout
          >
            {items.map((item) => (
              <motion.li
                key={item.productId}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="p-4 flex items-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover object-center transform transition-transform duration-300"
                  />
                </motion.div>

                <div className="ml-4 flex-grow">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                    <motion.h3
                      layout
                      className="text-base font-medium text-gray-900 mb-1 sm:mb-0 antialiased"
                    >
                      {item.name}
                    </motion.h3>
                    <motion.p
                      layout
                      className="text-base font-medium text-gray-900 antialiased"
                    >
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </motion.p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => removeItem(item.productId)}
                      className="p-2 text-primary-600 hover:text-primary-700 rounded-full hover:bg-primary-50"
                    >
                      <X className="h-5 w-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <p className="text-[#E8F5E9]/70">Your cart is empty</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 border-t border-gray-200 px-4 py-6 sm:px-6 bg-white rounded-lg shadow-sm"
          >
            <div className="flex justify-between text-base font-medium text-gray-900 antialiased">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <p className="mt-2 text-sm text-[#E8F5E9]/70">
              Shipping and taxes calculated at checkout.
            </p>
            <p className="mt-2 text-sm text-primary-600">
              🌱 You're helping us plant trees! For orders over $50, we plant a tree.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
