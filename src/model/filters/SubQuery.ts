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

import { Record } from "../Record.js";
import { Filter } from "../interfaces/Filter.js";
import { DataType } from "../../database/DataType.js";
import { BindValue } from "../../database/BindValue.js";
import { Query } from "../../database/serializable/Query.js";
import { MultiColumnFilter } from "../interfaces/MultiColumnFilter.js";

export class SubQuery extends Filter implements MultiColumnFilter
{
	private sqlstmt$:string = null;
	private columns$:string[] = null;
	private bindvalues$:BindValue[] = [];
	private constraint$:Query|any[][] = null;

	public constructor(columns:string|string[])
	{
		super();
		this.columns$ = [];

		if (typeof columns === "string")
		{
			let list:string[] = [];

			columns.split(",").forEach((column) =>
			{
				column = column.trim();

				if (column.length > 0)
					list.push(column);
			})

			columns = list;
		}

		if (!Array.isArray(columns))
			columns = [columns];

		this.columns$ = columns;
	}

	public get column() : string
	{
		return(this.columns$[0]);
	}

	public set column(column:string)
	{
		this.columns$ = [column];
	}

	public get columns() : string[]
	{
		return(this.columns$);
	}

	public set columns(columns:string[])
	{
		this.columns$ = columns;
	}

	public get sqlstmt() : string
	{
		return(this.sqlstmt$);
	}

	public set sqlstmt(sql:string)
	{
		this.sqlstmt$ = sql;
	}

	public isClientSide() : boolean
	{
		return(!(this.constraint$ instanceof Query));
	}

	public clone() : SubQuery
	{
		let clone:SubQuery = new SubQuery(this.columns$);

		clone.columns$ = this.columns$;
		clone.sqlstmt$ = this.sqlstmt$;
		clone.bindvalues$ = this.bindvalues$;

		return(clone.setConstraint(this.constraint$));
	}

	public getDataType() : string
	{
		return("na");
	}

	public setDataType(type:DataType|string) : SubQuery
	{
		return(this);
	}

	public clear() : void
	{
		this.constraint$ = null;
	}

	public getBindValueName() : string
	{
		return(null);
	}

	public setBindValueName(name:string) : SubQuery
	{
		return(this);
	}

	public setConstraint(values:Query|any[][]) : SubQuery
	{
		this.constraint$ = values;
		return(this);
	}

	public get constraint() : Query|any[][]
	{
		return(this.constraint$);
	}

	public set constraint(table:Query|any[][])
	{
		this.constraint$ = table;
	}

	public getBindValue(): BindValue
	{
		if (this.bindvalues$)
			return(this.getBindValues()[0]);

		return(null);
	}

	public getBindValues(): BindValue[]
	{
		return(this.bindvalues$);
	}

	public setBindValues(bindvalues:BindValue|BindValue[]) : void
	{
		if (!Array.isArray(bindvalues))
			bindvalues = [bindvalues];

		this.bindvalues$ = bindvalues;
	}

	public async evaluate(record:Record) : Promise<boolean>
	{
		if (this.constraint$ instanceof Query)
			return(false);

		let values:any[] = [];
		if (this.columns$ == null) return(false);
		if (this.constraint$ == null) return(false);
		if (this.constraint$.length == 0) return(false);

		let table:any[][] = this.constraint$;

		this.columns$.forEach((column) =>
		{values.push(record.getValue(column))})

		let match:boolean = false;
		for (let r = 0; r < table.length; r++)
		{
			match = true;
			let row:any[] = table[r];

			for (let c = 0; c < values.length; c++)
			{
				if (values[c] != row[c])
				{
					match = false;
					break;
				}
			}

			if (match)
				break;
		}

		return(match);
	}

	public asSQL() : string
	{
		if (this.sqlstmt$ == null) return("subquery "+this.constraint$);
		return(this.sqlstmt$)
	}

	public serialize() : any
	{
		let json:any = {};

		if (!(this.constraint$ instanceof Query))
			return(json);

		json.type = "subquery";
		json.columns = this.columns;
		json.query = this.constraint$?.serialize();

		return(json);
	}

	public toString() : string
	{
		return(this.asSQL());
	}
}