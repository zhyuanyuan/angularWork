/**
 * Created  by zhangyuanyuan150923 on 2015/12/28.
 */
define(["configframe/modules/homeModule"], function (module) {
    module.directive("minMenuBar",["$timeout",function ($timeout) {
        return {
            restrict:"E",
            replace:true,
            templateUrl:"scripts/configframe/views/home/minsidebar.html",
            scope:{data:"=",msg:"="},
            controller:["$scope", function ($scope) {
                //鼠标放上显示子菜单
                $scope.showChild= function (id,event) {
                    var $ele=$("#"+id),
                        $lis=$ele.find("li"),
                        allLisH=$lis.length * 45,
                        top=$ele.offset().top,
                        clientH=$(window).height(),
                        botH=clientH-(top-$(document).scrollTop()),
                        setHeight=botH-5;//去掉页面滚动条
                    if(botH >= 270){
                        var minH= allLisH < setHeight ?  allLisH :setHeight;
                        $ele.find("ul.contant").css({top:0,bottom:"auto"}).height(minH).stop().slideDown(500);
                    }else{
                        var children=$ele.find("ul.contant");
                        if(children.length > 0){
                            var needHeight=top+14;
                            var minH= allLisH < needHeight ? allLisH : needHeight;
                            children.css({bottom:0,top:"auto"}).height(minH).stop().slideDown(500);
                        }
                    }
                };

                //鼠标移除事件
                $scope.hideChild= function (id,event) {
                    var $ele=$("#"+id);
                    $ele.find("ul.contant").stop().slideUp(10);
                };

                var pageNum= 1;
            //    上下 按钮做分页
                $scope.up= function () {
                    pageNum -- ;
                    if(pageNum <= 1){
                        pageNum=1;
                        $scope.top.hide();
                    }
                    showpage(pageNum,$scope.n, $scope.lis);
                    $scope.bottom.show();
                };

                $scope.down= function () {
                   var pageTotal= Math.ceil($scope.lis.length / $scope.n);//得到总页数
                    pageNum ++;
                    if(pageNum >pageTotal-1 ){
                        pageNum =pageTotal;
                        $scope.bottom.hide();
                    }
                    showpage(pageNum,$scope.n, $scope.lis);
                    $scope.top.show();
                };

                //分页显示函数
                function showpage(pageNum,pagesize,lis){
                    if(lis.length > 0){
                        lis.hide();
                        for(var i= (pageNum-1) * pagesize,len = pagesize * pageNum ;i<len;i++){
                            lis.eq(i).fadeIn(800);
                        }
                    }
                }

                //点击子项
                $scope.checkedItem= function (id,event) {
                    event.stopPropagation();
                    var $ele=$("#"+id),$parentA=$ele.parent().parent().find("a:first");
                    var checkedA= $ele.parent().parent().parent().find("li:not(:first):not(ul.contant li)").find("a:first");
                    checkedA.removeClass("minClick");
                    $parentA.addClass("minClick");
                    clickItem(id);
                };

                $scope.check=function(id){
                    $("#"+id).find("a:first").addClass("minClick").end().siblings().find("a:first").removeClass("minClick");
                    clickItem(id);
                };

                //every children button click event
                function clickItem(id){
                    var $li=$("#"+id),testArr=[];
                    function getText($li){
                        if($li.length > 0){
                            var $a=$li.find("a:eq(0)"),text= ($a.attr("title") && $.trim($a.attr("title")).length > 0) ? $a.attr("title") : $a.text();
                            testArr.push($.trim(text));
                            getText($li.parents("li")); //递归获取parent li title
                        }else{
                            return;
                        }
                    }
                    getText($li);
                    $scope.ele.parent().siblings("section.section").find("div:eq(0)").text(testArr.reverse().join(" >> "));
                }
            }],
            link: function ($scope, ele, attr) {
                var $ele=$(ele),clientH=$(window).height();
                $ele.parent().height(clientH-58);
                $scope.ele=$ele;
                $timeout(showMenu,0);

                //给窗体设置resize事件
                $(window).resize(resize);
                resize();
                function resize() {
                    var clientH = $(window).height();
                    $(ele).parent().height(clientH - 58);
                    $(ele).parent().siblings("section.section").find("div.topUiView").height(clientH - 135);
                    showMenu();
                }

            //    显示菜单
                function showMenu(){
                    var $top=$ele.find("ul.mintoolbar li.up").show(),
                        $bottom=$ele.find("ul.mintoolbar li.down").show(),
                        $li=$ele.find("ul.mintoolbar li.menuDetail");
                    var distentce=$bottom.offset().top - $top.offset().top-20,n=Math.floor(distentce / 71);
                    for(var i= 0;i<n;i++){
                        $li.eq(i).fadeIn(800);
                    }
                    for(var i=n;i<$li.length;i++){
                        $li.eq(i).hide();
                    }
                    $scope.n=n;
                    $scope.lis=$li;
                    $scope.top=$top;
                    $scope.bottom=$bottom;
                    $top.hide();
                }
            }
        }
    }]);
});