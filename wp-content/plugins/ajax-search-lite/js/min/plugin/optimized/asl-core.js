(function() {
    window.WPD = "undefined" !== typeof window.WPD ? window.WPD : {};
    window.WPD.ajaxsearchlite = new function() {
        this.prevState = null;
        this.firstIteration = !0;
        this.helpers = {};
        this.plugin = {};
        this.addons = {
            addons: [],
            add: function(d) {
                -1 == this.addons.indexOf(d) && (d = this.addons.push(d), this.addons[d - 1].init())
            },
            remove: function(d) {
                this.addons.filter(function(c) {
                    return c.name == d ? ("undefined" != typeof c.destroy && c.destroy(), !1) : !0
                })
            }
        }
    }
})();
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        setFilterStateInput: function(a) {
            let b = this;
            "undefined" == typeof a && (a = 65);
            let e = function() {
                JSON.stringify(b.originalFormData) != JSON.stringify(c.formData(d("form", b.n.searchsettings))) ? b.n.searchsettings.find("input[name=filters_initial]").val(0) : b.n.searchsettings.find("input[name=filters_initial]").val(1)
            };
            0 == a ? e() : setTimeout(function() {
                e()
            }, a)
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        liveLoad: function(a, b, e, f) {
            function h(k) {
                k = c.Hooks.applyFilters("asl/live_load/raw_data", k, g);
                var n = new DOMParser;
                let q = n.parseFromString(k, "text/html"),
                    p = d(q);
                g.o.statistics && g.stat_addKeyword(g.o.id, g.n.text.val());
                if ("" != k && 0 < p.length && 0 < p.find(a).length) {
                    k = k.replace(/&asl_force_reset_pagination=1/gmi, "");
                    k = k.replace(/%26asl_force_reset_pagination%3D1/gmi, "");
                    k = k.replace(/&#038;asl_force_reset_pagination=1/gmi,
                        "");
                    c.isSafari() && (k = k.replace(/srcset/gmi, "nosrcset"));
                    k = c.Hooks.applyFilters("asl/live_load/html", k, g.o.id, g.o.iid);
                    k = c.wp_hooks_apply_filters("asl/live_load/html", k, g.o.id, g.o.iid);
                    p = d(n.parseFromString(k, "text/html"));
                    n = p.find(a).get(0);
                    n = c.Hooks.applyFilters("asl/live_load/replacement_node", n, g, l.get(0), k);
                    null != n && l.get(0).parentNode.replaceChild(n, l.get(0));
                    l = d(a).first();
                    e && (document.title = q.title, history.pushState({}, null, b));
                    d(a).first().find(".woocommerce-ordering").on("change", "select.orderby",
                        function() {
                            d(this).closest("form").trigger("submit")
                        });
                    if (1 == g.o.singleHighlight) d(a).find("a").on("click", function() {
                        localStorage.removeItem("asl_phrase_highlight");
                        "" != c.unqoutePhrase(g.n.text.val()) && localStorage.setItem("asl_phrase_highlight", JSON.stringify({
                            phrase: c.unqoutePhrase(g.n.text.val())
                        }))
                    });
                    c.Hooks.applyFilters("asl/live_load/finished", b, g, a, l.get(0));
                    ASL.initialize();
                    g.lastSuccesfulSearch = d("form", g.n.searchsettings).serialize() + g.n.text.val().trim();
                    g.lastSearchData = k
                }
                g.n.s.trigger("asl_search_end", [g.o.id, g.o.iid, g.n.text.val(), k], !0, !0);
                let r, t;
                null == (t = (r = g).gaEvent) || t.call(r, "search_end", {
                    results_count: "unknown"
                });
                let u, v;
                null == (v = (u = g).gaPageview) || v.call(u, g.n.text.val());
                g.hideLoader();
                l.css("opacity", 1);
                g.searching = !1;
                "" != g.n.text.val() && g.n.proclose.css({
                    display: "block"
                })
            }
            if ("body" == a || "html" == a) return console.log("Ajax Search Pro: Do not use html or body as the live loader selector."), !1;
            "" == ASL.pageHTML && "undefined" === typeof ASL._ajax_page_html && (ASL._ajax_page_html = !0, d.fn.ajax({
                url: location.href,
                method: "GET",
                success: function(k) {
                    ASL.pageHTML = k
                },
                dataType: "html"
            }));
            e = "undefined" == typeof e ? !0 : e;
            f = "undefined" == typeof f ? !1 : f;
            let m = ".search-content #content #Content div[role=main] main[role=main] div.theme-content div.td-ss-main-content main.l-content #primary".split(" ");
            "#main" != a && m.unshift("#main");
            if (1 > d(a).length && (m.forEach(function(k) {
                    if (0 < d(k).length) return a = k, !1
                }), 1 > d(a).length)) return console.log("Ajax Search Lite: The live search selector does not exist on the page."), !1;
            a = c.Hooks.applyFilters("asl/live_load/selector",
                a, this);
            let l = d(a).first(),
                g = this;
            g.searchAbort();
            l.css("opacity", .4);
            c.Hooks.applyFilters("asl/live_load/start", b, g, a, l.get(0));
            f || 1 != g.n.searchsettings.find("input[name=filters_initial]").val() || "" != g.n.text.val() ? (g.searching = !0, g.post = d.fn.ajax({
                url: b,
                method: "GET",
                success: function(k) {
                    h(k)
                },
                dataType: "html",
                fail: function(k) {
                    l.css("opacity", 1);
                    k.aborted || (l.html("This request has failed. Please check your connection."), g.hideLoader(), g.searching = !1, g.n.proclose.css({
                        display: "block"
                    }))
                }
            })) : window.WPD.intervalUntilExecute(function() {
                    h(ASL.pageHTML)
                },
                function() {
                    return "" != ASL.pageHTML
                })
        },
        getCurrentLiveURL: function() {
            var a = "asl_ls=" + c.nicePhrase(this.n.text.val());
            let b = "&",
                e = window.location.href;
            e = -1 < e.indexOf("asl_ls=") ? e.slice(0, e.indexOf("asl_ls=")) : e;
            e = -1 < e.indexOf("asl_ls&") ? e.slice(0, e.indexOf("asl_ls&")) : e;
            e = -1 < e.indexOf("p_asid=") ? e.slice(0, e.indexOf("p_asid=")) : e;
            e = -1 < e.indexOf("asl_") ? e.slice(0, e.indexOf("asl_")) : e; - 1 === e.indexOf("?") && (b = "?");
            a = e + b + a + "&asl_active=1&asl_force_reset_pagination=1&p_asid=" + this.o.id + "&p_asl_data=1&" + d("form",
                this.n.searchsettings).serialize();
            return a = a.replace("?&", "?")
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        showLoader: function() {
            this.n.proloading.css({
                display: "block"
            })
        },
        hideLoader: function() {
            this.n.proloading.css({
                display: "none"
            });
            this.n.results.css("display", "")
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        fixClonedSelf: function() {
            let c = this.o.iid,
                a = this.o.rid;
            for (; !ASL.instances.set(this) && !(++this.o.iid, 50 < this.o.iid););
            c != this.o.iid && (this.o.rid = this.o.id + "_" + this.o.iid, this.n.search.get(0).id = "ajaxsearchlite" + this.o.rid, this.n.search.removeClass("asl_m_" + a).addClass("asl_m_" + this.o.rid), this.n.searchsettings.get(0).id = this.n.searchsettings.get(0).id.replace("settings" + a, "settings" + this.o.rid), this.n.searchsettings.hasClass("asl_s_" + a) ? this.n.searchsettings.removeClass("asl_s_" +
                a).addClass("asl_s_" + this.o.rid).data("instance", this.o.iid) : this.n.searchsettings.removeClass("asl_sb_" + a).addClass("asl_sb_" + this.o.rid).data("instance", this.o.iid), this.n.resultsDiv.get(0).id = this.n.resultsDiv.get(0).id.replace("prores" + a, "prores" + this.o.rid), this.n.resultsDiv.removeClass("asl_r_" + a).addClass("asl_r_" + this.o.rid).data("instance", this.o.iid), this.n.container.find(".asl_init_data").data("instance", this.o.iid), this.n.container.find(".asl_init_data").get(0).id = this.n.container.find(".asl_init_data").get(0).id.replace("asl_init_id_" +
                a, "asl_init_id_" + this.o.rid), this.n.prosettings.data("opened", 0))
        },
        destroy: function() {
            let c = this;
            Object.keys(c.n).forEach(function(a) {
                c.n[a].off()
            });
            c.n.searchsettings.remove();
            c.n.resultsDiv.remove();
            c.n.trythis.remove();
            c.n.search.remove();
            c.n.container.remove();
            c.documentEventHandlers.forEach(function(a) {
                d(a.node).off(a.event, a.handler)
            })
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        isRedirectToFirstResult: function() {
            return (0 < d(".asl_res_url", this.n.resultsDiv).length || 0 < d(".asl_es_" + this.o.id + " a").length || this.o.resPage.useAjax && 0 < d(this.o.resPage.selector + "a").length) && (1 == this.o.redirectOnClick && "click" == this.ktype && "first_result" == this.o.trigger.click || 1 == this.o.redirectOnEnter && ("input" == this.ktype || "keyup" == this.ktype) && 13 == this.keycode && "first_result" == this.o.trigger.return)
        },
        doRedirectToFirstResult: function() {
            let a, b;
            a = "click" == this.ktype ? this.o.trigger.click_location : this.o.trigger.return_location;
            0 < d(".asl_res_url", this.n.resultsDiv).length ? b = d(d(".asl_res_url", this.n.resultsDiv).get(0)).attr("href") : 0 < d(".asl_es_" + this.o.id + " a").length ? b = d(d(".asl_es_" + this.o.id + " a").get(0)).attr("href") : this.o.resPage.useAjax && 0 < d(this.o.resPage.selector + "a").length && (b = d(d(this.o.resPage.selector + "a").get(0)).attr("href"));
            "" != b && ("same" == a ? location.href = b : c.openInNewTab(b), this.hideLoader(),
                this.hideResults());
            return !1
        },
        doRedirectToResults: function(a) {
            let b;
            b = "click" == a ? this.o.trigger.click_location : this.o.trigger.return_location;
            a = this.getRedirectURL(a);
            if (this.o.overridewpdefault) {
                if (1 == this.o.resPage.useAjax) return this.hideResults(), this.liveLoad(this.o.resPage.selector, a), this.showLoader(), 0 == this.o.blocking && this.hideSettings(), !1;
                "post" == this.o.override_method ? c.submitToUrl(a, "post", {
                        asl_active: 1,
                        p_asl_data: d("form", this.n.searchsettings).serialize()
                    }, b) : "same" == b ? location.href =
                    a : c.openInNewTab(a)
            } else c.submitToUrl(a, "post", {
                np_asl_data: d("form", this.n.searchsettings).serialize()
            }, b);
            this.n.proloading.css("display", "none");
            this.hideLoader();
            this.hideResults();
            this.searchAbort()
        },
        getRedirectURL: function(a) {
            a = "click" == ("undefined" !== typeof a ? a : "enter") ? this.o.trigger.click : this.o.trigger.return;
            "results_page" == a || "ajax_search" == a ? a = "?s=" + c.nicePhrase(this.n.text.val()) : "woo_results_page" == a ? a = "?post_type=product&s=" + c.nicePhrase(this.n.text.val()) : (a = this.o.trigger.redirect_url,
                a = a.replace(/{phrase}/g, c.nicePhrase(this.n.text.val())));
            1 < this.o.homeurl.indexOf("?") && 0 === a.indexOf("?") && (a = a.replace("?", "&"));
            if (this.o.overridewpdefault && "post" != this.o.override_method) {
                let b = "&"; - 1 === this.o.homeurl.indexOf("?") && -1 === a.indexOf("?") && (b = "?");
                a = a + b + "asl_active=1&p_asl_data=1&" + d("form", this.n.searchsettings).serialize();
                a = this.o.homeurl + a
            } else a = this.o.homeurl + a;
            a = a.replace("https://", "https:///");
            a = a.replace("http://", "http:///");
            a = a.replace(/\/\//g, "/");
            a = c.Hooks.applyFilters("asl/redirect/url",
                a, this.o.id, this.o.iid);
            return a = c.wp_hooks_apply_filters("asl/redirect/url", a, this.o.id, this.o.iid)
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        showResults: function() {
            let a = this;
            a.createVerticalScroll();
            a.showVerticalResults();
            a.hideLoader();
            a.n.proclose.css({
                display: "block"
            });
            null != a.n.showmore && (0 < a.n.items.length ? a.n.showmore.css({
                display: "block"
            }) : a.n.showmore.css({
                display: "none"
            }));
            "undefined" != typeof WPD.lazy && setTimeout(function() {
                WPD.lazy(".asl_lazy")
            }, 100);
            a.is_scroll && "undefined" !== typeof a.scroll.recalculate && setTimeout(function() {
                    a.scroll.recalculate()
                },
                500);
            a.resultsOpened = !0
        },
        hideResults: function(a) {
            let b = this;
            a = "undefined" == typeof a ? !0 : a;
            if (!b.resultsOpened) return !1;
            b.n.resultsDiv.removeClass(b.resAnim.showClass).addClass(b.resAnim.hideClass);
            setTimeout(function() {
                b.n.resultsDiv.css(b.resAnim.hideCSS)
            }, b.resAnim.duration);
            b.n.proclose.css({
                display: "none"
            });
            c.isMobile() && a && document.activeElement.blur();
            b.resultsOpened = !1;
            b.n.s.trigger("asl_results_hide", [b.o.id, b.o.iid], !0, !0)
        },
        showResultsBox: function() {
            this.n.s.trigger("asl_results_show", [this.o.id,
                this.o.iid
            ], !0, !0);
            this.n.resultsDiv.css({
                display: "block",
                height: "auto"
            });
            this.n.resultsDiv.css(this.resAnim.showCSS);
            this.n.resultsDiv.removeClass(this.resAnim.hideClass).addClass(this.resAnim.showClass);
            this.fixResultsPosition(!0)
        },
        scrollToResults: function() {
            var a = Math.floor(.1 * window.innerHeight);
            if (this.resultsOpened && 1 == this.o.scrollToResults.enabled && !this.n.resultsDiv.inViewPort(a)) {
                a = "hover" == this.o.resultsposition ? this.n.probox.offset().top - 20 : this.n.resultsDiv.offset().top - 20;
                a += this.o.scrollToResults.offset;
                var b = d("#wpadminbar");
                0 < b.length && (a -= b.height());
                window.scrollTo({
                    top: 0 > a ? 0 : a,
                    behavior: "smooth"
                })
            }
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        createVerticalScroll: function() {
            let c = this.n.results;
            0 < this.o.itemscount && this.is_scroll && "undefined" === typeof this.scroll.recalculate && (this.scroll = new asp_SimpleBar(this.n.results.get(0), {
                direction: d("body").hasClass("rtl") ? "rtl" : "ltr",
                autoHide: !0
            }), c = c.add(this.scroll.getScrollElement()));
            c.on("scroll", function() {
                document.dispatchEvent(new Event("wpd-lazy-trigger"))
            })
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        searchAbort: function() {
            null != this.post && this.post.abort()
        },
        searchWithCheck: function(a) {
            let b = this;
            "undefined" == typeof a && (a = 50);
            b.n.text.val().length < b.o.charcount || (b.searchAbort(), clearTimeout(b.timeouts.searchWithCheck), b.timeouts.searchWithCheck = setTimeout(function() {
                b.search()
            }, a))
        },
        search: function() {
            let a = this;
            if (!(a.n.text.val().length < a.o.charcount)) {
                a.searching = !0;
                a.n.proloading.css({
                    display: "block"
                });
                a.n.proclose.css({
                    display: "none"
                });
                var b = {
                    action: "ajaxsearchlite_search",
                    aslp: a.n.text.val(),
                    asid: a.o.id,
                    options: d("form", a.n.searchsettings).serialize()
                };
                b = c.Hooks.applyFilters("asl/search/data", b);
                b = c.wp_hooks_apply_filters("asl/search/data", b);
                if (JSON.stringify(b) === JSON.stringify(a.lastSearchData)) return a.resultsOpened || a.showResults(), a.hideLoader(), a.isRedirectToFirstResult() && a.doRedirectToFirstResult(), !1;
                var e;
                null == (e = a.gaEvent) || e.call(a, "search_start");
                0 < d(".asl_es_" + a.o.id).length ? a.liveLoad(".asl_es_" +
                    a.o.id, a.getCurrentLiveURL(), !1) : a.o.resPage.useAjax ? a.liveLoad(a.o.resPage.selector, a.getRedirectURL()) : a.post = d.fn.ajax({
                    url: ASL.ajaxurl,
                    method: "POST",
                    data: b,
                    success: function(f) {
                        f = f.replace(/^\s*[\r\n]/gm, "");
                        f = f.match(/!!ASLSTART!!(.*[\s\S]*)!!ASLEND!!/)[1];
                        f = c.Hooks.applyFilters("asl/search/html", f);
                        f = c.wp_hooks_apply_filters("asl/search/html", f);
                        a.n.resdrg.html("");
                        a.n.resdrg.html(f);
                        d(".asl_keyword", a.n.resdrg).on("click", function() {
                            a.n.text.val(d(this).html());
                            d("input.orig", a.n.container).val(d(this).html()).trigger("keydown");
                            d("form", a.n.container).trigger("submit", "ajax");
                            a.search()
                        });
                        a.n.items = d(".item", a.n.resultsDiv);
                        let h;
                        null == (h = a.gaEvent) || h.call(a, "search_end", {
                            results_count: a.n.items.length
                        });
                        let m;
                        null == (m = a.gaPageview) || m.call(a, a.n.text.val());
                        if (a.isRedirectToFirstResult()) return a.doRedirectToFirstResult(), !1;
                        a.hideLoader();
                        a.showResults();
                        a.scrollToResults();
                        a.lastSuccesfulSearch = d("form", a.n.searchsettings).serialize() + a.n.text.val().trim();
                        a.lastSearchData = b;
                        0 == a.n.items.length ? null != a.n.showmore && a.n.showmore.css("display",
                            "none") : null != a.n.showmore && (a.n.showmore.css("display", "block"), d("a", a.n.showmore).off(), d("a", a.n.showmore).on("click", function() {
                            var l = a.o.trigger.click_location;
                            l = "results_page" == l ? "?s=" + c.nicePhrase(a.n.text.val()) : "woo_results_page" == l ? "?post_type=product&s=" + c.nicePhrase(a.n.text.val()) : a.o.trigger.redirect_url.replace("{phrase}", c.nicePhrase(a.n.text.val()));
                            a.o.overridewpdefault ? "post" == a.o.override_method ? c.submitToUrl(a.o.homeurl + l, "post", {
                                    asl_active: 1,
                                    p_asl_data: d("form", a.n.searchsettings).serialize()
                                }) :
                                location.href = a.o.homeurl + l + "&asl_active=1&p_asid=" + a.o.id + "&p_asl_data=1&" + d("form", a.n.searchsettings).serialize() : c.submitToUrl(a.o.homeurl + l, "post", {
                                    np_asl_data: d("form", a.n.searchsettings).serialize()
                                })
                        }))
                    },
                    fail: function(f) {
                        f.aborted || (a.n.resdrg.html(""), a.n.resdrg.html('<div class="asl_nores">The request failed. Please check your connection! Status: ' + f.status + "</div>"), a.n.items = d(".item", a.n.resultsDiv), a.hideLoader(), a.showResults(), a.scrollToResults())
                    }
                })
            }
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.helpers, {
        Hooks: window.WPD.Hooks,
        deviceType: function() {
            let c = window.innerWidth;
            return 640 >= c ? "phone" : 1024 >= c ? "tablet" : "desktop"
        },
        detectIOS: function() {
            return "undefined" != typeof window.navigator && "undefined" != typeof window.navigator.userAgent ? null != window.navigator.userAgent.match(/(iPod|iPhone|iPad)/) : !1
        },
        detectIE: function() {
            var c = window.navigator.userAgent;
            let a = c.indexOf("MSIE ");
            c = c.indexOf("Trident/");
            return 0 < a || 0 < c ? !0 : !1
        },
        isMobile: function() {
            try {
                return document.createEvent("TouchEvent"), !0
            } catch (c) {
                return !1
            }
        },
        isTouchDevice: function() {
            return "ontouchstart" in window
        },
        isSafari: function() {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
        },
        whichjQuery: function(c) {
            let a = !1;
            "undefined" != typeof window.$ && ("undefined" === typeof c ? a = window.$ : "undefined" != typeof window.$.fn[c] && (a = window.$));
            !1 === a && "undefined" != typeof window.jQuery && (a = window.jQuery, "undefined" === typeof c ? a = window.jQuery : "undefined" != typeof window.jQuery.fn[c] && (a = window.jQuery));
            return a
        },
        formData: function(c,
            a) {
            let b = this,
                e = c.find("input,textarea,select,button").get();
            if (1 === arguments.length) return a = {}, e.forEach(function(f) {
                f.name && !f.disabled && (f.checked || /select|textarea/i.test(f.nodeName) || /text/i.test(f.type) || d(f).hasClass("hasDatepicker") || d(f).hasClass("asl_slider_hidden")) && (void 0 == a[f.name] && (a[f.name] = []), d(f).hasClass("hasDatepicker") ? a[f.name].push(d(f).parent().find(".asl_datepicker_hidden").val()) : a[f.name].push(d(f).val()))
            }), JSON.stringify(a);
            "object" != typeof a && (a = JSON.parse(a));
            e.forEach(function(f) {
                if (f.name)
                    if (a[f.name]) {
                        let h =
                            a[f.name],
                            m = d(f);
                        "[object Array]" !== Object.prototype.toString.call(h) && (h = [h]);
                        if ("checkbox" == f.type || "radio" == f.type) {
                            let l = m.val(),
                                g = !1;
                            for (let k = 0; k < h.length; k++)
                                if (h[k] == l) {
                                    g = !0;
                                    break
                                }
                            m.prop("checked", g)
                        } else m.val(h[0]), (d(f).hasClass("asl_gochosen") || d(f).hasClass("asl_goselect2")) && WPD.intervalUntilExecute(function(l) {
                            l(f).trigger("change.asl_select2")
                        }, function() {
                            return b.whichjQuery("asl_select2")
                        }, 50, 3), d(f).hasClass("hasDatepicker") && WPD.intervalUntilExecute(function(l) {
                            let g = h[0],
                                k = l(m.get(0)).datepicker("option",
                                    "dateFormat");
                            l(m.get(0)).datepicker("option", "dateFormat", "yy-mm-dd");
                            l(m.get(0)).datepicker("setDate", g);
                            l(m.get(0)).datepicker("option", "dateFormat", k);
                            l(m.get(0)).trigger("selectnochange")
                        }, function() {
                            return b.whichjQuery("datepicker")
                        }, 50, 3)
                    } else "checkbox" != f.type && "radio" != f.type || d(f).prop("checked", !1)
            });
            return c
        },
        submitToUrl: function(c, a, b, e) {
            let f;
            f = d('<form style="display: none;" />');
            f.attr("action", c);
            f.attr("method", a);
            d("body").append(f);
            "undefined" !== typeof b && null !== b && Object.keys(b).forEach(function(h) {
                let m =
                    b[h],
                    l = d('<input type="hidden" />');
                l.attr("name", h);
                l.attr("value", m);
                f.append(l)
            });
            "undefined" != typeof e && "new" == e && f.attr("target", "_blank");
            f.get(0).submit()
        },
        openInNewTab: function(c) {
            Object.assign(document.createElement("a"), {
                target: "_blank",
                href: c
            }).click()
        },
        isScrolledToBottom: function(c, a) {
            return c.scrollHeight - c.scrollTop - d(c).outerHeight() < a
        },
        getWidthFromCSSValue: function(c, a) {
            c += "";
            c = -1 < c.indexOf("px") ? parseInt(c, 10) : -1 < c.indexOf("%") ? "undefined" != typeof a && null != a ? Math.floor(parseInt(c,
                10) / 100 * a) : parseInt(c, 10) : parseInt(c, 10);
            return 100 > c ? 100 : c
        },
        nicePhrase: function(c) {
            return encodeURIComponent(c).replace(/%20/g, "+")
        },
        unqoutePhrase: function(c) {
            return c.replace(/["']/g, "")
        },
        decodeHTMLEntities: function(c) {
            let a = document.createElement("div");
            c && "string" === typeof c && (c = c.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, ""), c = c.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, ""), a.innerHTML = c, c = a.textContent, a.textContent = "");
            return c
        },
        isScrolledToRight: function(c) {
            return c.scrollWidth -
                d(c).outerWidth() === c.scrollLeft
        },
        isScrolledToLeft: function(c) {
            return 0 === c.scrollLeft
        },
        wp_hooks_apply_filters: function() {
            return "undefined" != typeof wp && "undefined" != typeof wp.hooks && "undefined" != typeof wp.hooks.applyFilters ? wp.hooks.applyFilters.apply(null, arguments) : "undefined" != typeof arguments[1] ? arguments[1] : !1
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        detectAndFixFixedPositioning: function() {
            let a = !1,
                b = this.n.search.get(0);
            for (; b;)
                if (b = b.parentElement, null != b && "fixed" == window.getComputedStyle(b).position) {
                    a = !0;
                    break
                }
            a || "fixed" == this.n.search.css("position") ? ("absolute" == this.n.resultsDiv.css("position") && this.n.resultsDiv.css("position", "fixed"), this.o.blocking || this.n.searchsettings.css("position", "fixed")) : ("fixed" == this.n.resultsDiv.css("position") &&
                this.n.resultsDiv.css("position", "absolute"), this.o.blocking || this.n.searchsettings.css("position", "absolute"))
        },
        fixResultsPosition: function(a) {
            a = "undefined" == typeof a ? !1 : a;
            var b = this.n.resultsDiv.css("position");
            if ("fixed" == b || "absolute" == b)
                if (1 == a || "visible" == this.n.resultsDiv.css("visibility"))
                    if (a = this.n.search.offset(), "undefined" != typeof a) {
                        let e = 0;
                        b = "phone" == c.deviceType() ? this.o.results.width_phone : "tablet" == c.deviceType() ? this.o.results.width_tablet : this.o.results.width;
                        "auto" == b && (b = 240 >
                            this.n.search.outerWidth() ? 240 : this.n.search.outerWidth());
                        this.n.resultsDiv.css("width", isNaN(b) ? b : b + "px");
                        "right" == this.o.resultsSnapTo ? e = this.n.resultsDiv.outerWidth() - this.n.search.outerWidth() : "center" == this.o.resultsSnapTo && (e = Math.floor((this.n.resultsDiv.outerWidth() - parseInt(this.n.search.outerWidth())) / 2));
                        this.n.resultsDiv.css({
                            top: a.top + this.n.search.outerHeight(!0) - 0 + "px",
                            left: a.left - e + "px"
                        })
                    }
        },
        fixSettingsPosition: function(a) {
            if ((1 == ("undefined" == typeof a ? !1 : a) || 0 != this.n.prosettings.data("opened")) &&
                1 != this.o.blocking) {
                let e;
                this.n.searchsettings.css("position");
                this.fixSettingsWidth();
                var b = "none" != this.n.prosettings.css("display") ? this.n.prosettings : this.n.promagnifier;
                e = b.offset();
                a = e.top + b.height() - 2 + "px";
                b = ("left" == this.o.settingsimagepos ? e.left : e.left + b.width() - this.n.searchsettings.width()) + "px";
                this.n.searchsettings.css({
                    display: "block",
                    top: a,
                    left: b
                })
            }
        },
        fixSettingsWidth: function() {},
        hideOnInvisibleBox: function() {
            if (1 == this.o.detectVisibility && !this.n.search.hasClass("hiddend") && (this.n.search.is(":hidden") ||
                    !this.n.search.is(":visible"))) {
                let a;
                null == (a = this.hideSettings) || a.call(this);
                this.hideResults()
            }
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        initMagnifierEvents: function() {
            let c = this;
            c.n.promagnifier.on("click", function(a) {
                c.n.search.attr("asl-compact");
                c.keycode = a.keyCode || a.which;
                c.ktype = a.type;
                let b;
                null == (b = c.gaEvent) || b.call(c, "magnifier");
                if (c.n.text.val().length >= c.o.charcount && 1 == c.o.redirectOnClick && "first_result" != c.o.trigger.click) return c.doRedirectToResults("click"), clearTimeout(void 0), !1;
                if ("ajax_search" != c.o.trigger.click && "first_result" != c.o.trigger.click) return !1;
                c.searchAbort();
                clearTimeout(c.timeouts.search);
                c.n.proloading.css("display", "none");
                c.timeouts.search = setTimeout(function() {
                    d("form", c.n.searchsettings).serialize() + c.n.text.val().trim() != c.lastSuccesfulSearch || !c.resultsOpened && !c.usingLiveLoader ? c.search() : c.isRedirectToFirstResult() ? c.doRedirectToFirstResult() : c.n.proclose.css("display", "block")
                }, c.o.trigger.delay)
            })
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        initInputEvents: function() {
            this._initFocusInput();
            this.o.trigger.type && this._initSearchInput();
            this._initEnterEvent();
            this._initFormEvent()
        },
        _initFocusInput: function() {
            let a = this;
            a.n.text.on("click", function(b) {
                b.stopPropagation();
                b.stopImmediatePropagation();
                d(this).trigger("focus");
                let e;
                null == (e = a.gaEvent) || e.call(a, "focus");
                if (d("form", a.n.searchsettings).serialize() + a.n.text.val().trim() == a.lastSuccesfulSearch) return a.resultsOpened ||
                    a.usingLiveLoader || (a._no_animations = !0, a.showResults(), a._no_animations = !1), !1
            });
            a.n.text.on("focus input", function(b) {
                a.searching || ("" != d(this).val() ? a.n.proclose.css("display", "block") : a.n.proclose.css({
                    display: "none"
                }))
            })
        },
        _initSearchInput: function() {
            let a = this,
                b = a.n.text.val();
            a.n.text.on("input", function(e) {
                a.keycode = e.keyCode || e.which;
                a.ktype = e.type;
                if (c.detectIE()) {
                    if (b == a.n.text.val()) return !1;
                    b = a.n.text.val()
                }
                if (a.n.text.val().length < a.o.charcount) {
                    a.n.proloading.css("display", "none");
                    if (0 ==
                        a.o.blocking) {
                        let f;
                        null == (f = a.hideSettings) || f.call(a)
                    }
                    a.hideResults(!1);
                    a.searchAbort();
                    clearTimeout(a.timeouts.search);
                    return !1
                }
                a.searchAbort();
                clearTimeout(a.timeouts.search);
                a.n.proloading.css("display", "none");
                a.timeouts.search = setTimeout(function() {
                    d("form", a.n.searchsettings).serialize() + a.n.text.val().trim() != a.lastSuccesfulSearch || !a.resultsOpened && !a.usingLiveLoader ? a.search() : a.isRedirectToFirstResult() ? a.doRedirectToFirstResult() : a.n.proclose.css("display", "block")
                }, a.o.trigger.delay)
            })
        },
        _initEnterEvent: function() {
            let a = this,
                b, e = !1;
            a.n.text.on("keyup", function(f) {
                a.keycode = f.keyCode || f.which;
                a.ktype = f.type;
                if (13 == a.keycode) {
                    clearTimeout(b);
                    b = setTimeout(function() {
                        e = !1
                    }, 300);
                    if (e) return !1;
                    e = !0
                }
                f = d(this).hasClass("orig");
                if (a.n.text.val().length >= a.o.charcount && f && 13 == a.keycode) {
                    let h;
                    null == (h = a.gaEvent) || h.call(a, "return");
                    1 == a.o.redirectOnEnter ? "first_result" != a.o.trigger.return ? a.doRedirectToResults(a.ktype) : a.search() : "ajax_search" == a.o.trigger.return && (d("form", a.n.searchsettings).serialize() +
                        a.n.text.val().trim() != a.lastSuccesfulSearch || !a.resultsOpened && !a.usingLiveLoader) && a.search();
                    clearTimeout(a.timeouts.search)
                }
            })
        },
        _initFormEvent: function() {
            let a = this;
            d(a.n.text.closest("form").get(0)).on("submit", function(b, e) {
                b.preventDefault();
                c.isMobile() ? a.o.redirectOnEnter ? (b = new Event("keyup"), b.keyCode = b.which = 13, this.n.text.get(0).dispatchEvent(b)) : (a.search(), document.activeElement.blur()) : "undefined" != typeof e && "ajax" == e && a.search()
            })
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite,
        a = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        initOtherEvents: function() {
            let b = this;
            if (a.isMobile() && a.detectIOS()) b.n.text.on("touchstart", function() {
                b.savedScrollTop = window.scrollY;
                b.savedContainerTop = b.n.search.offset().top
            });
            b.n.proclose.on(b.clickTouchend, function(f) {
                f.preventDefault();
                f.stopImmediatePropagation();
                b.n.text.val("");
                b.n.textAutocomplete.val("");
                b.hideResults();
                b.n.text.trigger("focus");
                b.n.proloading.css("display",
                    "none");
                b.hideLoader();
                b.searchAbort();
                0 < d(".asl_es_" + b.o.id).length ? (b.showLoader(), b.liveLoad(".asl_es_" + b.o.id, b.getCurrentLiveURL(), !1)) : b.o.resPage.useAjax && (b.showLoader(), b.liveLoad(b.o.resPage.selector, b.getRedirectURL()));
                b.n.text.get(0).focus()
            });
            if (a.isMobile()) {
                var e = function() {
                    b.orientationChange();
                    setTimeout(function() {
                        b.orientationChange()
                    }, 600)
                };
                b.documentEventHandlers.push({
                    node: window,
                    event: "orientationchange",
                    handler: e
                });
                d(window).on("orientationchange", e)
            } else e = function() {
                    b.resize()
                },
                b.documentEventHandlers.push({
                    node: window,
                    event: "resize",
                    handler: e
                }), d(window).on("resize", e, {
                    passive: !0
                });
            e = function() {
                b.scrolling(!1)
            };
            b.documentEventHandlers.push({
                node: window,
                event: "scroll",
                handler: e
            });
            d(window).on("scroll", e, {
                passive: !0
            });
            if (a.isMobile() && "" != b.o.mobile.menu_selector) d(b.o.mobile.menu_selector).on("touchend", function() {
                let f = this;
                setTimeout(function() {
                    let h = d(f).find("input.orig");
                    h = 0 == h.length ? d(f).next().find("input.orig") : h;
                    h = 0 == h.length ? d(f).parent().find("input.orig") : h;
                    h = 0 == h.length ? b.n.text : h;
                    b.n.search.is(":visible") && h.get(0).focus()
                }, 300)
            });
            a.detectIOS() && a.isMobile() && a.isTouchDevice() && 16 > parseInt(b.n.text.css("font-size")) && (b.n.text.data("fontSize", b.n.text.css("font-size")).css("font-size", "16px"), b.n.textAutocomplete.css("font-size", "16px"), d("body").append("<style>#ajaxsearchlite" + b.o.rid + " input.orig::-webkit-input-placeholder{font-size: 16px !important;}</style>"))
        },
        orientationChange: function() {
            this.detectAndFixFixedPositioning();
            this.fixSettingsPosition();
            this.fixResultsPosition();
            "isotopic" == this.o.resultstype && "visible" == this.n.resultsDiv.css("visibility") && (this.calculateIsotopeRows(), this.showPagination(!0), this.removeAnimation())
        },
        resize: function() {
            this.detectAndFixFixedPositioning();
            this.fixSettingsPosition();
            this.fixResultsPosition();
            "isotopic" == this.o.resultstype && "visible" == this.n.resultsDiv.css("visibility") && (this.calculateIsotopeRows(), this.showPagination(!0), this.removeAnimation())
        },
        scrolling: function(b) {
            this.detectAndFixFixedPositioning();
            this.hideOnInvisibleBox();
            this.fixSettingsPosition(b);
            this.fixResultsPosition(b)
        },
        initTryThisEvents: function() {
            let b = this;
            b.n.trythis.find("a").on("click touchend", function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                document.activeElement.blur();
                b.n.textAutocomplete.val("");
                b.n.text.val(d(this).html());
                let f;
                null == (f = b.gaEvent) || f.call(b, "try_this");
                setTimeout(function() {
                    b.n.text.trigger("input")
                }, 50)
            })
        },
        initPrevState: function() {
            let b = this;
            c.firstIteration && null == c.prevState && (c.prevState =
                localStorage.getItem("asl-" + WPD.Base64.encode(location.href)), null != c.prevState && (c.prevState = JSON.parse(c.prevState), c.prevState.settings = WPD.Base64.decode(c.prevState.settings)));
            if (null != c.prevState && "undefined" != typeof c.prevState.id && (c.prevState.trigger && c.prevState.id == b.o.id && c.prevState.instance == b.o.iid && ("" != c.prevState.phrase && (b.triggerPrevState = !0, b.n.text.val(c.prevState.phrase)), a.formData(d("form", b.n.searchsettings)) != c.prevState.settings && (b.triggerPrevState = !0, b.settingsChanged = !0, a.formData(d("form", b.n.searchsettings), c.prevState.settings)), null !== c.prevState.settingsOriginal && (b.originalFormData = WPD.Base64.decode(c.prevState.settingsOriginal), b.setFilterStateInput(0))), "block" == b.o.resultsposition)) {
                let f = !0;
                b.n.search.on("asl_results_show", function() {
                    f && (f = !1, setTimeout(function() {
                        let h = 0 < d(c.prevState.scrollTo).length ? d(c.prevState.scrollTo).offset().top : b.n.resultsDiv.find(".item").last().offset().top;
                        window.scrollTo({
                            top: h,
                            behavior: "instant"
                        })
                    }, 500))
                })
            }
            localStorage.removeItem("asl-" +
                WPD.Base64.encode(location.href));
            let e = function() {
                var f = b.n.text.val();
                f = {
                    id: b.o.id,
                    trigger: "" != f || b.settingsChanged,
                    instance: b.o.iid,
                    phrase: f,
                    settingsOriginal: "undefined" === typeof b.originalFormData ? null : WPD.Base64.encode(b.originalFormData),
                    settings: WPD.Base64.encode(a.formData(d("form", b.n.searchsettings)))
                };
                localStorage.setItem("asl-" + WPD.Base64.encode(location.href), JSON.stringify(f))
            };
            d(".asl_es_" + b.o.id).on("click", "a", e);
            b.n.resultsDiv.on("click", ".results .item", e);
            b.documentEventHandlers.push({
                node: document.body,
                event: "asl_memorize_state_" + b.o.id,
                handler: e
            });
            d("body").on("asl_memorize_state_" + b.o.id, e)
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        initResultsEvents: function() {
            let c = this;
            c.n.resultsDiv.css({
                opacity: "0"
            });
            let a = function(b) {
                let e = b.keyCode || b.which,
                    f = b.type;
                if (0 == d(b.target).closest(".asl_w").length) {
                    if (0 == c.o.blocking && !c.dragging) {
                        let h;
                        null == (h = c.hideSettings) || h.call(c)
                    }
                    c.hideOnInvisibleBox();
                    "click" == f && "touchend" == f && 3 == e || 0 == c.resultsOpened || 1 != c.o.closeOnDocClick || c.dragging || (c.hideLoader(), c.searchAbort(), c.hideResults())
                }
            };
            c.documentEventHandlers.push({
                node: document,
                event: c.clickTouchend,
                handler: a
            });
            d(document).on(c.clickTouchend, a)
        }
    })
})(WPD.dom);
(function(d) {
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        monitorTouchMove: function() {
            let c = this;
            c.dragging = !1;
            d("body").on("touchmove", function() {
                c.dragging = !0
            }).on("touchstart", function() {
                c.dragging = !1
            })
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        initEtc: function() {
            let a = this,
                b = null;
            a.n.trythis.css({
                visibility: "visible"
            });
            d("div.asl_option", a.n.searchsettings).on(a.mouseupTouchend, function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (a.dragging) return !1;
                d(this).find('input[type="checkbox"]').prop("checked", !d(this).find('input[type="checkbox"]').prop("checked"));
                clearTimeout(b);
                let f = this;
                b = setTimeout(function() {
                        d(f).find('input[type="checkbox"]').trigger("asl_chbx_change")
                    },
                    50)
            });
            d("div.asl_option label", a.n.searchsettings).on("click", function(e) {
                e.preventDefault()
            });
            d("fieldset.asl_checkboxes_filter_box", a.n.searchsettings).forEach(function() {
                let e = !0;
                d(this).find('.asl_option:not(.asl_option_selectall) input[type="checkbox"]').forEach(function() {
                    if (1 == d(this).prop("checked")) return e = !1
                });
                e && d(this).find('.asl_option_selectall input[type="checkbox"]').prop("checked", !1).removeAttr("data-origvalue")
            });
            d("fieldset", a.n.searchsettings).forEach(function() {
                d(this).find(".asl_option:not(.hiddend)").last().addClass("asl-o-last")
            });
            d('.asl_option_cat input[type="checkbox"], .asl_option_cff input[type="checkbox"]', a.n.searchsettings).on("asl_chbx_change", function() {
                let e = d(this).data("targetclass");
                "string" == typeof e && "" != e && d("input." + e, a.n.searchsettings).prop("checked", d(this).prop("checked"))
            });
            a.n.resultsDiv.on("click", ".results .item", function() {
                let e;
                null == (e = a.gaEvent) || e.call(a, "result_click", {
                    result_title: d(this).find("a.asl_res_url").text(),
                    result_url: d(this).find("a.asl_res_url").attr("href")
                });
                1 == a.o.singleHighlight &&
                    (localStorage.removeItem("asl_phrase_highlight"), "" != a.n.text.val().replace(/["']/g, "") && localStorage.setItem("asl_phrase_highlight", JSON.stringify({
                        phrase: a.n.text.val().replace(/["']/g, "")
                    })))
            });
            c.Hooks.addFilter("asl/init/etc", a)
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite,
        a = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        init: function(b, e) {
            this.autopStartedTheSearch = this.isAutoP = this.triggerPrevState = this.searching = !1;
            this.autopData = {};
            this.resultsOpened = this.settingsChanged = !1;
            this.postAuto = this.post = null;
            this.scroll = {};
            this.savedContainerTop = this.savedScrollTop = 0;
            this.is_scroll = "undefined" != typeof asp_SimpleBar;
            this.disableMobileScroll = !1;
            this.clickTouchend = "click touchend";
            this.mouseupTouchend =
                "mouseup touchend";
            this.noUiSliders = [];
            this.timeouts = {
                compactBeforeOpen: null,
                compactAfterOpen: null,
                search: null,
                searchWithCheck: null
            };
            this.eh = {};
            this.documentEventHandlers = [];
            this.settScroll = null;
            this.currentPage = 1;
            this.sIsotope = this.isotopic = null;
            this.lastSuccesfulSearch = "";
            this.lastSearchData = {};
            this._no_animations = !1;
            this.results_num = this.call_num = 0;
            this.o = d.fn.extend({}, b);
            this.n = {};
            this.n.search = d(e);
            this.initNodeVariables();
            a.isMobile() ? this.animOptions = this.o.animations.mob : this.animOptions =
                this.o.animations.pc;
            this.animationOpacity = 0 > this.animOptions.items.indexOf("In") ? "opacityOne" : "opacityZero";
            this.o.redirectOnClick = "ajax_search" != this.o.trigger.click && "nothing" != this.o.trigger.click;
            this.o.redirectOnEnter = "ajax_search" != this.o.trigger.return && "nothing" != this.o.trigger.return;
            if (this.usingLiveLoader = this.o.resPage.useAjax && 0 < d(this.o.resPage.selector).length || 0 < d(".asl_es_" + this.o.id).length) this.o.trigger.type = this.o.resPage.trigger_type, this.o.trigger.facet = this.o.resPage.trigger_facet,
                this.o.resPage.trigger_magnifier && (this.o.redirectOnClick = 0, this.o.trigger.click = "ajax_search"), this.o.resPage.trigger_return && (this.o.redirectOnEnter = 0, this.o.trigger.return = "ajax_search");
            this.o.trigger.redirect_url = a.decodeHTMLEntities(this.o.trigger.redirect_url);
            this.n.textAutocomplete.val("");
            1 == ASL.js_retain_popstate && this.initPrevState();
            this.detectAndFixFixedPositioning();
            this.monitorTouchMove();
            "undefined" !== typeof this.initSettingsAnimations && this.initSettingsAnimations();
            this.initResultsAnimations();
            this.initEvents();
            this.initEtc();
            c.firstIteration = !1;
            "undefined" === typeof this.originalFormData && (this.originalFormData = a.formData(d("form", this.n.searchsettings)));
            this.n.s.trigger("asl_init_search_bar", [this.o.id, this.o.iid], !0, !0);
            return this
        },
        initNodeVariables: function() {
            this.n.s = this.n.search;
            this.n.container = this.n.search.closest(".asl_w_container");
            this.o.id = this.n.search.data("id");
            this.o.iid = this.n.search.data("instance");
            this.o.rid = this.o.id;
            this.o.name = this.n.search.data("name");
            this.n.searchsettings =
                d(".asl_s", this.n.container);
            this.n.resultsDiv = d(".asl_r", this.n.container);
            this.n.probox = d(".probox", this.n.search);
            this.n.proinput = d(".proinput", this.n.search);
            this.n.text = d(".proinput input.orig", this.n.search);
            this.n.textAutocomplete = d(".proinput input.autocomplete", this.n.search);
            this.n.loading = d(".proinput .loading", this.n.search);
            this.n.proloading = d(".proloading", this.n.search);
            this.n.proclose = d(".proclose", this.n.search);
            this.n.promagnifier = d(".promagnifier", this.n.search);
            this.n.prosettings =
                d(".prosettings", this.n.search);
            this.fixClonedSelf();
            this.n.settingsAppend = d("#wpdreams_asl_settings_" + this.o.id);
            this.o.blocking = this.n.searchsettings.hasClass("asl_sb");
            "undefined" !== typeof this.initSettingsBox && this.initSettingsBox();
            this.n.trythis = d("#asl-try-" + this.o.rid);
            this.n.resultsAppend = d("#wpdreams_asl_results_" + this.o.id);
            this.initResultsBox();
            this.n.hiddenContainer = d(".asl_hidden_data", this.n.container);
            this.n.aslItemOverlay = d(".asp_item_overlay", this.n.hiddenContainer);
            this.n.showmore =
                d(".showmore", this.n.resultsDiv);
            this.n.items = 0 < d(".item", this.n.resultsDiv).length ? d(".item", this.n.resultsDiv) : d(".photostack-flip", this.n.resultsDiv);
            this.n.results = d(".results", this.n.resultsDiv);
            this.n.resdrg = d(".resdrg", this.n.resultsDiv)
        },
        initEvents: function() {
            "undefined" !== typeof this.initSettingsEvents && this.initSettingsEvents();
            this.initResultsEvents();
            this.initOtherEvents();
            this.initTryThisEvents();
            this.initMagnifierEvents();
            this.initInputEvents();
            let b;
            null == (b = this.initAutocompleteEvent) ||
                b.call(this);
            let e;
            null == (e = this.initFacetEvents) || e.call(this)
        }
    })
})(WPD.dom);
(function(d) {
    let c = window.WPD.ajaxsearchlite.helpers;
    d.fn.extend(window.WPD.ajaxsearchlite.plugin, {
        initResultsBox: function() {
            c.isMobile() && 1 == this.o.mobile.force_res_hover ? (this.o.resultsposition = "hover", this.n.resultsDiv = this.n.resultsDiv.clone(), d("body").append(this.n.resultsDiv), this.n.resultsDiv.css({
                    position: "absolute"
                }), this.detectAndFixFixedPositioning()) : "hover" == this.o.resultsposition && 0 >= this.n.resultsAppend.length ? (this.n.resultsDiv = this.n.resultsDiv.clone(), d("body").append(this.n.resultsDiv)) :
                (this.o.resultsposition = "block", this.n.resultsDiv.css({
                    position: "static"
                }), 0 < this.n.resultsAppend.length && (0 < this.n.resultsAppend.find(".asl_w").length ? (this.n.resultsDiv = this.n.resultsAppend.find(".asl_w"), this.n.showmore = d(".showmore", this.n.resultsDiv), this.n.items = 0 < d(".item", this.n.resultsDiv).length ? d(".item", this.n.resultsDiv) : d(".photostack-flip", this.n.resultsDiv), this.n.results = d(".results", this.n.resultsDiv), this.n.resdrg = d(".resdrg", this.n.resultsDiv)) : (this.n.resultsDiv = this.n.resultsDiv.clone(),
                    this.n.resultsAppend.append(this.n.resultsDiv))));
            this.n.resultsDiv.get(0).id = this.n.resultsDiv.get(0).id.replace("__original__", "")
        },
        initResultsAnimations: function() {
            this.resAnim = {
                showClass: "asl_an_fadeInDrop",
                showCSS: {
                    visibility: "visible",
                    display: "block",
                    opacity: 1,
                    "animation-duration": "300ms"
                },
                hideClass: "asl_an_fadeOutDrop",
                hideCSS: {
                    visibility: "hidden",
                    opacity: 0,
                    display: "none"
                },
                duration: 300
            };
            this.n.resultsDiv.css({
                "-webkit-animation-duration": "300ms",
                "animation-duration": "300ms"
            })
        }
    })
})(WPD.dom);
window.ASL = "undefined" !== typeof window.ASL ? window.ASL : {};
window.ASL.api = function() {
    let d = function(b, e, f, h) {
            b = ASL.instances.get(b, e);
            return !1 !== b && b[f].apply(b, [h])
        },
        c = function(b, e, f) {
            if (!isNaN(parseFloat(e)) && isFinite(e)) return b = ASL.instances.get(b, e), !1 !== b && b[f].apply(b);
            b = ASL.instances.get(b);
            return !1 !== b && b.forEach(function(h) {
                h[e].apply(h, [f])
            })
        },
        a = function(b, e) {
            if ("exists" == e) return ASL.instances.exist(b);
            b = ASL.instances.get(b);
            return !1 !== b && b.forEach(function(f) {
                f[e].apply(f)
            })
        };
    if (4 == arguments.length) return d.apply(this, arguments);
    if (3 == arguments.length) return c.apply(this,
        arguments);
    if (2 == arguments.length) return a.apply(this, arguments);
    0 == arguments.length && (console.log("Usage: ASL.api(id, [optional]instance, function, [optional]args);"), console.log("For more info: https://knowledgebase.ajaxsearchlite.com/other/javascript-api"))
};