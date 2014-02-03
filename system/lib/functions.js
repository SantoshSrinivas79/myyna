/*
 * System functions
 * 
 * @package Sleek.js
 * @version 1.0
 * 
 * The MIT License (MIT)

 * Copyright Cubet Techno Labs, Cochin (c) 2013 <info@cubettech.com>

 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * @author Robin <robin@cubettech.com>
 * @Date 12-11-2013
 */
var path = require('path');
var fs = require('fs');
var async = require('async');

//Function to extend a json
var fns = {
    extendJSON:function (target) {
        var sources = [].slice.call(arguments, 1);
        sources.forEach(function (source) {
            for (var prop in source) {
                target[prop] = source[prop];
            }
        });
        return target;
    },
    _getCallerFile: function() {
        try {
            var err = new Error(),callerfile,currentfile;       
            Error.prepareStackTrace = function (err, stack) {return stack;};
            err.stack.shift();
            currentfile=err.stack.shift().getFileName();
            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName();
                if(currentfile!==callerfile) return callerfile;
            }
        } catch (err) {}
            return undefined;
    },
    _getCalleeFile: function() {
        try {
            var err = new Error(),callerfile,currentfile; 
            err.stack.shift();
            Error.prepareStackTrace = function (err, stack) {return stack;};
            currentfile=err.stack.shift().getFileName();
            while (err.stack.length) {
                callerfile = err.stack.shift().getFileName();
                if(currentfile!==callerfile) return callerfile;
            }
        } catch (err) {}
            return undefined;
    },
    _getCalleeLine: function(){
       try {
           var err = new Error(),callerfile,currentfile;      
           Error.prepareStackTrace = function (err, stack) {return stack;};
           err.stack.shift();
           currentfile=err.stack.shift().getLineNumber();
           while (err.stack.length) {
               callerfile = err.stack.shift().getLineNumber();
               if(currentfile!==callerfile) return callerfile;
           }
       } catch (err) {}
           return undefined;
    },
    _rand: function(count)
    {
        count = typeof count !== 'undefined' ? count : 12;
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

        for( var i=0; i < count; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    _render: function(res,view,passedData){
        var cmp = system.getCompiledView(view, passedData,true);
        var fname = this._rand() + new Date().getTime()+ '.html';
        if (!fs.existsSync(path.join(appPath,'application/var/tmp/'))){
            fs.mkdirSync(path.join(appPath,'application/var/tmp/'), 0777)
        }
        
        if(passedData && passedData.PLUGINS){
            passedData.PLUGINS.sort(fns._compare);
            async.eachSeries(passedData.PLUGINS, function (plug, clbk) {
                if(plug.mode == 'prepend'){
                    cmp = plug.data + cmp;
                } else if (plug.mode == 'replace') {
                    cmp = plug.data;
                } else {
                    cmp += plug.data;
                }
                clbk();
            }, function(){
                fns._makeView(res,fname,cmp,passedData);
            });
            
        } else {
            fns._makeView(res,fname,cmp,passedData);
        }
        
         
    },
    _makeView: function(res,fname,data,passedData){
        fs.writeFile(path.join(appPath,'application/var/',"/tmp/", fname), data, function(err) {
            if(err) {
                console.log(err);
            }
            res.render(path.join(appPath,'application/var/',"/tmp/", fname), passedData, function(er, html){
              fs.unlink(path.join(appPath,'application/var/',"/tmp/", fname))
              res.send(html);
            });
        });
    },
    _compare: function (a,b) {
        if (a.prio < b.prio)
           return -1;
        if (a.prio > b.prio)
          return 1;
        return 0;
    }
};

module.exports = fns;