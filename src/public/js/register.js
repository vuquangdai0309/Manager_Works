
(function ($) {
    "use strict";

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');
    const messageDiv = document.getElementById('message1');
    console.log(messageDiv)
    $('.validate-form-register').on('submit', function (event) {
        event.preventDefault();
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }
        if (check) {
            $.ajax({
                url: '/user/register',
                type: 'POST',
                data: {
                    username: $('#username').val(),
                    room_id: $('#room_id').val(),
                    //mã hóa mật khẩu trước khi gửi qua ajax
                    password: CryptoJS.SHA256($('#password').val()).toString(),
                    email: $('#email').val(),
                },
            }).then(data => {
               
                messageDiv.innerHTML = data.message
            })
               
        }
        return check;


    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else if ($(input).attr('type') == 'password' || $(input).attr('name') == 'password') {
            if ($(input).val().length < 8) {
                return false
            }

        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }

    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);