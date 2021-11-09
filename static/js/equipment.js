(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()

let equipments = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {

    createPage()
});

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/equipments/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var equipments = JSON.parse(xhr.responseText).query;
        createTableBtns(equipments)
        createSortedTable(equipments)
    }
}

function createTableBtns(obj) {

    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "equipment_name", createSortedTable)
    tr.appendChild(bt);
    table.appendChild(tr);
}

function createSortedTable(obj) {
    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let equipment_id = obj[i]["equipment_id"];

        let equipment_name = createInput(obj[i]["equipment_name"], "any")
        tr.appendChild(equipment_name);


        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (equipment_name.firstChild.value != '') { params["equipment_name"] = equipment_name.firstChild.value; }
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/equipment/' + equipment_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.equipment_name = res.equipment_name;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/equipment/' + equipment_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = equipments.indexOf(objRef)
                    equipments.splice(idx, 1);
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('tableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let equipment_name = createInput("", "any")
    tr.appendChild(equipment_name);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);

    btn_save.addEventListener("click", function() {
        let params = {}
        if (equipment_name.firstChild.value != '') { params["equipment_name"] = equipment_name.firstChild.value; }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/equipment/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');
                let equipment_id = result.query["equipment_id"];

                let equipment_name_new = createInput(result.query["equipment_name"], "any")
                tr_new.appendChild(equipment_name_new);

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (equipment_name_new.firstChild.value != '') { params["equipment_name"] = equipment_name_new.firstChild.value; }

                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/equipment/' + equipment_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.equipment_name = res.equipment_name;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/equipment/' + equipment_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = equipments.indexOf(objRef)
                            equipments.splice(idx, 1);
                            tr_new.remove()
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                table.appendChild(tr_new);
            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send(json);
    });

    tableAdd.appendChild(tr);
}