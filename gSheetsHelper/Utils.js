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

function getLastFilledFirstColumnRow(sheet, startFrom) {
  var firstColumn = sheet.getRange(1, 1, sheet.getLastRow(), 1);
  var firstColumnData = firstColumn.getValues();
  for (var i = startFrom != null ? startFrom - 1 : 0, len = firstColumnData.length; i < len; i++) {
    if (firstColumnData[i][0] == "")
      return i;
  }
  return firstColumnData.length;
}

function todayCST() {
  var today = new Date();
  var offset = today.getTimezoneOffset(); // Offset to UTC
  var utc = today.getTime() + offset * 60000; // Convert to UTC
  today = new Date(utc + 3600000 * -5); // Convert to Central Standard Time
  return today;
}

function isCurrentHourWithin(minHour, minMinute, maxHour, maxMinute) {
  var today = todayCST();
  var minHour = new Date(today);
  minHour.setHours(minHour, minMinute, 0);
  var maxHour = new Date(today);
  maxHour.setHours(maxHour, maxMinute, 0);
  return today >= minHour && today <= maxHour;
}

function Create2DArray(rows, cols) {
  if (cols == null)
    cols = 0;
  var arr = [];
  for (var i = 0; i < rows; i++) {
    arr[i] = new Array(cols);
    for (var j = 0; j < cols; j++)
      arr[i][j] = null;
  }
  return arr;
}

function setArrayItemsToNull(arr) {
  var len = arr.length;
  for (var i = 0; i < len; i++)
    arr[i] = null;
}