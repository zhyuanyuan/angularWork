/**
 * Created by zhangyuanyuan150923 on 2015/12/25.
 */
define(["configframe/modules/indexModule", "common/services/ajaxService"], function (indexModule) {
    indexModule.controller("indexController", ["$scope", "$state", "ajaxService", function ($scope, $state, ajaxService) {
        $(document).on("keyup", function (ev) {
            if (ev.keyCode === 13) {
                login();
            }
        });
        $scope.submit = function () {
            login();
        };
        //登陆方法
        function login() {
            var loginData = {
                username: $scope.username,
                userpwd: $scope.userpwd
            };
            ajaxService.post("../interface/login.json").then(function (data) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var item = data[i];
                    if (angular.equals(loginData, item)) {
                        $state.go("home");
                        break;
                    }
                }
                if (i == data.length) {
                    Dialog.alert("没有此用户");
                }
            });
        }

    }]);
});