// Hide cart
jQuery("[id=site-header-cart]").remove();

//remove add to cart in shop page
jQuery('a[href*="?add-to-cart"]').remove();


// Get product id
productId = jQuery("input[name=product_id]").val()


// Check if product is var or not
prouct_is_var = jQuery("input[name=product_var]").val()

//Check if not var product 
if (prouct_is_var != 1
) {

    // add to cart product when page init
    add_to_cart({
        productId: productId,
        qte: 1
    })
}

// Get product variation
jQuery("[class=variations]").on("change", (e) => {

    console.log('hello')


    variationId = jQuery("form[class*=variations_form]").html('data-product_variations')
    console.log(variationId)

    // jQuery(".variations  select").each((index, attribute) => {
    //     attributes[attribute.name] = attribute.value
    // })

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

    if (prouct_is_var == 1) {

        ;

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
        ;
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