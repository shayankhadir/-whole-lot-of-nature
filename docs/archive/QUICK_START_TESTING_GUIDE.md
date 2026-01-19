# QUICK START TESTING GUIDE - PRIORITY 1 E-COMMERCE
**Last Updated:** November 25, 2024
**Purpose:** Manual testing checklist for e-commerce functionality

---

## 🚀 Quick Start (5 Minutes)

### 1. Start Dev Server
```bash
npm run dev
# Server starts on http://localhost:3000
```

### 2. Open Browser
Go to: **http://localhost:3000/shop**

### 3. Quick Test Sequence (5 min)
```
✓ Page loads?
✓ Products showing?
✓ Click a product
✓ Click "Add to Cart"
✓ Cart count updated?
✓ Open cart sidebar
✓ Item there?
✓ Click "Checkout"
✓ Checkout page loads?
```

**All yes? → ✅ Core functionality working**

---

## 📋 Full Testing Checklist

### Test 1: PRODUCT BROWSING (10 min)
- [ ] Go to `/shop`
- [ ] Page loads without errors
- [ ] Products display in grid
- [ ] Each product shows: image, name, price
- [ ] Grid is responsive (resize browser to test mobile)
- [ ] Category filter sidebar visible
- [ ] Click a category filter
- [ ] Results update
- [ ] Search box visible (if applicable)
- [ ] Search returns results

**Time:** ~10 minutes
**Expected:** All features working

---

### Test 2: ADD TO CART (15 min)
- [ ] Click on a product
- [ ] Product detail page loads
- [ ] Product image displays
- [ ] Product name and price shown
- [ ] Product description visible
- [ ] Quantity selector visible
- [ ] Click + to increase quantity
- [ ] Click - to decrease quantity
- [ ] "Add to Cart" button visible
- [ ] Click "Add to Cart"
- [ ] Success message or animation
- [ ] Cart icon badge count increased
- [ ] Click another product
- [ ] Repeat: change qty, add to cart
- [ ] Verify cart count increased again

**Time:** ~15 minutes
**Expected:** Quantities should stack, badge should reflect total items

---

### Test 3: CART SIDEBAR (20 min)
- [ ] Click cart icon to open sidebar
- [ ] Sidebar slides open from right
- [ ] Products listed with image, name, price
- [ ] Quantity shown with +/- buttons
- [ ] Click + for first item, quantity increases
- [ ] Price total updates
- [ ] Click - button, quantity decreases
- [ ] Click trash icon to remove item
- [ ] Item removed from cart
- [ ] Cart count in badge decreases
- [ ] Subtotal displayed
- [ ] Shipping cost shown
- [ ] Tax amount shown
- [ ] Total price calculated (subtotal + tax + shipping)
- [ ] Check if free shipping appears when subtotal >= $150
- [ ] "Continue Shopping" button visible
- [ ] "Proceed to Checkout" button visible

**Time:** ~20 minutes
**Expected:** All math correct, buttons responsive

---

### Test 4: CART PERSISTENCE (5 min)
- [ ] Have items in cart with total of $X
- [ ] Refresh page (Ctrl+R or F5)
- [ ] Wait for page to load
- [ ] Open cart sidebar
- [ ] Items still there?
- [ ] Total still shows $X?

**Time:** ~5 minutes
**Expected:** Cart should NOT be empty after refresh

---

### Test 5: CHECKOUT FLOW (15 min)
- [ ] Click "Proceed to Checkout"
- [ ] Checkout page loads (`/checkout`)
- [ ] Order summary shows all items
- [ ] Subtotal matches cart
- [ ] Tax amount matches
- [ ] Shipping matches
- [ ] Grand total matches cart total
- [ ] Form fields visible (email, name, address, etc.)
- [ ] Try to submit without filling form
- [ ] Error messages appear
- [ ] Fill in form fields
- [ ] Click somewhere else to trigger validation
- [ ] No errors for valid input
- [ ] Payment method selector visible (if applicable)
- [ ] "Place Order" or "Complete Purchase" button visible

**Time:** ~15 minutes
**Expected:** Form validation working, order summary accurate

---

### Test 6: WISHLIST (10 min)
- [ ] Go back to shop
- [ ] Look for heart/wishlist icon on product
- [ ] Click heart icon
- [ ] Heart should show as filled/liked
- [ ] Go to `/wishlist`
- [ ] Product should appear in wishlist
- [ ] Click heart again to remove
- [ ] Product should disappear from wishlist

**Time:** ~10 minutes
**Expected:** Wishlist add/remove working

---

### Test 7: COUPON CODE (5 min)
- [ ] Open cart sidebar
- [ ] Look for coupon input field
- [ ] Enter a test code (try "TEST10")
- [ ] Click apply button
- [ ] If valid: discount should apply to total
- [ ] If invalid: error message should show
- [ ] Try another code that doesn't exist
- [ ] Error should show "Invalid coupon"

**Time:** ~5 minutes
**Expected:** Valid coupons apply discount, invalid show error

---

## 🎯 Success Criteria

### PASS ✅ - All Required
- [ ] Products load from `/shop`
- [ ] Can click product and see details
- [ ] Can add to cart
- [ ] Cart count updates
- [ ] Can open cart sidebar
- [ ] Cart shows correct items
- [ ] Can proceed to checkout
- [ ] Checkout page loads
- [ ] Order summary accurate
- [ ] Cart persists on refresh

### NICE TO HAVE ⭐
- [ ] Coupon codes work
- [ ] Free shipping threshold visible
- [ ] Wishlist functional
- [ ] Smooth animations
- [ ] Mobile responsive

---

## 🐛 Found a Bug?

**Document it with:**
1. **What happened:** (be specific)
2. **What should happen:** (expected behavior)
3. **Steps to reproduce:** (1, 2, 3...)
4. **Browser:** Chrome/Firefox/Safari
5. **Screenshot:** If possible

**Example:**
```
Bug: Add to cart doubles quantity incorrectly
What happened: Added 1 item, cart shows 2
Expected: Should show 1
Steps:
1. Go to /shop
2. Click first product
3. Set quantity to 1
4. Click "Add to Cart"
5. Open cart - shows 2 instead of 1
Browser: Chrome 120
```

---

## 📊 Testing Timeline

| Phase | Duration | Tester | Status |
|-------|----------|--------|--------|
| Product Browsing | 10 min | Manual | ⏳ |
| Add to Cart | 15 min | Manual | ⏳ |
| Cart Sidebar | 20 min | Manual | ⏳ |
| Cart Persistence | 5 min | Manual | ⏳ |
| Checkout Flow | 15 min | Manual | ⏳ |
| Wishlist | 10 min | Manual | ⏳ |
| Coupon Code | 5 min | Manual | ⏳ |
| **TOTAL** | **~80 min** | | ⏳ |

---

## 💻 Developer Notes

### Key Files Being Tested
- `src/app/shop/page.tsx` - Shop listing
- `src/app/shop/[slug]/page.tsx` - Product detail
- `src/app/cart/page.tsx` - Cart page
- `src/app/checkout/page.tsx` - Checkout page
- `src/app/wishlist/page.tsx` - Wishlist page
- `src/stores/cartStore.ts` - Cart state management
- `src/components/cart/CartSidebar.tsx` - Cart popup

### What's Being Tested
- React component rendering
- Zustand store state updates
- API data fetching
- User interactions (clicks, input)
- Calculations (tax, totals)
- LocalStorage persistence

### Common Issues to Watch For
- Cart not updating after add
- Math calculations wrong
- API returning wrong data
- Page navigation not working
- Form validation not triggering

---

## Next Steps After Testing

### If Everything Works ✅
1. Mark Priority 1 as COMPLETE
2. Move to Priority 2 (Content Pages Testing)
3. Document findings in QA_TESTING_REPORT.md

### If Issues Found ❌
1. Document each issue
2. Create tickets/notes for fixes
3. Categorize by severity
4. Prioritize fixes before launch

---

**Testing Started:** [Your Date/Time]
**Testing Completed:** [Your Date/Time]
**Total Time:** [X minutes]
**Issues Found:** [Number]
**Overall Status:** [ ] PASS [ ] FAIL

---

For detailed testing documentation, see: **PRIORITY_1_ECOMMERCE_TESTING.md**
