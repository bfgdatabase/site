//module.js:

function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function showMessage(message, type) {
    /*
    showMessage("success", "success")
    showMessage("warning", "warning")
    showMessage("danger", "danger")*/

    let mes = document.getElementById('messages');
    let div = document.createElement('div');
    div.innerHTML = message;
    div.className = "alert alert-" + type;
    let btn = document.createElement('button');
    btn.className = 'close';
    btn.type = 'button';
    btn.innerHTML = '×'
    let span = document.createElement('button');
    span.className = 'glyphicon glyphicon-ok ';
    btn.addEventListener("click", function() {
        mes.innerHTML = "";
    });
    div.appendChild(btn);
    mes.appendChild(div);
}


function createText(value) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";
    let element = document.createElement('a');
    element.style = "margin:0";
    element.innerHTML = value;
    td.appendChild(element);
    return td;
}

function createInput(value, type) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";
    let element = document.createElement('input');
    element.type = type;
    element.className = "form-control form-control-sm";
    element.value = value;
    td.appendChild(element);
    return td;
}

function createTextarea(value, type) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";
    let element = document.createElement('textarea');
    element.rows = "4"
    element.cols = "50"
    element.type = type;
    element.className = "form-control form-control-sm";
    element.value = value;
    td.appendChild(element);
    return td;
}

function createButton(text, b_class) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";
    let btn = document.createElement('button');
    btn.type = "button";
    btn.style = "margin:0";
    btn.innerHTML = text;
    btn.className = "btn btn-sm btn-block " + b_class;
    td.appendChild(btn);
    return td;
}

function createCheckbox(value) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle; ";
    let element = document.createElement('input');
    element.type = "checkbox";
    element.style = "margin:0";
    element.checked = value;
    td.appendChild(element);
    return td;
}
code: "2"
equipment_id: 1
first_zone_id: "3"
first_zone_type: "ВХОД"
name: "3"
nop: "1"
second_zone_id: "1"
second_zone_type: "3"
t_nal: "3"
t_pz: "1"
t_sht: "2"
v_route_id: 1

function createSortButton(elements, type, createSortedTable) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-2";
    let btn = document.createElement('button');
    btn.type = "button";
    btn.value = 0;
    btn.innerHTML = "-";

    btn.className = "btn btn-sm btn-outline-dark btn-rounded btn-block";
    btn.addEventListener("click", function() {
        if (btn.value == 0) {
            btn.value = 1;
            btn.innerHTML = "▼";
            elements.sort(function(a, b) {
                if (a[type] > b[type]) { return 1; }
                if (a[type] < b[type]) { return -1; }
                return 0;
            });
        } else if (btn.value == 1) {
            btn.value = 0;
            btn.innerHTML = "▲";
            elements.sort(function(a, b) {
                if (a[type] < b[type]) { return 1; }
                if (a[type] > b[type]) { return -1; }
                return 0;
            });
        }
        createSortedTable(elements)
    });
    td.appendChild(btn);
    return td;
}

function createTextSw(id, variants, ids) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    let element = document.createElement('a');
    element.style = "margin:0";
    element.id = id;

    for (let i = 0; i < variants.length; ++i) {
        if (id == ids[i]) {
            element.innerHTML = variants[i];
        }
    }
    td.appendChild(element);
    return td;
}


function createDropdownMenu(id, variants, ids) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    let buttonSelect = document.createElement('button');
    buttonSelect.className = "btn btn-primary btn-sm dropdown-toggle btn-block";
    buttonSelect.id = "";

    buttonSelect.setAttribute("data-toggle", "dropdown");

    let menuSelect = document.createElement('div');
    menuSelect.className = "dropdown-menu";

    let el = document.createElement('a');
    el.className = "dropdown-item";
    el.innerHTML = "-";
    el.id = "";

    el.addEventListener("click", function() {
        buttonSelect.id = "";
        buttonSelect.innerHTML = "-";
        // drawPath();
    });
    menuSelect.appendChild(el);

    for (let i = 0; i < variants.length; ++i) {

        if (id == ids[i]) {
            buttonSelect.id = ids[i];
            buttonSelect.innerHTML = variants[i];
        }
        let el = document.createElement('a');
        el.className = "dropdown-item";
        el.innerHTML = variants[i];
        el.id = ids[i];

        el.addEventListener("click", function() {
            buttonSelect.id = el.id;
            buttonSelect.innerHTML = el.innerHTML;
        });

        menuSelect.appendChild(el);
    }
    td.appendChild(buttonSelect);
    td.appendChild(menuSelect);
    return td;
}

function createDropdownMenu_(id, variants, ids) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    let buttonSelect = document.createElement('button');
    buttonSelect.className = "btn btn-primary btn-sm dropdown-toggle btn-block";
    buttonSelect.id = "";

    buttonSelect.setAttribute("data-toggle", "dropdown");

    let menuSelect = document.createElement('div');
    menuSelect.className = "dropdown-menu";

    let el = document.createElement('a');
    el.addEventListener("click", function() {
        buttonSelect.id = "";
        buttonSelect.innerHTML = "-";
        // drawPath();
    });
    menuSelect.appendChild(el);

    for (let i = 0; i < variants.length; ++i) {

        if (id == ids[i]) {
            buttonSelect.id = ids[i];
            buttonSelect.innerHTML = variants[i];
        }
        let el = document.createElement('a');
        el.className = "dropdown-item";
        el.innerHTML = variants[i];
        el.id = ids[i];

        el.addEventListener("click", function() {
            buttonSelect.id = el.id;
            buttonSelect.innerHTML = el.innerHTML;
        });

        menuSelect.appendChild(el);
    }
    td.appendChild(buttonSelect);
    td.appendChild(menuSelect);
    return td;
}

function createTextFromVariants(id, variants, ids) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    let el = document.createElement('a');
    el.style = "margin:0";
    el.id = "";

    for (let i = 0; i < variants.length; ++i) {
        if (id == ids[i]) {

            el.innerHTML = variants[i];
            el.id = ids[i];
        }
    }
    td.appendChild(el);

    return td;
}

function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
  }