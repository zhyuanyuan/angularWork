/**
 * Created by zhangyuanyuan150923 on 2015/12/28.
 */
define(["configframe/modules/homeModule", "configframe/directives/minMenuBarDirective", "configframe/directives/menuBarDirective",
        "configframe/services/homeService"],
    function (module) {
        //home页总Controller
        module.controller("homeController", ["$scope", "homeService", function ($scope, homeService) {

        }]);

//    工具栏toolbarController
        module.controller("toolbarController", ["$scope","$compile" ,"homeService", function ($scope,$compile, homeService) {
            homeService.getMenuData().then(function (data) {
                $scope.data=data;
                $compile($("aside.boolbar").append("<menu-bar data='data'></menu-bar>").find("menu-bar"))($scope);
            }, function () {
                $.error("菜单请求失败");
            });
        }]);

        //min toolBar's controller
        module.controller("minToolBarController",["$scope","$compile" ,"homeService", function ($scope, $compile,homeService) {
            homeService.getMenuData().then(function (data) {
                $scope.data=data;
                $compile($("aside.minboolbar").append("<min-menu-bar data='data'></min-menu-bar>").find("min-menu-bar"))($scope);
            }, function () {
                $.error("菜单请求失败");
            });
        }])

    });