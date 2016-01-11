/**
 * Created by zhangyuanyuan150923 on 2016/1/10.
 */
define(["common/modules","bootstrap","angular-file-upload"],function(module){
    module.directive("uploadFile",["$timeout", function ($timeout) {
        return {
            restrict:"E",
            replace:true,
            templateUrl:"scripts/common/views/uploadView.html",
            scope:{},
            controller:["$scope","FileUploader", function ($scope,FileUploader) {
             var uploader= $scope.uploader = new FileUploader({
                    url: 'https://www.baidu.com'
                });
                uploader.filters.push({
                    name: 'customFilter',
                    fn: function(item /*{File|FileLikeObject}*/, options) {
                        console.log(item);
                        return this.queue.length < 10;
                    }
                });
            }],
            link: function (scope, ele, attr) {
                //console.log(ele);
            }
        }
    }]);
});