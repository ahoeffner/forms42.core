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

import { Status } from "./Row.js";
import { Properties } from "../application/Properties.js";
import { FieldInstance } from "./fields/FieldInstance.js";
import { FieldProperties } from "./fields/FieldProperties.js";
import { BasicProperties } from "./fields/BasicProperties.js";


export class FieldFeatureFactory
{
	public static initialize(props:BasicProperties, inst:FieldInstance, deflt:boolean, type:Status) : void
	{
		let exist:BasicProperties = inst.properties;

		if (deflt)
		{
			switch(type)
			{
				case Status.qbe: exist = inst.qbeProperties; break;
				case Status.insert: exist = inst.insertProperties; break;
				case Status.update: exist = inst.updateProperties; break;
				default: exist = inst.defaultProperties;
			}
		}

		FieldFeatureFactory.copyBasic(exist,props);
	}

	public static clone(props:FieldProperties) : FieldProperties
	{
		let clone:FieldProperties = new FieldProperties();
		FieldFeatureFactory.copyBasic(props,clone);

		clone.id = props.id;
		clone.row = props.row;
		clone.name = props.name;
		clone.inst = props.inst;
		clone.block = props.block;
		clone.mapper = props.mapper;

		return(clone);
	}

	public static merge(props:BasicProperties, inst$:FieldInstance, defprops:boolean) : void
	{
		let fprops:FieldProperties = null;
		fprops = inst$.properties;
		if (defprops) fprops = inst$.defaultProperties;

		// Don't change default props
		if (inst$.hasDefaultProperties() && !defprops)
			fprops = FieldFeatureFactory.clone(fprops);

		FieldFeatureFactory.copyBasic(props,fprops);

		if (!defprops) inst$.applyProperties(fprops);
		else		   inst$.updateDefaultProperties();
	}

	public static copyBasic(exist:BasicProperties, props:BasicProperties) : void
	{
		let list:Map<string,string> = new Map<string,string>();
		exist.getValidValues().forEach((value,key) => {list.set(key,value)});

		props.tag = exist.tag;
		props.validValues = list;
		props.value = exist.value;
		props.mapper = exist.mapper;
		props.hidden = exist.hidden;
		props.enabled = exist.enabled;
		props.readonly = exist.readonly;
		props.required = exist.required;

		exist.getClasses().forEach((clazz) => {props.setClass(clazz)});
		exist.getAttributes().forEach((value,name) => {props.setAttribute(name,value)});
		exist.getStyles().forEach((element) => {props.setStyle(element.style,element.value)});
	}

	public static reset(tag:HTMLElement) : void
	{
		tag.style.cssText = "";
		tag.classList.value = "";
		let attrs:string[] = tag.getAttributeNames();
		attrs.forEach((attr) => {tag.removeAttribute(attr)});
	}

	public static consume(tag:HTMLElement) : FieldProperties
	{
		let props:FieldProperties = new FieldProperties();
		let skip:string[] = ["id","name",Properties.BindTag,"row","value"];

		props.tag = tag.tagName;
		props.id = tag.getAttribute("id");

		props.block = tag.getAttribute(Properties.BindTag);
		if (props.block == null) throw "@FieldInstance: "+Properties.BindTag+" must be specified";

		props.name = tag.getAttribute("name");
		if (props.name == null)	throw "@FieldInstance: Name must be specified";

		props.value = tag.getAttribute("value");
		let row:string = tag.getAttribute("row");

		if (row == null) row = "-1";
		else if (isNaN(+row)) throw "@FieldInstance: row: '"+row+"' is not a number";

		props.row = +row;

		if (tag instanceof HTMLInputElement || tag instanceof HTMLTextAreaElement)
		{
			props.hidden = tag.hidden;
			props.enabled = !tag.disabled;
			props.readonly = tag.readOnly;
			props.required = tag.required;
		}

		else

		if (tag instanceof HTMLSelectElement)
		{
			props.hidden = tag.hidden;
			props.enabled = !tag.disabled;
			props.required = tag.required;
			props.readonly = tag.getAttribute("readonly") != null;
			props.setValidValues(FieldFeatureFactory.getSelectOptions(tag));
		}

		else

		{
			props.enabled = true;
			props.readonly = false;
			props.required = false;
			props.hidden = tag.hidden;
		}

		props.setStyles(tag.style.cssText);

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

	public static apply(inst:FieldInstance, props:FieldProperties) : void
	{
		let styles:string = "";
		let tag:HTMLElement = inst.element;

		tag.setAttribute("name",props.name);
		tag.setAttribute(Properties.BindTag,props.block);

		if (props.id != null) tag.setAttribute("id",props.id);
		if (props.row >= 0) tag.setAttribute("row",""+props.row);

		props.getClasses().forEach((clazz) => {tag.classList.add(clazz)});
		props.getAttributes().forEach((value,name) => {tag.setAttribute(name,value)});
		props.getStyles().forEach((element) => {styles += element.style+":"+element.value+";"});

		if (styles.length > 0)
			tag.style.cssText = styles;

		if (tag instanceof HTMLInputElement || tag instanceof HTMLTextAreaElement)
		{
			tag.hidden = props.hidden;
			tag.disabled = !props.enabled;
			tag.readOnly = props.readonly;
			tag.required = props.required;

			if (props.getAttribute("type")?.toLowerCase() == "checkbox")
				tag.setAttribute("value",props.value);

			if (props.getAttribute("type")?.toLowerCase() == "radio")
				tag.setAttribute("value",props.value);

			if (props.getValidValues().size > 0)
				FieldFeatureFactory.createDataList(inst,props);
		}

		else

		if (tag instanceof HTMLSelectElement)
		{
			tag.hidden = props.hidden;
			tag.disabled = !props.enabled;
			tag.required = props.required;
			FieldFeatureFactory.setSelectOptions(tag,props);
			FieldFeatureFactory.setReadOnly(tag,props.readonly)
			if (props.readonly) tag.setAttribute("readonly","");
		}
	}

	public static applyType(inst:FieldInstance) : void
	{
		let type:string = null;
		let props:FieldProperties = inst.defaultProperties;

		if (props.hasClass("date")) type = "date";
		if (props.hasClass("integer")) type = "integer";
		if (props.hasClass("decimal")) type = "decimal";
		if (props.hasClass("datetime")) type = "datetime";

		inst.element.classList.remove("date");
		inst.element.classList.remove("integer");
		inst.element.classList.remove("decimal");
		inst.element.classList.remove("datetime");

		inst.element.classList.add(type);
	}

	public static createDataList(inst:FieldInstance, props:FieldProperties) : void
	{
		let tag:HTMLElement = inst.element;
		let type:string = props.getAttribute("type");

		if (tag instanceof HTMLInputElement && (type == null || type == "text"))
		{
			let datalist:HTMLDataListElement = null;
			let list:string = props.getAttribute("list");

			if (list == null)
				list = inst.defaultProperties.getAttribute("values");

			if (list == null)
			{
				list = (new Date()).getTime()+"";
				props.setAttribute("list",list);
				tag.setAttribute("list",list);
				inst.defaultProperties.setAttribute("values",list);
			}

			list = list.toLowerCase();
			let candidates:HTMLCollectionOf<Element> = inst.form.getView().getElementsByTagName("list");

			for (let i = 0; i < candidates.length; i++)
			{
				if (candidates.item(i).id?.toLowerCase() == list.toLowerCase())
				{
					datalist = candidates.item(i) as HTMLDataListElement;
					break;
				}
			}

			if (datalist == null)
			{
				datalist = document.createElement("datalist");
				tag.appendChild(datalist);
				datalist.id = list;
			}

			while(datalist.options.length > 0)
				datalist.options.item(0).remove();

			props.getValidValues().forEach((value) =>
			{
				if (value.length > 0)
				{
					let option:HTMLOptionElement = new Option();
					option.value = value;
					datalist.appendChild(option);
				}
			})
		}
	}

	public static setReadOnlyState(tag:HTMLElement, props:FieldProperties, flag:boolean) : void
	{
		if (flag) FieldFeatureFactory.setReadOnly(tag,flag);
		else if (!props.readonly && props.enabled) FieldFeatureFactory.setReadOnly(tag,flag);
	}

	public static setEnabledState(tag:HTMLElement, props:FieldProperties, flag:boolean) : void
	{
		if (!flag) FieldFeatureFactory.setEnabled(tag,props,flag);
		else if (props.enabled) FieldFeatureFactory.setEnabled(tag,props,flag);
	}

	public static setReadOnly(tag:HTMLElement, flag:boolean) : void
	{
		if (tag instanceof HTMLInputElement)
			tag.readOnly = flag;

		if (tag instanceof HTMLSelectElement)
			tag.disabled = flag;
	}

	public static setEnabled(tag:HTMLElement, props:FieldProperties, flag:boolean) : void
	{
		if (tag instanceof HTMLInputElement) tag.disabled = !flag;
		if (tag instanceof HTMLSelectElement && !props.readonly) tag.disabled = !flag;
	}

	private static getSelectOptions(tag:HTMLSelectElement) : Map<string,string>
	{
		let options:Map<string,string> = new Map<string,string>();

		options.set("","");
		for (let i = 0; i < tag.options.length; i++)
		{
			let label:string = tag.options.item(i).label.trim();
			let value:string = tag.options.item(i).value.trim();

			if (label.length > 0 || value.length > 0)
			{

				if (label.length == 0 && value.length != null)
					label = value;

				options.set(label,value);
			}
		}

		return(options);
	}

	private static setSelectOptions(tag:HTMLSelectElement, props:FieldProperties) : void
	{
		while(tag.options.length > 0)
			tag.options.remove(0);

		tag.options.add(new Option())
		let options:HTMLOptionElement[] = [];

		props.getValidValues().forEach((value:string,label:string) =>
		{
			if (label.length > 0 || value.length > 0)
			{
				let option:HTMLOptionElement = new Option();

				option.label = label;
				option.value = value;

				options.push(option);
			}
		})

		options.forEach((option) => tag.options.add(option));
	}
}