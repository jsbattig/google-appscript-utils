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

function snapshotRange(sourceRange, targetSheet) {
  var sourceData = sourceRange.getValues();
  var targetColumnCount = targetSheet.getLastColumn();
  var targetColumns = targetSheet.getRange(1, 1, 1, targetColumnCount).getValues();  
  var targetColumnsDictionary = {};  
  var i = 1;
  targetColumns[0].forEach(function (item) {
    targetColumnsDictionary[item] = i++;
  });  
    
  var row = getLastFilledFirstColumnRow(targetSheet) + 1;
  var bufferRow = 0;
  var today = todayCST();  
  sourceData.forEach(function (dataRow) {    
    targetSheet.getRange(row, 1, 1, 1).setValue(today);
    i = 0;
    dataRow.forEach(function (item) {      
      var columnName = sourceData[0][i] != "" ? sourceData[0][i] : "none";
      targetColumnIndex = targetColumnsDictionary[columnName];
      if (targetColumnIndex == null) {        
        targetColumnsDictionary[columnName] = ++targetColumnCount;
        targetSheet.getRange(1, targetColumnCount, 1, 1).setValue(columnName);
        targetColumnIndex = targetColumnCount;
      }      
      if(bufferRow > 0) {
        var targetRange = targetSheet.getRange(row, targetColumnIndex, 1, 1);
        targetRange.setValue(sourceData[bufferRow][i]);
      }
      i++;
    });        
    if(bufferRow > 0)
      row++;
    bufferRow++;
  });  
}
