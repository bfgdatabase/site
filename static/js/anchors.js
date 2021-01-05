(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


var xhr = new XMLHttpRequest();
xhr.open('GET', 'api/anchors', true);
xhr.onload = function() {

    var parsedJson = JSON.parse(this.responseText)
    console.log(parsedJson);
};
xhr.send();