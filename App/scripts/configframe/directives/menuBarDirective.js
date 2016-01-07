/**
 * Created by zhangyuanyuan150923 on 2015/12/30.
 */
define(["configframe/modules/homeModule", "configframe/services/homeService", "jquery"], function (homeModule) {

    //parent menu  menuBar user Attribute
    homeModule.directive("menuBar", function () {
        return {
            restrict: "E",
            scope: {data: "=",msg:"="},
            replace: true,
            templateUrl: "scripts/configframe/views/home/sidebar.html",
            controller:["$scope", function ($scope) {
                $scope.whenmouseover = function (id, ev) {
                    ev.stopPropagation();
                    $("#" + id).append("<span class='triangle'></span>");
                };

                $scope.whenmouseleave = function (id, ev) {
                    ev.stopPropagation();
                    $("#" + id).parents("ul").find("li span.triangle").remove();
                };
            }],
            link: function ($scope, ele, attr) {
                //parent button click event
                $scope.isShow = function (id, ev) {
                    ev.stopPropagation();
                    $("#" + id).find("ul").stop().slideDown(500).end().siblings().find("ul").stop().slideUp(500);
                    clickItem(id);
                };

                //every children button click event
                $scope.checkItem = function (id, ev) {
                    ev.stopPropagation();
                    clickItem(id);
                };

                //every children button click event
                function clickItem(id){
                    var $li=$("#"+id),testArr=[];
                    function getText($li){
                        if($li.length > 0){
                            testArr.push($.trim($li.find("a:eq(0)").text()));
                            getText($li.parents("li"));
                        }else{
                            return;
                        }
                    }
                    getText($li);
                    $(ele).parent().siblings("section.section").find("div:eq(0)").text(testArr.reverse().join(" >> "));
                    $li.parents("ul.navsidebar").find("li").find("a:eq(0)").removeAttr("style");
                    $li.find("a:eq(0)").css({
                        "background": "#393939",
                        "color": "#23B7E5"
                    });
                }

                //给窗体设置resize事件
                $(window).resize(resize);
                resize();
                function resize() {
                    var clientH = $(window).height();
                    $(ele).parent().height(clientH - 62);
                    $(ele).parent().siblings("section.section").find("div.topUiView").height(clientH - 135);
                }
            }
        }
    });

});