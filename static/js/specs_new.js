(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let equipments_names = []
let equipments_ids = []

let type_ids = ['primary', 'secondary']
let type_names = ['Основной', 'Альтернативный']

let specs = []
let routes = []
let techs = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/equipments/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            equipments_ids.push(res.query[i].equipment_id)
            equipments_names.push(res.query[i].equipment_name)
        }
    }

    createPage()
});

function createPage() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/specifications/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        specs = JSON.parse(xhr.responseText).query;
        createTableBtns(specs)
        createSortedTable(specs)
    }

}


function createTableBtns(obj) {
    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "code", createSortedTable)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "name", createSortedTable)
    tr.appendChild(bt1);
    table.appendChild(tr);
}

function createSortedTable(obj) {
    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let spec_id = obj[i]["spec_id"];
        let spec_name = obj[i]["name"];

        let code = createInput(obj[i]["code"], "any")
        tr.appendChild(code);

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let btn_select = createButton("Маршруты", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {

            let route_specName = document.getElementById('specName');
            route_specName.innerHTML = "Спецификация: " + spec_name;

            let params = {}
            params["spec_id"] = spec_id;
            let json = JSON.stringify(params);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/routes/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {


                if (xhr.readyState == 4 && xhr.status == "200") {                    
                    
                    routes = JSON.parse(xhr.response).query                    
                    createRoutesTableBtns(routes)                    
                    createRoutesTable(routes, spec_id) 

                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);

        });

        // let b3 = createButton("Создать партию", "btn-primary");
        // tr.appendChild(b3);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            if (code.firstChild.value != '') { params["code"] = code.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/specification/' + spec_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.name = res.name;
                    objRef.code = res.code;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/specification/' + spec_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = specs.indexOf(objRef)
                    specs.splice(idx, 1);
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

    let code = createInput("", "any")
    tr.appendChild(code);

    let name = createInput("", "any")
    tr.appendChild(name);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        if (code.firstChild.value != '') { params["code"] = code.firstChild.value; }
        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/specification/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');

                let spec_id = result.query["spec_id"];
                let spec_name = result.query["name"];

                let code = createInput(result.query["code"], "any")
                tr_new.appendChild(code);

                let name = createInput(result.query["name"], "any")
                tr_new.appendChild(name);


                let btn_select = createButton("Маршруты", "btn-secondary");
                tr_new.appendChild(btn_select);
                btn_select.addEventListener("click", function() {
                    let techName = document.getElementById('techName');
                    techName.innerHTML = spec_name;
                    let params = {}
                    params["spec_id"] = spec_id;
                    let json = JSON.stringify(params);

                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', '/api/technologies/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            techs = JSON.parse(xhr.response).query
                            createSortedTable_tech(techs, spec_id);
                            createTableBtns_tech(techs);
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
                    if (code.firstChild.value != '') { params["code"] = code.firstChild.value; }
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/specification/' + spec_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.name = res.name;
                            objRef.code = res.code;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/specification/' + spec_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = specs.indexOf(objRef)
                            specs.splice(idx, 1);
                            tr_new.remove(); {
                                let table = document.getElementById('tech_tableBody');
                                table.innerHTML = '';
                                let tableAdd = document.getElementById('tech_tableAdd');
                                tableAdd.innerHTML = '';
                                let tableBtn = document.getElementById('tech_tableBtns');
                                tableBtn.innerHTML = '';
                                let techName = document.getElementById('techName');
                                techName.innerHTML = '';
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

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function createRoutesTableBtns(obj) {
    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "name", createSortedTable)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "type", createSortedTable)
    tr.appendChild(bt1);
    table.appendChild(tr);
}

function createRoutesTable(obj, specID) {

    let table = document.getElementById('routeTableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        
        let spec_name = obj[i]["name"];

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let type = createDropdownMenu_(obj[i]["type"], type_names, type_ids);
        tr.appendChild(type);


        let btn_select = createButton("Технология", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {

            // let route_specName = document.getElementById('specName');
            // route_specName.innerHTML = "Спецификация: " + spec_name;

            // let params = {}
            // params["spec_id"] = spec_id;
            // let json = JSON.stringify(params);
            // var xhr = new XMLHttpRequest();
            // xhr.open('POST', '/api/routes/', true);
            // xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            // xhr.onload = function() {


            //     if (xhr.readyState == 4 && xhr.status == "200") {                    
                    
            //         routes = JSON.parse(xhr.response).query
                    
            //         // </tbody>
            //         // <tbody id="routeTableBody">
            //         // </tbody>
            //         // <tbody id="routeTableAdd">

            //         createSortedTable_tech(techs, spec_id);
            //         // createTableBtns_tech(techs);

            //     } else { showMessage(xhr.response, "danger"); }
            // }
            // xhr.send(json);

        });

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            params["type"] = type.firstChild.id; 
            params["spec_id"] = specID;    
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/route/'+ objRef.route_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = routes.indexOf(objRef)
                    objRef.name = params["name"]
                    objRef.type = params["type"]
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
         
        });

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/route/' + objRef.route_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = routes.indexOf(objRef)
                    routes.splice(idx, 1);
                    tr.remove(); 
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('routeTableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let name = createInput("", "any")
    tr.appendChild(name);

    let type_new;
    if (obj.length == 0)
        type_new = 'primary'
    else
        type_new = 'secondary'

    let type = createDropdownMenu_(type_new, type_names, type_ids);
    tr.appendChild(type);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {

        let params = {}
        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
        params["type"] = type.firstChild.id; 
        params["spec_id"] = specID;         

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/route/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                
                var result = JSON.parse(xhr.responseText);
                routes.push(result.query)
                createRoutesTable(routes, specID) 

            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send(json);
    });

    tableAdd.appendChild(tr);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////

function createTableBtns_tech(obj) {
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
}

function createSortedTable_tech(obj, spec_id) {

    let table = document.getElementById('tech_tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let id_techop = obj[i]["id_techop"];

        let nop = createInput(obj[i]["nop"], "any")
        tr.appendChild(nop);

        let code = createInput(obj[i]["code"], "any")
        tr.appendChild(code);

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let equipment_id = createDropdownMenu(obj[i]["equipment_id"], equipments_names, equipments_ids);
        tr.appendChild(equipment_id);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (nop.firstChild.value != '') { params["nop"] = nop.firstChild.value; }
            if (code.firstChild.value != '') { params["code"] = code.firstChild.value; }
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            if (equipment_id.firstChild.id != '') { params["equipment_id"] = equipment_id.firstChild.id; }
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/technology/' + id_techop + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.nop = res.nop;
                    objRef.code = res.code;
                    objRef.name = res.name;
                    objRef.equipment_id = res.equipment_id;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/technology/' + id_techop + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = techs.indexOf(objRef)
                    techs.splice(idx, 1);
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('tech_tableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let nop = createInput("", "any")
    tr.appendChild(nop);

    let code = createInput("", "any")
    tr.appendChild(code);

    let name = createInput("", "any")
    tr.appendChild(name);

    let equipment_id = createDropdownMenu("", equipments_names, equipments_ids);
    tr.appendChild(equipment_id);


    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        params["spec_id"] = spec_id;
        if (nop.firstChild.value != '') { params["nop"] = nop.firstChild.value; }
        if (code.firstChild.value != '') { params["code"] = code.firstChild.value; }
        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
        if (equipment_id.firstChild.id != '') { params["equipment_id"] = equipment_id.firstChild.id; }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/technology/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);

        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');
                let id_techop = result.query["id_techop"];

                let nop = createInput(result.query["nop"], "any")
                tr_new.appendChild(nop);

                let code = createInput(result.query["code"], "any")
                tr_new.appendChild(code);

                let name = createInput(result.query["name"], "any")
                tr_new.appendChild(name);

                let equipment_id = createDropdownMenu(result.query["equipment_id"], equipments_names, equipments_ids);
                tr_new.appendChild(equipment_id);

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (nop.firstChild.value != '') { params["nop"] = nop.firstChild.value; }
                    if (code.firstChild.value != '') { params["code"] = code.firstChild.value; }
                    if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
                    if (equipment_id.firstChild.id != '') { params["equipment_id"] = equipment_id.firstChild.id; }
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/technology/' + id_techop + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.nop = res.nop;
                            objRef.code = res.code;
                            objRef.name = res.name;
                            objRef.equipment_id = res.equipment_id;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/technology/' + id_techop + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = techs.indexOf(objRef)
                            techs.splice(idx, 1);
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