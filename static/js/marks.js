(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/markers/', false);
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
    let bt1 = createSortButton(obj, "id_tag", createSortedTable)
    tr.appendChild(bt1);
    table.appendChild(tr);
}

function createSortedTable(obj) {

    let tag_uuid = []
    let tag_id = []
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/tags/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            tag_id.push(res.query[i].id_tag)
            tag_uuid.push(res.query[i].uuid)
        }
    }

    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let id_mark = obj[i]["id_mark"];

        let name = createInput(obj[i]["name"], "any")
        tr.appendChild(name);

        let id_tag = createDropdownMenu(obj[i]["id_tag"], tag_uuid, tag_id);
        tr.appendChild(id_tag);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (id_tag.firstChild.id != '') { params["id_tag"] = id_tag.firstChild.id; }
            if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/markers/' + id_mark + '/', true);
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
            xhr.open('DELETE', '/api/marker/' + id_mark + '/', true);
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

    let tableAdd = document.getElementById('tableAdd');
    tableAdd.className = "table table-hover table-striped";
    tableAdd.innerHTML = "";

    let tr = document.createElement('tr');
    let name = createInput("", "any")
    tr.appendChild(name);

    let id_tag = createDropdownMenu("", tag_uuid, tag_id);
    tr.appendChild(id_tag);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}
        if (id_tag.firstChild.id != '') { params["id_tag"] = id_tag.firstChild.id; }
        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/marker/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            var result = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {

                obj.push(result.query);
                let tr_new = document.createElement('tr');
                let id_mark = result.query["id_mark"];

                let name = createInput(result.query["name"], "any")
                tr_new.appendChild(name);

                let id_tag = createDropdownMenu(result.query["id_tag"], tag_uuid, tag_id);
                tr_new.appendChild(id_tag);

                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (id_tag.firstChild.id != '') { params["id_tag"] = id_tag.firstChild.id; }
                    if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }

                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/markers/' + id_mark + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        var result = JSON.parse(xhr.responseText);
                        if (xhr.readyState == 4 && xhr.status == "200") {} else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/marker/' + id_mark + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        var result = JSON.parse(xhr.responseText);
                        if (xhr.readyState == 4 && xhr.status == "200") { tr.remove() } else { showMessage(xhr.response, "danger"); }
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