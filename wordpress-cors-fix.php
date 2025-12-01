<?php
/**
 * Plugin Name: CORS Fix for Headless WordPress
 * Description: Enables CORS for the WordPress REST API to allow Next.js frontend requests
 * Version: 1.0
 * Author: Whole Lot of Nature
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Add CORS headers to REST API responses
 */
function wln_add_cors_headers() {
    // Allow requests from your Vercel domain and localhost for development
    $allowed_origins = array(
        'https://wholelotofnature.com',
        'https://www.wholelotofnature.com',
        'http://localhost:3000',
        'https://whole-lot-of-nature.vercel.app', // Your Vercel preview URL
    );
    
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    if (in_array($origin, $allowed_origins) || strpos($origin, '.vercel.app') !== false) {
        header("Access-Control-Allow-Origin: $origin");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
        header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-WP-Nonce");
        header("Access-Control-Allow-Credentials: true");
        header("Access-Control-Max-Age: 86400");
    }
    
    // Handle preflight OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}

// Add CORS headers on init
add_action('init', 'wln_add_cors_headers');

// Also add to REST API init
add_action('rest_api_init', function() {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function($value) {
        wln_add_cors_headers();
        return $value;
    });
}, 15);

/**
 * Enable REST API for all users (including non-authenticated)
 */
add_filter('rest_authentication_errors', function($result) {
    // If there's already an error, return it
    if (is_wp_error($result)) {
        return $result;
    }
    
    // Allow unauthenticated access to public endpoints
    return $result;
});

/**
 * Ensure WooCommerce REST API is accessible
 */
add_filter('woocommerce_rest_check_permissions', function($permission, $context, $object_id, $post_type) {
    // Allow read access to products and categories without authentication
    if ($context === 'read') {
        return true;
    }
    return $permission;
}, 10, 4);
