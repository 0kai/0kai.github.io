/* Do version 2.0 pre
 * creator: kejun (listenpro@gmail.com)
 * ���¸��£�2011-7-12
 */

(function (win, doc) {

    window.undefined = window.undefined;

    // �Ѽ���ģ��
    var loaded = {},

    // �Ѽ����б�
        loadList = {},

    // �����е�ģ��
        loadingFiles = {},

    // �ڲ������ļ�
        config = {
            // �Ƿ��Զ����غ��Ŀ�
            autoLoad: true,

            // �����ӳ�
            timeout: 6000,

            // ���Ŀ�
            coreLib: ['/static/js/jquery.min.js'],

            /* ģ������
            * {
            * moduleName: {
            * path: 'URL',
            * type:'js|css',
            * requires:['moduleName1', 'fileURL']
            * }
            * }
            */
            mods: {}
        },

        jsSelf = (function () {
            var files = doc.getElementsByTagName('script');
            return files[files.length - 1];
        })(),

    // ȫ��ģ��
        globalList = [],

    // �ⲿ����
        extConfig,

    // domready�ص���ջ
        readyList = [],

    // DOM Ready
        isReady = false,

    // ģ���Ĺ�������
        publicData = {},

    // �������ݻص���ջ
        publicDataStack = {},

        isArray = function (e) {
            return e.constructor === Array;
        },

        getMod = function (e) {
            var mods = config.mods, mod;
            if (typeof e === 'string') {
                mod = (mods[e]) ? mods[e] : { path: e };
            } else {
                mod = e;
            }
            return mod;
        },

        load = function (url, type, charset, cb) {
            var wait, n, t, img,

                done = function () {
                    loaded[url] = 1;
                    cb && cb(url);
                    cb = null;
                    win.clearTimeout(wait);
                };

            if (!url) {
                return;
            }

            if (loaded[url]) {
                loadingFiles[url] = false;
                if (cb) {
                    cb(url);
                }
                return;
            }

            if (loadingFiles[url]) {
                setTimeout(function () {
                    load(url, type, charset, cb);
                }, 10);
                return;
            }

            loadingFiles[url] = true;

            wait = win.setTimeout(function () {
                /* Ŀǰ��ʱ�ص�������ʱ���������ʱ�ص���ִ�лص���Ȼ�������
                * ��ʱ�ص���������log��ʱ����URI������������ڼ���������Ĺ����Ƶ��ⲿ
                * û��������Ϊ�˱������
                */
                if (config.timeoutCallback) {
                    try {
                        config.timeoutCallback(url);
                    } catch (ex) {
                    }
                }
            }, config.timeout);

            t = type || url.toLowerCase().split(/\./).pop().replace(/[\?#].*/, '');

            if (t === 'js') {
                n = doc.createElement('script');
                n.setAttribute('type', 'text/javascript');
                n.setAttribute('src', url);
                n.setAttribute('async', true);
            } else if (t === 'css') {
                n = doc.createElement('link');
                n.setAttribute('type', 'text/css');
                n.setAttribute('rel', 'stylesheet');
                n.setAttribute('href', url);
            }

            if (charset) {
                n.charset = charset;
            }

            if (t === 'css') {
                img = new Image();
                img.onerror = function () {
                    done();
                    img.onerror = null;
                    img = null;
                }
                img.src = url;
            } else {
                // firefox, safari, chrome, ie9�¼���ʧ�ܴ���
                // ����ļ���404, ���timeout�紥��onerror��Ŀǰ������404��ֻ����ʱ
                n.onerror = function () {
                    done();
                    n.onerror = null;
                };

                // ie6~8ͨ������vbscript����ʶ���Ƿ���سɹ���
                // ���������Ȳ����Լ����ټ���Ӱ�����ܡ���ʹû�ɹ����ض�����cb�����౨��û��Ҫ�ž����ֱ���

                // ie6~9�¼��سɹ���ʧ�ܣ�firefox, safari, opera�¼��سɹ�����
                n.onload = n.onreadystatechange = function () {
                    var url;
                    if (!this.readyState ||
                        this.readyState === 'loaded' ||
                        this.readyState === 'complete') {
                        done();
                        n.onload = n.onreadystatechange = null;
                    }
                };
            }

            jsSelf.parentNode.insertBefore(n, jsSelf);
        },

    // �����������ļ�(˳��)
        loadDeps = function (deps, cb) {
            var mods = config.mods,
                id, m, mod, i = 0, len;

            id = deps.join('');
            len = deps.length;

            if (loadList[id]) {
                cb();
                return;
            }

            function callback() {
                if (! --len) {
                    loadList[id] = 1;
                    cb();
                }
            }

            for (; m = deps[i++]; ) {
                mod = getMod(m);
                if (mod.requires) {
                    loadDeps(mod.requires, (function (mod) {
                        return function () {
                            load(mod.path, mod.type, mod.charset, callback);
                        };
                    })(mod));
                } else {
                    load(mod.path, mod.type, mod.charset, callback);
                }
            }
        },

    /*!
    * contentloaded.js
    *
    * Author: Diego Perini (diego.perini at gmail.com)
    * Summary: cross-browser wrapper for DOMContentLoaded
    * Updated: 20101020
    * License: MIT
    * Version: 1.2
    *
    * URL:
    * http://javascript.nwbox.com/ContentLoaded/
    * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
    *
    */

    // @win window reference
    // @fn function reference
        contentLoaded = function (fn) {
            var done = false, top = true,
                doc = win.document,
                root = doc.documentElement,
                add = doc.addEventListener ? 'addEventListener' : 'attachEvent',
                rem = doc.addEventListener ? 'removeEventListener' : 'detachEvent',
                pre = doc.addEventListener ? '' : 'on',

                init = function (e) {
                    if (e.type == 'readystatechange' && doc.readyState != 'complete') return;
                    (e.type == 'load' ? win : doc)[rem](pre + e.type, init, false);
                    if (!done && (done = true)) fn.call(win, e.type || e);
                },

                poll = function () {
                    try {
                        root.doScroll('left');
                    } catch (e) {
                        setTimeout(poll, 50);
                        return;
                    }
                    init('poll');
                };

            if (doc.readyState == 'complete') fn.call(win, 'lazy');
            else {
                if (doc.createEventObject && root.doScroll) {
                    try {
                        top = !win.frameElement;
                    } catch (e) {
                    }
                    if (top) {
                        poll();
                    }
                }
                doc[add](pre + 'DOMContentLoaded', init, false);
                doc[add](pre + 'readystatechange', init, false);
                win[add](pre + 'load', init, false);
            }
        },

        fireReadyList = function () {
            var i = 0, list;
            if (readyList.length) {
                for (; list = readyList[i++]; ) {
                    d.apply(this, list);
                }
            }
        },

        d = function () {
            var args = [].slice.call(arguments), fn, id;

            // ���غ��Ŀ�
            if (config.autoLoad &&
                !loadList[config.coreLib.join('')]) {
                loadDeps(config.coreLib, function () {
                    d.apply(null, args);
                });
                return;
            }

            // ����ȫ�ֿ�
            if (globalList.length > 0 &&
                !loadList[globalList.join('')]) {
                loadDeps(globalList, function () {
                    d.apply(null, args);
                });
                return;
            }

            if (typeof args[args.length - 1] === 'function') {
                fn = args.pop();
            }

            id = args.join('');

            if ((args.length === 0 || loadList[id]) && fn) {
                setTimeout(function () {
                    fn();
                }, 0)
                return;
            }

            loadDeps(args, function () {
                loadList[id] = 1;
                fn && fn();
            });
        };

    d.add = function (sName, oConfig) {
        if (!sName || !oConfig || !oConfig.path) {
            return;
        }
        config.mods[sName] = oConfig;
    };

    d.delay = function () {
        var args = [].slice.call(arguments), delay = args.shift();
        win.setTimeout(function () {
            d.apply(this, args);
        }, delay);
    };

    d.global = function () {
        var args = isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments);
        globalList = globalList.concat(args);
    };

    d.ready = function () {
        var args = [].slice.call(arguments);
        if (isReady) {
            return d.apply(this, args);
        }
        readyList.push(args);
    };

    d.css = function (s) {
        var css = doc.getElementById('do-inline-css');
        if (!css) {
            css = doc.createElement('style');
            css.type = 'text/css';
            css.id = 'do-inline-css';
            jsSelf.parentNode.insertBefore(css, jsSelf);
        }

        if (css.styleSheet) {
            css.styleSheet.cssText = css.styleSheet.cssText + s;
        } else {
            css.appendChild(doc.createTextNode(s));
        }
    };

    d.setData = d.setPublicData = function (prop, value) {
        var cbStack = publicDataStack[prop];

        publicData[prop] = value;

        if (!cbStack) {
            return;
        }

        while (cbStack.length > 0) {
            (cbStack.pop()).call(this, value);
        }
    };

    d.getData = d.getPublicData = function (prop, cb) {
        if (publicData[prop]) {
            cb(publicData[prop]);
            return;
        }

        if (!publicDataStack[prop]) {
            publicDataStack[prop] = [];
        }

        publicDataStack[prop].push(function (value) {
            cb(value);
        });
    };

    d.setConfig = function (n, v) {
        config[n] = v;
        return d;
    };

    d.getConfig = function (n) {
        return config[n];
    };

    var namespace = {},
        _exsit = [],
        _register = function (arr, index, ns) {
            if (arr.length > index) {
                var i = index + 1,
                            _rn = arr[index];
                if (!ns[_rn] && ns[_rn] == undefined) {
                    ns[_rn] = {};
                }
                _register(arr, i, ns[_rn]);
            }
        };

    d.define = function () {
        var args = arguments,
            num = args.length,
            ns = args[0].toLowerCase(),
            regObject = args[1] || {},
            regFunc,
            _register = function (arr, index, ns) {
                if (arr.length > index) {
                    var i = index + 1,
                            _rn = arr[index];
                    if (!ns[_rn] && ns[_rn] == undefined) {
                        if (index == (arr.length - 1)) {
                            ns[_rn] = regObject;
                        } else {
                            ns[_rn] = {};
                        }
                    }

                    _register(arr, i, ns[_rn]);
                } else {
                    //ns = regObject;
                }
            };

        if (ns && typeof ns == 'string') {
            var nss = ns, ns = ns.split('.'), n0 = ns[0];
            _exsit.push(args[0]);

            if (/\./gi.test(nss)) {
                _register(ns, 0, namespace);
            } else {
                //����ע��һ�������ռ�
                namespace[n0] = regObject;
            }

            if (typeof regObject === 'function' && args[2] == true) {
                var regFunc = new regObject();

                if (ns.length === 2) {
                    try {
                        namespace[n0][ns[1]] = regFunc['export'];
                    } catch (ex) {
                        alert(1)
                    }

                } else {
                    namespace[n0] = regFunc['export'] || {};
                }

            }

        } else {
            return namespace;

        }
    };

    //���Ǹ��Ƚ�������һ��namespace����
    d.namespace = function (ns, root) {
        var root = root || window,
            ns = ns.split('.'), i = 0, l = ns.length, tmp = root;
        _register(ns, 0, root);
    }

    d.getNamespace = function (ns) {
        ns = ns.toLowerCase();
        if (!ns) {
            return namespace;
        } else {
            if (ns.indexOf('.') > -1) {
                var ns = ns.split('.'), l = ns.length; i = 1, _ns = namespace[ns[0]];
                for (; i < l; i++) {
                    _ns = _ns[ns[i]];
                }
                return _ns;
            } else {
                return namespace[ns];
            }
        }
    }

    d.free = function (mod) {
        mod = mod.toLowerCase();
        delete namespace[mod];
    }

    d.require = d.getNamespace;
    d.cache = {

}

    win.Do = d;

    contentLoaded(function () {
        isReady = true;
        fireReadyList();
    });

    // ��ʼ�ⲿ����
    extConfig = jsSelf.getAttribute('data-cfg-autoload');
    if (extConfig) {
        config.autoLoad = (extConfig.toLowerCase() === 'true') ? true : false;
    }

    extConfig = jsSelf.getAttribute('data-cfg-corelib');
    if (extConfig) {
        config.coreLib = extConfig.split(',');
    }

})(window, document);
