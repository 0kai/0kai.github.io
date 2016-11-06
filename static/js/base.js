/*! mitunes 17-07-2013 */

Do(function() {
    var $ = jQuery;
    var Toggle = Do.require("toggle");
    var Carousel = function(opts) {
        this.opts = opts;
    };
    Carousel.prototype = {
        init: function() {
            var _this = this, content = _this.opts.content, box = _this.opts.box, imgs = content.find("img");
            if (imgs.length === 0) {
                content.html("No Thumb");
                return;
            }
            var tab = new Toggle({
                total: imgs.length - _this.opts.showNum + 1,
                loop: 0
            });
            tab.on("afterToggle", function(e) {
                _this.fx(e);
                _this.preload(e);
                _this.checkBtn(e, imgs);
                imgs.each(function(i, img) {
                    this.onload = function() {
                        _this.checkBtn(e, imgs);
                        _this.fx(e);
                    };
                });
            });
            tab.toggle(0);
            box.on({
                selectstart: function() {
                    return false;
                },
                ondragstart: function() {
                    return false;
                }
            });
            this.opts.prevBtn.on("click", function() {
                tab.prev();
            });
            this.opts.nextBtn.on("click", function() {
                tab.next();
            });
        },
        fx: function(e) {
            var _this = this, content = _this.opts.content, box = _this.opts.box, imgs = content.find("img"), maxMargin = box.find("#J_thumbnail_wrap").width() - box.width(), curWidth = _this.getWidth(e.current, imgs);
            if (maxMargin > 0 && curWidth > maxMargin) {
                e.current = e.total - 1;
                curWidth = maxMargin - 10;
            }
            content.stop(true).animate({
                "margin-left": 0 - curWidth
            }, "fast");
        },
        getWidth: function(currentIndex, imgs) {
            var imgWidth = 0;
            imgs.each(function(i, elem) {
                if (i < currentIndex) {
                    imgWidth += $(elem).outerWidth(true);
                }
            });
            return imgWidth;
        },
        preload: function(e) {
            var imgs = this.opts.content.find("img");
            for (var i = e.current, len = i + this.opts.showNum + 2; i < len; i++) {
                var img = imgs.eq(i);
                img.attr("src") == "about:blank" && img.attr("src", img.attr("data-src"));
            }
        },
        checkBtn: function(e, imgs) {
            var opts = this.opts;
            if (e.current === 0) {
                opts.prevBtn.hide("slow");
            } else {
                opts.prevBtn.show("slow");
            }
            var imgTotal = e.total;
            var boxWidth = this.opts.box.width();
            var lastThreeImgsWidth = 0;
            var flag = 0;
            for (var i = imgTotal - 1; i >= 0; i--) {
                if (flag >= 3) break;
                flag++;
                lastThreeImgsWidth += imgs[i].width;
            }
            if (imgTotal < 2 || e.current >= imgTotal - 3 && lastThreeImgsWidth < boxWidth || e.current >= imgTotal - 1) {
                opts.nextBtn.hide("slow");
            } else {
                opts.nextBtn.show("slow");
            }
        }
    };
    Do.define("Carousel", Carousel);
});

Do.define("Pslide", function(elem, slidHeight) {
    $(elem).each(function() {
        var _this = $(this);
        _this.css({
            height: "auto"
        });
        var conHeight = _this.height(), oriWidth = _this.width();
        _this.css({
            height: slidHeight
        });
        var conWidth = _this.width();
        var slidBtn = $("<a href='javascript:' class='sliddown'><span class='slide-text'>全文查看</span><span class='caret'></span></a>");
        _this.after(slidBtn);
        if (conHeight <= slidHeight) {
            slidBtn.hide();
        }
        slidBtn.on("click", function() {
            if ($(this).hasClass("open")) {
                _this.delay(500).css({
                    height: slidHeight
                });
                $(this).removeClass("open").find(".slide-text").text("全文查看");
            } else {
                _this.css({
                    height: conHeight
                });
                $(this).addClass("open").find(".slide-text").text("收起全文");
            }
        });
    });
});

(function() {
    var Toggle = function(opts) {
        this.opts = opts;
        this.e = {
            total: opts.total
        };
        this.total = opts.total;
    };
    Toggle.prototype = {
        on: function(type, fn) {
            var events = this.events = this.events || {};
            events[type] = events[type] || {};
            events[type][fn] = fn;
        },
        off: function(type, fn) {
            var events = this.events = this.events || {};
            if (fn !== undefined) {
                if (events[type] && events[type][fn]) {
                    delete events[type][fn];
                }
            } else {
                delete events[type];
            }
        },
        fire: function(type, e) {
            var events = this.events = this.events || {};
            if (events[type]) {
                var fns = events[type];
                for (var key in fns) {
                    fns[key] instanceof Function && fns[key](e);
                }
            }
        },
        mix: function(o, data) {
            for (var key in data) {
                o[key] = data[key];
            }
            return o;
        },
        toggle: function(current) {
            var _this = this;
            _this.fire("beforeToggle", this.mix({
                type: "beforeToggle"
            }, this.e));
            _this.e.oldCurrent = this.e.current;
            _this.e.current = current;
            _this.fire("afterToggle", this.mix({
                type: "afterToggle"
            }, this.e));
        },
        next: function() {
            if (!this.opts.loop && this.e.current > this.opts.total) {
                return;
            }
            if (this.e.current < this.opts.total - 1) {
                this.toggle(this.e.current + 1);
            } else {
                this.toggle(0);
            }
        },
        prev: function() {
            if (!this.opts.loop && this.e.current === 0) {
                return;
            }
            if (this.e.current > 0) {
                this.toggle(this.e.current - 1);
            } else {
                this.toggle(this.opts.total - 1);
            }
        },
        add: function(n) {
            this.opts.total += n - 0;
        },
        getTotal: function() {
            return this.opts.total;
        },
        getCurrent: function() {
            return this.e.current;
        },
        setCurrent: function(current) {
            this.e.current = current;
        }
    };
    Do.define("Toggle", Toggle);
})();