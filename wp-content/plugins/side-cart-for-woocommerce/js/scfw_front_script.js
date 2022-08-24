function wfcUpdateRefreshFragments(response) {

    if (response.fragments) {

        //Set fragments
        jQuery.each(response.fragments, function(key, value) {
            jQuery(key).replaceWith(value);
        });

        if (('sessionStorage' in window && window.sessionStorage !== null)) {

            sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(response.fragments));
            localStorage.setItem(wc_cart_fragments_params.cart_hash_key, response.cart_hash);
            sessionStorage.setItem(wc_cart_fragments_params.cart_hash_key, response.cart_hash);

            if (response.cart_hash) {
                sessionStorage.setItem('wc_cart_created', (new Date()).getTime());
            }
        }

        jQuery(document.body).trigger('wc_fragments_refreshed');
    }
}


function wfcGetRefreshedFragments() {

    jQuery.ajax({
        url: ajax_postajax.ajaxurl,
        type: 'POST',
        data: {
            action: 'wfc_get_refresh_fragments',
        },
        success: function(response) {
            wfcUpdateRefreshFragments(response);
        }
    })

}


jQuery(document).ready(function() {
    jQuery(document.body).trigger('wc_fragment_refresh');

    setTimeout(function() {
        wfcGetRefreshedFragments();
    }, 100);

    scfw_sidecart_width = scfw_sidebar_width.scfw_width;

    jQuery('body').on('added_to_cart', function() {
        jQuery(".wfc_container").css("opacity", "1");
        jQuery(".wfc_container").animate({
            width: scfw_sidecart_width,
            right: '0px'
        });
        jQuery("body").addClass("scfw_overlay");
        jQuery(".wfc_container_overlay").addClass('active');
    });

    jQuery(".wfc_close_cart").click(function() {
        var boxWidth = jQuery(".wfc_container").width();
        jQuery(".wfc_container").animate({
            right: '-' + scfw_sidecart_width
        });
        jQuery("body").removeClass("scfw_overlay");
        jQuery(".wfc_container_overlay").removeClass('active');
    });

    jQuery(".wfc_container_overlay").click(function() {
        jQuery(".wfc_close_cart").click();
    });

    jQuery(".wfc_cart_basket").click(function() {
        jQuery(".wfc_container").css("opacity", "1");
        jQuery(".wfc_container").animate({
            width: scfw_sidecart_width,
            right: '0px'
        });
        jQuery("body").addClass("scfw_overlay");
        jQuery(".wfc_container_overlay").addClass('active');
    });

    jQuery('body').on('click', '#wfc_apply_coupon', function() {
        jQuery(".wfc_apply_coupon_link").css("display", "none");
        jQuery(".wfc_coupon_field").css("display", "block");
        return false;
    });

    jQuery('body').on('click', '.wfc_coupon_submit', function() {

        var couponCode = jQuery("#wfc_coupon_code").val();

        jQuery.ajax({
            url: ajax_postajax.ajaxurl,
            type: 'POST',
            data: 'action=coupon_ajax_call&coupon_code=' + couponCode,
            success: function(response) {
                jQuery("#wfc_cpn_resp").html(response.message);
                if (response.result == 'not valid' || response.result == 'already applied') {
                    jQuery("#wfc_cpn_resp").css('background-color', '#e2401c');
                } else {
                    jQuery("#wfc_cpn_resp").css('background-color', '#0f834d');
                }
                jQuery(".wfc_coupon_response").fadeIn().delay(2000).fadeOut();
                jQuery(document.body).trigger('wc_fragment_refresh');
            }
        });
    });

    jQuery('body').on('click', '.wfc_remove_cpn', function() {

        var removeCoupon = jQuery(this).attr('cpcode');

        jQuery.ajax({
            url: ajax_postajax.ajaxurl,
            type: 'POST',
            data: 'action=remove_applied_coupon_ajax_call&remove_code=' + removeCoupon,
            success: function(response) {
                jQuery("#wfc_cpn_resp").html(response);
                jQuery(".wfc_coupon_response").fadeIn().delay(2000).fadeOut();
                jQuery(document.body).trigger('wc_fragment_refresh');
            }
        });

    });

    jQuery('body').on('change', 'input[name="update_qty"]', function() {
        var pro_id = jQuery(this).closest('.wfc_cart_prods').attr('product_id');
        var qty = jQuery(this).val();
        var c_key = jQuery(this).closest('.wfc_cart_prods').attr('c_key');
        var pro_ida = jQuery(this);
        pro_ida.prop('disabled', true);

        jQuery.ajax({
            url: ajax_postajax.ajaxurl,
            type: 'POST',
            data: 'action=change_qty&c_key=' + c_key + '&qty=' + qty,
            success: function(response) {
                pro_ida.prop('disabled', false);
                jQuery(document.body).trigger('wc_fragment_refresh');
            }
        });
    });


    var leftArrow = scfw_urls.pluginsUrl + '/images/left-arrow.svg';
    var rightArrow = scfw_urls.pluginsUrl + '/images/right-arrow.svg';

    jQuery('.wfc_slider_inn').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        navText: ["<img src='" + leftArrow + "'>", "<img src='" + rightArrow + "'>"],
        navClass: ['owl-prev', 'owl-next'],
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })


    jQuery('body').on('click', 'button.wfc_plus, button.wfc_minus', function() {

        jQuery('.wfc_body').addClass('wfc_loader');
        // Get current quantity values
        var qty = jQuery(this).closest('.wfc_cart_prods').find('.wfc_update_qty');
        var val = parseFloat(qty.val());
        var max = 100000000000000;
        var min = 1;
        var step = 1;

        // Change the value if plus or minus
        if (jQuery(this).is('.wfc_plus')) {
            if (max && (max <= val)) {
                qty.val(max);
            } else {
                qty.val(val + step);
            }
        } else {
            if (min && (min >= val)) {
                qty.val(min);
            } else if (val > 1) {
                qty.val(val - step);
            }
        }

        var updateQty = jQuery(this).closest('.wfc_cart_prods').find('.wfc_update_qty');
        var updateVal = parseFloat(updateQty.val());
        var pro_id = jQuery(this).closest('.wfc_cart_prods').attr('product_id');
        var c_key = jQuery(this).closest('.wfc_cart_prods').attr('c_key');
        var pro_ida = jQuery(this);
        pro_ida.prop('disabled', true);

        jQuery.ajax({
            url: ajax_postajax.ajaxurl,
            type: 'POST',
            data: 'action=change_qty&c_key=' + c_key + '&qty=' + updateVal,
            success: function(response) {
                pro_ida.prop('disabled', false);
                jQuery(document.body).trigger('wc_fragment_refresh');
                jQuery('.wfc_body').addClass('wfc_loader');
            }
        });
    });
})


jQuery(document).on('click', '.wfc_body a.wfc_remove', function(e) {
    e.preventDefault();

    jQuery('.wfc_body').addClass('wfc_loader');

    var product_id = jQuery(this).attr("data-product_id"),
        cart_item_key = jQuery(this).attr("data-cart_item_key"),
        product_container = jQuery(this).parents('.wfc_body');

    jQuery.ajax({
        type: 'POST',
        dataType: 'json',
        url: ajax_postajax.ajaxurl,
        data: {
            action: "product_remove",
            product_id: product_id,
            cart_item_key: cart_item_key
        },
        success: function(response) {

            if (!response || response.error)
                return;

            var fragments = response.fragments;

            // Replace fragments
            if (fragments) {
                jQuery.each(fragments, function(key, value) {
                    jQuery(key).replaceWith(value);
                });
            }

            jQuery('.wfc_body').removeClass('wfc_loader');
        }
    });
});


jQuery(document).on('click', '.add_to_cart_button', function() {
    var cart = jQuery('.wfc_cart_basket');
    var imgtodrag = jQuery(this).parent('.product').find("img").eq(0);
    if (imgtodrag) {
        var imgclone = imgtodrag.clone()
            .offset({
                top: imgtodrag.offset().top,
                left: imgtodrag.offset().left
            })
            .css({
                'opacity': '0.8',
                'position': 'absolute',
                'height': '150px',
                'width': '150px',
                'z-index': '100'
            })
            .appendTo(jQuery('body'))
            .animate({
                'top': cart.offset().top + 10,
                'left': cart.offset().left + 10,
                'width': 75,
                'height': 75
            }, 1000, 'easeInOutExpo');

        setTimeout(function() {
            cart.effect("shake", {
                times: 2
            }, 200);
        }, 1500);

        imgclone.animate({
            'width': 0,
            'height': 0
        }, function() {
            jQuery(this).detach()
        });
    }
});


(function($) {

    $(document).on('click', '.wfc_pslide_atc', function(e) {
        e.preventDefault();

        var $thisbutton = $(this),
            product_id = $thisbutton.attr('data-product_id'),
            product_qty = $thisbutton.attr('data-quantity'),
            variation_id = $thisbutton.attr('variation-id'),
            product_container = $(this).parents('.wfc_body');

        var data = {
            action: 'wfc_prod_slider_ajax_atc',
            product_id: product_id,
            product_sku: '',
            quantity: product_qty,
            variation_id: variation_id,
        };

        $(document.body).trigger('adding_to_cart', [$thisbutton, data]);

        $.ajax({
            type: 'post',
            url: ajax_postajax.ajaxurl,
            data: data,
            beforeSend: function(response) {
                $('.wfc_body').addClass('wfc_loader');
            },
            complete: function(response) {},
            success: function(response) {
                if (response.error & response.product_url) {
                    window.location = response.product_url;
                    return;
                } else {
                    $(document.body).trigger('added_to_cart', [response.fragments, response.cart_hash, $thisbutton]);
                }
                $('.wfc_body').removeClass('wfc_loader');
            },
        });

        return false;
    });
})(jQuery);