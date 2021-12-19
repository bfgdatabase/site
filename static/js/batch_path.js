(function($) {
    //использование jQuery как $
})(jQuery);
jQuery.noConflict()


let marklog = [];
let location_ids = [];
let location_names = [];

let markgroups = new Array();


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
let pathLayer = []
let scale = 1
let selectedFeature = null;

let group_select_btn;
let marker_select_btn;
let show_path_btn;

let map;

let polyline_style = {
    color: 'red',
    opacity: 0.5,
    smoothFactor: 1
};

let mark_style = {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.5,
    radius: 0.01
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

function addMarkToMap(zone, ev) {
    // L.marker([y / scale, x / scale], { icon: svgIcon }).addTo(map).bindPopup(name);;
    L.circle([zone['center'][0] / scale, zone['center'][1] / scale], mark_style
    ).addTo(pathLayer).bindPopup("time_in: " + ev.time_in + '<br>' + "time_out: " + ev.time_out);
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

function createDropdownMenuGroup(id, variants, ids) {

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
            
            batch_id  = el.id;
            // Create marker select btn
            // let marker_variants = []
            // let marker_ids = []

            // for (let i in markgroups[el.id].group)
            // {
            //     marker_variants.push(markgroups[el.id].group[i].name)
            //     marker_ids.push(markgroups[el.id].group[i].id_mark)
            // }

            // marker_select_btn = createDropdownMenuMarker(marker_ids[0], marker_variants, marker_ids);
            // let elt = document.getElementById('marker_select_btn');
            // elt.innerHTML = "";
            // elt.appendChild(marker_select_btn);

            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/report/' + batch_id + '/', false);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    showMessage(xhr.response, "danger");
                } else {
                    let res = (JSON.parse(xhr.responseText).query);
                    createMap(res['current_location_id'])
                    drawEvents(res['events'])
                    let a = 1;
                }
            }
            xhr.send();
            
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/api/analytics/' + batch_id + '/', true);
            xhr.onload = function() {
                if (xhr.status != 200) {
                    showMessage(xhr.response, "danger");
                } else {
                    let res = JSON.parse(xhr.responseText).query;

                    let tmp = document.getElementById('batch_info');
                    tmp.innerHTML = res
                }
            }
            xhr.send();

            

        });

        menuSelect.appendChild(el);
    }
    td.appendChild(buttonSelect);
    td.appendChild(menuSelect);
    return td;
}

function isPrime(element, index, array) {
    var start = 2;
    while (start <= Math.sqrt(element)) {
      if (element % start++ < 1) {
        return false;
      }
    }
    return element > 1;
  }

function drawEvents(events) {  

    let tableData = []
    for (let ev of events)
    {
        let tmp = [ev.zone_id, ev.time_in, ev.time_out]
        tableData.push(tmp)
    }
    $('#eventTable').dataTable().fnClearTable();
    $('#eventTable').dataTable().fnDestroy();
    var table = $('#eventTable').DataTable( {
        "data": tableData,
        "columnDefs": [ {
        "targets": -1
        } ]          
    } );
    
        var polylinePoints = []; 
        for (let ev of events) {
        var idx = zones.findIndex(function(zone, id) {
            if(zone.id_zone == ev.zone_id)
                return true;
        });

        if  (idx >= 0)
        {
            addMarkToMap(zones[idx], ev)
            polylinePoints.push([zones[idx]['center'][0] / scale, zones[idx]['center'][1] / scale]); 
        }
    }      
    let ln  = L.polyline(polylinePoints, polyline_style);
    map.addLayer(ln)
}

function createPage() { 

    // var table = $('#eventTable').DataTable( {
    //     "columnDefs": [ {
    //      "targets": -1,
    //      "data": null,
    //       } ]          
    //  } );

    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/batch/', false);
    xhr.onload = function() {
        if (xhr.status != 200) {
            showMessage(xhr.response, "danger");
        } else {
            let res = JSON.parse(JSON.parse(xhr.responseText).query);
            let ids = []
            let variants = []
            for (let i in res)
            {
                ids.push(res[i][0])
                variants.push(res[i][1])
            }
            let batch_select_btn = createDropdownMenuGroup(batch_id, variants, ids)
            let tmp = document.getElementById('batch_select');
            tmp.appendChild(batch_select_btn);
        }
    }
    xhr.send();

    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/report/' + batch_id + '/', false);
    xhr.onload = function() {
        if (xhr.status != 200) {
            showMessage(xhr.response, "danger");
        } else {
            let res = (JSON.parse(xhr.responseText).query);
            createMap(res['current_location_id'])
            drawEvents(res['events'])
            let a = 1;
        }
    }
    xhr.send();
    
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/analytics/' + batch_id + '/', true);
    xhr.onload = function() {
        if (xhr.status != 200) {
            showMessage(xhr.response, "danger");
        } else {
            let res = JSON.parse(xhr.responseText).query;

            let tmp = document.getElementById('batch_info');
            tmp.innerHTML = res
        }
    }
    xhr.send();

    return
    // Create  group delect btn
    let variants = []
    let ids = []

    for (let i in markgroups)
    {
        variants.push(markgroups[i].markgroup_name)
        ids.push(markgroups[i].markgroup_id)
    }

    group_select_btn = createDropdownMenuGroup(ids[0], variants, ids)
    let tmp = document.getElementById('group_select_btn');
    tmp.appendChild(group_select_btn);

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
                                
                if(location_ids.length > 0)
                {
                    let location_name = document.getElementById('location_name');
                    location_name.innerHTML = ""
                    let loc_menu = createDropdownMenuLocations(location_ids[0], location_names, location_ids) 
                    location_name.appendChild(loc_menu);
                } else {
                    let location_name = document.getElementById('location_name');
                    location_name.innerHTML = "Нет меток за заданный период"
                }


            } else { showMessage(xhr.response, "danger"); }
        }
        xhr.send();

    });    
    tmp = document.getElementById('show_path_btn');
    tmp.appendChild(show_path_btn);


}

function createMap(loc_id) {  

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
    pathLayer = new L.FeatureGroup();
    map.addLayer(editableLayers);
    map.addLayer(pathLayer);
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
                for (let idx in zones) {
                    zones[idx]['center'] = [0, 0]
                    const str = zones[idx].points,
                        array = str.match(/\d+(?:\.\d+)?/g).map(Number)
                    var center = [0, 0];
                    for (var j = 0; j < array.length; j = j + 2) {
                        center[0] += array[j + 1];
                        center[1] += array[j];
                    }
                    center[0] /= (array.length/2);
                    center[1] /= (array.length/2);


                    zones[idx]['center'] = center;
                    addZoneToMap(zones[idx]);
                }
            }
        }
        xhr1.send(json);
    }

    var polylinePoints = []; 
    var times = []; 

    for (let i = 0; i < marklog.length; ++i)
    {
        if( marklog[i].id_location == loc_id)
        {
            let pt = [marklog[i].pos_x/ scale, marklog[i].pos_y/ scale]
            polylinePoints.push(pt);
            times.push(marklog[i].timeis);
        }
    }

    for (let i = 0; i < polylinePoints.length; ++i)
    {        
        if(i == polylinePoints.length - 1)
            L.circle(polylinePoints[i], last_mark_style).addTo(map).bindPopup(times[i]);
        else
            L.circle(polylinePoints[i], mark_style).addTo(map).bindPopup(times[i]);
        
    }    
    L.polyline(polylinePoints, polyline_style).addTo(map);
    
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