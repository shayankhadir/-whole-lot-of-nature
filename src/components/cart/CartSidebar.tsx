"use client";

import { Fragment, useMemo, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
	X,
	ShoppingBag,
	Minus,
	Plus,
	Trash2,
	ShieldCheck,
	Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import FreeShippingProgress from "./FreeShippingProgress";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils/pricing";

const FREE_SHIPPING_THRESHOLD = 150;

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
	const [couponCode, setCouponCode] = useState("");
	const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
	const [couponStatus, setCouponStatus] = useState<string | null>(null);
	const [isApplying, setIsApplying] = useState(false);

	const savings = useMemo(() => Math.max(discount, 0), [discount]);
	const progressValue = useMemo(
		() => Math.max(subtotal - savings, 0),
		[subtotal, savings]
	);
	const hasFreeShipping = progressValue >= FREE_SHIPPING_THRESHOLD;

	const handleCouponAction = async () => {
		const trimmed = couponCode.trim();

		if (!trimmed && appliedCoupon) {
			useCartStore.getState().applyDiscount(0);
			setAppliedCoupon(null);
			setCouponStatus("Coupon removed");
			return;
		}

		if (!trimmed) {
			setCouponStatus("Enter a code to apply");
			return;
		}

		setIsApplying(true);
		setCouponStatus(null);

		try {
			const response = await fetch("/api/coupons/validate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ code: trimmed, subtotal }),
			});
			const data = await response.json();

			if (data.valid) {
				const discountValue = typeof data.discount === "number" ? data.discount : 0;
				setAppliedCoupon(trimmed.toUpperCase());
				useCartStore.getState().applyDiscount(discountValue);
				setCouponStatus(`Coupon applied – saved ${formatPrice(discountValue)}`);
				setCouponCode("");
			} else {
				setCouponStatus(data.message || "Invalid coupon");
				useCartStore.getState().applyDiscount(0);
			}
		} catch (error) {
			console.error("Failed to apply coupon", error);
			setCouponStatus("Unable to apply coupon. Please try again.");
		} finally {
			setIsApplying(false);
		}
	};

	const couponButtonDisabled =
		isApplying || (!couponCode.trim() && !appliedCoupon);

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
						<div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
							<Transition.Child
								as={Fragment}
								enter="transform transition ease-in-out duration-500 sm:duration-700"
								enterFrom="translate-x-full"
								enterTo="translate-x-0"
								leave="transform transition ease-in-out duration-500 sm:duration-700"
								leaveFrom="translate-x-0"
								leaveTo="translate-x-full"
							>
								<Dialog.Panel className="pointer-events-auto w-screen max-w-md sm:max-w-lg">
									<div className="relative flex h-full flex-col bg-[#030a06] text-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
										{isLoading && (
											<div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
												<div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-emerald-300" />
											</div>
										)}

										<div className="border-b border-white/10 bg-gradient-to-br from-[#05150a] to-[#030a06] px-6 py-6">
											<div className="flex items-start justify-between">
												<div>
													<p className="text-xs uppercase tracking-[0.4em] text-white/60">
														Your Cart
													</p>
													<Dialog.Title className="mt-2 text-2xl font-semibold antialiased">
														{isEmpty
															? "Your bag is waiting"
															: `${totalItems} item${totalItems !== 1 ? "s" : ""}`}
													</Dialog.Title>
													<p className="mt-1 text-sm text-white/80">
														{isEmpty
															? "Add something green to bring this space to life."
															: "Delivers in 3-5 days"}
													</p>
												</div>
												<button
													type="button"
													onClick={closeCart}
													className="rounded-full bg-white/10 p-2 hover:bg-white/20"
													aria-label="Close cart"
												>
													<X className="h-5 w-5" />
												</button>
											</div>

											{!isEmpty && (
													<div className="mt-6 grid grid-cols-3 gap-3 text-xs uppercase tracking-wide text-white/80">
													<div className="rounded-2xl border border-white/10 bg-white/5 p-3">
																	<p className="text-[10px] text-white/60">Subtotal</p>
														<p className="mt-1 text-base font-semibold text-white">
															{formatPrice(subtotal)}
														</p>
													</div>
													<div className="rounded-2xl border border-white/10 bg-white/5 p-3">
																	<p className="text-[10px] text-white/60">Savings</p>
														<p className="mt-1 text-base font-semibold text-emerald-300">
															{formatPrice(savings)}
														</p>
													</div>
													<div className="rounded-2xl border border-white/10 bg-white/5 p-3">
																	<p className="text-[10px] text-white/60">Delivery</p>
														<p className="mt-1 text-base font-semibold text-white">
															{hasFreeShipping ? "Free" : "3-5 days"}
														</p>
													</div>
												</div>
											)}

											{!isEmpty && (
												<div className="mt-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
													<div className="flex items-center gap-3 text-sm text-white/80">
														<Truck className="h-5 w-5 text-emerald-300" />
														<span>
															{hasFreeShipping
																? "Free express shipping unlocked"
																: "Free express shipping over ₹150"}
														</span>
													</div>
													<FreeShippingProgress
														cartTotal={progressValue}
														freeShippingThreshold={FREE_SHIPPING_THRESHOLD}
														className="mt-4"
													/>
												</div>
											)}
										</div>

										<div className="flex-1 overflow-y-auto px-6 py-6">
											{isEmpty ? (
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													className="text-center rounded-3xl border border-dashed border-white/20 bg-white/5 px-6 py-12"
												>
													<ShoppingBag className="mx-auto h-12 w-12 text-white/40" />
													<h3 className="mt-4 text-lg font-semibold">Your cart is empty</h3>
													<p className="mt-2 text-sm text-white/80">
														Start adding plants, combos, or accessories to see them here.
													</p>
													<Link
														href="/shop"
														onClick={closeCart}
														className="mt-6 inline-flex items-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0a180e] shadow-lg shadow-emerald-500/30"
													>
														Browse collection
													</Link>
												</motion.div>
											) : (
														<div className="space-y-4" role="list">
															<AnimatePresence initial={false}>
														{items.map((item, index) => (
															<motion.div
																key={item.id}
																initial={{ opacity: 0, y: 20 }}
																animate={{ opacity: 1, y: 0 }}
																exit={{ opacity: 0, y: -20 }}
																transition={{ delay: index * 0.05 }}
																role="listitem"
																className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_45px_rgba(3,10,6,0.4)]"
															>
																<div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-white/10">
																	<Image
																		src={item.image}
																		alt={item.name}
																		fill
																		sizes="96px"
																		className="object-cover"
																	/>
																</div>

																<div className="flex flex-1 flex-col">
																	<div className="flex justify-between gap-4">
																		<div>
																			<h3 className="text-base font-semibold leading-snug">
																				<span className="line-clamp-2">{item.name}</span>
																			</h3>
																			<p className="mt-1 text-xs uppercase tracking-wide text-white/60">
																				{item.type} {item.category && `• ${item.category}`}
																			</p>
																		</div>
																		<div className="text-right">
																			<p className="text-base font-semibold">{formatPrice(item.price)}</p>
																			{item.originalPrice && item.originalPrice > item.price && (
																				<p className="text-xs text-white/40 line-through">
																					{formatPrice(item.originalPrice)}
																				</p>
																			)}
																		</div>
																	</div>

																	<div className="mt-4 flex items-center justify-between">
																		<div className="flex items-center gap-3">
																			<span className="text-xs uppercase tracking-wide text-white/40">
																				Qty
																			</span>
																			<div className="flex items-center rounded-full border border-white/15 bg-white/5">
																				<button
																					onClick={() => updateQuantity(item.id, item.quantity - 1)}
																					className="rounded-l-full p-2 hover:bg-white/10 disabled:opacity-40"
																					disabled={item.quantity <= 1}
																					aria-label="Decrease quantity"
																				>
																					<Minus className="h-4 w-4" />
																				</button>
																				<span className="px-3 text-sm font-semibold">
																					{item.quantity}
																				</span>
																				<button
																					onClick={() => updateQuantity(item.id, item.quantity + 1)}
																					className="rounded-r-full p-2 hover:bg-white/10 disabled:opacity-40"
																					disabled={item.quantity >= (item.maxQuantity || 10)}
																					aria-label="Increase quantity"
																				>
																					<Plus className="h-4 w-4" />
																				</button>
																			</div>
																		</div>
																		<button
																			type="button"
																			onClick={() => removeItem(item.id)}
																			className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/70 hover:text-red-300"
																		>
																			<Trash2 className="h-4 w-4" /> Remove
																		</button>
																	</div>
																</div>
															</motion.div>
														))}
													</AnimatePresence>
												</div>
											)}
										</div>

										<div className="border-t border-white/10 bg-black/30 px-6 py-6 space-y-6">
											{!isEmpty && (
												<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
													<div className="flex items-center gap-2 text-sm text-white/80">
														<ShieldCheck className="h-4 w-4 text-emerald-300" />
														<span>Have a promo code?</span>
													</div>
													<div className="mt-3 flex gap-2">
														<input
															value={couponCode}
															onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
															placeholder={appliedCoupon ?? "WELCOME10"}
															className="flex-1 rounded-xl border border-white/15 bg-black/40 px-4 py-2 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-400"
															disabled={isApplying}
														/>
														<button
															onClick={handleCouponAction}
															disabled={couponButtonDisabled}
															className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 disabled:opacity-60"
														>
															{isApplying
																? "Applying..."
																: appliedCoupon
																? "Update"
																: "Apply"}
														</button>
													</div>
													{couponStatus && (
														<p className="mt-2 text-xs text-emerald-200">{couponStatus}</p>
													)}
												</div>
											)}

											<div className="space-y-3">
												<Link
													href="/checkout"
													onClick={closeCart}
													className="flex w-full items-center justify-between rounded-full bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/40 hover:brightness-110"
												>
													<span>Secure Checkout</span>
													<span>{formatPrice(totalPrice)}</span>
												</Link>
												<div className="flex gap-3 text-sm">
													<Link
														href="/cart"
														onClick={closeCart}
															className="flex-1 rounded-full border border-white/15 px-4 py-3 text-center font-semibold text-white/90 hover:text-white"
													>
														View Cart
													</Link>
													<button
														onClick={clearCart}
														className="flex-1 rounded-full border border-red-400/30 px-4 py-3 text-center font-semibold text-red-200 hover:bg-red-500/10"
													>
														Clear All
													</button>
												</div>
												<p className="text-center text-xs text-white/40">
													or
													<Link
														href="/shop"
														onClick={closeCart}
														className="ml-1 font-semibold text-emerald-300 hover:text-white"
													>
														continue shopping →
													</Link>
												</p>
											</div>
										</div>
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
