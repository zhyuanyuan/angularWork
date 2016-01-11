/**
 * Created by zhangyuanyuan150923 on 2016/1/10.
 */

/**
 * 封装 常用的ajax
 */

define(["common/modules"], function (module) {
    module.factory("ajaxService", ["$http", "$q", function ($http, $q) {
        /**
         * get方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var get = function (url, param) {
            var defer = $q.defer();
            $http.get(url, {params: param}).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        /**
         * post 方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @param config 配制参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var post = function (url, param, config) {
            var defer = $q.defer();
            $http.post(url, param, config).success(function (data, status, headers, repconfig) {
                defer.resolve(data, status, headers, repconfig);
            }).error(function (data, status, headers, repconfig) {
                defer.reject(data, status, headers, repconfig);
            });
            return defer.promise;
        };
        /**
         * del 方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var del = function (url, param) {
            var defer = $q.defer();
            $http.delete(url, {params: param}).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        /**
         * put 方法封装
         * @param url url地址
         * @param param 发送后端参数
         * @param config  配制参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var put = function (url, param, config) {
            var defer = $q.defer();
            $http.put(url, param, config).success(function (data, status, headers, repconfig) {
                defer.resolve(data, status, headers, repconfig);
            }).error(function (data, status, headers, repconfig) {
                defer.reject(data, status, headers, repconfig);
            });
            return defer.promise;
        };
        /**
         * jsonp 方法封装
         * @param url  url地址
         * @param param 发送后端参数
         * @returns {deferred.promise|{then, catch, finally}|*|promise.promise|Function|jQuery.promise}
         */
        var jsonp = function (url, param) {
            var defer = $q.defer();
            url = url.indexOf("=JSON_CALLBACK") > 0 ? (url) : (url.indexOf("?") > 0 ? (url + "&callback=JSON_CALLBACK") : (url + "?callback=JSON_CALLBACK"));
            $http.jsonp(url, {params: param}).success(function (data, status, headers, config) {
                defer.resolve(data, status, headers, config);
            }).error(function (data, status, headers, config) {
                defer.reject(data, status, headers, config);
            });
            return defer.promise;
        };
        return {
            get: get,
            post: post,
            del: del,
            put: put,
            jsonp: jsonp
        };
    }]);
});