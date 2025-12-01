<?php
/**
 * WordPress CORS Configuration for Headless Setup
 * 
 * INSTALLATION INSTRUCTIONS:
 * ==========================
 * 
 * Option 1: Add to functions.php (Recommended)
 * --------------------------------------------
 * 1. Login to WordPress admin (admin.wholelotofnature.com/wp-admin)
 * 2. Go to Appearance > Theme Editor (or Theme File Editor)
 * 3. Select your active theme's functions.php
 * 4. Add the code below at the end of the file
 * 5. Click "Update File"
 * 
 * Option 2: Create a Must-Use Plugin (More Reliable)
 * --------------------------------------------------
 * 1. Connect to Hostinger via File Manager or FTP
 * 2. Navigate to: public_html/admin/wp-content/mu-plugins/
 *    (Create the mu-plugins folder if it doesn't exist)
 * 3. Upload this file as: cors-headers.php
 * 4. It will be automatically activated
 * 
 * ==============================================
 * COPY EVERYTHING BELOW THIS LINE
 * ==============================================
 */

// Define allowed origins for CORS
function get_allowed_origins() {
    return array(
        'https://wholelotofnature.com',
        'https://www.wholelotofnature.com',
        'https://whole-lot-of-nature.vercel.app',  // Your Vercel preview URL
        'http://localhost:3000',  // Local development
        'http://localhost:3001',
    );
}

// Add CORS headers to REST API responses
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($served, $result, $request, $server) {
        $origin = get_http_origin();
        $allowed_origins = get_allowed_origins();
        
        // Allow if origin is in our allowed list or if it's a Vercel preview
        if (in_array($origin, $allowed_origins) || strpos($origin, 'vercel.app') !== false) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        } else {
            // Allow all origins in production (you can restrict this)
            header('Access-Control-Allow-Origin: *');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        
        return $served;
    }, 10, 4);
}, 15);

// Handle preflight OPTIONS requests
add_action('init', function() {
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        $origin = get_http_origin();
        $allowed_origins = get_allowed_origins();
        
        if (in_array($origin, $allowed_origins) || strpos($origin, 'vercel.app') !== false) {
            header('Access-Control-Allow-Origin: ' . esc_url_raw($origin));
        } else {
            header('Access-Control-Allow-Origin: *');
        }
        
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Requested-With, X-WP-Nonce');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');
        header('Content-Type: text/plain');
        exit(0);
    }
});

// Also add headers to WooCommerce API
add_filter('woocommerce_rest_check_permissions', function($permission, $context, $object_id, $post_type) {
    return $permission;
}, 10, 4);

// Ensure JSON responses have proper CORS headers
add_filter('wp_headers', function($headers) {
    $origin = get_http_origin();
    $allowed_origins = get_allowed_origins();
    
    if (in_array($origin, $allowed_origins) || strpos($origin, 'vercel.app') !== false) {
        $headers['Access-Control-Allow-Origin'] = $origin;
    }
    
    return $headers;
});

// Allow credentials for authenticated requests
add_filter('allowed_http_origins', function($origins) {
    return array_merge($origins, get_allowed_origins());
});
