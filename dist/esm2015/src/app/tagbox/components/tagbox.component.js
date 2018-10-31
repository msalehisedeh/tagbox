/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { DragDropPolicy, Selectionpolicy, EditPolicy } from '../interfaces/tagbox.interfaces';
export class TagBoxComponent {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this._tags = [];
        this._selectedindex = [];
        this.onchange = new EventEmitter();
        this.onerror = new EventEmitter();
        this.onselect = new EventEmitter();
        this.beforeAction = (event) => true;
        this.placeholder = "Add Tag";
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.selectedindex &&
            (this.selectedindex instanceof String) &&
            (this.tags && !(this.tags instanceof String))) {
            /** @type {?} */
            const x = String(this.selectedindex);
            /** @type {?} */
            const list = x.split(",");
            list.map((t) => {
                this._selectedindex.push(parseInt(t));
            });
        }
        else {
            this._selectedindex = this.selectedindex ? this.selectedindex : [];
        }
        if (this.tags && !(this.tags instanceof Array)) {
            /** @type {?} */
            const x = String(this.tags);
            this._tags = x.split(this.delineateby ? this.delineateby : ",");
        }
        else {
            this._tags = this.tags ? this.tags : [];
        }
        this.renderer.setElementAttribute(this.el.nativeElement, "role", "list");
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
    }
    /**
     * @param {?} index
     * @return {?}
     */
    itemSelectedAt(index) {
        /** @type {?} */
        const canSelect = this.selectionpolicy !== Selectionpolicy.disabled;
        return this._selectedindex.indexOf(index) < 0 ? false : canSelect;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    itemSelectionClass(index) {
        /** @type {?} */
        const selected = this.itemSelectedAt(index);
        return selected ? "selected" : ((index < 0 || this.selectionpolicy === Selectionpolicy.disabled) ? "left-padded" : "");
    }
    /**
     * @return {?}
     */
    isRemovable() {
        /** @type {?} */
        let canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        canRemove = canRemove && (!this.mintags || (this._tags.length > this.mintags));
        if (!canRemove) {
            this.onerror.emit("Unable to remove tag. Operation is not allowed.");
        }
        return canRemove;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    isDuplicate(name) {
        /** @type {?} */
        const flag = this._tags.indexOf(name) < 0 ? false : true;
        if (flag) {
            this.onerror.emit("Unable to perform operation. Resulting duplicate tags is not allowed.");
        }
        return flag;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    allowedToaddItem(name) {
        /** @type {?} */
        let canAdd = (this.editpolicy === EditPolicy.addAndRemove);
        canAdd = canAdd || (this.editpolicy === EditPolicy.addOnly);
        canAdd = canAdd && (!this.maxtags || (this._tags.length < this.maxtags));
        canAdd = canAdd && !this.isDuplicate(name);
        if (canAdd && this.maxtaglength) {
            /** @type {?} */
            const x = this._tags.join(this.delineateby ? this.delineateby : ",");
            if (x.length + name.length + 1 >= this.maxboxlength) {
                canAdd = false;
                this.onerror.emit("Unable to add tag. Resulting content will exceed maxtaglength.");
            }
        }
        return canAdd;
    }
    /**
     * @return {?}
     */
    notifyChange() {
        this.tags = (this.tags instanceof Array) ? this._tags : this._tags.join(this.delineateby ? this.delineateby : ",");
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onchange.emit({
            id: this.id,
            tags: this.tags,
            selecedIndex: this.selectedindex,
            formController: this.formController
        });
    }
    /**
     * @return {?}
     */
    notifySelection() {
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onselect.emit({
            id: this.id,
            selecedIndex: this.selectedindex,
            formController: this.formController
        });
    }
    /**
     * @param {?} action
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    createDropRequest(action, source, destination) {
        return {
            request: "drop",
            action: action,
            source: {
                id: source.parent.id,
                name: source.name
            },
            destination: {
                id: destination.parent.id,
                name: destination.name
            }
        };
    }
    /**
     * @param {?} index
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    prependTagAt(index, source, destination) {
        /** @type {?} */
        let result = false;
        /** @type {?} */
        const newName = source.name + " " + this._tags[index];
        if (!this.maxtaglength || (this.maxtaglength && source.name.length <= this.maxtaglength)) {
            if (this.beforeAction(this.createDropRequest("prepend", source, destination))) {
                this._tags[index] = newName;
                result = true;
            }
        }
        return result;
    }
    /**
     * @param {?} index
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    appendTagAt(index, source, destination) {
        /** @type {?} */
        let result = false;
        /** @type {?} */
        const newName = this._tags[index] + " " + source.name;
        if (!this.maxtaglength || (this.maxtaglength && source.name.length <= this.maxtaglength)) {
            if (this.beforeAction(this.createDropRequest("append", source, destination))) {
                this._tags[index] = newName;
                result = true;
            }
        }
        return result;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    removeTagWithName(name) {
        if (this.isRemovable() && this.beforeAction({ request: "remove", item: name })) {
            /** @type {?} */
            const index = this._tags.indexOf(name);
            /** @type {?} */
            const i = this._selectedindex.indexOf(index);
            this._tags.splice(index, 1);
            if (i >= 0) {
                this._selectedindex.splice(i, 1);
                this.notifyChange();
            }
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    addTagWithName(name) {
        /** @type {?} */
        let index = this._tags.indexOf(name);
        /** @type {?} */
        const i = this._selectedindex.indexOf(index);
        if (index < 0 &&
            name.length &&
            this.allowedToaddItem(name) &&
            this.beforeAction({ request: "add", item: name })) {
            this._tags.push(name);
            this.notifyChange();
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagRemove(event) {
        this.removeTagWithName(event.name);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagAdd(event) {
        if (this.addTagWithName(event.name)) {
            event.name = "";
            event.click(null);
        }
        else {
            event.reset();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagChange(event) {
        if (!this.isDuplicate(event.name) && this.beforeAction({ request: "change", item: event.originalName, to: event.name })) {
            /** @type {?} */
            const index = this._tags.indexOf(event.originalName);
            this._tags[index] = event.name;
            event.init();
            this.notifyChange();
        }
        else {
            event.reset();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagDrop(event) {
        /** @type {?} */
        const sind = this._tags.indexOf(event.source.name);
        /** @type {?} */
        const dind = this._tags.indexOf(event.destination.name);
        if (this.dragpolicy === DragDropPolicy.appendOnDrop) {
            if (event.source.parent.id === event.destination.parent.id) {
                if (this.appendTagAt(dind, event.source, event.destination)) {
                    /** @type {?} */
                    const i = this._selectedindex.indexOf(sind);
                    this._tags.splice(sind, 1);
                    this._selectedindex.splice(i, 1);
                    this.notifyChange();
                }
            }
            else {
                if (this.appendTagAt(dind, event.source, event.destination)) {
                    this.notifyChange();
                    event.source.parent.removeTagWithName(event.source.name);
                }
            }
        }
        else if (this.dragpolicy === DragDropPolicy.prependOnDrop) {
            if (event.source.parent.id === event.destination.parent.id) {
                if (this.prependTagAt(dind, event.source, event.destination)) {
                    /** @type {?} */
                    const i = this._selectedindex.indexOf(sind);
                    this._tags.splice(sind, 1);
                    this._selectedindex.splice(i, 1);
                    this.notifyChange();
                }
            }
            else {
                if (this.prependTagAt(dind, event.source, event.destination)) {
                    this.notifyChange();
                    event.source.parent.removeTagWithName(event.source.name);
                }
            }
        }
        if (this.dragpolicy === DragDropPolicy.swapOnDrop) {
            if (this.beforeAction(this.createDropRequest("swap", event.source, event.destination))) {
                if (event.source.parent.id === event.destination.parent.id) {
                    this._tags[sind] = this._tags.splice(dind, 1, this._tags[sind])[0];
                    this.notifyChange();
                }
                else {
                    if (this.addTagWithName(event.source.name)) {
                        this.removeTagWithName(event.destination.name);
                        event.source.parent.removeTagWithName(event.source.name);
                    }
                }
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagSelect(event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            this.onTagFocus(event);
            if (this.beforeAction({ request: "select", item: event.name })) {
                if (this.selectionpolicy === Selectionpolicy.singleSelect) {
                    /** @type {?} */
                    const list = this.el.nativeElement.childNodes;
                    for (let i = 0; i < list.length; i++) {
                        // 3 is text and 8 is comment
                        if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                            this.renderer.setElementClass(list[i], "selected", false);
                        }
                    }
                    /** @type {?} */
                    const index = this._tags.indexOf(event.name);
                    if (index >= 0) {
                        /** @type {?} */
                        const i = this._selectedindex.indexOf(index);
                        if (i < 0) {
                            this.renderer.setElementClass(event.el.nativeElement, "selected", true);
                            this._selectedindex = [index];
                        }
                        else {
                            this.renderer.setElementClass(event.el.nativeElement, "selected", false);
                            this._selectedindex = [];
                        }
                        this.notifySelection();
                    }
                }
                else {
                    /** @type {?} */
                    const index = this._tags.indexOf(event.name);
                    if (index >= 0) {
                        /** @type {?} */
                        const i = this._selectedindex.indexOf(index);
                        if (i < 0) {
                            this.renderer.setElementClass(event.el.nativeElement, "selected", true);
                            this._selectedindex.push(index);
                        }
                        else {
                            this.renderer.setElementClass(event.el.nativeElement, "selected", false);
                            this._selectedindex.splice(i, 1);
                        }
                        this.notifySelection();
                    }
                }
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagFocus(event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            /** @type {?} */
            const list = this.el.nativeElement.childNodes;
            for (let i = 0; i < list.length; i++) {
                // 3 is text and 8 is comment
                if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                    this.renderer.setElementClass(list[i], "focused", false);
                }
            }
            /** @type {?} */
            const index = this._tags.indexOf(event.name);
            if (index >= 0) {
                this.renderer.setElementClass(event.el.nativeElement, "focused", true);
            }
        }
    }
}
TagBoxComponent.decorators = [
    { type: Component, args: [{
                // changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'tagbox',
                template: "\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    tabindex=\"0\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
                styles: [":host{background-color:#fff;border:1px solid #ced4da;box-sizing:border-box;display:inline-block;min-height:50px;padding:5px;width:100%;border-radius:5px;margin-bottom:5px}:host.alert{background-color:#ff9f9b;border-color:#880500}:host:focus{border-color:#0ba}:host:hover{background-color:#ddd}"]
            }] }
];
/** @nocollapse */
TagBoxComponent.ctorParameters = () => [
    { type: Renderer },
    { type: ElementRef }
];
TagBoxComponent.propDecorators = {
    onchange: [{ type: Output, args: ["onchange",] }],
    onerror: [{ type: Output, args: ["onerror",] }],
    onselect: [{ type: Output, args: ["onselect",] }],
    beforeAction: [{ type: Input, args: ["beforeAction",] }],
    id: [{ type: Input, args: ["id",] }],
    placeholder: [{ type: Input, args: ["placeholder",] }],
    maxboxlength: [{ type: Input, args: ["maxboxlength",] }],
    maxtaglength: [{ type: Input, args: ["maxtaglength",] }],
    maxtags: [{ type: Input, args: ["maxtags",] }],
    mintags: [{ type: Input, args: ["mintags",] }],
    formController: [{ type: Input, args: ["formController",] }],
    tags: [{ type: Input, args: ["tags",] }],
    selectedindex: [{ type: Input, args: ["selectedindex",] }],
    delineateby: [{ type: Input, args: ["delineateby",] }],
    format: [{ type: Input, args: ["format",] }],
    autocomplete: [{ type: Input, args: ["autocomplete",] }],
    selectionpolicy: [{ type: Input, args: ["selectionpolicy",] }],
    editpolicy: [{ type: Input, args: ["editpolicy",] }],
    dragpolicy: [{ type: Input, args: ["dragpolicy",] }]
};
if (false) {
    /** @type {?} */
    TagBoxComponent.prototype._tags;
    /** @type {?} */
    TagBoxComponent.prototype._selectedindex;
    /** @type {?} */
    TagBoxComponent.prototype.onchange;
    /** @type {?} */
    TagBoxComponent.prototype.onerror;
    /** @type {?} */
    TagBoxComponent.prototype.onselect;
    /** @type {?} */
    TagBoxComponent.prototype.beforeAction;
    /** @type {?} */
    TagBoxComponent.prototype.id;
    /** @type {?} */
    TagBoxComponent.prototype.placeholder;
    /** @type {?} */
    TagBoxComponent.prototype.maxboxlength;
    /** @type {?} */
    TagBoxComponent.prototype.maxtaglength;
    /** @type {?} */
    TagBoxComponent.prototype.maxtags;
    /** @type {?} */
    TagBoxComponent.prototype.mintags;
    /** @type {?} */
    TagBoxComponent.prototype.formController;
    /** @type {?} */
    TagBoxComponent.prototype.tags;
    /** @type {?} */
    TagBoxComponent.prototype.selectedindex;
    /** @type {?} */
    TagBoxComponent.prototype.delineateby;
    /** @type {?} */
    TagBoxComponent.prototype.format;
    /** @type {?} */
    TagBoxComponent.prototype.autocomplete;
    /** @type {?} */
    TagBoxComponent.prototype.selectionpolicy;
    /** @type {?} */
    TagBoxComponent.prototype.editpolicy;
    /** @type {?} */
    TagBoxComponent.prototype.dragpolicy;
    /** @type {?} */
    TagBoxComponent.prototype.renderer;
    /** @type {?} */
    TagBoxComponent.prototype.el;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3RhZ2JveC8iLCJzb3VyY2VzIjpbInNyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsUUFBUSxFQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxjQUFjLEVBQ2QsZUFBZSxFQUNmLFVBQVUsRUFDWCxNQUFNLGlDQUFpQyxDQUFDO0FBVXpDLE1BQU07Ozs7O0lBK0RKLFlBQW9CLFFBQWtCLEVBQVUsRUFBYztRQUExQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtxQkE3RDVDLEVBQUU7OEJBQ08sRUFBRTt3QkFHbkIsSUFBSSxZQUFZLEVBQUU7dUJBR25CLElBQUksWUFBWSxFQUFFO3dCQUdqQixJQUFJLFlBQVksRUFBRTs0QkFHYixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsSUFBSTsyQkFNUixTQUFTO0tBNEM5Qjs7OztJQUVELFFBQVE7UUFDTixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUNsQixDQUFDLElBQUksQ0FBQyxhQUFhLFlBQVksTUFBTSxDQUFDO1lBQ3RDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDbEQsTUFBTSxDQUFDLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7WUFDN0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2IsSUFBSSxD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dCI6WyIvKlxyXG4gKiBDb21wYXJpc2lvbiBUb29sIHdpbGwgbGF5b3V0IHR3byBjb21wYXJpc2lvbiB0cmVlcyBzaWRlIGJ5IHNpZGUgYW5kIGZlZWQgdGhlbSBhbiBpbnRlcm5hbCBvYmplY3RcclxuICogaGVpcmFyY2h5IGNyZWF0ZWQgZm9yIGludGVybmFsIHVzZSBmcm9tIEpTT04gb2JqZWN0cyBnaXZlbiB0byB0aGlzIGNvbXBvbmVudC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBFbGVtZW50UmVmLFxyXG4gIFJlbmRlcmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gIERyYWdEcm9wUG9saWN5LFxyXG4gIFNlbGVjdGlvbnBvbGljeSxcclxuICBFZGl0UG9saWN5XHJcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy90YWdib3guaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tICcuL3RhZy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgLy8gY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgc2VsZWN0b3I6ICd0YWdib3gnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWdib3guY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZ2JveC5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBfdGFnczogc3RyaW5nW10gPSBbXTtcclxuICBfc2VsZWN0ZWRpbmRleDogbnVtYmVyW10gPSBbXTtcclxuICBcclxuICBAT3V0cHV0KFwib25jaGFuZ2VcIilcclxuICBvbmNoYW5nZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmVycm9yXCIpXHJcbiAgb25lcnJvcj0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnNlbGVjdFwiKVxyXG4gIG9uc2VsZWN0PSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiYmVmb3JlQWN0aW9uXCIpXHJcbiAgYmVmb3JlQWN0aW9uID0gKGV2ZW50KSA9PiB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJpZFwiKVxyXG4gIGlkOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IHN0cmluZyA9IFwiQWRkIFRhZ1wiO1xyXG4gIFxyXG4gIEBJbnB1dChcIm1heGJveGxlbmd0aFwiKVxyXG4gIG1heGJveGxlbmd0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtYXh0YWdsZW5ndGhcIilcclxuICBtYXh0YWdsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWF4dGFnc1wiKVxyXG4gIG1heHRhZ3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWludGFnc1wiKVxyXG4gIG1pbnRhZ3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwiZm9ybUNvbnRyb2xsZXJcIilcclxuICBmb3JtQ29udHJvbGxlcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIEBJbnB1dChcInRhZ3NcIilcclxuICB0YWdzOiBhbnk7XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGVkaW5kZXhcIilcclxuICBzZWxlY3RlZGluZGV4OiBhbnk7XHJcblxyXG4gIEBJbnB1dChcImRlbGluZWF0ZWJ5XCIpXHJcbiAgZGVsaW5lYXRlYnk6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcImF1dG9jb21wbGV0ZVwiKVxyXG4gIGF1dG9jb21wbGV0ZTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGlvbnBvbGljeVwiKVxyXG4gIHNlbGVjdGlvbnBvbGljeTogU2VsZWN0aW9ucG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJlZGl0cG9saWN5XCIpXHJcbiAgZWRpdHBvbGljeTogRWRpdFBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZHJhZ3BvbGljeVwiKVxyXG4gIGRyYWdwb2xpY3k6IERyYWdEcm9wUG9saWN5O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIsIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcclxuXHQgIFxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZGluZGV4ICYmIFxyXG4gICAgICAgICh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBTdHJpbmcpICYmIFxyXG4gICAgICAgICh0aGlzLnRhZ3MgJiYgISh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBTdHJpbmcpKSkge1xyXG4gICAgICBjb25zdCB4OiBzdHJpbmcgPSBTdHJpbmcodGhpcy5zZWxlY3RlZGluZGV4KTtcclxuICAgICAgY29uc3QgbGlzdCA9IHguc3BsaXQoXCIsXCIpO1xyXG4gICAgICBsaXN0Lm1hcCgodCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXgucHVzaChwYXJzZUludCh0KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IHRoaXMuc2VsZWN0ZWRpbmRleCA/IHRoaXMuc2VsZWN0ZWRpbmRleCA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRhZ3MgJiYgISh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgY29uc3QgeDogc3RyaW5nID0gU3RyaW5nKHRoaXMudGFncyk7XHJcbiAgICAgIHRoaXMuX3RhZ3MgPSB4LnNwbGl0KHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fdGFncyA9IHRoaXMudGFncyA/IHRoaXMudGFncyA6IFtdO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCxcInJvbGVcIixcImxpc3RcIik7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgaXRlbVNlbGVjdGVkQXQoaW5kZXgpIHtcclxuICAgIGNvbnN0IGNhblNlbGVjdCA9IHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQ7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KSA8IDAgPyBmYWxzZSA6IGNhblNlbGVjdDtcclxuICB9XHJcblxyXG4gIGl0ZW1TZWxlY3Rpb25DbGFzcyhpbmRleCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLml0ZW1TZWxlY3RlZEF0KGluZGV4KTtcclxuICAgIHJldHVybiBzZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6ICgoaW5kZXggPCAwIHx8IHRoaXMuc2VsZWN0aW9ucG9saWN5ID09PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpID8gXCJsZWZ0LXBhZGRlZFwiIDogXCJcIik7XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlICYmICghdGhpcy5taW50YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA+IHRoaXMubWludGFncykpO1xyXG5cclxuICAgIGlmICghY2FuUmVtb3ZlKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHJlbW92ZSB0YWcuIE9wZXJhdGlvbiBpcyBub3QgYWxsb3dlZC5cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNEdXBsaWNhdGUobmFtZSkge1xyXG4gICAgY29uc3QgZmxhZyA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKSA8IDAgPyBmYWxzZSA6IHRydWU7XHJcbiAgICBpZiAoZmxhZykge1xyXG4gICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byBwZXJmb3JtIG9wZXJhdGlvbi4gUmVzdWx0aW5nIGR1cGxpY2F0ZSB0YWdzIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmbGFnO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhbGxvd2VkVG9hZGRJdGVtKG5hbWUpIHtcclxuICAgIGxldCBjYW5BZGQgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkT25seSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICghdGhpcy5tYXh0YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA8IHRoaXMubWF4dGFncykpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCAmJiAhdGhpcy5pc0R1cGxpY2F0ZShuYW1lKTtcclxuXHJcbiAgICBpZiAoY2FuQWRkICYmIHRoaXMubWF4dGFnbGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IHggPSB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgICBpZiAoeC5sZW5ndGgrbmFtZS5sZW5ndGgrMSA+PSB0aGlzLm1heGJveGxlbmd0aCkge1xyXG4gICAgICAgIGNhbkFkZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIGFkZCB0YWcuIFJlc3VsdGluZyBjb250ZW50IHdpbGwgZXhjZWVkIG1heHRhZ2xlbmd0aC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICByZXR1cm4gIGNhbkFkZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm90aWZ5Q2hhbmdlKCkge1xyXG4gICAgdGhpcy50YWdzID0gKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXMuX3RhZ3MgOiB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgdGhpcy5zZWxlY3RlZGluZGV4ID0gISh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbmNoYW5nZS5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHRhZ3M6IHRoaXMudGFncyxcclxuICAgICAgc2VsZWNlZEluZGV4OiB0aGlzLnNlbGVjdGVkaW5kZXgsXHJcbiAgICAgIGZvcm1Db250cm9sbGVyOiB0aGlzLmZvcm1Db250cm9sbGVyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBub3RpZnlTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9zZWxlY3RlZGluZGV4Lmxlbmd0aCA/IHRoaXMuX3NlbGVjdGVkaW5kZXguam9pbihcIixcIikgOiBcIlwiKTtcclxuICAgIHRoaXMub25zZWxlY3QuZW1pdCh7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGNyZWF0ZURyb3BSZXF1ZXN0KGFjdGlvbiwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVxdWVzdDogXCJkcm9wXCIsXHJcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICBzb3VyY2U6IHtcclxuICAgICAgICBpZDogc291cmNlLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBzb3VyY2UubmFtZVxyXG4gICAgICB9LFxyXG4gICAgICBkZXN0aW5hdGlvbjoge1xyXG4gICAgICAgIGlkOiBkZXN0aW5hdGlvbi5wYXJlbnQuaWQsXHJcbiAgICAgICAgbmFtZTogZGVzdGluYXRpb24ubmFtZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgcHJlcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gc291cmNlLm5hbWUgICsgXCIgXCIgKyB0aGlzLl90YWdzW2luZGV4XTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwicHJlcGVuZFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG5ld05hbWU7XHJcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcHJpdmF0ZSBhcHBlbmRUYWdBdChpbmRleCwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IHRoaXMuX3RhZ3NbaW5kZXhdICsgXCIgXCIgKyBzb3VyY2UubmFtZTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwiYXBwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICByZW1vdmVUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwicmVtb3ZlXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKTtcclxuICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcblxyXG4gICAgICB0aGlzLl90YWdzLnNwbGljZShpbmRleCwxKTtcclxuICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICAgIFxyXG4gICAgaWYgKGluZGV4IDwgMCAgJiYgXHJcbiAgICAgICAgbmFtZS5sZW5ndGggJiYgXHJcbiAgICAgICAgdGhpcy5hbGxvd2VkVG9hZGRJdGVtKG5hbWUpICYmIFxyXG4gICAgICAgIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiYWRkXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICB0aGlzLl90YWdzLnB1c2gobmFtZSk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ1JlbW92ZShldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICB0aGlzLnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50Lm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgb25UYWdBZGQoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQubmFtZSkpIHtcclxuICAgICAgZXZlbnQubmFtZSA9IFwiXCI7XHJcbiAgICAgIGV2ZW50LmNsaWNrKG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnQ2hhbmdlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICghdGhpcy5pc0R1cGxpY2F0ZShldmVudC5uYW1lKSAmJiB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcImNoYW5nZVwiLCBpdGVtOiBldmVudC5vcmlnaW5hbE5hbWUsIHRvOiBldmVudC5uYW1lfSkpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQub3JpZ2luYWxOYW1lKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gZXZlbnQubmFtZTtcclxuICAgICAgZXZlbnQuaW5pdCgpO1xyXG4gICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnRHJvcChldmVudCkge1xyXG4gICAgY29uc3Qgc2luZCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICBjb25zdCBkaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LmRlc3RpbmF0aW9uLm5hbWUpO1xyXG5cclxuICAgIGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LmFwcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kucHJlcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKHNpbmQpO1xyXG4gICAgICAgICAgdGhpcy5fdGFncy5zcGxpY2Uoc2luZCwxKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuc3dhcE9uRHJvcCkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcInN3YXBcIiwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgICAgdGhpcy5fdGFnc1tzaW5kXSA9IHRoaXMuX3RhZ3Muc3BsaWNlKGRpbmQsIDEsIHRoaXMuX3RhZ3Nbc2luZF0pWzBdO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbiAgb25UYWdTZWxlY3QoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5vblRhZ0ZvY3VzKGV2ZW50KTtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0Olwic2VsZWN0XCIsIGl0ZW06IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LnNpbmdsZVNlbGVjdCkge1xyXG4gICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgLy8gMyBpcyB0ZXh0IGFuZCA4IGlzIGNvbW1lbnRcclxuICAgICAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ0ZvY3VzKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSB7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgIGlmIChsaXN0W2ldLm5vZGVUeXBlICE9PSAzICYmIGxpc3RbaV0ubm9kZVR5cGUgIT09IDgpIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwiZm9jdXNlZFwiLCBmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJmb2N1c2VkXCIsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==