(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/batch/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
        $('#example').DataTable( {
            "order": [[ 3, "desc" ]]
        } );
    } else {
        let res = JSON.parse(JSON.parse(xhr.responseText).query);
        
        for (var prop in res) {
            let a = res[prop];
            let b = res[prop];
            $("#tableID").find('tbody')
                .append($('<tr>')
                    .append($('<td>')
                        .text(res[prop][0])                                       
                    )
                    .append($('<td>')
                        .text(res[prop][1])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][2])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][3])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][4])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][5])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][6])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][7])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][8])                                   
                    ) 
                    .append($('<td>')
                        .text(res[prop][9])                                   
                    )                
                );
        }

        
            
        $('#tableID').DataTable( {
        } );
    }
    

    
    // $('#example1').text('Ура! Мы подключили Jquery!');

} );