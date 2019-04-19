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

function ObjectArrayToSheetTransformer(sheet, columnsCollection) {
  /* Private Stuff */
  
  this.sheet = sheet;
  this.columnsCollection = columnsCollection;
  
  this.keyName = "";
  this.keyDictionary = null;
  
  this.nextRow = 0;
  this.columnCount = 0;
  this.targetBuffer= null;
  this.targetBufferRowIndex = 0;
  
  this.fillTitles = false;  
  
  this.excludesFilter = null; /* type:SimpleMap */
  this.includesFilter = null; /* type:SimpleMap */
  this.excludeColumns = null; /* type:SimpleMap */
  this.includeColumns = null; /* type:SimpleMap */

  this.objectToSheet = function(obj, columnPrefix, root) {  
    var self = this;
    Object.getOwnPropertyNames(obj).forEach(function (key) {
      var fullKeyName = columnPrefix + key;
      if(obj[key] != null && typeof obj[key] == "object")
        self.objectToSheet(obj[key], fullKeyName + ".", false);      
      else {   
        if ((self.excludeColumns != null && self.excludeColumns.matchKey(fullKeyName)) ||
            (self.includeColumns != null && !self.includeColumns.matchKey(fullKeyName)))
          return;        
        var column = self.columnsCollection.get(fullKeyName, true);      
        if (self.fillTitles) {
          if(column == null)           
            self.columnsCollection.put(fullKeyName, ++self.columnCount);        
        }
        else {
          if (self.targetBuffer.length <= self.targetBufferRowIndex) {
            self.targetBuffer.push (new Array(self.columnCount));
            setArrayItemsToNull(self.targetBuffer[self.targetBufferRowIndex]);
          }
          self.targetBuffer[self.targetBufferRowIndex][column - 1] = obj[key];
        }
      }
    });
    if (!this.fillTitles && root) 
      this.outputToBufferConditional();
  }
  
  this.outputToBufferConditional = function () {    
    var key = null;
    if (this.keyName != "") 
      key = this.targetBuffer[this.targetBufferRowIndex][this.columnsCollection.get(this.keyName) - 1];          
    if ((this.keyName == "" || !this.keyDictionary.exists(key)) && this.filterData()) {
      if (this.keyName != "")
        this.keyDictionary.put(key);
      this.targetBufferRowIndex++;
      this.nextRow++;      
    } else 
      setArrayItemsToNull(this.targetBuffer[this.targetBufferRowIndex]);            
  }
  
  this.foundInFilter = function(map, key) {
    if (!this.columnsCollection.exists(key))
      return false;
    var keyValues = map.get(key);        
    var val = this.targetBuffer[this.targetBufferRowIndex][this.columnsCollection.get(key) - 1];
    if (keyValues.exists(val))
      return true;      
    return false;    
  }
  
  this.filterData = function() {        
    if (this.includesFilter == null && this.excludesFilter == null)
      return true;
    var include = true;
    var self = this;
    if (self.includesFilter != null) {
      self.includesFilter.forEach(function (key) {        
        if (!self.foundInFilter (self.includesFilter, key)) {
          include = false;
          return;
        }
      });
    }
    if (!include)
      return false;
    if (self.excludesFilter != null) {
      self.excludesFilter.forEach(function (key) {        
        if (self.foundInFilter (self.excludesFilter, key)) {
          include = false;
          return;
        }        
      });
    }    
    return include;
  }
  
  /* Public Methods */
  
  this.getTargetBuffer = function () {
    return this.targetBuffer;
  }  
  
  this.enableAvoidDuplicates = function (keyName) {
    if (keyName == "")
      throw ("keyName must be != blank string to enable dedupping calling ObjectArrayToSheetTransformer.enableAvoidDuplicates");
    this.keyName = keyName;
    this.keyDictionary = new SimpleMap.SimpleMap(true);    
  }
  
  this.disableAvoidDuplicates = function() {
    this.keyName = "";
    this.keyDictionary = null;
  }
  
  this.setExcludesFilter = function(/* type:SimpleMap */ excludesFilter) {
    this.excludesFilter = excludesFilter;    
  }
  
  this.setIncludesFilter = function(/* type:SimpleMap */ includesFilter) {
    this.includesFilter = includesFilter;    
  }
  
  this.setIncludeColumns = function(/* type:SimpleMap */ includeColumns) {
    this.includeColumns = includeColumns;
  }
  
  this.setExcludeColumns = function(/* type:SimpleMap */ excludeColumns) {
    this.excludeColumns = excludeColumns;
  }
  
  this.objectArrayToSheet = function(arr, nextRow, columnCount) {  
    this.nextRow = nextRow;
    this.columnCount = columnCount; 
    this.targetBuffer = null;
    this.fillTitles = true;
    // First call to fill the titles row. We will recursively evaluate the first object in the values array  
    for each(item in arr) {              
      this.objectToSheet(item, "", true);      
    }
    // Let's populate the sheet first row with all column names  
    var sheetColumn = 1;
    this.columnsCollection.forEach(function (key) {
      sheet.getRange(1, sheetColumn++).setValue(key);
    });  
    this.fillTitles = false;
    this.targetBuffer = Create2DArray(arr.length, this.columnCount);
    this.targetBufferRowIndex = 0;
    // Now fill in values
    for each(item in arr) {               
      this.objectToSheet(item, "", true);
    }
    while (this.targetBuffer.length > this.nextRow - nextRow)
      this.targetBuffer.pop(); // Remove the last element, it got filtered out
    return { "nextRow" : this.nextRow, "columnCount" : this.columnCount };
  } 
}