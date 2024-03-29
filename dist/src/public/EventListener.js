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
import { FormEvents } from '../control/events/FormEvents.js';
/**
 * Implements addEventListener. Meant for extending custom classes that needs event listeners
 */
export class EventListener {
    /** Remove an eventlistener. This should also be done before setView is called
  *
  * @param handle - The handle of the event listener to be removed.
  * @public
  */
    removeEventListener(handle) {
        FormEvents.removeListener(handle);
    }
    /** Add an eventlistener
  *
  * @param method - The callback function to be executed when the event occurs.
  * @param filter - An optional event filter or an array of event filters to control which events trigger the callback.
  * @returns A handle representing the added event listener.
  * @public
  */
    addEventListener(method, filter) {
        return (FormEvents.addListener(null, this, method, filter));
    }
}
