(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/roles/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var obj = JSON.parse(xhr.responseText);
        createSortedTable(obj.query)
    }
}

function createSortedTable(obj) {

    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let id_role = obj[i]["id_role"];

        let role = createInput(obj[i]["role"], "any")
        tr.appendChild(role);

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {

            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/role/' + id_role + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") { createPage(); } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send();

        });

        table.appendChild(tr);
    }

    {
        let tr = document.createElement('tr');

        let role = createInput("", "any")
        tr.appendChild(role);

        let btn_save = createButton("Добавить", "btn-primary");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {

            let params = {}
            if (role.firstChild.value != '') { params["role"] = role.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/role/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") { createPage(); } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);

        });

        table.appendChild(tr);
    }
}