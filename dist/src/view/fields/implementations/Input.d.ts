import { DataType } from "../DataType.js";
import { FieldProperties } from "../FieldProperties.js";
import { FieldEventHandler } from "../interfaces/FieldEventHandler.js";
import { FieldImplementation, FieldState } from "../interfaces/FieldImplementation.js";
export declare class Input implements FieldImplementation, EventListenerObject {
    private type;
    private before;
    private initial;
    private int;
    private dec;
    private trim$;
    private maxlen;
    private case;
    private state;
    private placeholder;
    private formatter;
    private datamapper;
    private properties;
    private sformatter;
    private eventhandler;
    private element;
    private datatype$;
    private event;
    get trim(): boolean;
    set trim(flag: boolean);
    get datatype(): DataType;
    set datatype(type: DataType);
    setValidated(): void;
    create(eventhandler: FieldEventHandler, _tag: string): HTMLInputElement;
    apply(properties: FieldProperties, init: boolean): void;
    getFieldState(): FieldState;
    setFieldState(state: FieldState): void;
    clear(): void;
    getValue(): any;
    setValue(value: any): boolean;
    getIntermediateValue(): string;
    setIntermediateValue(value: string): void;
    getElement(): HTMLElement;
    setAttributes(attributes: Map<string, any>): void;
    handleEvent(event: Event): Promise<void>;
    private xcase;
    private xint;
    private xdec;
    private xformat;
    private xfixed;
    private getCurrentDate;
    private getPosition;
    private setPosition;
    private getSelection;
    private getElementValue;
    private setElementValue;
    private get disabled();
    private get readonly();
    private getFormatter;
    private addEvents;
}
