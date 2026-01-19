"use client";

import { Fragment, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Dialog, Transition } from "@headlessui/react";
import {
	X,
	ShoppingBag,
	Minus,
	Plus,
	Trash2,
	Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import FreeShippingProgress from "./FreeShippingProgress";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils/pricing";

const FREE_SHIPPING_THRESHOLD = 999;

export default function CartSidebar() {
	const {
		items,
		isOpen,
		totalItems,
		totalPrice,
		subtotal,
		discount,
		shipping,
		tax,
		closeCart,
		updateQuantity,
		removeItem,
		clearCart,
		isLoading,
	} = useCartStore();

	const isEmpty = items.length === 0;

	const savings = useMemo(() => Math.max(discount, 0), [discount]);
	const progressValue = useMemo(
		() => Math.max(subtotal - savings, 0),
		[subtotal, savings]
	);
	const hasFreeShipping = progressValue >= FREE_SHIPPING_THRESHOLD;

	return (
		<Transition.Root show={isOpen} as={Fragment}>
			<Dialog as="div" className="relative z-[90]" onClose={closeCart}>
				<Transition.Child
					as={Fragment}
					enter="ease-in-out duration-500"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in-out duration-500"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-black/70 backdrop-blur-md" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-hidden">
					<div className="absolute inset-0 overflow-hidden">
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-out duration-300 sm:duration-500"
								enterFrom="translate-x-full opacity-0"
								enterTo="translate-x-0 opacity-100"
								leave="transform transition ease-in duration-250 sm:duration-400"
								leaveFrom="translate-x-0 opacity-100"
								leaveTo="translate-x-full opacity-0"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md">
									<div className="relative flex h-full flex-col bg-[#0d3512] text-white shadow-2xl border-l border-white/10 will-change-transform">
										{isLoading && (
											<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
												<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-emerald-300" />
											</div>
										)}

										<div className="border-b border-white/10 bg-[#0a2810] px-6 py-6">
											<div className="flex items-center justify-between">
												<div>
													<Dialog.Title className="text-xl font-display font-semibold text-white">
														Shopping Cart
													</Dialog.Title>
													<p className="text-sm text-emerald-100/60 mt-1">
														{isEmpty
															? "Your cart is empty"
															: `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
													</p>
												</div>
												<button
													type="button"
													className="rounded-full p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
													onClick={closeCart}
												>
													<span className="sr-only">Close panel</span>
													<X className="h-6 w-6" aria-hidden="true" />
												</button>
											</div>
										</div>
										<div className="flex-1 overflow-y-auto px-6 py-6">
											{!isEmpty && (
												<div className="mb-6">
													<div className="flex items-center gap-2 text-sm text-emerald-100/80 mb-3">
														<Truck className="h-4 w-4" />
														<span>
															{hasFreeShipping
																? "You've unlocked free shipping!"
																: `Add ${formatPrice(FREE_SHIPPING_THRESHOLD - progressValue)} for free shipping`}
														</span>
													</div>
													<FreeShippingProgress
														cartTotal={progressValue}
														freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
														className="h-1.5"
													/>
												</div>
											)}

											{isEmpty ? (
												<div className="flex h-full flex-col items-center justify-center text-center space-y-4">
													<div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
														<ShoppingBag className="h-8 w-8 text-white/40" />
													</div>
													<div>
														<h3 className="text-lg font-medium text-white">Your cart is empty</h3>
														<p className="text-sm text-white/60 mt-1">
															Looks like you have not added anything yet.
														</p>
													</div>
													<Link
														href="/shop"
														onClick={closeCart}
														className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors"
													>
														Start Shopping
													</Link>
												</div>
											) : (
												<motion.ul
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.2 }}
													className="space-y-6"
												>
													{items.map((item) => (
														<motion.li
															key={item.id}
															layout
															initial={{ opacity: 0, y: 8 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{ duration: 0.2 }}
															className="flex gap-4"
														>
															<div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
																<Image
																	src={item.image}
																	alt={item.name}
																	fill
																	className="object-cover"
																/>
															</div>

															<div className="flex flex-1 flex-col justify-between">
																<div className="flex justify-between gap-4">
																	<div>
																		<h3 className="text-xs font-medium text-white">
																			{item.name}
																		</h3>
																		<p className="mt-1 text-xs text-white/60">
																			{item.type}
																		</p>
																	</div>
																	<p className="text-sm font-medium text-white">
																		{formatPrice(item.price)}
																	</p>
																</div>

																<div className="flex items-center justify-between">
																	<div className="flex items-center rounded-lg border border-white/10 bg-white/5">
																		<button
																			onClick={() => updateQuantity(item.id, item.quantity - 1)}
																			className="p-1.5 text-white/60 hover:text-white disabled:opacity-50"
																			aria-label={`Decrease quantity of ${item.name}`}
																			disabled={item.quantity <= 1}
																		>
																			<Minus className="h-3 w-3" />
																		</button>
																		<span className="px-2 text-xs font-medium text-white">
																			{item.quantity}
																		</span>
																		<button
																			onClick={() => updateQuantity(item.id, item.quantity + 1)}
																			className="p-1.5 text-white/60 hover:text-white disabled:opacity-50"
																			aria-label={`Increase quantity of ${item.name}`}
																			disabled={item.quantity >= (item.maxQuantity || 10)}
																		>
																			<Plus className="h-3 w-3" />
																		</button>
																	</div>
																	<button
																		type="button"
																		onClick={() => removeItem(item.id)}
																		className="text-xs text-white/40 hover:text-red-400 transition-colors"
																	>
																		Remove
																	</button>
																</div>
															</div>
														</motion.li>
													))}
											</motion.ul>
											)}
										</div>

										{!isEmpty && (
											<div className="border-t border-white/10 bg-[#0a2810] px-6 py-6">
												<div className="space-y-2 mb-4">
													<div className="flex justify-between text-sm text-white/60">
														<span>Subtotal</span>
														<span>{formatPrice(subtotal)}</span>
													</div>
													{discount > 0 && (
														<div className="flex justify-between text-sm text-emerald-400">
															<span>Savings</span>
															<span>-{formatPrice(discount)}</span>
														</div>
													)}
													<div className="flex justify-between text-sm text-white/60">
														<span>Shipping</span>
														<span>{hasFreeShipping ? "Free" : "Calculated at checkout"}</span>
													</div>
													<div className="flex justify-between text-base font-medium text-white pt-2 border-t border-white/10">
														<span>Total</span>
														<span>{formatPrice(totalPrice)}</span>
													</div>
												</div>

												<Link
													href="/checkout"
													onClick={closeCart}
													className="flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 hover:bg-emerald-500 transition-colors"
												>
													Checkout
												</Link>
												<div className="mt-3 text-center">
													<button
														onClick={clearCart}
														className="text-xs text-white/40 hover:text-white transition-colors"
													>
														Clear Cart
													</button>
												</div>
											</div>
										)}
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</div>
			</Dialog>
		</Transition.Root>
	);
}
