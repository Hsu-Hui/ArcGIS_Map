var pt, pt2, pt3, graphic, graphic2, graphic3, ptx, pty;

$(function () {
    $("#topbar").hide();
    $("#switchMap").hide();
    $("#googlemap").hide();
    $(".esri-print").hide;
    $(".esri-search").hide();
    $("#mySearch").hide();
});


function MapSwitch() {
    $("#topbar").hide();
    $("#switchMap").show();
    $("#queryLocation").hide();
    $("#loc_table").hide();
    $(".esri-search").hide();
    $(".esri-print").hide();
    $("#googlemap").hide();
}
function MeasuresTool() {
    $("#topbar").show();
    $("#switchMap").hide();
    $("#queryLocation").hide();
    $("#loc_table").hide();
    $(".esri-search").hide();
    $(".esri-print").hide();
    $("#googlemap").hide();
}
function DefaultPrint() {
    $("#topbar").hide();
    $("#switchMap").hide();
    $("#queryLocation").hide();
    $(".esri-search").hide();
    $(".esri-print").show();
    $("#loc_table").hide();
    $("#googlemap").hide();
}
function QuickLocation() {
    openClass(event, 'class1');
    $("#topbar").hide();
    $("#switchMap").hide();
    $(".esri-search").show();
    $("#loc_table").show();
    $(".esri-print").hide();
    $("#queryLocation").hide();
    $("#googlemap").hide();
}
function close_table() {
    $("#loc_table").hide();
    $("#topbar").hide();
    $("#queryLocation").hide();
    $("#switchMap").hide();
    $("#googlemap").hide();
    $(".esri-direct-line-measurement-3d").hide();
    //$(".esri-view-height-small").hide();
    index = 'none';
    if (activeWidget) {
        view.ui.remove(activeWidget);
        activeWidget.destroy();
        activeWidget = null;
    }
}
function showCoordinates(pt) {
    var lat = pt.latitude.toFixed(3);
    var lon = pt.longitude.toFixed(3);
    var latlon = lat + ',' + lon;
    return latlon;
}
//街景功能
function googlemap() {
    $("#topbar").hide();
    $("#switchMap").hide();
    $(".esri-search").hide();
    $("#loc_table").hide();
    $(".esri-print").hide();
    $("#queryLocation").hide();
    $("#googlemap").show();
    index = $("#googlemap").css("display");
    view.on("click", function (evt) {
        if (index === "block") {
            var latlon = showCoordinates(view.toMap({ x: evt.x, y: evt.y }));
            if (latlon !== null) {
                var _latlon = latlon.split(',');
                var url = "https://www.google.com/maps?q&layer=c&cbll=" + _latlon[0] + "," + _latlon[1];
                window.open(url, "_blank");

            }
        }
    });
}
function poi_Search() {
    var poi = document.getElementById('poi').value;
    if (poi === "") {
        alert("請輸入地標關鍵字");
    }
    else {
       // var data = { "data": poi };
        var requestURL = "https://api.nlsc.gov.tw/idc/TextQueryMap/" + poi + "/10/M";//傳回10筆+縣市代碼
        $.ajax({
            url: requestURL,
            method: "get",
            dataType: "text",
            success: function (data) {
                console.log(data);
                $("#poi_table").empty();
                var XML = new DOMParser().parseFromString(data, "text/xml");
                $("#poi_table").append("<tr><th>定位</th><th>導航</th><th>地標</th></tr>");
                if (XML.getElementsByTagName("ITEM").length !== 0) {
                    for (var index = 0; index < XML.getElementsByTagName("ITEM").length; index++) {
                        $("#poi_table").append("<tr><td style='width:60px;'><a href = '#' name = 'poi_" + XML.getElementsByTagName("LOCATION")[index].textContent + "' onclick = 'javascript:poi_loc(this);' > <img src='../Images/map_icon/定位-藍.png' class='Road_loc' /></a ></td><td style='width:60px;'>" +
                            "<a href='#' name='poi_" + XML.getElementsByTagName("LOCATION")[index].textContent + "' onclick='javascript:poi_view(this);'><img src='../Images/map_icon/導航.png' class='Road_view'/></a></td><td style='width:120px;'>" + XML.getElementsByTagName("CONTENT")[index].textContent + "</td></tr>");
                    }
                    $("#poi_frame").height(data.d.length * 70);
                    var div = document.getElementById('poi_frame');
                    var maxHeight = div.offsetHeight;
                    if (maxHeight > 350) {//超過四筆顯示滾軸
                        $("#poi_frame").height(200);
                        $("#poi_frame").css("overflow", "scroll");
                    }
                }
            },
            error: function () {
                console.log('error');
            }

        });
    }
}
function poi_loc(name) {
   // var data = { "data": name.name.split('_')[1]};
    var data = name.name.split('_')[1];
            var loc = data.split(",");
            //console.log(loc);
            require([
                "esri/Graphic", "esri/geometry/Point"
            ], function (Graphic, Point) {
                view.graphics.removeAll();
                view.center = [loc[0], loc[1]];
                view.zoom = 17;
                pt = new Point({
                    latitude: Number(loc[1]),
                    longitude: Number(loc[0])
                });
                graphic = new Graphic({
                    symbol: {
                        type: "simple-marker",
                        color: [0, 0, 0],
                        size: "12px"
                    },
                    geometry: pt
                });
                view.graphics.add(graphic);
            });
}
function poi_view(name) {
    var data = name.name.split('_')[1];
            if (data !== null) {
                var url = "https://www.google.com.tw/maps/dir//" + data.split(',')[1] + "," + data.split(',')[0] + "?hl=zh-TW";
                window.open(url, "_blank");
            }
}



//選擇定位功能
function openClass(evt, className) {
    var i, x, tablinks;
    x = document.getElementsByClassName("class");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].classList.remove("red");
    }
    document.getElementById(className).style.display = "block";
    evt.currentTarget.classList.add("red");
    if (className === "class3") {
        $("#queryLocation").show();
    }
    else if (className === "class4") {
        $("#queryLocation").hide();
        $("#poi").show();

    }
    else {
        $("#queryLocation").hide();
    }

}


//選擇定位功能結束

function ShowStr(x) {
    //console.log(x);
    if (document.getElementById(x).selectedIndex >= 0) {
        var selectedIndex = document.getElementById(x).selectedIndex;
        var selectedValue = document.getElementById(x).options[selectedIndex].value;
        //alert(selectedValue); 
        var data = { "data": selectedValue };
        document.getElementById("ddlCountry").options.length = 0;
        view.graphics.removeAll();
        view.center = [selectedValue.spilt('_')[0], selectedValue.spilt('_')[1]];
        view.zoom = 14;
        pt = new Point({
            type: "point",
            longitude: selectedValue.spilt('_')[0],
            latitude: selectedValue.spilt('_')[1]
        });
        var symbol = {
            type: "simple-marker",
            color: [0, 0, 0]
        };

        graphic = new Graphic({
            geometry: pt,
            symbol: symbol
        });
        //$.ajax({
        //    type: "POST",
        //    url: "PubLocationMap.aspx/post",
        //    dataType: "json",
        //    data: JSON.stringify(data),
        //    contentType: 'application/json; charset=utf-8',
        //    success: function (data) {
        //        var typeArray = data.d;
        //        $.each(JSON.parse(typeArray), function (a, b) {
        //            $("select[name='TypeA[]']").each(function () {
        //                $(this).append($("<option></option>").attr("value", b.VILLAGEID).text(b.VILLAGENAM));
        //            });
        //        });
        //    },
        //    error: function () {
        //        console.log('error');
        //    }
        //});

    }

}
//道路定位功能
function Road_location() {
    var _data = document.getElementById('road').value;
    if (_data === "") {
        alert("請輸入道路關鍵字");
    }
    else {
        var requestURL = "https://api.nlsc.gov.tw/idc/TextQueryMap/" + _data + "/10/M";//傳回10筆+縣市代碼
        $.ajax({
            url: requestURL,
            method: "get",
            dataType: "text",
            success: function (data) {
                console.log(data);
                $("#Road_table").empty();
                var XML = new DOMParser().parseFromString(data, "text/xml");
                $("#Road_table").append("<tr><th>定位</th><th>導航</th><th>道路名稱</th></tr>");
                if (XML.getElementsByTagName("ITEM").length !== 0) {
                    for (var index = 0; index < XML.getElementsByTagName("ITEM").length; index++) {
                        $("#Road_table").append("<tr><td style='width:60px;'><a href = '#' name = 'Road_" + XML.getElementsByTagName("LOCATION")[index].textContent + "' onclick = 'javascript:Road_loc(this);' > <img src='../Images/map_icon/定位-藍.png' class='Road_loc' /></a ></td><td style='width:60px;'>" +
                            "<a href='#' name='Road_" + XML.getElementsByTagName("LOCATION")[index].textContent + "' onclick='javascript:Road_view(this);'><img src='../Images/map_icon/導航.png' class='Road_view'/></a></td><td style='width:120px;'>" + XML.getElementsByTagName("CONTENT")[index].textContent + "</td></tr>");
                    }
                    $("#Road_frame").height(XML.getElementsByTagName("ITEM").length * 70);
                    var div = document.getElementById('Road_frame');
                    var maxHeight = div.offsetHeight;
                    if (maxHeight > 350) {//超過四筆顯示滾軸
                        $("#Road_frame").height(200);
                        $("#Road_frame").css("overflow", "scroll");
                    }
                }
                else
                {
                    alert("查無此道路");
                }
            },
            error: function () {
                console.log('error');
            }

        });
    }
}
function Road_loc(name) {
    var loc = name.name.split('_')[1];
            require([
                "esri/Graphic", "esri/geometry/Point", "esri/geometry/Polyline"
            ], function (Graphic, Point, Polyline) {
                var points = [];
                view.graphics.removeAll();
                view.center = [loc.split(',')[0], loc.split(',')[1]];
                view.zoom = 17;
                    pt = new Point({
                        latitude:loc.split(',')[1],
                        longitude: loc.split(',')[0]
                    });
                    graphic = new Graphic({
                        symbol: {
                            type: "simple-marker",
                            color: [0, 0, 0],
                            size: "12px"
                        },
                        geometry: pt
                    });
                    view.graphics.add(graphic);

            });
}
function Road_view(name) {
    var data = name.name.split('_')[1];
            if (data !== null) {
                var url = "https://www.google.com.tw/maps/dir//" + data.split(',')[1] + "," + data.split(',')[0] + "?hl=zh-TW";
                window.open(url, "_blank");
            }
}



function Country_Search() {
    //$(document).on('click', '#btnCountry', function () {

    var Country = document.getElementById('ddlCity');
        if (Country.selectedIndex >= 0) {
            var selectedIndex = Country.selectedIndex;
            var selectedValue = Country.options[selectedIndex].value;
            var data = { "data": selectedValue };
            view.graphics.removeAll();
            require([
                "esri/geometry/Point", "esri/Graphic"],
                function (Point, Graphic) {
                    view.center = [selectedValue.split('_')[0], selectedValue.split('_')[1]];
                    view.zoom = 14;
                    pt = new Point({
                        type: "point",
                        longitude: selectedValue.split('_')[0],
                        latitude: selectedValue.split('_')[1]
                    });
                    var symbol = {
                        type: "simple-marker",
                        color: [0, 0, 0]
                    };
                    graphic = new Graphic({
                        geometry: pt,
                        symbol: symbol
                    });
                    view.graphics.add(graphic);
                });
            //$.ajax({
            //    type: "POST",
            //    url: "PubLocationMap.aspx/Country_search",
            //    dataType: "json",
            //    data: JSON.stringify(data),
            //    contentType: 'application/json; charset=utf-8',
            //    success: function (data) {
            //        //console.log('success');
            //        var XY = data.d;
            //        var loc = XY.split(",");
            //        require(["esri/geometry/Point", "esri/Graphic"],
            //            function (Point, Graphic) {
            //                view.graphics.removeAll();
            //                view.center = [loc[0].replace('"', ''), loc[1].replace('"', '')];
            //                view.zoom = 15;
            //                var pt = new Point({
            //                    type: "point",
            //                    longitude: loc[0].replace('"', ''),
            //                    latitude: loc[1].replace('"', '')
            //                });
            //                var symbol = {
            //                    type: "simple-marker",
            //                    color: [0, 0, 0]
            //                };
            //                var graphic = new Graphic({
            //                    geometry: pt,
            //                    symbol: symbol
            //                });
            //                view.graphics.add(graphic);

            //            }
            //        );
            //    },
            //    error: function () {
            //        console.log('error');
            //    }
            //});
        }
   // });

}



function insert() {
    var cObject = document.getElementById("Count");
    var c = cObject.value;
    console.log(c);
    if (c > 3) {
        alert("限最多新增三筆");
    }
    else {
        var box = "<label class='village_lab'>X" + c + "坐標</label><br/><input type='text' class='xy_txt' id='x" + c + "' name='x" + c + "' /><br /><label class='village_lab'>Y" + c + "坐標</label><br/><input type='text' class='xy_txt' id='y" + c + "' name='y" + c + "' /><br/>";
        $("#TextBoxDiv > input:text:last").each(function () { $(this).next().after(box); });
        var count = Number(c) + 1;
        cObject.value = count;
        console.log(count);
        var div = document.getElementById("TextBoxDiv");
        var height = div.clientHeight;
        height += 60;
        div.style.height = height + "px";
    }
}
function xy_clear() {
    view.graphics.removeAll();
    if (document.getElementById("x1").value !== '')
        document.getElementById("x1").value = '';
    if (document.getElementById("y1").value !== '')
        document.getElementById("y1").value = '';
    if (document.getElementById("x2").value !== '')
        document.getElementById("x2").value = '';
    if (document.getElementById("y2").value !== '')
        document.getElementById("y2").value = '';
    if (document.getElementById("x3").value !== '')
        document.getElementById("x3").value = '';
    if (document.getElementById("y3").value !== '')
        document.getElementById("y3").value = '';
}
function xy_Search() {
    if (document.getElementById("x1") && document.getElementById("y1")) {
        var data = {}; var data2 = "";
        var x1 = document.getElementById("x1").value;
        var y1 = document.getElementById("y1").value;
        var xy = x1 + "," + y1;
        data = { "data": xy };
        data2 = xy;
        if (document.getElementById("x2") && document.getElementById("y2")) {
            var x2 = document.getElementById("x2").value;
            var y2 = document.getElementById("y2").value;
            var xy2 = x2 + "," + y2;
            data.data += "_" + xy2;
            data2 += "," + xy2;
        }
        if (document.getElementById("x3") && document.getElementById("y3")) {
            var x3 = document.getElementById("x3").value;
            var y3 = document.getElementById("y3").value;
            var xy3 = x3 + "," + y3;
            data.data += "_" + xy3;
            data2 += "," + xy3;
        }
        var item = $("[name='xy']:checked").val();
        if (item === "TWD97") {
            $.ajax({
                type: "post",
                url: "PubLocationMap.aspx/xy_search",
                dataType: "json",
                data: JSON.stringify(data),
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    var XY = data.d.replace('"', '');
                    XY = XY.substring(0, XY.length - 2);
                    //console.log(XY);
                    var loc = XY.split(",");
                    require([
                        "esri/geometry/Point", "esri/Graphic"],
                        function (Point, Graphic) {
                            view.graphics.removeAll();
                            view.center = [loc[0], loc[1]];
                            view.zoom = 14;
                            pt = new Point({
                                type: "point",
                                longitude: loc[0],
                                latitude: loc[1]
                            });
                            var symbol = {
                                type: "simple-marker",
                                color: [0, 0, 0]
                            };

                            graphic = new Graphic({
                                geometry: pt,
                                symbol: symbol
                            });
                            if (loc.length === 4) {
                                var pt2 = new Point({
                                    type: "point",
                                    longitude: loc[2],
                                    latitude: loc[3]
                                });
                                var graphic2 = new Graphic({
                                    geometry: pt2,
                                    symbol: symbol
                                });
                                view.graphics.add(graphic2);
                            }
                            else if (loc.length === 6) {
                                pt2 = new Point({
                                    type: "point",
                                    longitude: loc[2],
                                    latitude: loc[3]
                                });
                                graphic2 = new Graphic({
                                    geometry: pt2,
                                    symbol: symbol
                                });
                                view.graphics.add(graphic2);
                                pt3 = new Point({
                                    type: "point",
                                    longitude: loc[4],
                                    latitude: loc[5]
                                });
                                graphic3 = new Graphic({
                                    geometry: pt3,
                                    symbol: symbol
                                });
                                view.graphics.add(graphic3);
                            }


                            view.graphics.add(graphic);

                        }
                    );
                },
                error: function () {
                    console.log('error');
                }
            });
        }
        else if (item === "WGS84") {
            var loc = data2.split(',');
            require([
                "esri/geometry/Point", "esri/Graphic"],
                function (Point, Graphic) {
                    view.graphics.removeAll();
                    view.center = [loc[0], loc[1]];
                    view.zoom = 14;
                    pt = new Point({
                        type: "point",
                        longitude: loc[0],
                        latitude: loc[1]
                    });
                    var symbol = {
                        type: "simple-marker",
                        color: [0, 0, 0]
                    };

                    graphic = new Graphic({
                        geometry: pt,
                        symbol: symbol
                    });
                    if (loc.length === 4) {
                        pt2 = new Point({
                            type: "point",
                            longitude: loc[2],
                            latitude: loc[3]
                        });
                        graphic2 = new Graphic({
                            geometry: pt2,
                            symbol: symbol
                        });
                        view.graphics.add(graphic2);
                    }
                    else if (loc.length === 6) {
                        pt2 = new Point({
                            type: "point",
                            longitude: loc[2],
                            latitude: loc[3]
                        });
                        graphic2 = new Graphic({
                            geometry: pt2,
                            symbol: symbol
                        });
                        view.graphics.add(graphic2);
                        pt3 = new Point({
                            type: "point",
                            longitude: loc[4],
                            latitude: loc[5]
                        });
                        graphic3 = new Graphic({
                            geometry: pt3,
                            symbol: symbol
                        });
                        view.graphics.add(graphic3);
                    }


                    view.graphics.add(graphic);

                }
            );
        }
    }
    else {
        alert("請至少輸入一組X、Y座坐標");
    }

}

function switchmap() {
    $("#base").css("border", "2px solid #0070C0");
    var Latitude, Longitude;
    function getCenterPoint() {
        return map.extent.getCenter();
    }
    map.on("extent-change", function () {
        var point = getCenterPoint();
        Latitude = point.getLatitude();
        Longitude = point.getLongitude();
    });

    $(document).on('click', '#base', function () {
        baselayer.visible = true;
        Orthophoto.visible = false;
        map.basemap.baseLayers.items[0].visible = false;
        $("#base").css("border", "2px solid #0070C0");
        $("#ot").css("border", "1px solid white");
        $("#osm").css("border", "1px solid white");
    });
    $(document).on('click', '#ot', function () {
        baselayer.visible = false;
        Orthophoto.visible = true;
        map.basemap.baseLayers.items[0].visible = false;
        $("#base").css("border", "1px solid white");
        $("#ot").css("border", "2px solid #0070C0");
        $("#osm").css("border", "1px solid white");
    });
    $(document).on('click', '#osm', function () {
        map.basemap.baseLayers.items[0].visible = true;
        baselayer.visible = false;
        Orthophoto.visible = false;
        $("#base").css("border", "1px solid white");
        $("#ot").css("border", "2px solid white");
        $("#osm").css("border", "2px solid #0070C0");
    });

}
//各網頁點定位功能
function location1(x, y) {
    require([
        "esri/geometry/Point", "esri/Graphic"],
        function (Point, Graphic) {
            view.graphics.removeAll();
            view.center = [x, y];
            view.zoom = 20;
            var pt = new Point({
                latitude: Number(y),
                longitude: Number(x)
            });
            var symbol = {
                type: "simple-marker",
                color: [0, 0, 0]
            };
            graphic = new Graphic({
                geometry: pt,
                symbol: symbol
            });
            view.graphics.add(graphic);

        });
}
//各網頁點定位功能(需轉換座標系)
function location2(x, y) {

    //var lon1 = parseFloat(x);
    //var lat1 = parseFloat(y);
    var loc = transform2(x, y);
    var num = loc.split(',');
    require([
        "esri/geometry/Point", "esri/Graphic"],
        function (Point, Graphic) {
            view.graphics.removeAll();
            view.center = [num[0], num[1]];
            view.zoom = 20;
            var pt = new Point({
                latitude: Number(num[1]),
                longitude: Number(num[0])
            });
            var symbol = {
                type: "simple-marker",
                color: [0, 0, 0]
            };
            graphic = new Graphic({
                geometry: pt,
                symbol: symbol
            });
            view.graphics.add(graphic);
        });
}

function location3(Args) {
    var N = Args.toString();
    var group = [];
    var loc = [];
    var num = [];
    for (var i = 0; i < Args.length / 2; i++) {
        group.push([N.split(',')[i], N.split(',')[i + Args.length / 2]]);
    }
    console.log(group);
    for (i = 0; i < group.length; i++) {
        loc = transform2(Number(group[i][0]), Number(group[i][1]));
        num.push(loc.split(','));
    }
    console.log(num);
    //var loc = transform2(x, y);
    //var num = loc.split(',');
    require([
        "esri/geometry/Point", "esri/Graphic"],
        function (Point, Graphic) {
            view.graphics.removeAll();
            view.center = [num[0][0], num[0][1]];
            view.zoom = 15;
            for (var i = 0; i < num.length; i++) {
                pt = new Point({
                    latitude: Number(num[i].toString().split(',')[1]),
                    longitude: Number(num[i].toString().split(',')[0])
                });
                addGraphic(pt);
            }
            function addGraphic(pt) {
                graphic = new Graphic({
                    symbol: {
                        type: "simple-marker",
                        color: [0, 0, 0],
                        size: "12px"
                    },
                    geometry: pt
                });
                view.graphics.add(graphic);
            }
        });
}

//管線單位面定位功能
function DrawCasePolygon(no, cate, kind) {
    sketchLayer_new.removeAll();
    sketchLayer.removeAll();
    //document.getElementById("btnClear").click();
    //document.getElementById("btnClearPoints").click();
    //document.getElementById("tbCaseNo").value = no;
    //document.getElementById("tbCategoryCase").value = cate;
    //document.getElementById("PointListX").value = "";//點清空
    //document.getElementById("PointListY").value = "";//點清空
    //document.getElementById("tbKind").value = kind;
    var data = { "data": no + "," + cate + "," + kind };
    console.log(data);
    $.ajax({
        type: "POST",
        url: "PubLocationMap.aspx/DrawCasePolygon",
        dataType: "json",
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            console.log('success');
            if (data.d !== "[]") {
                require([
                    "esri/Graphic", "esri/geometry/Polygon", "esri/geometry/SpatialReference", "esri/layers/GraphicsLayer"
                ], function (Graphic, Polygon, SpatialReference, GraphicsLayer) {
                    view.graphics.removeAll();
                   
                    sketchLayer = new GraphicsLayer();
                    map.add(sketchLayer);
                    var typeArray = data.d;
                    var CoordinatesList = [];
                    const idList = JSON.parse(typeArray).map(item => Object.values(item));
                    const _idList = idList.map(item => Object.values(item));
                    
                    var simpleLineSymbol = {
                        type: "simple-line",
                        color: [226, 119, 40], // orange
                        width: 2
                    };
                    for (var i = 0; i < _idList.length; i++) {
                        
                        const Coordinates = _idList[i].map(item => Object.values(item));
                        if (Coordinates.length > 0) {
                            var points = [];
                            var Coordinates_XY = $.map(Coordinates[0][0], function (item, index) {
                                var tran_xy = transform2(item.X, item.Y);
                                points.push([Number(tran_xy.split(',')[0]), Number(tran_xy.split(',')[1])]);
                                console.log(points);
                                return points;
                            });

                            CoordinatesList.push(Coordinates_XY);
                            var polygon = new Polygon(new SpatialReference({ wkid: 4326 }));
                            polygon.addRing(CoordinatesList[i]);
                            var polylineGraphic = new Graphic({
                                geometry: polygon,
                                symbol: simpleLineSymbol
                            });
                            sketchLayer.add(polylineGraphic);
                        }
                    }
                    //if (points !== []) {
                        view.center = [points[0][0], points[0][1]];
                        view.zoom = 16;
                   // }
                });
            }
            else { alert("很抱歉，此筆案件查不到劃設資料。"); }
        },
        error: function () {
            console.log('error');
        }
    });
}

//呼叫mg畫Polygon事件
function DigitizePolygon() {
    $("#sketch_btn").show();
    $(".esri-icon-pan").attr('type', 'button');
    $(".esri-icon-cursor").attr('type', 'button');
    $(".esri-icon-polygon").attr('type', 'button');
    $(".esri-icon-undo").attr('type', 'button');
    $(".esri-icon-redo").attr('type', 'button');
    $(".esri-icon-map-pin").attr('style', 'display:none');
    $(".esri-icon-map-pin").attr('style', 'display:none');
    $(".esri-icon-map-pin").attr('style', 'display:none');
    $(".esri-icon-polyline").attr('style', 'display:none');
    $(".esri-icon-radio-unchecked").attr('style', 'display:none');
    $(".esri-icon-checkbox-unchecked").attr('style', 'display:none');

    //OnPolygonDigitized();
}

function OnPolygonDigitized(poly) {
    var rs = FormatLineResults(poly);
    //====
    //畫完polygon後處理事件....
    //=====


    //cursor復原
    //document.getElementById('div_back').style.cursor = "default";
    ptx = "";
    pty = "";

}
function FormatLineResults(line) {
    str = "Points: " + line.Count + "\n";

    for (var i = 0; i < line.Count; i++) {
        pt = line.Point(i);
        ptx += pt.X + ",";
        pty += pt.Y + ",";
    }
    //回傳坐標值
    //return ptx;
}

function ClearPolygons(category) {//清除尚未儲存的劃設範圍
    sketchLayer_new.removeAll();
    //});
    //設定劃設的功能分類
    //Iframe3.document.getElementById("tbCategory").value = category;

    //document.getElementById("btnClear").click();
    //$(".esri-icon-trash").click();
}
function DigitizePolygon_old(category) {//清除舊的劃設範圍
    view.graphics.removeAll();
    sketchLayer.removeAll();
    alert("已清除畫設範圍");
    //console.log(category);
    var data = { "data": category };
    $.ajax({
        type: "POST",
        url: "PubLocationMap.aspx/del_poly",
        dataType: "json",
        data: JSON.stringify(data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.d === "success") {
                console.log("success");
            }
            else
            {
                console.log("刪除失敗");
            }
        },
        error: function () {
            console.log('error');
        }
    });
}
function ClearAll() {
    view.graphics.removeAll();
    sketchLayer_new.removeAll();
    sketchLayer.removeAll();
    $('#sketch_btn').hide();
}
function DrawCasePolygonSketch() {
    var geometry = '';
    var x = '';
    var y = '';
    var _geom;
    var _data = '';
    var arrx, arry;
    proj4.defs([
        [
            'EPSG:4326',
            '+title=WGS84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
        [
            'EPSG:3826',
            '+title=TWD97 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +units=m +no_defs'
        ],
        [
            'EPSG:3828',
            '+title=TWD67 TM2 +proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=aust_SA +towgs84=-752,-358,-179,-0.0000011698,0.0000018398,0.0000009822,0.00002329 +units=m +no_defs'
        ],
        [
            'EPSG:3857',
            '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
        ]
    ]);

    var EPSG3857 = new proj4.Proj('EPSG:3857');
    var EPSG3826 = new proj4.Proj('EPSG:3826');
    var json="[";
    if (sketchLayer_new.graphics.length !== 0) {//新繪製劃設範圍
        var k = 0;
        sketchLayer_new.graphics.forEach(function (graphic) {//獲取圖形點座標
            var _geometry = graphic.geometry.rings;
            console.log(_geometry[0]);
            k++;
        //    for (i = 0; i < graphic.geometry.rings.length; i++) {
        //        geometry += _geometry[i];
        //    }
        //    _geom = geometry.split(',');
        //    for (i = 0; i < _geom.length; i += 2) {
        //        x += _geom[i] + ",";
        //    }
        //    for (i = 1; i < _geom.length; i += 2) {
        //        y += _geom[i] + ",";
        //    }

        //    arrx = x.substring(0, x.length - 1).split(',');
        //    arry = y.substring(0, y.length - 1).split(',');
            json += '{"index":"' + k +'","XY":"';
            for (i = 0; i < _geometry[0].length; i++) {
                let XY = _geometry[0][i];
                
                let data = proj4(EPSG3857, EPSG3826, [Number(XY[0]), Number(XY[1])]);
                _data = data[0] + "," + data[1];
                json +=  _data+"-";
            }
            json = json.substring(0, json.length - 1);
            json += '"},';
            console.log(json);
        });

        //for (i = 0; i < arrx.length; i++) {
        //    let data = proj4(EPSG3857, EPSG3826, [Number(arrx[i]), Number(arry[i])]);
        //    _data += data[0] + "," + data[1] + ",";
        //}
       
        sketchLayer_new.removeAll();//儲存後清除圖形關閉繪製工具
        $('#sketch_btn').hide();
        return json.substring(0, json.length - 1)+"]";
       
    }
    else {
        //sketchLayer.graphics.forEach(function (graphic) {//獲取圖形點座標
        //    var _geometry = graphic.geometry.rings;
        //    for (i = 0; i < graphic.geometry.rings.length; i++) {
        //        geometry += _geometry[i];
        //    }
        //    _geom = geometry.split(',');
        //    for (i = 0; i < _geom.length; i += 2) {
        //        x += _geom[i] + ",";
        //    }
        //    for (i = 1; i < _geom.length; i += 2) {
        //        y += _geom[i] + ",";
        //    }

        //    arrx = x.substring(0, x.length - 1).split(',');
        //    arry = y.substring(0, y.length - 1).split(',');
        //});

        //for (i = 0; i < arrx.length; i++) {
        //    let data = proj4(EPSG3857, EPSG3826, [Number(arrx[i]), Number(arry[i])]);
        //    _data += data[0] + "," + data[1] + ",";
        //}
        //sketchLayer.removeAll();//儲存後清除圖形關閉繪製工具
        //$('#sketch_btn').hide();
        //return _data.substring(0, _data.length - 1);
        return "";
    }
}


function RouteTask(theArgs) {
    //var _data = data.split(';');
    var _data = { "data": theArgs.toString() };
    console.log(_data);
    $.ajax({
        type: "POST",
        url: "PubLocationMap.aspx/RouteTask",
        dataType: "json",
        data: JSON.stringify(_data),
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            if (data.d !== '') {
                var loc = data.d.split(";");
                require([
                    "esri/Graphic", "esri/tasks/RouteTask", "esri/tasks/support/RouteParameters", "esri/tasks/support/FeatureSet", "esri/geometry/Point"
                ], function (Graphic, RouteTask, RouteParameters, FeatureSet, Point) {
                    var routeTask = new RouteTask({
                        url: "https://utility.arcgis.com/usrsvcs/appservices/MwemgDx2jskXfSv5/rest/services/World/Route/NAServer/Route_World/solve"
                    });

                    var points = [];
                    view.graphics.removeAll();
                    view.center = [loc[0].split(',')[0], loc[0].split(',')[1]];
                    view.zoom = 14;
                    for (i = 0; i < loc.length - 1; i++) {
                        points.push([loc[i].split(',')[0], loc[i].split(',')[1]]);
                    }
                    console.log(points);

                    for (var i = 0; i < points.length; i++) {
                        pt = new Point({
                            latitude: Number(points[i].toString().split(',')[1]),
                            longitude: Number(points[i].toString().split(',')[0])
                        });
                        addGraphic(pt);
                    }

                    getRoute();
                    function addGraphic(pt) {
                        graphic = new Graphic({
                            symbol: {
                                type: "simple-marker",
                                color: [0, 0, 0],
                                size: "12px"
                            },
                            geometry: pt
                        });
                        view.graphics.add(graphic);
                    }

                    function getRoute() {
                        // Setup the route parameters
                        console.log(view.graphics.toArray());
                        var routeParams = new RouteParameters({
                            stops: new FeatureSet({
                                //features: view.graphics.toArray()
                                features: view.graphics.toArray()
                            }),
                            returnDirections: true
                        });
                        // Get the route
                        routeTask.solve(routeParams)
                            .then(function (data) {
                                data.routeResults.forEach(function (result) {
                                    result.route.symbol = {
                                        type: "simple-line",
                                        color: [5, 150, 255],
                                        width: 3
                                    };
                                    view.graphics.add(result.route);
                                });

                            });
                    }
                });
            }
            else { alert("有巡查點無座標資料。"); }
        },
        error: function () {
            console.log('error');
        }
    });
}

//寬頻路徑查詢
function RouteTask2(theArgs) {
    //var _data = data.split(';');
    var data = theArgs.toString();
    console.log(data);
    if (data !== '') {
        var loc = data.split(",");
        var x = '';
        var y = '';
        require([
            "esri/Graphic", "esri/tasks/RouteTask", "esri/tasks/support/RouteParameters", "esri/tasks/support/FeatureSet", "esri/geometry/Point"
        ], function (Graphic, RouteTask, RouteParameters, FeatureSet, Point) {
            var routeTask = new RouteTask({
                url: "https://utility.arcgis.com/usrsvcs/appservices/MwemgDx2jskXfSv5/rest/services/World/Route/NAServer/Route_World/solve"
            });

            var points = [];
            view.graphics.removeAll();

            view.center = [loc[0], loc[1]];
            view.zoom = 16;
            //for (i = 0; i < loc.length; i++) {
            //    points.push([loc.split(',')[i], loc[i].split(',')[i+1]]);
            //}
            for (i = 0; i < loc.length; i += 2) {
                x += loc[i] + ",";
            }
            for (i = 1; i < loc.length; i += 2) {
                y += loc[i] + ",";
            }

            var arrx = x.substring(0, x.length - 1).split(',');
            var arry = y.substring(0, y.length - 1).split(',');
            console.log(arrx);
            console.log(arry);

            for (var i = 0; i < arrx.length; i++) {
                pt = new Point({
                    latitude: Number(arry[i]),
                    longitude: Number(arrx[i])
                });

                addGraphic(pt);
            }

            getRoute();
            function addGraphic(pt) {
                graphic = new Graphic({
                    symbol: {
                        type: "simple-marker",
                        color: [0, 0, 0],
                        size: "12px"
                    },
                    geometry: pt
                });
                view.graphics.add(graphic);
            }

            function getRoute() {
                // Setup the route parameters
                console.log(view.graphics.toArray());
                var routeParams = new RouteParameters({
                    stops: new FeatureSet({
                        features: view.graphics.toArray()
                    }),
                    returnDirections: true
                });
                // Get the route
                routeTask.solve(routeParams)
                    .then(function (data) {
                        data.routeResults.forEach(function (result) {
                            result.route.symbol = {
                                type: "simple-line",
                                color: [5, 150, 255],
                                width: 3
                            };
                            view.graphics.add(result.route);
                        });

                    });
            }
        });
    }
    else { alert("有寬頻管道無座標資料。"); }

}
