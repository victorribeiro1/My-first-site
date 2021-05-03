(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
    (function (global, factory) {
      typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
      typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = global || self, factory(global.window = global.window || {}));
    }(this, (function (exports) { 'use strict';
    
      function _inheritsLoose(subClass, superClass) {
        subClass.prototype = Object.create(superClass.prototype);
        subClass.prototype.constructor = subClass;
        subClass.__proto__ = superClass;
      }
    
      function _assertThisInitialized(self) {
        if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
        }
    
        return self;
      }
    
      /*!
       * GSAP 3.3.4
       * https://greensock.com
       *
       * @license Copyright 2008-2020, GreenSock. All rights reserved.
       * Subject to the terms at https://greensock.com/standard-license or for
       * Club GreenSock members, the agreement issued with that membership.
       * @author: Jack Doyle, jack@greensock.com
      */
      var _config = {
        autoSleep: 120,
        force3D: "auto",
        nullTargetWarn: 1,
        units: {
          lineHeight: ""
        }
      },
          _defaults = {
        duration: .5,
        overwrite: false,
        delay: 0
      },
          _bigNum = 1e8,
          _tinyNum = 1 / _bigNum,
          _2PI = Math.PI * 2,
          _HALF_PI = _2PI / 4,
          _gsID = 0,
          _sqrt = Math.sqrt,
          _cos = Math.cos,
          _sin = Math.sin,
          _isString = function _isString(value) {
        return typeof value === "string";
      },
          _isFunction = function _isFunction(value) {
        return typeof value === "function";
      },
          _isNumber = function _isNumber(value) {
        return typeof value === "number";
      },
          _isUndefined = function _isUndefined(value) {
        return typeof value === "undefined";
      },
          _isObject = function _isObject(value) {
        return typeof value === "object";
      },
          _isNotFalse = function _isNotFalse(value) {
        return value !== false;
      },
          _windowExists = function _windowExists() {
        return typeof window !== "undefined";
      },
          _isFuncOrString = function _isFuncOrString(value) {
        return _isFunction(value) || _isString(value);
      },
          _isArray = Array.isArray,
          _strictNumExp = /(?:-?\.?\d|\.)+/gi,
          _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g,
          _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
          _complexStringNumExp = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi,
          _parenthesesExp = /\(([^()]+)\)/i,
          _relExp = /[+-]=-?[\.\d]+/,
          _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
          _globalTimeline,
          _win,
          _coreInitted,
          _doc,
          _globals = {},
          _installScope = {},
          _coreReady,
          _install = function _install(scope) {
        return (_installScope = _merge(scope, _globals)) && gsap;
      },
          _missingPlugin = function _missingPlugin(property, value) {
        return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
      },
          _warn = function _warn(message, suppress) {
        return !suppress && console.warn(message);
      },
          _addGlobal = function _addGlobal(name, obj) {
        return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
      },
          _emptyFunc = function _emptyFunc() {
        return 0;
      },
          _reservedProps = {},
          _lazyTweens = [],
          _lazyLookup = {},
          _lastRenderedFrame,
          _plugins = {},
          _effects = {},
          _nextGCFrame = 30,
          _harnessPlugins = [],
          _callbackNames = "",
          _harness = function _harness(targets) {
        var target = targets[0],
            harnessPlugin,
            i;
    
        if (!_isObject(target) && !_isFunction(target)) {
          targets = [targets];
        }
    
        if (!(harnessPlugin = (target._gsap || {}).harness)) {
          i = _harnessPlugins.length;
    
          while (i-- && !_harnessPlugins[i].targetTest(target)) {}
    
          harnessPlugin = _harnessPlugins[i];
        }
    
        i = targets.length;
    
        while (i--) {
          targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
        }
    
        return targets;
      },
          _getCache = function _getCache(target) {
        return target._gsap || _harness(toArray(target))[0]._gsap;
      },
          _getProperty = function _getProperty(target, property) {
        var currentValue = target[property];
        return _isFunction(currentValue) ? target[property]() : _isUndefined(currentValue) && target.getAttribute(property) || currentValue;
      },
          _forEachName = function _forEachName(names, func) {
        return (names = names.split(",")).forEach(func) || names;
      },
          _round = function _round(value) {
        return Math.round(value * 100000) / 100000 || 0;
      },
          _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
        var l = toFind.length,
            i = 0;
    
        for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}
    
        return i < l;
      },
          _parseVars = function _parseVars(params, type, parent) {
        var isLegacy = _isNumber(params[1]),
            varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
            vars = params[varsIndex],
            irVars;
    
        if (isLegacy) {
          vars.duration = params[1];
        }
    
        vars.parent = parent;
    
        if (type) {
          irVars = vars;
    
          while (parent && !("immediateRender" in irVars)) {
            irVars = parent.vars.defaults || {};
            parent = _isNotFalse(parent.vars.inherit) && parent.parent;
          }
    
          vars.immediateRender = _isNotFalse(irVars.immediateRender);
    
          if (type < 2) {
            vars.runBackwards = 1;
          } else {
            vars.startAt = params[varsIndex - 1];
          }
        }
    
        return vars;
      },
          _lazyRender = function _lazyRender() {
        var l = _lazyTweens.length,
            a = _lazyTweens.slice(0),
            i,
            tween;
    
        _lazyLookup = {};
        _lazyTweens.length = 0;
    
        for (i = 0; i < l; i++) {
          tween = a[i];
          tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
        }
      },
          _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
        _lazyTweens.length && _lazyRender();
        animation.render(time, suppressEvents, force);
        _lazyTweens.length && _lazyRender();
      },
          _numericIfPossible = function _numericIfPossible(value) {
        var n = parseFloat(value);
        return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : value;
      },
          _passThrough = function _passThrough(p) {
        return p;
      },
          _setDefaults = function _setDefaults(obj, defaults) {
        for (var p in defaults) {
          p in obj || (obj[p] = defaults[p]);
        }
    
        return obj;
      },
          _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
        for (var p in defaults) {
          if (!(p in obj) && p !== "duration" && p !== "ease") {
            obj[p] = defaults[p];
          }
        }
      },
          _merge = function _merge(base, toMerge) {
        for (var p in toMerge) {
          base[p] = toMerge[p];
        }
    
        return base;
      },
          _mergeDeep = function _mergeDeep(base, toMerge) {
        for (var p in toMerge) {
          base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p];
        }
    
        return base;
      },
          _copyExcluding = function _copyExcluding(obj, excluding) {
        var copy = {},
            p;
    
        for (p in obj) {
          p in excluding || (copy[p] = obj[p]);
        }
    
        return copy;
      },
          _inheritDefaults = function _inheritDefaults(vars) {
        var parent = vars.parent || _globalTimeline,
            func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;
    
        if (_isNotFalse(vars.inherit)) {
          while (parent) {
            func(vars, parent.vars.defaults);
            parent = parent.parent || parent._dp;
          }
        }
    
        return vars;
      },
          _arraysMatch = function _arraysMatch(a1, a2) {
        var i = a1.length,
            match = i === a2.length;
    
        while (match && i-- && a1[i] === a2[i]) {}
    
        return i < 0;
      },
          _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
        if (firstProp === void 0) {
          firstProp = "_first";
        }
    
        if (lastProp === void 0) {
          lastProp = "_last";
        }
    
        var prev = parent[lastProp],
            t;
    
        if (sortBy) {
          t = child[sortBy];
    
          while (prev && prev[sortBy] > t) {
            prev = prev._prev;
          }
        }
    
        if (prev) {
          child._next = prev._next;
          prev._next = child;
        } else {
          child._next = parent[firstProp];
          parent[firstProp] = child;
        }
    
        if (child._next) {
          child._next._prev = child;
        } else {
          parent[lastProp] = child;
        }
    
        child._prev = prev;
        child.parent = child._dp = parent;
        return child;
      },
          _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
        if (firstProp === void 0) {
          firstProp = "_first";
        }
    
        if (lastProp === void 0) {
          lastProp = "_last";
        }
    
        var prev = child._prev,
            next = child._next;
    
        if (prev) {
          prev._next = next;
        } else if (parent[firstProp] === child) {
          parent[firstProp] = next;
        }
    
        if (next) {
          next._prev = prev;
        } else if (parent[lastProp] === child) {
          parent[lastProp] = prev;
        }
    
        child._next = child._prev = child.parent = null;
      },
          _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
        if (child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren)) {
          child.parent.remove(child);
        }
    
        child._act = 0;
      },
          _uncache = function _uncache(animation) {
        var a = animation;
    
        while (a) {
          a._dirty = 1;
          a = a.parent;
        }
    
        return animation;
      },
          _recacheAncestors = function _recacheAncestors(animation) {
        var parent = animation.parent;
    
        while (parent && parent.parent) {
          parent._dirty = 1;
          parent.totalDuration();
          parent = parent.parent;
        }
    
        return animation;
      },
          _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
        return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
      },
          _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
        return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
      },
          _animationCycle = function _animationCycle(tTime, cycleDuration) {
        return (tTime /= cycleDuration) && ~~tTime === tTime ? ~~tTime - 1 : ~~tTime;
      },
          _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
        return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
      },
          _setEnd = function _setEnd(animation) {
        return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
      },
          _postAddChecks = function _postAddChecks(timeline, child) {
        var t;
    
        if (child._time || child._initted && !child._dur) {
          t = _parentToChildTotalTime(timeline.rawTime(), child);
    
          if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
            child.render(t, true);
          }
        }
    
        if (_uncache(timeline)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
          if (timeline._dur < timeline.duration()) {
            t = timeline;
    
            while (t._dp) {
              t.rawTime() >= 0 && t.totalTime(t._tTime);
              t = t._dp;
            }
          }
    
          timeline._zTime = -_tinyNum;
        }
      },
          _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
        child.parent && _removeFromParent(child);
        child._start = _round(position + child._delay);
        child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
    
        _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);
    
        timeline._recent = child;
        skipChecks || _postAddChecks(timeline, child);
        return timeline;
      },
          _scrollTrigger = function _scrollTrigger(animation, trigger) {
        return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger)) && _globals.ScrollTrigger.create(trigger, animation);
      },
          _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
        _initTween(tween, totalTime);
    
        if (!tween._initted) {
          return 1;
        }
    
        if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
          _lazyTweens.push(tween);
    
          tween._lazy = [totalTime, suppressEvents];
          return 1;
        }
      },
          _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
        var prevRatio = tween.ratio,
            ratio = totalTime < 0 || !totalTime && prevRatio && !tween._start && tween._zTime > _tinyNum && !tween._dp._lock || tween._ts < 0 || tween._dp._ts < 0 ? 0 : 1,
            repeatDelay = tween._rDelay,
            tTime = 0,
            pt,
            iteration,
            prevIteration;
    
        if (repeatDelay && tween._repeat) {
          tTime = _clamp(0, tween._tDur, totalTime);
          iteration = _animationCycle(tTime, repeatDelay);
          prevIteration = _animationCycle(tween._tTime, repeatDelay);
    
          if (iteration !== prevIteration) {
            prevRatio = 1 - ratio;
            tween.vars.repeatRefresh && tween._initted && tween.invalidate();
          }
        }
    
        if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
          return;
        }
    
        if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
          prevIteration = tween._zTime;
          tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
          suppressEvents || (suppressEvents = totalTime && !prevIteration);
          tween.ratio = ratio;
          tween._from && (ratio = 1 - ratio);
          tween._time = 0;
          tween._tTime = tTime;
          suppressEvents || _callback(tween, "onStart");
          pt = tween._pt;
    
          while (pt) {
            pt.r(ratio, pt.d);
            pt = pt._next;
          }
    
          tween._startAt && totalTime < 0 && tween._startAt.render(totalTime, true, true);
          tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
          tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
    
          if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
            ratio && _removeFromParent(tween, 1);
    
            if (!suppressEvents) {
              _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
    
              tween._prom && tween._prom();
            }
          }
        } else if (!tween._zTime) {
          tween._zTime = totalTime;
        }
      },
          _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
        var child;
    
        if (time > prevTime) {
          child = animation._first;
    
          while (child && child._start <= time) {
            if (!child._dur && child.data === "isPause" && child._start > prevTime) {
              return child;
            }
    
            child = child._next;
          }
        } else {
          child = animation._last;
    
          while (child && child._start >= time) {
            if (!child._dur && child.data === "isPause" && child._start < prevTime) {
              return child;
            }
    
            child = child._prev;
          }
        }
      },
          _setDuration = function _setDuration(animation, duration, skipUncache) {
        var repeat = animation._repeat,
            dur = _round(duration) || 0;
        animation._dur = dur;
        animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _round(dur * (repeat + 1) + animation._rDelay * repeat);
    
        if (animation._time > dur) {
          animation._time = dur;
          animation._tTime = Math.min(animation._tTime, animation._tDur);
        }
    
        !skipUncache && _uncache(animation.parent);
        animation.parent && _setEnd(animation);
        return animation;
      },
          _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
        return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
      },
          _zeroPosition = {
        _start: 0,
        endTime: _emptyFunc
      },
          _parsePosition = function _parsePosition(animation, position) {
        var labels = animation.labels,
            recent = animation._recent || _zeroPosition,
            clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
            i,
            offset;
    
        if (_isString(position) && (isNaN(position) || position in labels)) {
          i = position.charAt(0);
    
          if (i === "<" || i === ">") {
            return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
          }
    
          i = position.indexOf("=");
    
          if (i < 0) {
            position in labels || (labels[position] = clippedDuration);
            return labels[position];
          }
    
          offset = +(position.charAt(i - 1) + position.substr(i + 1));
          return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
        }
    
        return position == null ? clippedDuration : +position;
      },
          _conditionalReturn = function _conditionalReturn(value, func) {
        return value || value === 0 ? func(value) : func;
      },
          _clamp = function _clamp(min, max, value) {
        return value < min ? min : value > max ? max : value;
      },
          getUnit = function getUnit(value) {
        return (value + "").substr((parseFloat(value) + "").length);
      },
          clamp = function clamp(min, max, value) {
        return _conditionalReturn(value, function (v) {
          return _clamp(min, max, v);
        });
      },
          _slice = [].slice,
          _isArrayLike = function _isArrayLike(value, nonEmpty) {
        return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
      },
          _flatten = function _flatten(ar, leaveStrings, accumulator) {
        if (accumulator === void 0) {
          accumulator = [];
        }
    
        return ar.forEach(function (value) {
          var _accumulator;
    
          return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
        }) || accumulator;
      },
          toArray = function toArray(value, leaveStrings) {
        return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
      },
          shuffle = function shuffle(a) {
        return a.sort(function () {
          return .5 - Math.random();
        });
      },
          distribute = function distribute(v) {
        if (_isFunction(v)) {
          return v;
        }
    
        var vars = _isObject(v) ? v : {
          each: v
        },
            ease = _parseEase(vars.ease),
            from = vars.from || 0,
            base = parseFloat(vars.base) || 0,
            cache = {},
            isDecimal = from > 0 && from < 1,
            ratios = isNaN(from) || isDecimal,
            axis = vars.axis,
            ratioX = from,
            ratioY = from;
    
        if (_isString(from)) {
          ratioX = ratioY = {
            center: .5,
            edges: .5,
            end: 1
          }[from] || 0;
        } else if (!isDecimal && ratios) {
          ratioX = from[0];
          ratioY = from[1];
        }
    
        return function (i, target, a) {
          var l = (a || vars).length,
              distances = cache[l],
              originX,
              originY,
              x,
              y,
              d,
              j,
              max,
              min,
              wrapAt;
    
          if (!distances) {
            wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];
    
            if (!wrapAt) {
              max = -_bigNum;
    
              while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}
    
              wrapAt--;
            }
    
            distances = cache[l] = [];
            originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
            originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
            max = 0;
            min = _bigNum;
    
            for (j = 0; j < l; j++) {
              x = j % wrapAt - originX;
              y = originY - (j / wrapAt | 0);
              distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
              d > max && (max = d);
              d < min && (min = d);
            }
    
            from === "random" && shuffle(distances);
            distances.max = max - min;
            distances.min = min;
            distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
            distances.b = l < 0 ? base - l : base;
            distances.u = getUnit(vars.amount || vars.each) || 0;
            ease = ease && l < 0 ? _invertEase(ease) : ease;
          }
    
          l = (distances[i] - distances.min) / distances.max || 0;
          return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
        };
      },
          _roundModifier = function _roundModifier(v) {
        var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1;
        return function (raw) {
          return Math.floor(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
        };
      },
          snap = function snap(snapTo, value) {
        var isArray = _isArray(snapTo),
            radius,
            is2D;
    
        if (!isArray && _isObject(snapTo)) {
          radius = isArray = snapTo.radius || _bigNum;
    
          if (snapTo.values) {
            snapTo = toArray(snapTo.values);
    
            if (is2D = !_isNumber(snapTo[0])) {
              radius *= radius;
            }
          } else {
            snapTo = _roundModifier(snapTo.increment);
          }
        }
    
        return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
          is2D = snapTo(raw);
          return Math.abs(is2D - raw) <= radius ? is2D : raw;
        } : function (raw) {
          var x = parseFloat(is2D ? raw.x : raw),
              y = parseFloat(is2D ? raw.y : 0),
              min = _bigNum,
              closest = 0,
              i = snapTo.length,
              dx,
              dy;
    
          while (i--) {
            if (is2D) {
              dx = snapTo[i].x - x;
              dy = snapTo[i].y - y;
              dx = dx * dx + dy * dy;
            } else {
              dx = Math.abs(snapTo[i] - x);
            }
    
            if (dx < min) {
              min = dx;
              closest = i;
            }
          }
    
          closest = !radius || min <= radius ? snapTo[closest] : raw;
          return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
        });
      },
          random = function random(min, max, roundingIncrement, returnFunction) {
        return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
          return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
        });
      },
          pipe = function pipe() {
        for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
          functions[_key] = arguments[_key];
        }
    
        return function (value) {
          return functions.reduce(function (v, f) {
            return f(v);
          }, value);
        };
      },
          unitize = function unitize(func, unit) {
        return function (value) {
          return func(parseFloat(value)) + (unit || getUnit(value));
        };
      },
          normalize = function normalize(min, max, value) {
        return mapRange(min, max, 0, 1, value);
      },
          _wrapArray = function _wrapArray(a, wrapper, value) {
        return _conditionalReturn(value, function (index) {
          return a[~~wrapper(index)];
        });
      },
          wrap = function wrap(min, max, value) {
        var range = max - min;
        return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
          return (range + (value - min) % range) % range + min;
        });
      },
          wrapYoyo = function wrapYoyo(min, max, value) {
        var range = max - min,
            total = range * 2;
        return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
          value = (total + (value - min) % total) % total || 0;
          return min + (value > range ? total - value : value);
        });
      },
          _replaceRandom = function _replaceRandom(value) {
        var prev = 0,
            s = "",
            i,
            nums,
            end,
            isArray;
    
        while (~(i = value.indexOf("random(", prev))) {
          end = value.indexOf(")", i);
          isArray = value.charAt(i + 7) === "[";
          nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
          s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], +nums[1], +nums[2] || 1e-5);
          prev = end + 1;
        }
    
        return s + value.substr(prev, value.length - prev);
      },
          mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
        var inRange = inMax - inMin,
            outRange = outMax - outMin;
        return _conditionalReturn(value, function (value) {
          return outMin + ((value - inMin) / inRange * outRange || 0);
        });
      },
          interpolate = function interpolate(start, end, progress, mutate) {
        var func = isNaN(start + end) ? 0 : function (p) {
          return (1 - p) * start + p * end;
        };
    
        if (!func) {
          var isString = _isString(start),
              master = {},
              p,
              i,
              interpolators,
              l,
              il;
    
          progress === true && (mutate = 1) && (progress = null);
    
          if (isString) {
            start = {
              p: start
            };
            end = {
              p: end
            };
          } else if (_isArray(start) && !_isArray(end)) {
            interpolators = [];
            l = start.length;
            il = l - 2;
    
            for (i = 1; i < l; i++) {
              interpolators.push(interpolate(start[i - 1], start[i]));
            }
    
            l--;
    
            func = function func(p) {
              p *= l;
              var i = Math.min(il, ~~p);
              return interpolators[i](p - i);
            };
    
            progress = end;
          } else if (!mutate) {
            start = _merge(_isArray(start) ? [] : {}, start);
          }
    
          if (!interpolators) {
            for (p in end) {
              _addPropTween.call(master, start, p, "get", end[p]);
            }
    
            func = function func(p) {
              return _renderPropTweens(p, master) || (isString ? start.p : start);
            };
          }
        }
    
        return _conditionalReturn(progress, func);
      },
          _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
        var labels = timeline.labels,
            min = _bigNum,
            p,
            distance,
            label;
    
        for (p in labels) {
          distance = labels[p] - fromTime;
    
          if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
            label = p;
            min = distance;
          }
        }
    
        return label;
      },
          _callback = function _callback(animation, type, executeLazyFirst) {
        var v = animation.vars,
            callback = v[type],
            params,
            scope;
    
        if (!callback) {
          return;
        }
    
        params = v[type + "Params"];
        scope = v.callbackScope || animation;
        executeLazyFirst && _lazyTweens.length && _lazyRender();
        return params ? callback.apply(scope, params) : callback.call(scope);
      },
          _interrupt = function _interrupt(animation) {
        _removeFromParent(animation);
    
        if (animation.progress() < 1) {
          _callback(animation, "onInterrupt");
        }
    
        return animation;
      },
          _quickTween,
          _createPlugin = function _createPlugin(config) {
        config = !config.name && config["default"] || config;
    
        var name = config.name,
            isFunc = _isFunction(config),
            Plugin = name && !isFunc && config.init ? function () {
          this._props = [];
        } : config,
            instanceDefaults = {
          init: _emptyFunc,
          render: _renderPropTweens,
          add: _addPropTween,
          kill: _killPropTweensOf,
          modifier: _addPluginModifier,
          rawVars: 0
        },
            statics = {
          targetTest: 0,
          get: 0,
          getSetter: _getSetter,
          aliases: {},
          register: 0
        };
    
        _wake();
    
        if (config !== Plugin) {
          if (_plugins[name]) {
            return;
          }
    
          _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics));
    
          _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics)));
    
          _plugins[Plugin.prop = name] = Plugin;
    
          if (config.targetTest) {
            _harnessPlugins.push(Plugin);
    
            _reservedProps[name] = 1;
          }
    
          name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
        }
    
        _addGlobal(name, Plugin);
    
        if (config.register) {
          config.register(gsap, Plugin, PropTween);
        }
      },
          _255 = 255,
          _colorLookup = {
        aqua: [0, _255, _255],
        lime: [0, _255, 0],
        silver: [192, 192, 192],
        black: [0, 0, 0],
        maroon: [128, 0, 0],
        teal: [0, 128, 128],
        blue: [0, 0, _255],
        navy: [0, 0, 128],
        white: [_255, _255, _255],
        olive: [128, 128, 0],
        yellow: [_255, _255, 0],
        orange: [_255, 165, 0],
        gray: [128, 128, 128],
        purple: [128, 0, 128],
        green: [0, 128, 0],
        red: [_255, 0, 0],
        pink: [_255, 192, 203],
        cyan: [0, _255, _255],
        transparent: [_255, _255, _255, 0]
      },
          _hue = function _hue(h, m1, m2) {
        h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
        return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
      },
          splitColor = function splitColor(v, toHSL, forceAlpha) {
        var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
            r,
            g,
            b,
            h,
            s,
            l,
            max,
            min,
            d,
            wasHSL;
    
        if (!a) {
          if (v.substr(-1) === ",") {
            v = v.substr(0, v.length - 1);
          }
    
          if (_colorLookup[v]) {
            a = _colorLookup[v];
          } else if (v.charAt(0) === "#") {
            if (v.length === 4) {
              r = v.charAt(1);
              g = v.charAt(2);
              b = v.charAt(3);
              v = "#" + r + r + g + g + b + b;
            }
    
            v = parseInt(v.substr(1), 16);
            a = [v >> 16, v >> 8 & _255, v & _255];
          } else if (v.substr(0, 3) === "hsl") {
            a = wasHSL = v.match(_strictNumExp);
    
            if (!toHSL) {
              h = +a[0] % 360 / 360;
              s = +a[1] / 100;
              l = +a[2] / 100;
              g = l <= .5 ? l * (s + 1) : l + s - l * s;
              r = l * 2 - g;
    
              if (a.length > 3) {
                a[3] *= 1;
              }
    
              a[0] = _hue(h + 1 / 3, r, g);
              a[1] = _hue(h, r, g);
              a[2] = _hue(h - 1 / 3, r, g);
            } else if (~v.indexOf("=")) {
              a = v.match(_numExp);
              forceAlpha && a.length < 4 && (a[3] = 1);
              return a;
            }
          } else {
            a = v.match(_strictNumExp) || _colorLookup.transparent;
          }
    
          a = a.map(Number);
        }
    
        if (toHSL && !wasHSL) {
          r = a[0] / _255;
          g = a[1] / _255;
          b = a[2] / _255;
          max = Math.max(r, g, b);
          min = Math.min(r, g, b);
          l = (max + min) / 2;
    
          if (max === min) {
            h = s = 0;
          } else {
            d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
            h *= 60;
          }
    
          a[0] = ~~(h + .5);
          a[1] = ~~(s * 100 + .5);
          a[2] = ~~(l * 100 + .5);
        }
    
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      },
          _colorOrderData = function _colorOrderData(v) {
        var values = [],
            c = [],
            i = -1;
        v.split(_colorExp).forEach(function (v) {
          var a = v.match(_numWithUnitExp) || [];
          values.push.apply(values, a);
          c.push(i += a.length + 1);
        });
        values.c = c;
        return values;
      },
          _formatColors = function _formatColors(s, toHSL, orderMatchData) {
        var result = "",
            colors = (s + result).match(_colorExp),
            type = toHSL ? "hsla(" : "rgba(",
            i = 0,
            c,
            shell,
            d,
            l;
    
        if (!colors) {
          return s;
        }
    
        colors = colors.map(function (color) {
          return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
        });
    
        if (orderMatchData) {
          d = _colorOrderData(s);
          c = orderMatchData.c;
    
          if (c.join(result) !== d.c.join(result)) {
            shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
            l = shell.length - 1;
    
            for (; i < l; i++) {
              result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
            }
          }
        }
    
        if (!shell) {
          shell = s.split(_colorExp);
          l = shell.length - 1;
    
          for (; i < l; i++) {
            result += shell[i] + colors[i];
          }
        }
    
        return result + shell[l];
      },
          _colorExp = function () {
        var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b",
            p;
    
        for (p in _colorLookup) {
          s += "|" + p + "\\b";
        }
    
        return new RegExp(s + ")", "gi");
      }(),
          _hslExp = /hsl[a]?\(/,
          _colorStringFilter = function _colorStringFilter(a) {
        var combined = a.join(" "),
            toHSL;
        _colorExp.lastIndex = 0;
    
        if (_colorExp.test(combined)) {
          toHSL = _hslExp.test(combined);
          a[1] = _formatColors(a[1], toHSL);
          a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
          return true;
        }
      },
          _tickerActive,
          _ticker = function () {
        var _getTime = Date.now,
            _lagThreshold = 500,
            _adjustedLag = 33,
            _startTime = _getTime(),
            _lastUpdate = _startTime,
            _gap = 1 / 240,
            _nextTime = _gap,
            _listeners = [],
            _id,
            _req,
            _raf,
            _self,
            _tick = function _tick(v) {
          var elapsed = _getTime() - _lastUpdate,
              manual = v === true,
              overlap,
              dispatch;
    
          if (elapsed > _lagThreshold) {
            _startTime += elapsed - _adjustedLag;
          }
    
          _lastUpdate += elapsed;
          _self.time = (_lastUpdate - _startTime) / 1000;
          overlap = _self.time - _nextTime;
    
          if (overlap > 0 || manual) {
            _self.frame++;
            _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
            dispatch = 1;
          }
    
          manual || (_id = _req(_tick));
          dispatch && _listeners.forEach(function (l) {
            return l(_self.time, elapsed, _self.frame, v);
          });
        };
    
        _self = {
          time: 0,
          frame: 0,
          tick: function tick() {
            _tick(true);
          },
          wake: function wake() {
            if (_coreReady) {
              if (!_coreInitted && _windowExists()) {
                _win = _coreInitted = window;
                _doc = _win.document || {};
                _globals.gsap = gsap;
                (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);
    
                _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});
    
                _raf = _win.requestAnimationFrame;
              }
    
              _id && _self.sleep();
    
              _req = _raf || function (f) {
                return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0);
              };
    
              _tickerActive = 1;
    
              _tick(2);
            }
          },
          sleep: function sleep() {
            (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
            _tickerActive = 0;
            _req = _emptyFunc;
          },
          lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
            _lagThreshold = threshold || 1 / _tinyNum;
            _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
          },
          fps: function fps(_fps) {
            _gap = 1 / (_fps || 240);
            _nextTime = _self.time + _gap;
          },
          add: function add(callback) {
            _listeners.indexOf(callback) < 0 && _listeners.push(callback);
    
            _wake();
          },
          remove: function remove(callback) {
            var i;
            ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1);
          },
          _listeners: _listeners
        };
        return _self;
      }(),
          _wake = function _wake() {
        return !_tickerActive && _ticker.wake();
      },
          _easeMap = {},
          _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
          _quotesExp = /["']/g,
          _parseObjectInString = function _parseObjectInString(value) {
        var obj = {},
            split = value.substr(1, value.length - 3).split(":"),
            key = split[0],
            i = 1,
            l = split.length,
            index,
            val,
            parsedVal;
    
        for (; i < l; i++) {
          val = split[i];
          index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
          parsedVal = val.substr(0, index);
          obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
          key = val.substr(index + 1).trim();
        }
    
        return obj;
      },
          _configEaseFromString = function _configEaseFromString(name) {
        var split = (name + "").split("("),
            ease = _easeMap[split[0]];
        return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _parenthesesExp.exec(name)[1].split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
      },
          _invertEase = function _invertEase(ease) {
        return function (p) {
          return 1 - ease(1 - p);
        };
      },
          _propagateYoyoEase = function _propagateYoyoEase(timeline, isYoyo) {
        var child = timeline._first,
            ease;
    
        while (child) {
          if (child instanceof Timeline) {
            _propagateYoyoEase(child, isYoyo);
          } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
            if (child.timeline) {
              _propagateYoyoEase(child.timeline, isYoyo);
            } else {
              ease = child._ease;
              child._ease = child._yEase;
              child._yEase = ease;
              child._yoyo = isYoyo;
            }
          }
    
          child = child._next;
        }
      },
          _parseEase = function _parseEase(ease, defaultEase) {
        return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
      },
          _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
        if (easeOut === void 0) {
          easeOut = function easeOut(p) {
            return 1 - easeIn(1 - p);
          };
        }
    
        if (easeInOut === void 0) {
          easeInOut = function easeInOut(p) {
            return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
          };
        }
    
        var ease = {
          easeIn: easeIn,
          easeOut: easeOut,
          easeInOut: easeInOut
        },
            lowercaseName;
    
        _forEachName(names, function (name) {
          _easeMap[name] = _globals[name] = ease;
          _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
    
          for (var p in ease) {
            _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
          }
        });
    
        return ease;
      },
          _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
        return function (p) {
          return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
        };
      },
          _configElastic = function _configElastic(type, amplitude, period) {
        var p1 = amplitude >= 1 ? amplitude : 1,
            p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
            p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
            easeOut = function easeOut(p) {
          return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
        },
            ease = type === "out" ? easeOut : type === "in" ? function (p) {
          return 1 - easeOut(1 - p);
        } : _easeInOutFromOut(easeOut);
    
        p2 = _2PI / p2;
    
        ease.config = function (amplitude, period) {
          return _configElastic(type, amplitude, period);
        };
    
        return ease;
      },
          _configBack = function _configBack(type, overshoot) {
        if (overshoot === void 0) {
          overshoot = 1.70158;
        }
    
        var easeOut = function easeOut(p) {
          return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
        },
            ease = type === "out" ? easeOut : type === "in" ? function (p) {
          return 1 - easeOut(1 - p);
        } : _easeInOutFromOut(easeOut);
    
        ease.config = function (overshoot) {
          return _configBack(type, overshoot);
        };
    
        return ease;
      };
    
      _forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
        var power = i < 5 ? i + 1 : i;
    
        _insertEase(name + ",Power" + (power - 1), i ? function (p) {
          return Math.pow(p, power);
        } : function (p) {
          return p;
        }, function (p) {
          return 1 - Math.pow(1 - p, power);
        }, function (p) {
          return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
        });
      });
    
      _easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
    
      _insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
    
      (function (n, c) {
        var n1 = 1 / c,
            n2 = 2 * n1,
            n3 = 2.5 * n1,
            easeOut = function easeOut(p) {
          return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
        };
    
        _insertEase("Bounce", function (p) {
          return 1 - easeOut(1 - p);
        }, easeOut);
      })(7.5625, 2.75);
    
      _insertEase("Expo", function (p) {
        return p ? Math.pow(2, 10 * (p - 1)) : 0;
      });
    
      _insertEase("Circ", function (p) {
        return -(_sqrt(1 - p * p) - 1);
      });
    
      _insertEase("Sine", function (p) {
        return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
      });
    
      _insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
    
      _easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
        config: function config(steps, immediateStart) {
          if (steps === void 0) {
            steps = 1;
          }
    
          var p1 = 1 / steps,
              p2 = steps + (immediateStart ? 0 : 1),
              p3 = immediateStart ? 1 : 0,
              max = 1 - _tinyNum;
          return function (p) {
            return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
          };
        }
      };
      _defaults.ease = _easeMap["quad.out"];
    
      _forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
        return _callbackNames += name + "," + name + "Params,";
      });
    
      var GSCache = function GSCache(target, harness) {
        this.id = _gsID++;
        target._gsap = this;
        this.target = target;
        this.harness = harness;
        this.get = harness ? harness.get : _getProperty;
        this.set = harness ? harness.getSetter : _getSetter;
      };
      var Animation = function () {
        function Animation(vars, time) {
          var parent = vars.parent || _globalTimeline;
          this.vars = vars;
          this._delay = +vars.delay || 0;
    
          if (this._repeat = vars.repeat || 0) {
            this._rDelay = vars.repeatDelay || 0;
            this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
          }
    
          this._ts = 1;
    
          _setDuration(this, +vars.duration, 1);
    
          this.data = vars.data;
          _tickerActive || _ticker.wake();
          parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1);
          vars.reversed && this.reverse();
          vars.paused && this.paused(true);
        }
    
        var _proto = Animation.prototype;
    
        _proto.delay = function delay(value) {
          if (value || value === 0) {
            this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
            this._delay = value;
            return this;
          }
    
          return this._delay;
        };
    
        _proto.duration = function duration(value) {
          return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
        };
    
        _proto.totalDuration = function totalDuration(value) {
          if (!arguments.length) {
            return this._tDur;
          }
    
          this._dirty = 0;
          return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
        };
    
        _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
          _wake();
    
          if (!arguments.length) {
            return this._tTime;
          }
    
          var parent = this.parent || this._dp;
    
          if (parent && parent.smoothChildTiming && this._ts) {
            this._start = _round(parent._time - (this._ts > 0 ? _totalTime / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - _totalTime) / -this._ts));
    
            _setEnd(this);
    
            parent._dirty || _uncache(parent);
    
            while (parent.parent) {
              if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
                parent.totalTime(parent._tTime, true);
              }
    
              parent = parent.parent;
            }
    
            if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
              _addToTimeline(this._dp, this, this._start - this._delay);
            }
          }
    
          if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted) {
            this._ts || (this._pTime = _totalTime);
    
            _lazySafeRender(this, _totalTime, suppressEvents);
          }
    
          return this;
        };
    
        _proto.time = function time(value, suppressEvents) {
          return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time;
        };
    
        _proto.totalProgress = function totalProgress(value, suppressEvents) {
          return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
        };
    
        _proto.progress = function progress(value, suppressEvents) {
          return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
        };
    
        _proto.iteration = function iteration(value, suppressEvents) {
          var cycleDuration = this.duration() + this._rDelay;
    
          return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
        };
    
        _proto.timeScale = function timeScale(value) {
          if (!arguments.length) {
            return this._rts === -_tinyNum ? 0 : this._rts;
          }
    
          if (this._rts === value) {
            return this;
          }
    
          var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
          this._rts = +value || 0;
          this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
          return _recacheAncestors(this.totalTime(_clamp(0, this._tDur, tTime), true));
        };
    
        _proto.paused = function paused(value) {
          if (!arguments.length) {
            return this._ps;
          }
    
          if (this._ps !== value) {
            this._ps = value;
    
            if (value) {
              this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
              this._ts = this._act = 0;
            } else {
              _wake();
    
              this._ts = this._rts;
              this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum);
            }
          }
    
          return this;
        };
    
        _proto.startTime = function startTime(value) {
          if (arguments.length) {
            this._start = value;
            var parent = this.parent || this._dp;
            parent && (parent._sort || !this.parent) && _addToTimeline(parent, this, value - this._delay);
            return this;
          }
    
          return this._start;
        };
    
        _proto.endTime = function endTime(includeRepeats) {
          return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
        };
    
        _proto.rawTime = function rawTime(wrapRepeats) {
          var parent = this.parent || this._dp;
          return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
        };
    
        _proto.repeat = function repeat(value) {
          if (arguments.length) {
            this._repeat = value;
            return _onUpdateTotalDuration(this);
          }
    
          return this._repeat;
        };
    
        _proto.repeatDelay = function repeatDelay(value) {
          if (arguments.length) {
            this._rDelay = value;
            return _onUpdateTotalDuration(this);
          }
    
          return this._rDelay;
        };
    
        _proto.yoyo = function yoyo(value) {
          if (arguments.length) {
            this._yoyo = value;
            return this;
          }
    
          return this._yoyo;
        };
    
        _proto.seek = function seek(position, suppressEvents) {
          return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
        };
    
        _proto.restart = function restart(includeDelay, suppressEvents) {
          return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
        };
    
        _proto.play = function play(from, suppressEvents) {
          if (from != null) {
            this.seek(from, suppressEvents);
          }
    
          return this.reversed(false).paused(false);
        };
    
        _proto.reverse = function reverse(from, suppressEvents) {
          if (from != null) {
            this.seek(from || this.totalDuration(), suppressEvents);
          }
    
          return this.reversed(true).paused(false);
        };
    
        _proto.pause = function pause(atTime, suppressEvents) {
          if (atTime != null) {
            this.seek(atTime, suppressEvents);
          }
    
          return this.paused(true);
        };
    
        _proto.resume = function resume() {
          return this.paused(false);
        };
    
        _proto.reversed = function reversed(value) {
          if (arguments.length) {
            if (!!value !== this.reversed()) {
              this.timeScale(-this._rts || (value ? -_tinyNum : 0));
            }
    
            return this;
          }
    
          return this._rts < 0;
        };
    
        _proto.invalidate = function invalidate() {
          this._initted = 0;
          this._zTime = -_tinyNum;
          return this;
        };
    
        _proto.isActive = function isActive(hasStarted) {
          var parent = this.parent || this._dp,
              start = this._start,
              rawTime;
          return !!(!parent || this._ts && (this._initted || !hasStarted) && parent.isActive(hasStarted) && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
        };
    
        _proto.eventCallback = function eventCallback(type, callback, params) {
          var vars = this.vars;
    
          if (arguments.length > 1) {
            if (!callback) {
              delete vars[type];
            } else {
              vars[type] = callback;
    
              if (params) {
                vars[type + "Params"] = params;
              }
    
              if (type === "onUpdate") {
                this._onUpdate = callback;
              }
            }
    
            return this;
          }
    
          return vars[type];
        };
    
        _proto.then = function then(onFulfilled) {
          var self = this;
          return new Promise(function (resolve) {
            var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
                _resolve = function _resolve() {
              var _then = self.then;
              self.then = null;
              _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
              resolve(f);
              self.then = _then;
            };
    
            if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
              _resolve();
            } else {
              self._prom = _resolve;
            }
          });
        };
    
        _proto.kill = function kill() {
          _interrupt(this);
        };
    
        return Animation;
      }();
    
      _setDefaults(Animation.prototype, {
        _time: 0,
        _start: 0,
        _end: 0,
        _tTime: 0,
        _tDur: 0,
        _dirty: 0,
        _repeat: 0,
        _yoyo: false,
        parent: null,
        _initted: false,
        _rDelay: 0,
        _ts: 1,
        _dp: 0,
        ratio: 0,
        _zTime: -_tinyNum,
        _prom: 0,
        _ps: false,
        _rts: 1
      });
    
      var Timeline = function (_Animation) {
        _inheritsLoose(Timeline, _Animation);
    
        function Timeline(vars, time) {
          var _this;
    
          if (vars === void 0) {
            vars = {};
          }
    
          _this = _Animation.call(this, vars, time) || this;
          _this.labels = {};
          _this.smoothChildTiming = !!vars.smoothChildTiming;
          _this.autoRemoveChildren = !!vars.autoRemoveChildren;
          _this._sort = _isNotFalse(vars.sortChildren);
          _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this));
          vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
          return _this;
        }
    
        var _proto2 = Timeline.prototype;
    
        _proto2.to = function to(targets, vars, position) {
          new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
          return this;
        };
    
        _proto2.from = function from(targets, vars, position) {
          new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
          return this;
        };
    
        _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
          new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
          return this;
        };
    
        _proto2.set = function set(targets, vars, position) {
          vars.duration = 0;
          vars.parent = this;
          _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
          vars.immediateRender = !!vars.immediateRender;
          new Tween(targets, vars, _parsePosition(this, position), 1);
          return this;
        };
    
        _proto2.call = function call(callback, params, position) {
          return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
        };
    
        _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
          vars.duration = duration;
          vars.stagger = vars.stagger || stagger;
          vars.onComplete = onCompleteAll;
          vars.onCompleteParams = onCompleteAllParams;
          vars.parent = this;
          new Tween(targets, vars, _parsePosition(this, position));
          return this;
        };
    
        _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
          vars.runBackwards = 1;
          _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
          return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
        };
    
        _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
          toVars.startAt = fromVars;
          _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
          return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
        };
    
        _proto2.render = function render(totalTime, suppressEvents, force) {
          var prevTime = this._time,
              tDur = this._dirty ? this.totalDuration() : this._tDur,
              dur = this._dur,
              tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
              crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
              time,
              child,
              next,
              iteration,
              cycleDuration,
              prevPaused,
              pauseTween,
              timeScale,
              prevStart,
              prevIteration,
              yoyo,
              isYoyo;
    
          if (tTime !== this._tTime || force || crossingStart) {
            if (prevTime !== this._time && dur) {
              tTime += this._time - prevTime;
              totalTime += this._time - prevTime;
            }
    
            time = tTime;
            prevStart = this._start;
            timeScale = this._ts;
            prevPaused = !timeScale;
    
            if (crossingStart) {
              dur || (prevTime = this._zTime);
              (totalTime || !suppressEvents) && (this._zTime = totalTime);
            }
    
            if (this._repeat) {
              yoyo = this._yoyo;
              cycleDuration = dur + this._rDelay;
              time = _round(tTime % cycleDuration);
    
              if (time > dur || tDur === tTime) {
                time = dur;
              }
    
              iteration = ~~(tTime / cycleDuration);
    
              if (iteration && iteration === tTime / cycleDuration) {
                time = dur;
                iteration--;
              }
    
              prevIteration = _animationCycle(this._tTime, cycleDuration);
              !prevTime && this._tTime && prevIteration !== iteration && (prevIteration = iteration);
    
              if (yoyo && iteration & 1) {
                time = dur - time;
                isYoyo = 1;
              }
    
              if (iteration !== prevIteration && !this._lock) {
                var rewinding = yoyo && prevIteration & 1,
                    doesWrap = rewinding === (yoyo && iteration & 1);
    
                if (iteration < prevIteration) {
                  rewinding = !rewinding;
                }
    
                prevTime = rewinding ? 0 : dur;
                this._lock = 1;
                this.render(prevTime || (isYoyo ? 0 : _round(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
    
                if (!suppressEvents && this.parent) {
                  _callback(this, "onRepeat");
                }
    
                this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
    
                if (prevTime !== this._time || prevPaused !== !this._ts) {
                  return this;
                }
    
                if (doesWrap) {
                  this._lock = 2;
                  prevTime = rewinding ? dur + 0.0001 : -0.0001;
                  this.render(prevTime, true);
                  this.vars.repeatRefresh && !isYoyo && this.invalidate();
                }
    
                this._lock = 0;
    
                if (!this._ts && !prevPaused) {
                  return this;
                }
    
                _propagateYoyoEase(this, isYoyo);
              }
            }
    
            if (this._hasPause && !this._forcing && this._lock < 2) {
              pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));
    
              if (pauseTween) {
                tTime -= time - (time = pauseTween._start);
              }
            }
    
            this._tTime = tTime;
            this._time = time;
            this._act = !timeScale;
    
            if (!this._initted) {
              this._onUpdate = this.vars.onUpdate;
              this._initted = 1;
              this._zTime = totalTime;
            }
    
            if (!prevTime && time && !suppressEvents) {
              _callback(this, "onStart");
            }
    
            if (time >= prevTime && totalTime >= 0) {
              child = this._first;
    
              while (child) {
                next = child._next;
    
                if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
                  if (child.parent !== this) {
                    return this.render(totalTime, suppressEvents, force);
                  }
    
                  child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
    
                  if (time !== this._time || !this._ts && !prevPaused) {
                    pauseTween = 0;
                    next && (tTime += this._zTime = -_tinyNum);
                    break;
                  }
                }
    
                child = next;
              }
            } else {
              child = this._last;
              var adjustedTime = totalTime < 0 ? totalTime : time;
    
              while (child) {
                next = child._prev;
    
                if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
                  if (child.parent !== this) {
                    return this.render(totalTime, suppressEvents, force);
                  }
    
                  child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);
    
                  if (time !== this._time || !this._ts && !prevPaused) {
                    pauseTween = 0;
                    next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
                    break;
                  }
                }
    
                child = next;
              }
            }
    
            if (pauseTween && !suppressEvents) {
              this.pause();
              pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
    
              if (this._ts) {
                this._start = prevStart;
    
                _setEnd(this);
    
                return this.render(totalTime, suppressEvents, force);
              }
            }
    
            this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
            if (tTime === tDur && tDur >= this.totalDuration() || !tTime && prevTime) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) if (!this._lock) {
              (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
    
              if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
                _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
    
                this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
              }
            }
          }
    
          return this;
        };
    
        _proto2.add = function add(child, position) {
          var _this2 = this;
    
          if (!_isNumber(position)) {
            position = _parsePosition(this, position);
          }
    
          if (!(child instanceof Animation)) {
            if (_isArray(child)) {
              child.forEach(function (obj) {
                return _this2.add(obj, position);
              });
              return _uncache(this);
            }
    
            if (_isString(child)) {
              return this.addLabel(child, position);
            }
    
            if (_isFunction(child)) {
              child = Tween.delayedCall(0, child);
            } else {
              return this;
            }
          }
    
          return this !== child ? _addToTimeline(this, child, position) : this;
        };
    
        _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
          if (nested === void 0) {
            nested = true;
          }
    
          if (tweens === void 0) {
            tweens = true;
          }
    
          if (timelines === void 0) {
            timelines = true;
          }
    
          if (ignoreBeforeTime === void 0) {
            ignoreBeforeTime = -_bigNum;
          }
    
          var a = [],
              child = this._first;
    
          while (child) {
            if (child._start >= ignoreBeforeTime) {
              if (child instanceof Tween) {
                tweens && a.push(child);
              } else {
                timelines && a.push(child);
                nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
              }
            }
    
            child = child._next;
          }
    
          return a;
        };
    
        _proto2.getById = function getById(id) {
          var animations = this.getChildren(1, 1, 1),
              i = animations.length;
    
          while (i--) {
            if (animations[i].vars.id === id) {
              return animations[i];
            }
          }
        };
    
        _proto2.remove = function remove(child) {
          if (_isString(child)) {
            return this.removeLabel(child);
          }
    
          if (_isFunction(child)) {
            return this.killTweensOf(child);
          }
    
          _removeLinkedListItem(this, child);
    
          if (child === this._recent) {
            this._recent = this._last;
          }
    
          return _uncache(this);
        };
    
        _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
          if (!arguments.length) {
            return this._tTime;
          }
    
          this._forcing = 1;
    
          if (!this.parent && !this._dp && this._ts) {
            this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
          }
    
          _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
    
          this._forcing = 0;
          return this;
        };
    
        _proto2.addLabel = function addLabel(label, position) {
          this.labels[label] = _parsePosition(this, position);
          return this;
        };
    
        _proto2.removeLabel = function removeLabel(label) {
          delete this.labels[label];
          return this;
        };
    
        _proto2.addPause = function addPause(position, callback, params) {
          var t = Tween.delayedCall(0, callback || _emptyFunc, params);
          t.data = "isPause";
          this._hasPause = 1;
          return _addToTimeline(this, t, _parsePosition(this, position));
        };
    
        _proto2.removePause = function removePause(position) {
          var child = this._first;
          position = _parsePosition(this, position);
    
          while (child) {
            if (child._start === position && child.data === "isPause") {
              _removeFromParent(child);
            }
    
            child = child._next;
          }
        };
    
        _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
          var tweens = this.getTweensOf(targets, onlyActive),
              i = tweens.length;
    
          while (i--) {
            _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
          }
    
          return this;
        };
    
        _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
          var a = [],
              parsedTargets = toArray(targets),
              child = this._first,
              children;
    
          while (child) {
            if (child instanceof Tween) {
              if (_arrayContainsAny(child._targets, parsedTargets) && (!onlyActive || child.isActive(onlyActive === "started"))) {
                a.push(child);
              }
            } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
              a.push.apply(a, children);
            }
    
            child = child._next;
          }
    
          return a;
        };
    
        _proto2.tweenTo = function tweenTo(position, vars) {
          vars = vars || {};
    
          var tl = this,
              endTime = _parsePosition(tl, position),
              _vars = vars,
              startAt = _vars.startAt,
              _onStart = _vars.onStart,
              onStartParams = _vars.onStartParams,
              tween = Tween.to(tl, _setDefaults(vars, {
            ease: "none",
            lazy: false,
            time: endTime,
            duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale()) || _tinyNum,
            onStart: function onStart() {
              tl.pause();
              var duration = vars.duration || Math.abs((endTime - tl._time) / tl.timeScale());
              tween._dur !== duration && _setDuration(tween, duration).render(tween._time, true, true);
              _onStart && _onStart.apply(tween, onStartParams || []);
            }
          }));
    
          return tween;
        };
    
        _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
          return this.tweenTo(toPosition, _setDefaults({
            startAt: {
              time: _parsePosition(this, fromPosition)
            }
          }, vars));
        };
    
        _proto2.recent = function recent() {
          return this._recent;
        };
    
        _proto2.nextLabel = function nextLabel(afterTime) {
          if (afterTime === void 0) {
            afterTime = this._time;
          }
    
          return _getLabelInDirection(this, _parsePosition(this, afterTime));
        };
    
        _proto2.previousLabel = function previousLabel(beforeTime) {
          if (beforeTime === void 0) {
            beforeTime = this._time;
          }
    
          return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
        };
    
        _proto2.currentLabel = function currentLabel(value) {
          return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
        };
    
        _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
          if (ignoreBeforeTime === void 0) {
            ignoreBeforeTime = 0;
          }
    
          var child = this._first,
              labels = this.labels,
              p;
    
          while (child) {
            if (child._start >= ignoreBeforeTime) {
              child._start += amount;
            }
    
            child = child._next;
          }
    
          if (adjustLabels) {
            for (p in labels) {
              if (labels[p] >= ignoreBeforeTime) {
                labels[p] += amount;
              }
            }
          }
    
          return _uncache(this);
        };
    
        _proto2.invalidate = function invalidate() {
          var child = this._first;
          this._lock = 0;
    
          while (child) {
            child.invalidate();
            child = child._next;
          }
    
          return _Animation.prototype.invalidate.call(this);
        };
    
        _proto2.clear = function clear(includeLabels) {
          if (includeLabels === void 0) {
            includeLabels = true;
          }
    
          var child = this._first,
              next;
    
          while (child) {
            next = child._next;
            this.remove(child);
            child = next;
          }
    
          this._time = this._tTime = this._pTime = 0;
    
          if (includeLabels) {
            this.labels = {};
          }
    
          return _uncache(this);
        };
    
        _proto2.totalDuration = function totalDuration(value) {
          var max = 0,
              self = this,
              child = self._last,
              prevStart = _bigNum,
              prev,
              end,
              start,
              parent;
    
          if (arguments.length) {
            return self.timeScale((self._repeat < 0 ? self.duration() : self.totalDuration()) / (self.reversed() ? -value : value));
          }
    
          if (self._dirty) {
            parent = self.parent;
    
            while (child) {
              prev = child._prev;
              child._dirty && child.totalDuration();
              start = child._start;
    
              if (start > prevStart && self._sort && child._ts && !self._lock) {
                self._lock = 1;
                _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
              } else {
                prevStart = start;
              }
    
              if (start < 0 && child._ts) {
                max -= start;
    
                if (!parent && !self._dp || parent && parent.smoothChildTiming) {
                  self._start += start / self._ts;
                  self._time -= start;
                  self._tTime -= start;
                }
    
                self.shiftChildren(-start, false, -1e999);
                prevStart = 0;
              }
    
              end = _setEnd(child);
    
              if (end > max && child._ts) {
                max = end;
              }
    
              child = prev;
            }
    
            _setDuration(self, self === _globalTimeline && self._time > max ? self._time : max, 1);
    
            self._dirty = 0;
          }
    
          return self._tDur;
        };
    
        Timeline.updateRoot = function updateRoot(time) {
          if (_globalTimeline._ts) {
            _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
    
            _lastRenderedFrame = _ticker.frame;
          }
    
          if (_ticker.frame >= _nextGCFrame) {
            _nextGCFrame += _config.autoSleep || 120;
            var child = _globalTimeline._first;
            if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
              while (child && !child._ts) {
                child = child._next;
              }
    
              child || _ticker.sleep();
            }
          }
        };
    
        return Timeline;
      }(Animation);
    
      _setDefaults(Timeline.prototype, {
        _lock: 0,
        _hasPause: 0,
        _forcing: 0
      });
    
      var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
        var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
            index = 0,
            matchIndex = 0,
            result,
            startNums,
            color,
            endNum,
            chunk,
            startNum,
            hasRandom,
            a;
        pt.b = start;
        pt.e = end;
        start += "";
        end += "";
    
        if (hasRandom = ~end.indexOf("random(")) {
          end = _replaceRandom(end);
        }
    
        if (stringFilter) {
          a = [start, end];
          stringFilter(a, target, prop);
          start = a[0];
          end = a[1];
        }
    
        startNums = start.match(_complexStringNumExp) || [];
    
        while (result = _complexStringNumExp.exec(end)) {
          endNum = result[0];
          chunk = end.substring(index, result.index);
    
          if (color) {
            color = (color + 1) % 5;
          } else if (chunk.substr(-5) === "rgba(") {
            color = 1;
          }
    
          if (endNum !== startNums[matchIndex++]) {
            startNum = parseFloat(startNums[matchIndex - 1]) || 0;
            pt._pt = {
              _next: pt._pt,
              p: chunk || matchIndex === 1 ? chunk : ",",
              s: startNum,
              c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
              m: color && color < 4 ? Math.round : 0
            };
            index = _complexStringNumExp.lastIndex;
          }
        }
    
        pt.c = index < end.length ? end.substring(index, end.length) : "";
        pt.fp = funcParam;
    
        if (_relExp.test(end) || hasRandom) {
          pt.e = 0;
        }
    
        this._pt = pt;
        return pt;
      },
          _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
        _isFunction(end) && (end = end(index || 0, target, targets));
        var currentValue = target[prop],
            parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
            setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
            pt;
    
        if (_isString(end)) {
          if (~end.indexOf("random(")) {
            end = _replaceRandom(end);
          }
    
          if (end.charAt(1) === "=") {
            end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
          }
        }
    
        if (parsedStart !== end) {
          if (!isNaN(parsedStart + end)) {
            pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
            funcParam && (pt.fp = funcParam);
            modifier && pt.modifier(modifier, this, target);
            return this._pt = pt;
          }
    
          !currentValue && !(prop in target) && _missingPlugin(prop, end);
          return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
        }
      },
          _processVars = function _processVars(vars, index, target, targets, tween) {
        if (_isFunction(vars)) {
          vars = _parseFuncOrString(vars, tween, index, target, targets);
        }
    
        if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars)) {
          return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
        }
    
        var copy = {},
            p;
    
        for (p in vars) {
          copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
        }
    
        return copy;
      },
          _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
        var plugin, pt, ptLookup, i;
    
        if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
          tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
    
          if (tween !== _quickTween) {
            ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
            i = plugin._props.length;
    
            while (i--) {
              ptLookup[plugin._props[i]] = pt;
            }
          }
        }
    
        return plugin;
      },
          _overwritingTween,
          _initTween = function _initTween(tween, time) {
        var vars = tween.vars,
            ease = vars.ease,
            startAt = vars.startAt,
            immediateRender = vars.immediateRender,
            lazy = vars.lazy,
            onUpdate = vars.onUpdate,
            onUpdateParams = vars.onUpdateParams,
            callbackScope = vars.callbackScope,
            runBackwards = vars.runBackwards,
            yoyoEase = vars.yoyoEase,
            keyframes = vars.keyframes,
            autoRevert = vars.autoRevert,
            dur = tween._dur,
            prevStartAt = tween._startAt,
            targets = tween._targets,
            parent = tween.parent,
            fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
            autoOverwrite = tween._overwrite === "auto",
            tl = tween.timeline,
            cleanVars,
            i,
            p,
            pt,
            target,
            hasPriority,
            gsData,
            harness,
            plugin,
            ptLookup,
            index,
            harnessVars;
        tl && (!keyframes || !ease) && (ease = "none");
        tween._ease = _parseEase(ease, _defaults.ease);
        tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
    
        if (yoyoEase && tween._yoyo && !tween._repeat) {
          yoyoEase = tween._yEase;
          tween._yEase = tween._ease;
          tween._ease = yoyoEase;
        }
    
        if (!tl) {
          harness = targets[0] ? _getCache(targets[0]).harness : 0;
          harnessVars = harness && vars[harness.prop];
          cleanVars = _copyExcluding(vars, _reservedProps);
          prevStartAt && prevStartAt.render(-1, true).kill();
    
          if (startAt) {
            _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
              data: "isStart",
              overwrite: false,
              parent: parent,
              immediateRender: true,
              lazy: _isNotFalse(lazy),
              startAt: null,
              delay: 0,
              onUpdate: onUpdate,
              onUpdateParams: onUpdateParams,
              callbackScope: callbackScope,
              stagger: 0
            }, startAt)));
    
            if (immediateRender) {
              if (time > 0) {
                !autoRevert && (tween._startAt = 0);
              } else if (dur) {
                return;
              }
            }
          } else if (runBackwards && dur) {
            if (prevStartAt) {
              !autoRevert && (tween._startAt = 0);
            } else {
              time && (immediateRender = false);
              p = _setDefaults({
                overwrite: false,
                data: "isFromStart",
                lazy: immediateRender && _isNotFalse(lazy),
                immediateRender: immediateRender,
                stagger: 0,
                parent: parent
              }, cleanVars);
              harnessVars && (p[harness.prop] = harnessVars);
    
              _removeFromParent(tween._startAt = Tween.set(targets, p));
    
              if (!immediateRender) {
                _initTween(tween._startAt, _tinyNum);
              } else if (!time) {
                return;
              }
            }
          }
    
          tween._pt = 0;
          lazy = dur && _isNotFalse(lazy) || lazy && !dur;
    
          for (i = 0; i < targets.length; i++) {
            target = targets[i];
            gsData = target._gsap || _harness(targets)[i]._gsap;
            tween._ptLookup[i] = ptLookup = {};
            _lazyLookup[gsData.id] && _lazyRender();
            index = fullTargets === targets ? i : fullTargets.indexOf(target);
    
            if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
              tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
    
              plugin._props.forEach(function (name) {
                ptLookup[name] = pt;
              });
    
              plugin.priority && (hasPriority = 1);
            }
    
            if (!harness || harnessVars) {
              for (p in cleanVars) {
                if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
                  plugin.priority && (hasPriority = 1);
                } else {
                  ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
                }
              }
            }
    
            tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
    
            if (autoOverwrite && tween._pt) {
              _overwritingTween = tween;
    
              _globalTimeline.killTweensOf(target, ptLookup, "started");
    
              _overwritingTween = 0;
            }
    
            tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
          }
    
          hasPriority && _sortPropTweensByPriority(tween);
          tween._onInit && tween._onInit(tween);
        }
    
        tween._from = !tl && !!vars.runBackwards;
        tween._onUpdate = onUpdate;
        tween._initted = !!tween.parent;
      },
          _addAliasesToVars = function _addAliasesToVars(targets, vars) {
        var harness = targets[0] ? _getCache(targets[0]).harness : 0,
            propertyAliases = harness && harness.aliases,
            copy,
            p,
            i,
            aliases;
    
        if (!propertyAliases) {
          return vars;
        }
    
        copy = _merge({}, vars);
    
        for (p in propertyAliases) {
          if (p in copy) {
            aliases = propertyAliases[p].split(",");
            i = aliases.length;
    
            while (i--) {
              copy[aliases[i]] = copy[p];
            }
          }
        }
    
        return copy;
      },
          _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
        return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
      },
          _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
          _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger").split(",");
    
      var Tween = function (_Animation2) {
        _inheritsLoose(Tween, _Animation2);
    
        function Tween(targets, vars, time, skipInherit) {
          var _this3;
    
          if (typeof vars === "number") {
            time.duration = vars;
            vars = time;
            time = null;
          }
    
          _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this;
          var _this3$vars = _this3.vars,
              duration = _this3$vars.duration,
              delay = _this3$vars.delay,
              immediateRender = _this3$vars.immediateRender,
              stagger = _this3$vars.stagger,
              overwrite = _this3$vars.overwrite,
              keyframes = _this3$vars.keyframes,
              defaults = _this3$vars.defaults,
              scrollTrigger = _this3$vars.scrollTrigger,
              yoyoEase = _this3$vars.yoyoEase,
              parent = _this3.parent,
              parsedTargets = (_isArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
              tl,
              i,
              copy,
              l,
              p,
              curTarget,
              staggerFunc,
              staggerVarsToMerge;
          _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
          _this3._ptLookup = [];
          _this3._overwrite = overwrite;
    
          if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
            vars = _this3.vars;
            tl = _this3.timeline = new Timeline({
              data: "nested",
              defaults: defaults || {}
            });
            tl.kill();
            tl.parent = _assertThisInitialized(_this3);
    
            if (keyframes) {
              _setDefaults(tl.vars.defaults, {
                ease: "none"
              });
    
              keyframes.forEach(function (frame) {
                return tl.to(parsedTargets, frame, ">");
              });
            } else {
              l = parsedTargets.length;
              staggerFunc = stagger ? distribute(stagger) : _emptyFunc;
    
              if (_isObject(stagger)) {
                for (p in stagger) {
                  if (~_staggerTweenProps.indexOf(p)) {
                    staggerVarsToMerge || (staggerVarsToMerge = {});
                    staggerVarsToMerge[p] = stagger[p];
                  }
                }
              }
    
              for (i = 0; i < l; i++) {
                copy = {};
    
                for (p in vars) {
                  if (_staggerPropsToSkip.indexOf(p) < 0) {
                    copy[p] = vars[p];
                  }
                }
    
                copy.stagger = 0;
                yoyoEase && (copy.yoyoEase = yoyoEase);
                staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
                curTarget = parsedTargets[i];
                copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
                copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
    
                if (!stagger && l === 1 && copy.delay) {
                  _this3._delay = delay = copy.delay;
                  _this3._start += delay;
                  copy.delay = 0;
                }
    
                tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
              }
    
              tl.duration() ? duration = delay = 0 : _this3.timeline = 0;
            }
    
            duration || _this3.duration(duration = tl.duration());
          } else {
            _this3.timeline = 0;
          }
    
          if (overwrite === true) {
            _overwritingTween = _assertThisInitialized(_this3);
    
            _globalTimeline.killTweensOf(parsedTargets);
    
            _overwritingTween = 0;
          }
    
          parent && _postAddChecks(parent, _assertThisInitialized(_this3));
    
          if (immediateRender || !duration && !keyframes && _this3._start === _round(parent._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
            _this3._tTime = -_tinyNum;
    
            _this3.render(Math.max(0, -delay));
          }
    
          scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
          return _this3;
        }
    
        var _proto3 = Tween.prototype;
    
        _proto3.render = function render(totalTime, suppressEvents, force) {
          var prevTime = this._time,
              tDur = this._tDur,
              dur = this._dur,
              tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
              time,
              pt,
              iteration,
              cycleDuration,
              prevIteration,
              isYoyo,
              ratio,
              timeline,
              yoyoEase;
    
          if (!dur) {
            _renderZeroDurationTween(this, totalTime, suppressEvents, force);
          } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
            time = tTime;
            timeline = this.timeline;
    
            if (this._repeat) {
              cycleDuration = dur + this._rDelay;
              time = _round(tTime % cycleDuration);
    
              if (time > dur || tDur === tTime) {
                time = dur;
              }
    
              iteration = ~~(tTime / cycleDuration);
    
              if (iteration && iteration === tTime / cycleDuration) {
                time = dur;
                iteration--;
              }
    
              isYoyo = this._yoyo && iteration & 1;
    
              if (isYoyo) {
                yoyoEase = this._yEase;
                time = dur - time;
              }
    
              prevIteration = _animationCycle(this._tTime, cycleDuration);
    
              if (time === prevTime && !force && this._initted) {
                return this;
              }
    
              if (iteration !== prevIteration) {
                timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);
    
                if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
                  this._lock = force = 1;
                  this.render(_round(cycleDuration * iteration), true).invalidate()._lock = 0;
                }
              }
            }
    
            if (!this._initted) {
              if (_attemptInitTween(this, time, force, suppressEvents)) {
                this._tTime = 0;
                return this;
              }
    
              if (dur !== this._dur) {
                return this.render(totalTime, suppressEvents, force);
              }
            }
    
            this._tTime = tTime;
            this._time = time;
    
            if (!this._act && this._ts) {
              this._act = 1;
              this._lazy = 0;
            }
    
            this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
    
            if (this._from) {
              this.ratio = ratio = 1 - ratio;
            }
    
            time && !prevTime && !suppressEvents && _callback(this, "onStart");
            pt = this._pt;
    
            while (pt) {
              pt.r(ratio, pt.d);
              pt = pt._next;
            }
    
            timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);
    
            if (this._onUpdate && !suppressEvents) {
              if (totalTime < 0 && this._startAt) {
                this._startAt.render(totalTime, true, force);
              }
    
              _callback(this, "onUpdate");
            }
    
            this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
    
            if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
              totalTime < 0 && this._startAt && !this._onUpdate && this._startAt.render(totalTime, true, true);
              (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
    
              if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime)) {
                _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
    
                this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
              }
            }
          }
    
          return this;
        };
    
        _proto3.targets = function targets() {
          return this._targets;
        };
    
        _proto3.invalidate = function invalidate() {
          this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
          this._ptLookup = [];
          this.timeline && this.timeline.invalidate();
          return _Animation2.prototype.invalidate.call(this);
        };
    
        _proto3.kill = function kill(targets, vars) {
          if (vars === void 0) {
            vars = "all";
          }
    
          if (!targets && (!vars || vars === "all")) {
            this._lazy = 0;
    
            if (this.parent) {
              return _interrupt(this);
            }
          }
    
          if (this.timeline) {
            var tDur = this.timeline.totalDuration();
            this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
            this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur);
            return this;
          }
    
          var parsedTargets = this._targets,
              killingTargets = targets ? toArray(targets) : parsedTargets,
              propTweenLookup = this._ptLookup,
              firstPT = this._pt,
              overwrittenProps,
              curLookup,
              curOverwriteProps,
              props,
              p,
              pt,
              i;
    
          if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
            return _interrupt(this);
          }
    
          overwrittenProps = this._op = this._op || [];
    
          if (vars !== "all") {
            if (_isString(vars)) {
              p = {};
    
              _forEachName(vars, function (name) {
                return p[name] = 1;
              });
    
              vars = p;
            }
    
            vars = _addAliasesToVars(parsedTargets, vars);
          }
    
          i = parsedTargets.length;
    
          while (i--) {
            if (~killingTargets.indexOf(parsedTargets[i])) {
              curLookup = propTweenLookup[i];
    
              if (vars === "all") {
                overwrittenProps[i] = vars;
                props = curLookup;
                curOverwriteProps = {};
              } else {
                curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
                props = vars;
              }
    
              for (p in props) {
                pt = curLookup && curLookup[p];
    
                if (pt) {
                  if (!("kill" in pt.d) || pt.d.kill(p) === true) {
                    _removeLinkedListItem(this, pt, "_pt");
                  }
    
                  delete curLookup[p];
                }
    
                if (curOverwriteProps !== "all") {
                  curOverwriteProps[p] = 1;
                }
              }
            }
          }
    
          this._initted && !this._pt && firstPT && _interrupt(this);
          return this;
        };
    
        Tween.to = function to(targets, vars) {
          return new Tween(targets, vars, arguments[2]);
        };
    
        Tween.from = function from(targets, vars) {
          return new Tween(targets, _parseVars(arguments, 1));
        };
    
        Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
          return new Tween(callback, 0, {
            immediateRender: false,
            lazy: false,
            overwrite: false,
            delay: delay,
            onComplete: callback,
            onReverseComplete: callback,
            onCompleteParams: params,
            onReverseCompleteParams: params,
            callbackScope: scope
          });
        };
    
        Tween.fromTo = function fromTo(targets, fromVars, toVars) {
          return new Tween(targets, _parseVars(arguments, 2));
        };
    
        Tween.set = function set(targets, vars) {
          vars.duration = 0;
          vars.repeatDelay || (vars.repeat = 0);
          return new Tween(targets, vars);
        };
    
        Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
          return _globalTimeline.killTweensOf(targets, props, onlyActive);
        };
    
        return Tween;
      }(Animation);
    
      _setDefaults(Tween.prototype, {
        _targets: [],
        _lazy: 0,
        _startAt: 0,
        _op: 0,
        _onInit: 0
      });
    
      _forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
        Tween[name] = function () {
          var tl = new Timeline(),
              params = _slice.call(arguments, 0);
    
          params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
          return tl[name].apply(tl, params);
        };
      });
    
      var _setterPlain = function _setterPlain(target, property, value) {
        return target[property] = value;
      },
          _setterFunc = function _setterFunc(target, property, value) {
        return target[property](value);
      },
          _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
        return target[property](data.fp, value);
      },
          _setterAttribute = function _setterAttribute(target, property, value) {
        return target.setAttribute(property, value);
      },
          _getSetter = function _getSetter(target, property) {
        return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
      },
          _renderPlain = function _renderPlain(ratio, data) {
        return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
      },
          _renderBoolean = function _renderBoolean(ratio, data) {
        return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
      },
          _renderComplexString = function _renderComplexString(ratio, data) {
        var pt = data._pt,
            s = "";
    
        if (!ratio && data.b) {
          s = data.b;
        } else if (ratio === 1 && data.e) {
          s = data.e;
        } else {
          while (pt) {
            s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s;
            pt = pt._next;
          }
    
          s += data.c;
        }
    
        data.set(data.t, data.p, s, data);
      },
          _renderPropTweens = function _renderPropTweens(ratio, data) {
        var pt = data._pt;
    
        while (pt) {
          pt.r(ratio, pt.d);
          pt = pt._next;
        }
      },
          _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
        var pt = this._pt,
            next;
    
        while (pt) {
          next = pt._next;
    
          if (pt.p === property) {
            pt.modifier(modifier, tween, target);
          }
    
          pt = next;
        }
      },
          _killPropTweensOf = function _killPropTweensOf(property) {
        var pt = this._pt,
            hasNonDependentRemaining,
            next;
    
        while (pt) {
          next = pt._next;
    
          if (pt.p === property && !pt.op || pt.op === property) {
            _removeLinkedListItem(this, pt, "_pt");
          } else if (!pt.dep) {
            hasNonDependentRemaining = 1;
          }
    
          pt = next;
        }
    
        return !hasNonDependentRemaining;
      },
          _setterWithModifier = function _setterWithModifier(target, property, value, data) {
        data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
      },
          _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
        var pt = parent._pt,
            next,
            pt2,
            first,
            last;
    
        while (pt) {
          next = pt._next;
          pt2 = first;
    
          while (pt2 && pt2.pr > pt.pr) {
            pt2 = pt2._next;
          }
    
          if (pt._prev = pt2 ? pt2._prev : last) {
            pt._prev._next = pt;
          } else {
            first = pt;
          }
    
          if (pt._next = pt2) {
            pt2._prev = pt;
          } else {
            last = pt;
          }
    
          pt = next;
        }
    
        parent._pt = first;
      };
    
      var PropTween = function () {
        function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
          this.t = target;
          this.s = start;
          this.c = change;
          this.p = prop;
          this.r = renderer || _renderPlain;
          this.d = data || this;
          this.set = setter || _setterPlain;
          this.pr = priority || 0;
          this._next = next;
    
          if (next) {
            next._prev = this;
          }
        }
    
        var _proto4 = PropTween.prototype;
    
        _proto4.modifier = function modifier(func, tween, target) {
          this.mSet = this.mSet || this.set;
          this.set = _setterWithModifier;
          this.m = func;
          this.mt = target;
          this.tween = tween;
        };
    
        return PropTween;
      }();
    
      _forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function (name) {
        return _reservedProps[name] = 1;
      });
    
      _globals.TweenMax = _globals.TweenLite = Tween;
      _globals.TimelineLite = _globals.TimelineMax = Timeline;
      _globalTimeline = new Timeline({
        sortChildren: false,
        defaults: _defaults,
        autoRemoveChildren: true,
        id: "root",
        smoothChildTiming: true
      });
      _config.stringFilter = _colorStringFilter;
      var _gsap = {
        registerPlugin: function registerPlugin() {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }
    
          args.forEach(function (config) {
            return _createPlugin(config);
          });
        },
        timeline: function timeline(vars) {
          return new Timeline(vars);
        },
        getTweensOf: function getTweensOf(targets, onlyActive) {
          return _globalTimeline.getTweensOf(targets, onlyActive);
        },
        getProperty: function getProperty(target, property, unit, uncache) {
          if (_isString(target)) {
            target = toArray(target)[0];
          }
    
          var getter = _getCache(target || {}).get,
              format = unit ? _passThrough : _numericIfPossible;
    
          if (unit === "native") {
            unit = "";
          }
    
          return !target ? target : !property ? function (property, unit, uncache) {
            return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
          } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
        },
        quickSetter: function quickSetter(target, property, unit) {
          target = toArray(target);
    
          if (target.length > 1) {
            var setters = target.map(function (t) {
              return gsap.quickSetter(t, property, unit);
            }),
                l = setters.length;
            return function (value) {
              var i = l;
    
              while (i--) {
                setters[i](value);
              }
            };
          }
    
          target = target[0] || {};
    
          var Plugin = _plugins[property],
              cache = _getCache(target),
              p = cache.harness && (cache.harness.aliases || {})[property] || property,
              setter = Plugin ? function (value) {
            var p = new Plugin();
            _quickTween._pt = 0;
            p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
            p.render(1, p);
            _quickTween._pt && _renderPropTweens(1, _quickTween);
          } : cache.set(target, p);
    
          return Plugin ? setter : function (value) {
            return setter(target, p, unit ? value + unit : value, cache, 1);
          };
        },
        isTweening: function isTweening(targets) {
          return _globalTimeline.getTweensOf(targets, true).length > 0;
        },
        defaults: function defaults(value) {
          if (value && value.ease) {
            value.ease = _parseEase(value.ease, _defaults.ease);
          }
    
          return _mergeDeep(_defaults, value || {});
        },
        config: function config(value) {
          return _mergeDeep(_config, value || {});
        },
        registerEffect: function registerEffect(_ref) {
          var name = _ref.name,
              effect = _ref.effect,
              plugins = _ref.plugins,
              defaults = _ref.defaults,
              extendTimeline = _ref.extendTimeline;
          (plugins || "").split(",").forEach(function (pluginName) {
            return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
          });
    
          _effects[name] = function (targets, vars, tl) {
            return effect(toArray(targets), _setDefaults(vars || {}, defaults), tl);
          };
    
          if (extendTimeline) {
            Timeline.prototype[name] = function (targets, vars, position) {
              return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
            };
          }
        },
        registerEase: function registerEase(name, ease) {
          _easeMap[name] = _parseEase(ease);
        },
        parseEase: function parseEase(ease, defaultEase) {
          return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
        },
        getById: function getById(id) {
          return _globalTimeline.getById(id);
        },
        exportRoot: function exportRoot(vars, includeDelayedCalls) {
          if (vars === void 0) {
            vars = {};
          }
    
          var tl = new Timeline(vars),
              child,
              next;
          tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
    
          _globalTimeline.remove(tl);
    
          tl._dp = 0;
          tl._time = tl._tTime = _globalTimeline._time;
          child = _globalTimeline._first;
    
          while (child) {
            next = child._next;
    
            if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
              _addToTimeline(tl, child, child._start - child._delay);
            }
    
            child = next;
          }
    
          _addToTimeline(_globalTimeline, tl, 0);
    
          return tl;
        },
        utils: {
          wrap: wrap,
          wrapYoyo: wrapYoyo,
          distribute: distribute,
          random: random,
          snap: snap,
          normalize: normalize,
          getUnit: getUnit,
          clamp: clamp,
          splitColor: splitColor,
          toArray: toArray,
          mapRange: mapRange,
          pipe: pipe,
          unitize: unitize,
          interpolate: interpolate,
          shuffle: shuffle
        },
        install: _install,
        effects: _effects,
        ticker: _ticker,
        updateRoot: Timeline.updateRoot,
        plugins: _plugins,
        globalTimeline: _globalTimeline,
        core: {
          PropTween: PropTween,
          globals: _addGlobal,
          Tween: Tween,
          Timeline: Timeline,
          Animation: Animation,
          getCache: _getCache,
          _removeLinkedListItem: _removeLinkedListItem
        }
      };
    
      _forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
        return _gsap[name] = Tween[name];
      });
    
      _ticker.add(Timeline.updateRoot);
    
      _quickTween = _gsap.to({}, {
        duration: 0
      });
    
      var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
        var pt = plugin._pt;
    
        while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
          pt = pt._next;
        }
    
        return pt;
      },
          _addModifiers = function _addModifiers(tween, modifiers) {
        var targets = tween._targets,
            p,
            i,
            pt;
    
        for (p in modifiers) {
          i = targets.length;
    
          while (i--) {
            pt = tween._ptLookup[i][p];
    
            if (pt && (pt = pt.d)) {
              if (pt._pt) {
                pt = _getPluginPropTween(pt, p);
              }
    
              pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
            }
          }
        }
      },
          _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
        return {
          name: name,
          rawVars: 1,
          init: function init(target, vars, tween) {
            tween._onInit = function (tween) {
              var temp, p;
    
              if (_isString(vars)) {
                temp = {};
    
                _forEachName(vars, function (name) {
                  return temp[name] = 1;
                });
    
                vars = temp;
              }
    
              if (modifier) {
                temp = {};
    
                for (p in vars) {
                  temp[p] = modifier(vars[p]);
                }
    
                vars = temp;
              }
    
              _addModifiers(tween, vars);
            };
          }
        };
      };
    
      var gsap = _gsap.registerPlugin({
        name: "attr",
        init: function init(target, vars, tween, index, targets) {
          var p, pt;
    
          for (p in vars) {
            pt = this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p);
            pt && (pt.op = p);
    
            this._props.push(p);
          }
        }
      }, {
        name: "endArray",
        init: function init(target, value) {
          var i = value.length;
    
          while (i--) {
            this.add(target, i, target[i] || 0, value[i]);
          }
        }
      }, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
      Tween.version = Timeline.version = gsap.version = "3.3.4";
      _coreReady = 1;
    
      if (_windowExists()) {
        _wake();
      }
    
      var Power0 = _easeMap.Power0,
          Power1 = _easeMap.Power1,
          Power2 = _easeMap.Power2,
          Power3 = _easeMap.Power3,
          Power4 = _easeMap.Power4,
          Linear = _easeMap.Linear,
          Quad = _easeMap.Quad,
          Cubic = _easeMap.Cubic,
          Quart = _easeMap.Quart,
          Quint = _easeMap.Quint,
          Strong = _easeMap.Strong,
          Elastic = _easeMap.Elastic,
          Back = _easeMap.Back,
          SteppedEase = _easeMap.SteppedEase,
          Bounce = _easeMap.Bounce,
          Sine = _easeMap.Sine,
          Expo = _easeMap.Expo,
          Circ = _easeMap.Circ;
    
      var _win$1,
          _doc$1,
          _docElement,
          _pluginInitted,
          _tempDiv,
          _tempDivStyler,
          _recentSetterPlugin,
          _windowExists$1 = function _windowExists() {
        return typeof window !== "undefined";
      },
          _transformProps = {},
          _RAD2DEG = 180 / Math.PI,
          _DEG2RAD = Math.PI / 180,
          _atan2 = Math.atan2,
          _bigNum$1 = 1e8,
          _capsExp = /([A-Z])/g,
          _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
          _complexExp = /[\s,\(]\S/,
          _propertyAliases = {
        autoAlpha: "opacity,visibility",
        scale: "scaleX,scaleY",
        alpha: "opacity"
      },
          _renderCSSProp = function _renderCSSProp(ratio, data) {
        return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
      },
          _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
        return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
      },
          _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
        return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
      },
          _renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
        var value = data.s + data.c * ratio;
        data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
      },
          _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
        return data.set(data.t, data.p, ratio ? data.e : data.b, data);
      },
          _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
        return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
      },
          _setterCSSStyle = function _setterCSSStyle(target, property, value) {
        return target.style[property] = value;
      },
          _setterCSSProp = function _setterCSSProp(target, property, value) {
        return target.style.setProperty(property, value);
      },
          _setterTransform = function _setterTransform(target, property, value) {
        return target._gsap[property] = value;
      },
          _setterScale = function _setterScale(target, property, value) {
        return target._gsap.scaleX = target._gsap.scaleY = value;
      },
          _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
        var cache = target._gsap;
        cache.scaleX = cache.scaleY = value;
        cache.renderTransform(ratio, cache);
      },
          _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
        var cache = target._gsap;
        cache[property] = value;
        cache.renderTransform(ratio, cache);
      },
          _transformProp = "transform",
          _transformOriginProp = _transformProp + "Origin",
          _supports3D,
          _createElement = function _createElement(type, ns) {
        var e = _doc$1.createElementNS ? _doc$1.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc$1.createElement(type);
        return e.style ? e : _doc$1.createElement(type);
      },
          _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
        var cs = getComputedStyle(target);
        return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || "";
      },
          _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
          _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
        var e = element || _tempDiv,
            s = e.style,
            i = 5;
    
        if (property in s && !preferPrefix) {
          return property;
        }
    
        property = property.charAt(0).toUpperCase() + property.substr(1);
    
        while (i-- && !(_prefixes[i] + property in s)) {}
    
        return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
      },
          _initCore = function _initCore() {
        if (_windowExists$1() && window.document) {
          _win$1 = window;
          _doc$1 = _win$1.document;
          _docElement = _doc$1.documentElement;
          _tempDiv = _createElement("div") || {
            style: {}
          };
          _tempDivStyler = _createElement("div");
          _transformProp = _checkPropPrefix(_transformProp);
          _transformOriginProp = _checkPropPrefix(_transformOriginProp);
          _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
          _supports3D = !!_checkPropPrefix("perspective");
          _pluginInitted = 1;
        }
      },
          _getBBoxHack = function _getBBoxHack(swapIfPossible) {
        var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
            oldParent = this.parentNode,
            oldSibling = this.nextSibling,
            oldCSS = this.style.cssText,
            bbox;
    
        _docElement.appendChild(svg);
    
        svg.appendChild(this);
        this.style.display = "block";
    
        if (swapIfPossible) {
          try {
            bbox = this.getBBox();
            this._gsapBBox = this.getBBox;
            this.getBBox = _getBBoxHack;
          } catch (e) {}
        } else if (this._gsapBBox) {
          bbox = this._gsapBBox();
        }
    
        if (oldParent) {
          if (oldSibling) {
            oldParent.insertBefore(this, oldSibling);
          } else {
            oldParent.appendChild(this);
          }
        }
    
        _docElement.removeChild(svg);
    
        this.style.cssText = oldCSS;
        return bbox;
      },
          _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
        var i = attributesArray.length;
    
        while (i--) {
          if (target.hasAttribute(attributesArray[i])) {
            return target.getAttribute(attributesArray[i]);
          }
        }
      },
          _getBBox = function _getBBox(target) {
        var bounds;
    
        try {
          bounds = target.getBBox();
        } catch (error) {
          bounds = _getBBoxHack.call(target, true);
        }
    
        bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
        return bounds && !bounds.width && !bounds.x && !bounds.y ? {
          x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
          y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
          width: 0,
          height: 0
        } : bounds;
      },
          _isSVG = function _isSVG(e) {
        return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
      },
          _removeProperty = function _removeProperty(target, property) {
        if (property) {
          var style = target.style;
    
          if (property in _transformProps) {
            property = _transformProp;
          }
    
          if (style.removeProperty) {
            if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
              property = "-" + property;
            }
    
            style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
          } else {
            style.removeAttribute(property);
          }
        }
      },
          _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
        var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
        plugin._pt = pt;
        pt.b = beginning;
        pt.e = end;
    
        plugin._props.push(property);
    
        return pt;
      },
          _nonConvertibleUnits = {
        deg: 1,
        rad: 1,
        turn: 1
      },
          _convertToUnit = function _convertToUnit(target, property, value, unit) {
        var curValue = parseFloat(value) || 0,
            curUnit = (value + "").trim().substr((curValue + "").length) || "px",
            style = _tempDiv.style,
            horizontal = _horizontalExp.test(property),
            isRootSVG = target.tagName.toLowerCase() === "svg",
            measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
            amount = 100,
            toPixels = unit === "px",
            toPercent = unit === "%",
            px,
            parent,
            cache,
            isSVG;
    
        if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
          return curValue;
        }
    
        curUnit !== "px" && !toPixels && (curValue = _convertToUnit(target, property, value, "px"));
        isSVG = target.getCTM && _isSVG(target);
    
        if (toPercent && (_transformProps[property] || ~property.indexOf("adius"))) {
          return _round(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount);
        }
    
        style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
        parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
    
        if (isSVG) {
          parent = (target.ownerSVGElement || {}).parentNode;
        }
    
        if (!parent || parent === _doc$1 || !parent.appendChild) {
          parent = _doc$1.body;
        }
    
        cache = parent._gsap;
    
        if (cache && toPercent && cache.width && horizontal && cache.time === _ticker.time) {
          return _round(curValue / cache.width * amount);
        } else {
          (toPercent || curUnit === "%") && (style.position = _getComputedProperty(target, "position"));
          parent === target && (style.position = "static");
          parent.appendChild(_tempDiv);
          px = _tempDiv[measureProperty];
          parent.removeChild(_tempDiv);
          style.position = "absolute";
    
          if (horizontal && toPercent) {
            cache = _getCache(parent);
            cache.time = _ticker.time;
            cache.width = parent[measureProperty];
          }
        }
    
        return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
      },
          _get = function _get(target, property, unit, uncache) {
        var value;
    
        if (!_pluginInitted) {
          _initCore();
        }
    
        if (property in _propertyAliases && property !== "transform") {
          property = _propertyAliases[property];
    
          if (~property.indexOf(",")) {
            property = property.split(",")[0];
          }
        }
    
        if (_transformProps[property] && property !== "transform") {
          value = _parseTransform(target, uncache);
          value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
        } else {
          value = target.style[property];
    
          if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
            value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
          }
        }
    
        return unit && !~(value + "").indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
      },
          _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
        if (!start || start === "none") {
          var p = _checkPropPrefix(prop, target, 1),
              s = p && _getComputedProperty(target, p, 1);
    
          if (s && s !== start) {
            prop = p;
            start = s;
          }
        }
    
        var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString),
            index = 0,
            matchIndex = 0,
            a,
            result,
            startValues,
            startNum,
            color,
            startValue,
            endValue,
            endNum,
            chunk,
            endUnit,
            startUnit,
            relative,
            endValues;
        pt.b = start;
        pt.e = end;
        start += "";
        end += "";
    
        if (end === "auto") {
          target.style[prop] = end;
          end = _getComputedProperty(target, prop) || end;
          target.style[prop] = start;
        }
    
        a = [start, end];
    
        _colorStringFilter(a);
    
        start = a[0];
        end = a[1];
        startValues = start.match(_numWithUnitExp) || [];
        endValues = end.match(_numWithUnitExp) || [];
    
        if (endValues.length) {
          while (result = _numWithUnitExp.exec(end)) {
            endValue = result[0];
            chunk = end.substring(index, result.index);
    
            if (color) {
              color = (color + 1) % 5;
            } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
              color = 1;
            }
    
            if (endValue !== (startValue = startValues[matchIndex++] || "")) {
              startNum = parseFloat(startValue) || 0;
              startUnit = startValue.substr((startNum + "").length);
              relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;
    
              if (relative) {
                endValue = endValue.substr(2);
              }
    
              endNum = parseFloat(endValue);
              endUnit = endValue.substr((endNum + "").length);
              index = _numWithUnitExp.lastIndex - endUnit.length;
    
              if (!endUnit) {
                endUnit = endUnit || _config.units[prop] || startUnit;
    
                if (index === end.length) {
                  end += endUnit;
                  pt.e += endUnit;
                }
              }
    
              if (startUnit !== endUnit) {
                startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
              }
    
              pt._pt = {
                _next: pt._pt,
                p: chunk || matchIndex === 1 ? chunk : ",",
                s: startNum,
                c: relative ? relative * endNum : endNum - startNum,
                m: color && color < 4 ? Math.round : 0
              };
            }
          }
    
          pt.c = index < end.length ? end.substring(index, end.length) : "";
        } else {
          pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
        }
    
        if (_relExp.test(end)) {
          pt.e = 0;
        }
    
        this._pt = pt;
        return pt;
      },
          _keywordToPercent = {
        top: "0%",
        bottom: "100%",
        left: "0%",
        right: "100%",
        center: "50%"
      },
          _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
        var split = value.split(" "),
            x = split[0],
            y = split[1] || "50%";
    
        if (x === "top" || x === "bottom" || y === "left" || y === "right") {
          value = x;
          x = y;
          y = value;
        }
    
        split[0] = _keywordToPercent[x] || x;
        split[1] = _keywordToPercent[y] || y;
        return split.join(" ");
      },
          _renderClearProps = function _renderClearProps(ratio, data) {
        if (data.tween && data.tween._time === data.tween._dur) {
          var target = data.t,
              style = target.style,
              props = data.u,
              cache = target._gsap,
              prop,
              clearTransforms,
              i;
    
          if (props === "all" || props === true) {
            style.cssText = "";
            clearTransforms = 1;
          } else {
            props = props.split(",");
            i = props.length;
    
            while (--i > -1) {
              prop = props[i];
    
              if (_transformProps[prop]) {
                clearTransforms = 1;
                prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
              }
    
              _removeProperty(target, prop);
            }
          }
    
          if (clearTransforms) {
            _removeProperty(target, _transformProp);
    
            if (cache) {
              cache.svg && target.removeAttribute("transform");
    
              _parseTransform(target, 1);
    
              cache.uncache = 1;
            }
          }
        }
      },
          _specialProps = {
        clearProps: function clearProps(plugin, target, property, endValue, tween) {
          if (tween.data !== "isFromStart") {
            var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
            pt.u = endValue;
            pt.pr = -10;
            pt.tween = tween;
    
            plugin._props.push(property);
    
            return 1;
          }
        }
      },
          _identity2DMatrix = [1, 0, 0, 1, 0, 0],
          _rotationalProperties = {},
          _isNullTransform = function _isNullTransform(value) {
        return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
      },
          _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
        var matrixString = _getComputedProperty(target, _transformProp);
    
        return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
      },
          _getMatrix = function _getMatrix(target, force2D) {
        var cache = target._gsap || _getCache(target),
            style = target.style,
            matrix = _getComputedTransformMatrixAsArray(target),
            parent,
            nextSibling,
            temp,
            addedToDOM;
    
        if (cache.svg && target.getAttribute("transform")) {
          temp = target.transform.baseVal.consolidate().matrix;
          matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
          return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
        } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
          temp = style.display;
          style.display = "block";
          parent = target.parentNode;
    
          if (!parent || !target.offsetParent) {
            addedToDOM = 1;
            nextSibling = target.nextSibling;
    
            _docElement.appendChild(target);
          }
    
          matrix = _getComputedTransformMatrixAsArray(target);
          temp ? style.display = temp : _removeProperty(target, "display");
    
          if (addedToDOM) {
            nextSibling ? parent.insertBefore(target, nextSibling) : parent ? parent.appendChild(target) : _docElement.removeChild(target);
          }
        }
    
        return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
      },
          _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
        var cache = target._gsap,
            matrix = matrixArray || _getMatrix(target, true),
            xOriginOld = cache.xOrigin || 0,
            yOriginOld = cache.yOrigin || 0,
            xOffsetOld = cache.xOffset || 0,
            yOffsetOld = cache.yOffset || 0,
            a = matrix[0],
            b = matrix[1],
            c = matrix[2],
            d = matrix[3],
            tx = matrix[4],
            ty = matrix[5],
            originSplit = origin.split(" "),
            xOrigin = parseFloat(originSplit[0]) || 0,
            yOrigin = parseFloat(originSplit[1]) || 0,
            bounds,
            determinant,
            x,
            y;
    
        if (!originIsAbsolute) {
          bounds = _getBBox(target);
          xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
          yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
        } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
          x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
          y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
          xOrigin = x;
          yOrigin = y;
        }
    
        if (smooth || smooth !== false && cache.smooth) {
          tx = xOrigin - xOriginOld;
          ty = yOrigin - yOriginOld;
          cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
          cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
        } else {
          cache.xOffset = cache.yOffset = 0;
        }
    
        cache.xOrigin = xOrigin;
        cache.yOrigin = yOrigin;
        cache.smooth = !!smooth;
        cache.origin = origin;
        cache.originIsAbsolute = !!originIsAbsolute;
        target.style[_transformOriginProp] = "0px 0px";
    
        if (pluginToAddPropTweensTo) {
          _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);
    
          _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);
    
          _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);
    
          _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
        }
    
        target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
      },
          _parseTransform = function _parseTransform(target, uncache) {
        var cache = target._gsap || new GSCache(target);
    
        if ("x" in cache && !uncache && !cache.uncache) {
          return cache;
        }
    
        var style = target.style,
            invertedScaleX = cache.scaleX < 0,
            px = "px",
            deg = "deg",
            origin = _getComputedProperty(target, _transformOriginProp) || "0",
            x,
            y,
            z,
            scaleX,
            scaleY,
            rotation,
            rotationX,
            rotationY,
            skewX,
            skewY,
            perspective,
            xOrigin,
            yOrigin,
            matrix,
            angle,
            cos,
            sin,
            a,
            b,
            c,
            d,
            a12,
            a22,
            t1,
            t2,
            t3,
            a13,
            a23,
            a33,
            a42,
            a43,
            a32;
        x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
        scaleX = scaleY = 1;
        cache.svg = !!(target.getCTM && _isSVG(target));
        matrix = _getMatrix(target, cache.svg);
    
        if (cache.svg) {
          t1 = !cache.uncache && target.getAttribute("data-svg-origin");
    
          _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
        }
    
        xOrigin = cache.xOrigin || 0;
        yOrigin = cache.yOrigin || 0;
    
        if (matrix !== _identity2DMatrix) {
          a = matrix[0];
          b = matrix[1];
          c = matrix[2];
          d = matrix[3];
          x = a12 = matrix[4];
          y = a22 = matrix[5];
    
          if (matrix.length === 6) {
            scaleX = Math.sqrt(a * a + b * b);
            scaleY = Math.sqrt(d * d + c * c);
            rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
            skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
            skewX && (scaleY *= Math.cos(skewX * _DEG2RAD));
    
            if (cache.svg) {
              x -= xOrigin - (xOrigin * a + yOrigin * c);
              y -= yOrigin - (xOrigin * b + yOrigin * d);
            }
          } else {
            a32 = matrix[6];
            a42 = matrix[7];
            a13 = matrix[8];
            a23 = matrix[9];
            a33 = matrix[10];
            a43 = matrix[11];
            x = matrix[12];
            y = matrix[13];
            z = matrix[14];
            angle = _atan2(a32, a33);
            rotationX = angle * _RAD2DEG;
    
            if (angle) {
              cos = Math.cos(-angle);
              sin = Math.sin(-angle);
              t1 = a12 * cos + a13 * sin;
              t2 = a22 * cos + a23 * sin;
              t3 = a32 * cos + a33 * sin;
              a13 = a12 * -sin + a13 * cos;
              a23 = a22 * -sin + a23 * cos;
              a33 = a32 * -sin + a33 * cos;
              a43 = a42 * -sin + a43 * cos;
              a12 = t1;
              a22 = t2;
              a32 = t3;
            }
    
            angle = _atan2(-c, a33);
            rotationY = angle * _RAD2DEG;
    
            if (angle) {
              cos = Math.cos(-angle);
              sin = Math.sin(-angle);
              t1 = a * cos - a13 * sin;
              t2 = b * cos - a23 * sin;
              t3 = c * cos - a33 * sin;
              a43 = d * sin + a43 * cos;
              a = t1;
              b = t2;
              c = t3;
            }
    
            angle = _atan2(b, a);
            rotation = angle * _RAD2DEG;
    
            if (angle) {
              cos = Math.cos(angle);
              sin = Math.sin(angle);
              t1 = a * cos + b * sin;
              t2 = a12 * cos + a22 * sin;
              b = b * cos - a * sin;
              a22 = a22 * cos - a12 * sin;
              a = t1;
              a12 = t2;
            }
    
            if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
              rotationX = rotation = 0;
              rotationY = 180 - rotationY;
            }
    
            scaleX = _round(Math.sqrt(a * a + b * b + c * c));
            scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
            angle = _atan2(a12, a22);
            skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
            perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
          }
    
          if (cache.svg) {
            t1 = target.getAttribute("transform");
            cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
            t1 && target.setAttribute("transform", t1);
          }
        }
    
        if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
          if (invertedScaleX) {
            scaleX *= -1;
            skewX += rotation <= 0 ? 180 : -180;
            rotation += rotation <= 0 ? 180 : -180;
          } else {
            scaleY *= -1;
            skewX += skewX <= 0 ? 180 : -180;
          }
        }
    
        cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px;
        cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px;
        cache.z = z + px;
        cache.scaleX = _round(scaleX);
        cache.scaleY = _round(scaleY);
        cache.rotation = _round(rotation) + deg;
        cache.rotationX = _round(rotationX) + deg;
        cache.rotationY = _round(rotationY) + deg;
        cache.skewX = skewX + deg;
        cache.skewY = skewY + deg;
        cache.transformPerspective = perspective + px;
    
        if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
          style[_transformOriginProp] = _firstTwoOnly(origin);
        }
    
        cache.xOffset = cache.yOffset = 0;
        cache.force3D = _config.force3D;
        cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
        cache.uncache = 0;
        return cache;
      },
          _firstTwoOnly = function _firstTwoOnly(value) {
        return (value = value.split(" "))[0] + " " + value[1];
      },
          _addPxTranslate = function _addPxTranslate(target, start, value) {
        var unit = getUnit(start);
        return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
      },
          _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
        cache.z = "0px";
        cache.rotationY = cache.rotationX = "0deg";
        cache.force3D = 0;
    
        _renderCSSTransforms(ratio, cache);
      },
          _zeroDeg = "0deg",
          _zeroPx = "0px",
          _endParenthesis = ") ",
          _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
        var _ref = cache || this,
            xPercent = _ref.xPercent,
            yPercent = _ref.yPercent,
            x = _ref.x,
            y = _ref.y,
            z = _ref.z,
            rotation = _ref.rotation,
            rotationY = _ref.rotationY,
            rotationX = _ref.rotationX,
            skewX = _ref.skewX,
            skewY = _ref.skewY,
            scaleX = _ref.scaleX,
            scaleY = _ref.scaleY,
            transformPerspective = _ref.transformPerspective,
            force3D = _ref.force3D,
            target = _ref.target,
            zOrigin = _ref.zOrigin,
            transforms = "",
            use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
    
        if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
          var angle = parseFloat(rotationY) * _DEG2RAD,
              a13 = Math.sin(angle),
              a33 = Math.cos(angle),
              cos;
    
          angle = parseFloat(rotationX) * _DEG2RAD;
          cos = Math.cos(angle);
          x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
          y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
          z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
        }
    
        if (transformPerspective !== _zeroPx) {
          transforms += "perspective(" + transformPerspective + _endParenthesis;
        }
    
        if (xPercent || yPercent) {
          transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
        }
    
        if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
          transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
        }
    
        if (rotation !== _zeroDeg) {
          transforms += "rotate(" + rotation + _endParenthesis;
        }
    
        if (rotationY !== _zeroDeg) {
          transforms += "rotateY(" + rotationY + _endParenthesis;
        }
    
        if (rotationX !== _zeroDeg) {
          transforms += "rotateX(" + rotationX + _endParenthesis;
        }
    
        if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
          transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
        }
    
        if (scaleX !== 1 || scaleY !== 1) {
          transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
        }
    
        target.style[_transformProp] = transforms || "translate(0, 0)";
      },
          _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
        var _ref2 = cache || this,
            xPercent = _ref2.xPercent,
            yPercent = _ref2.yPercent,
            x = _ref2.x,
            y = _ref2.y,
            rotation = _ref2.rotation,
            skewX = _ref2.skewX,
            skewY = _ref2.skewY,
            scaleX = _ref2.scaleX,
            scaleY = _ref2.scaleY,
            target = _ref2.target,
            xOrigin = _ref2.xOrigin,
            yOrigin = _ref2.yOrigin,
            xOffset = _ref2.xOffset,
            yOffset = _ref2.yOffset,
            forceCSS = _ref2.forceCSS,
            tx = parseFloat(x),
            ty = parseFloat(y),
            a11,
            a21,
            a12,
            a22,
            temp;
    
        rotation = parseFloat(rotation);
        skewX = parseFloat(skewX);
        skewY = parseFloat(skewY);
    
        if (skewY) {
          skewY = parseFloat(skewY);
          skewX += skewY;
          rotation += skewY;
        }
    
        if (rotation || skewX) {
          rotation *= _DEG2RAD;
          skewX *= _DEG2RAD;
          a11 = Math.cos(rotation) * scaleX;
          a21 = Math.sin(rotation) * scaleX;
          a12 = Math.sin(rotation - skewX) * -scaleY;
          a22 = Math.cos(rotation - skewX) * scaleY;
    
          if (skewX) {
            skewY *= _DEG2RAD;
            temp = Math.tan(skewX - skewY);
            temp = Math.sqrt(1 + temp * temp);
            a12 *= temp;
            a22 *= temp;
    
            if (skewY) {
              temp = Math.tan(skewY);
              temp = Math.sqrt(1 + temp * temp);
              a11 *= temp;
              a21 *= temp;
            }
          }
    
          a11 = _round(a11);
          a21 = _round(a21);
          a12 = _round(a12);
          a22 = _round(a22);
        } else {
          a11 = scaleX;
          a22 = scaleY;
          a21 = a12 = 0;
        }
    
        if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
          tx = _convertToUnit(target, "x", x, "px");
          ty = _convertToUnit(target, "y", y, "px");
        }
    
        if (xOrigin || yOrigin || xOffset || yOffset) {
          tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
          ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
        }
    
        if (xPercent || yPercent) {
          temp = target.getBBox();
          tx = _round(tx + xPercent / 100 * temp.width);
          ty = _round(ty + yPercent / 100 * temp.height);
        }
    
        temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
        target.setAttribute("transform", temp);
    
        if (forceCSS) {
          target.style[_transformProp] = temp;
        }
      },
          _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
        var cap = 360,
            isString = _isString(endValue),
            endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
            change = relative ? endNum * relative : endNum - startNum,
            finalValue = startNum + change + "deg",
            direction,
            pt;
    
        if (isString) {
          direction = endValue.split("_")[1];
    
          if (direction === "short") {
            change %= cap;
    
            if (change !== change % (cap / 2)) {
              change += change < 0 ? cap : -cap;
            }
          }
    
          if (direction === "cw" && change < 0) {
            change = (change + cap * _bigNum$1) % cap - ~~(change / cap) * cap;
          } else if (direction === "ccw" && change > 0) {
            change = (change - cap * _bigNum$1) % cap - ~~(change / cap) * cap;
          }
        }
    
        plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
        pt.e = finalValue;
        pt.u = "deg";
    
        plugin._props.push(property);
    
        return pt;
      },
          _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
        var style = _tempDivStyler.style,
            startCache = target._gsap,
            exclude = "perspective,force3D,transformOrigin,svgOrigin",
            endCache,
            p,
            startValue,
            endValue,
            startNum,
            endNum,
            startUnit,
            endUnit;
        style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;";
        style[_transformProp] = transforms;
    
        _doc$1.body.appendChild(_tempDivStyler);
    
        endCache = _parseTransform(_tempDivStyler, 1);
    
        for (p in _transformProps) {
          startValue = startCache[p];
          endValue = endCache[p];
    
          if (startValue !== endValue && exclude.indexOf(p) < 0) {
            startUnit = getUnit(startValue);
            endUnit = getUnit(endValue);
            startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
            endNum = parseFloat(endValue);
            plugin._pt = new PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
            plugin._pt.u = endUnit || 0;
    
            plugin._props.push(p);
          }
        }
    
        _doc$1.body.removeChild(_tempDivStyler);
      };
    
      _forEachName("padding,margin,Width,Radius", function (name, index) {
        var t = "Top",
            r = "Right",
            b = "Bottom",
            l = "Left",
            props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
          return index < 2 ? name + side : "border" + side + name;
        });
    
        _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
          var a, vars;
    
          if (arguments.length < 4) {
            a = props.map(function (prop) {
              return _get(plugin, prop, property);
            });
            vars = a.join(" ");
            return vars.split(a[0]).length === 5 ? a[0] : vars;
          }
    
          a = (endValue + "").split(" ");
          vars = {};
          props.forEach(function (prop, i) {
            return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
          });
          plugin.init(target, vars, tween);
        };
      });
    
      var CSSPlugin = {
        name: "css",
        register: _initCore,
        targetTest: function targetTest(target) {
          return target.style && target.nodeType;
        },
        init: function init(target, vars, tween, index, targets) {
          var props = this._props,
              style = target.style,
              startValue,
              endValue,
              endNum,
              startNum,
              type,
              specialProp,
              p,
              startUnit,
              endUnit,
              relative,
              isTransformRelated,
              transformPropTween,
              cache,
              smooth,
              hasPriority;
    
          if (!_pluginInitted) {
            _initCore();
          }
    
          for (p in vars) {
            if (p === "autoRound") {
              continue;
            }
    
            endValue = vars[p];
    
            if (_plugins[p] && _checkPlugin(p, vars, tween, index, target, targets)) {
              continue;
            }
    
            type = typeof endValue;
            specialProp = _specialProps[p];
    
            if (type === "function") {
              endValue = endValue.call(tween, index, target, targets);
              type = typeof endValue;
            }
    
            if (type === "string" && ~endValue.indexOf("random(")) {
              endValue = _replaceRandom(endValue);
            }
    
            if (specialProp) {
              if (specialProp(this, target, p, endValue, tween)) {
                hasPriority = 1;
              }
            } else if (p.substr(0, 2) === "--") {
              this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p);
            } else {
              startValue = _get(target, p);
              startNum = parseFloat(startValue);
              relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;
    
              if (relative) {
                endValue = endValue.substr(2);
              }
    
              endNum = parseFloat(endValue);
    
              if (p in _propertyAliases) {
                if (p === "autoAlpha") {
                  if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
                    startNum = 0;
                  }
    
                  _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
                }
    
                if (p !== "scale" && p !== "transform") {
                  p = _propertyAliases[p];
    
                  if (~p.indexOf(",")) {
                    p = p.split(",")[0];
                  }
                }
              }
    
              isTransformRelated = p in _transformProps;
    
              if (isTransformRelated) {
                if (!transformPropTween) {
                  cache = target._gsap;
                  cache.renderTransform || _parseTransform(target);
                  smooth = vars.smoothOrigin !== false && cache.smooth;
                  transformPropTween = this._pt = new PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1);
                  transformPropTween.dep = 1;
                }
    
                if (p === "scale") {
                  this._pt = new PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
                  props.push("scaleY", p);
                  p += "X";
                } else if (p === "transformOrigin") {
                  endValue = _convertKeywordsToPercentages(endValue);
    
                  if (cache.svg) {
                    _applySVGOrigin(target, endValue, 0, smooth, 0, this);
                  } else {
                    endUnit = parseFloat(endValue.split(" ")[2]) || 0;
    
                    if (endUnit !== cache.zOrigin) {
                      _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
                    }
    
                    _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
                  }
    
                  continue;
                } else if (p === "svgOrigin") {
                  _applySVGOrigin(target, endValue, 1, smooth, 0, this);
    
                  continue;
                } else if (p in _rotationalProperties) {
                  _addRotationalPropTween(this, cache, p, startNum, endValue, relative);
    
                  continue;
                } else if (p === "smoothOrigin") {
                  _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);
    
                  continue;
                } else if (p === "force3D") {
                  cache[p] = endValue;
                  continue;
                } else if (p === "transform") {
                  _addRawTransformPTs(this, endValue, target);
    
                  continue;
                }
              } else if (!(p in style)) {
                p = _checkPropPrefix(p) || p;
              }
    
              if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
                startUnit = (startValue + "").substr((startNum + "").length);
                endNum || (endNum = 0);
                endUnit = (endValue + "").substr((endNum + "").length) || (p in _config.units ? _config.units[p] : startUnit);
    
                if (startUnit !== endUnit) {
                  startNum = _convertToUnit(target, p, startValue, endUnit);
                }
    
                this._pt = new PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === "px" && vars.autoRound !== false && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp);
                this._pt.u = endUnit || 0;
    
                if (startUnit !== endUnit) {
                  this._pt.b = startValue;
                  this._pt.r = _renderCSSPropWithBeginning;
                }
              } else if (!(p in style)) {
                if (p in target) {
                  this.add(target, p, target[p], endValue, index, targets);
                } else {
                  _missingPlugin(p, endValue);
    
                  continue;
                }
              } else {
                _tweenComplexCSSString.call(this, target, p, startValue, endValue);
              }
    
              props.push(p);
            }
          }
    
          if (hasPriority) {
            _sortPropTweensByPriority(this);
          }
        },
        get: _get,
        aliases: _propertyAliases,
        getSetter: function getSetter(target, property, plugin) {
          var p = _propertyAliases[property];
          p && p.indexOf(",") < 0 && (property = p);
          return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
        },
        core: {
          _removeProperty: _removeProperty,
          _getMatrix: _getMatrix
        }
      };
      gsap.utils.checkPrefix = _checkPropPrefix;
    
      (function (positionAndScale, rotation, others, aliases) {
        var all = _forEachName(positionAndScale + "," + rotation + "," + others, function (name) {
          _transformProps[name] = 1;
        });
    
        _forEachName(rotation, function (name) {
          _config.units[name] = "deg";
          _rotationalProperties[name] = 1;
        });
    
        _propertyAliases[all[13]] = positionAndScale + "," + rotation;
    
        _forEachName(aliases, function (name) {
          var split = name.split(":");
          _propertyAliases[split[1]] = all[split[0]];
        });
      })("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
    
      _forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
        _config.units[name] = "px";
      });
    
      gsap.registerPlugin(CSSPlugin);
    
      var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap,
          TweenMaxWithCSS = gsapWithCSS.core.Tween;
    
      exports.Back = Back;
      exports.Bounce = Bounce;
      exports.CSSPlugin = CSSPlugin;
      exports.Circ = Circ;
      exports.Cubic = Cubic;
      exports.Elastic = Elastic;
      exports.Expo = Expo;
      exports.Linear = Linear;
      exports.Power0 = Power0;
      exports.Power1 = Power1;
      exports.Power2 = Power2;
      exports.Power3 = Power3;
      exports.Power4 = Power4;
      exports.Quad = Quad;
      exports.Quart = Quart;
      exports.Quint = Quint;
      exports.Sine = Sine;
      exports.SteppedEase = SteppedEase;
      exports.Strong = Strong;
      exports.TimelineLite = Timeline;
      exports.TimelineMax = Timeline;
      exports.TweenLite = Tween;
      exports.TweenMax = TweenMaxWithCSS;
      exports.default = gsapWithCSS;
      exports.gsap = gsapWithCSS;
    
      if (typeof(window) === 'undefined' || window !== exports) {Object.defineProperty(exports, '__esModule', { value: true });} else {delete window.default;}
    
    })));
    
    },{}],2:[function(require,module,exports){
    /**
     * Copyright 2016 Google Inc. All Rights Reserved.
     *
     * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
     *
     *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
     *
     */
    
    (function(window, document) {
    'use strict';
    
    
    // Exits early if all IntersectionObserver and IntersectionObserverEntry
    // features are natively supported.
    if ('IntersectionObserver' in window &&
        'IntersectionObserverEntry' in window &&
        'intersectionRatio' in window.IntersectionObserverEntry.prototype) {
    
      // Minimal polyfill for Edge 15's lack of `isIntersecting`
      // See: https://github.com/w3c/IntersectionObserver/issues/211
      if (!('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
        Object.defineProperty(window.IntersectionObserverEntry.prototype,
          'isIntersecting', {
          get: function () {
            return this.intersectionRatio > 0;
          }
        });
      }
      return;
    }
    
    
    /**
     * An IntersectionObserver registry. This registry exists to hold a strong
     * reference to IntersectionObserver instances currently observing a target
     * element. Without this registry, instances without another reference may be
     * garbage collected.
     */
    var registry = [];
    
    
    /**
     * Creates the global IntersectionObserverEntry constructor.
     * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
     * @param {Object} entry A dictionary of instance properties.
     * @constructor
     */
    function IntersectionObserverEntry(entry) {
      this.time = entry.time;
      this.target = entry.target;
      this.rootBounds = entry.rootBounds;
      this.boundingClientRect = entry.boundingClientRect;
      this.intersectionRect = entry.intersectionRect || getEmptyRect();
      this.isIntersecting = !!entry.intersectionRect;
    
      // Calculates the intersection ratio.
      var targetRect = this.boundingClientRect;
      var targetArea = targetRect.width * targetRect.height;
      var intersectionRect = this.intersectionRect;
      var intersectionArea = intersectionRect.width * intersectionRect.height;
    
      // Sets intersection ratio.
      if (targetArea) {
        // Round the intersection ratio to avoid floating point math issues:
        // https://github.com/w3c/IntersectionObserver/issues/324
        this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4));
      } else {
        // If area is zero and is intersecting, sets to 1, otherwise to 0
        this.intersectionRatio = this.isIntersecting ? 1 : 0;
      }
    }
    
    
    /**
     * Creates the global IntersectionObserver constructor.
     * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
     * @param {Function} callback The function to be invoked after intersection
     *     changes have queued. The function is not invoked if the queue has
     *     been emptied by calling the `takeRecords` method.
     * @param {Object=} opt_options Optional configuration options.
     * @constructor
     */
    function IntersectionObserver(callback, opt_options) {
    
      var options = opt_options || {};
    
      if (typeof callback != 'function') {
        throw new Error('callback must be a function');
      }
    
      if (options.root && options.root.nodeType != 1) {
        throw new Error('root must be an Element');
      }
    
      // Binds and throttles `this._checkForIntersections`.
      this._checkForIntersections = throttle(
          this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT);
    
      // Private properties.
      this._callback = callback;
      this._observationTargets = [];
      this._queuedEntries = [];
      this._rootMarginValues = this._parseRootMargin(options.rootMargin);
    
      // Public properties.
      this.thresholds = this._initThresholds(options.threshold);
      this.root = options.root || null;
      this.rootMargin = this._rootMarginValues.map(function(margin) {
        return margin.value + margin.unit;
      }).join(' ');
    }
    
    
    /**
     * The minimum interval within which the document will be checked for
     * intersection changes.
     */
    IntersectionObserver.prototype.THROTTLE_TIMEOUT = 100;
    
    
    /**
     * The frequency in which the polyfill polls for intersection changes.
     * this can be updated on a per instance basis and must be set prior to
     * calling `observe` on the first target.
     */
    IntersectionObserver.prototype.POLL_INTERVAL = null;
    
    /**
     * Use a mutation observer on the root element
     * to detect intersection changes.
     */
    IntersectionObserver.prototype.USE_MUTATION_OBSERVER = true;
    
    
    /**
     * Starts observing a target element for intersection changes based on
     * the thresholds values.
     * @param {Element} target The DOM element to observe.
     */
    IntersectionObserver.prototype.observe = function(target) {
      var isTargetAlreadyObserved = this._observationTargets.some(function(item) {
        return item.element == target;
      });
    
      if (isTargetAlreadyObserved) {
        return;
      }
    
      if (!(target && target.nodeType == 1)) {
        throw new Error('target must be an Element');
      }
    
      this._registerInstance();
      this._observationTargets.push({element: target, entry: null});
      this._monitorIntersections();
      this._checkForIntersections();
    };
    
    
    /**
     * Stops observing a target element for intersection changes.
     * @param {Element} target The DOM element to observe.
     */
    IntersectionObserver.prototype.unobserve = function(target) {
      this._observationTargets =
          this._observationTargets.filter(function(item) {
    
        return item.element != target;
      });
      if (!this._observationTargets.length) {
        this._unmonitorIntersections();
        this._unregisterInstance();
      }
    };
    
    
    /**
     * Stops observing all target elements for intersection changes.
     */
    IntersectionObserver.prototype.disconnect = function() {
      this._observationTargets = [];
      this._unmonitorIntersections();
      this._unregisterInstance();
    };
    
    
    /**
     * Returns any queue entries that have not yet been reported to the
     * callback and clears the queue. This can be used in conjunction with the
     * callback to obtain the absolute most up-to-date intersection information.
     * @return {Array} The currently queued entries.
     */
    IntersectionObserver.prototype.takeRecords = function() {
      var records = this._queuedEntries.slice();
      this._queuedEntries = [];
      return records;
    };
    
    
    /**
     * Accepts the threshold value from the user configuration object and
     * returns a sorted array of unique threshold values. If a value is not
     * between 0 and 1 and error is thrown.
     * @private
     * @param {Array|number=} opt_threshold An optional threshold value or
     *     a list of threshold values, defaulting to [0].
     * @return {Array} A sorted list of unique and valid threshold values.
     */
    IntersectionObserver.prototype._initThresholds = function(opt_threshold) {
      var threshold = opt_threshold || [0];
      if (!Array.isArray(threshold)) threshold = [threshold];
    
      return threshold.sort().filter(function(t, i, a) {
        if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
          throw new Error('threshold must be a number between 0 and 1 inclusively');
        }
        return t !== a[i - 1];
      });
    };
    
    
    /**
     * Accepts the rootMargin value from the user configuration object
     * and returns an array of the four margin values as an object containing
     * the value and unit properties. If any of the values are not properly
     * formatted or use a unit other than px or %, and error is thrown.
     * @private
     * @param {string=} opt_rootMargin An optional rootMargin value,
     *     defaulting to '0px'.
     * @return {Array<Object>} An array of margin objects with the keys
     *     value and unit.
     */
    IntersectionObserver.prototype._parseRootMargin = function(opt_rootMargin) {
      var marginString = opt_rootMargin || '0px';
      var margins = marginString.split(/\s+/).map(function(margin) {
        var parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin);
        if (!parts) {
          throw new Error('rootMargin must be specified in pixels or percent');
        }
        return {value: parseFloat(parts[1]), unit: parts[2]};
      });
    
      // Handles shorthand.
      margins[1] = margins[1] || margins[0];
      margins[2] = margins[2] || margins[0];
      margins[3] = margins[3] || margins[1];
    
      return margins;
    };
    
    
    /**
     * Starts polling for intersection changes if the polling is not already
     * happening, and if the page's visibility state is visible.
     * @private
     */
    IntersectionObserver.prototype._monitorIntersections = function() {
      if (!this._monitoringIntersections) {
        this._monitoringIntersections = true;
    
        // If a poll interval is set, use polling instead of listening to
        // resize and scroll events or DOM mutations.
        if (this.POLL_INTERVAL) {
          this._monitoringInterval = setInterval(
              this._checkForIntersections, this.POLL_INTERVAL);
        }
        else {
          addEvent(window, 'resize', this._checkForIntersections, true);
          addEvent(document, 'scroll', this._checkForIntersections, true);
    
          if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in window) {
            this._domObserver = new MutationObserver(this._checkForIntersections);
            this._domObserver.observe(document, {
              attributes: true,
              childList: true,
              characterData: true,
              subtree: true
            });
          }
        }
      }
    };
    
    
    /**
     * Stops polling for intersection changes.
     * @private
     */
    IntersectionObserver.prototype._unmonitorIntersections = function() {
      if (this._monitoringIntersections) {
        this._monitoringIntersections = false;
    
        clearInterval(this._monitoringInterval);
        this._monitoringInterval = null;
    
        removeEvent(window, 'resize', this._checkForIntersections, true);
        removeEvent(document, 'scroll', this._checkForIntersections, true);
    
        if (this._domObserver) {
          this._domObserver.disconnect();
          this._domObserver = null;
        }
      }
    };
    
    
    /**
     * Scans each observation target for intersection changes and adds them
     * to the internal entries queue. If new entries are found, it
     * schedules the callback to be invoked.
     * @private
     */
    IntersectionObserver.prototype._checkForIntersections = function() {
      var rootIsInDom = this._rootIsInDom();
      var rootRect = rootIsInDom ? this._getRootRect() : getEmptyRect();
    
      this._observationTargets.forEach(function(item) {
        var target = item.element;
        var targetRect = getBoundingClientRect(target);
        var rootContainsTarget = this._rootContainsTarget(target);
        var oldEntry = item.entry;
        var intersectionRect = rootIsInDom && rootContainsTarget &&
            this._computeTargetAndRootIntersection(target, rootRect);
    
        var newEntry = item.entry = new IntersectionObserverEntry({
          time: now(),
          target: target,
          boundingClientRect: targetRect,
          rootBounds: rootRect,
          intersectionRect: intersectionRect
        });
    
        if (!oldEntry) {
          this._queuedEntries.push(newEntry);
        } else if (rootIsInDom && rootContainsTarget) {
          // If the new entry intersection ratio has crossed any of the
          // thresholds, add a new entry.
          if (this._hasCrossedThreshold(oldEntry, newEntry)) {
            this._queuedEntries.push(newEntry);
          }
        } else {
          // If the root is not in the DOM or target is not contained within
          // root but the previous entry for this target had an intersection,
          // add a new record indicating removal.
          if (oldEntry && oldEntry.isIntersecting) {
            this._queuedEntries.push(newEntry);
          }
        }
      }, this);
    
      if (this._queuedEntries.length) {
        this._callback(this.takeRecords(), this);
      }
    };
    
    
    /**
     * Accepts a target and root rect computes the intersection between then
     * following the algorithm in the spec.
     * TODO(philipwalton): at this time clip-path is not considered.
     * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
     * @param {Element} target The target DOM element
     * @param {Object} rootRect The bounding rect of the root after being
     *     expanded by the rootMargin value.
     * @return {?Object} The final intersection rect object or undefined if no
     *     intersection is found.
     * @private
     */
    IntersectionObserver.prototype._computeTargetAndRootIntersection =
        function(target, rootRect) {
    
      // If the element isn't displayed, an intersection can't happen.
      if (window.getComputedStyle(target).display == 'none') return;
    
      var targetRect = getBoundingClientRect(target);
      var intersectionRect = targetRect;
      var parent = getParentNode(target);
      var atRoot = false;
    
      while (!atRoot) {
        var parentRect = null;
        var parentComputedStyle = parent.nodeType == 1 ?
            window.getComputedStyle(parent) : {};
    
        // If the parent isn't displayed, an intersection can't happen.
        if (parentComputedStyle.display == 'none') return;
    
        if (parent == this.root || parent == document) {
          atRoot = true;
          parentRect = rootRect;
        } else {
          // If the element has a non-visible overflow, and it's not the <body>
          // or <html> element, update the intersection rect.
          // Note: <body> and <html> cannot be clipped to a rect that's not also
          // the document rect, so no need to compute a new intersection.
          if (parent != document.body &&
              parent != document.documentElement &&
              parentComputedStyle.overflow != 'visible') {
            parentRect = getBoundingClientRect(parent);
          }
        }
    
        // If either of the above conditionals set a new parentRect,
        // calculate new intersection data.
        if (parentRect) {
          intersectionRect = computeRectIntersection(parentRect, intersectionRect);
    
          if (!intersectionRect) break;
        }
        parent = getParentNode(parent);
      }
      return intersectionRect;
    };
    
    
    /**
     * Returns the root rect after being expanded by the rootMargin value.
     * @return {Object} The expanded root rect.
     * @private
     */
    IntersectionObserver.prototype._getRootRect = function() {
      var rootRect;
      if (this.root) {
        rootRect = getBoundingClientRect(this.root);
      } else {
        // Use <html>/<body> instead of window since scroll bars affect size.
        var html = document.documentElement;
        var body = document.body;
        rootRect = {
          top: 0,
          left: 0,
          right: html.clientWidth || body.clientWidth,
          width: html.clientWidth || body.clientWidth,
          bottom: html.clientHeight || body.clientHeight,
          height: html.clientHeight || body.clientHeight
        };
      }
      return this._expandRectByRootMargin(rootRect);
    };
    
    
    /**
     * Accepts a rect and expands it by the rootMargin value.
     * @param {Object} rect The rect object to expand.
     * @return {Object} The expanded rect.
     * @private
     */
    IntersectionObserver.prototype._expandRectByRootMargin = function(rect) {
      var margins = this._rootMarginValues.map(function(margin, i) {
        return margin.unit == 'px' ? margin.value :
            margin.value * (i % 2 ? rect.width : rect.height) / 100;
      });
      var newRect = {
        top: rect.top - margins[0],
        right: rect.right + margins[1],
        bottom: rect.bottom + margins[2],
        left: rect.left - margins[3]
      };
      newRect.width = newRect.right - newRect.left;
      newRect.height = newRect.bottom - newRect.top;
    
      return newRect;
    };
    
    
    /**
     * Accepts an old and new entry and returns true if at least one of the
     * threshold values has been crossed.
     * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
     *    particular target element or null if no previous entry exists.
     * @param {IntersectionObserverEntry} newEntry The current entry for a
     *    particular target element.
     * @return {boolean} Returns true if a any threshold has been crossed.
     * @private
     */
    IntersectionObserver.prototype._hasCrossedThreshold =
        function(oldEntry, newEntry) {
    
      // To make comparing easier, an entry that has a ratio of 0
      // but does not actually intersect is given a value of -1
      var oldRatio = oldEntry && oldEntry.isIntersecting ?
          oldEntry.intersectionRatio || 0 : -1;
      var newRatio = newEntry.isIntersecting ?
          newEntry.intersectionRatio || 0 : -1;
    
      // Ignore unchanged ratios
      if (oldRatio === newRatio) return;
    
      for (var i = 0; i < this.thresholds.length; i++) {
        var threshold = this.thresholds[i];
    
        // Return true if an entry matches a threshold or if the new ratio
        // and the old ratio are on the opposite sides of a threshold.
        if (threshold == oldRatio || threshold == newRatio ||
            threshold < oldRatio !== threshold < newRatio) {
          return true;
        }
      }
    };
    
    
    /**
     * Returns whether or not the root element is an element and is in the DOM.
     * @return {boolean} True if the root element is an element and is in the DOM.
     * @private
     */
    IntersectionObserver.prototype._rootIsInDom = function() {
      return !this.root || containsDeep(document, this.root);
    };
    
    
    /**
     * Returns whether or not the target element is a child of root.
     * @param {Element} target The target element to check.
     * @return {boolean} True if the target element is a child of root.
     * @private
     */
    IntersectionObserver.prototype._rootContainsTarget = function(target) {
      return containsDeep(this.root || document, target);
    };
    
    
    /**
     * Adds the instance to the global IntersectionObserver registry if it isn't
     * already present.
     * @private
     */
    IntersectionObserver.prototype._registerInstance = function() {
      if (registry.indexOf(this) < 0) {
        registry.push(this);
      }
    };
    
    
    /**
     * Removes the instance from the global IntersectionObserver registry.
     * @private
     */
    IntersectionObserver.prototype._unregisterInstance = function() {
      var index = registry.indexOf(this);
      if (index != -1) registry.splice(index, 1);
    };
    
    
    /**
     * Returns the result of the performance.now() method or null in browsers
     * that don't support the API.
     * @return {number} The elapsed time since the page was requested.
     */
    function now() {
      return window.performance && performance.now && performance.now();
    }
    
    
    /**
     * Throttles a function and delays its execution, so it's only called at most
     * once within a given time period.
     * @param {Function} fn The function to throttle.
     * @param {number} timeout The amount of time that must pass before the
     *     function can be called again.
     * @return {Function} The throttled function.
     */
    function throttle(fn, timeout) {
      var timer = null;
      return function () {
        if (!timer) {
          timer = setTimeout(function() {
            fn();
            timer = null;
          }, timeout);
        }
      };
    }
    
    
    /**
     * Adds an event handler to a DOM node ensuring cross-browser compatibility.
     * @param {Node} node The DOM node to add the event handler to.
     * @param {string} event The event name.
     * @param {Function} fn The event handler to add.
     * @param {boolean} opt_useCapture Optionally adds the even to the capture
     *     phase. Note: this only works in modern browsers.
     */
    function addEvent(node, event, fn, opt_useCapture) {
      if (typeof node.addEventListener == 'function') {
        node.addEventListener(event, fn, opt_useCapture || false);
      }
      else if (typeof node.attachEvent == 'function') {
        node.attachEvent('on' + event, fn);
      }
    }
    
    
    /**
     * Removes a previously added event handler from a DOM node.
     * @param {Node} node The DOM node to remove the event handler from.
     * @param {string} event The event name.
     * @param {Function} fn The event handler to remove.
     * @param {boolean} opt_useCapture If the event handler was added with this
     *     flag set to true, it should be set to true here in order to remove it.
     */
    function removeEvent(node, event, fn, opt_useCapture) {
      if (typeof node.removeEventListener == 'function') {
        node.removeEventListener(event, fn, opt_useCapture || false);
      }
      else if (typeof node.detatchEvent == 'function') {
        node.detatchEvent('on' + event, fn);
      }
    }
    
    
    /**
     * Returns the intersection between two rect objects.
     * @param {Object} rect1 The first rect.
     * @param {Object} rect2 The second rect.
     * @return {?Object} The intersection rect or undefined if no intersection
     *     is found.
     */
    function computeRectIntersection(rect1, rect2) {
      var top = Math.max(rect1.top, rect2.top);
      var bottom = Math.min(rect1.bottom, rect2.bottom);
      var left = Math.max(rect1.left, rect2.left);
      var right = Math.min(rect1.right, rect2.right);
      var width = right - left;
      var height = bottom - top;
    
      return (width >= 0 && height >= 0) && {
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        width: width,
        height: height
      };
    }
    
    
    /**
     * Shims the native getBoundingClientRect for compatibility with older IE.
     * @param {Element} el The element whose bounding rect to get.
     * @return {Object} The (possibly shimmed) rect of the element.
     */
    function getBoundingClientRect(el) {
      var rect;
    
      try {
        rect = el.getBoundingClientRect();
      } catch (err) {
        // Ignore Windows 7 IE11 "Unspecified error"
        // https://github.com/w3c/IntersectionObserver/pull/205
      }
    
      if (!rect) return getEmptyRect();
    
      // Older IE
      if (!(rect.width && rect.height)) {
        rect = {
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          left: rect.left,
          width: rect.right - rect.left,
          height: rect.bottom - rect.top
        };
      }
      return rect;
    }
    
    
    /**
     * Returns an empty rect object. An empty rect is returned when an element
     * is not in the DOM.
     * @return {Object} The empty rect.
     */
    function getEmptyRect() {
      return {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        width: 0,
        height: 0
      };
    }
    
    /**
     * Checks to see if a parent element contains a child element (including inside
     * shadow DOM).
     * @param {Node} parent The parent element.
     * @param {Node} child The child element.
     * @return {boolean} True if the parent node contains the child node.
     */
    function containsDeep(parent, child) {
      var node = child;
      while (node) {
        if (node == parent) return true;
    
        node = getParentNode(node);
      }
      return false;
    }
    
    
    /**
     * Gets the parent node of an element or its host element if the parent node
     * is a shadow root.
     * @param {Node} node The node whose parent to get.
     * @return {Node|null} The parent node or null if no parent exists.
     */
    function getParentNode(node) {
      var parent = node.parentNode;
    
      if (parent && parent.nodeType == 11 && parent.host) {
        // If the parent is a shadow root, return the host element.
        return parent.host;
      }
      return parent;
    }
    
    
    // Exposes the constructors globally.
    window.IntersectionObserver = IntersectionObserver;
    window.IntersectionObserverEntry = IntersectionObserverEntry;
    
    }(window, document));
    
    },{}],3:[function(require,module,exports){
    !function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.Scrollbar=n():t.Scrollbar=n()}(this,(function(){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(r,o,function(n){return t[n]}.bind(null,o));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=58)}([function(t,n,e){var r=e(25)("wks"),o=e(16),i=e(2).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},function(t,n){var e=t.exports={version:"2.6.9"};"number"==typeof __e&&(__e=e)},function(t,n,e){t.exports=!e(13)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,n,e){var r=e(2),o=e(3),i=e(11),u=e(6),c=e(10),s=function(t,n,e){var a,f,l,p,h=t&s.F,d=t&s.G,v=t&s.S,y=t&s.P,m=t&s.B,g=d?r:v?r[n]||(r[n]={}):(r[n]||{}).prototype,b=d?o:o[n]||(o[n]={}),x=b.prototype||(b.prototype={});for(a in d&&(e=n),e)l=((f=!h&&g&&void 0!==g[a])?g:e)[a],p=m&&f?c(l,r):y&&"function"==typeof l?c(Function.call,l):l,g&&u(g,a,l,t&s.U),b[a]!=l&&i(b,a,p),y&&x[a]!=l&&(x[a]=l)};r.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,t.exports=s},function(t,n,e){var r=e(2),o=e(11),i=e(9),u=e(16)("src"),c=e(60),s=(""+c).split("toString");e(3).inspectSource=function(t){return c.call(t)},(t.exports=function(t,n,e,c){var a="function"==typeof e;a&&(i(e,"name")||o(e,"name",n)),t[n]!==e&&(a&&(i(e,u)||o(e,u,t[n]?""+t[n]:s.join(String(n)))),t===r?t[n]=e:c?t[n]?t[n]=e:o(t,n,e):(delete t[n],o(t,n,e)))})(Function.prototype,"toString",(function(){return"function"==typeof this&&this[u]||c.call(this)}))},function(t,n,e){var r=e(8),o=e(41),i=e(43),u=Object.defineProperty;n.f=e(4)?Object.defineProperty:function(t,n,e){if(r(t),n=i(n,!0),r(e),o)try{return u(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},function(t,n,e){var r=e(1);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},function(t,n,e){var r=e(44);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},function(t,n,e){var r=e(7),o=e(17);t.exports=e(4)?function(t,n,e){return r.f(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},function(t,n,e){var r=e(1);t.exports=function(t,n){if(!r(t)||t._t!==n)throw TypeError("Incompatible receiver, "+n+" required!");return t}},function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,n){t.exports={}},function(t,n,e){var r=e(10),o=e(49),i=e(50),u=e(8),c=e(19),s=e(51),a={},f={};(n=t.exports=function(t,n,e,l,p){var h,d,v,y,m=p?function(){return t}:s(t),g=r(e,l,n?2:1),b=0;if("function"!=typeof m)throw TypeError(t+" is not iterable!");if(i(m)){for(h=c(t.length);h>b;b++)if((y=n?g(u(d=t[b])[0],d[1]):g(t[b]))===a||y===f)return y}else for(v=m.call(t);!(d=v.next()).done;)if((y=o(v,g,d.value,n))===a||y===f)return y}).BREAK=a,n.RETURN=f},function(t,n){var e=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++e+r).toString(36))}},function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},function(t,n,e){var r=e(31),o=e(28);t.exports=function(t){return r(o(t))}},function(t,n,e){var r=e(27),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,n,e){var r=e(28);t.exports=function(t){return Object(r(t))}},function(t,n,e){var r=e(16)("meta"),o=e(1),i=e(9),u=e(7).f,c=0,s=Object.isExtensible||function(){return!0},a=!e(13)((function(){return s(Object.preventExtensions({}))})),f=function(t){u(t,r,{value:{i:"O"+ ++c,w:{}}})},l=t.exports={KEY:r,NEED:!1,fastKey:function(t,n){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){if(!s(t))return"F";if(!n)return"E";f(t)}return t[r].i},getWeak:function(t,n){if(!i(t,r)){if(!s(t))return!0;if(!n)return!1;f(t)}return t[r].w},onFreeze:function(t){return a&&l.NEED&&s(t)&&!i(t,r)&&f(t),t}}},function(t,n,e){"use strict";var r=e(23),o={};o[e(0)("toStringTag")]="z",o+""!="[object z]"&&e(6)(Object.prototype,"toString",(function(){return"[object "+r(this)+"]"}),!0)},function(t,n,e){var r=e(24),o=e(0)("toStringTag"),i="Arguments"==r(function(){return arguments}());t.exports=function(t){var n,e,u;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(e=function(t,n){try{return t[n]}catch(t){}}(n=Object(t),o))?e:i?r(n):"Object"==(u=r(n))&&"function"==typeof n.callee?"Arguments":u}},function(t,n){var e={}.toString;t.exports=function(t){return e.call(t).slice(8,-1)}},function(t,n,e){var r=e(3),o=e(2),i=o["__core-js_shared__"]||(o["__core-js_shared__"]={});(t.exports=function(t,n){return i[t]||(i[t]=void 0!==n?n:{})})("versions",[]).push({version:r.version,mode:e(40)?"pure":"global",copyright:"Â© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,n,e){"use strict";var r=e(61)(!0);e(29)(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,n=this._t,e=this._i;return e>=n.length?{value:void 0,done:!0}:(t=r(n,e),this._i+=t.length,{value:t,done:!1})}))},function(t,n){var e=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:e)(t)}},function(t,n){t.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},function(t,n,e){"use strict";var r=e(40),o=e(5),i=e(6),u=e(11),c=e(14),s=e(62),a=e(33),f=e(68),l=e(0)("iterator"),p=!([].keys&&"next"in[].keys()),h=function(){return this};t.exports=function(t,n,e,d,v,y,m){s(e,n,d);var g,b,x,_=function(t){if(!p&&t in O)return O[t];switch(t){case"keys":case"values":return function(){return new e(this,t)}}return function(){return new e(this,t)}},w=n+" Iterator",E="values"==v,S=!1,O=t.prototype,T=O[l]||O["@@iterator"]||v&&O[v],A=T||_(v),M=v?E?_("entries"):A:void 0,P="Array"==n&&O.entries||T;if(P&&(x=f(P.call(new t)))!==Object.prototype&&x.next&&(a(x,w,!0),r||"function"==typeof x[l]||u(x,l,h)),E&&T&&"values"!==T.name&&(S=!0,A=function(){return T.call(this)}),r&&!m||!p&&!S&&O[l]||u(O,l,A),c[n]=A,c[w]=h,v)if(g={values:E?A:_("values"),keys:y?A:_("keys"),entries:M},m)for(b in g)b in O||i(O,b,g[b]);else o(o.P+o.F*(p||S),n,g);return g}},function(t,n,e){var r=e(64),o=e(46);t.exports=Object.keys||function(t){return r(t,o)}},function(t,n,e){var r=e(24);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,n,e){var r=e(25)("keys"),o=e(16);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,n,e){var r=e(7).f,o=e(9),i=e(0)("toStringTag");t.exports=function(t,n,e){t&&!o(t=e?t:t.prototype,i)&&r(t,i,{configurable:!0,value:n})}},function(t,n,e){for(var r=e(69),o=e(30),i=e(6),u=e(2),c=e(11),s=e(14),a=e(0),f=a("iterator"),l=a("toStringTag"),p=s.Array,h={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},d=o(h),v=0;v<d.length;v++){var y,m=d[v],g=h[m],b=u[m],x=b&&b.prototype;if(x&&(x[f]||c(x,f,p),x[l]||c(x,l,m),s[m]=p,g))for(y in r)x[y]||i(x,y,r[y],!0)}},function(t,n,e){var r=e(6);t.exports=function(t,n,e){for(var o in n)r(t,o,n[o],e);return t}},function(t,n){t.exports=function(t,n,e,r){if(!(t instanceof n)||void 0!==r&&r in t)throw TypeError(e+": incorrect invocation!");return t}},function(t,n,e){"use strict";var r=e(2),o=e(5),i=e(6),u=e(35),c=e(21),s=e(15),a=e(36),f=e(1),l=e(13),p=e(52),h=e(33),d=e(73);t.exports=function(t,n,e,v,y,m){var g=r[t],b=g,x=y?"set":"add",_=b&&b.prototype,w={},E=function(t){var n=_[t];i(_,t,"delete"==t||"has"==t?function(t){return!(m&&!f(t))&&n.call(this,0===t?0:t)}:"get"==t?function(t){return m&&!f(t)?void 0:n.call(this,0===t?0:t)}:"add"==t?function(t){return n.call(this,0===t?0:t),this}:function(t,e){return n.call(this,0===t?0:t,e),this})};if("function"==typeof b&&(m||_.forEach&&!l((function(){(new b).entries().next()})))){var S=new b,O=S[x](m?{}:-0,1)!=S,T=l((function(){S.has(1)})),A=p((function(t){new b(t)})),M=!m&&l((function(){for(var t=new b,n=5;n--;)t[x](n,n);return!t.has(-0)}));A||((b=n((function(n,e){a(n,b,t);var r=d(new g,n,b);return null!=e&&s(e,y,r[x],r),r}))).prototype=_,_.constructor=b),(T||M)&&(E("delete"),E("has"),y&&E("get")),(M||O)&&E(x),m&&_.clear&&delete _.clear}else b=v.getConstructor(n,t,y,x),u(b.prototype,e),c.NEED=!0;return h(b,t),w[t]=b,o(o.G+o.W+o.F*(b!=g),w),m||v.setStrong(b,t,y),b}},function(t,n,e){"use strict";var r=e(5);t.exports=function(t){r(r.S,t,{of:function(){for(var t=arguments.length,n=new Array(t);t--;)n[t]=arguments[t];return new this(n)}})}},function(t,n,e){"use strict";var r=e(5),o=e(44),i=e(10),u=e(15);t.exports=function(t){r(r.S,t,{from:function(t){var n,e,r,c,s=arguments[1];return o(this),(n=void 0!==s)&&o(s),null==t?new this:(e=[],n?(r=0,c=i(s,arguments[2],2),u(t,!1,(function(t){e.push(c(t,r++))}))):u(t,!1,e.push,e),new this(e))}})}},function(t,n){t.exports=!1},function(t,n,e){t.exports=!e(4)&&!e(13)((function(){return 7!=Object.defineProperty(e(42)("div"),"a",{get:function(){return 7}}).a}))},function(t,n,e){var r=e(1),o=e(2).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,n,e){var r=e(1);t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,n,e){var r=e(8),o=e(63),i=e(46),u=e(32)("IE_PROTO"),c=function(){},s=function(){var t,n=e(42)("iframe"),r=i.length;for(n.style.display="none",e(67).appendChild(n),n.src="javascript:",(t=n.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),s=t.F;r--;)delete s.prototype[i[r]];return s()};t.exports=Object.create||function(t,n){var e;return null!==t?(c.prototype=r(t),e=new c,c.prototype=null,e[u]=t):e=s(),void 0===n?e:o(e,n)}},function(t,n){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,n){t.exports=function(t,n){return{value:n,done:!!t}}},function(t,n,e){"use strict";var r=e(7).f,o=e(45),i=e(35),u=e(10),c=e(36),s=e(15),a=e(29),f=e(47),l=e(72),p=e(4),h=e(21).fastKey,d=e(12),v=p?"_s":"size",y=function(t,n){var e,r=h(n);if("F"!==r)return t._i[r];for(e=t._f;e;e=e.n)if(e.k==n)return e};t.exports={getConstructor:function(t,n,e,a){var f=t((function(t,r){c(t,f,n,"_i"),t._t=n,t._i=o(null),t._f=void 0,t._l=void 0,t[v]=0,null!=r&&s(r,e,t[a],t)}));return i(f.prototype,{clear:function(){for(var t=d(this,n),e=t._i,r=t._f;r;r=r.n)r.r=!0,r.p&&(r.p=r.p.n=void 0),delete e[r.i];t._f=t._l=void 0,t[v]=0},delete:function(t){var e=d(this,n),r=y(e,t);if(r){var o=r.n,i=r.p;delete e._i[r.i],r.r=!0,i&&(i.n=o),o&&(o.p=i),e._f==r&&(e._f=o),e._l==r&&(e._l=i),e[v]--}return!!r},forEach:function(t){d(this,n);for(var e,r=u(t,arguments.length>1?arguments[1]:void 0,3);e=e?e.n:this._f;)for(r(e.v,e.k,this);e&&e.r;)e=e.p},has:function(t){return!!y(d(this,n),t)}}),p&&r(f.prototype,"size",{get:function(){return d(this,n)[v]}}),f},def:function(t,n,e){var r,o,i=y(t,n);return i?i.v=e:(t._l=i={i:o=h(n,!0),k:n,v:e,p:r=t._l,n:void 0,r:!1},t._f||(t._f=i),r&&(r.n=i),t[v]++,"F"!==o&&(t._i[o]=i)),t},getEntry:y,setStrong:function(t,n,e){a(t,n,(function(t,e){this._t=d(t,n),this._k=e,this._l=void 0}),(function(){for(var t=this._k,n=this._l;n&&n.r;)n=n.p;return this._t&&(this._l=n=n?n.n:this._t._f)?f(0,"keys"==t?n.k:"values"==t?n.v:[n.k,n.v]):(this._t=void 0,f(1))}),e?"entries":"values",!e,!0),l(n)}}},function(t,n,e){var r=e(8);t.exports=function(t,n,e,o){try{return o?n(r(e)[0],e[1]):n(e)}catch(n){var i=t.return;throw void 0!==i&&r(i.call(t)),n}}},function(t,n,e){var r=e(14),o=e(0)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},function(t,n,e){var r=e(23),o=e(0)("iterator"),i=e(14);t.exports=e(3).getIteratorMethod=function(t){if(null!=t)return t[o]||t["@@iterator"]||i[r(t)]}},function(t,n,e){var r=e(0)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,(function(){throw 2}))}catch(t){}t.exports=function(t,n){if(!n&&!o)return!1;var e=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:e=!0}},i[r]=function(){return u},t(i)}catch(t){}return e}},function(t,n){n.f={}.propertyIsEnumerable},function(t,n,e){var r=e(23),o=e(77);t.exports=function(t){return function(){if(r(this)!=t)throw TypeError(t+"#toJSON isn't generic");return o(this)}}},function(t,n,e){var r=e(10),o=e(31),i=e(20),u=e(19),c=e(87);t.exports=function(t,n){var e=1==t,s=2==t,a=3==t,f=4==t,l=6==t,p=5==t||l,h=n||c;return function(n,c,d){for(var v,y,m=i(n),g=o(m),b=r(c,d,3),x=u(g.length),_=0,w=e?h(n,x):s?h(n,0):void 0;x>_;_++)if((p||_ in g)&&(y=b(v=g[_],_,m),t))if(e)w[_]=y;else if(y)switch(t){case 3:return!0;case 5:return v;case 6:return _;case 2:w.push(v)}else if(f)return!1;return l?-1:a||f?f:w}}},function(t,n,e){"use strict";var r=e(4),o=e(30),i=e(90),u=e(53),c=e(20),s=e(31),a=Object.assign;t.exports=!a||e(13)((function(){var t={},n={},e=Symbol(),r="abcdefghijklmnopqrst";return t[e]=7,r.split("").forEach((function(t){n[t]=t})),7!=a({},t)[e]||Object.keys(a({},n)).join("")!=r}))?function(t,n){for(var e=c(t),a=arguments.length,f=1,l=i.f,p=u.f;a>f;)for(var h,d=s(arguments[f++]),v=l?o(d).concat(l(d)):o(d),y=v.length,m=0;y>m;)h=v[m++],r&&!p.call(d,h)||(e[h]=d[h]);return e}:a},function(t,n,e){"use strict";(function(t){var e="object"==typeof t&&t&&t.Object===Object&&t;n.a=e}).call(this,e(99))},function(t,n,e){t.exports=e(100)},function(t,n,e){e(22),e(26),e(34),e(71),e(76),e(78),e(79),t.exports=e(3).Map},function(t,n,e){t.exports=e(25)("native-function-to-string",Function.toString)},function(t,n,e){var r=e(27),o=e(28);t.exports=function(t){return function(n,e){var i,u,c=String(o(n)),s=r(e),a=c.length;return s<0||s>=a?t?"":void 0:(i=c.charCodeAt(s))<55296||i>56319||s+1===a||(u=c.charCodeAt(s+1))<56320||u>57343?t?c.charAt(s):i:t?c.slice(s,s+2):u-56320+(i-55296<<10)+65536}}},function(t,n,e){"use strict";var r=e(45),o=e(17),i=e(33),u={};e(11)(u,e(0)("iterator"),(function(){return this})),t.exports=function(t,n,e){t.prototype=r(u,{next:o(1,e)}),i(t,n+" Iterator")}},function(t,n,e){var r=e(7),o=e(8),i=e(30);t.exports=e(4)?Object.defineProperties:function(t,n){o(t);for(var e,u=i(n),c=u.length,s=0;c>s;)r.f(t,e=u[s++],n[e]);return t}},function(t,n,e){var r=e(9),o=e(18),i=e(65)(!1),u=e(32)("IE_PROTO");t.exports=function(t,n){var e,c=o(t),s=0,a=[];for(e in c)e!=u&&r(c,e)&&a.push(e);for(;n.length>s;)r(c,e=n[s++])&&(~i(a,e)||a.push(e));return a}},function(t,n,e){var r=e(18),o=e(19),i=e(66);t.exports=function(t){return function(n,e,u){var c,s=r(n),a=o(s.length),f=i(u,a);if(t&&e!=e){for(;a>f;)if((c=s[f++])!=c)return!0}else for(;a>f;f++)if((t||f in s)&&s[f]===e)return t||f||0;return!t&&-1}}},function(t,n,e){var r=e(27),o=Math.max,i=Math.min;t.exports=function(t,n){return(t=r(t))<0?o(t+n,0):i(t,n)}},function(t,n,e){var r=e(2).document;t.exports=r&&r.documentElement},function(t,n,e){var r=e(9),o=e(20),i=e(32)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,n,e){"use strict";var r=e(70),o=e(47),i=e(14),u=e(18);t.exports=e(29)(Array,"Array",(function(t,n){this._t=u(t),this._i=0,this._k=n}),(function(){var t=this._t,n=this._k,e=this._i++;return!t||e>=t.length?(this._t=void 0,o(1)):o(0,"keys"==n?e:"values"==n?t[e]:[e,t[e]])}),"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,n,e){var r=e(0)("unscopables"),o=Array.prototype;null==o[r]&&e(11)(o,r,{}),t.exports=function(t){o[r][t]=!0}},function(t,n,e){"use strict";var r=e(48),o=e(12);t.exports=e(37)("Map",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(t){var n=r.getEntry(o(this,"Map"),t);return n&&n.v},set:function(t,n){return r.def(o(this,"Map"),0===t?0:t,n)}},r,!0)},function(t,n,e){"use strict";var r=e(2),o=e(7),i=e(4),u=e(0)("species");t.exports=function(t){var n=r[t];i&&n&&!n[u]&&o.f(n,u,{configurable:!0,get:function(){return this}})}},function(t,n,e){var r=e(1),o=e(74).set;t.exports=function(t,n,e){var i,u=n.constructor;return u!==e&&"function"==typeof u&&(i=u.prototype)!==e.prototype&&r(i)&&o&&o(t,i),t}},function(t,n,e){var r=e(1),o=e(8),i=function(t,n){if(o(t),!r(n)&&null!==n)throw TypeError(n+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,n,r){try{(r=e(10)(Function.call,e(75).f(Object.prototype,"__proto__").set,2))(t,[]),n=!(t instanceof Array)}catch(t){n=!0}return function(t,e){return i(t,e),n?t.__proto__=e:r(t,e),t}}({},!1):void 0),check:i}},function(t,n,e){var r=e(53),o=e(17),i=e(18),u=e(43),c=e(9),s=e(41),a=Object.getOwnPropertyDescriptor;n.f=e(4)?a:function(t,n){if(t=i(t),n=u(n,!0),s)try{return a(t,n)}catch(t){}if(c(t,n))return o(!r.f.call(t,n),t[n])}},function(t,n,e){var r=e(5);r(r.P+r.R,"Map",{toJSON:e(54)("Map")})},function(t,n,e){var r=e(15);t.exports=function(t,n){var e=[];return r(t,!1,e.push,e,n),e}},function(t,n,e){e(38)("Map")},function(t,n,e){e(39)("Map")},function(t,n,e){e(22),e(26),e(34),e(81),e(82),e(83),e(84),t.exports=e(3).Set},function(t,n,e){"use strict";var r=e(48),o=e(12);t.exports=e(37)("Set",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return r.def(o(this,"Set"),t=0===t?0:t,t)}},r)},function(t,n,e){var r=e(5);r(r.P+r.R,"Set",{toJSON:e(54)("Set")})},function(t,n,e){e(38)("Set")},function(t,n,e){e(39)("Set")},function(t,n,e){e(22),e(34),e(86),e(92),e(93),t.exports=e(3).WeakMap},function(t,n,e){"use strict";var r,o=e(2),i=e(55)(0),u=e(6),c=e(21),s=e(56),a=e(91),f=e(1),l=e(12),p=e(12),h=!o.ActiveXObject&&"ActiveXObject"in o,d=c.getWeak,v=Object.isExtensible,y=a.ufstore,m=function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},g={get:function(t){if(f(t)){var n=d(t);return!0===n?y(l(this,"WeakMap")).get(t):n?n[this._i]:void 0}},set:function(t,n){return a.def(l(this,"WeakMap"),t,n)}},b=t.exports=e(37)("WeakMap",m,g,a,!0,!0);p&&h&&(s((r=a.getConstructor(m,"WeakMap")).prototype,g),c.NEED=!0,i(["delete","has","get","set"],(function(t){var n=b.prototype,e=n[t];u(n,t,(function(n,o){if(f(n)&&!v(n)){this._f||(this._f=new r);var i=this._f[t](n,o);return"set"==t?this:i}return e.call(this,n,o)}))})))},function(t,n,e){var r=e(88);t.exports=function(t,n){return new(r(t))(n)}},function(t,n,e){var r=e(1),o=e(89),i=e(0)("species");t.exports=function(t){var n;return o(t)&&("function"!=typeof(n=t.constructor)||n!==Array&&!o(n.prototype)||(n=void 0),r(n)&&null===(n=n[i])&&(n=void 0)),void 0===n?Array:n}},function(t,n,e){var r=e(24);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,n){n.f=Object.getOwnPropertySymbols},function(t,n,e){"use strict";var r=e(35),o=e(21).getWeak,i=e(8),u=e(1),c=e(36),s=e(15),a=e(55),f=e(9),l=e(12),p=a(5),h=a(6),d=0,v=function(t){return t._l||(t._l=new y)},y=function(){this.a=[]},m=function(t,n){return p(t.a,(function(t){return t[0]===n}))};y.prototype={get:function(t){var n=m(this,t);if(n)return n[1]},has:function(t){return!!m(this,t)},set:function(t,n){var e=m(this,t);e?e[1]=n:this.a.push([t,n])},delete:function(t){var n=h(this.a,(function(n){return n[0]===t}));return~n&&this.a.splice(n,1),!!~n}},t.exports={getConstructor:function(t,n,e,i){var a=t((function(t,r){c(t,a,n,"_i"),t._t=n,t._i=d++,t._l=void 0,null!=r&&s(r,e,t[i],t)}));return r(a.prototype,{delete:function(t){if(!u(t))return!1;var e=o(t);return!0===e?v(l(this,n)).delete(t):e&&f(e,this._i)&&delete e[this._i]},has:function(t){if(!u(t))return!1;var e=o(t);return!0===e?v(l(this,n)).has(t):e&&f(e,this._i)}}),a},def:function(t,n,e){var r=o(i(n),!0);return!0===r?v(t).set(n,e):r[t._i]=e,t},ufstore:v}},function(t,n,e){e(38)("WeakMap")},function(t,n,e){e(39)("WeakMap")},function(t,n,e){e(26),e(95),t.exports=e(3).Array.from},function(t,n,e){"use strict";var r=e(10),o=e(5),i=e(20),u=e(49),c=e(50),s=e(19),a=e(96),f=e(51);o(o.S+o.F*!e(52)((function(t){Array.from(t)})),"Array",{from:function(t){var n,e,o,l,p=i(t),h="function"==typeof this?this:Array,d=arguments.length,v=d>1?arguments[1]:void 0,y=void 0!==v,m=0,g=f(p);if(y&&(v=r(v,d>2?arguments[2]:void 0,2)),null==g||h==Array&&c(g))for(e=new h(n=s(p.length));n>m;m++)a(e,m,y?v(p[m],m):p[m]);else for(l=g.call(p),e=new h;!(o=l.next()).done;m++)a(e,m,y?u(l,v,[o.value,m],!0):o.value);return e.length=m,e}})},function(t,n,e){"use strict";var r=e(7),o=e(17);t.exports=function(t,n,e){n in t?r.f(t,n,o(0,e)):t[n]=e}},function(t,n,e){e(98),t.exports=e(3).Object.assign},function(t,n,e){var r=e(5);r(r.S+r.F,"Object",{assign:e(56)})},function(t,n){var e;e=function(){return this}();try{e=e||new Function("return this")()}catch(t){"object"==typeof window&&(e=window)}t.exports=e},function(t,n,e){"use strict";e.r(n);var r={};e.r(r),e.d(r,"keyboardHandler",(function(){return et})),e.d(r,"mouseHandler",(function(){return rt})),e.d(r,"resizeHandler",(function(){return ot})),e.d(r,"selectHandler",(function(){return it})),e.d(r,"touchHandler",(function(){return ut})),e.d(r,"wheelHandler",(function(){return ct}));
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0
    
    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.
    
    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var o=function(t,n){return(o=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,n){t.__proto__=n}||function(t,n){for(var e in n)n.hasOwnProperty(e)&&(t[e]=n[e])})(t,n)},i=function(){return(i=Object.assign||function(t){for(var n,e=1,r=arguments.length;e<r;e++)for(var o in n=arguments[e])Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o]);return t}).apply(this,arguments)};function u(t,n,e,r){var o,i=arguments.length,u=i<3?n:null===r?r=Object.getOwnPropertyDescriptor(n,e):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)u=Reflect.decorate(t,n,e,r);else for(var c=t.length-1;c>=0;c--)(o=t[c])&&(u=(i<3?o(u):i>3?o(n,e,u):o(n,e))||u);return i>3&&u&&Object.defineProperty(n,e,u),u}e(59),e(80),e(85),e(94),e(97);var c=function(t){var n=typeof t;return null!=t&&("object"==n||"function"==n)},s=e(57),a="object"==typeof self&&self&&self.Object===Object&&self,f=s.a||a||Function("return this")(),l=f.Symbol,p=Object.prototype,h=p.hasOwnProperty,d=p.toString,v=l?l.toStringTag:void 0,y=Object.prototype.toString,m=l?l.toStringTag:void 0,g=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":m&&m in Object(t)?function(t){var n=h.call(t,v),e=t[v];try{t[v]=void 0;var r=!0}catch(t){}var o=d.call(t);return r&&(n?t[v]=e:delete t[v]),o}(t):function(t){return y.call(t)}(t)},b=/^\s+|\s+$/g,x=/^[-+]0x[0-9a-f]+$/i,_=/^0b[01]+$/i,w=/^0o[0-7]+$/i,E=parseInt,S=function(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return null!=t&&"object"==typeof t}(t)&&"[object Symbol]"==g(t)}(t))return NaN;if(c(t)){var n="function"==typeof t.valueOf?t.valueOf():t;t=c(n)?n+"":n}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(b,"");var e=_.test(t);return e||w.test(t)?E(t.slice(2),e?2:8):x.test(t)?NaN:+t},O=function(t,n,e){return void 0===e&&(e=n,n=void 0),void 0!==e&&(e=(e=S(e))==e?e:0),void 0!==n&&(n=(n=S(n))==n?n:0),function(t,n,e){return t==t&&(void 0!==e&&(t=t<=e?t:e),void 0!==n&&(t=t>=n?t:n)),t}(S(t),n,e)};function T(t,n){return void 0===t&&(t=-1/0),void 0===n&&(n=1/0),function(e,r){var o="_"+r;Object.defineProperty(e,r,{get:function(){return this[o]},set:function(e){Object.defineProperty(this,o,{value:O(e,t,n),enumerable:!1,writable:!0,configurable:!0})},enumerable:!0,configurable:!0})}}function A(t,n){var e="_"+n;Object.defineProperty(t,n,{get:function(){return this[e]},set:function(t){Object.defineProperty(this,e,{value:!!t,enumerable:!1,writable:!0,configurable:!0})},enumerable:!0,configurable:!0})}var M=function(){return f.Date.now()},P=Math.max,j=Math.min,k=function(t,n,e){var r,o,i,u,s,a,f=0,l=!1,p=!1,h=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function d(n){var e=r,i=o;return r=o=void 0,f=n,u=t.apply(i,e)}function v(t){var e=t-a;return void 0===a||e>=n||e<0||p&&t-f>=i}function y(){var t=M();if(v(t))return m(t);s=setTimeout(y,function(t){var e=n-(t-a);return p?j(e,i-(t-f)):e}(t))}function m(t){return s=void 0,h&&r?d(t):(r=o=void 0,u)}function g(){var t=M(),e=v(t);if(r=arguments,o=this,a=t,e){if(void 0===s)return function(t){return f=t,s=setTimeout(y,n),l?d(t):u}(a);if(p)return clearTimeout(s),s=setTimeout(y,n),d(a)}return void 0===s&&(s=setTimeout(y,n)),u}return n=S(n)||0,c(e)&&(l=!!e.leading,i=(p="maxWait"in e)?P(S(e.maxWait)||0,n):i,h="trailing"in e?!!e.trailing:h),g.cancel=function(){void 0!==s&&clearTimeout(s),f=0,r=a=o=s=void 0},g.flush=function(){return void 0===s?u:m(M())},g};function D(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return function(n,e,r){var o=r.value;return{get:function(){return this.hasOwnProperty(e)||Object.defineProperty(this,e,{value:k.apply(void 0,function(){for(var t=0,n=0,e=arguments.length;n<e;n++)t+=arguments[n].length;var r=Array(t),o=0;for(n=0;n<e;n++)for(var i=arguments[n],u=0,c=i.length;u<c;u++,o++)r[o]=i[u];return r}([o],t))}),this[e]}}}}var L,N=function(){function t(t){var n=this;void 0===t&&(t={}),this.damping=.1,this.thumbMinSize=20,this.renderByPixels=!0,this.alwaysShowTracks=!1,this.continuousScrolling=!0,this.delegateTo=null,this.plugins={},Object.keys(t).forEach((function(e){n[e]=t[e]}))}return Object.defineProperty(t.prototype,"wheelEventTarget",{get:function(){return this.delegateTo},set:function(t){console.warn("[smooth-scrollbar]: `options.wheelEventTarget` is deprecated and will be removed in the future, use `options.delegateTo` instead."),this.delegateTo=t},enumerable:!0,configurable:!0}),u([T(0,1)],t.prototype,"damping",void 0),u([T(0,1/0)],t.prototype,"thumbMinSize",void 0),u([A],t.prototype,"renderByPixels",void 0),u([A],t.prototype,"alwaysShowTracks",void 0),u([A],t.prototype,"continuousScrolling",void 0),t}(),z=new WeakMap;function C(){if(void 0!==L)return L;var t=!1;try{var n=function(){},e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("testPassive",n,e),window.removeEventListener("testPassive",n,e)}catch(t){}return L=!!t&&{passive:!1}}function R(t){var n=z.get(t)||[];return z.set(t,n),function(t,e,r){function o(t){t.defaultPrevented||r(t)}e.split(/\s+/g).forEach((function(e){n.push({elem:t,eventName:e,handler:o}),t.addEventListener(e,o,C())}))}}function F(t){var n=function(t){return t.touches?t.touches[t.touches.length-1]:t}(t);return{x:n.clientX,y:n.clientY}}function I(t,n){return void 0===n&&(n=[]),n.some((function(n){return t===n}))}var W=["webkit","moz","ms","o"],H=new RegExp("^-(?!(?:"+W.join("|")+")-)");function B(t,n){n=function(t){var n={};return Object.keys(t).forEach((function(e){if(H.test(e)){var r=t[e];e=e.replace(/^-/,""),n[e]=r,W.forEach((function(t){n["-"+t+"-"+e]=r}))}else n[e]=t[e]})),n}(n),Object.keys(n).forEach((function(e){var r=e.replace(/^-/,"").replace(/-([a-z])/g,(function(t,n){return n.toUpperCase()}));t.style[r]=n[e]}))}var G,X=function(){function t(t){this.updateTime=Date.now(),this.delta={x:0,y:0},this.velocity={x:0,y:0},this.lastPosition={x:0,y:0},this.lastPosition=F(t)}return t.prototype.update=function(t){var n=this.velocity,e=this.updateTime,r=this.lastPosition,o=Date.now(),i=F(t),u={x:-(i.x-r.x),y:-(i.y-r.y)},c=o-e||16,s=u.x/c*16,a=u.y/c*16;n.x=.9*s+.1*n.x,n.y=.9*a+.1*n.y,this.delta=u,this.updateTime=o,this.lastPosition=i},t}(),V=function(){function t(){this._touchList={}}return Object.defineProperty(t.prototype,"_primitiveValue",{get:function(){return{x:0,y:0}},enumerable:!0,configurable:!0}),t.prototype.isActive=function(){return void 0!==this._activeTouchID},t.prototype.getDelta=function(){var t=this._getActiveTracker();return t?i({},t.delta):this._primitiveValue},t.prototype.getVelocity=function(){var t=this._getActiveTracker();return t?i({},t.velocity):this._primitiveValue},t.prototype.track=function(t){var n=this,e=t.targetTouches;return Array.from(e).forEach((function(t){n._add(t)})),this._touchList},t.prototype.update=function(t){var n=this,e=t.touches,r=t.changedTouches;return Array.from(e).forEach((function(t){n._renew(t)})),this._setActiveID(r),this._touchList},t.prototype.release=function(t){var n=this;delete this._activeTouchID,Array.from(t.changedTouches).forEach((function(t){n._delete(t)}))},t.prototype._add=function(t){if(!this._has(t)){var n=new X(t);this._touchList[t.identifier]=n}},t.prototype._renew=function(t){this._has(t)&&this._touchList[t.identifier].update(t)},t.prototype._delete=function(t){delete this._touchList[t.identifier]},t.prototype._has=function(t){return this._touchList.hasOwnProperty(t.identifier)},t.prototype._setActiveID=function(t){this._activeTouchID=t[t.length-1].identifier},t.prototype._getActiveTracker=function(){return this._touchList[this._activeTouchID]},t}();!function(t){t.X="x",t.Y="y"}(G||(G={}));var U=function(){function t(t,n){void 0===n&&(n=0),this._direction=t,this._minSize=n,this.element=document.createElement("div"),this.displaySize=0,this.realSize=0,this.offset=0,this.element.className="scrollbar-thumb scrollbar-thumb-"+t}return t.prototype.attachTo=function(t){t.appendChild(this.element)},t.prototype.update=function(t,n,e){this.realSize=Math.min(n/e,1)*n,this.displaySize=Math.max(this.realSize,this._minSize),this.offset=t/e*(n+(this.realSize-this.displaySize)),B(this.element,this._getStyle())},t.prototype._getStyle=function(){switch(this._direction){case G.X:return{width:this.displaySize+"px","-transform":"translate3d("+this.offset+"px, 0, 0)"};case G.Y:return{height:this.displaySize+"px","-transform":"translate3d(0, "+this.offset+"px, 0)"};default:return null}},t}(),Y=function(){function t(t,n){void 0===n&&(n=0),this.element=document.createElement("div"),this._isShown=!1,this.element.className="scrollbar-track scrollbar-track-"+t,this.thumb=new U(t,n),this.thumb.attachTo(this.element)}return t.prototype.attachTo=function(t){t.appendChild(this.element)},t.prototype.show=function(){this._isShown||(this._isShown=!0,this.element.classList.add("show"))},t.prototype.hide=function(){this._isShown&&(this._isShown=!1,this.element.classList.remove("show"))},t.prototype.update=function(t,n,e){B(this.element,{display:e<=n?"none":"block"}),this.thumb.update(t,n,e)},t}(),q=function(){function t(t){this._scrollbar=t;var n=t.options.thumbMinSize;this.xAxis=new Y(G.X,n),this.yAxis=new Y(G.Y,n),this.xAxis.attachTo(t.containerEl),this.yAxis.attachTo(t.containerEl),t.options.alwaysShowTracks&&(this.xAxis.show(),this.yAxis.show())}return t.prototype.update=function(){var t=this._scrollbar,n=t.size,e=t.offset;this.xAxis.update(e.x,n.container.width,n.content.width),this.yAxis.update(e.y,n.container.height,n.content.height)},t.prototype.autoHideOnIdle=function(){this._scrollbar.options.alwaysShowTracks||(this.xAxis.hide(),this.yAxis.hide())},u([D(300)],t.prototype,"autoHideOnIdle",null),t}(),K=new WeakMap;function $(t){return Math.pow(t-1,3)+1}var J,Q,Z,tt=function(){function t(t,n){var e=this.constructor;this.scrollbar=t,this.name=e.pluginName,this.options=i(i({},e.defaultOptions),n)}return t.prototype.onInit=function(){},t.prototype.onDestroy=function(){},t.prototype.onUpdate=function(){},t.prototype.onRender=function(t){},t.prototype.transformDelta=function(t,n){return i({},t)},t.pluginName="",t.defaultOptions={},t}(),nt={order:new Set,constructors:{}};function et(t){var n=R(t),e=t.containerEl;n(e,"keydown",(function(n){var r=document.activeElement;if((r===e||e.contains(r))&&!function(t){return!("INPUT"!==t.tagName&&"SELECT"!==t.tagName&&"TEXTAREA"!==t.tagName&&!t.isContentEditable)&&!t.disabled}(r)){var o=function(t,n){var e=t.size,r=t.limit,o=t.offset;switch(n){case J.TAB:return function(t){requestAnimationFrame((function(){t.scrollIntoView(document.activeElement,{offsetTop:t.size.container.height/2,onlyScrollIfNeeded:!0})}))}(t);case J.SPACE:return[0,200];case J.PAGE_UP:return[0,40-e.container.height];case J.PAGE_DOWN:return[0,e.container.height-40];case J.END:return[0,r.y-o.y];case J.HOME:return[0,-o.y];case J.LEFT:return[-40,0];case J.UP:return[0,-40];case J.RIGHT:return[40,0];case J.DOWN:return[0,40];default:return null}}(t,n.keyCode||n.which);if(o){var i=o[0],u=o[1];t.addTransformableMomentum(i,u,n,(function(e){e?n.preventDefault():(t.containerEl.blur(),t.parent&&t.parent.containerEl.focus())}))}}}))}function rt(t){var n,e,r,o,i,u=R(t),c=t.containerEl,s=t.track,a=s.xAxis,f=s.yAxis;function l(n,e){var r=t.size;return n===Q.X?e/(r.container.width+(a.thumb.realSize-a.thumb.displaySize))*r.content.width:n===Q.Y?e/(r.container.height+(f.thumb.realSize-f.thumb.displaySize))*r.content.height:0}function p(t){return I(t,[a.element,a.thumb.element])?Q.X:I(t,[f.element,f.thumb.element])?Q.Y:void 0}u(c,"click",(function(n){if(!e&&I(n.target,[a.element,f.element])){var r=n.target,o=p(r),i=r.getBoundingClientRect(),u=F(n),c=t.offset,s=t.limit;if(o===Q.X){var h=u.x-i.left-a.thumb.displaySize/2;t.setMomentum(O(l(o,h)-c.x,-c.x,s.x-c.x),0)}o===Q.Y&&(h=u.y-i.top-f.thumb.displaySize/2,t.setMomentum(0,O(l(o,h)-c.y,-c.y,s.y-c.y)))}})),u(c,"mousedown",(function(e){if(I(e.target,[a.thumb.element,f.thumb.element])){n=!0;var u=e.target,s=F(e),l=u.getBoundingClientRect();o=p(u),r={x:s.x-l.left,y:s.y-l.top},i=c.getBoundingClientRect(),B(t.containerEl,{"-user-select":"none"})}})),u(window,"mousemove",(function(u){if(n){e=!0;var c=t.offset,s=F(u);if(o===Q.X){var a=s.x-r.x-i.left;t.setPosition(l(o,a),c.y)}o===Q.Y&&(a=s.y-r.y-i.top,t.setPosition(c.x,l(o,a)))}})),u(window,"mouseup blur",(function(){n=e=!1,B(t.containerEl,{"-user-select":""})}))}function ot(t){R(t)(window,"resize",k(t.update.bind(t),300))}function it(t){var n,e=R(t),r=t.containerEl,o=t.contentEl,i=t.offset,u=t.limit,c=!1;e(window,"mousemove",(function(e){c&&(cancelAnimationFrame(n),function e(r){var o=r.x,c=r.y;(o||c)&&(t.setMomentum(O(i.x+o,0,u.x)-i.x,O(i.y+c,0,u.y)-i.y),n=requestAnimationFrame((function(){e({x:o,y:c})})))}(function(t,n){var e=t.bounding,r=e.top,o=e.right,i=e.bottom,u=e.left,c=F(n),s=c.x,a=c.y,f={x:0,y:0};return 0===s&&0===a||(s>o-20?f.x=s-o+20:s<u+20&&(f.x=s-u-20),a>i-20?f.y=a-i+20:a<r+20&&(f.y=a-r-20),f.x*=2,f.y*=2),f}(t,e)))})),e(o,"selectstart",(function(t){t.stopPropagation(),cancelAnimationFrame(n),c=!0})),e(window,"mouseup blur",(function(){cancelAnimationFrame(n),c=!1})),e(r,"scroll",(function(t){t.preventDefault(),r.scrollTop=r.scrollLeft=0}))}function ut(t){var n,e=/Android/.test(navigator.userAgent)?3:2,r=t.options.delegateTo||t.containerEl,o=new V,i=R(t),u=0;i(r,"touchstart",(function(e){o.track(e),t.setMomentum(0,0),0===u&&(n=t.options.damping,t.options.damping=Math.max(n,.5)),u++})),i(r,"touchmove",(function(n){if(!Z||Z===t){o.update(n);var e=o.getDelta(),r=e.x,i=e.y;t.addTransformableMomentum(r,i,n,(function(e){e&&(n.preventDefault(),Z=t)}))}})),i(r,"touchcancel touchend",(function(r){var i=o.getVelocity(),c={x:0,y:0};Object.keys(i).forEach((function(t){var r=i[t]/n;c[t]=Math.abs(r)<50?0:r*e})),t.addTransformableMomentum(c.x,c.y,r),0==--u&&(t.options.damping=n),o.release(r),Z=null}))}function ct(t){R(t)(t.options.delegateTo||t.containerEl,"onwheel"in window||document.implementation.hasFeature("Events.wheel","3.0")?"wheel":"mousewheel",(function(n){var e=function(t){if("deltaX"in t){var n=ft(t.deltaMode);return{x:t.deltaX/st.STANDARD*n,y:t.deltaY/st.STANDARD*n}}return"wheelDeltaX"in t?{x:t.wheelDeltaX/st.OTHERS,y:t.wheelDeltaY/st.OTHERS}:{x:0,y:t.wheelDelta/st.OTHERS}}(n),r=e.x,o=e.y;t.addTransformableMomentum(r,o,n,(function(t){t&&n.preventDefault()}))}))}!function(t){t[t.TAB=9]="TAB",t[t.SPACE=32]="SPACE",t[t.PAGE_UP=33]="PAGE_UP",t[t.PAGE_DOWN=34]="PAGE_DOWN",t[t.END=35]="END",t[t.HOME=36]="HOME",t[t.LEFT=37]="LEFT",t[t.UP=38]="UP",t[t.RIGHT=39]="RIGHT",t[t.DOWN=40]="DOWN"}(J||(J={})),function(t){t[t.X=0]="X",t[t.Y=1]="Y"}(Q||(Q={}));var st={STANDARD:1,OTHERS:-3},at=[1,28,500],ft=function(t){return at[t]||at[0]},lt=new Map,pt=function(){function t(t,n){var e=this;this.offset={x:0,y:0},this.limit={x:1/0,y:1/0},this.bounding={top:0,right:0,bottom:0,left:0},this._plugins=[],this._momentum={x:0,y:0},this._listeners=new Set,this.containerEl=t;var r=this.contentEl=document.createElement("div");this.options=new N(n),t.setAttribute("data-scrollbar","true"),t.setAttribute("tabindex","-1"),B(t,{overflow:"hidden",outline:"none"}),window.navigator.msPointerEnabled&&(t.style.msTouchAction="none"),r.className="scroll-content",Array.from(t.childNodes).forEach((function(t){r.appendChild(t)})),t.appendChild(r),this.track=new q(this),this.size=this.getSize(),this._plugins=function(t,n){return Array.from(nt.order).filter((function(t){return!1!==n[t]})).map((function(e){var r=new(0,nt.constructors[e])(t,n[e]);return n[e]=r.options,r}))}(this,this.options.plugins);var o=t.scrollLeft,i=t.scrollTop;t.scrollLeft=t.scrollTop=0,this.setPosition(o,i,{withoutCallbacks:!0});var u=window,c=u.MutationObserver||u.WebKitMutationObserver||u.MozMutationObserver;"function"==typeof c&&(this._observer=new c((function(){e.update()})),this._observer.observe(r,{subtree:!0,childList:!0})),lt.set(t,this),requestAnimationFrame((function(){e._init()}))}return Object.defineProperty(t.prototype,"parent",{get:function(){for(var t=this.containerEl.parentElement;t;){var n=lt.get(t);if(n)return n;t=t.parentElement}return null},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"scrollTop",{get:function(){return this.offset.y},set:function(t){this.setPosition(this.scrollLeft,t)},enumerable:!0,configurable:!0}),Object.defineProperty(t.prototype,"scrollLeft",{get:function(){return this.offset.x},set:function(t){this.setPosition(t,this.scrollTop)},enumerable:!0,configurable:!0}),t.prototype.getSize=function(){return function(t){var n=t.containerEl,e=t.contentEl;return{container:{width:n.clientWidth,height:n.clientHeight},content:{width:e.offsetWidth-e.clientWidth+e.scrollWidth,height:e.offsetHeight-e.clientHeight+e.scrollHeight}}}(this)},t.prototype.update=function(){!function(t){var n=t.getSize(),e={x:Math.max(n.content.width-n.container.width,0),y:Math.max(n.content.height-n.container.height,0)},r=t.containerEl.getBoundingClientRect(),o={top:Math.max(r.top,0),right:Math.min(r.right,window.innerWidth),bottom:Math.min(r.bottom,window.innerHeight),left:Math.max(r.left,0)};t.size=n,t.limit=e,t.bounding=o,t.track.update(),t.setPosition()}(this),this._plugins.forEach((function(t){t.onUpdate()}))},t.prototype.isVisible=function(t){return function(t,n){var e=t.bounding,r=n.getBoundingClientRect(),o=Math.max(e.top,r.top),i=Math.max(e.left,r.left),u=Math.min(e.right,r.right);return o<Math.min(e.bottom,r.bottom)&&i<u}(this,t)},t.prototype.setPosition=function(t,n,e){var r=this;void 0===t&&(t=this.offset.x),void 0===n&&(n=this.offset.y),void 0===e&&(e={});var o=function(t,n,e){var r=t.options,o=t.offset,u=t.limit,c=t.track,s=t.contentEl;return r.renderByPixels&&(n=Math.round(n),e=Math.round(e)),n=O(n,0,u.x),e=O(e,0,u.y),n!==o.x&&c.xAxis.show(),e!==o.y&&c.yAxis.show(),r.alwaysShowTracks||c.autoHideOnIdle(),n===o.x&&e===o.y?null:(o.x=n,o.y=e,B(s,{"-transform":"translate3d("+-n+"px, "+-e+"px, 0)"}),c.update(),{offset:i({},o),limit:i({},u)})}(this,t,n);o&&!e.withoutCallbacks&&this._listeners.forEach((function(t){t.call(r,o)}))},t.prototype.scrollTo=function(t,n,e,r){void 0===t&&(t=this.offset.x),void 0===n&&(n=this.offset.y),void 0===e&&(e=0),void 0===r&&(r={}),function(t,n,e,r,o){void 0===r&&(r=0);var i=void 0===o?{}:o,u=i.easing,c=void 0===u?$:u,s=i.callback,a=t.options,f=t.offset,l=t.limit;a.renderByPixels&&(n=Math.round(n),e=Math.round(e));var p=f.x,h=f.y,d=O(n,0,l.x)-p,v=O(e,0,l.y)-h,y=Date.now();cancelAnimationFrame(K.get(t)),function n(){var e=Date.now()-y,o=r?c(Math.min(e/r,1)):1;if(t.setPosition(p+d*o,h+v*o),e>=r)"function"==typeof s&&s.call(t);else{var i=requestAnimationFrame(n);K.set(t,i)}}()}(this,t,n,e,r)},t.prototype.scrollIntoView=function(t,n){void 0===n&&(n={}),function(t,n,e){var r=void 0===e?{}:e,o=r.alignToTop,i=void 0===o||o,u=r.onlyScrollIfNeeded,c=void 0!==u&&u,s=r.offsetTop,a=void 0===s?0:s,f=r.offsetLeft,l=void 0===f?0:f,p=r.offsetBottom,h=void 0===p?0:p,d=t.containerEl,v=t.bounding,y=t.offset,m=t.limit;if(n&&d.contains(n)){var g=n.getBoundingClientRect();if(!c||!t.isVisible(n)){var b=i?g.top-v.top-a:g.bottom-v.bottom+h;t.setMomentum(g.left-v.left-l,O(b,-y.y,m.y-y.y))}}}(this,t,n)},t.prototype.addListener=function(t){if("function"!=typeof t)throw new TypeError("[smooth-scrollbar] scrolling listener should be a function");this._listeners.add(t)},t.prototype.removeListener=function(t){this._listeners.delete(t)},t.prototype.addTransformableMomentum=function(t,n,e,r){this._updateDebounced();var o=this._plugins.reduce((function(t,n){return n.transformDelta(t,e)||t}),{x:t,y:n}),i=!this._shouldPropagateMomentum(o.x,o.y);i&&this.addMomentum(o.x,o.y),r&&r.call(this,i)},t.prototype.addMomentum=function(t,n){this.setMomentum(this._momentum.x+t,this._momentum.y+n)},t.prototype.setMomentum=function(t,n){0===this.limit.x&&(t=0),0===this.limit.y&&(n=0),this.options.renderByPixels&&(t=Math.round(t),n=Math.round(n)),this._momentum.x=t,this._momentum.y=n},t.prototype.updatePluginOptions=function(t,n){this._plugins.forEach((function(e){e.name===t&&Object.assign(e.options,n)}))},t.prototype.destroy=function(){var t=this.containerEl,n=this.contentEl;!function(t){var n=z.get(t);n&&(n.forEach((function(t){var n=t.elem,e=t.eventName,r=t.handler;n.removeEventListener(e,r,C())})),z.delete(t))}(this),this._listeners.clear(),this.setMomentum(0,0),cancelAnimationFrame(this._renderID),this._observer&&this._observer.disconnect(),lt.delete(this.containerEl);for(var e=Array.from(n.childNodes);t.firstChild;)t.removeChild(t.firstChild);e.forEach((function(n){t.appendChild(n)})),B(t,{overflow:""}),t.scrollTop=this.scrollTop,t.scrollLeft=this.scrollLeft,this._plugins.forEach((function(t){t.onDestroy()})),this._plugins.length=0},t.prototype._init=function(){var t=this;this.update(),Object.keys(r).forEach((function(n){r[n](t)})),this._plugins.forEach((function(t){t.onInit()})),this._render()},t.prototype._updateDebounced=function(){this.update()},t.prototype._shouldPropagateMomentum=function(t,n){void 0===t&&(t=0),void 0===n&&(n=0);var e=this.options,r=this.offset,o=this.limit;if(!e.continuousScrolling)return!1;0===o.x&&0===o.y&&this._updateDebounced();var i=O(t+r.x,0,o.x),u=O(n+r.y,0,o.y),c=!0;return(c=(c=c&&i===r.x)&&u===r.y)&&(r.x===o.x||0===r.x||r.y===o.y||0===r.y)},t.prototype._render=function(){var t=this._momentum;if(t.x||t.y){var n=this._nextTick("x"),e=this._nextTick("y");t.x=n.momentum,t.y=e.momentum,this.setPosition(n.position,e.position)}var r=i({},this._momentum);this._plugins.forEach((function(t){t.onRender(r)})),this._renderID=requestAnimationFrame(this._render.bind(this))},t.prototype._nextTick=function(t){var n=this.options,e=this.offset,r=this._momentum,o=e[t],i=r[t];if(Math.abs(i)<=.1)return{momentum:0,position:o+i};var u=i*(1-n.damping);return n.renderByPixels&&(u|=0),{momentum:u,position:o+i-u}},u([D(100,{leading:!0})],t.prototype,"_updateDebounced",null),t}(),ht="smooth-scrollbar-style",dt=!1;function vt(){if(!dt&&"undefined"!=typeof window){var t=document.createElement("style");t.id=ht,t.textContent="\n[data-scrollbar] {\n  display: block;\n  position: relative;\n}\n\n.scroll-content {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n\n.scrollbar-track {\n  position: absolute;\n  opacity: 0;\n  z-index: 1;\n  background: rgba(222, 222, 222, .75);\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  -webkit-transition: opacity 0.5s 0.5s ease-out;\n          transition: opacity 0.5s 0.5s ease-out;\n}\n.scrollbar-track.show,\n.scrollbar-track:hover {\n  opacity: 1;\n  -webkit-transition-delay: 0s;\n          transition-delay: 0s;\n}\n\n.scrollbar-track-x {\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  height: 8px;\n}\n.scrollbar-track-y {\n  top: 0;\n  right: 0;\n  width: 8px;\n  height: 100%;\n}\n.scrollbar-thumb {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 8px;\n  height: 8px;\n  background: rgba(0, 0, 0, .5);\n  border-radius: 4px;\n}\n",document.head&&document.head.appendChild(t),dt=!0}}e.d(n,"ScrollbarPlugin",(function(){return tt}));
    /*!
     * cast `I.Scrollbar` to `Scrollbar` to avoid error
     *
     * `I.Scrollbar` is not assignable to `Scrollbar`:
     *     "privateProp" is missing in `I.Scrollbar`
     *
     * @see https://github.com/Microsoft/TypeScript/issues/2672
     */
    var yt=function(t){function n(){return null!==t&&t.apply(this,arguments)||this}return function(t,n){function e(){this.constructor=t}o(t,n),t.prototype=null===n?Object.create(n):(e.prototype=n.prototype,new e)}(n,t),n.init=function(t,n){if(!t||1!==t.nodeType)throw new TypeError("expect element to be DOM Element, but got "+t);return vt(),lt.has(t)?lt.get(t):new pt(t,n)},n.initAll=function(t){return Array.from(document.querySelectorAll("[data-scrollbar]"),(function(e){return n.init(e,t)}))},n.has=function(t){return lt.has(t)},n.get=function(t){return lt.get(t)},n.getAll=function(){return Array.from(lt.values())},n.destroy=function(t){var n=lt.get(t);n&&n.destroy()},n.destroyAll=function(){lt.forEach((function(t){t.destroy()}))},n.use=function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];return function(){for(var t=[],n=0;n<arguments.length;n++)t[n]=arguments[n];t.forEach((function(t){var n=t.pluginName;if(!n)throw new TypeError("plugin name is required");nt.order.add(n),nt.constructors[n]=t}))}.apply(void 0,t)},n.attachStyle=function(){return vt()},n.detachStyle=function(){return function(){if(dt&&"undefined"!=typeof window){var t=document.getElementById(ht);t&&t.parentNode&&(t.parentNode.removeChild(t),dt=!1)}}()},n.version="8.5.2",n.ScrollbarPlugin=tt,n}(pt);n.default=yt}]).default}));
    },{}],4:[function(require,module,exports){
    'use strict';
    
    require('intersection-observer');
    
    var _SplitText = require('./vendor/SplitText.js');
    
    var _SplitText2 = _interopRequireDefault(_SplitText);
    
    var _Router = require('./modules/Router');
    
    var _Router2 = _interopRequireDefault(_Router);
    
    var _Cursor = require('./modules/Cursor');
    
    var _Cursor2 = _interopRequireDefault(_Cursor);
    
    var _Home = require('./modules/Home');
    
    var _Home2 = _interopRequireDefault(_Home);
    
    var _Chapters = require('./modules/Chapters');
    
    var _Chapters2 = _interopRequireDefault(_Chapters);
    
    var _Shop = require('./modules/Shop');
    
    var _Shop2 = _interopRequireDefault(_Shop);
    
    var _Project = require('./modules/Project');
    
    var _Project2 = _interopRequireDefault(_Project);
    
    var _Contact = require('./modules/Contact');
    
    var _Contact2 = _interopRequireDefault(_Contact);
    
    var _Mobile = require('./modules/Mobile');
    
    var _Mobile2 = _interopRequireDefault(_Mobile);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    var chapters = new _Chapters2.default();
    var shop = new _Shop2.default();
    var contact = new _Contact2.default();
    var cursor = new _Cursor2.default();
    var home = new _Home2.default();
    var mobile = new _Mobile2.default();
    var project = new _Project2.default();
    
    var viewControllers = {
      home: home,
      chapters: chapters,
      shop: shop,
      contact: contact,
      project: project
    };
    
    document.addEventListener('readystatechange', function () {
      document.body.classList.add('is-ready');
      document.documentElement.classList.add('is-ready');
    });
    
    var router = new _Router2.default(viewControllers, cursor);
    
    mobile.init();
    
    },{"./modules/Chapters":8,"./modules/Contact":9,"./modules/Cursor":10,"./modules/Home":12,"./modules/Mobile":14,"./modules/Project":15,"./modules/Router":16,"./modules/Shop":17,"./vendor/SplitText.js":22,"intersection-observer":2}],5:[function(require,module,exports){
    module.exports={
        "route": {
            "home": {
                "previous": "",
                "next": {
                    "string": "Chapitre 1",
                    "slug": "chapter-1"
                },
                "current": {
                    "string": "La thyroÃ¯de",
                    "slug": "home"
                },
                "top": {
                    "string": "Le projet",
                    "slug": "project"
                }
            },
            "shop": {
                "previous": "",
                "next": "",
                "top": {
                    "string": "Le projet",
                    "slug": "project"
                }
            },
            "project": {
                "previous": "",
                "next": "",
                "current": {
                    "string": "La thyroÃ¯de"
                },
                "top": {
                    "string": "PrÃ©vention",
                    "slug": "prevention"
                }
            },
            "prevention": {
                "previous": "",
                "current": {
                    "string": "La thyroÃ¯de"
                },
                "next": "",
                "top": {
                    "string": "Le projet",
                    "slug": "project"
                }
            },
            "chapter-1": {
                "previous": {
                    "string": "Accueil",
                    "slug": "home"
                },
                "current": {
                    "string": "Chapitre 1",
                    "slug": "chapter-1"
                },
                "next": {
                    "string": "Chapitre 2",
                    "slug": "chapter-2"
                },
                "top": {
                    "string": "Le projet",
                    "slug": "project"
                }
            },
            "chapter-2": {
                "previous": {
                    "string": "Chapitre 1",
                    "slug": "chapter-1"
                },
                "current": {
                    "string": "Chapitre 2",
                    "slug": "chjapter-2"
                },
                "next": {
                    "string": "Chapitre 3",
                    "slug": "chapter-3"
                },
                "top": {
                    "string": "Le projet",
                    "slug": "project"
                }
            },
            "chapter-3": {
                "previous": {
                    "string": "Chapitre 2",
                    "slug": "chapter-2"
                },
                "current": {
                    "string": "Chapitre 3",
                    "slug": "chapter-3"
                },
                "next": {
                    "string": "Accueil",
                    "slug": "home"
                },
                "top": {
                    "string": "Le projet",
                    "slug": "project"
                }
            }
        }
    }
    },{}],6:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var helpers = {};
    
    helpers.clearOldDom = function (route, secondChild) {
      var $appNodes = document.querySelector('.app').childNodes;
      $appNodes.forEach(function ($node) {
        if ($node.firstChild) {
          if ($node.classList.contains('smooth-scroll')) {
            if (!$node.classList.contains(route)) {
              $node.parentNode.removeChild($node);
            }
          } else {
            if (!$node.firstChild.classList.contains(route)) {
              $node.parentNode.removeChild($node);
            }
          }
        }
      });
    };
    
    exports.default = helpers;
    
    },{}],7:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Asides = function () {
      function Asides() {
        var _this = this;
    
        _classCallCheck(this, Asides);
    
        this.$asideLeft = document.querySelector(".aside-left");
        this.$asideRight = document.querySelector(".aside-right");
    
        setTimeout(function () {
          setTimeout(function () {
            _this.animatePlayButton();
          }, 0);
          setTimeout(function () {
            _this.animateChapter();
          }, 0);
          setTimeout(function () {
            _this.animateSoundButton();
          }, 0);
        }, 500);
      }
    
      _createClass(Asides, [{
        key: "animatePlayButton",
        value: function animatePlayButton() {
          var $playButton = this.$asideLeft.querySelector(".aside-left--play-button");
          var $text = $playButton.querySelector(".aside-left--play-button--text");
    
          var $circle = $playButton.querySelector(".aside-left--play-button circle");
          var $triangle = $playButton.querySelector(".aside-left--play-button .triangle");
    
          setTimeout(function () {
            $playButton.classList.add("is-active");
          }, 500);
    
          TweenMax.to($circle, 1, {
            strokeDashoffset: "370px",
            ease: Power3.easeOut
          });
          TweenMax.to($triangle, 0.5, {
            opacity: 1,
            ease: Power1.easeOut,
            delay: 0.2
          });
          TweenMax.to($text, 1, {
            alpha: 1
          });
        }
      }, {
        key: "animateChapter",
        value: function animateChapter() {
          var $leftText = document.querySelector(".aside-left--home--text");
          var $leftDot = document.querySelector(".aside-left--home--dot");
          var $rightText = document.querySelector(".aside-right--chapter--text");
          var $rightDot = document.querySelector(".aside-right--chapter--dot");
    
          setTimeout(function () {
            $leftText.style.opacity = "1";
            $leftDot.style.opacity = "1";
            $rightText.style.opacity = "1";
            $rightDot.style.opacity = "1";
          }, 500);
        }
      }, {
        key: "animateSoundButton",
        value: function animateSoundButton() {
          var $soundButton = this.$asideRight.querySelectorAll(".aside-right--sound-button");
          setTimeout(function () {
            TweenMax.to($soundButton, 1, {
              scaleY: 1,
              ease: Power3.easeOut,
              delay: 1
            });
          }, 500);
        }
      }]);
    
      return Asides;
    }();
    
    exports.default = Asides;
    
    },{}],8:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _helpers = require("../helpers");
    
    var _helpers2 = _interopRequireDefault(_helpers);
    
    var _parallax = require("../vendor/parallax");
    
    var _parallax2 = _interopRequireDefault(_parallax);
    
    var _smoothScrollbar = require("smooth-scrollbar");
    
    var _smoothScrollbar2 = _interopRequireDefault(_smoothScrollbar);
    
    var _Sliders = require("./Sliders");
    
    var _Sliders2 = _interopRequireDefault(_Sliders);
    
    var _transitionSettings = require("../utils/transitionSettings");
    
    var _transitionSettings2 = _interopRequireDefault(_transitionSettings);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Chapters = function () {
      function Chapters() {
        _classCallCheck(this, Chapters);
      }
    
      _createClass(Chapters, [{
        key: "init",
        value: function init(route, from, direction) {
          this.route = route;
          this.from = from;
          this.direction = direction;
          this.$chapter = document.querySelectorAll("." + this.route);
          this.$smooth = document.querySelectorAll(".smooth-scroll");
          var $triggers = document.querySelectorAll("." + this.route + " .chapter--part");
          this.transitionEl = document.querySelector(".transition");
    
          this.animations = {};
          this.images = {
            hand: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-hand .chapter--image__tag")
            },
            point: {
              active: false,
              parent: document.querySelector("." + this.route + " .image-point"),
              selector: document.querySelector("." + this.route + " .image-point .chapter--image__tag")
            },
            bol: {
              selector: document.querySelector("." + this.route + " .image-bol--top")
            },
            brain: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-brain .chapter--image__tag--hand")
            },
            balance: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-balance .chapter--image__tag--rotate")
            },
            heart: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-heart .chapter--image__tag")
            },
            wound: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-wound .chapter--image__tag")
            },
            bag: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-bag .chapter--image__tag")
            },
            zoom: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-zoom .chapter--image__tag")
            },
            blueMedicine: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-blue-medicine .chapter--image__tag--hand")
            },
            tools: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-tools .chapter--image__tag--hand")
            },
            introHand: {
              active: false,
              selector: document.querySelector("." + this.route + " .image-intro--hand .chapter--image__tag")
            }
          };
          this.setup();
          this.playTransition();
          this.show();
          this.intersectionObservers($triggers);
          this.observerFooter();
        }
      }, {
        key: "setup",
        value: function setup() {
          this.setStyleDependingOnPosition();
          this.setupContentHeight();
          this.setupSmooth();
          this.introHandChapter2();
          this.setupSlider();
          this.setupImagesObservers();
        }
      }, {
        key: "setupContentHeight",
        value: function setupContentHeight() {
          var $chapterScreenWidth = document.querySelectorAll("." + this.route + " .chapter--screen-width");
    
          this.contentHeight = $chapterScreenWidth[$chapterScreenWidth.length - 1].clientHeight;
          this.$chapter[this.$chapter.length - 1].style.height = this.contentHeight + "px";
        }
      }, {
        key: "setStyleDependingOnPosition",
        value: function setStyleDependingOnPosition() {
          if (this.from === "previous") {
            this.$chapter[this.$chapter.length - 1].classList.add("chapter-previous");
          }
        }
      }, {
        key: "setupSmooth",
        value: function setupSmooth() {
          this.$smooth.forEach(function ($smooth) {
            $smooth.style.position = "absolute";
          });
    
          this.scrollbar = _smoothScrollbar2.default.init(document.querySelector("." + this.route + ".smooth-scroll"));
          this.parallax = new _parallax2.default("parallax", this.scrollbar);
        }
      }, {
        key: "introHandChapter2",
        value: function introHandChapter2() {
          if (this.images.introHand.selector) {
            this.animations.introHand = new TimelineMax();
            this.animations.introHand.pause();
            this.animations.introHand.from(this.images.introHand.selector, 2, {
              rotation: 20,
              ease: Expo.easeOut
            });
            this.animations.introHand.to(this.images.introHand.selector, 2, {
              rotation: -20,
              ease: Power2.easeIn
            });
          }
        }
      }, {
        key: "setupSlider",
        value: function setupSlider() {
          if (this.route === "chapter-2") {
            this.$sliders = new _Sliders2.default(".chapter--slider");
          }
        }
      }, {
        key: "setupImagesObservers",
        value: function setupImagesObservers() {
          if (this.images.hand.selector) {
            this.handleHandObserver();
          }
          if (this.images.point.selector) {
            this.handlePointObserver();
          }
          if (this.images.brain.selector) {
            this.handleBrainObserver();
          }
          if (this.images.balance.selector) {
            this.handleBalanceObserver();
          }
          if (this.images.heart.selector) {
            this.handleHeartObserver();
          }
          if (this.images.wound.selector) {
            this.handleWoundObserver();
          }
          if (this.images.bag.selector) {
            this.handleBagObserver();
          }
          if (this.images.zoom.selector) {
            this.handleZoomObserver();
          }
          if (this.images.blueMedicine.selector) {
            this.handleBlueMedicineObserver();
          }
          if (this.images.tools.selector) {
            this.handleToolsObserver();
          }
          if (this.images.introHand.selector) {
            this.handleIntroHandObserver();
          }
        }
      }, {
        key: "leave",
        value: function leave(direction) {
          var duration = _transitionSettings2.default.duration;
    
          switch (direction) {
            case "left":
              TweenLite.fromTo(this.$chapter, duration, { x: 0 }, { x: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case "right":
              TweenLite.fromTo(this.$chapter, duration, { x: 0 }, { x: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case "top":
              TweenLite.fromTo(this.$chapter, duration, { y: 0 }, { y: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case "bottom":
              TweenLite.fromTo(this.$chapter, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            default:
              TweenLite.fromTo(this.$chapter, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
          }
        }
      }, {
        key: "playTransition",
        value: function playTransition() {
          var _this = this;
    
          var duration = _transitionSettings2.default.duration;
          var width = window.innerWidth;
          var height = window.innerHeight;
    
          if (!this.direction && this.from === "previous") {
            this.direction = "left";
          }
          if (!this.direction && this.from === "next") {
            this.direction = "right";
          }
    
          var timeline = new TimelineLite({
            onComplete: function onComplete() {
              _this.onInitialAnimCompleted();
            }
          });
    
          //debug
          // timeline.timeScale(0.5)
    
          timeline.set(this.transitionEl, { display: "block" });
    
          switch (this.direction) {
            case "left":
              timeline.fromTo(this.transitionEl, duration, { x: -width, y: 0 }, { x: width, ease: _transitionSettings2.default.ease });
              break;
            case "right":
              timeline.fromTo(this.transitionEl, duration, { x: width, y: 0 }, { x: -width, ease: _transitionSettings2.default.ease });
              break;
            case "top":
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: -height }, { y: height, ease: _transitionSettings2.default.ease });
              break;
            case "bottom":
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              break;
            default:
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              break;
          }
    
          timeline.set(this.$chapter, { width: "100vw", ease: Circ.easeInOut, delay: 0.5 }, 0.3);
          timeline.set(this.transitionEl, { display: "none" });
        }
      }, {
        key: "onInitialAnimCompleted",
        value: function onInitialAnimCompleted() {
          _helpers2.default.clearOldDom(this.route);
          document.body.scrollTop = document.documentElement.scrollTop = 0;
          this.$smooth.forEach(function ($smooth) {
            $smooth.style.position = "relative";
          });
          this.$chapter[this.$chapter.length - 1].classList.add("chapter-static");
        }
      }, {
        key: "show",
        value: function show() {
          var _this2 = this;
    
          // Intro img
          TweenMax.from("." + this.route + " .image-intro--chest .chapter--image__tag, ." + this.route + " .image-intro--red-medicine .chapter--image__tag", 1.5, { y: "100px", ease: Power1.easeOut });
    
          // IntroHand
          if (this.images.introHand.selector) {
            var boundingClientRect = this.images.introHand.selector.getBoundingClientRect();
            var imageRelativeToScreen = Math.abs(boundingClientRect.y - window.innerHeight);
    
            var min = 0;
            var max = boundingClientRect.height + window.innerHeight;
    
            var range = max - min;
            var ratio = imageRelativeToScreen / range;
    
            setTimeout(function () {
              _this2.animations.introHand.tweenTo(ratio + 1);
            }, 500);
          }
    
          // Intro
          var split = new SplitText("." + this.route + " .chapter--number", {
            type: "chars"
          });
          TweenMax.staggerFrom(split.chars, 0.5, { y: "100%", ease: Power1.easeOut, delay: 1 }, 0.03);
    
          var $bar = document.querySelector("." + this.route + " .chapter--name--bar");
          TweenMax.to($bar, 0.5, {
            transform: "scaleX(100%)",
            ease: Power1.easeOut,
            delay: 1.5
          });
    
          var $text = document.querySelectorAll("." + this.route + " .chapter--name--text");
          TweenMax.staggerFrom([$text], 0.5, {
            y: "110%",
            ease: Power1.easeOut,
            delay: 0.8
          });
        }
      }, {
        key: "intersectionObservers",
        value: function intersectionObservers($triggers) {
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                observer.unobserve(entry.target);
    
                entry.target.style.visibility = "visible";
    
                var $title = entry.target.querySelector(".chapter--subtitle");
                var splitTitle = new SplitText($title, { type: "chars" });
                TweenMax.staggerFrom(splitTitle.chars, 0.5, { y: "100%", ease: Power1.easeOut }, 0.03);
    
                var $texts = entry.target.querySelectorAll(".chapter--text");
                $texts.forEach(function ($text) {
                  var split = new SplitText($text, { type: "lines" });
                  TweenMax.staggerFrom(split.lines, 0.5, { y: "30px", opacity: 0, ease: Power1.easeOut, delay: 0.3 }, 0.03);
                });
              }
            });
          }, {
            // rootMargin: "100px",
          });
    
          $triggers.forEach(function ($trigger) {
            $trigger.style.visibility = "hidden";
            observer.observe($trigger);
          });
        }
      }, {
        key: "observerFooter",
        value: function observerFooter() {
          var chapterNext = document.querySelectorAll("." + this.route + " .chapter--next");
    
          var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                observer.unobserve(entry.target);
                var $textChap = entry.target.querySelector(".chapter--next .word-chapter");
                var split = new SplitText($textChap, { type: "chars" });
                TweenMax.staggerFrom(split.chars, 0.5, { y: "110%", ease: Power1.easeOut, delay: 0.1 }, 0.02);
    
                var $textNext = entry.target.querySelector(".chapter--next .word-next");
                var split2 = new SplitText($textNext, { type: "chars" });
                TweenMax.staggerFrom(split2.chars, 0.5, { y: "110%", ease: Power1.easeOut, delay: 0.2 }, 0.02);
                split.chars.forEach(function (char, i) {
                  char.style.transitionDelay = i * 0.02 + "s";
                });
                split2.chars.forEach(function (char, i) {
                  char.style.transitionDelay = i * 0.02 + 0.14 + "s";
                });
              }
            });
          });
    
          chapterNext.forEach(function (chapter) {
            observer.observe(chapter);
          });
        }
      }, {
        key: "handleHandObserver",
        value: function handleHandObserver() {
          var _this3 = this;
    
          this.animations.hand = new TimelineMax();
          this.animations.hand.pause();
          this.animations.hand.to(this.images.hand.selector, 1.5, {
            rotation: 25
          });
    
          this.scrollbar.addListener(function (event) {
            return _this3.handleTimelineProgressRelativeToScroll(_this3.animations.hand, _this3.images.hand.selector, _this3.images.hand.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this3.images.hand.selector.style.willChange = "transform";
              _this3.images.hand.active = true;
            } else {
              _this3.images.hand.selector.style.willChange = "auto";
              _this3.images.hand.active = false;
            }
          });
          observer.observe(this.images.hand.selector);
        }
      }, {
        key: "handlePointObserver",
        value: function handlePointObserver() {
          var _this4 = this;
    
          var bolBoundingClientRect = this.images.bol.selector.getBoundingClientRect();
          var handBoundingClientRect = this.images.hand.selector.getBoundingClientRect();
          var verticalTranslate = bolBoundingClientRect.x - handBoundingClientRect.x - handBoundingClientRect.width + 220 + bolBoundingClientRect.width / 2;
    
          this.animations.point = new TimelineMax();
          this.animations.point.pause();
          this.animations.point.to(this.images.point.selector, 1.5, {
            x: verticalTranslate + "px",
            ease: Power1.easeIn
          }, "first-step");
          this.animations.point.to(this.images.point.selector, 1.5, {
            y: "720px",
            ease: Power1.easeIn
          }, "first-step");
    
          this.scrollbar.addListener(function (event) {
            return _this4.handleTimelineProgressRelativeToScroll(_this4.animations.point, _this4.images.point.parent, _this4.images.point.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this4.images.point.active = true;
            } else {
              _this4.images.point.active = false;
            }
          });
          observer.observe(this.images.point.selector);
        }
      }, {
        key: "handleBrainObserver",
        value: function handleBrainObserver() {
          var _this5 = this;
    
          this.animations.brain = new TimelineMax();
          this.animations.brain.pause();
          this.animations.brain.from(this.images.brain.selector, 1.5, {
            y: "-290px"
          });
    
          this.scrollbar.addListener(function (event) {
            return _this5.handleTimelineProgressRelativeToScroll(_this5.animations.brain, _this5.images.brain.selector, _this5.images.brain.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this5.images.brain.selector.style.willChange = "transform";
              _this5.images.brain.active = true;
            } else {
              _this5.images.brain.selector.style.willChange = "auto";
              _this5.images.brain.active = false;
            }
          });
          observer.observe(this.images.brain.selector);
        }
      }, {
        key: "handleBalanceObserver",
        value: function handleBalanceObserver() {
          var _this6 = this;
    
          this.animations.balance = new TimelineMax();
          this.animations.balance.pause();
          this.animations.balance.from(this.images.balance.selector, 1.5, {
            rotation: -25
          });
    
          this.scrollbar.addListener(function (event) {
            return _this6.handleTimelineProgressRelativeToScroll(_this6.animations.balance, _this6.images.balance.selector, _this6.images.balance.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this6.images.balance.selector.style.willChange = "transform";
              _this6.images.balance.active = true;
            } else {
              _this6.images.balance.selector.style.willChange = "auto";
              _this6.images.balance.active = false;
            }
          });
          observer.observe(this.images.balance.selector);
        }
      }, {
        key: "handleHeartObserver",
        value: function handleHeartObserver() {
          var _this7 = this;
    
          this.animations.heart = new TimelineMax();
          this.animations.heart.pause();
          this.animations.heart.from(this.images.heart.selector, 1.5, {
            rotation: -20
          });
    
          this.scrollbar.addListener(function (event) {
            return _this7.handleTimelineProgressRelativeToScroll(_this7.animations.heart, _this7.images.heart.selector, _this7.images.heart.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this7.images.heart.selector.style.willChange = "transform";
              _this7.images.heart.active = true;
            } else {
              _this7.images.heart.selector.style.willChange = "auto";
              _this7.images.heart.active = false;
            }
          });
          observer.observe(this.images.heart.selector);
        }
      }, {
        key: "handleWoundObserver",
        value: function handleWoundObserver() {
          var _this8 = this;
    
          this.animations.wound = new TimelineMax();
          this.animations.wound.pause();
          this.animations.wound.from(this.images.wound.selector, 1.5, {
            rotation: -20
          });
    
          this.scrollbar.addListener(function (event) {
            return _this8.handleTimelineProgressRelativeToScroll(_this8.animations.wound, _this8.images.wound.selector, _this8.images.wound.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this8.images.wound.selector.style.willChange = "transform";
              _this8.images.wound.active = true;
            } else {
              _this8.images.wound.selector.style.willChange = "auto";
              _this8.images.wound.active = false;
            }
          });
          observer.observe(this.images.wound.selector);
        }
      }, {
        key: "handleBagObserver",
        value: function handleBagObserver() {
          var _this9 = this;
    
          this.animations.bag = new TimelineMax();
          this.animations.bag.pause();
          this.animations.bag.from(this.images.bag.selector, 1.5, {
            rotation: -15
          });
    
          this.scrollbar.addListener(function (event) {
            return _this9.handleTimelineProgressRelativeToScroll(_this9.animations.bag, _this9.images.bag.selector, _this9.images.bag.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this9.images.bag.selector.style.willChange = "transform";
              _this9.images.bag.active = true;
            } else {
              _this9.images.bag.selector.style.willChange = "auto";
              _this9.images.bag.active = false;
            }
          });
          observer.observe(this.images.bag.selector);
        }
      }, {
        key: "handleZoomObserver",
        value: function handleZoomObserver() {
          var _this10 = this;
    
          this.animations.zoom = new TimelineMax();
          this.animations.zoom.pause();
          this.animations.zoom.from(this.images.zoom.selector, 1.5, {
            rotation: 20
          });
    
          this.scrollbar.addListener(function (event) {
            return _this10.handleTimelineProgressRelativeToScroll(_this10.animations.zoom, _this10.images.zoom.selector, _this10.images.zoom.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this10.images.zoom.selector.style.willChange = "transform";
              _this10.images.zoom.active = true;
            } else {
              _this10.images.zoom.selector.style.willChange = "auto";
              _this10.images.zoom.active = false;
            }
          });
          observer.observe(this.images.zoom.selector);
        }
      }, {
        key: "handleBlueMedicineObserver",
        value: function handleBlueMedicineObserver() {
          var _this11 = this;
    
          this.animations.blueMedicine = new TimelineMax();
          this.animations.blueMedicine.pause();
          this.animations.blueMedicine.to(this.images.blueMedicine.selector, 1.5, {
            y: "290px"
          });
    
          this.scrollbar.addListener(function (event) {
            return _this11.handleTimelineProgressRelativeToScroll(_this11.animations.blueMedicine, _this11.images.blueMedicine.selector, _this11.images.blueMedicine.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this11.images.blueMedicine.selector.style.willChange = "transform";
              _this11.images.blueMedicine.active = true;
            } else {
              _this11.images.blueMedicine.selector.style.willChange = "auto";
              _this11.images.blueMedicine.active = false;
            }
          });
          observer.observe(this.images.blueMedicine.selector);
        }
      }, {
        key: "handleToolsObserver",
        value: function handleToolsObserver() {
          var _this12 = this;
    
          this.animations.tools = new TimelineMax();
          this.animations.tools.pause();
          this.animations.tools.from(this.images.tools.selector, 1.5, {
            y: "290px"
          });
    
          this.scrollbar.addListener(function (event) {
            return _this12.handleTimelineProgressRelativeToScroll(_this12.animations.tools, _this12.images.tools.selector, _this12.images.tools.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              _this12.images.tools.selector.style.willChange = "transform";
              _this12.images.tools.active = true;
            } else {
              _this12.images.tools.selector.style.willChange = "auto";
              _this12.images.tools.active = false;
            }
          });
          observer.observe(this.images.tools.selector);
        }
      }, {
        key: "handleIntroHandObserver",
        value: function handleIntroHandObserver() {
          this.setObserverAndListener(this.images.introHand, this.animations.introHand);
        }
      }, {
        key: "setObserverAndListener",
        value: function setObserverAndListener(object, animation) {
          var _this13 = this;
    
          this.scrollbar.addListener(function (event) {
            return _this13.handleTimelineProgressRelativeToScroll(animation, object.selector, object.active);
          });
          var observer = new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              object.selector.style.willChange = "transform";
              object.active = true;
            } else {
              object.selector.style.willChange = "auto";
              object.active = false;
            }
          });
          observer.observe(object.selector);
        }
      }, {
        key: "handleTimelineProgressRelativeToScroll",
        value: function handleTimelineProgressRelativeToScroll(animation, watched, active) {
          if (!active) {
            return false;
          }
    
          TweenMax.killTweensOf(animation);
    
          var boundingClientRect = watched.getBoundingClientRect();
          var imageRelativeToScreen = Math.abs(boundingClientRect.y - window.innerHeight);
    
          var min = 0;
          var max = boundingClientRect.height + window.innerHeight;
    
          var range = max - min;
          var ratio = imageRelativeToScreen / range;
    
          animation.progress(ratio);
        }
      }]);
    
      return Chapters;
    }();
    
    exports.default = Chapters;
    
    },{"../helpers":6,"../utils/transitionSettings":21,"../vendor/parallax":23,"./Sliders":18,"smooth-scrollbar":3}],9:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _helpers = require('../helpers');
    
    var _helpers2 = _interopRequireDefault(_helpers);
    
    var _transitionSettings = require('../utils/transitionSettings');
    
    var _transitionSettings2 = _interopRequireDefault(_transitionSettings);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Contact = function () {
      function Contact() {
        _classCallCheck(this, Contact);
      }
    
      _createClass(Contact, [{
        key: 'init',
        value: function init(route, direction) {
          var _this = this;
    
          this.route = route;
          this.transitionEl = document.querySelector('.transition');
          this.$contact = document.querySelector('.prevention');
    
          this.playTransition();
    
          setTimeout(function () {
            _this.showTitle();
            _this.showText();
            _this.showButton();
          }, 100);
        }
      }, {
        key: 'leave',
        value: function leave(direction) {
          var duration = _transitionSettings2.default.duration;
    
          switch (direction) {
            case 'left':
              TweenLite.fromTo(this.$contact, duration, { x: 0 }, { x: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case 'right':
              TweenLite.fromTo(this.$contact, duration, { x: 0 }, { x: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case 'top':
              TweenLite.fromTo(this.$contact, duration, { y: 0 }, { y: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case 'bottom':
              TweenLite.fromTo(this.$contact, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            default:
              TweenLite.fromTo(this.$contact, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
          }
        }
      }, {
        key: 'playTransition',
        value: function playTransition() {
          var _this2 = this;
    
          var duration = _transitionSettings2.default.duration;
          var width = window.innerWidth;
          var height = window.innerHeight;
    
          if (!this.direction && this.from === 'previous') {
            this.direction = 'left';
          }
          if (!this.direction && this.from === 'next') {
            this.direction = 'right';
          }
    
          var timeline = new TimelineLite({ onComplete: function onComplete() {
              _this2.onInitialAnimCompleted();
            } });
          timeline.set(this.transitionEl, { display: 'block' });
    
          switch (this.direction) {
            case 'left':
              timeline.fromTo(this.transitionEl, duration, { x: -width, y: 0 }, { x: width, ease: _transitionSettings2.default.ease });
              break;
            case 'right':
              timeline.fromTo(this.transitionEl, duration, { x: width, y: 0 }, { x: -width, ease: _transitionSettings2.default.ease });
              break;
            case 'top':
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: -height }, { y: height, ease: _transitionSettings2.default.ease });
              break;
            case 'bottom':
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              timeline.fromTo(this.$contact, duration, { y: 300 }, { y: 0, ease: _transitionSettings2.default.ease }, 0);
              break;
            default:
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              timeline.fromTo(this.$contact, duration, { y: 300 }, { y: 0, ease: _transitionSettings2.default.ease }, 0);
              break;
          }
    
          timeline.set(this.$contact, { autoAlpha: 1, delay: 0.5 }, 0.3);
          timeline.set(this.transitionEl, { display: 'none' });
        }
      }, {
        key: 'showTitle',
        value: function showTitle() {
          var title = this.$contact.querySelector('.js-heading');
          var splitTitle = new SplitText(title, { type: 'chars' });
    
          TweenMax.staggerFrom(splitTitle.chars, .5, { y: '100%', ease: Power1.easeOut, delay: 1 }, .03);
        }
      }, {
        key: 'showText',
        value: function showText() {
          var paragraph = this.$contact.querySelector('.js-paragraph');
          var splitText = new SplitText(paragraph, { type: 'lines' });
    
          var tl = new TimelineLite({ onComplete: function onComplete() {
              paragraph.innerHTML = splitText._originals[0];
            } });
    
          tl.staggerFrom(splitText.lines, .5, { y: '100%', opacity: 0, ease: Power1.easeOut, delay: 1.2 }, .03);
        }
      }, {
        key: 'showButton',
        value: function showButton() {
          var $link = this.$contact.querySelector('.js-link');
          setTimeout(function () {
            $link.classList.add('transition-in');
          }, 1400);
        }
      }, {
        key: 'onInitialAnimCompleted',
        value: function onInitialAnimCompleted() {
          _helpers2.default.clearOldDom(this.route);
        }
      }]);
    
      return Contact;
    }();
    
    exports.default = Contact;
    
    },{"../helpers":6,"../utils/transitionSettings":21}],10:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Cursor = function () {
      function Cursor() {
        _classCallCheck(this, Cursor);
    
        var variables = getComputedStyle(document.body);
        var color = variables.getPropertyValue('--red');
        var circleSvg = '<svg class="circle" height="44" width="44"><circle cx="22" cy="22" r="20"></svg>';
        var crossSvg = '<svg class="cross" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2"><path class="path line" fill="none" stroke-width="4" stroke-miterlimit="10" d="M34.4 37.9l61.4 54.4"/><path class="path line" fill="none" stroke-width="4" stroke-miterlimit="10" d="M95.8 38L34.4 92.2"/></svg>';
    
        this.$cursor = document.createElement('div');
        this.$cursor.classList.add('js-cursor');
    
        this.$cursor.insertAdjacentHTML('beforeend', circleSvg);
        this.$cursor.insertAdjacentHTML('beforeend', crossSvg);
    
        this.arrowLeft = document.createElement('div');
        this.arrowLeft.classList.add('arrow-left');
    
        this.arrowRight = document.createElement('div');
        this.arrowRight.classList.add('arrow-right');
    
        this.$cursor.appendChild(this.arrowLeft);
        this.$cursor.appendChild(this.arrowRight);
    
        document.body.appendChild(this.$cursor);
    
        this.$pointer = document.createElement('div');
        this.$pointer.classList.add('js-pointer');
        this.$pointer.style.cssText = '\n      width: 10px;\n      height: 10px;\n      position: fixed;\n      top: 0;\n      left: 0;\n      z-index: 100005;\n      background: ' + color + ';\n      border-radius: 50%;\n      transform: translateX(50vw) translateY(50vh);\n      pointer-events: none;\n    ';
        document.body.appendChild(this.$pointer);
    
        this.animInCursor();
        this.render(this.$pointer);
      }
    
      _createClass(Cursor, [{
        key: 'animInCursor',
        value: function animInCursor() {
          var cursorCircleDom = this.$cursor.querySelector('svg circle');
    
          var timeline = new TimelineMax({ delay: .5 });
          timeline.to(cursorCircleDom, 1.5, { strokeDashoffset: '370px', ease: Circ.easeInOut });
          timeline.from(this.$pointer, 0.5, { autoAlpha: 0, ease: Power1.easeOut });
        }
      }, {
        key: 'render',
        value: function render($pointer) {
          var _this = this;
    
          window.addEventListener('mousemove', function (event) {
            TweenMax.to(_this.$cursor, .25, { x: event.clientX - 20, y: event.clientY - 20, ease: Power1.easeOut });
            $pointer.style.transform = 'translateX(' + (event.clientX - 5) + 'px) translateY(' + (event.clientY - 5) + 'px)';
          });
        }
      }, {
        key: 'events',
        value: function events() {
          var _this2 = this;
    
          var $interractions = document.querySelectorAll('.cursor-hover');
          var $dragInteraction = document.querySelectorAll('.chapter--symptoms ul');
    
          $interractions.forEach(function ($interraction) {
            $interraction.style.cursor = 'none';
            $interraction.addEventListener('mouseover', function () {
              _this2.mouseoverHandler();
            });
            $interraction.addEventListener('mouseout', function () {
              _this2.mouseoutHandler();
            });
            window.addEventListener('mouseup', function () {
              _this2.mouseupHandler();
            });
          });
    
          $dragInteraction.forEach(function (interaction) {
            interaction.style.cursor = 'none';
            interaction.addEventListener('mouseover', function () {
              _this2.dragMouseoverHandler();
            });
            interaction.addEventListener('mouseout', function () {
              _this2.dragMouseoutHandler();
            });
            interaction.addEventListener('mousedown', function () {
              _this2.dragMousedownHandler();
            });
            interaction.addEventListener('mouseup', function () {
              _this2.dragMouseupHandler();
            });
          });
        }
      }, {
        key: 'mouseoverHandler',
        value: function mouseoverHandler() {
          TweenMax.to(this.$cursor, .2, { scale: 3, ease: Power1.easeOut });
          TweenMax.to(this.$cursor.querySelector('svg circle'), .2, { strokeWidth: '.5px', ease: Power1.easeOut });
        }
      }, {
        key: 'mouseoutHandler',
        value: function mouseoutHandler() {
          TweenMax.to(this.$cursor, .2, { scale: 1, ease: Power1.easeOut });
          TweenMax.to(this.$cursor.querySelector('svg circle'), .2, { strokeWidth: '2px', ease: Power1.easeOut });
        }
      }, {
        key: 'mouseupHandler',
        value: function mouseupHandler() {
          TweenMax.to(this.$cursor, .2, { scale: 1, ease: Power1.easeOut });
          TweenMax.to(this.$cursor.querySelector('svg circle'), .2, { strokeWidth: '2px', ease: Power1.easeOut });
        }
      }, {
        key: 'dragMouseoverHandler',
        value: function dragMouseoverHandler() {
          TweenMax.to(this.arrowLeft, .2, { x: -7, autoAlpha: 1, ease: Power1.easeOut });
          TweenMax.to(this.arrowRight, .2, { x: 7, autoAlpha: 1, ease: Power1.easeOut });
        }
      }, {
        key: 'dragMouseoutHandler',
        value: function dragMouseoutHandler() {
          TweenMax.to(this.arrowLeft, .2, { x: 0, autoAlpha: 0, ease: Power1.easeOut });
          TweenMax.to(this.arrowRight, .2, { x: 0, autoAlpha: 0, ease: Power1.easeOut });
        }
      }, {
        key: 'dragMousedownHandler',
        value: function dragMousedownHandler() {
          TweenMax.to(this.arrowLeft, .2, { x: -25, ease: Power1.easeOut });
          TweenMax.to(this.arrowRight, .2, { x: 25, ease: Power1.easeOut });
        }
      }, {
        key: 'dragMouseupHandler',
        value: function dragMouseupHandler() {
          TweenMax.to(this.arrowLeft, .2, { x: -7, ease: Power1.easeOut });
          TweenMax.to(this.arrowRight, .2, { x: 7, ease: Power1.easeOut });
        }
      }]);
    
      return Cursor;
    }();
    
    exports.default = Cursor;
    
    },{}],11:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Header = function () {
      function Header() {
        _classCallCheck(this, Header);
    
        this.$header = document.querySelector(".header");
        this.volume = true;
        this.volumeBarsContainer = document.querySelectorAll(".aside-right--sound-button");
        this.volumeBars = document.querySelectorAll(".aside-right--sound-button .bar");
        this.audioBg = document.querySelector(".background-sound");
        this.audioOff = document.querySelector(".background-sound--off");
        this.body = document.querySelector("body");
        this.split = new SplitText(".nav--title a .link-content", {
          type: "chars"
        });
        this.splitSubContent = new SplitText(".nav--title a .link-subcontent", {
          type: "chars"
        });
        this.timelineBurgerIn = "";
        this.closeMenu = this.closeMenu.bind(this);
    
        this.ui = {
          $headerBurger: document.querySelector(".header--burger"),
          $navCross: document.querySelector(".nav--cross"),
          $nav: document.querySelector(".nav"),
          $upperBar: document.querySelector(".nav .bar-1"),
          $lowerBar: document.querySelector(".nav .bar-2"),
          $internalLinks: document.querySelectorAll(".nav .route-link")
        };
    
        this.setTimelineBurgerIn();
        this.setTimelineBurgerOut();
        this.startIntroAnimation();
        this.setupEventListeners();
        this.initEventsForVolumeControl();
      }
    
      _createClass(Header, [{
        key: "startIntroAnimation",
        value: function startIntroAnimation() {
          var _this = this;
    
          setTimeout(function () {
            setTimeout(function () {
              _this.animateDot();
            }, 0);
            setTimeout(function () {
              _this.animateTitle();
            }, 100);
            setTimeout(function () {
              _this.animateShop();
            }, 500);
            setTimeout(function () {
              _this.animateBurger();
            }, 500);
          }, 1000);
        }
      }, {
        key: "animateDot",
        value: function animateDot() {
          var $dot = this.$header.querySelector(".header--dot");
    
          TweenMax.to($dot, 1, { scale: 1, ease: Elastic.easeOut });
        }
      }, {
        key: "animateBurger",
        value: function animateBurger() {
          var $burger = this.$header.querySelector(".header--burger");
          var $upper = $burger.querySelector(".header--burger--upper-bun");
          var $lower = $burger.querySelector(".header--burger--lower-bun");
    
          var timeline = new TimelineMax();
    
          timeline.to($upper, 0.8, { scaleX: 1, ease: Power3.easeInOut });
          timeline.to($lower, 0.8, { scaleX: 1, ease: Power3.easeInOut }, 0.2);
        }
      }, {
        key: "animateTitle",
        value: function animateTitle() {
          var $title = this.$header.querySelector(".header--title");
          var $bar = $title.querySelector(".header--title--bar");
          var $text = $title.querySelector(".header--title--text");
    
          var timeline = new TimelineLite();
    
          timeline.to($bar, 0.8, { scaleX: 1, ease: Power3.easeOut }, 0);
          timeline.to($text, 0.8, { y: 0, ease: Power3.easeOut }, 0.2);
        }
      }, {
        key: "animateShop",
        value: function animateShop() {
          var $shop = this.$header.querySelector(".header--shop");
          var $text = $shop.querySelector(".header--shop--text");
          var $dot = $shop.querySelector(".header--shop--dot");
    
          TweenMax.to($text, 0.8, { y: 0, ease: Power3.easeOut });
          TweenMax.to($dot, 0.5, { opacity: 1, ease: Power1.easeOut, delay: 0.7 });
        }
      }, {
        key: "setTimelineBurgerIn",
        value: function setTimelineBurgerIn() {
          var _this2 = this;
    
          var navElements = document.querySelectorAll(".nav--element");
          var navLinks = document.querySelectorAll(".nav--links .nav--link");
          var navFilter = document.querySelector(".nav--filter");
    
          this.timelineBurgerIn = new TimelineMax({ paused: true });
          this.timelineBurgerIn.timeScale(1.1);
    
          this.timelineBurgerIn.to(this.ui.$nav, 1.6, { y: "100%", ease: Expo.easeInOut }, 0);
          this.timelineBurgerIn.to(navFilter, 1.6, { autoAlpha: 0.6, ease: Expo.easeInOut }, 0);
          this.timelineBurgerIn.from(this.ui.$upperBar, 1, { scaleX: 0, ease: Power3.easeInOut }, 1);
          this.timelineBurgerIn.from(this.ui.$lowerBar, 1, { scaleX: 0, ease: Power3.easeInOut }, 1);
          this.timelineBurgerIn.from(this.ui.$upperBar, 1, { rotation: 0, ease: Power3.easeInOut }, 1.7);
          this.timelineBurgerIn.from(this.ui.$lowerBar, 1, { rotation: 0, ease: Power3.easeInOut }, 1.7);
    
          navElements.forEach(function (element, index) {
            var title = element.querySelectorAll(".nav--title .link-content div");
            var number = element.querySelector(".nav--number a");
    
            _this2.timelineBurgerIn.staggerFrom(title, 1 - 0.05 * index, { y: "100%", ease: Power3.easeOut }, 0.02, 1 + 0.15 * index);
            _this2.timelineBurgerIn.fromTo(number, 1 - 0.05 * index, { y: "100%", autoAlpha: 0 }, { y: "0%", autoAlpha: 1, ease: Power3.easeOut }, 1.5 + 0.15 * index);
          });
    
          this.timelineBurgerIn.staggerFromTo(navLinks, 1, { y: "100%", autoAlpha: 0 }, { y: "0%", autoAlpha: 1, ease: Power3.easeOut }, 0.1, 1.7);
        }
      }, {
        key: "setTimelineBurgerOut",
        value: function setTimelineBurgerOut() {}
      }, {
        key: "openMenu",
        value: function openMenu() {
          this.timelineBurgerIn.timeScale(1.1);
          this.timelineBurgerIn.progress(0);
          this.timelineBurgerIn.play();
          this.body.classList.add("js-nav-is-opened");
    
          var $burger = this.$header.querySelector(".header--burger");
          var $upper = $burger.querySelector(".header--burger--upper-bun");
          var $lower = $burger.querySelector(".header--burger--lower-bun");
    
          TweenMax.to($upper, 0.8, {
            scaleX: 0,
            ease: Power3.easeOut,
            transformOrigin: "right"
          });
          TweenMax.to($lower, 0.8, {
            scaleX: 0,
            ease: Power3.easeOut,
            transformOrigin: "right"
          });
        }
      }, {
        key: "enterBurger",
        value: function enterBurger() {
          var $burger = this.$header.querySelector(".header--burger");
          var $lower = $burger.querySelector(".header--burger--lower-bun");
    
          // TweenMax.to($lower, 0.8, { scaleX: 1.6, ease: Power3.easeOut,transformOrigin:"right" } )
        }
      }, {
        key: "leaveBurger",
        value: function leaveBurger() {
          var $burger = this.$header.querySelector(".header--burger");
          var $lower = $burger.querySelector(".header--burger--lower-bun");
    
          // TweenMax.to($lower, 0.8, { scaleX: 1, ease: Power3.easeOut } )
        }
      }, {
        key: "closeMenu",
        value: function closeMenu() {
          var _this3 = this;
    
          var tweenObj = { progress: 1 };
    
          this.timelineBurgerIn.timeScale(1);
          this.timelineBurgerIn.progress(tweenObj.progress);
          this.timelineBurgerIn.pause();
    
          TweenMax.to(tweenObj, 2.2, {
            progress: 0,
            onUpdate: function onUpdate() {
              _this3.timelineBurgerIn.progress(tweenObj.progress.toFixed(3));
            },
            ease: Power3.EaseOut
          });
    
          this.body.classList.remove("js-nav-is-opened");
    
          var $burger = this.$header.querySelector(".header--burger");
          var $upper = $burger.querySelector(".header--burger--upper-bun");
          var $lower = $burger.querySelector(".header--burger--lower-bun");
    
          TweenMax.to($upper, 0.8, {
            scaleX: 1,
            ease: Power3.easeOut,
            transformOrigin: "left",
            delay: 1.5
          });
          TweenMax.to($lower, 0.8, {
            scaleX: 1,
            ease: Power3.easeOut,
            transformOrigin: "left",
            delay: 1.7
          });
        }
      }, {
        key: "closeMenuLink",
        value: function closeMenuLink() {
          var _this4 = this;
    
          var tweenObj = { progress: 1 };
    
          this.timelineBurgerIn.progress(tweenObj.progress);
          this.timelineBurgerIn.pause();
    
          TweenMax.to(tweenObj, 0.1, {
            progress: 0,
            onUpdate: function onUpdate() {
              _this4.timelineBurgerIn.progress(tweenObj.progress.toFixed(3));
            },
            ease: Power3.EaseOut,
            delay: 0.4
          });
    
          this.body.classList.remove("js-nav-is-opened");
        }
      }, {
        key: "titlesEnter",
        value: function titlesEnter(e) {
          var currentSplit = e.currentTarget.querySelectorAll(".link-content div");
          var currentSplitSub = e.currentTarget.querySelectorAll(".link-subcontent div");
    
          var timeline = new TimelineLite();
          timeline.staggerTo(currentSplit, 1, { y: "100%", ease: Power3.easeOut }, 0.02, 0);
          timeline.staggerTo(currentSplitSub, 1, { y: "100%", ease: Power3.easeOut }, 0.02, 0);
        }
      }, {
        key: "titlesLeave",
        value: function titlesLeave(e) {
          var currentSplit = e.currentTarget.querySelectorAll(".link-content div");
          var currentSplitSub = e.currentTarget.querySelectorAll(".link-subcontent div");
    
          var timeline = new TimelineLite();
          timeline.staggerTo(currentSplit, 1, { y: "0%", ease: Power3.easeOut }, 0.02, 0);
          timeline.staggerTo(currentSplitSub, 1, { y: "0%", ease: Power3.easeOut }, 0.02, 0);
        }
      }, {
        key: "setupEventListeners",
        value: function setupEventListeners() {
          var _this5 = this;
    
          // Burger
          this.ui.$headerBurger.addEventListener("mousedown", function () {
            _this5.openMenu();
          });
    
          // Over Burger
          this.ui.$headerBurger.addEventListener("mouseenter", function () {
            _this5.enterBurger();
          });
    
          // Leaving Burger
    
          this.ui.$headerBurger.addEventListener("mouseleave", function () {
            _this5.leaveBurger();
          });
    
          // Close cross
          this.ui.$navCross.addEventListener("mousedown", function () {
            _this5.closeMenu();
          });
    
          // Keypress
          document.addEventListener("keyup", function (evt) {
            if (evt.key === "Escape" && _this5.body.classList.contains("js-nav-is-opened")) {
              _this5.closeMenu();
            }
          });
    
          this.ui.$internalLinks.forEach(function ($link) {
            $link.addEventListener("click", function (e) {
              var pathArray = window.location.pathname.split("/");
              var current = pathArray[1] || "home";
              var targetUrl = e.currentTarget.dataset.url;
    
              if (targetUrl === current) {
                _this5.closeMenu();
              } else {
                _this5.closeMenuLink();
              }
              _this5.closeMenu();
            });
    
            $link.addEventListener("mouseenter", function (e) {
              // this.titlesEnter(e);
            });
    
            $link.addEventListener("mouseleave", function (e) {
              // this.titlesLeave(e);
            });
          });
        }
      }, {
        key: "initEventsForVolumeControl",
        value: function initEventsForVolumeControl() {
          var _this6 = this;
    
          var volumeControl = document.querySelector(".aside-right--sound-button");
          volumeControl.addEventListener("click", function () {
            if (_this6.volume) {
              var timeline = new TimelineLite();
              timeline.to(_this6.volumeBarsContainer, 1, {
                scaleY: 0,
                ease: Power3.easeOut
              });
              timeline.to(_this6.volumeBarsContainer, 1, {
                scaleY: 1,
                ease: Power3.easeOut
              });
              _this6.volumeBars.forEach(function (bar) {
                setTimeout(function () {
                  bar.classList.add("bar--paused");
                }, 1000);
                if (_this6.audioOff) {
                  TweenMax.to(_this6.audioOff, 1, {
                    volume: 0,
                    ease: Power3.easeOut
                  });
                }
                TweenMax.to(_this6.audioBg, 1, {
                  volume: 0,
                  ease: Power3.easeOut
                });
                _this6.volume = false;
              });
            } else {
              var _timeline = new TimelineLite();
              _timeline.to(_this6.volumeBarsContainer, 1, {
                scaleY: 0,
                ease: Power3.easeOut
              });
              _timeline.to(_this6.volumeBarsContainer, 1, {
                scaleY: 1,
                ease: Power3.easeOut
              });
              _this6.volumeBars.forEach(function (bar) {
                setTimeout(function () {
                  bar.classList.remove("bar--paused");
                }, 1000);
                if (_this6.audioOff) {
                  TweenMax.to(_this6.audioOff, 1, {
                    volume: 1,
                    ease: Power3.easeIn
                  });
                }
                TweenMax.to(_this6.audioBg, 1, {
                  volume: 1,
                  ease: Power3.easeIn
                });
                _this6.volume = true;
              });
            }
          });
        }
      }]);
    
      return Header;
    }();
    
    exports.default = Header;
    
    },{}],12:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _helpers = require("../helpers");
    
    var _helpers2 = _interopRequireDefault(_helpers);
    
    var _transitionSettings = require("../utils/transitionSettings");
    
    var _transitionSettings2 = _interopRequireDefault(_transitionSettings);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Home = function () {
      function Home() {
        _classCallCheck(this, Home);
      }
    
      _createClass(Home, [{
        key: "init",
        value: function init(route, direction) {
          var _this = this;
    
          this.route = route;
          this.direction = direction;
          this.$home = document.querySelector(".home");
          this.transitionEl = document.querySelector(".transition");
          this.playTransition();
          this.showTitle();
          this.constrolsVideo();
    
          this.$home.style.zIndex = 1;
    
          setTimeout(function () {
            _this.showLink();
          }, 100);
        }
      }, {
        key: "leave",
        value: function leave(direction) {
          var duration = _transitionSettings2.default.duration;
    
          switch (direction) {
            case "left":
              TweenLite.fromTo(this.$home, duration, { x: 0 }, { x: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case "right":
              TweenLite.fromTo(this.$home, duration, { x: 0 }, { x: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case "top":
              TweenLite.fromTo(this.$home, duration, { y: 0 }, { y: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case "bottom":
              TweenLite.fromTo(this.$home, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            default:
              TweenLite.fromTo(this.$home, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
          }
        }
      }, {
        key: "playTransition",
        value: function playTransition() {
          var _this2 = this;
    
          var duration = _transitionSettings2.default.duration;
          var width = window.innerWidth;
          var height = window.innerHeight;
    
          var timeline = new TimelineLite({
            onComplete: function onComplete() {
              _this2.onInitialAnimCompleted();
            }
          });
    
          //debug
          // timeline.timeScale(0.5)
    
          timeline.set(this.transitionEl, { display: "block" });
    
          switch (this.direction) {
            case "left":
              timeline.fromTo(this.transitionEl, duration, { x: -width, y: 0 }, { x: width, ease: _transitionSettings2.default.ease });
              break;
            case "right":
              timeline.fromTo(this.transitionEl, duration, { x: width, y: 0 }, { x: -width, ease: _transitionSettings2.default.ease });
              break;
            case "top":
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: -height }, { y: height, ease: _transitionSettings2.default.ease });
              break;
            case "bottom":
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              break;
            default:
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              break;
          }
    
          timeline.set(this.$home, { width: "100vw" }, 0.3);
          // timeline.set(this.transitionEl, { display: 'none' });
        }
      }, {
        key: "onInitialAnimCompleted",
        value: function onInitialAnimCompleted() {
          _helpers2.default.clearOldDom(this.route);
        }
      }, {
        key: "showTitle",
        value: function showTitle() {
          var $title = this.$home.querySelector(".home--title");
          var lines = [];
    
          var split = new SplitText($title, { type: "lines" });
          $title.innerHTML = "";
          split.lines.forEach(function (line) {
            lines.push(line);
            var $hiddenWrap = document.createElement("div");
            $hiddenWrap.classList.add("hidden-wrap");
            $hiddenWrap.appendChild(line);
            $title.appendChild($hiddenWrap);
          });
    
          var $lines = $title.querySelectorAll(".hidden-wrap div");
          for (var i = 0; i < $lines.length; i++) {
            TweenMax.to($lines[i], 1, {
              y: 0,
              ease: Power3.easeOut,
              delay: 1 + i / 10
            });
          }
    
          // TweenMax.to($lines, {
          //   duration: .5,
          //   y: 0,
          //   ease: Power1.easeOut,
          //   delay: 1,
          // });
        }
      }, {
        key: "constrolsVideo",
        value: function constrolsVideo() {
          var bgVideo = this.$home.querySelector(".home--vid");
          var progressBar = this.$home.querySelector(".home--vid-progress");
          setTimeout(function () {
            bgVideo.style.opacity = 1;
            progressBar.style.transform = "scaleX(1)";
          }, 700);
          bgVideo.controls = false;
    
          bgVideo.addEventListener("timeupdate", function () {
            var percentage = Math.floor(100 / bgVideo.duration * bgVideo.currentTime);
    
            progressBar.value = percentage;
          }, false);
        }
      }, {
        key: "showLink",
        value: function showLink() {
          var $link = this.$home.querySelector(".js-link");
          setTimeout(function () {
            $link.classList.add("transition-in");
          }, 1400);
        }
      }]);
    
      return Home;
    }();
    
    exports.default = Home;
    
    },{"../helpers":6,"../utils/transitionSettings":21}],13:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Intro = function () {
      function Intro() {
        _classCallCheck(this, Intro);
      }
    
      _createClass(Intro, [{
        key: 'init',
        value: function init(callback) {
          this.callback = callback;
          this.container = document.querySelector('.intro');
          this.text = document.querySelectorAll('.intro p');
          this.button = document.querySelector('.intro__cta');
          this.timeout = '';
          this.hiding = false;
    
          this.container.classList.remove('intro--hidden');
    
          this.setupSplitText();
          this.revealAnim();
        }
      }, {
        key: 'setupSplitText',
        value: function setupSplitText() {
          this.words = [];
          this.splittedText = new SplitText(this.text, { type: 'lines' });
    
          for (var index = 0; index < this.splittedText.lines.length; index++) {
            var element = this.splittedText.lines[index];
            element.style.overflow = 'hidden';
    
            var words = new SplitText(element, { type: 'words' }).words;
    
            for (var i = 0; i < words.length; i++) {
              var _element = words[i];
              this.words.push(_element);
            }
          }
        }
      }, {
        key: 'revealAnim',
        value: function revealAnim() {
          var _this = this;
    
          var timeline = new TimelineLite();
    
          timeline.staggerFromTo(this.words, 1.5, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, ease: Power4.easeOut }, 0.08, 1.8);
          timeline.fromTo(this.button, 1.5, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, ease: Power4.easeOut }, 4.5);
    
          setTimeout(function () {
            _this.enableDiscover();
          }, 5500);
        }
      }, {
        key: 'enableDiscover',
        value: function enableDiscover() {
          var _this2 = this;
    
          this.button.classList.add('is-active');
          this.button.addEventListener('click', function () {
            if (_this2.hiding) return;
    
            _this2.hideAnim();
          });
        }
      }, {
        key: 'hideAnim',
        value: function hideAnim() {
          var _this3 = this;
    
          this.hiding = true;
    
          var timeline = new TimelineMax({ onComplete: function onComplete() {
              return _this3.callback();
            } });
    
          timeline.staggerTo(this.splittedText.lines, 1, { autoAlpha: 0, y: -50, ease: Power3.easeIn }, 0.08);
          timeline.to(this.button, 0.8, { autoAlpha: 0, y: -20, ease: Power3.easeIn }, 0.5);
          timeline.to(this.container, 0.3, { autoAlpha: 0 }, 1.5);
    
          // setTimeout(() => { this.button.classList.remove('is-active'); }, 0.3);
        }
      }]);
    
      return Intro;
    }();
    
    exports.default = Intro;
    
    },{}],14:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Mobile = function () {
      function Mobile() {
        _classCallCheck(this, Mobile);
      }
    
      _createClass(Mobile, [{
        key: 'init',
        value: function init() {
          this.playButton = document.querySelector('.mobile-container .aside-left--play-button');
          this.videoMobile = document.querySelector('.mobile-vid-full');
          this.initEventListeners();
          this.initHeightForMobile();
        }
      }, {
        key: 'initEventListeners',
        value: function initEventListeners() {
          var _this = this;
    
          this.playButton.addEventListener('click', function () {
            return _this.triggerVideo();
          });
          this.videoMobile.addEventListener('click', function () {
            return _this.closeVideo();
          });
        }
      }, {
        key: 'initHeightForMobile',
        value: function initHeightForMobile() {
          var vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', vh + 'px');
    
          window.addEventListener('resize', function () {
            var vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', vh + 'px');
          });
        }
      }, {
        key: 'triggerVideo',
        value: function triggerVideo() {
          this.videoMobile.style.display = 'block';
          this.videoMobile.play();
        }
      }, {
        key: 'closeVideo',
        value: function closeVideo() {
          this.videoMobile.style.display = 'none';
          this.videoMobile.pause();
          this.videoMobile.currentTime = 0;
        }
      }]);
    
      return Mobile;
    }();
    
    exports.default = Mobile;
    
    },{}],15:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _helpers = require('../helpers');
    
    var _helpers2 = _interopRequireDefault(_helpers);
    
    var _transitionSettings = require('../utils/transitionSettings');
    
    var _transitionSettings2 = _interopRequireDefault(_transitionSettings);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Project = function () {
      function Project() {
        _classCallCheck(this, Project);
      }
    
      _createClass(Project, [{
        key: 'init',
        value: function init(route, direction) {
          var _this = this;
    
          this.route = route;
          this.transitionEl = document.querySelector('.transition');
          this.$project = document.querySelector('.project');
    
          this.playTransition();
    
          setTimeout(function () {
            _this.showTitle();
            _this.showText();
            _this.showImage();
            _this.showLink();
          }, 100);
        }
      }, {
        key: 'leave',
        value: function leave(direction) {
          var duration = _transitionSettings2.default.duration;
          switch (direction) {
            case 'left':
              TweenLite.fromTo(this.$project, duration, { x: 0 }, { x: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case 'right':
              TweenLite.fromTo(this.$project, duration, { x: 0 }, { x: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case 'top':
              TweenLite.fromTo(this.$project, duration, { y: 0 }, { y: 300, ease: _transitionSettings2.default.ease }, 0);
              break;
            case 'bottom':
              TweenLite.fromTo(this.$project, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
            default:
              TweenLite.fromTo(this.$project, duration, { y: 0 }, { y: -300, ease: _transitionSettings2.default.ease }, 0);
              break;
          }
        }
      }, {
        key: 'playTransition',
        value: function playTransition() {
          var _this2 = this;
    
          var duration = _transitionSettings2.default.duration;
          var width = window.innerWidth;
          var height = window.innerHeight;
    
          if (!this.direction && this.from === 'previous') {
            this.direction = 'left';
          }
          if (!this.direction && this.from === 'next') {
            this.direction = 'right';
          }
    
          var timeline = new TimelineLite({ onComplete: function onComplete() {
              _this2.onInitialAnimCompleted();
            } });
          timeline.set(this.transitionEl, { display: 'block' });
    
          switch (this.direction) {
            case 'left':
              timeline.fromTo(this.transitionEl, duration, { x: -width, y: 0 }, { x: width, ease: _transitionSettings2.default.ease });
              break;
            case 'right':
              timeline.fromTo(this.transitionEl, duration, { x: width, y: 0 }, { x: -width, ease: _transitionSettings2.default.ease });
              break;
            case 'top':
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: -height }, { y: height, ease: _transitionSettings2.default.ease });
              break;
            case 'bottom':
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease }, 0);
              timeline.fromTo(this.$project, duration, { y: 300 }, { y: 0, ease: _transitionSettings2.default.ease }, 0);
              break;
            default:
              timeline.fromTo(this.transitionEl, duration, { x: 0, y: height }, { y: -height, ease: _transitionSettings2.default.ease });
              timeline.fromTo(this.$project, duration, { y: 300 }, { y: 0, ease: _transitionSettings2.default.ease }, 0);
              break;
          }
    
          timeline.set(this.$project, { autoAlpha: 1, delay: 0.35 }, 0.45);
          timeline.set(this.transitionEl, { display: 'none' });
        }
      }, {
        key: 'showTitle',
        value: function showTitle() {
          var title = this.$project.querySelector('.js-title');
          var splitTitle = new SplitText(title, { type: 'chars' });
          TweenMax.staggerFrom(splitTitle.chars, .5, { y: '100%', ease: Power1.easeOut, delay: 1 }, .03);
        }
      }, {
        key: 'showText',
        value: function showText() {
          var paragraph = this.$project.querySelector('.js-paragraph');
          var splitText = new SplitText(paragraph, { type: 'lines' });
    
          var tl = new TimelineLite({ onComplete: function onComplete() {
              paragraph.innerHTML = splitText._originals[0];
            } });
    
          tl.staggerFrom(splitText.lines, .5, { y: '100%', opacity: 0, ease: Power1.easeOut, delay: 1.2 }, .03);
        }
      }, {
        key: 'showImage',
        value: function showImage() {
          var $image = this.$project.querySelectorAll('.js-image');
          // TweenMax.staggerFrom($image, 1, { opacity: 0, ease: Power1.easeOut, delay: 1.2 })
        }
      }, {
        key: 'showLink',
        value: function showLink() {
          var $link = this.$project.querySelector('.js-link');
          setTimeout(function () {
            $link.classList.add('transition-in');
          }, 1400);
        }
      }, {
        key: 'onInitialAnimCompleted',
        value: function onInitialAnimCompleted() {
          _helpers2.default.clearOldDom(this.route);
        }
      }]);
    
      return Project;
    }();
    
    exports.default = Project;
    
    },{"../helpers":6,"../utils/transitionSettings":21}],16:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _Intro = require("./Intro");
    
    var _Intro2 = _interopRequireDefault(_Intro);
    
    var _Header = require("./Header");
    
    var _Header2 = _interopRequireDefault(_Header);
    
    var _Asides = require("./Asides");
    
    var _Asides2 = _interopRequireDefault(_Asides);
    
    var _Video = require("./Video");
    
    var _Video2 = _interopRequireDefault(_Video);
    
    var _config = require("../config.json");
    
    var _config2 = _interopRequireDefault(_config);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Router = function () {
      function Router(viewControllers, cursor) {
        var _this = this;
    
        _classCallCheck(this, Router);
    
        this.viewControllers = viewControllers;
        this.cursor = cursor;
        this.pathArray = window.location.pathname.split("/");
        this.current = this.pathArray[1] || "home";
        this.backgroundAudio = document.querySelector(".background-sound");
        this.offAudio = document.querySelector(".background-sound--off");
        this.header = "";
        this.asides = "";
        this.alreadyLoadLastChapter = false;
        this.video = new _Video2.default();
    
        window.addEventListener("popstate", function () {
          _this.route(_this.pullRoute());
        });
    
        if (sessionStorage.getItem("intro")) {
          this.introCallback();
        } else {
          this.intro = new _Intro2.default();
          this.cursor.events();
          this.intro.init(function () {
            return _this.introCallback();
          });
          sessionStorage.setItem("intro", true);
        }
    
        //debug
        // this.intro = new Intro()
        // this.cursor.events()
        // this.intro.init(() => this.introCallback())
        // sessionStorage.setItem('intro', true)
    
        this.video.init();
        this.handleClickEvent = this.handleClickEvent.bind(this);
      }
    
      _createClass(Router, [{
        key: "introCallback",
        value: function introCallback() {
          this.header = new _Header2.default();
          this.asides = new _Asides2.default();
          this.init();
        }
      }, {
        key: "handleClickEvent",
        value: function handleClickEvent(e) {
          e.preventDefault();
    
          var direction = e.currentTarget.dataset.direction;
          var route = e.currentTarget.dataset.url;
    
          if (this.pullRoute() === route) {
            return false;
          }
    
          if ((this.pullRoute() === "" || this.pullRoute() === "home") && (route === "" || route === "home")) {
            return false;
          }
    
          this.route(route, direction);
          this.pushRoute(route);
        }
      }, {
        key: "initEventListenerOnLinks",
        value: function initEventListenerOnLinks() {
          var _this2 = this;
    
          var $links = document.querySelectorAll(".route-link");
    
          $links.forEach(function ($link) {
            $link.addEventListener("click", _this2.handleClickEvent);
          });
        }
      }, {
        key: "removeEventListenerOnLinks",
        value: function removeEventListenerOnLinks() {
          var _this3 = this;
    
          var $links = document.querySelectorAll(".route-link");
    
          $links.forEach(function ($link) {
            $link.removeEventListener("click", _this3.handleClickEvent);
          });
        }
      }, {
        key: "getFromPreviousOrNext",
        value: function getFromPreviousOrNext(next) {
          if (_config2.default.route[this.current].previous && _config2.default.route[this.current].previous.slug === next) {
            return "previous";
          } else {
            return "next";
          }
        }
      }, {
        key: "updateAsideNavs",
        value: function updateAsideNavs() {
          var _this4 = this;
    
          var asideLeft = document.querySelector(".aside-left");
          var asideLeftLink = asideLeft.querySelector(".aside-left--link");
          var asideLeftText = asideLeft.querySelector(".aside-left--home--text");
          var asideLeftDot = asideLeft.querySelector(".aside-left--home--dot");
    
          var asideRight = document.querySelector(".aside-right--chapter");
          var asideRightText = document.querySelector(".aside-right--chapter--text");
          var asideRightLink = document.querySelector(".aside-right--link");
          var asideRightDot = document.querySelector(".aside-right--chapter--dot");
    
          var asideTopText = document.querySelector(".header--shop--text");
          var asideTopTextCurrent = document.querySelectorAll(".header--title--text")[1];
          var asideTopLink = asideTopText.querySelector("a");
    
          // <!-- <div class="header--prevention--text"><a class="route-link link cursor-hover block" data-url="prevention" href="/prevention" title="DÃ©couvrir le projet">PrÃ©vention</a></div> -->
    
          if (_config2.default.route[this.current].previous) {
            asideLeftLink.style.display = "block";
            var timeline = new TimelineMax();
            timeline.to(asideLeftText, 1, { y: -50, ease: Power3.easeOut });
            timeline.to(asideLeftDot, 0.5, { scale: 0, ease: Power3.easeOut }, 0);
            timeline.to(asideLeftText, 1, { y: 1, ease: Power3.easeOut });
            timeline.to(asideLeftDot, 1, { scale: 1, ease: Power3.easeOut }, 1);
            setTimeout(function () {
              asideLeftText.innerHTML = _config2.default.route[_this4.current].previous.string;
              asideTopTextCurrent.innerHTML = _config2.default.route[_this4.current].current.string;
            }, 800);
    
            asideLeftLink.setAttribute("href", "/" + _config2.default.route[this.current].previous.slug);
            asideLeftLink.setAttribute("data-url", "" + _config2.default.route[this.current].previous.slug);
          } else {
            TweenMax.to(asideLeftText, 1, { y: -50, ease: Power3.easeOut });
            TweenMax.to(asideLeftDot, 0.5, { scale: 0, ease: Power3.easeOut });
            setTimeout(function () {
              asideLeftLink.style.display = "none";
            }, 1000);
          }
    
          if (_config2.default.route[this.current].top) {
            asideTopText.style.display = "flex";
    
            setTimeout(function () {
              asideTopLink.innerHTML = _config2.default.route[_this4.current].top.string;
              asideTopTextCurrent.innerHTML = _config2.default.route[_this4.current].current.string;
              asideTopLink.setAttribute("data-content", "" + _config2.default.route[_this4.current].top.string);
              asideTopLink.setAttribute("href", "/" + _config2.default.route[_this4.current].top.slug);
              asideTopLink.setAttribute("data-url", "" + _config2.default.route[_this4.current].top.slug);
              asideTopLink.setAttribute("title", "" + _config2.default.route[_this4.current].top.string);
            }, 800);
          } else {
            asideTopText.style.display = "none";
          }
    
          if (_config2.default.route[this.current].next) {
            asideRight.style.display = "block";
    
            var _timeline = new TimelineMax();
            _timeline.to(asideRightText, 1, { y: -40, ease: Power3.easeOut });
            _timeline.to(asideRightDot, 0.5, { scale: 0, ease: Power3.easeOut }, 0);
            _timeline.to(asideRightText, 1, { y: 1, ease: Power3.easeOut });
            _timeline.to(asideRightDot, 1, { scale: 1, ease: Power3.easeOut }, 1.1);
            setTimeout(function () {
              asideRightLink.innerHTML = _config2.default.route[_this4.current].next.string;
            }, 500);
    
            asideRightLink.setAttribute("href", "/" + _config2.default.route[this.current].next.slug);
            asideRightLink.setAttribute("data-url", "" + _config2.default.route[this.current].next.slug);
            asideRightLink.setAttribute("data-content", "" + _config2.default.route[this.current].next.string);
          } else {
            TweenMax.to(asideRightText, 1, { y: -20, ease: Power3.easeOut });
            TweenMax.to(asideRightDot, 0.5, { scale: 0, ease: Power3.easeOut });
            setTimeout(function () {
              asideRightLink.innerHTML = _config2.default.route[_this4.current].next.string;
              asideRightLink.setAttribute("href", "/" + _config2.default.route[_this4.current].next.slug);
              asideRightLink.setAttribute("data-url", "" + _config2.default.route[_this4.current].next.slug);
              asideRightLink.setAttribute("data-content", "" + _config2.default.route[_this4.current].next.string);
            }, 1000);
          }
        }
      }, {
        key: "ajax",
        value: function ajax(route, direction) {
          var _this5 = this;
    
          this.isRequesting = true;
    
          var url = "/views/" + route + ".html";
          var http = new XMLHttpRequest();
    
          http.onreadystatechange = function () {
            if (http.readyState == 4 && http.status == 200) {
              var newDiv = document.createElement("div");
              if (route.startsWith("chapter-")) {
                newDiv.classList.add(route);
                newDiv.classList.add("smooth-scroll");
              }
              newDiv.innerHTML = http.responseText;
              document.querySelector(".app").appendChild(newDiv);
    
              _this5.cursor.events();
    
              // Current is not updated yet
    
              var from = _this5.getFromPreviousOrNext(route);
    
              _this5.pathArray = window.location.pathname.split("/");
              _this5.current = _this5.pathArray[1] || "home";
    
              // Current is updated already
    
              _this5.updateAsideNavs();
              _this5.removeEventListenerOnLinks();
              _this5.initEventListenerOnLinks();
    
              if (_this5.currentView && _this5.currentView.leave) {
                _this5.currentView.leave(direction);
              }
    
              switch (route) {
                case "home":
                  _this5.currentView = _this5.viewControllers.home;
                  _this5.currentView.init(route, direction);
                  break;
                case "chapter-1":
                  _this5.currentView = _this5.viewControllers.chapters;
                  _this5.currentView.init(route, from, direction);
                  break;
                case "chapter-2":
                  _this5.currentView = _this5.viewControllers.chapters;
                  _this5.currentView.init(route, from, direction);
                  break;
                case "chapter-3":
                  _this5.currentView = _this5.viewControllers.chapters;
                  _this5.currentView.init(route, from, direction);
    
                  if (!_this5.alreadyLoadLastChapter) {
                    _this5.video.linkInChapter();
                    _this5.alreadyLoadLastChapter = true;
                  }
                  break;
                case "shop":
                  _this5.currentView = _this5.viewControllers.shop;
                  _this5.currentView.init(route, direction);
                  break;
                case "prevention":
                  _this5.currentView = _this5.viewControllers.contact;
                  _this5.currentView.init(route, direction);
                  break;
                case "project":
                  _this5.currentView = _this5.viewControllers.project;
                  _this5.currentView.init(route, direction);
                  break;
              }
            }
          };
    
          http.open("GET", url, true);
          http.send();
        }
      }, {
        key: "init",
        value: function init() {
          this.route(this.pullRoute());
        }
      }, {
        key: "pullRoute",
        value: function pullRoute() {
          return window.location.href.split("/")[3];
        }
      }, {
        key: "pushRoute",
        value: function pushRoute(route) {
          history.pushState(null, null, route);
        }
      }, {
        key: "route",
        value: function route(_route, direction) {
          if (_route === "" || _route === "home") {
            this.backgroundAudio.currentTime = 0;
            this.offAudio.currentTime = 0;
            this.backgroundAudio.play();
            this.offAudio.play();
          } else {
            this.backgroundAudio.play();
            this.offAudio.pause();
          }
    
          switch (_route) {
            case "":
              this.ajax("home");
              break;
            case "home":
              this.ajax(_route, direction);
              break;
            case "chapter-1":
              this.ajax(_route, direction);
              document.body.classList.remove("no-scroll");
              break;
            case "chapter-2":
              this.ajax(_route, direction);
              document.body.classList.remove("no-scroll");
              break;
            case "chapter-3":
              this.ajax(_route, direction);
              document.body.classList.remove("no-scroll");
              break;
            case "film":
              this.ajax(_route, direction);
              break;
            case "shop":
              this.ajax(_route, direction);
              break;
            case "prevention":
              this.ajax(_route, direction);
              break;
            case "project":
              this.ajax(_route, direction);
              break;
            default:
              this.ajax("404", direction);
              break;
          }
        }
      }]);
    
      return Router;
    }();
    
    exports.default = Router;
    
    },{"../config.json":5,"./Asides":7,"./Header":11,"./Intro":13,"./Video":19}],17:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _helpers = require('../helpers');
    
    var _helpers2 = _interopRequireDefault(_helpers);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Shop = function () {
      function Shop() {
        _classCallCheck(this, Shop);
      }
    
      _createClass(Shop, [{
        key: 'init',
        value: function init(route, direction) {
          var $shop = document.querySelector('.shop');
          TweenMax.to($shop, 1, {
            y: 0,
            ease: Circ.easeInOut,
            onComplete: function onComplete() {
              return _helpers2.default.clearOldDom(route);
            }
          });
    
          this.showTitle();
          this.showText();
          this.showPurshase();
          this.showRectangle();
          this.showImage();
        }
      }, {
        key: 'showTitle',
        value: function showTitle() {
          var splitTitle = new SplitText('.shop--title', { type: 'chars' });
          TweenMax.staggerFrom(splitTitle.chars, .5, { y: '100%', ease: Power1.easeOut, delay: 1 }, .03);
        }
      }, {
        key: 'showText',
        value: function showText() {
          var splitText = new SplitText('.shop--text', { type: 'lines' });
          TweenMax.staggerFrom(splitText.lines, .5, { y: '100%', opacity: 0, ease: Power1.easeOut, delay: 1.2 }, .03);
        }
      }, {
        key: 'showPurshase',
        value: function showPurshase() {
          var $purshase = document.querySelectorAll('.shop--purchase');
          TweenMax.staggerFrom($purshase, .5, { y: '100%', opacity: 0, ease: Power1.easeOut, delay: 1.2 });
        }
      }, {
        key: 'showRectangle',
        value: function showRectangle() {
          var $rectangle = document.querySelectorAll('.shop--purchase svg > rect');
          TweenMax.to($rectangle, 1.4, { strokeDashoffset: '1360px', ease: Power1.easeOut, delay: 1.7 });
        }
      }, {
        key: 'showImage',
        value: function showImage() {
          var $image = document.querySelectorAll('.shop--image');
          TweenMax.staggerFrom($image, 1, { y: '100px', opacity: 0, ease: Power1.easeOut, delay: 1.2 });
        }
      }]);
    
      return Shop;
    }();
    
    exports.default = Shop;
    
    },{"../helpers":6}],18:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    var _lerp = require("../utils/lerp");
    
    var _lerp2 = _interopRequireDefault(_lerp);
    
    var _gsap = require("gsap");
    
    var _gsap2 = _interopRequireDefault(_gsap);
    
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Slider = function () {
      function Slider(className) {
        var _this = this;
    
        _classCallCheck(this, Slider);
    
        this.bind();
        this.className = className;
        this.elementsDom = document.querySelectorAll("" + this.className);
        this.elements = [];
        this.observers = "";
        this.timelines = [];
    
        this.firstSlider = document.querySelector(".hypothyroÃ¯die");
        this.firstSliderWrapper = this.firstSlider.querySelector(".symptoms--wrapper");
        this.secondSlider = document.querySelector(".hyperthyroid");
        this.secondSliderWrapper = this.secondSlider.querySelector(".symptoms--wrapper");
    
        this.scrolledContent = document.querySelector(".scroll-content");
    
        this.onX = 0;
        this.offX = 0;
    
        this.currentX = 0;
        this.lastX = 0;
    
        this.onX2 = 0;
        this.offX2 = 0;
    
        this.currentX2 = 0;
        this.lastX2 = 0;
    
        this.min = -11500;
        this.max = 900;
    
        this.speed = 1.5;
        this.ease = 0.1;
        this.velocity = 25;
    
        this.isDragging = false;
        this.target = null;
        this.currentSlider;
    
        this.elementsDom.forEach(function (element) {
          _this.elements.push({
            selector: element,
            sliderContainer: element.querySelector(".chapter--symptoms"),
            slider: element.querySelector(".chapter--symptoms ul"),
            slides: element.querySelectorAll(".chapter--symptom"),
            progressEl: element.querySelector(".chapter--slider__progress-value"),
            progressValueEl: element.querySelector(".active-slide"),
            progress: 0
          });
        });
        this.setup();
      }
    
      _createClass(Slider, [{
        key: "bind",
        value: function bind() {
          var _this2 = this;
    
          ["run", "setPos", "on", "off"].forEach(function (fn) {
            return _this2[fn] = _this2[fn].bind(_this2);
          });
        }
      }, {
        key: "setup",
        value: function setup() {
          var _this3 = this;
    
          this.observer();
          this.setupTicker();
          this.commonEvents();
          this.elements.forEach(function (element) {
            _this3.slidersEvents(element);
          });
        }
      }, {
        key: "observer",
        value: function observer() {
          var _this4 = this;
    
          this.observers = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.parentNode.parentNode.parentNode.classList.add("is-visible");
                console.log(entry.target.parentNode.parentNode.parentNode);
                var currentIndex = entry.target.parentNode.parentNode.parentNode.parentNode.querySelector(".active-slide");
                currentIndex.innerHTML = entry.target.dataset.symptom;
              } else {
                entry.target.parentNode.parentNode.parentNode.classList.remove("is-visible");
              }
            });
          }, {
            threshold: 0.5
          });
    
          this.elements.forEach(function (element, i) {
            for (var k = 0; k < element.slides.length; k++) {
              _this4.observers.observe(element.slides[k]);
            }
          });
        }
      }, {
        key: "slidersEvents",
        value: function slidersEvents(slider) {
          slider.slider.addEventListener("mousedown", this.on, false);
        }
      }, {
        key: "commonEvents",
        value: function commonEvents() {
          window.addEventListener("mousemove", this.setPos, { passive: true });
          window.addEventListener("mouseup", this.off, false);
        }
      }, {
        key: "setPos",
        value: function setPos(e) {
          if (!this.isDragging) return;
          this.currentSlider === 1 ? this.currentX = _gsap2.default.utils.clamp(this.min, this.max, this.offX + (e.clientX - this.onX) * this.speed) : _gsap2.default.utils.clamp(this.min, this.max, this.currentX2 = this.offX2 + (e.clientX - this.onX2) * this.speed);
        }
      }, {
        key: "on",
        value: function on(e) {
          this.target = e.target;
          this.target.classList.contains("hypothyroÃ¯die") ? this.currentSlider = 1 : this.currentSlider = 2;
          this.isDragging = true;
          this.currentSlider === 1 ? this.onX = e.clientX : this.onX2 = e.clientX;
        }
      }, {
        key: "off",
        value: function off() {
          this.isDragging = false;
          this.offX = this.currentX;
          this.offX2 = this.currentX2;
        }
      }, {
        key: "run",
        value: function run() {
          var scrollSlider1 = this.firstSlider.getBoundingClientRect().y / 5;
          var scrollSlider2 = this.secondSlider.getBoundingClientRect().y / 5;
    
          this.lastX = (0, _lerp2.default)(this.lastX, this.currentX, this.ease);
          this.lastX = Math.floor(this.lastX * 100) / 100;
    
          this.lastX2 = (0, _lerp2.default)(this.lastX2, this.currentX2, this.ease);
          this.lastX2 = Math.floor(this.lastX2 * 100) / 100;
    
          var sd = this.currentX - this.lastX;
          var sd2 = this.currentX2 - this.lastX2;
    
          var acc = sd / window.innerWidth;
          var acc2 = sd2 / window.innerWidth;
          var velo = +acc;
          var velo2 = +acc2;
    
          this.firstSlider.style.transform = "translate3d(" + (this.lastX + scrollSlider1) + "px, 0, 0) skewX(" + velo * this.velocity + "deg)";
          this.secondSlider.style.transform = "translate3d(" + (this.lastX2 + scrollSlider2) + "px, 0, 0) skewX(" + velo2 * this.velocity + "deg)";
        }
      }, {
        key: "setupTicker",
        value: function setupTicker() {
          var _this5 = this;
    
          TweenLite.ticker.addEventListener("tick", function () {
            _this5._tickHandler();
          });
        }
      }, {
        key: "_tickHandler",
        value: function _tickHandler() {
          this.run();
        }
      }]);
    
      return Slider;
    }();
    
    exports.default = Slider;
    
    },{"../utils/lerp":20,"gsap":1}],19:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Video = function () {
      function Video() {
        _classCallCheck(this, Video);
      }
    
      _createClass(Video, [{
        key: 'init',
        value: function init() {
          this.video = document.querySelector('.vid-full');
          this.videoPlayer = this.video.querySelector('.vid-full__video');
          this.ctaPlay = document.querySelectorAll('.aside-left .flex .aside-left--play-button, .trigger-movie');
          this.backgroundAudio = document.querySelector('.background-sound');
          this.offAudio = document.querySelector('.background-sound--off');
          this.initEventListeners();
        }
      }, {
        key: 'linkInChapter',
        value: function linkInChapter() {
          var _this = this;
    
          this.linkChapter = document.querySelectorAll('.trigger-movie');
    
          for (var i = 0; i < this.linkChapter.length; i++) {
            var element = this.linkChapter[i];
            element.addEventListener('click', function () {
              _this.updateCursorToCross();
              _this.video.classList.add('playing');
              _this.offAudio.pause();
              _this.backgroundAudio.pause();
              TweenMax.to(_this.video, 1.5, {
                height: '100vh',
                ease: Circ.easeInOut,
                onComplete: function onComplete() {
                  _this.videoPlayer.play();
                }
              });
            });
          }
        }
      }, {
        key: 'initEventListeners',
        value: function initEventListeners() {
          var _this2 = this;
    
          this.ctaPlay.forEach(function (cta) {
            cta.addEventListener('click', function () {
              _this2.updateCursorToCross();
              _this2.video.classList.add('playing');
              _this2.offAudio.pause();
              _this2.backgroundAudio.pause();
              TweenMax.to(_this2.video, 1.5, {
                height: '100vh',
                ease: Power4.easeInOut,
                onComplete: function onComplete() {
                  _this2.videoPlayer.play();
                }
              });
            });
          });
    
          this.video.addEventListener('click', function () {
            _this2.updateCursorToPointer();
            _this2.videoPlayer.pause();
            if (_this2.pullRoute() === '' || _this2.pullRoute() === 'home') {
              _this2.offAudio.play();
            }
            _this2.backgroundAudio.play();
            TweenMax.to(_this2.video, 1.5, {
              height: 0,
              ease: Power4.easeInOut,
              onComplete: function onComplete() {
                _this2.videoPlayer.currentTime = 0;
                _this2.video.classList.remove('playing');
              }
            });
          });
          this.videoPlayer.addEventListener('ended', function () {
            _this2.videoEnded();
          });
        }
      }, {
        key: 'pullRoute',
        value: function pullRoute() {
          return window.location.href.split("/")[3];
        }
      }, {
        key: 'videoEnded',
        value: function videoEnded() {
          var _this3 = this;
    
          this.updateCursorToPointer();
          this.videoPlayer.pause();
          this.backgroundAudio.play();
          TweenMax.to(this.video, 1.5, {
            height: '0',
            ease: Power4.easeInOut,
            onComplete: function onComplete() {
              _this3.videoPlayer.currentTime = 0;
              _this3.video.classList.remove('playing');
            }
          });
        }
      }, {
        key: 'updateCursorToCross',
        value: function updateCursorToCross() {
          var cursorCircleSvg = document.querySelector('.js-cursor svg.circle circle');
          var cursorCrossSvg = document.querySelectorAll('.js-cursor svg.cross path');
          var pointer = document.querySelector('.js-pointer');
          var timeline = new TimelineMax();
    
          TweenMax.killTweensOf(cursorCircleSvg);
          TweenMax.killTweensOf(cursorCrossSvg);
          TweenMax.killTweensOf(pointer);
    
          timeline.to(pointer, 0.5, {
            autoAlpha: 0,
            ease: Power1.easeOut
          }, 'hide');
    
          timeline.to(cursorCircleSvg, 1.5, {
            strokeDashoffset: '500px',
            ease: Circ.easeInOut
          }, 'hide');
    
          timeline.to(cursorCrossSvg[0], 0.5, {
            strokeDashoffset: '500px'
          });
    
          timeline.to(cursorCrossSvg[1], 0.5, {
            strokeDashoffset: '0'
          }, '-=0.35');
        }
      }, {
        key: 'updateCursorToPointer',
        value: function updateCursorToPointer() {
          var cursorCircleSvg = document.querySelector('.js-cursor svg.circle circle');
          var cursorCrossSvg = document.querySelectorAll('.js-cursor svg.cross path');
          var pointer = document.querySelector('.js-pointer');
          var timeline = new TimelineMax();
    
          TweenMax.killTweensOf(cursorCircleSvg);
          TweenMax.killTweensOf(cursorCrossSvg);
          TweenMax.killTweensOf(pointer);
    
          timeline.to(cursorCrossSvg[1], 0.5, {
            strokeDashoffset: '500px'
          });
    
          timeline.to(cursorCrossSvg[0], 0.5, {
            strokeDashoffset: '250px'
          }, '-=0.35');
    
          timeline.to(cursorCircleSvg, 1.5, {
            strokeDashoffset: '0',
            ease: Circ.easeInOut
          }, 'hide');
    
          timeline.to(pointer, 0.5, {
            autoAlpha: 1,
            ease: Power1.easeOut
          }, 'hide');
        }
      }]);
    
      return Video;
    }();
    
    exports.default = Video;
    
    },{}],20:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.default = lerp;
    function lerp(start, end, value) {
        return (1 - value) * start + value * end;
    }
    
    },{}],21:[function(require,module,exports){
    "use strict";
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    var ease = Power3.easeInOut;
    var duration = 1.5;
    
    exports.default = { ease: ease, duration: duration };
    
    },{}],22:[function(require,module,exports){
    (function (global){
    "use strict";
    
    /*!
     * VERSION: 0.6.0
     * DATE: 2018-05-21
     * UPDATES AND DOCS AT: http://greensock.com
     *
     * @license Copyright (c) 2008-2018, GreenSock. All rights reserved.
     * SplitText is a Club GreenSock membership benefit; You must have a valid membership to use
     * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
     * This work is subject to the software agreement that was issued with your membership.
     *
     * @author: Jack Doyle, jack@greensock.com
     */
    var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : undefined || window;!function (a) {
      "use strict";
      var b = a.GreenSockGlobals || a,
          c = function c(a) {
        var c,
            d = a.split("."),
            e = b;for (c = 0; c < d.length; c++) {
          e[d[c]] = e = e[d[c]] || {};
        }return e;
      },
          d = c("com.greensock.utils"),
          e = function e(a) {
        var b = a.nodeType,
            c = "";if (1 === b || 9 === b || 11 === b) {
          if ("string" == typeof a.textContent) return a.textContent;for (a = a.firstChild; a; a = a.nextSibling) {
            c += e(a);
          }
        } else if (3 === b || 4 === b) return a.nodeValue;return c;
      },
          f = document,
          g = f.defaultView ? f.defaultView.getComputedStyle : function () {},
          h = /([A-Z])/g,
          i = function i(a, b, c, d) {
        var e;return (c = c || g(a, null)) ? (a = c.getPropertyValue(b.replace(h, "-$1").toLowerCase()), e = a || c.length ? a : c[b]) : a.currentStyle && (c = a.currentStyle, e = c[b]), d ? e : parseInt(e, 10) || 0;
      },
          j = function j(a) {
        return a.length && a[0] && (a[0].nodeType && a[0].style && !a.nodeType || a[0].length && a[0][0]) ? !0 : !1;
      },
          k = function k(a) {
        var b,
            c,
            d,
            e = [],
            f = a.length;for (b = 0; f > b; b++) {
          if (c = a[b], j(c)) for (d = c.length, d = 0; d < c.length; d++) {
            e.push(c[d]);
          } else e.push(c);
        }return e;
      },
          l = function l(a, b) {
        for (var c, d = b.length; --d > -1;) {
          if (c = b[d], a.substr(0, c.length) === c) return c.length;
        }
      },
          m = /(?:\r|\n|\t\t)/g,
          n = /(?:\s\s+)/g,
          o = 55296,
          p = 56319,
          q = 56320,
          r = 127462,
          s = 127487,
          t = 127995,
          u = 127999,
          v = function v(a) {
        return (a.charCodeAt(0) - o << 10) + (a.charCodeAt(1) - q) + 65536;
      },
          w = f.all && !f.addEventListener,
          x = " style='position:relative;display:inline-block;" + (w ? "*display:inline;*zoom:1;'" : "'"),
          y = function y(a, b) {
        a = a || "";var c = -1 !== a.indexOf("++"),
            d = 1;return c && (a = a.split("++").join("")), function () {
          return "<" + b + x + (a ? " class='" + a + (c ? d++ : "") + "'>" : ">");
        };
      },
          z = d.SplitText = b.SplitText = function (a, b) {
        if ("string" == typeof a && (a = z.selector(a)), !a) throw "cannot split a null element.";this.elements = j(a) ? k(a) : [a], this.chars = [], this.words = [], this.lines = [], this._originals = [], this.vars = b || {}, this.split(b);
      },
          A = function A(a, b, c) {
        var d = a.nodeType;if (1 === d || 9 === d || 11 === d) for (a = a.firstChild; a; a = a.nextSibling) {
          A(a, b, c);
        } else (3 === d || 4 === d) && (a.nodeValue = a.nodeValue.split(b).join(c));
      },
          B = function B(a, b) {
        for (var c = b.length; --c > -1;) {
          a.push(b[c]);
        }
      },
          C = function C(a) {
        var b,
            c = [],
            d = a.length;for (b = 0; b !== d; c.push(a[b++])) {}return c;
      },
          D = function D(a, b, c) {
        for (var d; a && a !== b;) {
          if (d = a._next || a.nextSibling) return d.textContent.charAt(0) === c;a = a.parentNode || a._parent;
        }return !1;
      },
          E = function E(a) {
        var b,
            c,
            d = C(a.childNodes),
            e = d.length;for (b = 0; e > b; b++) {
          c = d[b], c._isSplit ? E(c) : (b && 3 === c.previousSibling.nodeType ? c.previousSibling.nodeValue += 3 === c.nodeType ? c.nodeValue : c.firstChild.nodeValue : 3 !== c.nodeType && a.insertBefore(c.firstChild, c), a.removeChild(c));
        }
      },
          F = function F(a, b, c, d, e, h, j) {
        var k,
            l,
            m,
            n,
            o,
            p,
            q,
            r,
            s,
            t,
            u,
            v,
            w = g(a),
            x = i(a, "paddingLeft", w),
            y = -999,
            z = i(a, "borderBottomWidth", w) + i(a, "borderTopWidth", w),
            C = i(a, "borderLeftWidth", w) + i(a, "borderRightWidth", w),
            F = i(a, "paddingTop", w) + i(a, "paddingBottom", w),
            G = i(a, "paddingLeft", w) + i(a, "paddingRight", w),
            H = .2 * i(a, "fontSize"),
            I = i(a, "textAlign", w, !0),
            J = [],
            K = [],
            L = [],
            M = b.wordDelimiter || " ",
            N = b.span ? "span" : "div",
            O = b.type || b.split || "chars,words,lines",
            P = e && -1 !== O.indexOf("lines") ? [] : null,
            Q = -1 !== O.indexOf("words"),
            R = -1 !== O.indexOf("chars"),
            S = "absolute" === b.position || b.absolute === !0,
            T = b.linesClass,
            U = -1 !== (T || "").indexOf("++"),
            V = [];for (P && 1 === a.children.length && a.children[0]._isSplit && (a = a.children[0]), U && (T = T.split("++").join("")), l = a.getElementsByTagName("*"), m = l.length, o = [], k = 0; m > k; k++) {
          o[k] = l[k];
        }if (P || S) for (k = 0; m > k; k++) {
          n = o[k], p = n.parentNode === a, (p || S || R && !Q) && (v = n.offsetTop, P && p && Math.abs(v - y) > H && ("BR" !== n.nodeName || 0 === k) && (q = [], P.push(q), y = v), S && (n._x = n.offsetLeft, n._y = v, n._w = n.offsetWidth, n._h = n.offsetHeight), P && ((n._isSplit && p || !R && p || Q && p || !Q && n.parentNode.parentNode === a && !n.parentNode._isSplit) && (q.push(n), n._x -= x, D(n, a, M) && (n._wordEnd = !0)), "BR" === n.nodeName && (n.nextSibling && "BR" === n.nextSibling.nodeName || 0 === k) && P.push([])));
        }for (k = 0; m > k; k++) {
          n = o[k], p = n.parentNode === a, "BR" !== n.nodeName ? (S && (s = n.style, Q || p || (n._x += n.parentNode._x, n._y += n.parentNode._y), s.left = n._x + "px", s.top = n._y + "px", s.position = "absolute", s.display = "block", s.width = n._w + 1 + "px", s.height = n._h + "px"), !Q && R ? n._isSplit ? (n._next = n.nextSibling, n.parentNode.appendChild(n)) : n.parentNode._isSplit ? (n._parent = n.parentNode, !n.previousSibling && n.firstChild && (n.firstChild._isFirst = !0), n.nextSibling && " " === n.nextSibling.textContent && !n.nextSibling.nextSibling && V.push(n.nextSibling), n._next = n.nextSibling && n.nextSibling._isFirst ? null : n.nextSibling, n.parentNode.removeChild(n), o.splice(k--, 1), m--) : p || (v = !n.nextSibling && D(n.parentNode, a, M), n.parentNode._parent && n.parentNode._parent.appendChild(n), v && n.parentNode.appendChild(f.createTextNode(" ")), b.span && (n.style.display = "inline"), J.push(n)) : n.parentNode._isSplit && !n._isSplit && "" !== n.innerHTML ? K.push(n) : R && !n._isSplit && (b.span && (n.style.display = "inline"), J.push(n))) : P || S ? (n.parentNode && n.parentNode.removeChild(n), o.splice(k--, 1), m--) : Q || a.appendChild(n);
        }for (k = V.length; --k > -1;) {
          V[k].parentNode.removeChild(V[k]);
        }if (P) {
          for (S && (t = f.createElement(N), a.appendChild(t), u = t.offsetWidth + "px", v = t.offsetParent === a ? 0 : a.offsetLeft, a.removeChild(t)), s = a.style.cssText, a.style.cssText = "display:none;"; a.firstChild;) {
            a.removeChild(a.firstChild);
          }for (r = " " === M && (!S || !Q && !R), k = 0; k < P.length; k++) {
            for (q = P[k], t = f.createElement(N), t.style.cssText = "display:block;text-align:" + I + ";position:" + (S ? "absolute;" : "relative;"), T && (t.className = T + (U ? k + 1 : "")), L.push(t), m = q.length, l = 0; m > l; l++) {
              "BR" !== q[l].nodeName && (n = q[l], t.appendChild(n), r && n._wordEnd && t.appendChild(f.createTextNode(" ")), S && (0 === l && (t.style.top = n._y + "px", t.style.left = x + v + "px"), n.style.top = "0px", v && (n.style.left = n._x - v + "px")));
            }0 === m ? t.innerHTML = "&nbsp;" : Q || R || (E(t), A(t, String.fromCharCode(160), " ")), S && (t.style.width = u, t.style.height = n._h + "px"), a.appendChild(t);
          }a.style.cssText = s;
        }S && (j > a.clientHeight && (a.style.height = j - F + "px", a.clientHeight < j && (a.style.height = j + z + "px")), h > a.clientWidth && (a.style.width = h - G + "px", a.clientWidth < h && (a.style.width = h + C + "px"))), B(c, J), Q && B(d, K), B(e, L);
      },
          G = function G(a, b, c, d) {
        var g,
            h,
            i,
            j,
            k,
            q,
            w,
            x,
            y,
            z,
            B = b.span ? "span" : "div",
            C = b.type || b.split || "chars,words,lines",
            D = -1 !== C.indexOf("chars"),
            E = "absolute" === b.position || b.absolute === !0,
            F = b.wordDelimiter || " ",
            G = " " !== F ? "" : E ? "&#173; " : " ",
            H = b.span ? "</span>" : "</div>",
            I = !0,
            J = b.specialChars ? "function" == typeof b.specialChars ? b.specialChars : l : null,
            K = f.createElement("div"),
            L = a.parentNode;for (L.insertBefore(K, a), K.textContent = a.nodeValue, L.removeChild(a), a = K, g = e(a), w = -1 !== g.indexOf("<"), b.reduceWhiteSpace !== !1 && (g = g.replace(n, " ").replace(m, "")), w && (g = g.split("<").join("{{LT}}")), k = g.length, h = (" " === g.charAt(0) ? G : "") + c(), i = 0; k > i; i++) {
          if (q = g.charAt(i), J && (z = J(g.substr(i), b.specialChars))) q = g.substr(i, z || 1), h += D && " " !== q ? d() + q + "</" + B + ">" : q, i += z - 1;else if (q === F && g.charAt(i - 1) !== F && i) {
            for (h += I ? H : "", I = !1; g.charAt(i + 1) === F;) {
              h += G, i++;
            }i === k - 1 ? h += G : ")" !== g.charAt(i + 1) && (h += G + c(), I = !0);
          } else "{" === q && "{{LT}}" === g.substr(i, 6) ? (h += D ? d() + "{{LT}}</" + B + ">" : "{{LT}}", i += 5) : q.charCodeAt(0) >= o && q.charCodeAt(0) <= p || g.charCodeAt(i + 1) >= 65024 && g.charCodeAt(i + 1) <= 65039 ? (x = v(g.substr(i, 2)), y = v(g.substr(i + 2, 2)), j = x >= r && s >= x && y >= r && s >= y || y >= t && u >= y ? 4 : 2, h += D && " " !== q ? d() + g.substr(i, j) + "</" + B + ">" : g.substr(i, j), i += j - 1) : h += D && " " !== q ? d() + q + "</" + B + ">" : q;
        }a.outerHTML = h + (I ? H : ""), w && A(L, "{{LT}}", "<");
      },
          H = function H(a, b, c, d) {
        var e,
            f,
            g = C(a.childNodes),
            h = g.length,
            j = "absolute" === b.position || b.absolute === !0;if (3 !== a.nodeType || h > 1) {
          for (b.absolute = !1, e = 0; h > e; e++) {
            f = g[e], (3 !== f.nodeType || /\S+/.test(f.nodeValue)) && (j && 3 !== f.nodeType && "inline" === i(f, "display", null, !0) && (f.style.display = "inline-block", f.style.position = "relative"), f._isSplit = !0, H(f, b, c, d));
          }return b.absolute = j, void (a._isSplit = !0);
        }G(a, b, c, d);
      },
          I = z.prototype;I.split = function (a) {
        this.isSplit && this.revert(), this.vars = a = a || this.vars, this._originals.length = this.chars.length = this.words.length = this.lines.length = 0;for (var b, c, d, e = this.elements.length, f = a.span ? "span" : "div", g = y(a.wordsClass, f), h = y(a.charsClass, f); --e > -1;) {
          d = this.elements[e], this._originals[e] = d.innerHTML, b = d.clientHeight, c = d.clientWidth, H(d, a, g, h), F(d, a, this.chars, this.words, this.lines, c, b);
        }return this.chars.reverse(), this.words.reverse(), this.lines.reverse(), this.isSplit = !0, this;
      }, I.revert = function () {
        if (!this._originals) throw "revert() call wasn't scoped properly.";for (var a = this._originals.length; --a > -1;) {
          this.elements[a].innerHTML = this._originals[a];
        }return this.chars = [], this.words = [], this.lines = [], this.isSplit = !1, this;
      }, z.selector = a.$ || a.jQuery || function (b) {
        var c = a.$ || a.jQuery;return c ? (z.selector = c, c(b)) : "undefined" == typeof document ? b : document.querySelectorAll ? document.querySelectorAll(b) : document.getElementById("#" === b.charAt(0) ? b.substr(1) : b);
      }, z.version = "0.6.0";
    }(_gsScope), function (a) {
      "use strict";
      var b = function b() {
        return (_gsScope.GreenSockGlobals || _gsScope)[a];
      };"undefined" != typeof module && module.exports ? module.exports = b() : "function" == typeof define && define.amd && define([], b);
    }("SplitText");
    
    }).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
    
    },{}],23:[function(require,module,exports){
    'use strict';
    
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    
    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
    
    var Parallax = function () {
      function Parallax(className, scrollbar) {
        var _this = this;
    
        _classCallCheck(this, Parallax);
    
        this.windowHeight = window.innerHeight;
        this.target = document.querySelectorAll('.' + className);
        this.targetObjs = [];
        this.targetData = [];
        this.observer = '';
        this.scrollbar = scrollbar;
        this.threshold = -350;
    
        this.target.forEach(function (element) {
          if (element.getAttribute('data-active') !== 'true') {
            element.setAttribute('data-active', 'false');
          }
          _this.targetObjs.push({
            selector: element
          });
        });
    
        this.getData();
    
        this.initObserver();
        this.initEvents();
    
        this.updateElements();
      }
    
      _createClass(Parallax, [{
        key: 'initObserver',
        value: function initObserver() {
          var _this2 = this;
    
          this.observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                if (entry.target.getAttribute('data-children') == 'true') {
                  entry.target.parentElement.setAttribute('data-active', 'true');
                } else {
                  entry.target.setAttribute('data-active', 'true');
                }
              } else if (!entry.isIntersecting) {
                if (entry.target.getAttribute('data-children') == 'true') {
                  entry.target.parentElement.setAttribute('data-active', 'false');
                } else {
                  entry.target.setAttribute('data-active', 'false');
                }
              }
            });
          });
    
          this.targetObjs.forEach(function (target) {
            if (target.selector.getAttribute('data-children') == 'true') {
              _this2.observer.observe(target.selector.firstElementChild);
            } else {
              _this2.observer.observe(target.selector);
            }
          });
        }
      }, {
        key: 'checkVisible',
        value: function checkVisible(elm, threshold, mode) {
          threshold = threshold || 0;
          mode = mode || 'visible';
    
          var rect = elm.getBoundingClientRect();
          var viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
          var above = rect.bottom - threshold < 0;
          var below = rect.top - viewHeight + threshold >= 0;
    
          return mode === 'above' ? above : mode === 'below' ? below : !above && !below;
        }
    
        /**
         * function initEvents
         * Add event listener
         */
    
      }, {
        key: 'initEvents',
        value: function initEvents() {
          var _this3 = this;
    
          // window.addEventListener('scroll', evt => this.updateElements(evt))
          this.scrollbar.addListener(function (s) {
            return _this3.checkIfElementsAreInScreen(s);
          });
          this.scrollbar.addListener(function (s) {
            return _this3.updateElements(s);
          });
        }
      }, {
        key: 'checkIfElementsAreInScreen',
        value: function checkIfElementsAreInScreen() {
          var _this4 = this;
    
          this.targetObjs.forEach(function (target) {
            var testedTarget = '';
    
            if (target.selector.getAttribute('data-children') == 'true') {
              testedTarget = target.selector.firstElementChild;
            } else {
              testedTarget = target.selector;
            }
    
            if (_this4.checkVisible(testedTarget, _this4.threshold)) {
              if (testedTarget.getAttribute('data-children') == 'true') {
                testedTarget.parentElement.setAttribute('data-active', 'true');
              } else {
                testedTarget.setAttribute('data-active', 'true');
              }
            } else {
              if (testedTarget.getAttribute('data-children') == 'true') {
                testedTarget.parentElement.setAttribute('data-active', 'false');
              } else {
                testedTarget.setAttribute('data-active', 'false');
              }
            }
          });
        }
    
        /**
         * function updateElements
         * Update translateY value for all targeted element
         * @return void
         */
    
      }, {
        key: 'updateElements',
        value: function updateElements() {
          for (var i = 0; i < this.targetObjs.length; i++) {
            if (this.targetObjs[i].selector.getAttribute('data-active') == 'true') {
              if (this.targetData[i].dataDirection == 'down') {
                var offset = this.getTargetPos(this.targetObjs[i].selector) * -1;
              } else {
                var offset = this.getTargetPos(this.targetObjs[i].selector);
              }
    
              if (this.targetData[i].hadTransform) {
                var translateX = this.targetData[i].transform.X;
                var translateY = (parseInt(this.targetData[i].transform.Y) + offset) * (this.targetData[i].dataSpeed / 100);
    
                this.targetObjs[i].selector.style.transform = 'translate3d(' + translateX + 'px, ' + translateY + 'px, 0)';
              } else {
                this.targetObjs[i].selector.style.transform = 'translate3d(0, ' + offset * (this.targetData[i].dataSpeed / 100) + 'px, 0)';
              }
            }
          }
        }
    
        /**
         * function getData
         * Get the value of data-speed for all target element
         * @return this
         */
    
      }, {
        key: 'getData',
        value: function getData() {
          var arr = [];
    
          for (var i = 0; i < this.targetObjs.length; i++) {
            var dataSpeed = this.targetObjs[i].selector.getAttribute('data-speed') ? this.targetObjs[i].selector.getAttribute('data-speed') : 5;
            var dataDirection = this.targetObjs[i].selector.getAttribute('data-direction') ? this.targetObjs[i].selector.getAttribute('data-direction') : 'down';
    
            var transformMatrix = window.getComputedStyle(this.targetObjs[i].selector).transform;
    
            var hasTransform = transformMatrix != 'none' ? true : false;
    
            var input = {
              dataSpeed: dataSpeed,
              dataDirection: dataDirection,
              hadTransform: hasTransform
            };
    
            if (hasTransform) {
              var transform = this.transformMatrixToPx(transformMatrix);
              input.transform = transform;
            }
    
            arr.push(input);
          }
    
          this.targetData = arr;
        }
    
        /**
         * function getTargetPos
         * @param object   Element targeted
         * @return int     Position of the element relatively from the viewport
         */
    
      }, {
        key: 'getTargetPos',
        value: function getTargetPos(elem) {
          var rect = elem.getBoundingClientRect();
          return rect.top + rect.height / 2 - this.windowHeight / 2;
        }
      }, {
        key: 'updateDataElements',
        value: function updateDataElements() {
          this.getData();
          this.updateElements();
        }
    
        /**
         * function transformMatrixToPx
         * Transform the matrix that we get with elem.getComputedStyle and transform it to px value
         * @param   matrix   string
         * @return   object
         */
    
      }, {
        key: 'transformMatrixToPx',
        value: function transformMatrixToPx(matrix) {
          var tr = matrix.split('(')[1],
              tr = tr.split(')')[0],
              tr = tr.split(',');
    
          return {
            X: tr[4],
            Y: tr[5]
          };
        }
      }]);
    
      return Parallax;
    }();
    
    exports.default = Parallax;
    
    },{}]},{},[4])
    
    //# sourceMappingURL=bundle.js.map