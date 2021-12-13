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
            // batchpausees или pause ?????????
            // pause должна иметь ссылку на батч
            // надо наверно гдето статус партии отображать и список пауз
            // в паузе ксть "end_time": "2021-12-12T18:54:13.553Z", но это конкретное время а не количество рабочих минут
            // надо наверно когда на паузу поставили и на сколько сделать поля

            // Ответ:
            // Используемая модель PauseDB. Методы апи api/pause.
            // Мне просто сказали, что пауз нет и их надо создать - я создал. А оказалось, что они уже были. Ну типа пока пофиг, всё-равно потом надо будет базу править.
            // Про статус партии - если стоит время окончания, то закрыта, если нет, то активная. Пока так.
            // Список пауз нужно отображать только в отдельной таблице. Либо через какой-то экшен(мол есть ли у данной партии паузы), но это не в ближайшем будущем.
            // Да, пока пусть будет, что пауза до такого-то числа. Сделано так, чтобы можно быть внести изменение в паузу. Мол всё, станок починили сегодня и продолжается
            // работа, а не через 3 дня, как планировали. Потому что вставить новую дату проще, чем вставить новое количество минут. А дальше уже эта дата будет расчитывать
            // в дельту минуты, чтобы определить сколько времени осталось.
            //
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
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/report/' + data[0] + '/', true);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    showMessage(xhr.response, "danger");
                } else {
                // Не знаю как сделать чтобы заработало. Ругается на получаемый тип.
                     let res = JSON.parse(JSON.parse(xhr.responseText).query);
                     var lag_table = $('#lagTable').DataTable( {
                        "data": res['events'],
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

