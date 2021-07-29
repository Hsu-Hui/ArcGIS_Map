<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Index.aspx.cs" Inherits="WebApplication1.Index" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>ArcGIS_Demo</title>
     <link rel="stylesheet" href="Content/bootstrap.css" />
    <link rel="stylesheet" href="Content/map_style.css" />
    <link rel="stylesheet" href="Content/bootstrap.vertical-tabs.css" />
    <link rel="stylesheet" href="Content/Site.css" />
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script type="text/javascript" src="Content/bootree.min.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/proj4js/2.5.0/proj4.js"></script>
    <link rel="stylesheet" href="https://js.arcgis.com/4.11/esri/themes/light/main.css" />
    <link href="Content/bootree.css" rel="stylesheet" type="text/css" />
    <script type="text/javascript" src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
    <script type="text/javascript" src="https://js.arcgis.com/4.11/"></script>
    <script type="text/javascript" src="Scripts/map.js"></script>
    <script type="text/javascript" src="Scripts/New_map.js"></script>
    <script>
        //圖例
            $(document).ready(function () {
            var tree = $('#tree').tree({
                primaryKey: 'id',
                uiLibrary: 'bootstrap',
                //dataSource: '/Locations/Get',
                dataSource: [
                    {
                id: 1, text: '美國', children: [
                            { id: 2, text: '測試', children: [{ id: 3, text: '教育' }, {id: 4, text: '通用' }, {id: 5, text:'人口' }] },
                           ]
                    }
                ],
                checkboxes: true
            });
            var flag = "";
            $('.bt-checkbox-bootstrap').on('click', function () {
                var checkedIds = tree.getCheckedNodes();
                //console.log(checkedIds);

                if (checkedIds.indexOf(3) >= 0)
                    $("#pipeLine1").click();
                if (checkedIds.indexOf(4) >= 0)
                    $("#pipeLine2").click();
                if (checkedIds.indexOf(5) >= 0)
                    $("#pipeLine3").click();

            });
        });

        function alertSuccess() {
                alert("更新成功!請按鍵ctrl+F5重整頁面確認資料是否正確。");
        }
        function alertFailed(msg) {
                alert("更新失敗!失敗原因:" + msg);
        }
        //=====左側縮合選單====
        $(function () {
            //
            var duration = 300;

            // aside ----------------------------------------
            var $aside = $('.page-main > aside');
            var $asidButton = $aside.find('.qq')
                .on('click', function () {
                $aside.toggleClass('open');
                    if ($aside.hasClass('open')) {
                $aside.stop(true).animate({ left: '-70px' }, duration, 'easeOutBack');
                        $asidButton.find('img').attr('src', '../Images/drag.png');
                        $("#pipeList").css("overflow-y", "scroll");
                        $("#pipeList").css("overflow-x", "hidden");
                    } else {
                $aside.stop(true).animate({ left: '-350px' }, duration, 'easeInBack');
                        $asidButton.find('img').attr('src', '../Images/drag.png');
                    };
                });
        });
        //=====圖層開關打開左側縮合選單====
        function OpenLayer() {
            //
            var duration = 300;
            $(document).off("click", "#OpenLayer").on('click', '#OpenLayer', function () {
                $('.page-main > aside').toggleClass('open');
                if ($('.page-main > aside').hasClass('open')) {
                $('.page-main > aside').stop(true).animate({ left: '-70px' }, duration, 'easeOutBack');
                    $("#pipeList").css("overflow-y", "scroll");
                    $("#pipeList").css("overflow-x", "hidden");
                } else {
                $('.page-main > aside').stop(true).animate({ left: '-350px' }, duration, 'easeInBack');
                    //$('#OpenLayer').blur();

                };
                var display = $('#pipeList').css('overflow-y');
                if (display == 'none') {
                $('#OpenLayer').blur();
                }
            });
        };
        

    </script>
</head>

<body>
    <form id="form1" runat="server">
        <div class="body-section tab-content" style="height: 35px!important;">
            <div class="topmenu NoPrint">
                <ul>
                    <li>
                        <div style="" class="map_title">ArcGIS_Demo</div>
                    </li>
                    
                    <li><a href="#" class="icon" onclick="javascript:QuickLocation();">
                        <img src="images/placeholder.png" class="map_icon" alt="空間定位" title="空間定位" />
                    </a></li>
                    <li><a href="#" class="icon" onclick="javascript:MapSwitch();">
                        <img src="images/shuffle.png" class="map_icon" alt="底圖切換" title="底圖切換" />
                    </a></li>
                    <li><a href="#" class="icon" id="OpenLayer" onclick="javascript:OpenLayer();">
                        <img src="images/layers.png" class="map_icon" alt="圖層清單" title="圖層清單" />
                    </a></li>
                    <li><a href="#" class="icon" id="google" onclick="javascript:googlemap();">
                        <img src="images/map.png" class="map_icon" alt="街景查詢" title="街景查詢" />
                    </a></li>
                    <li><a href="#" class="icon" onclick="javascript:MeasuresTool();">
                        <img src="images/ruler.png" class="map_icon" alt="測量工具" title="測量工具" />
                    </a></li>
                </ul>
                <input type="submit" name="btnAllClean" id="btnAllClean" style="display: none;" />
            </div>
        </div>
        <div id="viewDiv" style="height: 95.2vh"></div>

        <div class="page-main" role="main">
            <aside>
                <span id="pipeList">
                    <div style="font-size: 20px; margin: 10px 20px; width: 90%">
                        圖層清單
                        <input type="button" class="qq" />
                    </div>
                    <div class="link-top"></div>
         <input type="checkbox" id="pipeLine1" style="margin-top: 5px; display: none" /><!-Test1-->
        <input type="checkbox" id="pipeLine2" style="margin-top: 5px; display: none" /><!-Test2-->
        <input type="checkbox" id="pipeLine3" style="margin-top: 5px; display: none" /><!-Test3-->
            <div id="tree"></div>
                </span>
                
            </aside>
        </div>
        <!--測量工具-->
        <div id="topbar" style="background-color: white; display: none; width: 120px; height: 100px; float: right;">
            <div style="width: 120px; height: 30px;">
                <span id="Label6" class="wid_title">測量工具</span><a href="#" class="close_btn" onclick="javascript:close_table();" style="margin-left: 8px;"></a>
            </div>
            <div style="margin-left: 15px; margin-top: 5px;">
                <input type="button" class="action-button esri-icon-minus" id="distanceButton" title="Measure distance between two or more points" style="background-image: url(images/測量線.png);" />
                <input type="button" class="action-button esri-icon-polygon" id="areaButton" title="Measure area" style="background-image: url(images//測量面積.png);" />

            </div>
        </div>
        <!--測量工具-->
        <!--地圖切換-->
        <!--地圖切換-->
        <div id="switchMap" style="background-color: white; display: none; width: 245px; height: 300px; float: right;">
            <div style="width: 245px; height: 30px;">
                <span id="Label4" class="wid_title">底圖切換</span><a href="#" class="close_btn" onclick="javascript:close_table();" style="margin-left: 145px;"></a>
            </div>
            <div id="base" style="width: 235px; height: 80px; margin: 5px; background-image: url(images/電子地圖-長.png);" onclick="javascript:switchmap();" class="map_switch">
                <div style="background-color: white; opacity: 0.9; width: 100px; height: 20px; text-align: center; margin-left: 5px; color: #0e1217">電子地圖</div>
            </div>
            <div id="ot" style="width: 235px; height: 80px; margin: 5px; background-image: url(images/正射影像-長.png);" onclick="javascript:switchmap();" class="map_switch">
                <div style="background-color: white; opacity: 0.9; width: 100px; height: 20px; text-align: center; margin-left: 5px; color: #0e1217">正射影像</div>
            </div>
            <div id="osm" style="width: 235px; height: 80px; margin: 5px; background-image: url(images/openstreetmap-長.png);" onclick="javascript:switchmap();" class="map_switch">
                <div style="background-color: white; opacity: 0.9; width: 100px; height: 20px; text-align: center; margin-left: 5px; color: #0e1217">openstreetmap</div>
            </div>
        </div>
        
        
        <!--地圖切換-->
        <!--快速定位-->
        <div id="loc_table" style="background-color: white; display: none; width: 245px; height: 300px; float: right;">

            <div style="width: 245px; height: 30px;">
                <span id="Label1" class="wid_title">定位</span><a href="#" class="close_btn" onclick="javascript:close_table();" style="margin-left: 175px;"></a>
            </div>

            <div style="width: 245px; height: 30px; background-color: #DDDDDD;">
                <a href="javascript:void(0)" class="bar-item button tablink testbtn" onclick="openClass(event, 'class1')">行政區</a>
                <a href="javascript:void(0)" class="bar-item button tablink" onclick="openClass(event, 'class2')">道路</a>
                <a href="javascript:void(0)" class="bar-item button tablink" onclick="openClass(event, 'class3')">門牌</a>
                <a href="javascript:void(0)" class="bar-item button tablink" onclick="openClass(event, 'class4')">地標</a>
                <a href="javascript:void(0)" class="bar-item button tablink" onclick="openClass(event, 'class5')">坐標</a>

            </div>
            <div id="class1" class="con class">
                <br />
                <span id="Label2" class="village_lab">請選擇縣市：</span>
                <select id="ddlCity" class="ddl">
                     <option value="">請選擇</option>
                    <option value="121.6739_24.91571">新北市</option>
                    <option value="121.5598_25.09108">臺北市</option>
                    <option value="120.666_23.01087">高雄市</option>
                    <option value="120.9417_24.23321">臺中市</option>
                    <option value="121.2168_24.93759">桃園縣</option>
                    <option value="120.2513_23.1417">臺南市</option>
                    <option value="120.4818_23.99297">彰化縣</option>
                    <option value="120.62_22.54951">屏東縣</option>
                    <option value="120.3897_23.75585">雲林縣</option>
                    <option value="120.9417_24.48927">苗栗縣</option>
                    <option value="120.574_23.45889">嘉義縣</option>
                    <option value="121.1252_24.70328">新竹縣</option>
                    <option value="120.9876_23.83876">南投縣</option>
                    <option value="121.7195_24.69295">宜蘭縣</option>
                    <option value="121.7195_24.69295">宜蘭縣</option>
                    <option value="120.9647_24.80395">新竹市</option>
                    <option value="121.7081_25.10898">基隆市</option>
                    <option value="121.3542_23.7569">花蓮縣</option>
                    <option value="120.4473_23.47545">嘉義市</option>
                    <option value="120.9876_22.98461">臺東縣</option>
                    <option value="118.3186_24.43679">金門縣</option>
                    <option value="119.6151_23.56548">澎湖縣</option>
                    <option value="119.5397_26.19737">連江縣</option>
                </select>
                <br />
                <%--<span id="Label3" class="village_lab">請選擇村里：</span>
                <select name="TypeA[]" id="ddlCountry" class="ddl">
                    <option value="0">(------------)</option>
                </select>--%>
                <br />
                <input type="button" id="btnCountry" value="定位" onclick="Country_Search()" class="location_btn">
            </div>
            <div id="class2" class="con class">
                <label class="village_lab">路名關鍵字：</label>
                <br />
                <input type="text" id="road" class="ddl" />
                <br />
                <input type="button" id="btnroad" value="定位" onclick="Road_location()" class="location_btn">
                <div id="Road_frame" style="background-color: white; overflow: hidden">
                    <table id="Road_table" style="margin: 5px;"></table>
                </div>
            </div>
            <div id="class3" class="con class">
                <label class="village_lab">門牌關鍵字：</label>
            </div>
            <div id="class4" class="con class">
                <label class="village_lab">地標關鍵字：</label>
                <br />
                <input type="text" id="poi" class="ddl" />
                <br />
                <input type="button" id="btnpoi" value="定位" onclick="poi_Search()" class="location_btn">
                <div id="poi_frame" style="background-color: white; overflow: hidden">
                    <table id="poi_table" style="margin: 5px;"></table>
                </div>
            </div>
            <div id="class5" class="con class">
                <input type="radio" name="xy" value="TWD97" style="margin: 10px;" checked="checked">TWD97&nbsp;&nbsp;<input type="radio" name="xy" value="WGS84" style="margin: 10px;">WGS84
                <br />
                <div id="TextBoxDiv" style="background-color: white;">
                    <label class="village_lab">X坐標</label><label style="padding-left: 80px; color: red; margin-top: 5px;">*限最多新增三筆</label><br />
                    <input type="text" class="xy_txt" id="x1" name="x1" /><br />
                    <label class="village_lab">Y坐標</label><br />
                    <input type="text" class="xy_txt" id="y1" name="y1" /><br />
                    <input type="button" id="btninsert" value="新增" onclick="insert()" style="margin-left: 50px; margin-top: 5px;">
                    <input type="button" id="btnxy" value="定位" onclick="xy_Search()" style="margin-left: 60px; margin-top: 5px;">
                </div>
                <input type="hidden" id="Count" name="Count" value="2" />
            </div>
            <div id="queryLocation" style="display: none; margin-top: 100px; position: absolute;">
                <input name="mySearch" type="text" id="mySearch" class="mySearch" style="display: none;" />
            </div>
            <div id="queryLocation2" style="display: none; margin-top: 100px; position: absolute;">
                <input name="Text1" type="text" id="Text1" class="mySearch" style="display: none;" />
            </div>

        </div>
        <!--快速定位-->
        <!--編輯視窗-->
        <div id="update" class="esri-widget esri-hidden">
            <div id="form" class="scroller esri-component"></div>
            <input
                type="button"
                class="esri-button"
                value="Update assessment"
                id="btnUpdate" />
        </div>
        <!--編輯視窗-->
        <!--街景查詢-->
        <div id="googlemap" style="background-color: white; display: none; width: 290px; height: 30px; float: right;">
            <span id="Label5" class="wid_title">點選地圖任一點，另開新視窗查看街景</span><a href="#" class="close_btn" onclick="javascript:close_table();"></a>
        </div>
        <!--街景查詢-->
        <div id="sketch_btn" style="display: none; position: absolute;"></div>
    </form>
</body>
</html>
