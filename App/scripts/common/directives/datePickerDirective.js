/**
 * Created by zhangyuanyuan150923 on 2015/11/27.
 */
define(["common/modules"], function (modules) {
    //封装日历控件
    modules.directive("datePicker", function () {
        return {
            restrict: "A",
            replace: false,
            scope: {
                dateMonths: '@',
                dateToNode: '=',
                dateFromNode: '='
            },
            link: function (scope, ele, attr, con) {
                ele.attr("readonly","readonly");
                var dateMonths = scope.dateMonths;
                if (!dateMonths) {
                    dateMonths = 1;
                } else {
                    dateMonths = parseInt(dateMonths);
                }
                //设置公共的参数
                var dateCommon = {
                    showOtherMonths: true,
                    selectOtherMonths: true,
                    changeYear: true,
                    changeMonth: true,
                    prevText: "上月",
                    nextText: "下月",
                    showAnim: "slideDown",
                    showButtonPanel: false,
                    showOptions: {direction: "up"},
                    numberOfMonths: dateMonths
                };

                if (scope.dateToNode && scope.dateFromNode) {
                    throw new Error("date-to-node和date-from-node不能同时设置");
                } else if (scope.dateToNode) {
                    dateCommon.onClose = function (selectDate) {
                        scope.dateToNode.datepicker("option", "minDate", selectDate);
                    };
                    ele.datepicker(dateCommon);
                } else if (scope.dateFromNode) {
                    dateCommon.onClose = function (selectDate) {
                        scope.dateFromNode.datepicker("option", "maxDate", selectDate);
                    };
                    ele.datepicker(dateCommon);
                } else { //两个属性都没设置
                    ele.datepicker(dateCommon);
                }
            }
        }
    });
});

;
(function ($) {
    // 旋转任意角度
    jQuery.fn.rotate = function (angle, whence) {
        var p = this.get(0);
        if (!whence) {
            p.angle = ((p.angle == undefined ? 0 : p.angle) + angle) % 360;
        } else {
            p.angle = angle;
        }
        if (p.angle >= 0) {
            var rotation = Math.PI * p.angle / 180;
        } else {
            var rotation = Math.PI * (360 + p.angle) / 180;
        }
        var costheta = Math.round(Math.cos(rotation) * 1000) / 1000;
        var sintheta = Math.round(Math.sin(rotation) * 1000) / 1000;
        if (document.all && !window.opera) {
            var canvas = document.createElement('img');
            canvas.src = p.src;
            canvas.height = p.height;
            canvas.width = p.width;
            canvas.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + costheta + ",M12=" + (-sintheta) + ",M21=" + sintheta + ",M22=" + costheta + ",SizingMethod='auto expand')";
        } else {
            var canvas = document.createElement('canvas');
            if (!p.oImage) {
                canvas.oImage = new Image();
                canvas.oImage.src = p.src;
            } else {
                canvas.oImage = p.oImage;
            }
            canvas.style.width = canvas.width = Math.abs(costheta * canvas.oImage.width) + Math.abs(sintheta * canvas.oImage.height);
            canvas.style.height = canvas.height = Math.abs(costheta * canvas.oImage.height) + Math.abs(sintheta * canvas.oImage.width);
            var context = canvas.getContext('2d');
            context.save();
            if (rotation <= Math.PI / 2) {
                context.translate(sintheta * canvas.oImage.height, 0);
            } else if (rotation <= Math.PI) {
                context.translate(canvas.width, -costheta * canvas.oImage.height);
            } else if (rotation <= 1.5 * Math.PI) {
                context.translate(-costheta * canvas.oImage.width, canvas.height);
            } else {
                context.translate(0, -sintheta * canvas.oImage.width);
            }
            context.rotate(rotation);
            context.drawImage(canvas.oImage, 0, 0, canvas.oImage.width, canvas.oImage.height);
            context.restore();
        }
        canvas.id = p.id;
        canvas.angle = p.angle;
        p.parentNode.replaceChild(canvas, p);
    };
    //顺时针旋转90度
    jQuery.fn.rotateRight = function (angle) {
        this.rotate(angle == undefined ? 90 : angle);
    };
    //逆时间旋转90度
    jQuery.fn.rotateLeft = function (angle) {
        this.rotate(angle == undefined ? -90 : -angle);
    };

    //操作图片组件
    jQuery.fn.extend({
        operateImgs: function (opts) {
            $.operateimg.init(this, opts);
        }
    });

    function OperateImages() {
        this.node = null;
        this.icount=0;
        this.options = {
            imgUrl: [],
            scrollSpped: 20,
            firstShow:"",
            height:650,
            width:550
        };
    }

    $.extend(OperateImages.prototype, {
        //初始化参数
        init: function (node, options) {
            this.node = node;
            this.options= $.extend(this.options,options);
            this.operator();
            this.imgInit();
        },

        //具的操作方法
        operator: function () {
            this.insertHtml();
            this.mousewheel();
            this.drag();
            this.subClick();

        },

        //各个组件点击事件
        subClick: function () {
            var self=this;
            this.node.on("click","div.function button.big", function (ev) {
                self.imgBig();
                self.drag();
                if(self.isMiddle()){
                    self.imgMiddle();
                }
            });

            this.node.on("click","div.function button.smail", function (ev) {
                self.imgSmaill();
                self.drag();
                if(self.isMiddle()){
                    self.imgMiddle();
                }
            });

            this.node.on("click","div.function button.reset", function (ev) {
                self.imgReset();
                self.drag();
                if(self.isMiddle()){
                    self.imgMiddle();
                }
            });
            //顺时针旋转
            this.node.on("click","div.function button.clockwiseRotate", function (ev) {
                var canH=self.getOpeImg().height();
                self.getOpeImg().rotateRight();
                self.getOpeImg().width(canH);
                self.drag();
                self.imgMiddle();

            });
            //逆时针旋转
            this.node.on("click","div.function button.anticlockwiseRotate", function (ev) {
                var canH=self.getOpeImg().height();
                self.getOpeImg().rotateLeft();
                self.getOpeImg().width(canH);
                self.drag();
                self.imgMiddle();

            });
            //下一张图片
            this.node.on("click","div.function button.nextpage", function (ev) {
                self.icount++;
                self.getOpeImg().fadeOut("normal",function(){
                    if(self.icount > self.options.imgUrl.length-1){
                        self.icount=0;
                    }
                    self.getOpeImg().remove();
                    self.imgReset();
                    self.getOpeImg().hide().fadeIn("normal");
                    self.drag();
                    if(self.isMiddle()){
                        self.imgMiddle();
                    }
                });

            });
            //上一第图片
            this.node.on("click","div.function button.prvpage", function (ev) {
                self.icount--;
                self.getOpeImg().fadeOut("normal",function(){
                    if(self.icount < 0){
                        self.icount=self.options.imgUrl.length-1;
                    }
                    self.getOpeImg().remove();
                    self.imgReset();
                    self.getOpeImg().hide().fadeIn("normal");
                    self.drag();
                    if(self.isMiddle()){
                        self.imgMiddle();
                    }
                });


            });
        },

        //给操作图片加拖拽事件
        drag: function () {
            var $img = this.getOpeImg();
            $img.css({position: "absolute", cursor: "pointer"});
            $img.mousedown(
                function (event) {
                    event.preventDefault();
                    var nodeoffset = $img.offset(),
                        parentoffset = $img.offsetParent().offset(),
                        clientX = event.clientX, clicentY = event.clientY,
                        isMove = true,
                        disX = clientX - nodeoffset.left,
                        disY = clicentY - nodeoffset.top;
                    $(document.documentElement).mousemove(function (event) {
                            if (isMove) {
                                var x = event.clientX, y = event.clientY;
                                $img.css({
                                    'left': x - disX - parentoffset.left,
                                    'top': y - disY - parentoffset.top
                                });
                            }
                            return false;
                        }
                    ).mouseup(
                        function () {
                            isMove = false;
                        }
                    );
                }
            );
        },


        //给图片加滚轮事件
        mousewheel: function () {
            var explorer = navigator.userAgent,
                self = this,
                mousewheel = explorer.indexOf("Firefox") >= 0 ? "DOMMouseScroll" : "mousewheel";
            if (document.documentElement.addEventListener) {
                this.getOpeLi().get(0).addEventListener(mousewheel, scrollFn, false)
            } else {
                this.getOpeLi().get(0).attachEvent("onmousewheel", scrollFn);
            }

            //滚轮函数
            function scrollFn(ev) {
                var ev = ev || event,
                    flag = false;//向上滚动为true，下为fasle
                if (ev.detail) {
                    if (ev.detail < 0) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                } else {
                    if (ev.wheelDelta > 0) {
                        flag = true;
                    } else {
                        flag = false;
                    }
                }
                if (flag) {//向上滚动
                  self.imgBig();
                } else {//向下滚动
                   self.imgSmaill();
                }
                if (self.isMiddle()) {
                    self.imgMiddle();
                }
            }
        },

        //检测是否居中
        isMiddle: function () {
            var $img = this.getOpeImg(),
                imgHeight = $img.height(),
                imgWidth = $img.width(),
                liHeight = this.getOpeLi().height(),
                liWidth = this.getOpeLi().width();
            return (imgHeight < liHeight || imgWidth < liWidth);
        },

        //图片放大
        imgBig: function () {
            var $img = this.getOpeImg(),
                imgHeight = $img.height(),
                imgWidth = $img.width(),
                pit = imgWidth / imgHeight;
            imgHeight += this.options.scrollSpped;
            $img.height(imgHeight).width(imgHeight * pit);
        },

        //图片缩小
        imgSmaill: function () {
            var $img = this.getOpeImg(),
                imgHeight = $img.height(),
                imgWidth = $img.width(),
                pit = imgWidth / imgHeight;
            imgHeight -= this.options.scrollSpped;
            if (imgHeight < 0) {
                $.error("图片高度不能小于0");
            }
            $img.height(imgHeight).width(imgHeight * pit);
        },

        //初始化图片大小和位置
        imgInit: function () {
            var img= this.getOpeImg();
            var self=this;
            img.on("load", function () {
                self.imgMiddle();
            });
        },

        //图片还原
        imgReset: function () {
            this.getOpeLi().empty().append('<img src="' + this.options.imgUrl[this.icount] + '"/>');
            this.imgInit();
        },

        //让操作图片居中
        imgMiddle: function () {
            var imgLeft = (this.getOpeLi().width() - this.getOpeImg().width()) / 2,
                imgTop = (this.getOpeLi().height() - this.getOpeImg().height()) / 2;
            this.getOpeImg().css({left: imgLeft, top: imgTop});
        },

        //插入html
        insertHtml: function () {
            var imgUrl=this.options.firstShow;
            if (!this.options.imgUrl && !this.options.firstShow) {
                $.error("请指定图片路径");
            }
            if(!this.options.firstShow){
                imgUrl=this.options.imgUrl[0];
                this.icount=0;
            }else{
                this.icount=this.options.imgUrl.indexOf(this.options.firstShow);
            }
            var needHtml =
                '<div>\
                    <ul class="showpicul" style="list-style: none; margin: 0; padding: 0;">\
                        <li style=" margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; white-space: nowrap; position: relative;"><img src="' + imgUrl + '"/></li>\
                    </ul>\
                    <div class="function">\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="big">放大</button>\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="smail">缩小</button>\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="reset">重置</button>\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="clockwiseRotate">顺时针</button>\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="anticlockwiseRotate">逆时针</button>\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="nextpage">下一张</button>\
                        <button style="cursor: pointer; height: 35px; width: 65px; background-color: black; opacity: 0.3; color: white;border: none;border-radius: 15%;font-size: 14px;" class="prvpage">上一张</button>\
                    </div>\
                </div>';
            this.node.empty().append(needHtml);
            this.node.find("ul.showpicul").height(this.options.height).width(this.options.width).end().find("div.function").width(this.options.width).css({height:"70px","text-align":"center","line-height":"70px"});
            this.node.find("div.function button").on("mouseover", function (ev) {
               $(this).css({"background-color":"#8E8F91",opacity:1,"font-weight":"bold"});
            }).on("mouseout", function (ev) {
                $(this).css({"background-color":"black",opacity:0.3,"font-weight":"300"});
            });
        },

        //获得要操作的Img父级容器
        getOpeLi: function () {
            return this.node.find("ul li:eq(0)");
        },

        //获得要操作的图上对象
        getOpeImg: function () {
            return $(this.getOpeLi().get(0).firstElementChild);
        }
    });

    $.operateimg = new OperateImages();

})(jQuery);




