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

import { BindValue } from "../BindValue.js";
import { Serializable } from "./Serializable.js";
import { DataSource } from "../../model/interfaces/DataSource.js";

export class Insert implements Serializable
{
	private retcols:string[] = null;
	private source:DataSource = null;

	private values:Map<string,BindValue> =
		new Map<string,BindValue>();

	private rettypes:Map<string,BindValue> =
		new Map<string,BindValue>();

	constructor(source:DataSource, values:BindValue|BindValue[], retcols?:string|string[], rettypes?:BindValue|BindValue[])
	{
		if (!retcols)
			retcols = [];

		if (!Array.isArray(values))
			values = [values];

		if (!Array.isArray(retcols))
			retcols = [retcols];

		if (!Array.isArray(rettypes))
			rettypes = [rettypes];

		this.source = source;
		this.retcols = retcols;

		values.forEach((value) =>
			this.values.set(value.name,value));

		rettypes.forEach((type) =>
			this.rettypes.set(type.name,type));
	}

	public serialize() : any
	{
		let json:any = {};
		json.function = "create";
		json.source = this.source.name;

		let cols:any[] = [];

		this.values.forEach((value) =>
		{
			cols.push(
				{
					column: value.column,
					value: value.serialize()
				}
			)
		})

		json.values = cols;

		let retcols:any[] = [];

		if (this.retcols.length > 0)
		{
			this.retcols.forEach((col) =>
			{
				let val:BindValue = this.rettypes.get(col);

				let rcol:any = {column: col};
				if (val) rcol.type = val.type;

				retcols.push(rcol);
			})

			json.returning = retcols;
		}

		return(json);
	}
}