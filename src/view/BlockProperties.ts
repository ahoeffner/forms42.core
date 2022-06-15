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

import { FieldInstance } from "./fields/FieldInstance.js";
import { HTMLProperties } from "./fields/HTMLProperties.js";


export class BlockProperties
{
	private defaults$:Map<FieldInstance,HTMLProperties> =
		new Map<FieldInstance,HTMLProperties>();

	private overrides$:Map<object,Map<FieldInstance,HTMLProperties>> =
		new Map<object,Map<FieldInstance,HTMLProperties>>();

	public static consume(tag:HTMLElement) : HTMLProperties
	{
		let skip:string[] = ["id","name","block","row"];
		let props:HTMLProperties = new HTMLProperties();

		props.tag = tag.tagName;
		props.subtype = tag.getAttribute("type");

		for (let cls of tag.classList.values())
			props.setClass(cls);

		let an:string[] = tag.getAttributeNames();

		an.forEach((name) =>
		{
			if (!skip.includes(name.toLowerCase()))
				props.setAttribute(name,tag.getAttribute(name));
		});

		return(props);
	}
}