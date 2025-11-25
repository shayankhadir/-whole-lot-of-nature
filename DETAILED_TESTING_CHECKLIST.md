# PHASE 1 COMPREHENSIVE TESTING CHECKLIST
**Execute Date:** November 25, 2025  
**Tester:** Development Team  
**Status:** Ready for Execution

---

## SECTION 1: PRODUCT DISCOVERY & BROWSING

### 1.1 Shop Page Load Test
**Test:** Navigate to `/shop` and verify page loads correctly
- [ ] Page loads without errors
- [ ] No console errors (check DevTools)
- [ ] Page loads in < 3 seconds
- [ ] All images load successfully
- [ ] Product cards render properly
- [ ] Product count displays (e.g., "Showing 12 products")

**Expected Behavior:**
- Grid layout with 3-4 columns (responsive)
- Product cards with image, name, price, rating, "Add to Cart" button
- Filter sidebar (if implemented)
- Search bar at top
- Pagination or "Load More" button

**Console Check:**
- [ ] No red errors
- [ ] No 404s for product images
- [ ] API calls to `/api/products` return 200 status
- [ ] No memory leaks or warnings

---

### 1.2 Product Filtering
**Test:** Verify filtering functionality works
- [ ] Category filters work (if available)
- [ ] Price range filter works (if available)
- [ ] Rating filter works (if available)
- [ ] Multiple filters can be applied simultaneously
- [ ] Products update when filter applied
- [ ] Product count updates correctly
- [ ] "Clear filters" button works

**Expected Behavior:**
- Filters load options from WooCommerce categories
- Page updates instantly without full reload
- URL parameters update to reflect filters
- Filtered products display correctly

---

### 1.3 Search Functionality
**Test:** Test search bar and search results
- [ ] Search bar is visible and functional
- [ ] Type in search query
- [ ] Results update (either live or on submit)
- [ ] Search returns relevant products
- [ ] Empty search handled gracefully
- [ ] Search terms highlighted in results (if applicable)

**Expected Behavior:**
- Searches WooCommerce product database
- Results include products matching name/description
- No search breaks the page

---

### 1.4 Sorting Functionality
**Test:** Verify sorting options work
- [ ] Sort by "Price: Low to High" works
- [ ] Sort by "Price: High to Low" works
- [ ] Sort by "Newest" works (if applicable)
- [ ] Sort by "Popularity" works (if applicable)
- [ ] Sort by "Rating" works (if applicable)
- [ ] Products reorder correctly

**Expected Behavior:**
- Sorting updates product order instantly
- Sort dropdown reflects current selection
- Products display in correct order

---

### 1.5 Pagination/Load More
**Test:** Navigate through product list pages
- [ ] Pagination controls visible
- [ ] "Next" button works (if applicable)
- [ ] Page 2 loads correctly
- [ ] "Previous" button works
- [ ] Page URL updates with page parameter
- [ ] Or "Load More" button loads additional products
- [ ] No duplicate products when loading

**Expected Behavior:**
- Smooth pagination without page reload
- Correct products load for each page
- Page count displays correctly

---

## SECTION 2: PRODUCT DETAILS

### 2.1 Product Detail Page Load
**Test:** Click on a product and verify detail page loads
- [ ] Clicking product card navigates to `/products/[slug]`
- [ ] Detail page loads without errors
- [ ] Page loads in < 3 seconds
- [ ] All product information displays
- [ ] Related products show (if implemented)

**Expected Behavior:**
- Product slug matches product name
- Full product details visible
- Product image gallery loaded

**Console Check:**
- [ ] No errors on page load
- [ ] Product API endpoint responds successfully

---

### 2.2 Product Information Display
**Test:** Verify all product details display correctly
- [ ] Product name displays clearly
- [ ] Product price displays correctly
- [ ] Product rating/reviews visible
- [ ] Product description displays fully
- [ ] Product specifications/attributes visible (if applicable)
- [ ] Stock status shows (in stock/out of stock)
- [ ] SKU or product ID visible (if applicable)

**Expected Behavior:**
- All data matches WooCommerce database
- Prices are formatted in Indian Rupees (₹)
- Out of stock products show "Out of Stock" badge
- In stock shows "Add to Cart" enabled

---

### 2.3 Product Images
**Test:** Verify product image gallery works
- [ ] Main image displays large and clearly
- [ ] Thumbnail images visible below (if gallery exists)
- [ ] Click thumbnail updates main image
- [ ] Image zoom works (if implemented)
- [ ] All images load without 404 errors
- [ ] Images are optimized (not huge file sizes)
- [ ] Images responsive on mobile

**Expected Behavior:**
- Images load from WooCommerce media library
- Gallery shows product from multiple angles
- Images are lazy-loaded for performance

---

## SECTION 3: ADD TO CART

### 3.1 Quantity Selector
**Test:** Test quantity selection before adding to cart
- [ ] Quantity selector visible (number input or +/- buttons)
- [ ] Default quantity is 1
- [ ] Increment button increases quantity
- [ ] Decrement button decreases quantity
- [ ] Cannot go below 1
- [ ] Can type quantity directly in field
- [ ] Invalid quantities handled (letters, negative, etc.)

**Expected Behavior:**
- Min quantity = 1
- Max quantity enforced by stock level
- Validation prevents invalid entries

---

### 3.2 Add to Cart Action
**Test:** Click "Add to Cart" button
- [ ] "Add to Cart" button is visible and enabled
- [ ] Clicking button adds product to cart
- [ ] Page doesn't navigate away (stays on product page)
- [ ] Cart count in header updates
- [ ] Quantity in cart count is correct
- [ ] Success notification/toast shows (if implemented)
- [ ] Button shows loading state (if applicable)

**Expected Behavior:**
- Product added to cart immediately
- Cart count updates without page reload
- Notification shows "Added to cart successfully" or similar
- Can add multiple same products

**Console Check:**
- [ ] No errors in console
- [ ] API call to cart endpoint returns 200
- [ ] localStorage updated with cart items

---

### 3.3 Cart Count Update
**Test:** Verify cart count in header updates
- [ ] Header shows cart icon with count badge
- [ ] Count matches number of items added
- [ ] Count updates for multiple additions
- [ ] Count updates in real-time
- [ ] Counts are accurate (Qty 3 = 3 in count, not 1)

**Expected Behavior:**
- Cart icon visible in header/navbar
- Badge shows total number of items or count

---

### 3.4 Multiple Products
**Test:** Add different products and verify cart updates
- [ ] Add product A to cart
- [ ] Navigate to another product
- [ ] Add product B to cart
- [ ] Cart now contains both products
- [ ] Cart count reflects both products
- [ ] Can add same product multiple times
- [ ] Quantities accumulate correctly

**Expected Behavior:**
- Cart maintains multiple different products
- Adding same product again increases quantity
- Total items = sum of all quantities

---

## SECTION 4: SHOPPING CART

### 4.1 Cart Sidebar/Page
**Test:** Open shopping cart and verify contents
- [ ] Cart sidebar/page opens when clicking cart icon
- [ ] All items in cart display
- [ ] Each item shows: image, name, price, quantity
- [ ] Total items count displayed
- [ ] Subtotal calculated correctly
- [ ] Shipping cost displayed (if applicable)
- [ ] Tax calculated (if applicable)
- [ ] Grand total calculated correctly

**Expected Behavior:**
- Subtotal = sum of (price × quantity) for all items
- Totals calculated without page reload
- Layout responsive on mobile/tablet

**Price Verification Formula:**
```
Subtotal = Σ(Product Price × Quantity)
Shipping = Based on total or item count
Tax = Subtotal × Tax Rate (if applicable)
Grand Total = Subtotal + Shipping + Tax
```

---

### 4.2 Quantity Adjustment
**Test:** Modify quantities in cart
- [ ] Quantity +/- buttons or input field visible
- [ ] Click + increases quantity
- [ ] Click - decreases quantity
- [ ] Cannot reduce below 1
- [ ] Can manually enter quantity
- [ ] Totals update when quantity changes
- [ ] Changes persist (no page reload required)

**Expected Behavior:**
- Quantity updates instantly
- Totals recalculate automatically
- No validation errors for valid quantities

---

### 4.3 Remove Items
**Test:** Remove products from cart
- [ ] Remove button visible for each item
- [ ] Click remove deletes item from cart
- [ ] Item immediately disappears
- [ ] Cart count decreases
- [ ] Totals recalculate
- [ ] Cart shows empty state if last item removed
- [ ] "Continue Shopping" button available when empty

**Expected Behavior:**
- Item removed instantly
- Cart updates without reload
- Empty cart message displays if no items

---

### 4.4 Free Shipping Indicator
**Test:** Verify free shipping threshold
- [ ] If subtotal ≥ ₹150: "Free Shipping" shows
- [ ] If subtotal < ₹150: Shipping cost shows, or "Add ₹X more for free shipping"
- [ ] Threshold indicator updates as items added/removed
- [ ] Message clear about free shipping eligibility

**Expected Behavior:**
- Accurate threshold calculation
- User encouraged to add more to reach free shipping
- Shipping cost accurate for orders below threshold

---

### 4.5 Coupon/Discount Code
**Test:** Apply coupon codes
- [ ] Coupon input field visible
- [ ] Can type coupon code (e.g., "SAVE06")
- [ ] Click "Apply" button
- [ ] Valid coupon shows discount applied
- [ ] Total recalculates with discount
- [ ] Invalid coupon shows error message
- [ ] Can remove/change coupon

**Coupons to Test:**
- [ ] SAVE06 - Should apply 6% discount
- [ ] WELCOME10 - Should apply 10% discount (new customers)
- [ ] FLAT50 - Should apply ₹50 flat discount
- [ ] INVALID - Should show error

**Expected Behavior:**
- API validates coupon against WooCommerce
- Discount displays as line item
- Coupon code shown with discount amount
- Can modify or remove coupon

---

## SECTION 5: CART PERSISTENCE

### 5.1 localStorage Persistence
**Test:** Verify cart persists after page refresh
- [ ] Add 2-3 items to cart
- [ ] Note: subtotal, items, quantities
- [ ] Refresh page (F5 or Cmd+R)
- [ ] Cart items still present
- [ ] Quantities unchanged
- [ ] Subtotal matches pre-refresh
- [ ] Cart count still shows
- [ ] All item details intact

**Expected Behavior:**
- Cart uses localStorage or session storage
- All cart data persists across page refreshes
- Data persists for entire browser session
- Survives page navigation

**Console Check:**
- [ ] localStorage contains cart key with JSON data
- [ ] No console errors on reload

---

### 5.2 Cross-Page Persistence
**Test:** Verify cart persists when navigating
- [ ] Add items to cart on /shop page
- [ ] Navigate to /about page
- [ ] Navigate back to /shop
- [ ] Cart still contains items added
- [ ] Navigate to /products/[slug]
- [ ] Add another item
- [ ] Go to /cart page
- [ ] All items present
- [ ] Totals correct

**Expected Behavior:**
- Cart state maintained across entire site navigation
- No data loss when changing pages
- Cart updates available on every page

---

### 5.3 Browser Close/Reopen
**Test:** Verify cart persists after closing browser
- [ ] Add items to cart
- [ ] Note cart details
- [ ] Close browser completely (not just tab)
- [ ] Reopen browser
- [ ] Navigate to site
- [ ] Cart items still present with correct data
- [ ] Or cart cleared if configured for session-only

**Expected Behavior:**
- Depends on implementation (localStorage = persistent, sessionStorage = session-only)
- For e-commerce, localStorage persistence recommended
- Cart survives browser restart

---

## SECTION 6: CHECKOUT FLOW

### 6.1 Checkout Page Load
**Test:** Navigate to checkout
- [ ] Click "Checkout" button from cart
- [ ] Directed to `/checkout` page
- [ ] Checkout page loads without errors
- [ ] Order summary displays on right side (desktop)
- [ ] Form fields visible on left side (desktop)
- [ ] Responsive layout on mobile

**Expected Behavior:**
- Clean checkout layout
- Order summary shows items and total
- Forms properly labeled and organized

**Console Check:**
- [ ] No errors loading checkout page
- [ ] Form validation libraries load
- [ ] No missing stylesheets or scripts

---

### 6.2 Billing Address Form
**Test:** Fill in billing address
- [ ] Form has fields: First Name, Last Name, Email, Phone
- [ ] Address fields: Street, City, State, Postal Code
- [ ] Country selector (default: India)
- [ ] All fields clearly labeled
- [ ] Required fields marked with asterisk (*)
- [ ] Can fill in all fields without errors
- [ ] Tab navigation works between fields

**Expected Behavior:**
- Form fields accept appropriate input
- Email field validates email format
- Phone field validates phone format
- State/City fields map to India locations
- No character limits on required fields

---

### 6.3 Shipping Address
**Test:** Verify shipping address handling
- [ ] "Shipping same as billing" checkbox available
- [ ] Checked by default (if common UX pattern)
- [ ] Uncheck reveals separate shipping form
- [ ] Shipping form fields pre-populate if unchecked
- [ ] Can modify shipping address independently
- [ ] Both address types properly captured

**Expected Behavior:**
- Default to billing address for shipping
- Option to use different shipping address
- Both forms properly populated and validated

---

### 6.4 Shipping Method Selection
**Test:** Select shipping method
- [ ] Shipping methods display: Standard, Express, etc. (if available)
- [ ] Each method shows cost and delivery time
- [ ] Can select different method
- [ ] Costs update when method selected
- [ ] Grand total updates with new shipping cost
- [ ] Selected method highlighted

**Expected Behavior:**
- Shipping methods loaded from WooCommerce
- Costs accurate for items/weight
- Selection persists in checkout

---

### 6.5 Payment Method Selection
**Test:** Select payment method
- [ ] Payment options display: Credit Card, Debit Card, UPI, etc.
- [ ] Each option has clear label and logo
- [ ] Can select different payment method
- [ ] Selected method highlighted
- [ ] Payment fields appear for selected method

**Payment Methods to Verify:**
- [ ] Credit/Debit Card
- [ ] UPI (if applicable)
- [ ] Net Banking (if applicable)
- [ ] Wallet/Digital payments (if applicable)
- [ ] COD (Cash on Delivery) - if applicable

**Expected Behavior:**
- Payment methods available in India
- Methods configured in WooCommerce
- Safe, secure payment processing

---

### 6.6 Order Review
**Test:** Review order before placing
- [ ] Order summary shows all items
- [ ] Quantities correct
- [ ] Prices accurate
- [ ] Subtotal, shipping, tax all shown
- [ ] Grand total clearly displayed
- [ ] All fees/charges itemized
- [ ] Billing address displayed
- [ ] Shipping address displayed
- [ ] Payment method selected
- [ ] "Place Order" button visible

**Expected Behavior:**
- Complete order review before final submission
- User can modify details (back to checkout)
- Clear call-to-action for placing order

---

### 6.7 Place Order
**Test:** Complete order placement
- [ ] Click "Place Order" button
- [ ] Button shows loading state (spinner or "Processing...")
- [ ] Page doesn't freeze or timeout
- [ ] After 2-5 seconds: redirect to confirmation page
- [ ] No error messages
- [ ] Order ID displays
- [ ] Confirmation number shown

**Expected Behavior:**
- Order processed securely
- Payment gateway handles transaction
- Order saved to WooCommerce database
- Customer receives confirmation

**Console Check:**
- [ ] No errors during payment
- [ ] API calls to order endpoints return 200

---

## SECTION 7: ORDER CONFIRMATION

### 7.1 Confirmation Page Display
**Test:** Verify order confirmation displays
- [ ] Redirected to confirmation page after checkout
- [ ] "Order Successful" or "Thank You" message displays
- [ ] Order number/ID displayed prominently
- [ ] Date of order shown
- [ ] Total amount charged displayed
- [ ] Payment method used shown

**Expected Behavior:**
- Clear confirmation message
- All relevant order details
- Professional appearance

---

### 7.2 Confirmation Email
**Test:** Verify confirmation email sent (if configured)
- [ ] Check email (may take 5-30 seconds)
- [ ] Confirmation email received
- [ ] Email from: Whole Lot of Nature
- [ ] Subject includes order number
- [ ] Email contains:
  - [ ] Order number
  - [ ] Order date
  - [ ] Items ordered
  - [ ] Prices
  - [ ] Total
  - [ ] Shipping address
  - [ ] Tracking information (if available)
  - [ ] Customer support contact

**Expected Behavior:**
- Email sent automatically from email provider (Resend/SendGrid)
- Professional HTML template
- All relevant order info included
- Links to tracking/account work

---

### 7.3 Order Summary After Confirmation
**Test:** Review order summary on confirmation page
- [ ] Click "View Order" or similar link
- [ ] Redirected to order details page
- [ ] All items listed with quantities
- [ ] Prices and totals displayed
- [ ] Shipping and delivery info shown
- [ ] Next steps/tracking information provided

**Expected Behavior:**
- Accessible order history in user account
- Complete order details preserved
- Tracking info updated

---

## SECTION 8: USER AUTHENTICATION

### 8.1 Sign Up Process
**Test:** Create new user account
- [ ] Navigate to `/auth/signup` or click "Sign Up"
- [ ] Sign up form displays
- [ ] Fields: Email, Password, Confirm Password, Name (optional)
- [ ] Email validation: must be valid format
- [ ] Password requirements shown
- [ ] Submit button available
- [ ] Click "Sign Up"

**Expected Behavior:**
- Form validates on submit
- Strong password required (length, special chars, etc.)
- Account created in database
- User redirected to login or automatically logged in

---

### 8.2 Email Verification (if configured)
**Test:** Verify email verification process
- [ ] After sign up, message: "Check your email to verify"
- [ ] Check email for verification link
- [ ] Click verification link
- [ ] Redirected to verification success page
- [ ] Account now fully activated

**Expected Behavior:**
- Verification email sent
- Link valid for limited time (24 hours recommended)
- Account active after verification

---

### 8.3 Login Process
**Test:** Login with credentials
- [ ] Navigate to `/auth/signin` or click "Sign In"
- [ ] Login form displays: Email and Password fields
- [ ] Enter correct email and password
- [ ] Click "Sign In"
- [ ] Authenticated successfully
- [ ] Redirected to dashboard or account page
- [ ] Session created (cookie/token)

**Expected Behavior:**
- Credentials validated against database
- Session started upon successful login
- Redirect to intended page or dashboard

---

### 8.4 Logout
**Test:** Logout from account
- [ ] Click user profile/account menu
- [ ] Click "Logout" or "Sign Out"
- [ ] Session terminated
- [ ] Redirected to homepage
- [ ] Cannot access protected pages without login

**Expected Behavior:**
- Session cookie cleared
- Local cache cleared
- Must log in again to access account

---

### 8.5 Password Reset
**Test:** Test password recovery
- [ ] Navigate to login page
- [ ] Click "Forgot Password" link
- [ ] Enter email address
- [ ] Click "Send Reset Link"
- [ ] Check email for reset link
- [ ] Click reset link in email
- [ ] Redirected to password reset form
- [ ] Enter new password twice
- [ ] Submit new password
- [ ] Password updated successfully
- [ ] Login with new password

**Expected Behavior:**
- Reset email sent with secure link
- Link expires after set time
- New password accepted and stored securely
- Can login with new password

---

## SECTION 9: USER ACCOUNT & ORDER HISTORY

### 9.1 Account Dashboard
**Test:** Access user account dashboard
- [ ] Login to account
- [ ] Navigate to account page or /account
- [ ] Dashboard displays user information
- [ ] User profile shows: Name, Email, Phone, Address
- [ ] Profile information is accurate
- [ ] Can view past orders

**Expected Behavior:**
- Account data loaded from database
- Secure page (requires authentication)
- User can view/edit personal info

---

### 9.2 Order History
**Test:** View past orders
- [ ] On account dashboard, find "Order History" section
- [ ] Past orders listed with:
  - [ ] Order number
  - [ ] Order date
  - [ ] Order total
  - [ ] Order status (Pending, Processing, Shipped, Delivered)
  - [ ] Quick action buttons (Track, View Details, Reorder)
- [ ] Can click order to view details

**Expected Behavior:**
- Orders loaded from WooCommerce
- Sorted by most recent first
- All order details preserved

---

### 9.3 Order Tracking
**Test:** Track specific order
- [ ] Click "Track Order" on an order
- [ ] Tracking page loads
- [ ] Current status displayed
- [ ] Timeline shows order progression:
  - [ ] Order Placed
  - [ ] Payment Confirmed
  - [ ] Processing
  - [ ] Shipped
  - [ ] Out for Delivery
  - [ ] Delivered
- [ ] Tracking number displayed (if applicable)
- [ ] Estimated delivery date shown

**Expected Behavior:**
- Status accurately reflects order state
- Timeline shows all milestones
- Updates reflect WooCommerce order status

---

### 9.4 Invoice Download
**Test:** Download order invoice
- [ ] View order details
- [ ] Find "Download Invoice" or "PDF" button
- [ ] Click to download
- [ ] PDF downloads to computer
- [ ] PDF contains:
  - [ ] Invoice/Order number
  - [ ] Date
  - [ ] Customer details
  - [ ] Billing address
  - [ ] Shipping address
  - [ ] All items with prices
  - [ ] Subtotal, Shipping, Tax, Total
  - [ ] Business details/logo

**Expected Behavior:**
- PDF generation works
- All required information included
- Professional formatting
- File naming: invoice-[order-number].pdf

---

## FINAL NOTES

### Test Execution Tips
1. Test each section sequentially
2. Document any failures with screenshots
3. Check console after each action
4. Note performance issues (slow pages, delays)
5. Test on multiple devices if possible

### Performance Baselines
- Page load time: < 3 seconds
- Add to cart response: < 1 second
- Checkout page load: < 3 seconds
- Search results: < 2 seconds

### Critical Path (Minimum Testing)
If time is limited, test this critical path:
1. Shop page loads & displays products
2. Add product to cart
3. Cart persists on refresh
4. Checkout page loads
5. Place order completes
6. Confirmation received
7. User can login and see order history

### Sign-Off
- [ ] All critical tests passed
- [ ] No blocking issues found
- [ ] Site ready for launch
- [ ] Date completed: _______________
- [ ] Tester name: _______________

---

*Detailed Testing Checklist - Phase 1*  
*Last Updated: November 25, 2025*
