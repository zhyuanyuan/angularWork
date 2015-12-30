/**
 * Created by zhangyuanyuan150923 on 2015/12/28.
 */
define(["configframe/modules/homeModule"], function (module) {
    module.directive("minMenuBar",["$http", function ($http) {
        return {
            restrict:"A",
            scope:{},
            link: function (scope, ele, attr, control) {
                var lis=$(ele).find("li:gt(0)").not("ul.contant li");
                lis.hover(function(ev){
                   //ev.target;
                    var $this=$(this);
                    var clientH=$(window).height(),
                        top=$this.offset().top,
                        botH=clientH-(top-$(document).scrollTop()),
                        setHeight=botH-5;//去掉页面滚动条
                    var allLisH= $this.find("ul.contant li").length * 45;
                    var minH= allLisH < setHeight ?  allLisH :setHeight;
                    $this.find("ul.contant").height(minH).stop().slideDown(500);
                }, function (ev) {
                    $(this).find("ul.contant").stop().slideUp(500);
                });
            }
        }
    }]);
});