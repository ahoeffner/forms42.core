/*
 * This code is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License version 3 only, as
 * published by the Free Software Foundation.

 * This code is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License
 * version 2 for more details (a copy is included in the LICENSE file that
 * accompanied this code).
 */

import { Filter } from './Filter.js';
import { Record } from '../Record.js';

export interface DataSource
{
	columns:string[];
	arrayfecth:number;

	closeCursor() : void;
	post() : Promise<boolean>;
	fetch() : Promise<Record[]>;
	lock(record:Record) : Promise<boolean>;
	refresh(record:Record) : Promise<void>;
	insert(record:Record) : Promise<boolean>;
	update(record:Record) : Promise<boolean>;
	delete(record:Record) : Promise<boolean>;
	query(filters?:Filter|Filter[]) : Promise<boolean>;
}