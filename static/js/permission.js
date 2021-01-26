(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/permissions/', false);
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
        tr.id = obj[i]["id_permission"];
        let id_permission = obj[i]["id_permission"];

        let role = createText(obj[i]["role"])
        tr.appendChild(role);
        let tb = createText(obj[i]["table"])
        tr.appendChild(tb);

        let get = createCheckbox(obj[i]["get"])
        tr.appendChild(get);
        let put = createCheckbox(obj[i]["put"])
        tr.appendChild(put);
        let del = createCheckbox(obj[i]["delete"])
        tr.appendChild(del);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);


        btn_save.addEventListener("click", function() {

            let params = {}
            params["get"] = get.firstChild.checked;
            params["put"] = put.firstChild.checked;
            params["delete"] = del.firstChild.checked;
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/permissions/' + id_permission + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {} else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        table.appendChild(tr);
    }

    let tr = document.createElement('tr');
    let btn_save = createButton("Сохранить все", "btn-secondary");
    let d = document.createElement('td');
    let d1 = document.createElement('td');
    let d2 = document.createElement('td');
    let d3 = document.createElement('td');
    let d4 = document.createElement('td');
    tr.appendChild(d);
    tr.appendChild(d1);
    tr.appendChild(d2);
    tr.appendChild(d3);
    tr.appendChild(d4);
    tr.appendChild(btn_save);

    btn_save.addEventListener("click", function() {

        let childs = table.childNodes;
        for (var i = 0; i < childs.length - 1; i++) {

            let params = {}
            let id = childs[i].id;
            params["get"] = childs[i].childNodes[2].children[0].checked;
            params["put"] = childs[i].childNodes[3].children[0].checked;
            params["delete"] = childs[i].childNodes[4].children[0].checked;
            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/permissions/' + id + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {} else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        }
    });

    table.appendChild(tr);
}