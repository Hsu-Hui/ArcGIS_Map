var map;
var baselayer, Orthophoto;
var baselayer2, Orthophoto, OSM, sketch, sketchLayer, sketchLayer_new;
var path = [];
var view;
var index;
var activeWidget = null;
let polygonGraphicsLayer,
    sketchViewModel,
    grid, grid2;
require(["esri/Map", "esri/views/MapView", "esri/layers/TileLayer", "esri/layers/FeatureLayer", "esri/layers/WMTSLayer",
    "esri/widgets/DistanceMeasurement2D", "esri/widgets/AreaMeasurement2D", "esri/widgets/Print", "esri/widgets/Search",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/Color", "esri/geometry/Point", "esri/layers/GraphicsLayer",
    "esri/Graphic", "esri/widgets/Sketch/SketchViewModel", "dgrid/OnDemandGrid", "dgrid/extensions/ColumnHider", "dojo/store/Memory",
    "dstore/legacy/StoreAdapter", "dgrid/Selection", "esri/widgets/FeatureForm", "esri/layers/WMSLayer", "esri/config",
    "esri/core/urlUtils", "esri/geometry/Extent", "esri/geometry/SpatialReference", "esri/widgets/Sketch", "esri/layers/WebTileLayer","esri/widgets/Editor"],
    function (Map, MapView, TileLayer, FeatureLayer, WMTSLayer, DistanceMeasurement2D, AreaMeasurement2D, Print, Search, SimpleMarkerSymbol, SimpleLineSymbol,
        Color, Point, GraphicsLayer, Graphic, SketchViewModel, OnDemandGrid, ColumnHider, Memory, StoreAdapter, Selection, FeatureForm, WMSLayer,
        esriConfig, urlUtils, Extent, SpatialReference, Sketch, WebTileLayer,Editor) {
        const gridDiv = document.getElementById("grid");
        const infoDiv = document.getElementById("info");

        esriConfig.request.proxyUrl = "../../DotNet/proxy.ashx";

        //====測量工具Start===


        document
            .getElementById("distanceButton")
            .addEventListener("click", function () {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {

                    setActiveWidget("distance");
                } else {
                    setActiveButton(null);
                }
            });

        document
            .getElementById("areaButton")
            .addEventListener("click", function () {
                setActiveWidget(null);
                if (!this.classList.contains("active")) {
                    setActiveWidget("area");
                } else {
                    setActiveButton(null);
                }
            });

        function setActiveWidget(type) {
            switch (type) {
                case "distance":
                    activeWidget = new DistanceMeasurement2D({
                        view: view
                    });
                    activeWidget.watch("viewModel.state", function (state) {
                        if (state == "measured") {
                            $(".esri-direct-line-measurement-3d__clear-button").attr('type', 'button');
                        }
                    });
                    // skip the initial 'new measurement' button
                    activeWidget.viewModel.newMeasurement();
                    view.ui.add(activeWidget, "top-right");
                    setActiveButton(document.getElementById("distanceButton"));
                    break;
                case "area":
                    activeWidget = new AreaMeasurement2D({
                        view: view
                    });
                    activeWidget.watch("viewModel.state", function (state) {
                        if (state == "measured") {
                            $(".esri-area-measurement-3d__clear-button").attr('type', 'button');
                        }
                    });
                    // skip the initial 'new measurement' button
                    activeWidget.viewModel.newMeasurement();
                    view.ui.add(activeWidget, "top-right");
                    setActiveButton(document.getElementById("areaButton"));
                    break;
                case null:
                    if (activeWidget) {
                        view.ui.remove(activeWidget);
                        activeWidget.destroy();
                        activeWidget = null;
                    }
                    break;
            }
        }

        function setActiveButton(selectedButton) {
            // focus the view to activate keyboard shortcuts for sketching
            view.focus();
            var elements = document.getElementsByClassName("active");
            for (var i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            if (selectedButton) {
                selectedButton.classList.add("active");
            }

        }
        //====測量工具End===      

        var popupTrailheads1 = {
            "title": "{COUNTY}",
            "content": "<b>STATE :</b> {STATE}<br><b>HSGRAD_CY :</b> {HSGRAD_CY}<br><b>GED_CY :</b> {GED_CY}<br><b>SMCOLL_CY :</b> {SMCOLL_CY}"
        }
        var popupTrailheads2 = {
            "title": "{COUNTY}",
            "content": "<b>STATE :</b> {STATE}<br><b>SQMI :</b> {SQMI}<br><b>MP28075a_B :</b> {MP28075a_B}"
        }
        var popupTrailheads3 = {
            "title": "{NAME}",
            "content": "<b>AVE_HH_SZ :</b> {AVE_HH_SZ}<br><b>MARHH_CHD:</b> {MARHH_CHD}<br><b>MARHH_NO_C:</b> {MARHH_NO_C}<br><b>FHH_CHILD:</b> {FHH_CHILD}"
        }

        //Enriched USA Counties - Education
        var pipeLineLayer1 = new FeatureLayer({
            url:"https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Enriched%20USA%20Counties%20-%20Education/FeatureServer/0",
            outFields: ["*"],
            visible: false,
            popupTemplate: popupTrailheads1
        });
        //Enriched USA Counties (Generalized) 
        var pipeLineLayer2 = new FeatureLayer({
            url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Enriched%20USA%20Counties%20(Generalized)/FeatureServer/0",
            outFields: ["*"],
            visible: false,
            popupTemplate: popupTrailheads2
        });
        //Enriched USA Major Cities
        var pipeLineLayer3 = new FeatureLayer({
            url:"https://services.arcgis.com/V6ZHFr6zdgNZuVG0/ArcGIS/rest/services/Enriched%20USA%20Major%20Cities/FeatureServer/0",
            outFields: ["*"],
            visible: false,
            popupTemplate: popupTrailheads3
        });
        baselayer = new WebTileLayer("http://wmts.nlsc.gov.tw/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=EMAP&STYLE=_null&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{level}&TILEROW={row}&TILECOL={col}&FORMAT=image/png"
            , {
                "id": "NLSCMAP_W"
            }
        );
        Orthophoto = new WebTileLayer("http://wmts.nlsc.gov.tw/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=PHOTO2&STYLE=_null&TILEMATRIXSET=EPSG:3857&TILEMATRIX=EPSG:3857:{level}&TILEROW={row}&TILECOL={col}&FORMAT=image/png",
            {
                id: "Orthophoto"
            }
        );


        map = new Map({
            basemap: "osm",
            layers: [baselayer,Orthophoto],
        });
        Orthophoto.visible = false;
        var layer = new GraphicsLayer();
        //===
        var symbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            7,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_NULL,
                new Color([247, 34, 101, 0.9]),
                1
            ),
            new Color([207, 34, 171, 0.5])
        );
     
        view = new MapView({ container: 'viewDiv', map: map, zoom: 5, center: [-99.4411535, 38.495586] });

        map.add(pipeLineLayer1);
        map.add(pipeLineLayer2);
        map.add(pipeLineLayer3);
      

        //底圖載入完成事件
        view.when(function () {
            //console.log(map.basemap.baseLayers.items[0]);
            // map.basemap.baseLayers.items[0].visible = false;
            map.layers.items[0].visible = false;
        });

            //=====圖層查詢功能EditStart=====
           


        var editorWidget = new Editor({
            view: view
        });

        view.ui.add(editorWidget, "top-right");

       
        //===搜尋定位功能start===
        var searchWidget = new Search({
            view: view,
            container: queryLocation
        });
        //    view.ui.add(searchWidget, {
        //    position: "top-right",
        //});        
        //var searchToggle = document.getElementById("mySearch");
        var searchToggle = document.getElementById('mySearch');
        searchToggle.addEventListener("change", function () {
            //alert("ccc"); searchToggle
            searchWidget.searchTerm = searchToggle.value; view.graphics.removeAll();
        });
        //===搜尋定位功能end===
        //===全部清除start===
        var btnAllClean = document.getElementById("btnAllClean");
        btnAllClean.addEventListener("click", function () {
            view.graphics.removeAll();
        });
        //===全部清除end===
        view.ui.add("topbar", "top-right");
        view.ui.add("switchMap", "top-right");
        view.ui.add("loc_table", "top-right");
        view.ui.add("queryLocation", "top-right");
        view.ui.add("googlemap", "top-right");
        ////====繪製工具===    
        sketchLayer = new GraphicsLayer();
        sketchLayer_new = new GraphicsLayer();
        map.layers.add(sketchLayer);
        map.layers.add(sketchLayer_new);
        sketch = new Sketch({
            view: view,
            layer: sketchLayer_new,
            availableCreateTools: ["polygon"],
            container: sketch_btn
        });

        view.ui.add(sketch_btn, "top-right");

        sketch.on("update", function (evt) {
            //$(".esri-icon-trash").attr('type', 'button');
            $(".esri-icon-trash").attr('style', 'display:none');

        });




        //===管線check綁定===
        var pipeLine1Toggle = document.getElementById("pipeLine1");
        pipeLine1Toggle.addEventListener("click", function () {
            if (pipeLine1Toggle.checked)
                pipeLineLayer1.visible = true;
            else
                pipeLineLayer1.visible = false;
        });
        var pipeLine2Toggle = document.getElementById("pipeLine2");
        pipeLine2Toggle.addEventListener("click", function () {
            if (pipeLine2Toggle.checked)
                pipeLineLayer2.visible = true;
            else
                pipeLineLayer2.visible = false;
        });
        var pipeLine3Toggle = document.getElementById("pipeLine3");
        pipeLine3Toggle.addEventListener("click", function () {
            if (pipeLine3Toggle.checked)
                pipeLineLayer3.visible = true;
            else
                pipeLineLayer3.visible = false;
        });
     

        //===function code start===
        const gridFields = [
            "id",
            "類別碼",
            "識別碼",
            "設施種類"
        ];
        const gridFields2 = [
            "id",
            "類別碼",
            "識別碼",
            "設施種類"
        ];
        // create a new datastore for the on demandgrid
        // will be used to display attributes of selected features
        const dataStore = new StoreAdapter({
            objectStore: new Memory({
                idProperty: "id"
            })
        });
        const dataStore2 = new StoreAdapter({
            objectStore: new Memory({
                idProperty: "id"
            })
        });

      
       
        ////=====繪製功能開始SketchStart====
        //setUpSketchViewModel();
        sketchViewModel.on("create", function (event) {
            if (event.state === "complete") {
                // this polygon will be used to query features that intersect it
                polygonGraphicsLayer.remove(event.graphic);
                selectFeatures(event.graphic.geometry);
            }
        });

        //=====using function ====
        function setUpSketchViewModel() {
            // polygonGraphicsLayer will be used by the sketchviewmodel
            // show the polygon being drawn on the view
            polygonGraphicsLayer = new GraphicsLayer();
            map.add(polygonGraphicsLayer);

            //add the select by polygon button the view
            view.ui.add("select-by-polygon", "top-left");
            const selectButton = document.getElementById("select-by-polygon");

            //click event for the button
            selectButton.addEventListener("click", function () {
                clearUpSelection();
                view.popup.close();
                // ready to draw a polygon
                sketchViewModel.create("polygon");
            });

            //create a new sketch view model set its layer
            sketchViewModel = new SketchViewModel({
                view: view,
                layer: polygonGraphicsLayer,
                pointSymbol: {
                    type: "simple-marker",
                    color: [255, 255, 255, 0],
                    size: "1px",
                    outline: {
                        color: "gray",
                        width: 0
                    }
                }
            });
        }

        function clearUpSelection() {
            view.graphics.removeAll();
            if (highlight) {
                highlight.remove();
            }
            if (highlight2) {
                highlight2.remove();
            }
            if (highlight3) {
                highlight3.remove();
            }
       
            grid.clearSelection();
        }

        function selectFeatures(geometry) {
            view.graphics.removeAll();
            var dataAll = [];
            var count = 0;
            var count2 = 0;

            if (highlight) {
                highlight.remove();
            }
            if (highlight2) {
                highlight2.remove();
            }
            if (highlight3) {
                highlight3.remove();
            }
          
         
        }
        function errorCallback(error) {
            console.log("error:", error);
        }
       
       

        //=====using function ====

        //====edit function====              
        view.on("click", function (event) {

            // Unselect any currently selected features
            unselectFeature();
            // Listen for when the user clicks on the view
            //view.hitTest(event).then(function (response) {
            //    // If user selects a feature, select it
            //    const results = response.results;
            //    if (
            //      results.length > 0 &&
            //      results[0].graphic &&
            //      results[0].graphic.layer === csvLayer
            //    ) {
            //        selectFeature(
            //          results[0].graphic.attributes[pipeLineLayer1.objectIdField]
            //        );
            //    } else {
            //        // Hide the form and show the info div
            //        document.getElementById("update").classList.add("esri-hidden");
            //    }
            //});
        });

        // Function to unselect features
        function unselectFeature() {
            if (highlight) {
                highlight.remove();
            }
            if (highlight2) {
                highlight2.remove();
            }
            if (highlight3) {
                highlight3.remove();
            }
         
        }

        // Highlight the clicked feature and display
        // its attributes in the featureform.
        function selectFeature(objectId, type) {

            //query feature from the server
            if (type == "layer1") {
                pipeLineLayer1
                    .queryFeatures({
                        objectIds: [objectId],
                        outFields: ["*"],
                        returnGeometry: true
                    })
                    .then(function (results) {
                        if (results.features.length > 0) {
                            editFeature = results.features[0];
                            // highlight the feature on the view
                            view.whenLayerView(editFeature.layer).then(function (layerView) {
                                highlight999 = layerView.highlight(editFeature);
                            })
                        }
                    });
                pipeLineLayer1
                    .queryFeatures({
                        geometry: view.extent,
                        objectIds: [objectId],
                        outFields: ["*"],
                        returnGeometry: true
                    })
                    .then(function (results) {
                        graphics = results.features;
                        const fragment = document.createDocumentFragment();
                        graphics.forEach(function (result, index) {
                            const attributes = result.attributes;
                            const name = attributes.id;
                            if (name == objectId) {

                                var loc = transform(result.geometry.x, result.geometry.y);
                                var num = loc.split(',');

                                var pt = new Point({
                                    latitude: Number(num[1]),
                                    longitude: Number(num[0])
                                });
                                view.goTo(pt).then(function () {
                                    view.popup.open({
                                        features: [result],
                                        location: pt
                                    });

                                });
                            }
                        });
                    })
                    .catch(function (error) {
                        console.error("query failed: ", error);
                    });
            }
            if (type == "layer2") {
                pipeLineLayer2
                    .queryFeatures({
                        objectIds: [objectId],
                        outFields: ["*"],
                        returnGeometry: true
                    })
                    .then(function (results) {
                        if (results.features.length > 0) {
                            editFeature = results.features[0];

                            // highlight the feature on the view
                            view.whenLayerView(editFeature.layer).then(function (layerView) {
                                highlight999 = layerView.highlight(editFeature);
                            });
                        }
                    });
                pipeLineLayer2
                    .queryFeatures({
                        geometry: view.extent,
                        objectIds: [objectId],
                        outFields: ["*"],
                        returnGeometry: true
                    })
                    .then(function (results) {
                        graphics = results.features;
                        const fragment = document.createDocumentFragment();
                        graphics.forEach(function (result, index) {
                            const attributes = result.attributes;
                            const name = attributes.id;
                            if (name == objectId) {  //OBJECTID==20
                                var loc = transform(result.geometry.x, result.geometry.y);
                                var num = loc.split(',');

                                var pt = new Point({
                                    latitude: Number(num[1]),
                                    longitude: Number(num[0])
                                });
                                view.goTo(pt).then(function () {
                                    view.popup.open({
                                        features: [result],
                                        location: pt
                                    });
                                });
                            }
                        });
                    })
                    .catch(function (error) {
                        console.error("query failed: ", error);
                    });
            }
            if (type == "layer3") {
                pipeLineLayer3
                    .queryFeatures({
                        objectIds: [objectId],
                        outFields: ["*"],
                        returnGeometry: true
                    })
                    .then(function (results) {
                        if (results.features.length > 0) {
                            editFeature = results.features[0];

                            // highlight the feature on the view
                            view.whenLayerView(editFeature.layer).then(function (layerView) {
                                highlight999 = layerView.highlight(editFeature);
                            });
                        }
                    });
                pipeLineLayer3
                    .queryFeatures({
                        geometry: view.extent,
                        objectIds: [objectId],
                        outFields: ["*"],
                        returnGeometry: true
                    })
                    .then(function (results) {
                        graphics = results.features;
                        const fragment = document.createDocumentFragment();
                        graphics.forEach(function (result, index) {
                            const attributes = result.attributes;
                            const name = attributes.id;
                            if (name == objectId) {  //OBJECTID==20
                                var loc = transform(result.geometry.x, result.geometry.y);
                                var num = loc.split(',');

                                var pt = new Point({
                                    latitude: Number(num[1]),
                                    longitude: Number(num[0])
                                });
                                view.goTo(pt).then(function () {
                                    view.popup.open({
                                        features: [result],
                                        location: pt
                                    });
                                });
                            }
                        });
                    })
                    .catch(function (error) {
                        console.error("query failed: ", error);
                    });
            }
        }

        //=====edit function====
        view.ui.add("update", "top-right");


    });
function transform(x, y) {
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

    let EPSG3857 = new proj4.Proj('EPSG:3857');
    let EPSG4326 = new proj4.Proj('EPSG:4326');
    let data3 = proj4(EPSG3857, EPSG4326, [x, y]);
    //alert(data3[0]);
    //alert(data3[1]);     

    return data3[0] + "," + data3[1];
}
function transform2(x, y) {
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

    let EPSG3826 = new proj4.Proj('EPSG:3826');
    let EPSG4326 = new proj4.Proj('EPSG:4326');
    let data = proj4(EPSG3826, EPSG4326, [x, y]);
    //alert(data3[0]);
    //alert(data3[1]);     

    return data[0] + "," + data[1];
}

