(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let begin_time = 0;
let end_time = 0;
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

let all_locations= [];
let location = []
let anchors = []
let zones = []

let editableLayers = []
let scale = 1
let location_select_btn;
let group_select_btn;
let show_path_btn;

let test_btn;

let map;
let time_pos;

$(document).ready(createPage());

///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////

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




function createPage() { 

    let time_pos = document.getElementById('time_pos');

    $("#time_pos").on("input change", function() {
        let time_val = document.getElementById('time_val');   
        let time_pos = document.getElementById('time_pos');  

        var begin_seconds = new Date(begin_time).getTime();        
        var end_seconds = new Date(end_time).getTime();

        var nowTime  = new Date();
        let slider_day = new Date(begin_seconds + time_pos.value * (end_seconds - begin_seconds)/1000)
        time_val.innerHTML = slider_day.toISOString();
        
        var slider_day_seconds = slider_day.getTime();

        for(let i in markDict)
        {  
            if(markDict[i].selected == true)
            {         
                if(markDict[i].marklog.length < 1)
                {
                    continue
                }

                let closest = markDict[i].marklog[0];

                for(let j = 0; j < markDict[i].marklog.length; ++j)                        
                {   
                    let tt = new Date(markDict[i].marklog[j].timeis).getTime();

                    let v1 = Math.abs(slider_day_seconds - tt);
                    let v2 = Math.abs(slider_day_seconds - new Date(closest.timeis).getTime());
                    if(v1 < v2)
                    {
                        closest = markDict[i].marklog[j]
                    }

                }  
                
                markDict[i].active_point.setRadius(0.002); 
                markDict[i].active_point = closest.leaflet_point;
                markDict[i].active_point.setRadius(0.01);              
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
 
    
    
    let today = new Date().toISOString().substr(0, 10) + 'T' + new Date().toISOString().substr(11, 5);
    document.querySelector("#datetime_begin").value = today;
    document.querySelector("#datetime_end").value = today;

    show_path_btn = createButton("Построить траекторию", "btn-secondary");
    show_path_btn.addEventListener("click", function() {   

        createMap(location.id_location)
            
        begin_time = document.querySelector("#datetime_begin").value;
        end_time = document.querySelector("#datetime_end").value;

        
        for(let i in markDict)
        {  
            if(markDict[i].selected == true)
            {
                var xhr = new XMLHttpRequest();               
                xhr.open('GET', '/api/marklog_path/' + markDict[i].id + '/' + begin_time + '/' + end_time, false);
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.onload = function() {
                    if (xhr.readyState == 4 && xhr.status == "200") {
        
                        marklog = JSON.parse(xhr.response).query;
                        
                        let first = true;
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
                                val.marklog.push(marklog[m])

                                if (first)
                                {
                                    val.active_point = l_pt;
                                    val.active_point.setRadius(0.01)
                                    first = false;
                                }
                            }                            
                        }
                        
                        for(let i = 0; i < marklog.length - 1; ++i)                        
                        {                            
                            if(marklog[i].id_location == location.id_location) 
                            {  
                                let val = markDict["id_mark_" + marklog[i].id_mark] 
                                var polylinePoints = [];
                                polylinePoints.push([marklog[i].pos_y/scale, marklog[i].pos_x/scale]); 
                                polylinePoints.push([marklog[i+1].pos_y/scale, marklog[i+1].pos_x/scale]); 
                                let line_style = {
                                    color: val.color,
                                    opacity: 0.5,
                                    smoothFactor: 1
                                };

                                let ln  = L.polyline(polylinePoints, line_style);
                                map.addLayer(ln)
                            }
                        }                                  
        
                    } else { showMessage(xhr.response, "danger"); }
                }
                xhr.send();
            } 
        }  
        
        $('#time_pos').val('0').change()      
    });    

    let tmp = document.getElementById('show_path_btn');
    tmp.appendChild(show_path_btn);
    
    
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
