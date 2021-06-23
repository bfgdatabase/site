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
            markers.push(res.query[i])
            markers_names.push(res.query[i]['name'])
            markers_ids.push(res.query[i]['id_mark'])
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

// create group table
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

            createSortedTable_group(markgroup_id);
            let childTable_marks = document.getElementById('childTable_marks');
            childTable_marks.innerHTML = "Состав группы " + markgroup_name.childNodes[0].value;

            let params = {}
            params["markgroup_id"] = markgroup_id;
            let json = JSON.stringify(params);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/markgroupSettings/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let childTable_params = document.getElementById('childTable_params');
                    childTable_params.innerHTML = "Параметры группы " + markgroup_name.childNodes[0].value;;
                    let settings = JSON.parse(xhr.response).query
                    createSortedTable_params(settings, markgroup_id)
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);

        });

        let bb = createButton(" Телеметрия", "btn-secondary");
        tr.appendChild(bb);

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
                        let table = document.getElementById('childTable_marks_body');
                        table.innerHTML = '';
                        let tableAdd = document.getElementById('childTable_marks_btns');
                        tableAdd.innerHTML = '';
                        let tableBtn = document.getElementById('childTable_marks_add');
                        tableBtn.innerHTML = '';
                        let childTable_marks = document.getElementById('childTable_marks');
                        childTable_marks.innerHTML = '';

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
                    createSortedTable_group(markgroup_id);

                    let childTable_marks = document.getElementById('childTable_marks');
                    childTable_marks.innerHTML = "Метки группы " + markgroup_name.childNodes[0].value;
                    let childTable_params = document.getElementById('childTable_params');
                    childTable_params.innerHTML = "Параметры группы " + markgroup_name.childNodes[0].value;

                    let params = {}
                    params["markgroup_id"] = markgroup_id;
                    let json = JSON.stringify(params);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/markgroupSettings/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let settings = JSON.parse(xhr.response).query
                            createSortedTable_params(settings, markgroup_id)
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
                                let table = document.getElementById('childTable_marks_body');
                                table.innerHTML = '';
                                let tableAdd = document.getElementById('childTable_marks_btns');
                                tableAdd.innerHTML = '';
                                let tableBtn = document.getElementById('childTable_marks_add');
                                tableBtn.innerHTML = '';
                                let childTable_marks = document.getElementById('childTable_marks');
                                childTable_marks.innerHTML = '';
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

function findbyId(markers, id) {
    for (var i = 0; i < markers.length; i++) {
        if (markers[i].id_mark == id) return markers[i];
    }
}

function createSortedTable_group(id) {

    let table = document.getElementById('childTable_marks_body');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < markers.length; i++) {

        if (markers[i].markgroup_id != id)
            continue;

        let MARK_ID = markers[i].id_mark
        let mark = findbyId(markers, MARK_ID)
        mark.markgroup_id = id;

        let tr = document.createElement('tr');
        let markers_id = createTextFromVariants(MARK_ID, markers_names, markers_ids);
        tr.appendChild(markers_id);

        let v1 = createInput("", "any")
        tr.appendChild(v1);
        let v2 = createInput("", "any")
        tr.appendChild(v2);
        let v3 = createInput("", "any")
        tr.appendChild(v3);

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            let params = {}
            params["markgroup_id"] = null;
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/marker/' + MARK_ID + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let mark = findbyId(markers, MARK_ID)
                    mark.markgroup_id = null;
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('childTable_marks_add');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let markers_id = createDropdownMenu("", markers_names, markers_ids);
    tr.appendChild(markers_id);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {

        if (markers_id.firstChild.id == '') return;
        let params = {}
        params["markgroup_id"] = id;
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', '/api/marker/' + markers_id.firstChild.id + '/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);
                let MARK_ID = result.query.id_mark;
                let mark = findbyId(markers, MARK_ID)
                mark.markgroup_id = id;
                let tr = document.createElement('tr');
                let markers_id = createTextFromVariants(MARK_ID, markers_names, markers_ids);
                tr.appendChild(markers_id);

                let btn_delete = createButton("Удалить", "btn-danger");
                tr.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    let params = {}
                    params["markgroup_id"] = null;
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/marker/' + MARK_ID + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let mark = findbyId(markers, MARK_ID)
                            mark.markgroup_id = null;
                            tr.remove();
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                table.appendChild(tr);

            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send(json);
    });

    tableAdd.appendChild(tr);
}


function createSortedTable_params(obj, id) {

    let table = document.getElementById('childTable_params_body');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let objRef = obj[i];

        let setting_name = createInput(obj[i]["setting_name"], "any")
        tr.appendChild(setting_name);

        let setting_script = createInput(obj[i]["setting_script"], "any")
        tr.appendChild(setting_script);

        let setting_params = createInput(obj[i]["setting_params"], "any")
        tr.appendChild(setting_params);

        let setting_params1 = createInput("", "any")
        tr.appendChild(setting_params1);

        let setting_id = obj[i]["setting_id"];

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (setting_name.firstChild.value != '') { params["setting_name"] = setting_name.firstChild.value; }
            if (setting_type.firstChild.value != '') { params["setting_type"] = setting_type.firstChild.value; }
            if (setting_script.firstChild.value != '') { params["setting_script"] = setting_script.firstChild.value; }
            if (setting_params.firstChild.value != '') { params["setting_params"] = setting_params.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/markgroupSetting/' + setting_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.setting_name = res.setting_name;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/markgroupSetting/' + setting_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);

        let btn_save2 = createButton("Установить", "btn-secondary");
        tr.appendChild(btn_save2);

        let element = document.createElement('input');
        element.type = "checkbox";
        element.className = "form-check-input";
        tr.appendChild(element);

    }

    let tableAdd = document.getElementById('childTable_params_add');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let setting_name = createInput("", "any")
    tr.appendChild(setting_name);

    let setting_type = createInput("", "any")
    tr.appendChild(setting_type);

    let setting_script = createInput("", "any")
    tr.appendChild(setting_script);

    let setting_params = createInput("", "any")
    tr.appendChild(setting_params);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        if (setting_name.firstChild.value != '') { params["setting_name"] = setting_name.firstChild.value; }
        if (setting_type.firstChild.value != '') { params["setting_type"] = setting_type.firstChild.value; }
        if (setting_script.firstChild.value != '') { params["setting_script"] = setting_script.firstChild.value; }
        if (setting_params.firstChild.value != '') { params["setting_params"] = setting_params.firstChild.value; }
        params["markgroup_id"] = id;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/markgroupSetting', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {

            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');

                let setting_name = createInput(result.query["setting_name"], "any")
                tr_new.appendChild(setting_name);

                let setting_type = createInput(result.query["setting_type"], "any")
                tr_new.appendChild(setting_type);

                let setting_script = createInput(result.query["setting_script"], "any")
                tr_new.appendChild(setting_script);

                let setting_params = createInput(result.query["setting_params"], "any")
                tr_new.appendChild(setting_params);

                let setting_id = result.query["setting_id"];


                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {

                    let params = {}
                    if (setting_name.firstChild.value != '') { params["setting_name"] = setting_name.firstChild.value; }
                    if (setting_type.firstChild.value != '') { params["setting_type"] = setting_type.firstChild.value; }
                    if (setting_script.firstChild.value != '') { params["setting_script"] = setting_script.firstChild.value; }
                    if (setting_params.firstChild.value != '') { params["setting_params"] = setting_params.firstChild.value; }

                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/markgroupSetting/' + setting_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.setting_name = res.setting_name;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {

                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/markgroupSetting/' + setting_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
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