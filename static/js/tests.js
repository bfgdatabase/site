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
            '<button2 type="button2" class="btn btn-primary btn-sm">Аналитика</button2>'+
            '<button3 type="button3" class="btn btn-primary btn-sm">Местоположение</button3>'
            } ]          
        } );

        $('#batchTable tbody').on( 'click', 'button', function () {
            var my_text=prompt('Причина остановки');

            var data = table.row( $(this).parents('tr') ).data();
            let params = {}
            params["batch_id"] = data[0]
            params["comment"] = my_text
            // params["end_time"] = datetime
            // params["user_id"] = my_text
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/pause/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
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
                        "targets": -1
                        } ]          
                    } );
                } 
            }
            xhr.send();
        } );

        $('#batchTable tbody').on( 'click', 'button2', function () {

            var data = table.row( $(this).parents('tr') ).data();
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/analytics/' + data[0] + '/', true);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    showMessage(xhr.response, "danger");
                } else {
                    let res = JSON.parse(JSON.parse(xhr.responseText).query);
                    alert(res)
                  // Попап с информацией.
                }
            }
            xhr.send();
        } );

        $('#batchTable tbody').on( 'click', 'button3', function () {

            var data = table.row( $(this).parents('tr') ).data();
            $( "#lagTableName" ).html('Местоположение партии ' + (data[0]));            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/report/' + data[0] + '/', true);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    showMessage(xhr.response, "danger");
                } else {
                    $('#lagTable').dataTable().fnClearTable();
                    $('#lagTable').dataTable().fnDestroy();
                     let res = JSON.parse(JSON.parse(xhr.responseText).query);
                     var lag_table = $('#lagTable').DataTable( {
                        "data": res['events'],
                        "columnDefs": [ {
                        "targets": -1
                        } ]
                    } );
                }
            }
            xhr.send();
        } );
       
    }    
} );

