'use client';

import Link from 'next/link';

const socialLinks = [
	{
		label: 'Instagram',
		href: 'https://www.instagram.com/wholelotofnature/',
		icon: (
			<svg
				className="h-5 w-5"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
	{
		label: 'YouTube',
		href: 'https://www.youtube.com/@wholelotofnature',
		icon: (
			<svg
				className="h-5 w-5"
				fill="currentColor"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<path
					fillRule="evenodd"
					d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 01-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 01-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 011.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zm-4.618 6.582L10 15V9l5.194 3z"
					clipRule="evenodd"
				/>
			</svg>
		),
	},
];

export default function Footer() {
	return (
		<footer className="relative overflow-hidden border-t border-white/10 bg-[#030a06] text-white">
			<div
				className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(102,187,106,0.1),transparent_60%)]"
				aria-hidden
			/>
			<div className="absolute inset-0 opacity-40" aria-hidden>
				<svg
					className="h-full w-full"
					xmlns="http://www.w3.org/2000/svg"
					preserveAspectRatio="none"
				>
					<defs>
						<pattern
							id="leaf-grid"
							width="160"
							height="160"
							patternUnits="userSpaceOnUse"
						>
							<path
								d="M0 80 Q40 0 80 80 T160 80"
								stroke="rgba(102,187,106,0.15)"
								strokeWidth="0.6"
								fill="none"
							/>
						</pattern>
					</defs>
					<rect width="100%" height="100%" fill="url(#leaf-grid)" />
				</svg>
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-6 py-16 lg:px-12 space-y-12">
				<div className="glass-panel flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5/50 px-6 py-5 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left backdrop-blur-md">
					<div>
						<p className="text-xs uppercase tracking-[0.4em] text-white/85">
							Need help?
						</p>
						<p className="text-lg font-semibold text-white antialiased">
							Our greenhouse support line is open daily 9am–9pm IST.
						</p>
					</div>
					<Link
						href="/about#contact"
						className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-2 text-sm font-semibold text-white hover:border-[#66BB6A] hover:text-[#66BB6A] transition-colors"
					>
						Talk to us
					</Link>
				</div>

				<div className="grid gap-12 lg:grid-cols-12">
					<div className="space-y-6 lg:col-span-4">
						<div>
							<p className="text-sm uppercase tracking-[0.35em] text-white/85">
								Whole Lot of Nature
							</p>
							<p className="mt-3 text-[clamp(1rem,2vw,1.1rem)] text-white/80">
								Regenerative plants, handcrafted soil, and mindful rituals from
								our forest studio in Hyderabad.
							</p>
						</div>
						<div className="flex gap-3">
							{socialLinks.map((link) => (
								<Link
									key={link.label}
									href={link.href}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white/85 transition-all hover:border-[#66BB6A] hover:text-white backdrop-blur-md"
								>
									<span className="sr-only">{link.label}</span>
									{link.icon}
								</Link>
							))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-8 text-sm text-white/85 sm:grid-cols-3 lg:col-span-5">
						<div>
							<p className="font-semibold text-white">Shop</p>
							<ul className="mt-4 space-y-3">
								<li>
									<Link href="/shop" className="hover:text-white">
										All products
									</Link>
								</li>
								<li>
									<Link href="/shop/categories" className="hover:text-white">
										Categories
									</Link>
								</li>
								<li>
									<Link href="/combos" className="hover:text-white">
										Combos
									</Link>
								</li>
								<li>
									<Link href="/wishlist" className="hover:text-white">
										Wishlist
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<p className="font-semibold text-white">Company</p>
							<ul className="mt-4 space-y-3">
								<li>
									<Link href="/about" className="hover:text-white">
										About us
									</Link>
								</li>
								<li>
									<Link href="/blog" className="hover:text-white">
										Journal
									</Link>
								</li>
								<li>
									<Link href="/contact" className="hover:text-white">
										Contact
									</Link>
								</li>
								<li>
									<Link
										href="/admin/pages"
										className="hover:text-white text-[#4ADE80]"
									>
										Site Map (Admin)
									</Link>
								</li>
							</ul>
						</div>
						<div>
							<p className="font-semibold text-white">Legal</p>
							<ul className="mt-4 space-y-3">
								<li>
									<Link href="/terms" className="hover:text-white">
										Terms
									</Link>
								</li>
								<li>
									<Link href="/privacy-policy" className="hover:text-white">
										Privacy
									</Link>
								</li>
								<li>
									<Link href="/refund-policy" className="hover:text-white">
										Refunds
									</Link>
								</li>
								<li>
									<Link href="/faq" className="hover:text-white">
										FAQ
									</Link>
								</li>
							</ul>
						</div>
					</div>

					<div className="lg:col-span-3">
						<p className="font-semibold text-white">Garden dispatch</p>
						<p className="mt-3 text-sm text-white/85">
							Weekly soil notes, limited drops, and invites to live demos.
						</p>
						<form className="mt-6 space-y-3">
							<input
								type="email"
								placeholder="you@example.com"
								className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/50 focus:border-[#66BB6A] focus:outline-none backdrop-blur-md"
							/>
							<button
								type="submit"
								className="w-full rounded-2xl bg-[#66BB6A] px-4 py-3 text-sm font-semibold text-[#0b1b12] transition-colors hover:bg-[#52a258]"
							>
								Subscribe
							</button>
						</form>
					</div>
				</div>

				<div className="flex flex-col gap-6 border-t border-white/10 pt-8 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
					<div className="flex flex-col gap-2">
						<p>
							&copy; {new Date().getFullYear()} Whole Lot of Nature. Crafted in
							Hyderabad, India.
						</p>
						<div className="flex gap-3 text-[10px] uppercase tracking-wider opacity-70">
							<span>Visa</span>
							<span>Mastercard</span>
							<span>UPI</span>
							<span>RuPay</span>
							<span>Net Banking</span>
						</div>
					</div>
					<div className="flex flex-wrap gap-6 font-medium">
						<Link href="/sitemap" className="hover:text-white transition-colors">
							Sitemap
						</Link>
						<Link href="/shipping" className="hover:text-white transition-colors">
							Shipping Policy
						</Link>
						<Link href="/careers" className="hover:text-white transition-colors">
							Careers
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}