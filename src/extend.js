/*
 * gextend
 * https://github.com/goliatone/gextend
 * Created with gbase.
 * Copyright (c) 2014 goliatone
 * Licensed under the MIT license.
 */
/* jshint strict: false, plusplus: true */
/*global define: false, require: false, module: false, exports: false */
(function(root, name, deps, factory) {
    "use strict";
    // Node
    if (typeof deps === 'function') {
        factory = deps;
        deps = [];
    }

    if (typeof exports === 'object') {
        module.exports = factory.apply(root, deps.map(require));
    } else if (typeof define === 'function' && 'amd' in define) {
        //require js, here we assume the file is named as the lower
        //case module name.
        define(name.toLowerCase(), deps, factory);
    } else {
        // Browser
        var d, i = 0,
            global = root,
            old = global[name],
            mod;
        while ((d = deps[i]) !== undefined) deps[i++] = root[d];
        global[name] = mod = factory.apply(global, deps);
        //Export no 'conflict module', aliases the module.
        mod.noConflict = function() {
            global[name] = old;
            return mod;
        };
    }
}(this, "extend", function() {
    
    /**
     * Extend method.
     * @param  {Object} target Source object
     * @return {Object}        Resulting object from
     *                         extending target to params.
     */
    const _extend = function extend(target) {
        let sources = [].slice.call(arguments, 1);

        let skip = _buildCheck(_extend._attr);

        sources.forEach(function(source) {
            if (!source) return;
            
            for (let property in source) {
                if (skip(property)) continue;
                
                let targetVal = target[property];
                let sourceVal = source[property];
                
                if(_extend.mergeArrays && areArray(sourceVal, targetVal) {
                   target[property] = targetVal.concat(sourceVal);
                } else if (isObject(sourceVal)) {
                    target[property] = targetVal || {};
                    if (typeof targetVal === 'function') target[property] = sourceVal; //<<< ADD
                    else target[property] = extend(targetVal, sourceVal);
                } else target[property] = sourceVal;
            }
        });

        _extend.unshim(target);

        _extend._attr = null;

        return target;
    };
    
    _extend.mergeArrays = false;

    function _buildCheck(attributes) {

        if (typeof attributes === 'function') return attributes;

        if (Array.isArray(attributes)) {
            return function(attribute) {
                return attributes.indexOf(attribute) === -1;
            }
        }

        if (typeof attributes === 'boolean') return function(attribute) {
            return !attributes;
        }

        if (!attributes) return function(attribute) {
            return false;
        }
    }

    _extend.buildCheck = _buildCheck;

    /**
     * Only extend our object with the 
     * attributes present in the `attributes`
     * array.
     * @param {Array} attributes List of attributes
     * @return {Object} Returns the `extend` object
     */
    _extend.only = function(attributes) {
        _extend._attr = attributes;
        /**
         * TODO: We should return this
         * so we can to extend.only(att).do()
         */
        // return {extend: _extend};
        return _extend;
    };

    /**
     * Wraps an object in a function
     * so that we don't pollute a stand 
     * in object, e.g. if we want to have
     * a temporary `logger` using the 
     * built in console we wrap the `console`
     * object in a shim.
     * 
     * Note that we call `unshim` after
     * we extend our object so there is
     * no need for you to call this manually.
     */
    _extend.shim = function(obj) {
        let shim = _ => obj;
        shim.__shim = true;
        return shim;
    };

    _extend.unshim = function(obj) {
        for (let property in obj) {
            if (typeof(obj[property]) === 'function' && obj[property].__shim) {
                obj[property] = obj[property]();
                delete obj[property].__shim;
            }
        }
        return _extend;
    };
    
    function isObject(obj) {
        return obj && obj.constructor && obj.constructor === Object;
    }
    
    function areArray(a1, a2) {
        return Array.isArray(a1) && Array.isArray(a2);   
    }


    _extend.VERSION = '0.6.1';

    return _extend;
}));
