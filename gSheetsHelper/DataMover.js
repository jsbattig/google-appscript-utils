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

function moveSheetData(sourceSheet, targetSheet, startRow, map, columnsCollection, columnsCount) {  
  if (getLastFilledFirstColumnRow(sourceSheet) <= 2)
    return;
  var sourceRange = sourceSheet.getRange(startRow, 1, getLastFilledFirstColumnRow(sourceSheet) - startRow + 1, sourceSheet.getLastColumn());  
  var sourceBuffer = sourceRange.getValues();
  var targetRange = targetSheet.getRange(startRow, 1, sourceBuffer.length, columnsCount != null ? columnsCount : targetSheet.getLastColumn());  
  var targetBuffer = Create2DArray(sourceBuffer.length);
  for(var row = 0, bufLen = sourceBuffer.length; row < bufLen; row++) {    
    var col = 0;
    Object.getOwnPropertyNames(map).forEach(function (key) {
      var value = "";
      if (columnsCollection.exists(key))
        value = sourceBuffer[row][columnsCollection.get(key) - 1];      
      targetBuffer[row][col++] = value;       
    });
  }   
  targetRange.setValues(targetBuffer);
}