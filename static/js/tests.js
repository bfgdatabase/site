(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {
    $('#example1').text('Ура! Мы подключили Jquery!');
    $('#example').DataTable( {
        "order": [[ 3, "desc" ]]
    } );
} );