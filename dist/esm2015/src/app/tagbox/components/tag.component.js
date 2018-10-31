/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, HostListener, ElementRef, Renderer, ViewChild, EventEmitter } from '@angular/core';
import { InToPipe } from 'into-pipes';
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
            event.dataTransfer.setData("source", this.name); // this is needed to get the darg/drop going..
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
     * @param {?} event
     * @return {?}
     */
    allowDrop(event) {
        /** @type {?} */
        const source = this.dataTransfer.getData("source");
        return (source && source.name != this.name) && this.name && this.name.length > 0;
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
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        return canRemove;
    }
    /**
     * @return {?}
     */
    isEditable() {
        return (this.editpolicy !== EditPolicy.viewOnly);
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
                template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span \r\n    *ngIf=\"!editMode\" \r\n    class=\"holder\" \r\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3RhZ2JveC8iLCJzb3VyY2VzIjpbInNyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBS0EsT0FBTyxFQUNMLFNBQVMsRUFFVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsUUFBUSxFQUNSLFNBQVMsRUFDVCxZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLFlBQVksQ0FBQztBQUV0QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixVQUFVLEVBQ1gsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFPN0MsTUFBTTs7Ozs7OztJQWdFSixZQUNVLGNBQ0EsTUFDRCxJQUNDO1FBSEEsaUJBQVksR0FBWixZQUFZO1FBQ1osU0FBSSxHQUFKLElBQUk7UUFDTCxPQUFFLEdBQUYsRUFBRTtRQUNELGFBQVEsR0FBUixRQUFROzhCQWhFRCxDQUFDLENBQUM7dUJBSVYsSUFBSSxZQUFZLEVBQUU7d0JBR2pCLElBQUksWUFBWSxFQUFFO3dCQUdsQixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7cUJBR3JCLElBQUksWUFBWSxFQUFFO3NCQUdqQixJQUFJLFlBQVksRUFBRTtLQStDekI7Ozs7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDakY7Ozs7O0lBR0QsU0FBUyxDQUFDLEtBQUs7UUFDWCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDeEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyQixLQUFLLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBQyxJQUFJLENBQUMsQ0FBQztTQUMxQztLQUNKOzs7OztJQUVELElBQUksQ0FBQyxLQUFLLEtBQUk7Ozs7O0lBR2QsT0FBTyxDQUFDLEtBQUs7UUFDVCxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7UUFFeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzVFOzs7OztJQUVELElBQUksQ0FBQyxLQUFLO1FBQ1IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN6RSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLE1BQU0sRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7WUFDM0MsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQyxDQUFBO0tBQ0g7Ozs7O0lBR0QsU0FBUyxDQUFDLEtBQUs7UUFDWCxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNFO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUU7S0FDSjs7Ozs7SUFHRCxTQUFTLENBQUMsS0FBSztRQUNYLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUV2QixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDNUU7Ozs7O0lBR0QsUUFBUSxDQUFDLEtBQUs7UUFDVixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4QixLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNFO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDSixJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDNUU7S0FDSjs7Ozs7SUFFRCxTQUFTLENBQUMsS0FBSzs7UUFDWCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUVuRCxNQUFNLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDcEY7Ozs7SUFFRCxTQUFTO1FBQ1AsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxjQUFjLENBQUMsUUFBUSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDM0Y7Ozs7O0lBR0QsS0FBSyxDQUFDLEtBQUs7UUFDVCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYTtZQUN2QyxDQUFDLElBQUksQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDL0QsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN6QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDbEI7WUFBQSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ3RDLFVBQVUsQ0FBQyxHQUFFLEVBQUU7b0JBQ2IsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7b0JBQ3RCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMxQjtvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDdkI7aUJBQ0YsRUFBRSxFQUFFLENBQUMsQ0FBQzthQUNSO1lBQUEsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztnQkFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7b0JBQ2hCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO3FCQUN2QjtvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztxQkFDbEQ7aUJBQ0Y7YUFDRjtZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQzs7Z0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO29CQUNoQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUN2RCxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7cUJBQ3ZCO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUM7cUJBQzFCO2lCQUNGO2FBQ0Y7U0FDRjtRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDOztZQUN6RSxNQUFNLElBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDOztnQkFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztvQkFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7aUJBQ3pCO2FBQ0Y7U0FDRjtRQUFDLElBQUksQ0FBQyxDQUFDOztZQUNOLE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDekIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7O2dCQUNoQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZjtTQUNGO0tBQ0Y7Ozs7O0lBR0QsS0FBSyxDQUFDLEtBQUs7UUFDVCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO2FBQ3pCO1NBQ0Y7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEIsVUFBVSxDQUFDLEdBQUUsRUFBRTtvQkFDYixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQzt3QkFDekIsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbEM7b0JBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7d0JBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFDO3dCQUNsQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs0QkFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO3lCQUN4RTtxQkFDRjtpQkFDRixFQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ1A7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGNBQWMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2FBQ2xEO1lBQ0QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO2dCQUM3QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNwQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDMUI7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztvQkFDbkIsVUFBVSxDQUFDLEdBQUUsRUFBRSxHQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxDQUFBLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQztpQkFDckQ7YUFDRjtZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3ZCO1NBQ0Y7S0FDRjs7Ozs7SUFHRCxLQUFLLENBQUMsS0FBSztRQUNULEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDeEI7S0FDRjs7OztJQUVELFdBQVc7O1FBQ1QsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUU5RCxTQUFTLEdBQUcsU0FBUyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFckUsTUFBTSxDQUFFLFNBQVMsQ0FBQztLQUNuQjs7OztJQUVELFVBQVU7UUFDUixNQUFNLENBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuRDs7OztJQUVELFdBQVc7UUFDVCxNQUFNLENBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVSxLQUFLLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUN2RDs7OztJQUVELFlBQVk7UUFDVixNQUFNLENBQUUsQ0FBQyxJQUFJLENBQUMsZUFBZSxLQUFLLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUM3RDs7OztJQUNELE1BQU07S0FFTDs7Ozs7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNWLFVBQVUsQ0FBQyxHQUFHLEVBQUU7WUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDaEcsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFlBQVksS0FBSyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDaEUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDMUI7WUFBQyxJQUFJLENBQUMsQ0FBQztnQkFDTixJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN2QjtTQUNGLEVBQUUsRUFBRSxDQUFDLENBQUE7S0FDUDs7Ozs7SUFDRCxJQUFJLENBQUMsS0FBSztRQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDL0IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQzs7Ozs7SUFFRCxnQkFBZ0IsQ0FBQyxLQUFLO1FBQ3BCLEVBQUUsQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsWUFBWSxZQUFZLEtBQUssQ0FBQyxDQUFBLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDVixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2hGO1NBQ0Y7S0FDRjs7OztJQUVELElBQUk7UUFDRixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDL0I7Ozs7SUFDRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO0tBQy9COzs7O0lBRUQsTUFBTTtRQUNKLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDMUI7S0FDRjs7OztJQUVELGFBQWE7O1FBQ1gsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEQ7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0tBQ2Y7OztZQWhURixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsZ2xDQUFtQzs7YUFFcEM7Ozs7WUFOUSxXQUFXO1lBUlgsUUFBUTtZQU5mLFVBQVU7WUFDVixRQUFROzs7c0JBMkJQLE1BQU0sU0FBQyxTQUFTO3VCQUdoQixNQUFNLFNBQUMsVUFBVTt1QkFHakIsTUFBTSxTQUFDLFVBQVU7dUJBR2pCLE1BQU0sU0FBQyxVQUFVO29CQUdqQixNQUFNLFNBQUMsT0FBTztxQkFHZCxNQUFNLFNBQUMsUUFBUTtxQkFHZixLQUFLLFNBQUMsUUFBUTt3QkFHZCxLQUFLLFNBQUMsV0FBVzt3QkFHakIsS0FBSyxTQUFDLFdBQVc7bUJBR2pCLEtBQUssU0FBQyxNQUFNOzBCQUdaLEtBQUssU0FBQyxhQUFhO3FCQUduQixLQUFLLFNBQUMsUUFBUTsyQkFHZCxLQUFLLFNBQUMsY0FBYzs4QkFHcEIsS0FBSyxTQUFDLGlCQUFpQjt5QkFHdkIsS0FBSyxTQUFDLFlBQVk7eUJBR2xCLEtBQUssU0FBQyxZQUFZO3FCQUdsQixTQUFTLFNBQUMsUUFBUTt1QkFHbEIsU0FBUyxTQUFDLFVBQVU7cUJBR3BCLFNBQVMsU0FBQyxRQUFRO3dCQWdCbEIsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzttQkFRcEMsWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztzQkFHL0IsWUFBWSxTQUFDLFNBQVMsRUFBRSxDQUFDLFFBQVEsQ0FBQzttQkFNbEMsWUFBWSxTQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFVL0IsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt3QkFVcEMsWUFBWSxTQUFDLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQzt1QkFPcEMsWUFBWSxTQUFDLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztvQkFvQm5DLFlBQVksU0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0JBZ0RoQyxZQUFZLFNBQUMsT0FBTyxFQUFFLENBQUMsUUFBUSxDQUFDO29CQXFDaEMsWUFBWSxTQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcixcclxuICBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBJblRvUGlwZSB9IGZyb20gJ2ludG8tcGlwZXMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnVHJhbnNmZXIgfSBmcm9tICcuL3RhZy50cmFuc2Zlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3RhZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGVkaXRNb2RlOiBib29sZWFuO1xyXG5cclxuICBvcmlnaW5hbE5hbWU6IHN0cmluZztcclxuICBzZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gIGZpbGxlckxpc3Q6IHN0cmluZ1tdO1xyXG5cclxuICBAT3V0cHV0KFwib25mb2N1c1wiKVxyXG4gIG9uZm9jdXM9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25jaGFuZ2VcIilcclxuICBvbmNoYW5nZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnNlbGVjdFwiKVxyXG4gIG9uc2VsZWN0PSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9ucmVtb3ZlXCIpXHJcbiAgb25yZW1vdmU9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25hZGRcIilcclxuICBvbmFkZD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmRyb3BcIilcclxuICBvbmRyb3A9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoXCJmb3JtYXRcIilcclxuICBmb3JtYXQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicmVtb3ZhYmxlXCIpXHJcbiAgcmVtb3ZhYmxlOiBib29sZWFuO1xyXG5cclxuICBASW5wdXQoXCJtYXhsZW5ndGhcIilcclxuICBtYXhsZW5ndGg6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwibmFtZVwiKVxyXG4gIG5hbWU6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicGxhY2Vob2xkZXJcIilcclxuICBwbGFjZWhvbGRlcjogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwicGFyZW50XCIpXHJcbiAgcGFyZW50OiBhbnk7XHJcblxyXG4gIEBJbnB1dChcImF1dG9jb21wbGV0ZVwiKVxyXG4gIGF1dG9jb21wbGV0ZTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGlvbnBvbGljeVwiKVxyXG4gIHNlbGVjdGlvbnBvbGljeTogU2VsZWN0aW9ucG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJlZGl0cG9saWN5XCIpXHJcbiAgZWRpdHBvbGljeTogRWRpdFBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZHJhZ3BvbGljeVwiKVxyXG4gIGRyYWdwb2xpY3k6IERyYWdEcm9wUG9saWN5O1xyXG5cclxuICBAVmlld0NoaWxkKFwiZWRpdG9yXCIpXHJcbiAgZWRpdG9yO1xyXG5cclxuICBAVmlld0NoaWxkKFwic2VsZWN0b3JcIilcclxuICBzZWxlY3RvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcImZpbGxlclwiKVxyXG4gIGZpbGxlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGRhdGFUcmFuc2ZlcjogVGFnVHJhbnNmZXIsXHJcbiAgICBwcml2YXRlIGludG86IEluVG9QaXBlLFxyXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLCBcclxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXHJcbiAgKXtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ1N0YXJ0KGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZygpKSB7XHJcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzLm5hbWUpOyAvLyB0aGlzIGlzIG5lZWRlZCB0byBnZXQgdGhlIGRhcmcvZHJvcCBnb2luZy4uXHJcbiAgICAgICAgdGhpcy5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNvdXJjZVwiLHRoaXMpOyAvLyB0aGlzIGlzIG5lZWRlZCBiZWNhdXNlIGV2ZW50IGRhdGEgdHJhbnNmZXIgdGFrZXMgc3RyaW5nIG5vdCBiamVjdFxyXG4gICAgICB9XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWcnLCBbJyRldmVudCddKSBcclxuICBkcmFnKGV2ZW50KSB7fVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbmQnLCBbJyRldmVudCddKSBcclxuICBkcmFnRW5kKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcblxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXHJcbiAgZHJvcChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgdGhpcy5vbmRyb3AuZW1pdCh7XHJcbiAgICAgIHNvdXJjZTogdGhpcy5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNvdXJjZVwiKSxcclxuICAgICAgZGVzdGluYXRpb246IHRoaXNcclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdFbnRlcihldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0xlYXZlKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdPdmVyKGV2ZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgYWxsb3dEcm9wKGV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIik7XHJcblxyXG4gICAgICByZXR1cm4gKHNvdXJjZSAmJiBzb3VyY2UubmFtZSAhPSB0aGlzLm5hbWUpICYmIHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIGFsbG93RHJhZygpIDogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpICYmIHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgXHJcbiAga2V5dXAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCB8fFxyXG4gICAgICAgKHRoaXMuZWRpdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudCkpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLmNsaWNrKGV2ZW50KVxyXG4gICAgICB9ZWxzZSBpZiAoY29kZSA9PT0gOSAmJiB0aGlzLmVkaXRNb2RlKSB7IC8vIHRhYiBvdXRcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUubGVuZ3RoICYmIHRoaXMub3JpZ2luYWxOYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDY2KTtcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDM4KSB7IC8vIGFycm93IHVwXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXItLTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSB0aGlzLmZpbGxlckxpc3QubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDApIHsgLy8gYXJyb3cgZG93blxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAodGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIrKztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgIH0gICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKSBcclxuICBjbGljayhldmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRWRpdGFibGUoKSkge1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gIXRoaXMuZWRpdE1vZGU7XHJcbiAgICAgIGlmICh0aGlzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZXJMaXN0KHRoaXMubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodGhpcy5lZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmZpbGxlci5uYXRpdmVFbGVtZW50LCBcIm9mZlwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LDY2KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyID49IDApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuZWwubmF0aXZlRWxlbWVudC5mb2N1cygpIH0sNjYpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyckZXZlbnQnXSkgXHJcbiAgZm9jdXMoZXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25mb2N1cy5lbWl0KHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcbiAgICBcclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgaXNFZGl0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZWRpdHBvbGljeSAhPT0gRWRpdFBvbGljeS52aWV3T25seSk7XHJcbiAgfVxyXG5cclxuICBpc0RyYWdnYWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgaXNTZWxlY3RhYmxlKCkge1xyXG4gICAgcmV0dXJuICAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCk7XHJcbiAgfVxyXG4gIHNlbGVjdCgpIHtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgdGFib3V0KGV2ZW50KSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5uYW1lID0gdGhpcy5zZWxlY3RlZEZpbGxlciA8IDAgPyBldmVudC50YXJnZXQudmFsdWUgOiB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSwgNjYpXHJcbiAgfVxyXG4gIGVkaXQoZXZlbnQpIHtcclxuICAgIHRoaXMubmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRmlsbGVyTGlzdCh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlICYmIHRoaXMuYXV0b2NvbXBsZXRlIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZpbGxlckxpc3QgPSB0aGlzLmF1dG9jb21wbGV0ZS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uaW5kZXhPZih2YWx1ZSkgPj0gMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsTmFtZSA9IHRoaXMubmFtZTtcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9yaWdpbmFsTmFtZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkpIHtcclxuICAgICAgdGhpcy5vbnJlbW92ZS5lbWl0KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9ybWF0dGVkTmFtZSgpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzLm5hbWU7XHJcbiAgICBpZiAodGhpcy5mb3JtYXQpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5pbnRvLnRyYW5zZm9ybSh0aGlzLm5hbWUsIHRoaXMuZm9ybWF0KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=