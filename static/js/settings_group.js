(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()

let markers_names = []
let markers_ids = []

let groups = []
let markers = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/markers/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            markers_names.push(res.query[i]['id_mark'])
            markers_ids.push(res.query[i]['name'])
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/markgroups/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            groups.push(res.query[i])
        }
        createTableBtns(res.query)
        createSortedTable(res.query)
    }

});


function createTableBtns(obj) {
    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "markgroup_name", createSortedTable)
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
        let markgroup_id = obj[i]["markgroup_id"];
        let markgroup_name = createInput(obj[i]["markgroup_name"], "any")
        tr.appendChild(markgroup_name);

        let btn_select = createButton("Редактировать", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {
            let childTable = document.getElementById('childTable');
            childTable.innerHTML = markgroup_name.childNodes[0].value;
            let params = {}
            params["markgroup_id"] = markgroup_id;
            let json = JSON.stringify(params);

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/markgrouprelations/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let group = JSON.parse(xhr.response).query
                    createSortedTable_group(group, markgroup_id);
                    createTableBtns_group(group);

                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (markgroup_name.firstChild.value != '') { params["markgroup_name"] = markgroup_name.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/markgroup/' + markgroup_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.markgroup_name = res.markgroup_name;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/markgroup/' + markgroup_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = groups.indexOf(objRef)
                    groups.splice(idx, 1);
                    tr.remove(); {
                        let table = document.getElementById('childtableBody');
                        table.innerHTML = '';
                        let tableAdd = document.getElementById('childtableBtns');
                        tableAdd.innerHTML = '';
                        let tableBtn = document.getElementById('childtableAdd');
                        tableBtn.innerHTML = '';
                        let childTable = document.getElementById('childTable');
                        childTable.innerHTML = '';

                    }
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

    let markgroup_name = createInput("", "any")
    tr.appendChild(markgroup_name);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        if (markgroup_name.firstChild.value != '') { params["markgroup_name"] = markgroup_name.firstChild.value; }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/markgroup', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');

                let markgroup_id = result.query["markgroup_id"];

                let markgroup_name = createInput(result.query["markgroup_name"], "any")
                tr_new.appendChild(markgroup_name);

                let btn_select = createButton("Редактировать", "btn-secondary");
                tr_new.appendChild(btn_select);
                btn_select.addEventListener("click", function() {

                    let childTable = document.getElementById('childTable');
                    childTable.innerHTML = markgroup_name.childNodes[0].value;
                    let params = {}
                    params["markgroup_id"] = markgroup_id;
                    let json = JSON.stringify(params);

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/markgrouprelations/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let group = JSON.parse(xhr.response).query
                            createSortedTable_group(group, markgroup_id);
                            createTableBtns_group(group);

                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });


                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (markgroup_name.firstChild.value != '') { params["markgroup_name"] = markgroup_name.firstChild.value; }
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/markgroup/' + markgroup_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.markgroup_name = res.markgroup_name;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {

                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/markgroup/' + markgroup_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = groups.indexOf(objRef)
                            groups.splice(idx, 1);
                            tr_new.remove(); {
                                let table = document.getElementById('childtableBody');
                                table.innerHTML = '';
                                let tableAdd = document.getElementById('childtableBtns');
                                tableAdd.innerHTML = '';
                                let tableBtn = document.getElementById('childtableAdd');
                                tableBtn.innerHTML = '';
                                let childTable = document.getElementById('childTable');
                                childTable.innerHTML = '';
                            }
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

function createTableBtns_group(obj) {
    /*
    let table = document.getElementById('tech_tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "nop", createSortedTable_tech)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "code", createSortedTable_tech)
    tr.appendChild(bt1);
    let bt2 = createSortButton(obj, "name", createSortedTable_tech)
    tr.appendChild(bt2);
    table.appendChild(tr);
    */
}

function createSortedTable_group(obj, id) {

    let table = document.getElementById('childtableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];
        let markGroupRelations_id = objRef.markGroupRelations_id;

        let tr = document.createElement('tr');
        let markers_id = createDropdownMenu(obj[i].markers_id, markers_names, markers_ids);
        tr.appendChild(markers_id);
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/markgrouprelation/' + markGroupRelations_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = obj.indexOf(objRef)
                    obj.splice(idx, 1);
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('childtableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let markers_id = createDropdownMenu("", markers_names, markers_ids);
    tr.appendChild(markers_id);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        params["markgroup_id"] = id;
        if (markers_id.firstChild.id != '') { params["markers_id"] = markers_id.firstChild.id; } else return;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/markgrouprelation', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);
                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');
                let markers_id = createDropdownMenu(result.query.markers_id, markers_names, markers_ids);
                tr_new.appendChild(markers_id);

                let markGroupRelations_id = result.query["markGroupRelations_id"];


                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/markgrouprelation/' + markGroupRelations_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = obj.indexOf(objRef)
                            obj.splice(idx, 1);
                            tr_new.remove();
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