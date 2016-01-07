/**
 * Created by zhangyuanyuan150923 on 2015/12/28.
 */
define(["configframe/modules/homeModule", "configframe/directives/minMenuBarDirective", "configframe/directives/menuBarDirective",
        "configframe/services/homeService"],
    function (module) {
        //home页总Controller
        module.controller("homeController", ["$scope", function ($scope) {
            $scope.toolbarIsShow=angular.equals(localStorage.getItem("menuchange"),"true");
            $scope.isShowUserMsg=angular.equals(localStorage.getItem("userMessage"),"true");
            $scope.isBigest=angular.equals(localStorage.getItem("isBigest"),"true");
            //切换菜单
            $scope.changeMenu= function () {
                if(angular.equals(localStorage.getItem("menuchange"),"true")){
                    localStorage.setItem("menuchange","false");
                }else{
                    localStorage.setItem("menuchange","true");
                }
                $scope.toolbarIsShow=angular.equals(localStorage.getItem("menuchange"),"true");
            };

            //是否显示用户信息
            $scope.isShowUser= function () {
                if(angular.equals(localStorage.getItem("userMessage"),"true")){
                    localStorage.setItem("userMessage","false");
                    $scope.isShowUserMsg=false;
                }else{
                    localStorage.setItem("userMessage","true");
                    $scope.isShowUserMsg=true;
                }
            };

            //全屏显示事件
            $scope.bigest= function () {
                if($scope.isBigest){
                    exitFullscreen();
                    localStorage.setItem("isBigest","false");
                }else{
                    launchFullscreen(document.documentElement);
                    localStorage.setItem("isBigest","true");
                }
                $scope.isBigest=angular.equals(localStorage.getItem("isBigest"),"true");
            };

            //全屏显示
            function launchFullscreen(element) {
                if(element.requestFullscreen) {
                    element.requestFullscreen();
                } else if(element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if(element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                } else if(element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }

            //退出全屏显示
            function exitFullscreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
                else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                }
                else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                }
                else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }]);

//    工具栏toolbarController
        module.controller("toolbarController", ["$scope","$compile" ,"homeService", function ($scope,$compile, homeService) {
            homeService.getMenuData().then(function (data) {
                $scope.data=data;
                $compile($("aside.boolbar").append("<menu-bar data='data' msg='isShowUserMsg'></menu-bar>").find("menu-bar"))($scope);
            }, function () {
                $.error("菜单请求失败");
            });
        }]);

        //min toolBar's controller
        module.controller("minToolBarController",["$scope","$compile" ,"homeService", function ($scope, $compile,homeService) {
            homeService.getMenuData().then(function (data) {
                $scope.data=data;
                $compile($("aside.minboolbar").append("<min-menu-bar data='data' msg='isShowUserMsg'></min-menu-bar>").find("min-menu-bar"))($scope);
            }, function () {
                $.error("菜单请求失败");
            });
        }])

    });