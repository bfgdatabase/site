(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


// $('#batch_table tbody').on( 'click', 'tr', function () {
//     console.log( table.row( this ).data() );
// } );
function get_location(){
    var data = table.row( $(this).parents('tr') ).data();
    alert( "Партия "  + data[0] +" это "+ data[ 5 ] );
}


$(document).ready(function() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/batch/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        let res = JSON.parse(JSON.parse(xhr.responseText).query);


        var table = $('#tableID').DataTable( {
           "data": res,
           //"columnDefs": [ {
           // "targets": -1,
           // "data": null,
           // "defaultContent": "<div class=\"dropdown\"><button class=\"dropbtn\">Actions</button><div class=\"dropdown-content\"> <button onClick=\'get_location()\'>Местоположение</button> <button id=\"create_pause_batch\">Поставить на паузу</button> <button id=\"analitics_batch\">Аналитика</button></div></div>"
           // } ]
        } );

        //$('#batch_table tbody').on( 'click', 'button', function () {
        //    var data = table.row( $(this).parents('tr') ).data();
        //    alert( "Партия "  + data[0] +" это "+ data[ 5 ] );
        //} );

        //$('#tableID tbody').on( 'click', 'batchlocation', function () {
        //   var data = table.row( $(this).parents('tr') ).data();
        //    alert( "Партия "  + data[0] +" это "+ data[ 5 ] );
        // });

        // for (var prop in res) {
        //     let a = res[prop];
        //     let b = res[prop];

        //     let btn_save = createButton("Добавить", "btn-primary");
        //     btn_save.addEventListener("click", function() {
        //         // let g = table.row( this ).data()
        //         let a = 1;    
        //         let g = table.row( 1 ).data()    
        //         let dd = 1;    
        //     });

        //     $("#batch_table").find('tbody')
        //         .append($('<tr>')
        //             .append($('<td>')
        //                 .text(res[prop][0])                                       
        //             )
        //             .append($('<td>')
        //                 .text(res[prop][1])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][2])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][3])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][4])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][5])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][6])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][7])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][8])                                   
        //             ) 
        //             .append($('<td>')
        //                 .text(res[prop][9])                                   
        //             ) 
        //             .append($('<td>')
        //                 .append(btn_save)                                   
        //             )                
        //         );
        // }

        
       
    }
    

    
    // $('#example1').text('Ура! Мы подключили Jquery!');

} );

