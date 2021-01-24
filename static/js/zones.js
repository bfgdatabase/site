(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let location_names = []
let location_ids = []
let anchor_name = []
let id_anchors = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////


$(document).ready(function() {

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
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/anchors/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var obj = JSON.parse(xhr.responseText);
        for (var i = 0; i < obj.query.length; i++) {
            id_anchors.push(obj.query[i].id_anchor)
            anchor_name.push(obj.query[i].name)
        }
    }
    createPage()
});

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/zones/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var obj = JSON.parse(xhr.responseText);
        createTableBtns(obj.query)
        createSortedTable(obj.query)
    }
}


function createTableBtns(obj) {

    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "name", createSortedTable)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "id_location", createSortedTable)
    tr.appendChild(bt1);
    table.appendChild(tr);
}

function createSortedTable(obj) {
    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let id_zone = obj[i]["id_zone"];

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let id_location = createTextSw(obj[i]["id_location"], location_names, location_ids)
        tr.appendChild(id_location);

        let weight = createInput(obj[i]["weight"], "any")
        tr.appendChild(weight);

        let sharp = createInput(obj[i]["sharp"], "any")
        tr.appendChild(sharp);

        let type = createInput(obj[i]["type"], "any")
        tr.appendChild(type);

        let threshold_in = createInput(obj[i]["threshold_in"], "any")
        tr.appendChild(threshold_in);

        let threshold_out = createInput(obj[i]["threshold_out"], "any")
        tr.appendChild(threshold_out);

        let anchor = createDropdownMenu(obj[i]["id_anchor"], anchor_name, id_anchors);
        tr.appendChild(anchor);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }
            if (id_location.firstChild.id != '') { params["id_location"] = id_location.firstChild.id; }
            if (weight.firstChild.value != '') { params["weight"] = weight.firstChild.value; }
            if (sharp.firstChild.value != '') { params["sharp"] = sharp.firstChild.value; }
            if (type.firstChild.value != '') { params["type"] = type.firstChild.value; }
            if (threshold_in.firstChild.value != '') { params["threshold_in"] = threshold_in.firstChild.value; }
            if (threshold_out.firstChild.value != '') { params["threshold_out"] = threshold_out.firstChild.value; }
            if (anchor.firstChild.id != '') { params["id_anchor"] = anchor.firstChild.id; }
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/zone/' + id_zone + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                var result = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "200") {} else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/zone/' + id_zone + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                var result = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "200") { tr.remove() } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        table.appendChild(tr);
    }
}