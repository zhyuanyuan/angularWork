/**
 * Created by zhangyuanyuan150923 on 2015/11/20.
 * 解决mock.js不兼容angularjs
 */
define(["angular1_3/angular"], function (angular) {
    Mock.ajax = function(module) {
        var Item, error;
        Item = (function() {
            function Item() {}
            Item.prototype.add = function(url) {
                var k, reg, v, _ref;
                _ref = Mock._mocked;
                for (k in _ref) {
                    v = _ref[k];
                    reg = null;
                    if (/^\/.*\/$/.test(k)) {
                        reg = eval(k);
                    } else {
                        reg = new RegExp(k);
                    }
                    if (reg.test(url)) {
                        return Mock.mock(v.template);
                    }
                }
            };
            return Item;
        })();
        try {
            return module.config(function($httpProvider) {
                var item;
                item = new Item();
                return $httpProvider.interceptors.push(function() {
                    return {
                        request: function(config) {
                            var result;
                            result = item.add(config.url);
                            if (result) {
                                config.original = {
                                    url: config.url,
                                    result: result,
                                    method: config.method,
                                    params: config.params,
                                    data: config.data
                                };
                                config.method = "GET";
                                config.url = "?mockUrl=" + config.url;
                            }
                            return config;
                        },
                        response: function(response) {
                            var original;
                            original = response.config.original;
                            if (original) {
                                response.data = original.result;
                            }
                            return response;
                        }
                    };
                });
            });
        } catch (_error) {
            error = _error;
            return console.error('生成mock.angular失败，例：var app = angular.module("app", []); Mock.mockjax(app);');
        }
    };
    var mockModule= angular.module("my.mock",[]);
    Mock.ajax(mockModule);
    return mockModule;
});