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

function Test_SimpleMap() {
  var map = new SimpleMap(true);
  
  map.put("Hello");
  gsTest.checkFalse(map.exists(null), "Null is not part of map");
  gsTest.checkFalse(map.exists(""), "Blank string is not part of map");
  gsTest.checkTrue(map.exists("Hello"), "Hello item must exist");
  gsTest.checkFalse(map.exists("World"), "World item must not exist");
  
  map.remove("Hello");
  gsTest.checkFalse(map.exists("Hello"), "Hello item must not exist. It was removed");  
  
  map.put("Hello");
  gsTest.checkTrue(map.exists("Hello"), "Hello item must exist. It was added back");
  
  map.put("World");
  gsTest.checkTrue(map.exists("World"), "World item must exist");
  
  map.clear();
  gsTest.checkFalse(map.exists("World"), "World item must not exist. Cleared");
  gsTest.checkFalse(map.exists("Hello"), "Hello item must not exist. Cleared");

  map.clear();
  map.put("Hello", "World");
  gsTest.checkTrue(map.get("Hello") == "World", "Failed to retrieve value for Hello");

  try {
    map.get("World");
    throw ("Expected exception retrieving unexisting key World");
  } catch(e) {
    gsTest.checkTrue(e == "Key 'World' doesn't exist", "Expected different exception. Got: " + e);
  }
  
  var map2 = new SimpleMap(true, ["hello", "world"]);
  gsTest.checkTrue(map2.exists("hello"), "hello item must exist");
  gsTest.checkTrue(map2.exists("world"), "world item must exist");
  
  var map3 = new SimpleMap(true, [{k : "hello", v : "world"}, 
                                  {k : "hello world", v : "world hello"}]);
  gsTest.checkTrue(map3.exists("hello"), "hello item must exist");
  gsTest.checkTrue(map3.exists("hello world"), "world item must exist");
  gsTest.checkTrue(map3.get("hello") == "world", "Value of key hello should be world");
  gsTest.checkTrue(map3.get("hello world") == "world hello", "Value of key hello world should be world hello");
  gsTest.checkTrue(map3.matchKey("hello"), "RegEx match should return true");
  gsTest.checkFalse(map3.matchKey("hell"), "RegEx match should return false");
  gsTest.checkTrue(map3.matchKey("hellos"), "RegEx match should return true");
  gsTest.checkTrue(map3.matchKey("hello"), "RegEx match should return true");
  gsTest.checkTrue(map3.matchKey("hello world"), "RegEx match should return true"); 
}