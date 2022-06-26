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

import { Field } from "./Field.js";
import { BrowserEvent } from "../BrowserEvent.js";
import { FieldInstance } from "./FieldInstance.js";
import { Alert } from "../../application/Alert.js";

interface event
{
	field:Field,
	inst:FieldInstance,
	brwevent:BrowserEvent
}

export class EventStack
{
	private static stack$:event[] = [];
	private static running:boolean = false;

	// Javascript might not be multithreaded, but browsers doesn't wait for events to be handled
	public static async stack(field:Field, inst:FieldInstance, brwevent:BrowserEvent) : Promise<void>
	{
		EventStack.stack$.unshift({field: field, inst:inst, brwevent: brwevent.clone()});
		await EventStack.handle();
	}

	private static async handle() : Promise<void>
	{
		if (EventStack.running)
			return;

		EventStack.running = true;

		let cmd:event = EventStack.stack$.pop();

		if (cmd == undefined)
		{
			EventStack.running = false;
			return;
		}

		try
		{
			await cmd.field.performEvent(cmd.inst,cmd.brwevent);

			EventStack.running = false;
			setTimeout(() => {EventStack.handle();},0);
		}
		catch (error)
		{
			EventStack.stack$ = [];
			EventStack.running = false;
			Alert.warning(""+error,"Fatal Error");
		}
	}
}