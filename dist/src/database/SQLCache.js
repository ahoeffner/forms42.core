/*
  MIT License

  Copyright © 2023 Alex Høffner

  Permission is hereby granted, free of charge, to any person obtaining a copy of this software
  and associated documentation files (the “Software”), to deal in the Software without
  restriction, including without limitation the rights to use, copy, modify, merge, publish,
  distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the
  Software is furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all copies or
  substantial portions of the Software.

  THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
  BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
  DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
export class SQLCache {
    static cache$ = new Map();
    static get(sql, maxage) {
        let entry = SQLCache.cache$.get(sql);
        if (maxage && maxage > 0) {
            let now = new Date().getTime();
            if (now > entry.timestamp + maxage) {
                SQLCache.cache$.delete(sql);
                return (null);
            }
        }
        return (entry?.response);
    }
    static put(sql, response) {
        SQLCache.cache$.set(sql, new Entry(response));
    }
    clear() {
        SQLCache.cache$.clear();
    }
}
class Entry {
    response;
    timestamp = new Date().getTime();
    constructor(response) {
        this.response = response;
    }
    ;
}
