window._ASL_load = function() {
    let f = WPD.dom;
    window.ASL.instances = {
        instances: [],
        get: function(b, c) {
            this.clean();
            if ("undefined" === typeof b || 0 == b) return this.instances;
            if ("undefined" === typeof c) {
                c = [];
                for (var a = 0; a < this.instances.length; a++) this.instances[a].o.id == b && c.push(this.instances[a]);
                return 0 < c.length ? c : !1
            }
            for (a = 0; a < this.instances.length; a++)
                if (this.instances[a].o.id == b && this.instances[a].o.iid == c) return this.instances[a];
            return !1
        },
        set: function(b) {
            if (this.exist(b.o.id, b.o.iid)) return !1;
            this.instances.push(b);
            return !0
        },
        exist: function(b, c) {
            this.clean();
            for (let a = 0; a < this.instances.length; a++)
                if (this.instances[a].o.id == b && ("undefined" === typeof c || this.instances[a].o.iid == c)) return !0;
            return !1
        },
        clean: function() {
            let b = [],
                c = this;
            this.instances.forEach(function(a, d) {
                0 == f(".asl_m_" + a.o.rid).length && b.push(d)
            });
            b.forEach(function(a) {
                "undefined" !== typeof c.instances[a] && (c.instances[a].destroy(), c.instances.splice(a, 1))
            })
        },
        destroy: function(b, c) {
            let a = this.get(b, c);
            if (!1 !== a)
                if (Array.isArray(a)) a.forEach(function(d) {
                        d.destroy()
                    }),
                    this.instances = [];
                else {
                    let d = 0;
                    this.instances.forEach(function(e, g) {
                        e.o.id == b && e.o.iid == c && (d = g)
                    });
                    a.destroy();
                    this.instances.splice(d, 1)
                }
        }
    };
    window.ASL.initialized = !1;
    window.ASL.initializeById = function(b, c) {
        let a = ".asl_init_data";
        c = "undefined" == typeof c ? !1 : c;
        "undefined" !== typeof b && "object" != typeof b && (a = "div[id*=asl_init_id_" + b + "]");
        let d = 0;
        f(a).forEach(function(e) {
            let g = f(e).closest(".asl_w_container").find(".asl_m");
            if (0 == g.length || "undefined" != typeof g.get(0).hasAsl) return ++d, !0;
            if (!c && !g.inViewPort(-100)) return !0;
            e = f(e).data("asldata");
            if ("undefined" === typeof e) return !0;
            e = WPD.Base64.decode(e);
            if ("undefined" === typeof e || "" == e) return !0;
            e = JSON.parse(e);
            g.get(0).hasAsl = !0;
            ++d;
            return g.ajaxsearchlite(e)
        });
        f(a).length == d && (document.removeEventListener("scroll", ASL.initializeById), document.removeEventListener("resize", ASL.initializeById))
    };
    window.ASL.initialize = function(b) {
        if ("undefined" == typeof this.version) return !1;
        ASL.script_async_load ? (document.addEventListener("scroll", ASL.initializeById, {
            passive: !0
        }), document.addEventListener("resize",
            ASL.initializeById, {
                passive: !0
            }), ASL.initializeById(b)) : ASL.initializeById(b, !0);
        if (this.highlight.enabled) {
            let c = localStorage.getItem("asl_phrase_highlight");
            localStorage.removeItem("asl_phrase_highlight");
            null != c && (c = JSON.parse(c), this.highlight.data.forEach(function(a) {
                var d = "" != a.selector && 0 < f(a.selector).length ? a.selector : "article";
                d = 0 < f(d).length ? d : "body";
                f(d).highlight(c.phrase, {
                    element: "span",
                    className: "asl_single_highlighted",
                    wordsOnly: a.whole,
                    excludeParents: ".asl_w, .asl-try"
                });
                d = f(".asl_single_highlighted");
                if (a.scroll && 0 < d.length) {
                    d = d.offset().top - 120;
                    let e = f("#wpadminbar");
                    0 < e.length && (d -= e.height());
                    d += a.scroll_offset;
                    d = 0 > d ? 0 : d;
                    f("html").animate({
                        scrollTop: d
                    }, 500)
                }
                return !1
            }))
        }
        this.initialized = !0
    };
    window.ASL.ready = function() {
        let b = this,
            c = f("body"),
            a, d, e;
        ASL.script_async_load && b.initialize();
        f(document).on("DOMContentLoaded", function() {
            b.initialize()
        });
        if ("undefined" != typeof ASL.detect_ajax && 1 == ASL.detect_ajax) {
            let g = new MutationObserver(function() {
                clearTimeout(a);
                a = setTimeout(function() {
                        b.initialize()
                    },
                    500)
            });

            function h() {
                let k = document.querySelector("body");
                k ? g.observe(k, {
                    subtree: !0,
                    childList: !0
                }) : window.setTimeout(h, 500)
            }
            h()
        }
        f(window).on("resize", function() {
            clearTimeout(d);
            d = setTimeout(function() {
                b.initializeById()
            }, 200)
        });
        c.on("click touchend", "#menu-item-search, .fa-search, .fa, .fas, .fusion-flyout-menu-toggle, .fusion-main-menu-search-open, #search_button, .mini-search.popup-search, .icon-search, .menu-item-search-dropdown, .mobile-menu-button, .td-icon-search, .tdb-search-icon, .side_menu_button, .search_button, .raven-search-form-toggle, [data-elementor-open-lightbox], .elementor-button-link, .elementor-button, i[class*=-search], a[class*=-search]",
            function() {
                clearTimeout(e);
                e = setTimeout(function() {
                    b.initializeById({}, !0)
                }, 300)
            });
        if ("undefined" != typeof jQuery) jQuery(document).on("elementor/popup/show", function() {
            setTimeout(function() {
                b.initializeById({}, !0)
            }, 10)
        })
    };
    window.ASL.loadScriptStack = function(b) {
        let c;
        0 < b.length && (c = document.createElement("script"), c.src = b.shift().src, c.onload = function() {
            0 < b.length ? window.ASL.loadScriptStack(b) : window.ASL.ready()
        }, document.body.appendChild(c))
    };
    window.ASL.init = function() {
        ASL.script_async_load ? window.ASL.loadScriptStack(ASL.additional_scripts) :
            "undefined" !== typeof WPD.ajaxsearchlite && window.ASL.ready()
    };
    window.ASL.css_async && "undefined" == typeof window.ASL.css_loaded || window.WPD.intervalUntilExecute(window.ASL.init, function() {
        return "undefined" != typeof window.ASL.version && "undefined" != f.fn.ajaxsearchlite
    })
};
(function() {
    "undefined" != typeof WPD && "undefined" != typeof WPD.dom ? window._ASL_load() : document.addEventListener("wpd-dom-core-loaded", window._ASL_load)
})();