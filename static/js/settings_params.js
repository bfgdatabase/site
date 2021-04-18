(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()

let markgroups_names = []
let markgroups_ids = []

let settings = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/markgroups/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            markgroups_names.push(res.query[i]['markgroup_name'])
            markgroups_ids.push(res.query[i]['markgroup_id'])
        }
    }


    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/markgroupSettings/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            settings.push(res.query[i])
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
    let bt = createSortButton(obj, "setting_name", createSortedTable)
    tr.appendChild(bt);
    table.appendChild(tr);
}

function createSortedTable(obj) {
    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let objRef = obj[i];

        let setting_name = createInput(obj[i]["setting_name"], "any")
        tr.appendChild(setting_name);

        let setting_type = createInput(obj[i]["setting_type"], "any")
        tr.appendChild(setting_type);

        let setting_script = createInput(obj[i]["setting_script"], "any")
        tr.appendChild(setting_script);

        let setting_params = createInput(obj[i]["setting_params"], "any")
        tr.appendChild(setting_params);

        let setting_id = obj[i]["setting_id"];

        let btn_select = createButton("Редактировать", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {

            let childTable = document.getElementById('childTable');
            childTable.innerHTML = setting_name.childNodes[0].value;
            let params = {}
            params["setting_id"] = setting_id;
            let json = JSON.stringify(params);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/markSettingsRelations/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let group = JSON.parse(xhr.response).query
                    createSortedTable_group(group, setting_id);
                    createTableBtns_group(group);

                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

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
                    let idx = settings.indexOf(objRef)
                    settings.splice(idx, 1);
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

                let btn_select = createButton("Редактировать", "btn-secondary");
                tr_new.appendChild(btn_select);
                btn_select.addEventListener("click", function() {

                    let childTable = document.getElementById('childTable');
                    childTable.innerHTML = markgroup_name.childNodes[0].value;
                    let params = {}
                    params["setting_id"] = setting_id;
                    let json = JSON.stringify(params);
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/markSettingsRelations/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let group = JSON.parse(xhr.response).query
                            createSortedTable_group(group, setting_id);
                            createTableBtns_group(group);

                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });


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
                            let idx = settings.indexOf(objRef)
                            settings.splice(idx, 1);
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
        let markSettingsRelations_id = objRef.markSettingsRelations_id;

        let tr = document.createElement('tr');
        let markgroup_id = createDropdownMenu(obj[i].markgroup_id, markgroups_names, markgroups_ids);
        tr.appendChild(markgroup_id);
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/markSettingsRelations/' + markSettingsRelations_id + '/', true);
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

    let markgroup_id = createDropdownMenu("", markgroups_names, markgroups_ids);
    tr.appendChild(markgroup_id);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        params["setting_id"] = id;
        if (markgroup_id.firstChild.id != '') { params["markgroup_id"] = markgroup_id.firstChild.id; } else return;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/markSettingsRelation', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);
                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');
                let markgroup_id = createDropdownMenu(result.query.markgroup_id, markgroups_names, markgroups_ids);
                tr_new.appendChild(markgroup_id);

                let markSettingsRelations_id = result.query["markSettingsRelations_id"];

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/markSettingsRelation/' + markSettingsRelations_id + '/', true);
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