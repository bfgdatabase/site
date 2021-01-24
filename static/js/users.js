(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/users/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var obj = JSON.parse(xhr.responseText);
        createSortedTable(obj.query)
    }
}


function createSortedTable(obj) {

    let roles = []
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/roles/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            roles.push(res.query[i].role)
        }
    }
    roles.push('administrator')

    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let tr = document.createElement('tr');
        let user_id = obj[i]["user_id"];

        let login = createInput(obj[i]["login"], "any")
        tr.appendChild(login);
        let username = createInput(obj[i]["username"], "any")
        tr.appendChild(username);
        let email = createInput(obj[i]["email"], "any")
        tr.appendChild(email);
        let phone = createInput(obj[i]["phone"], "any")
        tr.appendChild(phone);
        let role = createDropdownMenu(obj[i]["role"], roles, roles);
        //role.firstChild.style = "width:150px;";
        tr.appendChild(role);
        let info = createTextarea(obj[i]["info"], "any")
        info.firstChild.rows = "2"
        info.firstChild.cols = "50"
        info.firstChild.style = "resize:none"
        tr.appendChild(info);
        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        let btn_delete = createButton(" Удалить", "btn-danger");
        tr.appendChild(btn_delete);


        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/user/' + user_id + '/', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {
                var result = JSON.parse(xhr.responseText);
                if (xhr.readyState == 4 && xhr.status == "200") {
                    createPage();
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send();
        });

        btn_save.addEventListener("click", function() {
            let params = {}
            if (login.firstChild.value != '') { params["login"] = login.firstChild.value; }
            if (username.firstChild.value != '') { params["username"] = username.firstChild.value; }
            if (email.firstChild.value != '') { params["email"] = email.firstChild.value; }
            if (phone.firstChild.value != '') { params["phone"] = phone.firstChild.value; }
            if (role.firstChild.innerHTML != '-') { params["role"] = role.firstChild.innerHTML; }
            if (info.firstChild.value != '') { params["info"] = info.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/user/' + user_id + '/', true);
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