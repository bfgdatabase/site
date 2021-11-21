(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let equipments_names = []
let equipments_ids = []
let equipments = []

let type_ids = ['primary', 'secondary']
let type_names = ['Основной', 'Альтернативный']
let type_zone = ['ВХОД', 'ВЫХОД']

let specs = []
let routes = []
let techs = []
let zones = []
let zones_names = []
let zones_ids = []



///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/equipments/', false);
        xhr.send();
        if (xhr.status != 200) {
            showMessage(xhr.response, "danger");
        } else {
            var res = JSON.parse(xhr.responseText);
            equipments = res.query
            for (var i = 0; i < res.query.length; i++) {
                equipments_ids.push(res.query[i].equipment_id)
                equipments_names.push(res.query[i].equipment_name)
            }
        }
    }
        {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/zones/', false);
        xhr.send();
        if (xhr.status != 200) {
            showMessage(xhr.response, "danger");
        } else {
            var res = JSON.parse(xhr.responseText);
            zones = res.query
            for (var i = 0; i < res.query.length; i++) {
                zones_names.push(res.query[i].name)
                zones_ids.push(res.query[i].id_zone)
            }
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


            let tmp = document.getElementById('techtableBody');
            tmp.innerHTML = ""

            tmp = document.getElementById('techName');
            tmp.innerHTML = ""

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
    let table = document.getElementById('routeTableBtns');
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
        let route_id = obj[i]["route_id"];

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let type = createDropdownMenu_(obj[i]["type"], type_names, type_ids);
        tr.appendChild(type);


        let btn_select = createButton("Технология", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {

            let route_specName = document.getElementById('techName');
            route_specName.innerHTML = "Маршрут: " + spec_name;

            let params = {}
            params["route_id"] = route_id;
            let json = JSON.stringify(params);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/technologies/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {

                if (xhr.readyState == 4 && xhr.status == "200") {   
                    techs = JSON.parse(xhr.response).query                    
                    createTableBtns_tech(techs)                    
                    createSortedTable_tech(techs)      
                    createSortedTable_add(techs, route_id) 

                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
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
    let table = document.getElementById('techtableBtns');
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

function createSortedTable_tech(obj) {

    let table = document.getElementById('techtableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {


        let eqipment = equipments.find(item => item.equipment_id == obj[i]["equipment_id"])
        
        let zones_names = []
        let zones_ids = []
        for (let j = 0; j < eqipment.zones.length; ++j)
        {
            zones_ids.push(eqipment.zones[j])
            let res = zones.find(item => item.id_zone == eqipment.zones[j])
            zones_names.push(res.name)
        }

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let tech_id = obj[i]["tech_id"];

        let nop = createInput(obj[i]["nop"], "any")
        tr.appendChild(nop);

        let code = createInput(obj[i]["code"], "any")
        tr.appendChild(code);

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let eqip = createText(eqipment.equipment_name)
        tr.appendChild(eqip);

        let first_zone_id = createDropdownMenu(obj[i]["first_zone_id"], zones_names, zones_ids);
        tr.appendChild(first_zone_id);

        let type_1 = createDropdownMenu(obj[i]["first_zone_type"], type_zone, type_zone);
        tr.appendChild(type_1);

        let second_zone_id = createDropdownMenu(obj[i]["second_zone_id"], zones_names, zones_ids);
        tr.appendChild(second_zone_id);

        let type_2 = createDropdownMenu(obj[i]["second_zone_type"], type_zone, type_zone);
        tr.appendChild(type_2);

        let t_pz = createInput(obj[i]["t_pz"], "any")
        tr.appendChild(t_pz);

        let t_sht = createInput(obj[i]["t_sht"], "any")
        tr.appendChild(t_sht);

        let t_nal = createInput(obj[i]["t_nal"], "any")
        tr.appendChild(t_nal);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            if (code.firstChild.value != '') { params["code"] = parseInt(code.firstChild.value); }        
            if (nop.firstChild.value != '') { params["nop"] = parseInt(nop.firstChild.value); }
    
            if (t_nal.firstChild.value != '') { params["t_nal"] = parseInt(t_nal.firstChild.value); }
            if (t_pz.firstChild.value != '') { params["t_pz"] = parseInt(t_pz.firstChild.value); }        
            if (t_sht.firstChild.value != '') { params["t_sht"] = parseInt(t_sht.firstChild.value); }

            if (first_zone_id.firstChild.id != '') { params["first_zone_id"] = parseInt(first_zone_id.firstChild.id) }      
            if (type_1.firstChild.id != '') { params["first_zone_type"] = type_1.firstChild.id }  
            
            if (second_zone_id.firstChild.id != '') { params["second_zone_id"] = parseInt(second_zone_id.firstChild.id) }   
            if (type_2.firstChild.id != '') { params["second_zone_type"] = type_2.firstChild.id }   
            
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/technology/' + tech_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = techs.indexOf(objRef)  
                    techs[idx]= JSON.parse(xhr.response).query
                    createSortedTable_tech(techs) 
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/technology/' + tech_id + '/', true);
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
}


function createSortedTable_add(obj, route_id) {
    ///////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////          ADD      ////////////////////////////////////
    ///////////////////////////////////////////////////////////////////////////////////
    let i1 = document.getElementById('nop');
    i1.innerHTML = ""
    let nop = createInput("", "any")
    i1.appendChild(nop);

    let i2 = document.getElementById('code');
    i2.innerHTML = ""
    let code = createInput("", "any")
    i2.appendChild(code);

    let i3 = document.getElementById('name');
    i3.innerHTML = ""
    let name = createInput("", "any")
    i3.appendChild(name);

    let type_1 = document.getElementById('type_1');
    type_1.innerHTML = ""
    let type_1_btn = createDropdownMenu("", type_zone, type_zone);
    type_1.appendChild(type_1_btn);

    let type_2 = document.getElementById('type_2');
    type_2.innerHTML = ""
    let type_2_btn = createDropdownMenu("", type_zone, type_zone);
    type_2.appendChild(type_2_btn);

    
    let tpz = document.getElementById('tpz');
    tpz.innerHTML = ""
    let tpz_btn = createInput("", "tpz")
    tpz.appendChild(tpz_btn);

    let tsht = document.getElementById('tsht');
    tsht.innerHTML = ""
    let tsht_btn = createInput("", "any")
    tsht.appendChild(tsht_btn);

    let tnal = document.getElementById('tnal');
    tnal.innerHTML = ""
    let tnal_btn = createInput("", "any")
    tnal.appendChild(tnal_btn);


    let i4 = document.getElementById('eqip');
    i4.innerHTML = ""
    let equipment_btn = null
    {
        let td = document.createElement('td');
        td.style = "vertical-align:middle";
        td.className = "px-1";
    
        let buttonSelect = document.createElement('button');
        buttonSelect.className = "btn btn-primary btn-sm dropdown-toggle btn-block";
        buttonSelect.id = "";
    
        buttonSelect.setAttribute("data-toggle", "dropdown");
    
        let menuSelect = document.createElement('div');
        menuSelect.className = "dropdown-menu";
    
        let el = document.createElement('a');
        el.className = "dropdown-item";
        el.innerHTML = "-";
        el.id = "";
    
        el.addEventListener("click", function() {
            buttonSelect.id = "";
            buttonSelect.innerHTML = "-";

            let zones_names = []
            let zones_ids = []

            let z1 = document.getElementById('zone_1');
            z1.innerHTML = ""
            let zone_1 = createDropdownMenu("", zones_names, zones_ids);
            z1.appendChild(zone_1);

            let z2 = document.getElementById('zone_2');
            z2.innerHTML = ""
            let zone_2 = createDropdownMenu("", zones_names, zones_ids);
            z2.appendChild(zone_2);

        });

        menuSelect.appendChild(el);
    
        for (let i = 0; i < equipments_names.length; ++i) {
    
            let el = document.createElement('a');
            el.className = "dropdown-item";
            el.innerHTML = equipments_names[i];
            el.id = i;
    
            el.addEventListener("click", function() {

                let zones_names = []
                let zones_ids = []
                for (let j = 0; j < equipments[el.id].zones.length; ++j)
                {
                    zones_ids.push(equipments[el.id].zones[j])
                    let res = zones.find(item => item.id_zone == equipments[el.id].zones[j])
                    zones_names.push(res.name)
                }


                let z1 = document.getElementById('zone_1');
                z1.innerHTML = ""
                let zone_1 = createDropdownMenu("", zones_names, zones_ids);
                z1.appendChild(zone_1);

                let z2 = document.getElementById('zone_2');
                z2.innerHTML = ""
                let zone_2 = createDropdownMenu("", zones_names, zones_ids);
                z2.appendChild(zone_2);

                buttonSelect.id = el.id;
                buttonSelect.innerHTML = el.innerHTML;
            });
    
            menuSelect.appendChild(el);
        }
        td.appendChild(buttonSelect);
        td.appendChild(menuSelect);
        equipment_btn = td
    }
    i4.appendChild(equipment_btn);

    let add = document.getElementById('add');
    add.innerHTML = ""
    let add_btn = createButton("Добавить", "btn-secondary");
    add_btn.addEventListener("click", function() {

        if (equipment_btn.firstChild.id == "")
        {
            showMessage("Не выбрано оборудование", "warning")
            return
        }

        let z1 = document.getElementById('zone_1');
        let z2 = document.getElementById('zone_2');
           
        let params = {}

        params["route_id"] = route_id;
        params["equipment_id"] = equipments[equipment_btn.firstChild.id].equipment_id

        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
        if (code.firstChild.value != '') { params["code"] = parseInt(code.firstChild.value); }        
        if (nop.firstChild.value != '') { params["nop"] = parseInt(nop.firstChild.value); }

        if (tnal_btn.firstChild.value != '') { params["t_nal"] = parseInt(tnal_btn.firstChild.value); }
        if (tpz_btn.firstChild.value != '') { params["t_pz"] = parseInt(tpz_btn.firstChild.value); }        
        if (tsht_btn.firstChild.value != '') { params["t_sht"] = parseInt(tsht_btn.firstChild.value); }

        if (z1.firstChild.firstChild.id != '') { params["first_zone_id"] = parseInt(z1.firstChild.firstChild.id); }      
        if (type_1_btn.outerText != '') { params["first_zone_type"] = type_1_btn.outerText; }     
        if (z2.firstChild.firstChild.id != '') { params["second_zone_id"] = parseInt(z2.firstChild.firstChild.id); }
        if (type_2_btn.outerText != '') { params["second_zone_type"] = type_2_btn.outerText; }   
        
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/technology/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                let res = JSON.parse(xhr.response).query
                techs.push(res)
                createSortedTable_tech(techs) 
            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send(json);
    })
    add.appendChild(add_btn);
}