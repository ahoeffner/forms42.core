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

import { Form } from '../public/Form.js';
import { Form as ViewForm } from '../view/Form.js';
import { Form as ModelForm } from '../model/Form.js';

import { Block } from '../public/Block.js';
import { Block as ViewBlock } from '../view/Block.js';
import { Block as ModelBlock } from '../model/Block.js';
import { FormEvents } from '../control/events/FormEvents.js';

export class FormBacking
{
	private static vforms:Map<Form,ViewForm> =
		new Map<Form,ViewForm>();

	private static mforms:Map<Form,ModelForm> =
		new Map<Form,ModelForm>();

	private static bdata:Map<Form,FormBacking> =
		new Map<Form,FormBacking>();

	public static getBacking(form:Form) : FormBacking
	{
		return(FormBacking.bdata.get(form));
	}

	public static setBacking(form:Form) : FormBacking
	{
		let back:FormBacking = new FormBacking();
		FormBacking.bdata.set(form,back);
		return(back);
	}

	public static removeBacking(form:Form) : void
	{
		FormBacking.cleanup(form);
		FormBacking.bdata.delete(form);
	}

	public static cleanup(form:Form) : void
	{
		FormBacking.mforms.delete(form);
		FormBacking.vforms.delete(form);
		FormBacking.getBacking(form).removeAllEventListener();
	}

	public static getViewForm(form:Form, create?:boolean) : ViewForm
	{
		let vfrm:ViewForm = FormBacking.vforms.get(form);
		if (vfrm == null && create) vfrm = new ViewForm(form);
		return(vfrm);
	}

	public static setViewForm(form:Form, view:ViewForm) : void
	{
		FormBacking.vforms.set(form,view);
	}

	public static getModelForm(form:Form, create?:boolean) : ModelForm
	{
		let mfrm:ModelForm = FormBacking.mforms.get(form);
		if (mfrm == null && create) mfrm = new ModelForm(form);
		return(mfrm);
	}

	public static setModelForm(form:Form, model:ModelForm) : void
	{
		FormBacking.mforms.set(form,model);
	}

	public static getViewBlock(block:Block|ModelBlock, create?:boolean) : ViewBlock
	{
		let form:ViewForm = null;

		if (block instanceof Block) form = FormBacking.getViewForm(block.form,create);
		else 								 form = FormBacking.getViewForm(block.form.parent,create);

		let blk:ViewBlock = form.getBlock(block.name);
		if (blk == null && create) blk = new ViewBlock(form,block.name);

		return(blk);
	}

	public static getModelBlock(block:Block|ViewBlock, create?:boolean) : ModelBlock
	{
		let form:ModelForm = null;

		if (block instanceof Block) form = FormBacking.getModelForm(block.form,create);
		else 								 form = FormBacking.getModelForm(block.form.parent,create);

		let blk:ModelBlock = form.getBlock(block.name);
		if (blk == null && create) blk = new ModelBlock(form,block.name);

		return(blk);
	}


	public page:HTMLElement = null;
	public listeners:object[] = [];

	public removeEventListener(handle:object) : void
	{
		let pos:number = this.listeners.indexOf(handle);
		this.listeners.splice(pos,1);
		FormEvents.removeListener(handle);
	}

	public removeAllEventListener() : void
	{
		this.listeners.forEach((handle) => {FormEvents.removeListener(handle)});
		this.listeners = [];
	}
}