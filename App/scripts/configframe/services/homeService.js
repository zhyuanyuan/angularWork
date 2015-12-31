/**
 * Created by zhangyuanyuan150923 on 2015/12/30.
 */
define(["configframe/modules/homeModule","common/services"], function (homeModule) {
    homeModule.factory("homeService",["ajaxService", function (ajaxService) {
        function getMenuData(){
            return ajaxService.get("../interface/menu.json");
        }
        return {
            getMenuData:getMenuData
        }
    }]);
});