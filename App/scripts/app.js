/**
 * Created by zhyuanyuan on 2015/10/27.
 */

require.config({
    baseUrl: "./scripts",
    paths: {
        "jquery": "../framworks/jquery",
        "angular": "../framworks/angular_1_4/angular",
        "angular-ui-router": "../framworks/angular-ui-router",
        //"angular-resource": "../framworks/angular1_3/angular-resource",
        "domReady": "../framworks/domReady",
        "jquery-ui": "../framworks/jquery_ui/jquery-ui",
        "bootstrap": "../framworks/bootstrap_3/js/bootstrap.min",
        "jquery-validate": "../framworks/jquery.validate",
        "mock": "../framworks/mock-min",
        "mock-module": "../framworks/mockModule",
        "ztree": "../framworks/ztree/jquery.ztree.all-3.5.min",
        "jqGrid-cn": "../framworks/jqGrid/i18n/grid.locale-cn",
        "grid.base": "../framworks/jqGrid/grid.base",
        "jqGrid": "../framworks/jqGrid/jquery.jqGrid",
        "angular-animate": "../framworks/angular_1_4/angular-animate.min",
        "angular-messages": "../framworks/angular1_3/angular-messages.min",
        "dialog": "../framworks/common-dialog",
        "uuid":"../framworks/uuid",
        "es5-shim":"../framworks/es5-shim.min",
        "angular-file-upload":"../framworks/angular-file-upload"
    },
    waitSeconds: 15,
    map: {
        "*": {
            css: "../framworks/css"
        }
    },
    shim: {
        "angular": {
            deps: ["jquery"],
            exports: "angular"
        },
        "angular-ui-router": {
            deps: ["angular"]
        },
        "jquery-ui": {
            deps: ["jquery", "css!../framworks/jquery_ui/jquery-ui.css"]
        },
        "bootstrap": {
            deps: ["jquery", "css!../framworks/bootstrap_3/css/bootstrap.min.css"]
        },
        "jquery-validate": ["jquery"],
        "mock-module": ["mock"],
        "ztree": {
            deps: ["jquery", "css!../framworks/ztree/zTreeStyle.css"]
        },
        "jqGrid": {
            deps: ["jquery", "jquery-ui", "jqGrid-cn", "css!../framworks/jqGrid/ui.jqgrid.css"]
        },
        "angular-animate": ["jquery", "angular"],
        "angular-messages": ["jquery", "angular"],
        "dialog": ["jquery", "jquery-ui",  "css!../framworks/jquery_ui/jquery-ui.css"],
        "angular-file-upload":["jquery","angular","es5-shim"]
    }
});
require(["angular", "domReady","angular-ui-router", "angular-animate", "dialog","bootstrap",
        "configframe/modules/indexModule","configframe/controllers/indexController",
        "configframe/modules/homeModule","configframe/controllers/homeController"],
    function (angular, domReady) {
    angular.module("Main", ["ui.router","ngAnimate","indexModule","homeModule"]).config(["$stateProvider", "$urlRouterProvider",
        function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/login");
        $stateProvider.state("login", {
            url: "/login",
            templateUrl: "scripts/configframe/views/login.html",
            controller:"indexController"
        }).state("home", {
            url: "/home",
            templateUrl: "scripts/configframe/views/home.html",
            controller:"homeController"
        }).state("404", {
            url: "/404",
            templateUrl: "scripts/configframe/views/404.html"
        });
    }]).run(["$rootScope", function ($rootScope) {
        $rootScope.$on("$stateChangeStart", function (event, toself, toParams, fromself, fromParams) {});
    }]);

    //模块加载完成后
    domReady(function () {
        angular.bootstrap(document, ["Main"]);
    });
});

