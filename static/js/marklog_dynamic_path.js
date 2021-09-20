(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let marklog = [];
let location_ids = [];
let location_names = [];
let lr;
let markgroups = new Array();
let markDict = {};

class mark {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.selected = false;
        this.color = "#" + Math.floor(Math.random()*16777215).toString(16);
        this.leaflet_polyline;
        this.leaflet_point_array = []
        this.marklog = []
    }
}

class markgroup {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.marks = [];
    }
}

class mapObj {
    constructor(obj, id, name) {
        this.obj = obj;
        this.id = id;
        this.name = name;
    }
}

let all_locations= [];
let location = []
let anchors = []
let zones = []
let editableLayers = []
let scale = 1
let selectedFeature = null;

let location_select_btn;
let group_select_btn;
let marker_select_btn;
let show_path_btn;
let show_path_stop_btn;
let test_btn;

let map;
var picker_dd;
var picker_hh;
var picker_mm;
var picker_ss;

let polyline_style = {
    color: 'red',
    opacity: 0.5,
    smoothFactor: 1
};

let mark_style = {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 0.002
};

let last_mark_style = {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 0.01
};


$(document).ready(createPage());

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
function addAnchorToMap(x, y, name, id) {
    let marker = L.marker([y / scale, x / scale]).addTo(editableLayers).bindPopup(name);
}

function addZoneToMap(zone) {
    const str = zone.points,
        array = str.match(/\d+(?:\.\d+)?/g).map(Number)
    var ans = [];
    for (var j = 0; j < array.length; j = j + 2) {
        ans.push([array[j + 1] / scale, array[j] / scale]);
    }
    L.polygon(ans).addTo(editableLayers).bindPopup(zone.name);
}


function createCheckbox_(value) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle; ";
    let element = document.createElement('input');
    element.type = "checkbox";
    element.style = "margin:0";
    element.checked = value.selected;    
    element.addEventListener("click", function() {
        value.selected = element.checked
    });
    td.appendChild(element);
    return td;
}

function createColorInput(obj) {
    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";
    let element = document.createElement('input');
    element.type = "color";
    element.className = "form-control form-control-sm";
    element.value = obj.color;
    element.addEventListener("input", function() {
        obj.color = element.value;
    });
    td.appendChild(element);
    return td;
}

function createDMarkerTable(items) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    //tabel_mark_select

    let table = document.getElementById('tabel_mark_select');
    table.className = "table table-hover table-striped";
    table.innerHTML = "";

    for (var i = 0; i < items.length; i++) {

        let tr = document.createElement('tr');

        let name = createText(items[i].name)
        tr.appendChild(name);

        let get = createCheckbox_(items[i])
        tr.appendChild(get);

        let color = createColorInput(items[i])
        tr.appendChild(color);

        table.appendChild(tr);
    }

/*
    let buttonSelect = document.createElement('button');
    buttonSelect.className = "btn btn-primary btn-sm dropdown-toggle btn-block";
    buttonSelect.id = "";

    buttonSelect.setAttribute("data-toggle", "dropdown");

    let menuSelect = document.createElement('div');
    menuSelect.className = "dropdown-menu";

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
    */
}

function createDropdownMenuGroup(items) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    let buttonSelect = document.createElement('button');
    buttonSelect.className = "btn btn-primary btn-sm dropdown-toggle btn-block";
    buttonSelect.id = "";

    buttonSelect.setAttribute("data-toggle", "dropdown");

    let menuSelect = document.createElement('div');
    menuSelect.className = "dropdown-menu";

    for (let i = 0; i < items.length; ++i) {

        if (i == 0) {
            buttonSelect.id = items[i].id;
            buttonSelect.innerHTML = items[i].name;
            createDMarkerTable(items[i].marks);  
        }
        
        let el = document.createElement('a');
        el.className = "dropdown-item";
        el.innerHTML = items[i].name;
        el.id = items[i].id;

        el.addEventListener("click", function() {  
            buttonSelect.id = el.id;
            buttonSelect.innerHTML = el.innerHTML;  
            createDMarkerTable(items[i].marks);  
        });

        menuSelect.appendChild(el);
    }
    td.appendChild(buttonSelect);
    td.appendChild(menuSelect);
    return td;
}


function createDropdownMenuLocations(id, variants, ids) {

    let td = document.createElement('td');
    td.style = "vertical-align:middle";
    td.className = "px-1";

    let buttonSelect = document.createElement('button');
    buttonSelect.className = "btn btn-primary btn-sm dropdown-toggle btn-block";
    buttonSelect.id = "";

    buttonSelect.setAttribute("data-toggle", "dropdown");

    let menuSelect = document.createElement('div');
    menuSelect.className = "dropdown-menu";

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
            createMap(el.id)            
        });

        menuSelect.appendChild(el);
    }

    createMap(id)     

    td.appendChild(buttonSelect);
    td.appendChild(menuSelect);

    return td;
}

function sec2time(timeInSeconds) {
    var pad = function(num, size) { return ('000' + num).slice(size * -1); },
    time = parseFloat(timeInSeconds).toFixed(3),
    hours = Math.floor(time / 60 / 60),
    minutes = Math.floor(time / 60) % 60,
    seconds = Math.floor(time - minutes * 60),
    milliseconds = time.slice(-3);

    return pad(hours, 2) + ' ч ' + pad(minutes, 2) + ' м';
}

function createPage() { 

    var input_dd = document.getElementById('dd-picker');
    picker_dd = new Picker(input_dd, {container: '.dd-picker',
        format: 'SSS',
        inline: true,
        rows: 1,
        });
    
    var input_hh = document.getElementById('hh-picker');
    picker_hh = new Picker(input_hh, {container: '.hh-picker',
        format: 'HH',
        inline: true,
        rows: 1,
        });

    var input_mm = document.getElementById('mm-picker');
    picker_mm = new Picker(input_mm, {container: '.mm-picker',
        format: 'mm',
        inline: true,
        rows: 1,
        });

    var input_ss = document.getElementById('ss-picker');
    picker_ss = new Picker(input_ss, {container: '.ss-picker',
        format: 'mm',
        inline: true,
        rows: 1,
        });


        /*
    const $valueSpan = $('.valueSpan');
    const $value = $('#slider11');
    $valueSpan.html($value.val());
    $value.on('input change', () => {
        let a = $value.val();
        $valueSpan.html(sec2time(a*a));
    });*/

    var socket = io();

    socket.on('connect', function() {
    });

    socket.on('on_message', function(msg, cb) {        
        let val = markDict[msg.mark_id]  
        
        if(msg.id_location == location.id_location)     
        {
            let val = markDict[msg.mark_id]
            
            let style = {
                color: val.color,
                fillColor: val.color,
                fillOpacity: 0.5,
                radius: 0.002
            };

            let text = JSON.stringify({"Метка: ": msg.name, "UTC TIME: ": msg.timeis})
            let l_pt = L.circle([msg.pos_y/scale, msg.pos_x/scale], style).bindPopup(text);
            
            map.addLayer(l_pt);

            msg.leaflet_point = l_pt;

            if (val.marklog.length != 0)
            {
                if (val.marklog[val.marklog.length-1].id_location == location.id_location)
                {

                    var polylinePoints = [];
                    polylinePoints.push([msg.pos_y / scale, msg.pos_x / scale]); 
                    polylinePoints.push([val.marklog[val.marklog.length-1].pos_y / scale, val.marklog[val.marklog.length-1].pos_x / scale]); 
                    let line_style = {
                        color: val.color,
                        opacity: 0.5,
                        smoothFactor: 1
                    };
                    let ln  = L.polyline(polylinePoints, line_style);
                    msg.leaflet_line = ln;

                    map.addLayer(ln)

                }
            }

            val.marklog.push(msg)
            
            let timeInterval = document.getElementById('dd-picker').value * 60*60*24 + document.getElementById('hh-picker').value * 60*60 + document.getElementById('mm-picker').value * 60 + document.getElementById('ss-picker').value;
            var nowTime  = new Date();
            var seconds = (nowTime.getTime() + nowTime.getTimezoneOffset()*60*1000);

            let vv = ((seconds - new Date(val.marklog[0].timeis).getTime())/1000);

            while (true)
            {
                if (val.marklog.length == 0)
                {
                    break
                }                
                if(((seconds - new Date(val.marklog[0].timeis).getTime())/1000) > timeInterval)
                {
                    map.removeLayer(val.marklog[0].leaflet_point);
                    if (val.marklog[0].hasOwnProperty('leaflet_line') )
                        map.removeLayer(val.marklog[0].leaflet_line);
                    val.marklog.shift();
                } else
                {
                    break
                }
            }
        }
    });

    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/locations/', false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {
                all_locations = JSON.parse(xhr.response).query;                
            } else 
            { 
                showMessage(xhr.response, "danger"); 
            }
        }
        xhr.send();


        for (let i in all_locations)
        {
            location_ids.push(all_locations[i].id_location)
            location_names.push(all_locations[i].name)
        }

        location_select_btn = createDropdownMenuLocations(location_ids[0], location_names, location_ids)
        let tmp = document.getElementById('location_select_btn');
        tmp.appendChild(location_select_btn);        

    }
    
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/markgroups/', false);
        xhr.send();
        if (xhr.status != 200) {
            showMessage(xhr.response, "danger");
        } else {

            let res = JSON.parse(xhr.responseText).query;
            markDict = [];

            markgroups.push(new markgroup(0, "null"))
            for(let m in res)
            {   
                markgroups.push(new markgroup(res[m].markgroup_id, res[m].markgroup_name))
            }

            let params = {}
            params["markgroup_id"] = null;
            let json = JSON.stringify(params);
            var xhr = new XMLHttpRequest();
            xhr.open('POST', '/api/markers/', false);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = function() {
                if (xhr.readyState == 4 && xhr.status == "200") {
                    let res = JSON.parse(xhr.response).query;
                    let marks = []
                    for(let m in res)
                    {   
                        let mm = new mark(res[m].id_mark, res[m].name)
                        marks.push(mm)
                        markDict["id_mark_" + res[m].id_mark] = marks[marks.length - 1]
                    }
                    markgroups[0].marks = marks;
                } else { showMessage(xhr.response, "danger"); }
            }
            xhr.send(json);

            for (let i = 1; i < markgroups.length; i++)
            {
                let params = {}
                params["markgroup_id"] = markgroups[i].id;
                let json = JSON.stringify(params);
                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/markers/', false);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.onload = function() {
                    if (xhr.readyState == 4 && xhr.status == "200") {
                        let res = JSON.parse(xhr.response).query;
                        let marks = []
                        for(let m in res)
                        {   
                            let mm = new mark(res[m].id_mark, res[m].name)
                            marks.push(mm)
                            markDict["id_mark_" + res[m].id_mark] = marks[marks.length - 1]
                            //marks.push(new mark(res[m].id_mark, res[m].name))
                        }
                        markgroups[i].marks = marks;
                    } else { showMessage(xhr.response, "danger"); }
                }
                xhr.send(json);
            }         
        }

        group_select_btn = createDropdownMenuGroup(markgroups)
        let tmp = document.getElementById('group_select_btn');
        tmp.appendChild(group_select_btn);
        
    }


    show_path_btn = createButton("Старт", "btn-primary");
    show_path_btn.addEventListener("click", function() {    

        socket.emit('stopMarkWatching')

        /////////////////////////////
        /////////////////////////////
        /////////////////////////////
        
        var now = new Date();
        var interval = new Date();
        let timeInterval = parseInt(document.getElementById('dd-picker').value * 60*60*24) + parseInt(document.getElementById('hh-picker').value * 60 * 60) +  parseInt(document.getElementById('mm-picker').value * 60) + parseInt(document.getElementById('ss-picker').value);
        interval.setSeconds(interval.getSeconds() - timeInterval);
    
        for(let i in markDict)
        {  
            if(markDict[i].selected == true)
            {
                var xhr = new XMLHttpRequest();               
                xhr.open('GET', '/api/marklog_path/' + markDict[i].id + '/' + interval.toISOString() + '/' + now.toISOString(), false);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.onload = function() {
                    if (xhr.readyState == 4 && xhr.status == "200") {
        
                        marklog = JSON.parse(xhr.response).query;
                        
                        for(let m in marklog)
                        {   
                            if(marklog[m].id_location == location.id_location)  
                            { 
                                let val = markDict["id_mark_" + marklog[m].id_mark] 
                                let style = {
                                    color: val.color,
                                    fillColor: val.color,
                                    fillOpacity: 0.5,
                                    radius: 0.002
                                };

                                let text = JSON.stringify({"Метка: ": val.name, "UTC TIME: ": marklog[m].timeis})
                                let l_pt = L.circle([marklog[m].pos_y/scale, marklog[m].pos_x/scale], style).bindPopup(text);
                                
                                marklog[m].leaflet_point = l_pt;
                                map.addLayer(l_pt);
                                if(m != 0)
                                {
                                    var polylinePoints = [];
                                    polylinePoints.push([marklog[m].pos_y/scale, marklog[m].pos_x/scale]); 
                                    polylinePoints.push([marklog[m-1].pos_y/scale, marklog[m-1].pos_x/scale]); 
                                    let line_style = {
                                        color: val.color,
                                        opacity: 0.5,
                                        smoothFactor: 1
                                    };    
                                    let ln  = L.polyline(polylinePoints, line_style);
                                    marklog[m].leaflet_line = ln;
                                    map.addLayer(ln)
                                }                            
                                val.marklog.push(marklog[m])
                            }                            
                        }                                 
        
                    } else { showMessage(xhr.response, "danger"); }
                }
                xhr.send();
            } 
        }
        /////////////////////////////
        /////////////////////////////
        /////////////////////////////
        
        for (var j = 0; j < markgroups.length; j++)
        {
            for (var i = 0; i < markgroups[j].marks.length; i++) {
                if(markgroups[j].marks[i].selected)
                    socket.emit('addWatchingMark', {data: "id_mark_" + (markgroups[j].marks[i].id)})
            }
        }       

    });        
    let tmp = document.getElementById('show_path_btn');
    tmp.appendChild(show_path_btn);

    
    show_path_stop_btn = createButton("Стоп", "btn-secondary");
    show_path_stop_btn.addEventListener("click", function() {  
        socket.emit('stopMarkWatching') 
        /*
        var polylinePoints = []; 

        for (let i = 0; i < 10; ++i)
        {        
             l_pt = L.circle([5.0 / scale, i / scale], last_mark_style).bindPopup(('sdfsdf'));
             map.addLayer(l_pt);
             polylinePoints.push([5.0 / scale, i / scale]);            
        }    

        lr = L.polyline(polylinePoints, polyline_style);
        for (let i = 0; i < lr._latlngs.length; ++i)
        {        
            lr._latlngs[i].timestamp = 'This is timestamp';        
        }  
        map.addLayer(lr);*/

    });  

    tmp = document.getElementById('show_path_stop_btn');
    tmp.appendChild(show_path_stop_btn);
    
    test_btn = createButton("Сброс", "btn-secondary");
    test_btn.addEventListener("click", function() {          
        createMap(location.id_location)
    });  

    tmp = document.getElementById('test_btn');
    tmp.appendChild(test_btn);
    /*
    // Create marker select btn

    let marker_variants = []
    let marker_ids = []

    for (let i in markgroups[0].group)
    {
        marker_variants.push(markgroups[0].group[i].name)
        marker_ids.push(markgroups[0].group[i].id_mark)
    }

    marker_select_btn = createDropdownMenuMarker(marker_ids[0], marker_variants, marker_ids);
    tmp = document.getElementById('marker_select_btn');
    tmp.appendChild(marker_select_btn);

    
    let today = new Date().toISOString().substr(0, 10) + 'T' + new Date().toISOString().substr(11, 5);
    document.querySelector("#datetime_begin").value = today;
    document.querySelector("#datetime_end").value = today;

    show_path_btn = createButton("Построить траекторию", "btn-secondary");
    show_path_btn.addEventListener("click", function() {    
        
        if(map != undefined)
            map.remove();
            
        let begin_time = document.querySelector("#datetime_begin").value;
        let end_time = document.querySelector("#datetime_end").value;
        let mark_id = marker_select_btn.children[0].id;
        
        var xhr = new XMLHttpRequest();               
        xhr.open('GET', '/api/marklog_path/' + mark_id + '/' + begin_time + '/' + end_time, false);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhr.onload = function() {
            if (xhr.readyState == 4 && xhr.status == "200") {

                marklog = JSON.parse(xhr.response).query;

                location_ids = [];
                location_names = [];
                for(let i = 0; i < marklog.length; ++i)
                {
                    let exists = false
                    for(let j = 0; j < location_ids.length; ++j)
                    {
                        if(location_ids[j] == marklog[i].id_location)
                        {
                            exists = true;
                            break;
                        }
                        
                    }
                    if (exists == false)
                    {
                        location_ids.push(marklog[i].id_location)
                        for(let j = 0; j < all_locations.length; ++j)
                        {
                            if(all_locations[j].id_location == marklog[i].id_location)
                            {
                                location_names.push(all_locations[j].name)
                                break;
                            }
                            
                        }                        
                    }
                }
                          

            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send();

    });    
    tmp = document.getElementById('show_path_btn');
    tmp.appendChild(show_path_btn);
    */
    
}

function createMap(loc_id) {  

    for (var i in markDict) {
        markDict[i].marklog = [];
    }

    if(map != undefined)
        map.remove();

    let map_clear = document.getElementById('map');
    map_clear.innerHTML = ""

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
    xhr.open('GET', '/api/location/' + loc_id + '/', false);
    xhr.send();
    if (xhr.status != 200) {
        showMessage(xhr.response, "danger");
        return;
    } else {
        location = JSON.parse(xhr.response).query
    }

    // center of the map
    let y0 = location.zero_x;
    let x0 = location.zero_y;
    let y1 = x0 + location.width;
    let x1 = y0 + location.length;

    let vx = Math.abs(x1 - x0)
    let vy = Math.abs(y1 - y0)

    scale = Math.max(vx, vy);

    map = L.map('map', { worldCopyJump: false, crs: L.CRS.Direct });

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
    params["id_location"] = loc_id;
    let json = JSON.stringify(params);
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

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

/*
function onClick(e) {

    if (selectedFeature)
        selectedFeature.editing.disable();
    selectedFeature = e.target;
    selectedFeature.editing.enable();

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
*/