(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


// $('#tableID tbody').on( 'click', 'tr', function () {
//     console.log( table.row( this ).data() );
// } );



$(document).ready(function() {

    var table = $('#lagTable').DataTable( {
        "columnDefs": [ {
         "targets": -1,
         "data": null,
          } ]          
     } );
     
     var pauseTable = $('#pauseTable').DataTable( {
        "columnDefs": [ {
         "targets": -1,
         "data": null,
          } ]          
     } );


    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/batch/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        let res = JSON.parse(JSON.parse(xhr.responseText).query);

        var table = $('#batchTable').DataTable( {
           "data": res,
           "columnDefs": [ {
            "targets": -1,
            "data": null,
            "defaultContent": '<button type="button" class="btn btn-primary btn-sm">Пауза</button>' +
            '<button1 type="button1" class="btn btn-primary btn-sm">Лог</button1>'+
            '<button1 type="button2" class="btn btn-primary btn-sm">Паузы</button2>'
            } ]          
        } );

        $('#batchTable tbody').on( 'click', 'button', function () {
            var my_text=prompt('Причина остановки');
            // batchpausees или pause ?????????
            // pause должна иметь ссылку на батч
            // надо наверно гдето статус партии отображать и список пауз
            // в паузе ксть "end_time": "2021-12-12T18:54:13.553Z", но это конкретное время а не количество рабочих минут
            // надо наверно когда на паузу поставили и на сколько сделать поля
            //if(my_text) alert(my_text); // for example I've made an alert
        } );

        $('#batchTable tbody').on( 'click', 'button1', function () {

            var data = table.row( $(this).parents('tr') ).data();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/log_batches_lag/' + data[0] + '/', true);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    showMessage(xhr.response, "danger");
                } else {
                     let res = JSON.parse(JSON.parse(xhr.responseText).query);
                     var lag_table = $('#lagTable').DataTable( {
                        "data": res,
                        "columnDefs": [ {
                        "targets": -1,
                        "data": null,
                        } ]          
                    } );
                } 
            }
            xhr.send();
        } );
       
    }    
} );

