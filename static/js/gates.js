(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let gates = []
    ///////////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/gates/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        gates = JSON.parse(xhr.responseText).query;
        createTableBtns(gates)
        createSortedTable(gates)
    }
}

function createTableBtns(obj) {

    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "mac", createSortedTable)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "created", createSortedTable)
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
        let id_gate = obj[i]["id_gate"];

        let mac = createText(obj[i]["mac"], "any")
        tr.appendChild(mac);
        let created = createText(obj[i]["created"], "any")
        tr.appendChild(created);
        let gain = createInput(obj[i]["gain"], "any")
        tr.appendChild(gain);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);

        btn_save.addEventListener("click", function() {

            let params = {}
            if (gain.firstChild.value != '') { params["gain"] = gain.firstChild.value; }
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/gates/' + id_gate + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.gain = res.gain;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);

        });

        table.appendChild(tr);
    }
}