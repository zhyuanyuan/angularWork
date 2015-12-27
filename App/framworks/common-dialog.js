/**
 * Created by zhangyuanyuan150923 on 2015/12/11.
 */

define(["jquery", "jquery-ui", "css!../framworks/jquery_ui/jquery-ui.css"], function ($) {
    window.Dialog = {};
    /**
     * 参数据支持 字符串和json
     * @param options
     */
    Dialog.alert = function (options) {
        //接口配制
        var opts = {
            closeOnEscape: true,
            resizable: false,
            height: 175,
            width: 350,
            modal: true,
            title: "弹出框",
            draggable: false,
            callback:function(){},
            content: ""
        };

        //若第一个参数是字符串，即为内容
        if (options && $.type(options) === 'string') {
            opts.content = options;
        }
        //若两个前两个都是字符串话第一个当做内容，第二个是标题
        if (arguments[0] && $.type(arguments[0]) === 'string' && arguments[1] && $.type(arguments[1]) === 'string') {
            opts.content = arguments[0];
            opts.title = arguments[1];
        }

        if(arguments[0] && $.type(arguments[0]) === 'string' && arguments[1] && $.isFunction(arguments[1])){
            opts.callback=arguments[1];
        }

        $.isFunction(arguments[2]) ?  opts.callback=arguments[2] : "";

        //若参数是个对象类型
        if (options && $.type(options) === 'object') {
            opts = $.extend(opts, options);
        }

        opts.open = function (event, ui) {
            $(this).css({
                "color": "#FE6814",
                "text-align": "center",
                "line-height": $(this).height() + "px",
                "border": "none"
            });
            $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        };
        opts.buttons = {
            "确定": function () {
                $(this).dialog("close");
                $(this).remove().closest("div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all").remove();
                opts.callback();
            }
        };
        //生成弹出框
        $("<div>" + opts.content + "</div>").appendTo($("body")).dialog(opts);
    };


    //确认框
    /**
     * 支持字符串和json
     * @param options
     */
    Dialog.confirm = function (options) {
        //接口配制
        var opts = {
            closeOnEscape: true,
            resizable: false,
            height: 175,
            width: 350,
            modal: true,
            title: "删除框",
            draggable: false,
            content: "您确定要删除吗?",
            callback: function () {
            }
        };

        //若第一个参数是字符串，即为内容
        if (options && $.type(options) === 'string') {
            opts.content = options;
        }
        //若两个前两个都是字符串话第一个当做内容，第二个是标题
        if (arguments[0] && $.type(arguments[0]) === 'string' && arguments[1] && $.type(arguments[1]) === 'string') {
            opts.content = arguments[0];
            opts.title = arguments[1];
        }

        arguments[0] && $.isFunction(arguments[0]) ? opts.callback = arguments[0] : "";
        arguments[1] && $.isFunction(arguments[1]) ? opts.callback = arguments[1] : "";
        arguments[2] && $.isFunction(arguments[2]) ? opts.callback = arguments[2] : "";


        //若参数是个对象类型
        if (options && $.type(options) === 'object') {
            opts = $.extend(opts, options);
        }

        opts.open = function (event, ui) {
            $(this).css({"color": "#FE6814", "text-align": "center", "line-height": $(this).height() + "px"});
            $(".ui-dialog-titlebar-close", $(this).parent()).hide();
        };

        opts.buttons = {
            "确定": function () {
                $(this).dialog("close");
                $(this).remove().closest("div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all").remove();
                $.isFunction(opts.callback) ? opts.callback() : "";
            },
            "取消": function () {
                $(this).dialog("close");
                $(this).remove().closest("div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all").remove();
            }
        };
        //生成弹出框
        $("<div><span class='ui-icon ui-icon-alert' style='margin:0 auto;display: inline-block;vertical-align: middle'></span>" + opts.content + "</div>").appendTo($("body")).dialog(opts);
    };
});




