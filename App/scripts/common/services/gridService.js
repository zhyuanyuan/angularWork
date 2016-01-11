/**
 * Created by zhangyuanyuan150923 on 2016/1/10.
 */

/**
 * 封装 一个grid 插件
 */
define(["common/modules"], function (module) {

    module.factory("gridService", ["ajaxService", "$filter", function (ajaxService, $filter) {

        function Grid(param, element) {
            //数据接口
            this.param = $.extend({
                url: "",
                colModel: [],
                rowNum: 10,
                rowList: [10, 20, 30],
                sortname: "id",
                softorder: "asc",
                mtype: "get",
                rownumbers: false,
                multiselect: false,
                sendData:{},
                isPrams:true,//是否要url用& 或者 ? 拼接成字符串,只针对post请求
                formatterJSON: function (data) {
                    return data;
                },
                gridComplete: function () {
                }
            }, param);
            //table表格对象
            this.element = element;
            this.commonColModel = [];
            this.url = this.param.url;
            this.colModel = this.param.colModel;
            this.sortname = this.param.sortname;
            this.softorder = this.param.softorder;
            this.rowNum = this.param.rowNum;
            this.rowList = this.param.rowList;
            this.mtype = this.param.mtype;
            this.multiselect = param.multiselect;
            this.rownumbers = param.rownumbers;
            this.totalCount = null;//记录总页数
            this.firstSendData = {rows: this.rowNum, page: 1, sidx: this.sortname, sord: this.softorder};
            this.gridData = null;
            this.init();
        }

        //对象方法
        $.extend(Grid.prototype, {
            init: function () {
                var self = this;
                angular.forEach(self.colModel, function (item, index) {
                    this.push($.extend({ //列配制参数
                        name: "",
                        align: "left",
                        sortable: false,
                        formatter: function (cellVale, rowObj) {
                            return cellVale
                        }
                    }, item));
                }, this.commonColModel);
                //加排序
                this.element.find("thead tr").last().find("th").each(function (index, item) {
                    var config = self.commonColModel[index];
                    if (config.sortable) {
                        $(this).css({cursor: "pointer"}).append('<span class="glyphicon"></span>');
                        $(this).on("click", function (ev) {
                            $(this).parent().find("span.glyphicon").removeClass("glyphicon-triangle-top").removeClass("glyphicon-triangle-bottom");
                            self.sortname = config.name;
                            arguments.callee["flag" + config.name] = !arguments.callee["flag" + config.name];
                            if (arguments.callee["flag" + config.name]) {
                                self.softorder = "desc";
                                $(this).find("span.glyphicon").addClass("glyphicon-triangle-bottom");
                            } else {
                                self.softorder = "asc";
                                $(this).find("span.glyphicon").addClass("glyphicon-triangle-top");
                            }
                            //实现本地排序
                            var rowsArr = self.gridData.rows;
                            rowsArr = $filter("orderBy")(rowsArr, self.sortname, arguments.callee["flag" + config.name]);
                            self.gridData.rows = rowsArr;
                            self.operateDom(self.gridData);
                        });
                    }
                });

                // 对thead处理 是否要多选 和 是否要显示行号
                if (this.rownumbers && this.multiselect) { //在创建两个th
                    this.element.find("thead tr").last().prepend("<th style='width: 30px;'></th><th style='width: 30px;'></th>");
                } else if (this.rownumbers || this.multiselect) { //创建一个th
                    this.element.find("thead tr").last().prepend("<th style='width: 30px;'></th>");
                }
                //处理tfoot
                var selectOptions = [];
                angular.forEach(this.rowList, function (item) {
                    this.push("<option value='" + item + "'>" + item + "</option>");
                }, selectOptions);

                var tfootHtml = '<tr><td colspan="' + this.element.find("thead tr").last().find("th").length + '">\
                <span class="glyphicon glyphicon-fast-backward hover" style="cursor: pointer; color: #666;"></span>\
                <span class="glyphicon glyphicon-step-backward hover" style="cursor: pointer; color: #666;"></span>\
                <input style="width: 50px; text-align: center;" type="text" value="1" class="page">共<span class="total"></span>页\
                <span class="glyphicon glyphicon-step-forward hover" style="cursor: pointer; color: #666;"></span>\
                <span class="glyphicon glyphicon-fast-forward hover" style="cursor: pointer; color: #666;"></span>\
                <span class="glyphicon glyphicon-refresh" style="float: left;margin-top: 4px;cursor: pointer"></span>\
                <select class="pagesize" style="display: inline-block; width: 50px; height: 26px; vertical-align: middle; padding: 0; border-radius: 0;">' +
                    selectOptions.join("")
                    + '</select>\
                <div style="float: right;margin-top: 4px;">\
                <span class="from"></span>-<span class="to"></span>\
            共<span class="allCount"></span>条\
            </div>\
            </td></tr>';
                this.element.find("tfoot").empty().append(tfootHtml).find("span.hover").hover(function () {
                    $(this).css({color: "#333"});
                }, function () {
                    $(this).css({color: "#666"});
                });

                //第一次加数据
                this.loadData(this.firstSendData);

                //    事件操作
                //跳转到第几页
                this.element.find("tfoot").keydown(function (ev) {
                    if (ev.keyCode === 13) {
                        self.loadData({
                            rows: self.element.find("tfoot select.pagesize").val(),
                            page: self.element.find("tfoot input.page").val(),
                            sidx: self.sortname,
                            sord: self.softorder
                        });
                    }
                });

                //选择一页面显示的页数
                this.element.find("tfoot select.pagesize").on("change", function (ev) {
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: self.element.find("tfoot input.page").val(),
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });

                //刷新数据
                this.element.find("tfoot span.glyphicon-refresh").on("click", function (ev) {
                    self.reload();
                });

                //跳到第一页
                this.element.find("tfoot").on("click", "span.glyphicon-fast-backward", function (ev) {
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: 1,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });
                //跳到上一页
                this.element.find("tfoot").on("click", "span.glyphicon-step-backward", function (ev) {
                    var nowpage = parseInt(self.element.find("tfoot input.page").val());
                    nowpage--;
                    if (nowpage < 1) nowpage = 1;
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: nowpage,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });
                //跳到下一页
                this.element.find("tfoot").on("click", "span.glyphicon-step-forward", function (ev) {
                    var nowpage = parseInt(self.element.find("tfoot input.page").val());
                    nowpage++;
                    if (nowpage > self.totalCount) nowpage = self.totalCount;
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: nowpage,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });

                //跳到最后一页
                this.element.find("tfoot").on("click", "span.glyphicon-fast-forward", function (ev) {
                    self.loadData({
                        rows: self.element.find("tfoot select.pagesize").val(),
                        page: self.totalCount,
                        sidx: self.sortname,
                        sord: self.softorder
                    });
                });

                return this;
            },
            //渲染table 内容
            operateDom: function (data) {
                this.element.find("tbody").empty();
                if (!$.isEmptyObject(data)) {
                    this.totalCount = data.total;
                    if (data.rows && data.rows.length > 0) {
                        var rowData = data.rows;
                        //   过滤表格要填充的数据
                        var html = this.filterData(rowData, this.commonColModel);
                        this.element.find("tbody").append(html);
                        var tfoot = this.element.find("tfoot"), pageSize = this.element.find("select.pagesize").val();
                        tfoot.find("input.page").val(data.page);
                        tfoot.find("span.total").text(data.total);
                        tfoot.find("span.from").text((data.page - 1) * pageSize + 1);
                        tfoot.find("span.to").text((data.page - 1) * pageSize + data.rows.length);
                        tfoot.find("span.allCount").text(data.records);
                        $.isFunction(this.param.gridComplete) ? this.param.gridComplete(this.element, data.rows) : "";
                    }
                }
                return this;
            },
            filterData: function (rowData) {
                var htmlArr = [], self = this;
                angular.forEach(rowData, function (item, i) {
                    var rowHtml = [], str;
                    if (self.rownumbers && self.multiselect) { //创建 行号和多选
                        str = "<td style='text-align: center'>" + (i + 1) + "</td><td><input type='checkbox' id='" + item.id + "' value='" + item.id + "'></td>";
                    } else if (self.rownumbers && !self.multiselect) {//只创建 行号
                        str = "<td style='text-align: center'>" + (i + 1) + "</td>";
                    } else if (!self.rownumbers && self.multiselect) {//中创建 多选
                        str = "<td><input type='checkbox' id='" + item.id + "' value='" + item.id + "'></td>";
                    }
                    angular.forEach(self.commonColModel, function (every, j) {
                        var cellName = every.name, align = every.align, formatter = every.formatter;
                        if ($.isFunction(formatter)) {
                            this.push("<td style='text-align: " + align + "'>" + formatter(item[cellName], item) + "</td>");
                        } else {
                            throw new Error("formatter必须为函数");
                        }
                    }, rowHtml);
                    this.push("<tr>" + str + rowHtml.join("") + "</tr>");
                }, htmlArr);
                return htmlArr.join("");
            },

            //开始加载数据
            loadData: function (sendData) {  //核心方法
                var self = this,paramSendData=this.param.sendData;
                sendData.ng = new Date().getTime();
                if(!$.isEmptyObject(paramSendData)){
                    for(var attr in paramSendData){
                        sendData[attr]=paramSendData[attr];
                    }
                }
                if (this.mtype && angular.equals(this.mtype.toLowerCase(), "post")) {
                    if(this.param.isPrams){
                        ajaxService.post(self.url, {},{params:sendData}).then(function (data) {
                            self.operateData(data);
                        }, function () {
                            throw new Error("表格请求数据失败");
                        });
                    }else{
                        ajaxService.post(self.url, sendData).then(function (data) {
                            self.operateData(data);
                        }, function () {
                            throw new Error("表格请求数据失败");
                        });
                    }

                } else if(this.mtype && angular.equals(this.mtype.toLowerCase(), "get")) {
                    ajaxService.get(self.url, sendData).then(function (data) {
                        self.operateData(data);
                    }, function () {
                        throw new Error("表格请求数据失败");
                    });
                }else {  //做jsonp跨越请求
                    ajaxService.jsonp(self.url, sendData).then(function (data) {
                        self.operateData(data);
                    }, function () {
                        throw new Error("表格请求数据失败");
                    });
                }
            },
            //操作数据
            operateData: function (data) {
                if (!this.checkData(data)) {
                    data = this.param.formatterJSON(data);
                    this.checkAgainData(data);
                }
                this.gridData = data;
                this.operateDom(data);
            },

            //检测数据是否符合json格式的类型
            checkData: function (data) {
                if ($.isEmptyObject(data)) {
                    return false;
                } else {
                    if (data.page && data.total && data.records && data.rows && $.type(data.rows) === 'array' && data.rows.length > 0) {
                        return this.isObject(data.rows);
                    } else {
                        return false;
                    }
                }
            },

            // 探测数据每一项都是json对象
            isObject: function (arr) {
                for (var i = 0, len = arr.length; i < len; i++) {
                    var item = arr[i];
                    if ($.type(item) !== "object") {
                        return false;
                    }
                }
                return true;
            },

            //在次检测数据类型并且给出错误信息
            checkAgainData: function (data) {
                if ($.isEmptyObject(data)) {
                    $.error("返回数据对象不能为空");
                } else {
                    !data.page ? $.error("返回值缺少page属性，该属性用于记录当前页面数据") : "";
                    !data.total ? $.error("返回值缺少total属性，该属性用于记录总页数") : "";
                    !data.records ? $.error("返回值缺少records属性，该属性用于记录总条数据") : "";
                    !data.rows && $.type(data.rows) === 'array' ? $.error("返回值缺少rows属性，该属性用于记录表格数据对象") : "";
                }
            },
            //得到选中的ids
            getSelectIds: function () {
                var $checkbox = this.element.find("tbody input[type=checkbox]"), checkVal = [];
                $checkbox.each(function (i, item) {
                    var $item = $(item);
                    if ($item.is(":checked")) {
                        checkVal.push($item.val());
                    }
                });
                return checkVal;
            },
            //重新加载数据
            reload: function () {
                this.loadData(this.firstSendData);
                return this;
            },
            //加查询条件搜索
            searchGrid: function (searchData) {
                if (!$.isEmptyObject(searchData)) {
                    this.loadData($.extend(this.firstSendData,searchData));
                }
                return this;
            },
            clear: function () {
                this.element.find("tbody").empty();
            }
        });
        return function (param, element) {
            return new Grid(param, element);
        };
    }]);

});