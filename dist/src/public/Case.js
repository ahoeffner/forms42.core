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
/**
 * Types of upper/lower casing of strings.
 *
 * @enum {number}
 */
export var Case;
(function (Case) {
    /**
     * Represents mixed casing of strings.
     */
    Case[Case["mixed"] = 0] = "mixed";
    /**
     * Represents lower casing of strings.
     */
    Case[Case["lower"] = 1] = "lower";
    /**
     * Represents upper casing of strings.
     */
    Case[Case["upper"] = 2] = "upper";
    /**
     * Represents initial capitalization (initcap) of strings.
     */
    Case[Case["initcap"] = 3] = "initcap";
})(Case || (Case = {}));
