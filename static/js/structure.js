(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let equipments_names = []
let equipments_ids = []

let enterprises = []
let departments = []
let locations = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(function() {
    createPage();
});

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/enterprises/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        enterprises = JSON.parse(xhr.responseText).query;
        createTableBtns(enterprises)
        createSortedTable(enterprises)
    }
}


function createTableBtns(obj) {
    let table = document.getElementById('enterprise_tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "ent_name", createSortedTable)
    tr.appendChild(bt);
    table.appendChild(tr);
}

function createSortedTable(obj) {
    let table = document.getElementById('enterprise_tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let id = obj[i]["id"];
        let name = obj[i]["ent_name"];

        let ent_name = createInput(obj[i]["ent_name"], "any")
        tr.appendChild(ent_name);

        let btn_select = createButton("Редактировать", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {
            createDepartmetTable(id, name); {
                let table = document.getElementById('locations_tableBtns');
                table.innerHTML = '';
                let tableAdd = document.getElementById('locations_tableBody');
                tableAdd.innerHTML = '';
                let tableBtn = document.getElementById('locations_tableAdd');
                tableBtn.innerHTML = '';
                let techName = document.getElementById('locations_name');
                techName.innerHTML = 'locations';
            }
        });

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (ent_name.firstChild.value != '') { params["ent_name"] = ent_name.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/enterprise/' + id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    name = res.ent_name;
                    objRef.ent_name = res.ent_name;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/enterprise/' + id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = enterprises.indexOf(objRef)
                    enterprises.splice(idx, 1);
                    tr.remove(); {
                        let table = document.getElementById('departments_tableBtns');
                        table.innerHTML = '';
                        let tableAdd = document.getElementById('departments_tableBody');
                        tableAdd.innerHTML = '';
                        let tableBtn = document.getElementById('departments_tableAdd');
                        tableBtn.innerHTML = '';
                        let techName = document.getElementById('departments_name');
                        techName.innerHTML = 'departments';
                    } {
                        let table = document.getElementById('locations_tableBtns');
                        table.innerHTML = '';
                        let tableAdd = document.getElementById('locations_tableBody');
                        tableAdd.innerHTML = '';
                        let tableBtn = document.getElementById('locations_tableAdd');
                        tableBtn.innerHTML = '';
                        let techName = document.getElementById('locations_name');
                        techName.innerHTML = 'locations';
                    }
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('enterprise_tableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let ent_name = createInput("", "any")
    tr.appendChild(ent_name);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        if (ent_name.firstChild.value != '') { params["ent_name"] = ent_name.firstChild.value; }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/enterprise/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');

                let id = result.query["id"];
                let name = result.query["ent_name"];

                let ent_name = createInput(result.query["ent_name"], "any")
                tr_new.appendChild(ent_name);

                let btn_select = createButton("Редактировать", "btn-secondary");
                tr_new.appendChild(btn_select);
                btn_select.addEventListener("click", function() {
                    createDepartmetTable(id, name); {
                        let table = document.getElementById('locations_tableBtns');
                        table.innerHTML = '';
                        let tableAdd = document.getElementById('locations_tableBody');
                        tableAdd.innerHTML = '';
                        let tableBtn = document.getElementById('locations_tableAdd');
                        tableBtn.innerHTML = '';
                        let techName = document.getElementById('locations_name');
                        techName.innerHTML = 'locations';
                    }
                });

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (ent_name.firstChild.value != '') { params["ent_name"] = ent_name.firstChild.value; }
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/enterprise/' + id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.ent_name = res.ent_name;
                            name = res.ent_name;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/enterprise/' + id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = enterprises.indexOf(objRef)
                            enterprises.splice(idx, 1);
                            tr_new.remove(); {
                                let table = document.getElementById('departments_tableBtns');
                                table.innerHTML = '';
                                let tableAdd = document.getElementById('departments_tableBody');
                                tableAdd.innerHTML = '';
                                let tableBtn = document.getElementById('departments_tableAdd');
                                tableBtn.innerHTML = '';
                                let techName = document.getElementById('departments_name');
                                techName.innerHTML = 'departments';
                            } {
                                let table = document.getElementById('locations_tableBtns');
                                table.innerHTML = '';
                                let tableAdd = document.getElementById('locations_tableBody');
                                tableAdd.innerHTML = '';
                                let tableBtn = document.getElementById('locations_tableAdd');
                                tableBtn.innerHTML = '';
                                let techName = document.getElementById('locations_name');
                                techName.innerHTML = 'locations';
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

function createDepartmetTable(id, name) {
    let params = {}
    params["ent_id"] = id;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/departments/', false);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    let json = JSON.stringify(params);
    xhr.onload = function() {
        if (xhr.readyState == 4 && xhr.status == "200") {
            departments = JSON.parse(xhr.response).query
            let table = document.getElementById('departments_name');
            table.innerHTML = name + " departments";
            createDepTableBtns(departments);
            createDepSortedTable(departments, id);

        } else { showMessage(xhr.response, "danger"); }
    }
    xhr.send(json);
}


function createDepTableBtns(obj) {
    let table = document.getElementById('departments_tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "dept_name", createDepSortedTable)
    tr.appendChild(bt);
    table.appendChild(tr);
}

function createDepSortedTable(obj, id) {
    let table = document.getElementById('departments_tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let ent_id = id;

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let dept_id = obj[i]["dept_id"];
        let name = obj[i]["dept_name"];

        let dept_name = createInput(obj[i]["dept_name"], "any")
        tr.appendChild(dept_name);

        let btn_select = createButton("Редактировать", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {
            createLocationTable(dept_id, name);
        });

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (dept_name.firstChild.value != '') { params["dept_name"] = dept_name.firstChild.value; }
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/department/' + dept_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.dept_name = res.dept_name;
                    dept_id = res.dept_name;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/department/' + dept_id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = departments.indexOf(objRef)
                    departments.splice(idx, 1);
                    tr.remove(); {
                        let table = document.getElementById('locations_tableBtns');
                        table.innerHTML = '';
                        let tableAdd = document.getElementById('locations_tableBody');
                        tableAdd.innerHTML = '';
                        let tableBtn = document.getElementById('locations_tableAdd');
                        tableBtn.innerHTML = '';
                        let techName = document.getElementById('locations_name');
                        techName.innerHTML = 'locations';
                    }
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }

    let tableAdd = document.getElementById('departments_tableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let dept_name = createInput("", "any")
    tr.appendChild(dept_name);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}

        if (dept_name.firstChild.value != '') { params["dept_name"] = dept_name.firstChild.value; }
        params["ent_id"] = ent_id;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/department/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');

                let dept_id = result.query["dept_id"];
                let name = result.query["dept_name"];

                let dept_name = createInput(result.query["dept_name"], "any")
                tr_new.appendChild(dept_name);

                let btn_select = createButton("Редактировать", "btn-secondary");
                tr_new.appendChild(btn_select);
                btn_select.addEventListener("click", function() {
                    createLocationTable(dept_id, name);
                });

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (dept_name.firstChild.value != '') { params["dept_name"] = dept_name.firstChild.value; }
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/department/' + dept_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.dept_name = res.dept_name;
                            dept_id = res.dept_name;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/department/' + dept_id + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = departments.indexOf(objRef)
                            departments.splice(idx, 1);
                            tr_new.remove(); {
                                let table = document.getElementById('locations_tableBtns');
                                table.innerHTML = '';
                                let tableAdd = document.getElementById('locations_tableBody');
                                tableAdd.innerHTML = '';
                                let tableBtn = document.getElementById('locations_tableAdd');
                                tableBtn.innerHTML = '';
                                let techName = document.getElementById('locations_name');
                                techName.innerHTML = 'locations';
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

///////////////////////////////

function createLocationTable(id, name) {
    let params = {}
    params["dept_id"] = id;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/locations/', false);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    let json = JSON.stringify(params);
    xhr.onload = function() {
        if (xhr.readyState == 4 && xhr.status == "200") {
            locations = JSON.parse(xhr.response).query
            let table = document.getElementById('locations_name');
            table.innerHTML = name + " locations";
            createLocTableBtns(locations);
            createLocSortedTable(locations, id);

        } else { showMessage(xhr.response, "danger"); }
    }
    xhr.send(json);
}

function createLocTableBtns(obj) {
    let table = document.getElementById('locations_tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "name", createLocSortedTable)
    tr.appendChild(bt);
    table.appendChild(tr);
}

function createLocSortedTable(obj, id) {
    let table = document.getElementById('locations_tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let dept_id = id;

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];
        let id_location = obj[i]["id_location"];

        let tr = document.createElement('tr');

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);
        let latitude = createInput(obj[i]["latitude"], "any")
        tr.appendChild(latitude);
        let longitude = createInput(obj[i]["longitude"], "any")
        tr.appendChild(longitude);
        let zero_x = createInput(obj[i]["zero_x"], "any")
        tr.appendChild(zero_x);
        let zero_y = createInput(obj[i]["zero_y"], "any")
        tr.appendChild(zero_y);
        let width = createInput(obj[i]["width"], "any")
        tr.appendChild(width);
        let length = createInput(obj[i]["length"], "any")
        tr.appendChild(length);

        {
            let btn_load;
            let inputElement = document.createElement('input');
            inputElement.type = 'file';
            inputElement.hidden = true
            inputElement.addEventListener("change", handleFiles, false);

            function handleFiles() {
                const files = this.files;

                const formData = new FormData();
                for (var i = 0, file; file = files[i]; ++i) {
                    formData.append('file', file);
                }
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/uploadLocation/' + id_location + '/', true);
                xhr.onload = function(e) {
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        btn_load.firstChild.className = "btn btn-sm btn-block btn-primary";
                        btn_load.firstChild.innerHTML = "Обновить";
                    } else { showMessage(xhr.response, "danger"); }
                };
                xhr.send(formData);
            }

            tr.appendChild(inputElement);
            if (obj[i].imageurl == null) btn_load = createButton(" Загрузить", "btn-danger");
            else btn_load = createButton("Обновить", "btn-primary");

            tr.appendChild(btn_load);
            btn_load.addEventListener('click', () => {
                inputElement.click()
            })
        }

        let btn_select = createButton("Редактировать", "btn-secondary");
        tr.appendChild(btn_select);
        btn_select.addEventListener("click", function() {});

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            if (latitude.firstChild.value != '') { params["latitude"] = latitude.firstChild.value; }
            if (longitude.firstChild.value != '') { params["longitude"] = longitude.firstChild.value; }
            if (zero_x.firstChild.value != '') { params["zero_x"] = zero_x.firstChild.value; }
            if (zero_y.firstChild.value != '') { params["zero_y"] = zero_y.firstChild.value; }
            if (width.firstChild.value != '') { params["width"] = width.firstChild.value; }
            if (length.firstChild.value != '') { params["length"] = length.firstChild.value; }
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/location/' + id_location + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.name = res.name;
                    objRef.latitude = res.latitude;
                    objRef.longitude = res.longitude;
                    objRef.zero_x = res.zero_x;
                    objRef.zero_y = res.zero_y;
                    objRef.width = res.width;
                    objRef.length = res.length;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/location/' + id_location + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = locations.indexOf(objRef)
                    locations.splice(idx, 1);
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }


    let tableAdd = document.getElementById('locations_tableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');

    let name = createInput("", "any")
    tr.appendChild(name);
    let latitude = createInput("", "any")
    tr.appendChild(latitude);
    let longitude = createInput("", "any")
    tr.appendChild(longitude);
    let zero_x = createInput("", "any")
    tr.appendChild(zero_x);
    let zero_y = createInput("", "any")
    tr.appendChild(zero_y);
    let width = createInput("", "any")
    tr.appendChild(width);
    let length = createInput("", "any")
    tr.appendChild(length);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
        if (latitude.firstChild.value != '') { params["latitude"] = latitude.firstChild.value; }
        if (longitude.firstChild.value != '') { params["longitude"] = longitude.firstChild.value; }
        if (zero_x.firstChild.value != '') { params["zero_x"] = zero_x.firstChild.value; }
        if (zero_y.firstChild.value != '') { params["zero_y"] = zero_y.firstChild.value; }
        if (width.firstChild.value != '') { params["width"] = width.firstChild.value; }
        if (length.firstChild.value != '') { params["length"] = length.firstChild.value; }
        params["dept_id"] = dept_id;
        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/location/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');

                let id_location = result.query["id_location"];

                let name = createInput(result.query["name"], "any")
                tr_new.appendChild(name);
                let latitude = createInput(result.query["latitude"], "any")
                tr_new.appendChild(latitude);
                let longitude = createInput(result.query["longitude"], "any")
                tr_new.appendChild(longitude);
                let zero_x = createInput(result.query["zero_x"], "any")
                tr_new.appendChild(zero_x);
                let zero_y = createInput(result.query["zero_y"], "any")
                tr_new.appendChild(zero_y);
                let width = createInput(result.query["width"], "any")
                tr_new.appendChild(width);
                let length = createInput(result.query["length"], "any")
                tr_new.appendChild(length);

                {
                    let btn_load;
                    let inputElement = document.createElement('input');
                    inputElement.type = 'file';
                    inputElement.hidden = true
                    inputElement.addEventListener("change", handleFiles, false);

                    function handleFiles() {
                        const files = this.files;

                        const formData = new FormData();
                        for (var i = 0, file; file = files[i]; ++i) {
                            formData.append('file', file);
                        }
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/uploadLocation/' + id_location + '/', true);
                        xhr.onload = function(e) {
                            if (xhr.readyState == 4 && xhr.status == "200") {
                                btn_load.firstChild.className = "btn btn-sm btn-block btn-primary";
                                btn_load.firstChild.innerHTML = "Обновить";
                            } else { showMessage(xhr.response, "danger"); }
                        };
                        xhr.send(formData);
                    }

                    tr_new.appendChild(inputElement);

                    btn_load = createButton("Загрузить", "btn-danger");
                    tr_new.appendChild(btn_load);
                    btn_load.addEventListener('click', () => {
                        inputElement.click()
                    })
                }

                let btn_select = createButton("Редактировать", "btn-secondary");
                tr_new.appendChild(btn_select);
                btn_select.addEventListener("click", function() {});

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
                    if (latitude.firstChild.value != '') { params["latitude"] = latitude.firstChild.value; }
                    if (longitude.firstChild.value != '') { params["longitude"] = longitude.firstChild.value; }
                    if (zero_x.firstChild.value != '') { params["zero_x"] = zero_x.firstChild.value; }
                    if (zero_y.firstChild.value != '') { params["zero_y"] = zero_y.firstChild.value; }
                    if (width.firstChild.value != '') { params["width"] = width.firstChild.value; }
                    if (length.firstChild.value != '') { params["length"] = length.firstChild.value; }
                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/location/' + id_location + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.name = res.name;
                            objRef.latitude = res.latitude;
                            objRef.longitude = res.longitude;
                            objRef.zero_x = res.zero_x;
                            objRef.zero_y = res.zero_y;
                            objRef.width = res.width;
                            objRef.length = res.length;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/location/' + id_location + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = locations.indexOf(objRef)
                            locations.splice(idx, 1);
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