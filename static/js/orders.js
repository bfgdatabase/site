(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()

let orders = []
let spec_name = []
let id_specs = []

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

$(document).ready(createPage());

function createPage() {

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/specifications/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        var res = JSON.parse(xhr.responseText);
        for (var i = 0; i < res.query.length; i++) {
            id_specs.push(res.query[i].id_spec)
            spec_name.push(res.query[i].name)
        }
    }

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/orders/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
    } else {
        orders = JSON.parse(xhr.responseText).query;
        createTableBtns(orders)
        createSortedTable(orders)
    }
}

function createTableBtns(obj) {

    let table = document.getElementById('tableBtns');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    let tr = document.createElement('tr');
    let bt = createSortButton(obj, "order_name", createSortedTable)
    tr.appendChild(bt);
    let bt1 = createSortButton(obj, "order_num", createSortedTable)
    tr.appendChild(bt1);
    let bt2 = createSortButton(obj, "customer", createSortedTable)
    tr.appendChild(bt2);
    let bt3 = document.createElement('td');
    tr.appendChild(bt3);
    let b4 = createSortButton(obj, "product_name", createSortedTable)
    tr.appendChild(b4);
    let bt5 = createSortButton(obj, "created", createSortedTable)
    tr.appendChild(bt5);
    let bt6 = createSortButton(obj, "started", createSortedTable)
    tr.appendChild(bt6);
    let bt7 = createSortButton(obj, "closed", createSortedTable)
    tr.appendChild(bt7);
    table.appendChild(tr);
}

function createSortedTable(obj) {

    let table = document.getElementById('tableBody');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < obj.length; i++) {

        let objRef = obj[i];

        let tr = document.createElement('tr');
        let id_order = obj[i]["id_order"];

        let order_name = createInput(obj[i]["order_name"], "any")
        tr.appendChild(order_name);
        let order_num = createInput(obj[i]["order_num"], "any")
        tr.appendChild(order_num);
        let customer = createInput(obj[i]["customer"], "any")
        tr.appendChild(customer);
        let id_spec = createDropdownMenu(obj[i]["code_spec"], spec_name, id_specs);
        tr.appendChild(id_spec);
        let product_name = createInput(obj[i]["product_name"], "any")
        tr.appendChild(product_name);
        let created = createText(obj[i]["created"])
        tr.appendChild(created);
        let started = createText(obj[i]["started"])
        tr.appendChild(started);
        let closed = createText(obj[i]["closed"])
        tr.appendChild(closed);

        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let params = {}
            if (order_name.firstChild.value != '') { params["order_name"] = order_name.firstChild.value; }
            if (order_num.firstChild.value != '') { params["order_num"] = order_num.firstChild.value; }
            if (customer.firstChild.value != '') { params["customer"] = customer.firstChild.value; }
            if (id_spec.firstChild.id != '') { params["code_spec"] = id_spec.firstChild.id; }
            if (product_name.firstChild.value != '') { params["product_name"] = product_name.firstChild.value; }

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/order/' + id_order + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query
                    objRef.order_name = res.order_name;
                    objRef.order_num = res.order_num;
                    objRef.customer = res.customer;
                    objRef.code_spec = res.code_spec;
                    objRef.product_name = res.product_name;
                    created.firstChild.value = res.created;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });

        let btn_delete = createButton("Удалить", "btn-danger");
        tr.appendChild(btn_delete);
        btn_delete.addEventListener("click", function() {
            var xhr = new XMLHttpRequest();
            xhr.open('DELETE', '/api/order/' + id_order + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify();
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let idx = orders.indexOf(objRef)
                    orders.splice(idx, 1);
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

    let order_name = createInput("", "any")
    tr.appendChild(order_name);
    let order_num = createInput("", "any")
    tr.appendChild(order_num);
    let customer = createInput("", "any")
    tr.appendChild(customer);
    let id_spec = createDropdownMenu("", spec_name, id_specs);
    tr.appendChild(id_spec);
    let product_name = createInput("", "any")
    tr.appendChild(product_name);

    let btn_save = createButton("Добавить", "btn-secondary");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let params = {}

        if (order_name.firstChild.value != '') { params["order_name"] = order_name.firstChild.value; }
        if (order_num.firstChild.value != '') { params["order_num"] = order_num.firstChild.value; }
        if (customer.firstChild.value != '') { params["customer"] = customer.firstChild.value; }
        if (id_spec.firstChild.id != '') { params["code_spec"] = id_spec.firstChild.id; }
        if (product_name.firstChild.value != '') { params["product_name"] = product_name.firstChild.value; }

        var xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/order/', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                var result = JSON.parse(xhr.responseText);

                obj.push(result.query);
                let objRef = obj[obj.length - 1];

                let tr_new = document.createElement('tr');
                let id_order = result.query["id_order"];

                let order_name = createInput(result.query["order_name"], "any")
                tr_new.appendChild(order_name);
                let order_num = createInput(result.query["order_num"], "any")
                tr_new.appendChild(order_num);
                let customer = createInput(result.query["customer"], "any")
                tr_new.appendChild(customer);
                let id_spec = createDropdownMenu(result.query["code_spec"], spec_name, id_specs);
                tr_new.appendChild(id_spec);
                let product_name = createInput(result.query["product_name"], "any")
                tr_new.appendChild(product_name);
                let created = createText(result.query["created"])
                tr_new.appendChild(created);
                let started = createText(result.query["started"])
                tr_new.appendChild(started);
                let closed = createText(result.query["closed"])
                tr_new.appendChild(closed);


                let btn_save = createButton("Сохранить", "btn-warning");
                tr_new.appendChild(btn_save);
                btn_save.addEventListener("click", function() {
                    let params = {}
                    if (order_name.firstChild.value != '') { params["order_name"] = order_name.firstChild.value; }
                    if (order_num.firstChild.value != '') { params["order_num"] = order_num.firstChild.value; }
                    if (customer.firstChild.value != '') { params["customer"] = customer.firstChild.value; }
                    if (id_spec.firstChild.id != '') { params["code_spec"] = id_spec.firstChild.id; }
                    if (product_name.firstChild.value != '') { params["product_name"] = product_name.firstChild.value; }

                    var xhr = new XMLHttpRequest();
                    xhr.open('PUT', '/api/order/' + id_order + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify(params);
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let res = JSON.parse(xhr.response).query
                            objRef.order_name = res.order_name;
                            objRef.order_num = res.order_num;
                            objRef.customer = res.customer;
                            objRef.code_spec = res.code_spec;
                            objRef.product_name = res.product_name;
                            created.firstChild.value = res.created;
                        } else { showMessage(xhr.response, "danger"); }
                    }
                    xhr.send(json);
                });

                let btn_delete = createButton("Удалить", "btn-danger");
                tr_new.appendChild(btn_delete);
                btn_delete.addEventListener("click", function() {
                    var xhr = new XMLHttpRequest();
                    xhr.open('DELETE', '/api/order/' + id_order + '/', true);
                    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                    let json = JSON.stringify();
                    xhr.onload = function() {
                        if (xhr.readyState == 4 && xhr.status == "200") {
                            let idx = orders.indexOf(objRef)
                            orders.splice(idx, 1);
                            tr_new.remove()
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