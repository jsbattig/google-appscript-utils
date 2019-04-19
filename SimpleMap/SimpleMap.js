/* 
    Copyright 2019 Ascentis Corporation

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software 
    and associated documentation files (the "Software"), to deal in the Software without restriction, 
    including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
    subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial 
    portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
    LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
    IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH 
    THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

function SimpleMap(preppendUnderscore, items) {
  this.map = new Object(null);
  this.preppendUnderscore = preppendUnderscore;    
  
  this.put = function(k, v) {
    this.map[makeKey(k, this.preppendUnderscore)] = v;
  }  
  
  this.remove = function(k) {    
    delete this.map[makeKey(k, this.preppendUnderscore)];    
  } 
  
  this.get = function(k, returnNullIfNotExists) {    
    var key = makeKey(k, this.preppendUnderscore);
    if (returnNullIfNotExists || this.map.hasOwnProperty(key))
      return this.map[key];
    else
      throw ("Key '" + k + "' doesn't exist"); 
  }
  
  this.exists = function(k) {    
    return this.map.hasOwnProperty(makeKey(k, this.preppendUnderscore));
  }
  
  this.matchKey = function(key) {
    var result = false;
    this.forEach(function (k) {
      if (result)
        return;
      var regExp = new RegExp(cleanKey(k, preppendUnderscore));
      if (regExp.test(key))
        result = true;
    });
    return result;
  }
  
  this.matchValue = function(val) {
    var result = false;
    var self = this;
    this.forEach(function (k) {
      if (result)
        return;
      var v = self.get(cleanKey(k, self.preppendUnderscore));
      var regExp = new RegExp(v);
      if (regExp.test(val))
        result = true;
    });
    return result;
  }
  
  this.clear = function() {
    var self = this;
    this.forEach(function (k) {
      if (self.preppendUnderscore)
        self.remove(k.substring(1, k.length));
      else
        self.remove(k);
    });
  }
  
  this.forEach = function(callback) { 
    Object.getOwnPropertyNames(this.map).forEach(callback);
  }  
  
  /* Initialize our map with items parameter, if provided */
  if (items != null) {
    var len = items.length;
    for (var i = 0; i < len; i++)
      if (typeof items[i] == "object")
        this.put (items[i].k, items[i].v);
      else
        this.put (items[i]);     
  }
  
  /* Private Functions */
  
  function makeKey(k, preppendUnderscore) {    
    return (preppendUnderscore ? "_" : "") + k;
  }
  
  function cleanKey(k, preppendUnderscore) {
    return (preppendUnderscore ? k.substr(1, k.length) : k);
  }
}

