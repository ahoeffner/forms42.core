import { Record } from "../Record.js";
import { Filter } from "../interfaces/Filter.js";
import { DataType } from "../../database/DataType.js";
import { BindValue } from "../../database/BindValue.js";
export declare class SubQuery implements Filter {
    private bindval$;
    private subquery$;
    private datatype$;
    private columns$;
    private constraint$;
    private bindvalues$;
    constructor(columns: string | string[]);
    get column(): string;
    set column(column: string);
    get columns(): string[];
    set columns(columns: string[]);
    get subquery(): string;
    set subquery(sql: string);
    clone(): SubQuery;
    getDataType(): string;
    setDataType(type: DataType | string): SubQuery;
    clear(): void;
    getBindValueName(): string;
    setBindValueName(name: string): SubQuery;
    setConstraint(values: any[][]): SubQuery;
    get constraint(): any[][];
    set constraint(table: any[][]);
    getBindValue(): BindValue;
    getBindValues(): BindValue[];
    setBindValues(bindvalues: BindValue | BindValue[]): void;
    evaluate(record: Record): Promise<boolean>;
    asSQL(): string;
    toString(): string;
}
