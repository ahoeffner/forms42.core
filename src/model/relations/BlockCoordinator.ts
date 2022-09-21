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

import { Form } from "../Form.js";
import { Block } from "../Block.js";
import { Relation } from "./Relation.js";
import { Alert } from "../../application/Alert.js";


export class BlockCoordinator
{
	constructor(private form:Form) {}
	private query$:QueryCoordinator = new QueryCoordinator(this);
	private blocks$:Map<string,Dependency> = new Map<string,Dependency>();

	public getQueryMaster(block?:Block) : Block
	{
		if (block == null)
			return(this.getBlock(this.query$.qmaster$));

		let master:Block = block;
		let masters:Block[] = this.getMasterBlocks(block);

		for (let i = 0; i < masters.length; i++)
		{
			if (masters[i].querymode)
				master = this.getQueryMaster(masters[i]);
		}

		return(master);
	}

	public allowQueryMode(block:Block) : boolean
	{
		let masters:Block[] = this.getMasterBlocks(block);

		for (let i = 0; i < masters.length; i++)
		{
			if (masters[i].querymode)
			{
				console.log("check "+masters[i].name);
				let rel:Relation = this.findRelation(masters[i].name,block.name);

				let master:Block = this.getBlock(rel.master.block);

				if (master?.querymode && !rel.allowMasterless)
					return(false);
			}
		}

		return(true);
	}

	public getMasterBlock(link:Relation) : Block
	{
		return(this.getBlock(link.master.block));
	}

	public getDetailBlock(link:Relation) : Block
	{
		return(this.getBlock(link.detail.block));
	}

	public getDetailBlocks(block:Block,masterless?:boolean) : Block[]
	{
		let blocks:Block[] = [];

		this.blocks$.get(block.name)?.details.forEach((link) =>
		{
			let block:Block = this.getBlock(link.detail.block);

			if (block == null)
				return([]);

			if (masterless || link.allowMasterless)
				blocks.push(block);
		})

		return(blocks);
	}

	public getMasterBlocks(block:Block) : Block[]
	{
		let blocks:Block[] = [];

		this.blocks$.get(block.name)?.masters.forEach((link) =>
		{
			let block:Block = this.getBlock(link.master.block);

			if (block == null)
				return([]);

			blocks.push(block);
		})

		return(blocks);
	}

	public getMasterLinks(block:Block) : Relation[]
	{
		let blocks:Relation[] = [];

		this.blocks$.get(block.name)?.masters.forEach((link) =>
		{
			let block:Block = this.getBlock(link.master.block);

			if (block == null)
				return([]);

			blocks.push(link);
		})

		return(blocks);
	}

	public getDetailLinks(block:Block) : Relation[]
	{
		let blocks:Relation[] = [];

		this.blocks$.get(block.name)?.details.forEach((link) =>
		{
			let block:Block = this.getBlock(link.master.block);

			if (block == null)
				return([]);

			blocks.push(link);
		})

		return(blocks);
	}

	public allowMasterLess(master:Block, detail:Block) : boolean
	{
		if (master == detail) return(true);
		return(this.findRelation(master.name, detail.name)?.allowMasterless);
	}

	public findRelation(master:string, detail:string) : Relation
	{
		let details:Relation[] = this.blocks$.get(master).details;

		for (let i = 0; i < details.length; i++)
		{
			if (details[i].detail.block == detail)
				return(details[i]);
		}

		return(null);
	}

	public link(link:Relation) : void
	{
		let dependency:Dependency = null;
		dependency = this.blocks$.get(link.master.block);

		if (dependency == null)
		{
			dependency = new Dependency(link.master.block);
			this.blocks$.set(dependency.block,dependency);
		}

		dependency.link(link);

		dependency = this.blocks$.get(link.detail.block);

		if (dependency == null)
		{
			dependency = new Dependency(link.detail.block);
			this.blocks$.set(dependency.block,dependency);
		}

		dependency.link(link);
	}

	public getBlock(name:string) : Block
	{
		let block:Block = this.form.getBlock(name);

		if (block == null)
		{
			Alert.fatal("Block '"+name+"', does not exist","Linked Blocks");
			return(null);
		}

		return(block);
	}

	public setQueryMaster(block:string) : void
	{
		this.query$.qmaster$ = block;
	}
}

class Dependency
{
	constructor(public block:string) {}
	private masters$:Map<string,Relation> = new Map<string,Relation>();
	private details$:Map<string,Relation> = new Map<string,Relation>();
	private fldmap$:Map<string,Relation[]> = new Map<string,Relation[]>();

	public get details() : Relation[]
	{
		let links:Relation[] = Array.from(this.details$.values());
		return(links != null ? links : []);
	}

	public get masters() : Relation[]
	{
		let links:Relation[] = Array.from(this.masters$.values());
		return(links != null ? links : []);
	}

	public link(link:Relation) : void
	{
		if (link.detail.block == this.block)
		{
			this.masters$.set(link.master.block,link);
		}
		else
		{
			let links:Relation[] = null;
			this.details$.set(link.detail.block,link);

			link.master.fields.forEach((fld) =>
			{
				links = this.fldmap$.get(fld);

				if (links == null)
				{
					links = [];
					this.fldmap$.set(fld,links);
				}

				links.push(link);
			})
		}
	}
}

class QueryCoordinator
{
	qmaster$:string = null;
	constructor(private blkcord$:BlockCoordinator) {}
}