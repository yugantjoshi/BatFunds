
(function ($) {
    "use strict";

    function showErrorDialog(message, color) {
        $("#snackbar").html(message)
        $("#snackbar").css({backgroundColor: color})

        $("#snackbar").addClass("show")
        setTimeout(() => {
            $("#snackbar").removeClass("show")
        }, 4000);
    }

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
        const messageCode = urlParams.get('code')

        switch(messageCode) {
            case '-1':
                showErrorDialog("Incorrect Email or Password!", "#F44336")
                break;
            case '-2':
                showErrorDialog("Email already exists! Did you mean to <a class='text-white text-hov-white text-underline' href='/login'>log in</a>?", "#F44336")
                break;
            case '-3':
                showErrorDialog("Username already exists! Did you mean to <a class='text-white text-hov-white text-underline' href='/login'>log in</a>?", "#F44336")
                break;
            case '1':
                showErrorDialog("Your account has been created! Please log in to continue.", "#43A047")
                break;
            case '2':
                showErrorDialog("You have been logged out!", "#333333")
                break;
            default:
                break;
        }
    }
    
    /*==================================================================
    [ Focus input ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })
    })


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;
        console.log(input);
        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }
	console.log(check)
        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
        });
    });

    function validate (input) {
        //invalid Email
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.\+]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        //invalid phone
        if($(input).attr('type') == 'phone-number' || $(input).attr('name') == 'phone-number'){
          var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
          if(!$(input).val().match(phoneno)){
              return false;
          }
        }
        //Empty Field
        else if($(input).val().trim() == ''){
          return false;
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

    /*==================================================================
    [ Show pass ]*/
    var showPass = 0;
    $('.btn-show-pass').on('click', function(){
        if(showPass == 0) {
            $(this).next('input').attr('type','text');
            $(this).find('i').removeClass('zmdi-eye');
            $(this).find('i').addClass('zmdi-eye-off');
            showPass = 1;
        }
        else {
            $(this).next('input').attr('type','password');
            $(this).find('i').addClass('zmdi-eye');
            $(this).find('i').removeClass('zmdi-eye-off');
            showPass = 0;
        }

    });


})(jQuery);
