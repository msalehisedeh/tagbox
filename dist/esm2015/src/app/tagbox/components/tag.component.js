/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, HostListener, ElementRef, Renderer, ViewChild, EventEmitter } from '@angular/core';
import { InToPipe } from '@sedeh/into-pipes';
import { DragDropPolicy, Selectionpolicy, EditPolicy } from '../interfaces/tagbox.interfaces';
import { TagTransfer } from './tag.transfer';
export class TagComponent {
    /**
     * @param {?} dataTransfer
     * @param {?} into
     * @param {?} el
     * @param {?} renderer
     */
    constructor(dataTransfer, into, el, renderer) {
        this.dataTransfer = dataTransfer;
        this.into = into;
        this.el = el;
        this.renderer = renderer;
        this.selectedFiller = -1;
        this.onfocus = new EventEmitter();
        this.onchange = new EventEmitter();
        this.onselect = new EventEmitter();
        this.onremove = new EventEmitter();
        this.onadd = new EventEmitter();
        this.ondrop = new EventEmitter();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.init();
        this.el.nativeElement.draggable = (this.dragpolicy !== DragDropPolicy.disabled);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragStart(event) {
        event.stopPropagation();
        if (this.allowDrag()) {
            if (!this.isIE()) {
                event.dataTransfer.setData("source", this.name); // this is needed to get the darg/drop going..
            }
            this.dataTransfer.setData("source", this); // this is needed because event data transfer takes string not bject
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drag(event) { }
    /**
     * @param {?} event
     * @return {?}
     */
    dragEnd(event) {
        event.stopPropagation();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drop(event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        this.ondrop.emit({
            source: this.dataTransfer.getData("source"),
            destination: this
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragEnter(event) {
        event.preventDefault();
        if (this.allowDrop(event)) {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragLeave(event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragOver(event) {
        if (this.allowDrop(event)) {
            event.preventDefault();
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    }
    /**
     * @return {?}
     */
    isIE() {
        /** @type {?} */
        const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        /** @type {?} */
        let isIE = false;
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    allowDrop(event) {
        /** @type {?} */
        const source = this.dataTransfer.getData("source");
        /** @type {?} */
        const allow = (source && source.name != this.name) &&
            (this.name && this.name.length > 0) &&
            ((!source.format && !this.format) || source.format == this.format);
        return allow;
    }
    /**
     * @return {?}
     */
    allowDrag() {
        return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    keyup(event) {
        if (event.target === this.el.nativeElement ||
            (this.editor && event.target === this.editor.nativeElement)) {
            /** @type {?} */
            const code = event.which;
            if (code === 13) {
                // cariage return
                this.click(event);
            }
            else if (code === 9 && this.editMode) {
                // tab out
                setTimeout(() => {
                    this.editMode = false;
                    if (this.originalName.length && this.originalName !== this.name) {
                        this.onchange.emit(this);
                    }
                    else {
                        this.onadd.emit(this);
                    }
                }, 66);
            }
            else if (code === 38) {
                // arrow up
                if (this.filler) {
                    if (this.selectedFiller >= 0) {
                        this.selectedFiller--;
                    }
                    else {
                        this.selectedFiller = this.fillerList.length - 1;
                    }
                }
            }
            else if (code === 40) {
                // arrow down
                if (this.filler) {
                    if (this.selectedFiller < (this.fillerList.length - 1)) {
                        this.selectedFiller++;
                    }
                    else {
                        this.selectedFiller = -1;
                    }
                }
            }
        }
        else if (this.selector && event.target === this.selector.nativeElement) {
            /** @type {?} */
            const code = event.which;
            if (code === 13) {
                // cariage return
                if (this.isSelectable()) {
                    this.onselect.emit(this);
                }
            }
        }
        else if (this.holder && event.target === this.holder.nativeElement) {
            /** @type {?} */
            const code = event.which;
            if (code === 13) {
                // cariage return
                this.editMode = true;
                setTimeout(() => this.editor.nativeElement.focus(), 33);
            }
        }
        else {
            /** @type {?} */
            const code = event.which;
            if (code === 13) {
                // cariage return
                this.remove();
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    click(event) {
        if (this.selector && event.target === this.selector.nativeElement) {
            if (this.isSelectable()) {
                this.onselect.emit(this);
            }
        }
        else if (this.isEditable()) {
            this.editMode = !this.editMode;
            if (this.editMode) {
                setTimeout(() => {
                    if (this.filler) {
                        this.selectedFiller = -1;
                        this.updateFillerList(this.name);
                    }
                    if (this.editor) {
                        this.editor.nativeElement.focus();
                        if (this.filler) {
                            this.renderer.setElementClass(this.filler.nativeElement, "off", false);
                        }
                    }
                }, 66);
            }
            else if (this.selectedFiller >= 0) {
                this.name = this.fillerList[this.selectedFiller];
            }
            if (this.originalName.length) {
                if (this.originalName !== this.name) {
                    this.onchange.emit(this);
                }
                if (!this.editMode) {
                    setTimeout(() => { this.el.nativeElement.focus(); }, 66);
                }
            }
            else {
                this.onadd.emit(this);
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    focus(event) {
        if (this.isSelectable()) {
            this.onfocus.emit(this);
        }
    }
    /**
     * @return {?}
     */
    isRemovable() {
        /** @type {?} */
        let canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        return canRemove;
    }
    /**
     * @return {?}
     */
    isEditable() {
        return (this.editpolicy === EditPolicy.addRemoveModify);
    }
    /**
     * @return {?}
     */
    isDraggable() {
        return (this.dragpolicy !== DragDropPolicy.disabled);
    }
    /**
     * @return {?}
     */
    isSelectable() {
        return (this.selectionpolicy !== Selectionpolicy.disabled);
    }
    /**
     * @return {?}
     */
    select() {
    }
    /**
     * @param {?} event
     * @return {?}
     */
    tabout(event) {
        setTimeout(() => {
            this.name = this.selectedFiller < 0 ? event.target.value : this.fillerList[this.selectedFiller];
            this.editMode = false;
            if (this.originalName.length && this.originalName !== this.name) {
                this.onchange.emit(this);
            }
            else {
                this.onadd.emit(this);
            }
        }, 66);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    edit(event) {
        this.name = event.target.value;
        this.updateFillerList(this.name);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    updateFillerList(value) {
        if (value && this.autocomplete instanceof Array) {
            if (value) {
                this.fillerList = this.autocomplete.filter((item) => item.indexOf(value) >= 0);
            }
        }
    }
    /**
     * @return {?}
     */
    init() {
        this.originalName = this.name;
    }
    /**
     * @return {?}
     */
    reset() {
        this.name = this.originalName;
    }
    /**
     * @return {?}
     */
    remove() {
        if (this.isRemovable()) {
            this.onremove.emit(this);
        }
    }
    /**
     * @return {?}
     */
    formattedName() {
        /** @type {?} */
        let result = this.name;
        if (this.format) {
            result = this.into.transform(this.name, this.format);
        }
        return result;
    }
}
TagComponent.decorators = [
    { type: Component, args: [{
                selector: 'tag',
                template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span #holder\r\n    *ngIf=\"!editMode\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
                styles: [":host{cursor:pointer;color:#fdfdfd;margin:4px 2px;display:inline-block;background-color:#1f84ab;border:1px solid #015e85;border-radius:8px 20px 20px 8px;box-sizing:border-box;padding:3px 0;position:relative}:host ::ng-deep img{height:25px}:host.left-padded{padding-left:8px}:host.drag-over{background-color:#add8e6!important;cursor:move}:host[placeholder]{background-color:transparent;color:#000;border:0}:host[placeholder]:hover{background-color:#eee!important}:host[placeholder] .editor{color:#000}:host:hover{background-color:#027912!important;border-color:#024b0b!important}:host.focused{background-color:#027912!important;border-color:#024b0b!important}:host.selected:hover{background-color:#d6534e}:host.selected{background-color:#d6534e}:host.selected .selection.fa:before{content:\"\\f00c\"!important}:host .selection{background-color:transparent;float:left;margin-right:3px;padding:5px 3px;width:10px;height:10px;font-size:.8rem}:host .selection.fa:before{content:\"\\f013\"}:host .editor{background-color:transparent;overflow:unset;max-width:inherit;width:inherit;color:#fff;border:none}:host .placeholder{color:#888585;float:right;font-size:1rem;height:20px;line-height:20px;margin-left:5px;text-align:center;width:20px}:host .remove{float:right;font-size:.7rem;height:20px;width:20px;color:#fff;text-align:center;margin-left:5px;line-height:20px;font-weight:bolder}:host .holder{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host .autocomplete{position:absolute;top:26px;z-index:5}:host .autocomplete.off{display:none}:host .autocomplete ul{border:1px solid #024b0b;border-top:0;list-style:none inside;background-color:#027912;margin:0;max-height:150px;overflow-y:auto;padding:0}:host .autocomplete ul li{color:#fdfdfd;padding:5px;white-space:nowrap}:host .autocomplete ul li.selected{background-color:#d6534e}:host .autocomplete ul li:hover{background-color:#0446a8;color:#fff}"]
            }] }
];
/** @nocollapse */
TagComponent.ctorParameters = () => [
    { type: TagTransfer },
    { type: InToPipe },
    { type: ElementRef },
    { type: Renderer }
];
TagComponent.propDecorators = {
    onfocus: [{ type: Output, args: ["onfocus",] }],
    onchange: [{ type: Output, args: ["onchange",] }],
    onselect: [{ type: Output, args: ["onselect",] }],
    onremove: [{ type: Output, args: ["onremove",] }],
    onadd: [{ type: Output, args: ["onadd",] }],
    ondrop: [{ type: Output, args: ["ondrop",] }],
    format: [{ type: Input, args: ["format",] }],
    removable: [{ type: Input, args: ["removable",] }],
    maxlength: [{ type: Input, args: ["maxlength",] }],
    name: [{ type: Input, args: ["name",] }],
    placeholder: [{ type: Input, args: ["placeholder",] }],
    parent: [{ type: Input, args: ["parent",] }],
    autocomplete: [{ type: Input, args: ["autocomplete",] }],
    selectionpolicy: [{ type: Input, args: ["selectionpolicy",] }],
    editpolicy: [{ type: Input, args: ["editpolicy",] }],
    dragpolicy: [{ type: Input, args: ["dragpolicy",] }],
    editor: [{ type: ViewChild, args: ["editor",] }],
    selector: [{ type: ViewChild, args: ["selector",] }],
    holder: [{ type: ViewChild, args: ["holder",] }],
    filler: [{ type: ViewChild, args: ["filler",] }],
    dragStart: [{ type: HostListener, args: ['dragstart', ['$event'],] }],
    drag: [{ type: HostListener, args: ['drag', ['$event'],] }],
    dragEnd: [{ type: HostListener, args: ['dragend', ['$event'],] }],
    drop: [{ type: HostListener, args: ['drop', ['$event'],] }],
    dragEnter: [{ type: HostListener, args: ['dragenter', ['$event'],] }],
    dragLeave: [{ type: HostListener, args: ['dragleave', ['$event'],] }],
    dragOver: [{ type: HostListener, args: ['dragover', ['$event'],] }],
    keyup: [{ type: HostListener, args: ['keyup', ['$event'],] }],
    click: [{ type: HostListener, args: ['click', ['$event'],] }],
    focus: [{ type: HostListener, args: ['focus', ['$event'],] }]
};
if (false) {
    /** @type {?} */
    TagComponent.prototype.editMode;
    /** @type {?} */
    TagComponent.prototype.originalName;
    /** @type {?} */
    TagComponent.prototype.selectedFiller;
    /** @type {?} */
    TagComponent.prototype.fillerList;
    /** @type {?} */
    TagComponent.prototype.onfocus;
    /** @type {?} */
    TagComponent.prototype.onchange;
    /** @type {?} */
    TagComponent.prototype.onselect;
    /** @type {?} */
    TagComponent.prototype.onremove;
    /** @type {?} */
    TagComponent.prototype.onadd;
    /** @type {?} */
    TagComponent.prototype.ondrop;
    /** @type {?} */
    TagComponent.prototype.format;
    /** @type {?} */
    TagComponent.prototype.removable;
    /** @type {?} */
    TagComponent.prototype.maxlength;
    /** @type {?} */
    TagComponent.prototype.name;
    /** @type {?} */
    TagComponent.prototype.placeholder;
    /** @type {?} */
    TagComponent.prototype.parent;
    /** @type {?} */
    TagComponent.prototype.autocomplete;
    /** @type {?} */
    TagComponent.prototype.selectionpolicy;
    /** @type {?} */
    TagComponent.prototype.editpolicy;
    /** @type {?} */
    TagComponent.prototype.dragpolicy;
    /** @type {?} */
    TagComponent.prototype.editor;
    /** @type {?} */
    TagComponent.prototype.selector;
    /** @type {?} */
    TagComponent.prototype.holder;
    /** @type {?} */
    TagComponent.prototype.filler;
    /** @type {?} */
    TagComponent.prototype.dataTransfer;
    /** @type {?} */
    TagComponent.prototype.into;
    /** @type {?} */
    TagComponent.prototype.el;
    /** @type {?} */
    TagComponent.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUtBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFFBQVEsRUFDUixTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUU3QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixVQUFVLEVBQ1gsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFPN0MsTUFBTTs7Ozs7OztJQW1FSixZQUNVLGNBQ0EsTUFDRCxJQUNDO1FBSEEsaUJBQVksR0FBWixZQUFZO1FBQ1osU0FBSSxHQUFKLElBQUk7UUFDTCxPQUFFLEdBQUYsRUFBRTtRQUNELGFBQVEsR0FBUixRQUFROzhCQW5FRCxDQUFDLENBQUM7dUJBSVYsSUFBSSxZQUFZLEVBQUU7d0JBR2pCLElBQUksWUFBWSxFQUFFO3dCQUdsQixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7cUJBR3JCLElBQUksWUFBWSxFQUFFO3NCQUdqQixJQUFJLFlBQVksRUFBRTtLQWtEekI7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDakY7Ozs7O0lBR0QsU0FBUyxDQUFDLEtBQVU7UUFDaEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDckIsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNqQixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ2hEO1lBQ0QsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFDO0tBQ0o7Ozs7O0lBRUQsSUFBSSxDQUFDLEtBQVUsS0FBSTs7Ozs7SUFHbkIsT0FBTyxDQUFDLEtBQVU7UUFDZCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVFOzs7OztJQUVELElBQUksQ0FBQyxLQUFVO1FBQ2IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDM0MsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQyxDQUFBO0tBQ0g7Ozs7O0lBRUQsU0FBUyxDQUFDLEtBQVU7UUFDaEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzRTtRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzVFO0tBQ0o7Ozs7O0lBRUQsU0FBUyxDQUFDLEtBQVU7UUFDaEIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBRXZCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM1RTs7Ozs7SUFFRCxRQUFRLENBQUMsS0FBVTtRQUNmLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0U7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNKLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1RTtLQUNKOzs7O0lBQ08sSUFBSTs7UUFDVixNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDOztRQUMzRSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUM7UUFFakIsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNmLElBQUksR0FBRyxJQUFJLENBQUM7U0FDZjtRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7Ozs7OztJQUVkLFNBQVMsQ0FBQyxLQUFVOztRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7UUFDbkQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDO1lBQ3BDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDbkMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRixNQUFNLENBQUMsS0FBSyxDQUFDO0tBQ2hCOzs7O0lBRUQsU0FBUztRQUNQLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQzNGOzs7OztJQUdELEtBQUssQ0FBQyxLQUFVO1FBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWE7WUFDdkMsQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBQy9ELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O2dCQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFBO2FBQ2xCO1lBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7O2dCQUN0QyxVQUFVLENBQUMsR0FBRSxFQUFFO29CQUNiLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO29CQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDMUI7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3ZCO2lCQUNGLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDUjtZQUFBLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdCLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztxQkFDdkI7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7cUJBQ2xEO2lCQUNGO2FBQ0Y7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O2dCQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztvQkFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDdkQsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO3FCQUN2QjtvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUMxQjtpQkFDRjthQUNGO1NBQ0Y7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7WUFDekUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUN6QjthQUNGO1NBQ0Y7UUFBQyxJQUFJLENBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQzs7WUFDdEUsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2hCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixVQUFVLENBQUMsR0FBRSxFQUFFLENBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7YUFDdEQ7U0FDRjtRQUFDLElBQUksQ0FBQyxDQUFDOztZQUNOLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O2dCQUNoQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZjtTQUNGO0tBQ0Y7Ozs7O0lBR0QsS0FBSyxDQUFDLEtBQVk7UUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNsRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTthQUN6QjtTQUNGO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDL0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xCLFVBQVUsQ0FBQyxHQUFFLEVBQUU7b0JBQ2IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ2xDO29CQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNoQixJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQzt3QkFDbEMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7NEJBQ2hCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQzt5QkFDeEU7cUJBQ0Y7aUJBQ0YsRUFBQyxFQUFFLENBQUMsQ0FBQzthQUNQO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQzthQUNsRDtZQUNELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDN0IsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQzFCO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7b0JBQ25CLFVBQVUsQ0FBQyxHQUFFLEVBQUUsR0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQSxFQUFFLEVBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ3JEO2FBQ0Y7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QjtTQUNGO0tBQ0Y7Ozs7O0lBR0QsS0FBSyxDQUFDLEtBQVU7UUFDZCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO1NBQ3hCO0tBQ0Y7Ozs7SUFFRCxXQUFXOztRQUNULElBQUksU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFOUQsU0FBUyxHQUFHLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzFFLFNBQVMsR0FBRyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVyRSxNQUFNLENBQUUsU0FBUyxDQUFDO0tBQ25COzs7O0lBRUQsVUFBVTtRQUNSLE1BQU0sQ0FBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0tBQzFEOzs7O0lBRUQsV0FBVztRQUNULE1BQU0sQ0FBRSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZEOzs7O0lBRUQsWUFBWTtRQUNWLE1BQU0sQ0FBRSxDQUFDLElBQUksQ0FBQyxlQUFlLEtBQUssZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzdEOzs7O0lBQ0QsTUFBTTtLQUVMOzs7OztJQUVELE1BQU0sQ0FBQyxLQUFVO1FBQ2YsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUNkLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUNoRyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUN0QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUMxQjtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0YsRUFBRSxFQUFFLENBQUMsQ0FBQTtLQUNQOzs7OztJQUNELElBQUksQ0FBQyxLQUFVO1FBQ2IsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUMvQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDOzs7OztJQUVELGdCQUFnQixDQUFDLEtBQUs7UUFDcEIsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxZQUFZLFlBQVksS0FBSyxDQUFDLENBQUEsQ0FBQztZQUMvQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO2dCQUNWLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDaEY7U0FDRjtLQUNGOzs7O0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztLQUMvQjs7OztJQUNELEtBQUs7UUFDSCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDL0I7Ozs7SUFFRCxNQUFNO1FBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMxQjtLQUNGOzs7O0lBRUQsYUFBYTs7UUFDWCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0RDtRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7S0FDZjs7O1lBblVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsS0FBSztnQkFDZiwybUNBQW1DOzthQUVwQzs7OztZQU5RLFdBQVc7WUFSWCxRQUFRO1lBTmYsVUFBVTtZQUNWLFFBQVE7OztzQkEyQlAsTUFBTSxTQUFDLFNBQVM7dUJBR2hCLE1BQU0sU0FBQyxVQUFVO3VCQUdqQixNQUFNLFNBQUMsVUFBVTt1QkFHakIsTUFBTSxTQUFDLFVBQVU7b0JBR2pCLE1BQU0sU0FBQyxPQUFPO3FCQUdkLE1BQU0sU0FBQyxRQUFRO3FCQUdmLEtBQUssU0FBQyxRQUFRO3dCQUdkLEtBQUssU0FBQyxXQUFXO3dCQUdqQixLQUFLLFNBQUMsV0FBVzttQkFHakIsS0FBSyxTQUFDLE1BQU07MEJBR1osS0FBSyxTQUFDLGFBQWE7cUJBR25CLEtBQUssU0FBQyxRQUFROzJCQUdkLEtBQUssU0FBQyxjQUFjOzhCQUdwQixLQUFLLFNBQUMsaUJBQWlCO3lCQUd2QixLQUFLLFNBQUMsWUFBWTt5QkFHbEIsS0FBSyxTQUFDLFlBQVk7cUJBR2xCLFNBQVMsU0FBQyxRQUFRO3VCQUdsQixTQUFTLFNBQUMsVUFBVTtxQkFHcEIsU0FBUyxTQUFDLFFBQVE7cUJBR2xCLFNBQVMsU0FBQyxRQUFRO3dCQWdCbEIsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzttQkFVcEMsWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztzQkFHL0IsWUFBWSxTQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQzttQkFNbEMsWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFTL0IsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFTcEMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFNcEMsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkE4Qm5DLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBc0RoQyxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQXFDaEMsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcixcclxuICBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBJblRvUGlwZSB9IGZyb20gJ0BzZWRlaC9pbnRvLXBpcGVzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi90YWcudHJhbnNmZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd0YWcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZy5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBlZGl0TW9kZTogYm9vbGVhbjtcclxuXHJcbiAgb3JpZ2luYWxOYW1lOiBzdHJpbmc7XHJcbiAgc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICBmaWxsZXJMaXN0OiBzdHJpbmdbXTtcclxuXHJcbiAgQE91dHB1dChcIm9uZm9jdXNcIilcclxuICBvbmZvY3VzPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnJlbW92ZVwiKVxyXG4gIG9ucmVtb3ZlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uYWRkXCIpXHJcbiAgb25hZGQ9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25kcm9wXCIpXHJcbiAgb25kcm9wPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInJlbW92YWJsZVwiKVxyXG4gIHJlbW92YWJsZTogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwibWF4bGVuZ3RoXCIpXHJcbiAgbWF4bGVuZ3RoOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcIm5hbWVcIilcclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IGJvb2xlYW47XHJcblxyXG4gIEBJbnB1dChcInBhcmVudFwiKVxyXG4gIHBhcmVudDogYW55O1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcbiAgQFZpZXdDaGlsZChcImVkaXRvclwiKVxyXG4gIGVkaXRvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcInNlbGVjdG9yXCIpXHJcbiAgc2VsZWN0b3I7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJob2xkZXJcIilcclxuICBob2xkZXI7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJmaWxsZXJcIilcclxuICBmaWxsZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBkYXRhVHJhbnNmZXI6IFRhZ1RyYW5zZmVyLFxyXG4gICAgcHJpdmF0ZSBpbnRvOiBJblRvUGlwZSxcclxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlclxyXG4gICl7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9ICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdzdGFydCcsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdTdGFydChldmVudDogYW55KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZygpKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzSUUoKSkge1xyXG4gICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzLm5hbWUpOyAvLyB0aGlzIGlzIG5lZWRlZCB0byBnZXQgdGhlIGRhcmcvZHJvcCBnb2luZy4uXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzKTsgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBldmVudCBkYXRhIHRyYW5zZmVyIHRha2VzIHN0cmluZyBub3QgYmplY3RcclxuICAgICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcmFnJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZyhldmVudDogYW55KSB7fVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbmQnLCBbJyRldmVudCddKSBcclxuICBkcmFnRW5kKGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuXHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcclxuICBkcm9wKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgIHRoaXMub25kcm9wLmVtaXQoe1xyXG4gICAgICBzb3VyY2U6IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIiksXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB0aGlzXHJcbiAgICB9KVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnRW50ZXIoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0xlYXZlKGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ092ZXIoZXZlbnQ6IGFueSkge1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgaXNJRSgpIHtcclxuICAgIGNvbnN0IG1hdGNoID0gbmF2aWdhdG9yLnVzZXJBZ2VudC5zZWFyY2goLyg/OkVkZ2V8TVNJRXxUcmlkZW50XFwvLio7IHJ2OikvKTtcclxuICAgIGxldCBpc0lFID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKG1hdGNoICE9PSAtMSkge1xyXG4gICAgICAgIGlzSUUgPSB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGlzSUU7XHJcbiAgfVxyXG4gIGFsbG93RHJvcChldmVudDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIik7XHJcbiAgICAgIGNvbnN0IGFsbG93ID0gKHNvdXJjZSAmJiBzb3VyY2UubmFtZSAhPSB0aGlzLm5hbWUpICYmIFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDApICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKCghc291cmNlLmZvcm1hdCAmJiAhdGhpcy5mb3JtYXQpIHx8IHNvdXJjZS5mb3JtYXQgPT0gdGhpcy5mb3JtYXQpO1xyXG4gICAgICByZXR1cm4gYWxsb3c7XHJcbiAgfVxyXG5cclxuICBhbGxvd0RyYWcoKSA6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKSAmJiB0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDA7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pIFxyXG4gIGtleXVwKGV2ZW50OiBhbnkpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCB8fFxyXG4gICAgICAgKHRoaXMuZWRpdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudCkpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLmNsaWNrKGV2ZW50KVxyXG4gICAgICB9ZWxzZSBpZiAoY29kZSA9PT0gOSAmJiB0aGlzLmVkaXRNb2RlKSB7IC8vIHRhYiBvdXRcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUubGVuZ3RoICYmIHRoaXMub3JpZ2luYWxOYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDY2KTtcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDM4KSB7IC8vIGFycm93IHVwXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXItLTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSB0aGlzLmZpbGxlckxpc3QubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDApIHsgLy8gYXJyb3cgZG93blxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAodGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIrKztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgIH0gICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSAgaWYgKHRoaXMuaG9sZGVyICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5ob2xkZXIubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PnRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSwzMyk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKSBcclxuICBjbGljayhldmVudDogRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0VkaXRhYmxlKCkpIHtcclxuICAgICAgdGhpcy5lZGl0TW9kZSA9ICF0aGlzLmVkaXRNb2RlO1xyXG4gICAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5maWxsZXIubmF0aXZlRWxlbWVudCwgXCJvZmZcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSw2Nik7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSB9LDY2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdmb2N1cycsIFsnJGV2ZW50J10pIFxyXG4gIGZvY3VzKGV2ZW50OiBhbnkpIHtcclxuICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25mb2N1cy5lbWl0KHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkUmVtb3ZlTW9kaWZ5KTtcclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LnJlbW92ZU9ubHkpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIGlzRWRpdGFibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkUmVtb3ZlTW9kaWZ5KTtcclxuICB9XHJcblxyXG4gIGlzRHJhZ2dhYmxlKCkge1xyXG4gICAgcmV0dXJuICAodGhpcy5kcmFncG9saWN5ICE9PSBEcmFnRHJvcFBvbGljeS5kaXNhYmxlZCk7XHJcbiAgfVxyXG5cclxuICBpc1NlbGVjdGFibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcbiAgc2VsZWN0KCkge1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICB0YWJvdXQoZXZlbnQ6IGFueSkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAwID8gZXZlbnQudGFyZ2V0LnZhbHVlIDogdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGggJiYgdGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sIDY2KVxyXG4gIH1cclxuICBlZGl0KGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMubmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRmlsbGVyTGlzdCh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlICYmIHRoaXMuYXV0b2NvbXBsZXRlIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZpbGxlckxpc3QgPSB0aGlzLmF1dG9jb21wbGV0ZS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uaW5kZXhPZih2YWx1ZSkgPj0gMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsTmFtZSA9IHRoaXMubmFtZTtcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9yaWdpbmFsTmFtZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkpIHtcclxuICAgICAgdGhpcy5vbnJlbW92ZS5lbWl0KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9ybWF0dGVkTmFtZSgpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzLm5hbWU7XHJcbiAgICBpZiAodGhpcy5mb3JtYXQpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5pbnRvLnRyYW5zZm9ybSh0aGlzLm5hbWUsIHRoaXMuZm9ybWF0KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=