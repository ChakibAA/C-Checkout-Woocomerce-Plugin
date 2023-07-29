// Hide cart
jQuery("[id=site-header-cart]").remove();

//remove add to cart in shop page
jQuery('a[href*="?add-to-cart"]').remove();

// remove add to cart in single product page
jQuery("button[name=add-to-cart][type=submit]").hide();


//remove quantity counter one click in clear in product var page
jQuery("a[class=reset_variations]").click(function () {
    jQuery("div[class=quantity]").hide()
});

//Check if var product 
if (jQuery("input[name=variation_id]").val() || jQuery("input[name=variation_id]").val() == ''
) {
    // remove add to cart in var product page
    jQuery("button[class*=single_add_to_cart_button][type=submit]").remove();

    //Hide quantity counter
    jQuery("div[class=quantity]").hide();
} else {

    // single product page

    // Get productID
    productId = jQuery("button[name=add-to-cart]").val()

    // add to cart product when page init
    add_to_cart({
        productId: productId,
        qte: 1
    })
}

// Get product variation
jQuery("input[name=variation_id]").on("change", (e) => {

    variationId = e.target.value
    if (!variationId || variationId == ''
    ) {
        // remove add to cart in var product page
        jQuery("button[class*=single_add_to_cart_button][type=submit]").remove();

        //Hide quantity counter 
        jQuery("div[class=quantity]").hide();
    }


    productId = jQuery("input[name=product_id]")[0].value
    qte = 1

    if (variationId) {

        jQuery("div[class=quantity]").show();

        attributes = {}

        jQuery(".variations  select").each((index, attribute) => {
            attributes[attribute.name] = attribute.value
        })


        add_to_cart({
            productId: productId,
            variationId: variationId,
            attributes: attributes,
            qte: qte
        })


    }

})



jQuery("input[name=quantity]").on("change", (qte_element) => {

    qte = qte_element['currentTarget']['valueAsNumber']
    variationId = jQuery("input[name=variation_id]").val()

    attributes = {}

    if (variationId) {

        productId = jQuery("input[name=product_id]")[0].value

        jQuery(".variations  select").each((index, attribute) => {
            attributes[attribute.name] = attribute.value
        })

        add_to_cart({
            productId: productId,
            variationId: variationId,
            attributes: attributes,
            qte: qte
        })
    } else {
        productId = jQuery("button[name=add-to-cart]").val()
        add_to_cart({
            productId: productId,
            qte: qte
        })

    }

})

function show_checkout_form(response) {
    jQuery('#checkout-form-c').html(response);
}

function add_to_cart({ productId, variationId, attributes, qte }) {
    jQuery.ajax({
        url: php_data.ajax_url,
        type: 'POST',
        data: {
            action: 'custom_add_to_cart_variation_product',
            productId: productId,
            variationId: variationId,
            attributes: attributes,
            qte: qte
        },
        success: function (response) {
            show_checkout_form(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}