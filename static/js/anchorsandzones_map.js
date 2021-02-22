(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let markers = new Array();
let zonesPoly = new Array();
class mapObj {
    constructor(obj, id, name) {
        this.obj = obj;
        this.id = id;
        this.name = name;
    }
}

let location = []
let anchors = []
let zones = []
let editableLayers = []
let scale = 1
let selectedFeature = null;

$(document).ready(createPage());


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function editAnchor(x, y, name, id) {
    let filtered = markers.findIndex(function(el, index) {
        if (el.id == id) {
            el.obj._latlng.lat = y / scale;
            el.obj._latlng.lng = x / scale;
            let newLatLng = new L.LatLng(y / scale, x / scale);
            el.obj.setLatLng(newLatLng);
            el.obj._popup.setContent(name);
        }
    });
}

function deleteAnchor(id) {
    let filtered = markers.findIndex(function(el, index) {
        if (el.id == id) {
            editableLayers.removeLayer(el.obj._leaflet_id);
            return index;
        }
    });
    markers.splice(filtered, 1);
}

function addAnchorToMap(x, y, name, id) {
    let marker = L.marker([y / scale, x / scale]).addTo(editableLayers).bindPopup(name).on('click', onClick);;
    markers.push(new mapObj(marker, id, name));
}

function addZoneToMap(zone) {
    const str = zone.points,
        array = str.match(/\d+(?:\.\d+)?/g).map(Number)
    var ans = [];
    for (var j = 0; j < array.length; j = j + 2) {
        ans.push([array[j] / scale, array[j + 1] / scale]);
    }
    var polygon = L.polygon(ans).addTo(editableLayers).bindPopup(zone.name).on('click', onClick);
    zonesPoly.push(new mapObj(polygon, zone.id_zone, zone.name));
}

function editZone(zone) {
    let filtered = zonesPoly.findIndex(function(el, index) {
        if (el.id == zone.id_zone) {
            const str = zone.points,
                array = str.match(/\d+(?:\.\d+)?/g).map(Number)
            var ans = [];
            for (var j = 0; j < array.length; j = j + 2) {
                ans.push([array[j + 1] / scale, array[j] / scale]);
            }
            editableLayers.removeLayer(el.obj._leaflet_id);
            var polygon = L.polygon(ans).addTo(editableLayers).bindPopup(zone.name).on('click', onClick);
            el = polygon;
            zonesPoly.splice(index, 1);
            zonesPoly.push(new mapObj(polygon, zone.id_zone, zone.name));
        }
    });
}

function createPage() {
    L.Projection.NoWrap = {
        project: function(latlng) {
            return new L.Point(latlng.lng, latlng.lat);
        },

        unproject: function(point, unbounded) {
            return new L.LatLng(point.y, point.x, true);
        }
    };

    L.CRS.Direct = L.Util.extend({}, L.CRS, {
        code: 'Direct',

        projection: L.Projection.NoWrap,
        transformation: new L.Transformation(1, 0, 1, 0)
    });

    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/location/' + id_location + '/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
        return;
    } else {
        location = JSON.parse(xhr.response).query
    }

    let location_name = document.getElementById('location_name');
    location_name.innerHTML = location.name;

    // center of the map
    let y0 = location.zero_x;
    let x0 = location.zero_y;
    let y1 = x0 + location.width;
    let x1 = y0 + location.length;

    let vx = Math.abs(x1 - x0)
    let vy = Math.abs(y1 - y0)

    scale = Math.max(vx, vy);

    let map = L.map('map', { worldCopyJump: false, crs: L.CRS.Direct });

    if ((location.imageurl == "None") | (location.imageurl == null)) {
        location.imageurl = "map.jpg";
    }
    let mapBounds = [
        [x0 / scale, y0 / scale],
        [x1 / scale, y1 / scale]
    ];
    let imageUrl = '/static/images/maps/' + location.imageurl,
        imageBounds = mapBounds;

    L.imageOverlay(imageUrl, mapBounds).addTo(map);

    editableLayers = new L.FeatureGroup();
    map.addLayer(editableLayers);
    map.fitBounds(mapBounds);

    let params = {}
    params["id_location"] = id_location;
    let json = JSON.stringify(params);

    {
        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/anchors/', false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function() {
            if (xhr.status != 200) {
                showMessage(xhr.response, "danger");
            } else {
                anchors = JSON.parse(xhr.response).query
                for (let anchor of anchors) {
                    addAnchorToMap(anchor.x_pos, anchor.y_pos, anchor.name, anchor.id_anchor);
                }
            }
        }
        xhr.send(json);
    }

    {
        let xhr1 = new XMLHttpRequest();
        xhr1.open('POST', '/api/zones/', false);
        xhr1.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr1.onload = function() {
            if (xhr1.status != 200) {
                showMessage(xhr1.response, "danger");
            } else {
                zones = JSON.parse(xhr1.response).query
                for (let zone of zones) {
                    addZoneToMap(zone);
                }
            }
        }
        xhr1.send(json);
    }

    let table = document.getElementById('selectBtns');

    table.className = "table table-hover table-striped";
    table.innerHTML = "";
    let tr = document.createElement('tr');

    let btn_select_anchors = createButton("Анкеры", "btn-primary");
    tr.appendChild(btn_select_anchors);
    btn_select_anchors.addEventListener("click", function() {
        let v = document.getElementById('tableName');
        createAnchorTable();
        v.innerHTML = "Анкеры";
    });
    tr.appendChild(btn_select_anchors);

    let btn_select_zones = createButton("Зоны", "btn-primary");
    tr.appendChild(btn_select_zones);
    btn_select_zones.addEventListener("click", function() {
        let v = document.getElementById('tableName');
        createZoneTable();
        v.innerHTML = "Зоны";
    });
    tr.appendChild(btn_select_zones);
    table.appendChild(tr);

    let v = document.getElementById('tableName');
    createAnchorTable();
    v.innerHTML = "Анкеры";

    map.on('draw:editvertex', function(e) {
        let filtered = zonesPoly.findIndex(function(el) {
            if (el.obj._leaflet_id == e.poly._leaflet_id) {

                var latlon = "(("
                for (let i = 0; i < e.poly._latlngs[0].length - 1; i++) {
                    latlon += e.poly._latlngs[0][i].lng * scale;
                    latlon += ", ";
                    latlon += e.poly._latlngs[0][i].lat * scale;
                    latlon += "), ("
                }
                latlon += e.poly._latlngs[0][e.poly._latlngs[0].length - 1].lng * scale;
                latlon += ", ";
                latlon += e.poly._latlngs[0][e.poly._latlngs[0].length - 1].lat * scale;
                latlon += "))";

                let filtered = zones.findIndex(function(elt) {
                    if (elt.id_zone == el.id) {
                        elt.points = latlon;
                        editZoneTable(elt);
                    }

                });
            }
        });
    });
}


function createAnchorTable() {
    let table = document.getElementById('selectTable');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (let i = 0; i < anchors.length; i++) {
        let tr = document.createElement('tr');
        tr.id = anchors[i].id_anchor;
        let text = createText(anchors[i].name)
        tr.appendChild(text);
        let ref = anchors[i]; {
            let td = document.createElement('td');
            td.style = "vertical-align:middle";
            td.className = "px-1";
            let btn = document.createElement('button');
            btn.type = "button";
            btn.className = "btn btn-sm btn-warning px-2";
            let fa = document.createElement('i');
            fa.className = "fas fa-edit";
            btn.appendChild(fa);
            td.appendChild(btn);
            tr.appendChild(td);
            td.addEventListener("click", function() {
                editAnchorTable(ref);
            });
        } {
            let td = document.createElement('td');
            td.style = "vertical-align:middle";
            td.className = "px-1";
            let btn = document.createElement('button');
            btn.type = "button";
            btn.className = "btn btn-sm btn-danger px-2";
            let fa = document.createElement('i');
            fa.className = "fas fa-trash";
            btn.appendChild(fa);
            td.appendChild(btn);
            td.addEventListener("click", function() {
                let xhr = new XMLHttpRequest();
                xhr.open('DELETE', '/api/anchor/' + tr.id + '/', true);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.onload = function() {
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        for (let i = 0; i < anchors.length; i++) {
                            if (anchors[i].id_anchor == tr.id) {
                                anchors.splice(i, 1);
                                break;
                            }
                        }
                        let v = document.getElementById('tableName');
                        createAnchorTable();
                        v.innerHTML = "Анкеры";
                        deleteAnchor(tr.id);
                        let tmp = document.getElementById('editTable');
                        tmp.innerHTML = "";
                    } else { showMessage(xhr.response, "danger"); }
                }
                xhr.send();

            });
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    let tr = document.createElement('tr');
    let new_anchor = createButton("Добавить", "btn-success");
    tr.appendChild(new_anchor);
    new_anchor.addEventListener("click", function() {
        newAnchorTable();
    });
    tr.appendChild(new_anchor);
    table.appendChild(tr);

    return table;
}

function newAnchorTable() {
    {
        let table = document.getElementById('editTableHead');
        table.className = "thead-dark";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createText("Имя")
        tr.appendChild(name);

        let x_pos = createText("X")
        tr.appendChild(x_pos);

        let y_pos = createText("Y")
        tr.appendChild(y_pos);

        let space = createText("")
        tr.appendChild(space);

        table.appendChild(tr);
    }

    {
        let table = document.getElementById('editTable');
        table.className = "table table-hover table-striped";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createInput("", "any")
        tr.appendChild(name);

        let x_pos = createInput("", "any")
        tr.appendChild(x_pos);

        let y_pos = createInput("", "any")
        tr.appendChild(y_pos);


        let btn_save = createButton("Добавить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let tmp = 0;
            let params = {}
            params["id_location"] = id_location;
            params["name"] = name.firstChild.value;
            tmp = x_pos.firstChild.value;
            if (tmp == "") params["x_pos"] = "0";
            else params["x_pos"] = x_pos.firstChild.value;
            tmp = y_pos.firstChild.value;
            if (tmp == "") params["y_pos"] = "0";
            else params["y_pos"] = y_pos.firstChild.value;

            let xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/anchor/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query;
                    anchors.push(res);
                    let table = document.getElementById('editTable');
                    table.className = "table table-hover table-striped";
                    table.innerHTML = "";
                    let v = document.getElementById('tableName');
                    createAnchorTable();
                    v.innerHTML = "Анкеры";
                    addAnchorToMap(res.x_pos, res.y_pos, res.name, res.id_anchor);
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        table.appendChild(tr);
    }
}

function editAnchorTable(odj) {
    {
        let table = document.getElementById('editTableHead');
        table.className = "thead-dark";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createText("Имя")
        tr.appendChild(name);

        let x_pos = createText("X")
        tr.appendChild(x_pos);

        let y_pos = createText("Y")
        tr.appendChild(y_pos);

        let space = createText("")
        tr.appendChild(space);

        table.appendChild(tr);
    }

    {
        let table = document.getElementById('editTable');
        table.className = "table table-hover table-striped";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createInput(odj.name, "any")
        tr.appendChild(name);

        let x_pos = createInput(odj.x_pos, "any")
        tr.appendChild(x_pos);

        let y_pos = createInput(odj.y_pos, "any")
        tr.appendChild(y_pos);


        let btn_save = createButton("Сохранить", "btn-warning");
        tr.appendChild(btn_save);
        btn_save.addEventListener("click", function() {
            let tmp = 0;
            let params = {}
            params["name"] = name.firstChild.value;
            tmp = x_pos.firstChild.value;
            if (tmp == "") params["x_pos"] = "0";
            else params["x_pos"] = x_pos.firstChild.value;
            tmp = y_pos.firstChild.value;
            if (tmp == "") params["y_pos"] = "0";
            else params["y_pos"] = y_pos.firstChild.value;

            let xhr = new XMLHttpRequest();
            xhr.open('PUT', '/api/anchor/' + odj.id_anchor + '/', true);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            let json = JSON.stringify(params);
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query;
                    odj.name = res.name;
                    odj.x_pos = res.x_pos;
                    odj.y_pos = res.y_pos;
                    let v = document.getElementById('tableName');
                    createAnchorTable();
                    v.innerHTML = "Анкеры";
                    editAnchor(res.x_pos, res.y_pos, res.name, odj.id_anchor);
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);
        });
        table.appendChild(tr);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function createZoneTable() {
    let table = document.getElementById('selectTable');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (let i = 0; i < zones.length; i++) {
        let tr = document.createElement('tr');
        tr.id = zones[i].id_zone;
        let text = createText(zones[i].name)
        tr.appendChild(text);
        let ref = zones[i]; {
            let td = document.createElement('td');
            td.style = "vertical-align:middle";
            td.className = "px-1";
            let btn = document.createElement('button');
            btn.type = "button";
            btn.className = "btn btn-sm btn-warning px-2";
            let fa = document.createElement('i');
            fa.className = "fas fa-edit";
            btn.appendChild(fa);
            td.appendChild(btn);
            tr.appendChild(td);
            td.addEventListener("click", function() {
                editZoneTable(ref);
            });
        } {
            let td = document.createElement('td');
            td.style = "vertical-align:middle";
            td.className = "px-1";
            let btn = document.createElement('button');
            btn.type = "button";
            btn.className = "btn btn-sm btn-danger px-2";
            let fa = document.createElement('i');
            fa.className = "fas fa-trash";
            btn.appendChild(fa);
            td.appendChild(btn);
            td.addEventListener("click", function() {
                let xhr = new XMLHttpRequest();
                xhr.open('DELETE', '/api/zone/' + tr.id + '/', true);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.onload = function() {
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        for (let i = 0; i < zones.length; i++) {
                            if (zones[i].id_zone == tr.id) {
                                zones.splice(i, 1);
                                break;
                            }
                        }
                        let v = document.getElementById('tableName');
                        createZoneTable();
                        v.innerHTML = "Анкеры";
                        deleteZone(tr.id);
                        let tmp = document.getElementById('editTable');
                        tmp.innerHTML = "";
                    } else { showMessage(xhr.response, "danger"); }
                }
                xhr.send();

            });
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    let tr = document.createElement('tr');
    let new_zone = createButton("Добавить", "btn-success");
    tr.appendChild(new_zone);
    new_zone.addEventListener("click", function() {
        newZoneTable();
    });
    tr.appendChild(new_zone);
    table.appendChild(tr);
    return table;
}

function newZoneTable() {
    {
        let table = document.getElementById('editTableHead');
        table.className = "thead-dark";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createText("Имя")
        tr.appendChild(name);

        let x_pos = createText("X")
        tr.appendChild(x_pos);

        let y_pos = createText("Y")
        tr.appendChild(y_pos);

        let space = createText("")
        tr.appendChild(space);

        table.appendChild(tr);
    }


    let main_table = document.getElementById('editTable');
    main_table.className = "table table-hover table-striped";
    main_table.innerHTML = "";

    let tr = document.createElement('tr');

    let name = createInput("", "any")
    tr.appendChild(name);

    let x_pos = createInput("", "any")
    tr.appendChild(x_pos);

    let y_pos = createInput("", "any")
    tr.appendChild(y_pos);


    let btn_save = createButton("Добавить", "btn-warning");
    tr.appendChild(btn_save);
    btn_save.addEventListener("click", function() {
        let tmp = 0;
        var latlon = "(("
        let pNum = main_table.childNodes.length;
        for (let i = 0; i < pNum - 1; ++i) {

            tmp = main_table.childNodes[i].childNodes[1].children[0].value;
            if (tmp == "") latlon += "0";
            else { latlon += tmp };
            latlon += ", ";

            tmp = main_table.childNodes[i].childNodes[1].children[0].value;
            if (tmp == "") latlon += "0";
            else { latlon += tmp };
            latlon += "), ("
        }
        tmp = main_table.childNodes[pNum - 1].childNodes[1].children[0].value;
        if (tmp == "") latlon += "0";
        else { latlon += tmp };
        latlon += ", ";
        tmp = main_table.childNodes[pNum - 1].childNodes[2].children[0].value;
        if (tmp == "") latlon += "0";
        else { latlon += tmp };
        latlon += "))";

        let params = {}
        params["id_location"] = id_location;
        params["points"] = latlon;
        if (name.firstChild.value != '') { params["name"] = name.firstChild.value; }

        let xhr = new XMLHttpRequest();
        xhr.open('POST', '/api/zone', true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        let json = JSON.stringify(params);
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                let res = JSON.parse(xhr.response).query;
                zones.push(res);
                let table = document.getElementById('editTable');
                table.className = "table table-hover table-striped";
                table.innerHTML = "";
                let v = document.getElementById('tableName');
                createZoneTable();
                v.innerHTML = "Зоны";
                addZoneToMap(res);
            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send(json);
    });
    main_table.appendChild(tr); {

        let tr = document.createElement('tr');

        let space = createText("")
        tr.appendChild(space);

        let x_pos = createInput("", "any")
        tr.appendChild(x_pos);

        let y_pos = createInput("", "any")
        tr.appendChild(y_pos);

        let space1 = createText("")
        tr.appendChild(space1);

        main_table.appendChild(tr);

    } {

        let tr = document.createElement('tr');

        let space = createText("")
        tr.appendChild(space);

        let x_pos = createInput("", "any")
        tr.appendChild(x_pos);

        let y_pos = createInput("", "any")
        tr.appendChild(y_pos);

        let space1 = createText("")
        tr.appendChild(space1);

        main_table.appendChild(tr);

    }

    {
        let table = document.getElementById('explandTable');
        table.className = "thead-dark";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createText("")
        tr.appendChild(name);

        let add_btn = document.createElement('td');
        add_btn.colSpan = 2;
        add_btn.style = "vertical-align:middle";
        add_btn.className = "px-1";
        let btn = document.createElement('button');
        btn.type = "button";
        btn.style = "margin:0";
        btn.innerHTML = " Добавить";
        btn.className = "btn btn-sm btn-block  btn-secondary";
        add_btn.appendChild(btn);
        tr.appendChild(add_btn);

        add_btn.addEventListener("click", function() {

            let tr = document.createElement('tr');

            let space = createText("")
            tr.appendChild(space);

            let x_pos = createInput("", "any")
            tr.appendChild(x_pos);

            let y_pos = createInput("", "any")
            tr.appendChild(y_pos);

            let space1 = createText("")
            tr.appendChild(space1);

            main_table.appendChild(tr);

        });

        table.appendChild(tr);
    }

}

function editZoneTable(odj) {
    let id_zone = odj.id_zone; {
        let table = document.getElementById('editTableHead');
        table.className = "thead-dark";
        table.innerHTML = "";

        let tr = document.createElement('tr');

        let name = createText("Имя")
        tr.appendChild(name);

        let x_pos = createText("X")
        tr.appendChild(x_pos);

        let y_pos = createText("Y")
        tr.appendChild(y_pos);

        let space = createText("")
        tr.appendChild(space);

        table.appendChild(tr);
    } {
        let main_table = document.getElementById('editTable');
        main_table.className = "table table-hover table-striped";
        main_table.innerHTML = "";


        const str = odj.points,
            array = str.match(/\d+(?:\.\d+)?/g).map(Number)
        var points = [];
        for (var j = 0; j < array.length; j = j + 2) {
            points.push([array[j], array[j + 1]]);
        }

        {
            let tr = document.createElement('tr');

            let name = createInput(odj.name, "any")
            tr.appendChild(name);

            let x_pos = createInput((points[0][0]), "any")
            tr.appendChild(x_pos);

            let y_pos = createInput((points[0][1]), "any")
            tr.appendChild(y_pos);


            let btn_save = createButton(" Сохранить", "btn-warning");
            tr.appendChild(btn_save);
            btn_save.addEventListener("click", function() {
                let tmp = 0;
                var latlon = "(("
                let pNum = main_table.childNodes.length;
                for (let i = 0; i < pNum - 1; ++i) {
                    tmp = main_table.childNodes[i].childNodes[1].children[0].value;
                    if (tmp == "") latlon += "0";
                    else { latlon += tmp };
                    latlon += ", ";
                    tmp = main_table.childNodes[i].childNodes[2].children[0].value;
                    if (tmp == "") latlon += "0";
                    else { latlon += tmp };
                    latlon += "), ("
                }
                tmp = main_table.childNodes[pNum - 1].childNodes[1].children[0].value;
                if (tmp == "") latlon += "0";
                else { latlon += tmp };
                latlon += ", ";
                tmp = main_table.childNodes[pNum - 1].childNodes[2].children[0].value;
                if (tmp == "") latlon += "0";
                else { latlon += tmp };
                latlon += "))";

                let params = {}
                params["id_location"] = id_location;
                params["points"] = latlon;
                params["name"] = name.firstChild.value;

                let xhr = new XMLHttpRequest();
                xhr.open('PUT', '/api/zone/' + id_zone + "/", true);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                let json = JSON.stringify(params);
                xhr.onload = function() {
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        let res = JSON.parse(xhr.response).query;
                        odj.name = res.name;
                        odj.points = res.points;
                        let v = document.getElementById('tableName');
                        createZoneTable();
                        v.innerHTML = "Зоны";
                        editZone(odj);
                    } else { showMessage(xhr.response, "danger"); }
                }
                xhr.send(json);
            });


            main_table.appendChild(tr);
        }

        for (let i = 1; i < points.length; ++i) {
            let tr = document.createElement('tr');

            let space = createText("")
            tr.appendChild(space);

            let x_pos = createInput((points[i][0]), "any")
            tr.appendChild(x_pos);

            let y_pos = createInput((points[i][1]), "any")
            tr.appendChild(y_pos);

            let space1 = createText("")
            tr.appendChild(space1);

            main_table.appendChild(tr);

        }

        {
            let table = document.getElementById('explandTable');
            table.className = "thead-dark";
            table.innerHTML = "";

            let tr = document.createElement('tr');

            let name = createText("")
            tr.appendChild(name);

            let add_btn = document.createElement('td');
            add_btn.colSpan = 2;
            add_btn.style = "vertical-align:middle";
            add_btn.className = "px-1";
            let btn = document.createElement('button');
            btn.type = "button";
            btn.style = "margin:0";
            btn.innerHTML = " Добавить";
            btn.className = "btn btn-sm btn-block  btn-secondary";
            add_btn.appendChild(btn);
            tr.appendChild(add_btn);

            add_btn.addEventListener("click", function() {

                let tr = document.createElement('tr');

                let space = createText("")
                tr.appendChild(space);

                let x_pos = createInput("", "any")
                tr.appendChild(x_pos);

                let y_pos = createInput("", "any")
                tr.appendChild(y_pos);

                let space1 = createText("")
                tr.appendChild(space1);

                main_table.appendChild(tr);

            });

            table.appendChild(tr);
        }
    }
}


function onClick(e) {

    if (selectedFeature)
        selectedFeature.editing.disable();
    selectedFeature = e.target;
    e.target.editing.enable();

    if (selectedFeature instanceof L.Marker) {
        markers.findIndex(function(el, index) {
            if (el.obj._leaflet_id == e.target._leaflet_id) {
                anchors.findIndex(function(elt, index) {
                    if (elt.id_anchor == el.id) {
                        editAnchorTable(elt);
                    }
                });
            }
        });
    } else if (selectedFeature instanceof L.Polygon) {
        let filtered = zonesPoly.findIndex(function(el) {
            if (el.obj._leaflet_id == e.target._leaflet_id) {

                var latlon = "(("
                for (let i = 0; i < e.target._latlngs[0].length - 1; i++) {
                    latlon += e.target._latlngs[0][i].lng * scale;
                    latlon += ", ";
                    latlon += e.target._latlngs[0][i].lat * scale;
                    latlon += "), ("
                }
                latlon += e.target._latlngs[0][e.target._latlngs[0].length - 1].lng * scale;
                latlon += ", ";
                latlon += e.target._latlngs[0][e.target._latlngs[0].length - 1].lat * scale;
                latlon += "))";

                let filtered = zones.findIndex(function(elt) {
                    if (elt.id_zone == el.id) {
                        elt.points = latlon;
                        editZoneTable(elt);
                    }

                });
            }
        });
    }

    e.target.on('dragend', function(e) {

        let x = e.target._latlng.lng * scale;
        x = parseFloat(x).toFixed(3);
        let y = e.target._latlng.lat * scale;
        y = parseFloat(y).toFixed(3);

        markers.findIndex(function(el, index) {
            if (el.obj._leaflet_id == e.target._leaflet_id) {
                anchors.findIndex(function(elt, index) {
                    if (elt.id_anchor == el.id) {
                        elt.x_pos = x;
                        elt.y_pos = y;
                        editAnchorTable(elt);
                    }
                });
            }
        });

    });
}