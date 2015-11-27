jQuery(document).ready(function($){
    $('.qty').on('change', function(){
        form = $(this).closest('form');

        // check for min/max values and reset if out of range
        var min = $(this).attr('min');
        var max = $(this).attr('max');

        if ( (min.length > -1) || (max.length > -1) ) {
            // handle quantities below min
            if ( Number($(this).val()) < min ) {
                $(this).val(min);
                return;
            }
            // handle quantities above max
            if ( Number($(this).val()) > max ) {
                $(this).val(max);
                return;
            }
        }

        // emulates button Update cart click
        $("<input type='hidden' name='update_cart' id='update_cart' value='1'>").appendTo(form);
        
        // plugin flag
        $("<input type='hidden' name='is_wac_ajax' id='is_wac_ajax' value='1'>").appendTo(form);

        el_qty = $(this);
        matches = $(this).attr('name').match(/cart\[(\w+)\]/);
        cart_item_key = matches[1];
        form.append( $("<input type='hidden' name='cart_item_key' id='cart_item_key'>").val(cart_item_key) );

        // get the form data before disable button...
        formData = form.serialize();
        
        // disable the update cart button
        $("input[name='update_cart']").val('Updating…').prop('disabled', true);
        
        // disable the checkout button
        $("a.checkout-button.wc-forward").attr('disabled',true).addClass('disabled').html('Updating…');
        
        // disable all quantity inputs
        $("input.qty").attr('disabled',true);

        $.post( form.attr('action'), formData, function(resp) {
                // ajax response
                $('.cart-collaterals').html(resp.html);
                
                el_qty.closest('.cart_item').find('.product-subtotal').html(resp.price);
                
                $('#update_cart').remove();
                $('#is_wac_ajax').remove();
                $('#cart_item_key').remove();
                
                $("input[name='update_cart']").val(resp.update_label).prop('disabled', false);

                $("a.checkout-button.wc-forward").removeClass('disabled').attr('disabled',false).html(resp.checkout_label);

                $("input.qty").attr('disabled',false);

                // when changes to 0, remove the product from cart
                if ( el_qty.val() == 0 ) {
                    el_qty.closest('tr').remove();
                }
            },
            'json'
        );
    });
});
