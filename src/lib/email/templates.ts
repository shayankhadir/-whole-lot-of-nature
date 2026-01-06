/**
 * Email Marketing Templates
 * Beautiful, branded email templates for automated campaigns
 */

export interface EmailTemplateData {
  customerName?: string;
  productName?: string;
  productImage?: string;
  productPrice?: number;
  productUrl?: string;
  orderNumber?: string;
  orderTotal?: number;
  cartItems?: Array<{
    name: string;
    price: number;
    quantity: number;
    image?: string;
    url?: string;
  }>;
  discountCode?: string;
  discountPercent?: number;
  trackingUrl?: string;
  unsubscribeUrl?: string;
}

const baseStyles = `
  body { margin: 0; padding: 0; background: #f4f8f4; font-family: 'Segoe UI', Arial, sans-serif; color: #1f2933; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
  .header { background: linear-gradient(135deg, #065f46, #10b981); padding: 32px; text-align: center; }
  .header h1 { margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; }
  .header p { margin: 8px 0 0; color: #d1fae5; font-size: 16px; }
  .logo { width: 60px; height: 60px; margin-bottom: 16px; }
  .content { padding: 32px; }
  .content p { line-height: 1.7; color: #374151; font-size: 16px; }
  .button { display: inline-block; padding: 14px 32px; background: #10b981; color: #ffffff !important; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; margin: 24px 0; }
  .button:hover { background: #059669; }
  .product-card { border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px; margin: 16px 0; display: flex; gap: 16px; }
  .product-image { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; }
  .product-info { flex: 1; }
  .product-name { font-weight: 600; color: #1f2933; margin: 0 0 4px; }
  .product-price { color: #10b981; font-weight: 600; }
  .footer { background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb; }
  .footer p { color: #6b7280; font-size: 14px; margin: 4px 0; }
  .footer a { color: #10b981; text-decoration: none; }
  .highlight-box { background: linear-gradient(135deg, #ecfdf5, #d1fae5); border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center; }
  .discount-code { background: #065f46; color: #ffffff; padding: 12px 24px; border-radius: 8px; font-family: monospace; font-size: 20px; font-weight: 700; letter-spacing: 2px; display: inline-block; }
`;

const wrapTemplate = (content: string, preheader?: string): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <style>${baseStyles}</style>
</head>
<body>
  ${preheader ? `<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>` : ''}
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 16px;">
    <tr><td align="center">
      <div class="container">
        ${content}
      </div>
    </td></tr>
  </table>
</body>
</html>
`;

/**
 * Welcome Email - Sent when someone signs up
 */
export function welcomeEmail(data: EmailTemplateData): { subject: string; html: string } {
  const name = data.customerName || 'Plant Lover';
  
  const content = `
    <div class="header">
      <img src="https://wholelotofnature.com/logo.png" alt="Whole Lot of Nature" class="logo">
      <h1>Welcome to the Family! 🌿</h1>
      <p>Your green journey starts here</p>
    </div>
    <div class="content">
      <p>Hey ${name}!</p>
      <p>Welcome to <strong>Whole Lot of Nature</strong> – your new home for premium plants, soil mixes, and everything green! We're thrilled to have you join our community of plant lovers.</p>
      
      <div class="highlight-box">
        <p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#065f46;">Here's a special gift for you! 🎁</p>
        <div class="discount-code">${data.discountCode || 'WELCOME10'}</div>
        <p style="margin:12px 0 0;color:#065f46;">Use this code for <strong>10% OFF</strong> your first order</p>
      </div>
      
      <p>Here's what you can look forward to:</p>
      <ul style="color:#374151;line-height:2;">
        <li>🌱 Hand-picked, healthy plants delivered to your door</li>
        <li>🪴 Expert tips and care guides for every plant</li>
        <li>🌿 Exclusive offers and early access to new arrivals</li>
        <li>💚 A community that shares your passion for plants</li>
      </ul>
      
      <div style="text-align:center;">
        <a href="https://wholelotofnature.com/shop" class="button">Start Shopping →</a>
      </div>
      
      <p>Have questions? Just reply to this email – our plant experts are always happy to help!</p>
      <p style="color:#065f46;font-weight:600;">Happy Planting! 🌿</p>
      <p>— The Whole Lot of Nature Team</p>
    </div>
    <div class="footer">
      <p>Whole Lot of Nature | Bangalore, India</p>
      <p><a href="https://wholelotofnature.com">wholelotofnature.com</a></p>
      ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
    </div>
  `;
  
  return {
    subject: `Welcome to Whole Lot of Nature, ${name}! 🌿 Here's 10% OFF`,
    html: wrapTemplate(content, `Welcome ${name}! Here's your special 10% discount code for your first order.`)
  };
}

/**
 * Abandoned Cart Email - Sent when user leaves items in cart
 */
export function abandonedCartEmail(data: EmailTemplateData): { subject: string; html: string } {
  const name = data.customerName || 'there';
  const items = data.cartItems || [];
  const cartTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const itemsHtml = items.map(item => `
    <div class="product-card">
      ${item.image ? `<img src="${item.image}" alt="${item.name}" class="product-image">` : ''}
      <div class="product-info">
        <p class="product-name">${item.name}</p>
        <p class="product-price">₹${item.price.toLocaleString()} × ${item.quantity}</p>
      </div>
    </div>
  `).join('');
  
  const content = `
    <div class="header">
      <h1>You Left Something Behind! 🛒</h1>
      <p>Your plants are waiting for you</p>
    </div>
    <div class="content">
      <p>Hey ${name}!</p>
      <p>We noticed you left some amazing plants in your cart. They're still here, waiting to find a home! 🌿</p>
      
      <div style="margin:24px 0;">
        <h3 style="color:#065f46;margin-bottom:16px;">Your Cart Items:</h3>
        ${itemsHtml}
        <div style="text-align:right;padding-top:16px;border-top:2px solid #e5e7eb;margin-top:16px;">
          <p style="font-size:18px;margin:0;"><strong>Cart Total: ₹${cartTotal.toLocaleString()}</strong></p>
        </div>
      </div>
      
      ${data.discountCode ? `
      <div class="highlight-box">
        <p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#065f46;">Complete your order now & save!</p>
        <div class="discount-code">${data.discountCode}</div>
        <p style="margin:12px 0 0;color:#065f46;">Use this code for <strong>${data.discountPercent || 10}% OFF</strong></p>
      </div>
      ` : ''}
      
      <div style="text-align:center;">
        <a href="https://wholelotofnature.com/cart" class="button">Complete My Order →</a>
      </div>
      
      <p style="color:#6b7280;font-size:14px;">This cart will be saved for 7 days. After that, items may no longer be available.</p>
    </div>
    <div class="footer">
      <p>Whole Lot of Nature | Bangalore, India</p>
      <p><a href="https://wholelotofnature.com">wholelotofnature.com</a></p>
      ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
    </div>
  `;
  
  return {
    subject: `${name}, your cart is waiting! 🛒 Complete your order now`,
    html: wrapTemplate(content, `Your plants are still in your cart! Complete your order before they're gone.`)
  };
}

/**
 * Order Confirmation Email
 */
export function orderConfirmationEmail(data: EmailTemplateData): { subject: string; html: string } {
  const name = data.customerName || 'Valued Customer';
  const items = data.cartItems || [];
  
  const itemsHtml = items.map(item => `
    <div class="product-card">
      ${item.image ? `<img src="${item.image}" alt="${item.name}" class="product-image">` : ''}
      <div class="product-info">
        <p class="product-name">${item.name}</p>
        <p class="product-price">₹${item.price.toLocaleString()} × ${item.quantity}</p>
      </div>
    </div>
  `).join('');
  
  const content = `
    <div class="header">
      <h1>Order Confirmed! 🎉</h1>
      <p>Thank you for your order</p>
    </div>
    <div class="content">
      <p>Hey ${name}!</p>
      <p>Great news – your order has been confirmed and is being prepared with care! 🌿</p>
      
      <div class="highlight-box">
        <p style="margin:0;font-size:14px;color:#065f46;">Order Number</p>
        <p style="margin:8px 0 0;font-size:24px;font-weight:700;color:#065f46;">#${data.orderNumber}</p>
      </div>
      
      <div style="margin:24px 0;">
        <h3 style="color:#065f46;margin-bottom:16px;">Order Summary:</h3>
        ${itemsHtml}
        <div style="text-align:right;padding-top:16px;border-top:2px solid #e5e7eb;margin-top:16px;">
          <p style="font-size:18px;margin:0;"><strong>Order Total: ₹${data.orderTotal?.toLocaleString() || '0'}</strong></p>
        </div>
      </div>
      
      <h3 style="color:#065f46;">What's Next?</h3>
      <ol style="color:#374151;line-height:2;">
        <li>📦 We'll carefully pack your plants with love</li>
        <li>🚚 You'll receive a shipping notification with tracking</li>
        <li>🌱 Unbox, repot, and enjoy your new green friends!</li>
      </ol>
      
      ${data.trackingUrl ? `
      <div style="text-align:center;">
        <a href="${data.trackingUrl}" class="button">Track My Order →</a>
      </div>
      ` : ''}
      
      <p>Questions about your order? Just reply to this email!</p>
    </div>
    <div class="footer">
      <p>Whole Lot of Nature | Bangalore, India</p>
      <p><a href="https://wholelotofnature.com">wholelotofnature.com</a></p>
    </div>
  `;
  
  return {
    subject: `Order Confirmed! 🎉 #${data.orderNumber}`,
    html: wrapTemplate(content, `Your order #${data.orderNumber} has been confirmed! We're preparing your plants with care.`)
  };
}

/**
 * Shipping Notification Email
 */
export function shippingNotificationEmail(data: EmailTemplateData): { subject: string; html: string } {
  const name = data.customerName || 'Valued Customer';
  
  const content = `
    <div class="header">
      <h1>Your Order is On Its Way! 🚚</h1>
      <p>Track your delivery</p>
    </div>
    <div class="content">
      <p>Hey ${name}!</p>
      <p>Exciting news – your plants have been shipped and are on their way to you! 🌿</p>
      
      <div class="highlight-box">
        <p style="margin:0;font-size:14px;color:#065f46;">Order Number</p>
        <p style="margin:8px 0;font-size:24px;font-weight:700;color:#065f46;">#${data.orderNumber}</p>
        <p style="margin:0;font-size:14px;color:#059669;">Estimated Delivery: 2-4 business days</p>
      </div>
      
      <div style="text-align:center;">
        <a href="${data.trackingUrl || 'https://wholelotofnature.com/track-order'}" class="button">Track My Package →</a>
      </div>
      
      <h3 style="color:#065f46;">📦 Unboxing Tips:</h3>
      <ul style="color:#374151;line-height:2;">
        <li>Open your package within 24 hours of delivery</li>
        <li>Remove plants carefully from their protective packaging</li>
        <li>Water lightly if soil feels dry</li>
        <li>Place in indirect light for 2-3 days before moving to final spot</li>
      </ul>
      
      <p>Questions? Just reply to this email!</p>
    </div>
    <div class="footer">
      <p>Whole Lot of Nature | Bangalore, India</p>
      <p><a href="https://wholelotofnature.com">wholelotofnature.com</a></p>
    </div>
  `;
  
  return {
    subject: `Your order is on its way! 🚚 #${data.orderNumber}`,
    html: wrapTemplate(content, `Your plants have been shipped! Track your delivery and get ready to welcome your new green friends.`)
  };
}

/**
 * Review Request Email - Sent after delivery
 */
export function reviewRequestEmail(data: EmailTemplateData): { subject: string; html: string } {
  const name = data.customerName || 'there';
  
  const content = `
    <div class="header">
      <h1>How Are Your Plants Doing? 🌱</h1>
      <p>We'd love to hear from you</p>
    </div>
    <div class="content">
      <p>Hey ${name}!</p>
      <p>It's been a few days since your plants arrived, and we hope they're settling in nicely! 🌿</p>
      <p>We'd love to know how you're finding them. Your feedback helps us grow (pun intended!) and helps other plant lovers discover their perfect green companions.</p>
      
      <div style="text-align:center;">
        <a href="${data.productUrl || 'https://wholelotofnature.com/shop'}" class="button">Leave a Review ⭐</a>
      </div>
      
      <div class="highlight-box">
        <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#065f46;">Share a photo of your plant!</p>
        <p style="margin:0;color:#059669;font-size:14px;">Tag us @wholelotofnature on Instagram and we might feature you! 📸</p>
      </div>
      
      <p>Need plant care help? Our experts are just an email away!</p>
      <p style="color:#065f46;font-weight:600;">Happy Growing! 🌿</p>
    </div>
    <div class="footer">
      <p>Whole Lot of Nature | Bangalore, India</p>
      <p><a href="https://wholelotofnature.com">wholelotofnature.com</a></p>
      ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
    </div>
  `;
  
  return {
    subject: `${name}, how are your plants doing? 🌱`,
    html: wrapTemplate(content, `We hope your plants are thriving! Share your experience and help other plant lovers.`)
  };
}

/**
 * Re-engagement Email - For inactive customers
 */
export function reEngagementEmail(data: EmailTemplateData): { subject: string; html: string } {
  const name = data.customerName || 'Friend';
  
  const content = `
    <div class="header">
      <h1>We Miss You! 💚</h1>
      <p>It's been a while</p>
    </div>
    <div class="content">
      <p>Hey ${name}!</p>
      <p>It's been a while since we last saw you, and we miss having you around! 🌿</p>
      <p>A lot has happened since you last visited – we've added new plants, exciting products, and fresh plant care tips!</p>
      
      ${data.discountCode ? `
      <div class="highlight-box">
        <p style="margin:0 0 12px;font-size:18px;font-weight:600;color:#065f46;">Here's a special comeback gift! 🎁</p>
        <div class="discount-code">${data.discountCode}</div>
        <p style="margin:12px 0 0;color:#065f46;">Use this code for <strong>${data.discountPercent || 15}% OFF</strong> your next order</p>
      </div>
      ` : ''}
      
      <div style="text-align:center;">
        <a href="https://wholelotofnature.com/shop" class="button">See What's New →</a>
      </div>
      
      <p>We'd love to help you grow your plant family again!</p>
      <p style="color:#065f46;font-weight:600;">— The Whole Lot of Nature Team</p>
    </div>
    <div class="footer">
      <p>Whole Lot of Nature | Bangalore, India</p>
      <p><a href="https://wholelotofnature.com">wholelotofnature.com</a></p>
      ${data.unsubscribeUrl ? `<p><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>` : ''}
    </div>
  `;
  
  return {
    subject: `We miss you, ${name}! 💚 Here's ${data.discountPercent || 15}% OFF`,
    html: wrapTemplate(content, `It's been a while! Come back and see what's new with a special discount.`)
  };
}
