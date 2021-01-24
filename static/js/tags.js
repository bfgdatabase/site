(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/tags/', false);
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
    let bt = createSortButton(obj, "uuid", createSortedTable)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "mac", createSortedTable)
    tr.appendChild(bt1);
    let bt2 = createSortButton(obj, "created", createSortedTable)
    tr.appendChild(bt2);
    table.appendChild(tr);
}

function createSortedTable(obj) {

    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let id_tag = obj[i]["id_tag"];

        let uuid = createText(obj[i]["uuid"], "any")
        tr.appendChild(uuid);
        let mac = createText(obj[i]["mac"], "any")
        tr.appendChild(mac);
        let created = createText(obj[i]["created"], "any")
        tr.appendChild(created);
        let tag_gain = createInput(obj[i]["tag_gain"], "any")
        tr.appendChild(tag_gain);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);

        btn_save.addEventListener("click", function() {

            let params = {}
            if (tag_gain.firstChild.value != '') { params["tag_gain"] = tag_gain.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/tags/' + id_tag + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                var result = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "200") {} else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);

        });

        table.appendChild(tr);
    }
}