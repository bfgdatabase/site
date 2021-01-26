(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let anchors = [] ///////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/anchors/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        anchors = JSON.parse(xhr.responseText).query; ///////////////////////////////////////////////////////////
        createTableBtns(anchors) ///////////////////////////////////////////////////////////
        createSortedTable(anchors) ///////////////////////////////////////////////////////////                               
    }
}


function createTableBtns(obj) {

    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "name", createSortedTable)
    tr.appendChild(bt);
    table.appendChild(tr);
}

function createSortedTable(obj) {

    let mac = []
    let id_gates = []
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/gates/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            id_gates.push(res.query[i].id_gate)
            mac.push(res.query[i].mac)
        }
    }

    let location_names = []
    let location_ids = []
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/locations/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            location_ids.push(res.query[i].id_location)
            location_names.push(res.query[i].name)
        }
    }

    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let id_anchor = obj[i]["id_anchor"];

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let id_location = createTextSw(obj[i]["id_location"], location_names, location_ids)
        tr.appendChild(id_location);

        let gain = createInput(obj[i]["gain"], "any")
        tr.appendChild(gain);

        let id_gate = createDropdownMenu(obj[i]["id_gate"], mac, id_gates);
        tr.appendChild(id_gate);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            if (id_location.firstChild.id != '') { params["id_location"] = id_location.firstChild.id; }
            if (gain.firstChild.value != '') { params["gain"] = gain.firstChild.value; }
            if (id_gate.firstChild.id != '') { params["id_gate"] = id_gate.firstChild.id; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/anchor/' + id_anchor + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.name = res.name;
                    objRef.id_location = res.id_location;
                    objRef.gain = res.gain;
                    objRef.id_gate = res.id_gate;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/anchor/' + id_anchor + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = anchors.indexOf(objRef)
                    anchors.splice(idx, 1);
                    tr.remove();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }
}