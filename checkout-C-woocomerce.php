<?php
/*

    Plugin Name: C Checkout  Woocomerce
    Description: Add checkout form to woocomerce product page
    Version: 1.0
    Author: Chakib
    Author URI: https://www.linkedin.com/in/chakib-ammar-aouchiche-a25150220/
    License: GPL-2.0+
    License URI: http://www.gnu.org/licenses/gpl-2.0.txt
*/

if (!defined('ABSPATH')) {
    exit;
}

function is_woocommerce_active()
{
    return in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins')));
}

function woocommerce_inactive_notice()
{
    ?>
    <div id="message" class="error">
        <p>

            <?php
            deactivate_plugins(plugin_basename(__FILE__));
            print_r(__('<b>WooCommerce</b> plugin must be active for <b>C Checkout woocommerce</b> to work. '));
            if (isset($_GET['activate'])) {
                unset($_GET['activate']);
            }
            ?>
        </p>
    </div>
    <?php
}

if (!is_woocommerce_active()) {
    add_action('admin_notices', 'woocommerce_inactive_notice');

    return;
}

function my_enqueue_scripts()
{
    wp_enqueue_script('my-main-script', plugins_url('/js/main-script.js', __FILE__), array('jquery'), '1.0.0', true);
    wp_localize_script('my-main-script', 'php_data', array('ajax_url' => admin_url('admin-ajax.php')));

    cart_page_init();

}
add_action('wp_enqueue_scripts', 'my_enqueue_scripts');

//Function to use in cart page
function cart_page_init()
{
    if (is_cart()) {

        redirect_to_previous_page();

    }
}

function redirect_to_previous_page()
{

    // Get the URL of the previous page
    $referer = wp_get_referer();

    // Check if the referer is a valid URL
    if (!empty($referer)) {
        // Redirect to the previous page
        wp_redirect($referer);
        exit;
    } else {
        // If no referer is available, redirect to the home page
        wp_redirect(home_url());
        exit;
    }
}

// Add to cart function
add_action('wp_ajax_custom_add_to_cart_variation_product', 'custom_add_to_cart_variation_product');
add_action('wp_ajax_nopriv_custom_add_to_cart_variation_product', 'custom_add_to_cart_variation_product');


function custom_add_to_cart_variation_product()
{

    $variationId = $_POST['variationId'];
    $productId = $_POST['productId'];
    $attributes = $_POST['attributes'];
    $qte = $_POST['qte'];

    WC()->cart->empty_cart();

    WC()->cart->add_to_cart(
        product_id: $productId,
        quantity: intval($qte),
        variation_id: $variationId,
        variation: $attributes
    );


    echo do_shortcode('[woocommerce_checkout]');

    wp_die();
}


function custom_add_to_cart_product($productId, $qte)
{
    WC()->cart->add_to_cart(
        product_id: $productId,
        quantity: intval($qte),

    );
}



// FORM
// Add woocommerce form to product page
function custom_replace_add_to_cart_button()
{
    echo "<div id='checkout-form-c'> </div> ";
}
add_action('woocommerce_after_single_product_summary', 'custom_replace_add_to_cart_button');

// Custom woocommerce form
function custom_modify_checkout_fields($fields)
{
    // Remove the "Company Name" field
    if (isset($fields['billing']['billing_company'])) {
        unset($fields['billing']['billing_company']);
    }

    // Remove the "Ship to a different address" checkbox
    if (isset($fields['billing']['billing_address_2'])) {
        unset($fields['billing']['billing_address_2']);
    }

    // Remove the "Comments" field
    if (isset($fields['order']['order_comments'])) {
        unset($fields['order']['order_comments']);
    }

    return $fields;
}
add_filter('woocommerce_checkout_fields', 'custom_modify_checkout_fields');

// remove add differenet addrest
add_filter('woocommerce_cart_needs_shipping_address', '__return_false');

//remove coupon form
add_filter('woocommerce_checkout_coupon_form', 'woocommerce_checkout_coupon_form_func');
function woocommerce_checkout_coupon_form_func()
{
    return null;
}

// Hide add to cart from shop page 
function remove_add_to_cart_button($button_html, $product)
{
    return null;
}


add_filter('woocommerce_loop_add_to_cart_link', 'remove_add_to_cart_button', 100, 2);


function remove_add_to_cart_button_product($is_purchasable, $product)
{
    return false;
}