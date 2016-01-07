/**
 * Created by zhangyuanyuan150923 on 2016/1/7.
 */
define(["angular","angular-ui-router" ,"angular-upload","controllers/uploadController"], function (angular) {
    var appModule = angular.module("uploadModule", ["angularFileUpload"]);
    appModule.config(["$stateProvider", function ($stateProvider) {
        $stateProvider.state("home.uploadfile", {
            url: "/uploadfile",
            templateUrl: "views/uploadPage.html",
            controller:"home.uplaodController"
        });
    }]);
    return appModule;
});


