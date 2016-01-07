/**
 * Created by zhangyuanyuan150923 on 2016/1/7.
 */
define(["modules/CommonModule","services/lisiService"], function (module) {
    module.controller("home.uplaodController",["$scope","hello", function ($scope,hello) {
        $scope.name=hello;
    }]);
});