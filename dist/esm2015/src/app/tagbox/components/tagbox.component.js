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
        canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
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
        canAdd = canAdd || (this.editpolicy === EditPolicy.addRemoveModify);
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
            if (this._selectedindex instanceof Array) {
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
            else {
                this._selectedindex = [];
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
                template: "\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZ2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFDTCxTQUFTLEVBSVQsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFFBQVEsRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixVQUFVLEVBQ1gsTUFBTSxpQ0FBaUMsQ0FBQztBQVV6QyxNQUFNOzs7OztJQStESixZQUFvQixRQUFrQixFQUFVLEVBQWM7UUFBMUMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVk7cUJBN0Q1QyxFQUFFOzhCQUNPLEVBQUU7d0JBR25CLElBQUksWUFBWSxFQUFFO3VCQUduQixJQUFJLFlBQVksRUFBRTt3QkFHakIsSUFBSSxZQUFZLEVBQUU7NEJBR2IsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUk7MkJBTVIsU0FBUztLQTRDOUI7Ozs7SUFFRCxRQUFRO1FBQ04sRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWE7WUFDbEIsQ0FBQyxJQUFJLENBQUMsYUFBYSxZQUFZLE1BQU0sQ0FBQztZQUN0QyxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O1lBQ2xELE1BQU0sQ0FBQyxHQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7O1lBQzdDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNi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QUssU0FBQyxjQUFjOzJCQUdwQixLQUFLLFNBQUMsY0FBYztzQkFHcEIsS0FBSyxTQUFDLFNBQVM7c0JBR2YsS0FBSyxTQUFDLFNBQVM7NkJBR2YsS0FBSyxTQUFDLGdCQUFnQjttQkFHdEIsS0FBSyxTQUFDLE1BQU07NEJBR1osS0FBSyxTQUFDLGVBQWU7MEJBR3JCLEtBQUssU0FBQyxhQUFhO3FCQUduQixLQUFLLFNBQUMsUUFBUTsyQkFHZCxLQUFLLFNBQUMsY0FBYzs4QkFHcEIsS0FBSyxTQUFDLGlCQUFpQjt5QkFHdkIsS0FBSyxTQUFDLFlBQVk7eUJBR2xCLEtBQUssU0FBQyxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ29tcGFyaXNpb24gVG9vbCB3aWxsIGxheW91dCB0d28gY29tcGFyaXNpb24gdHJlZXMgc2lkZSBieSBzaWRlIGFuZCBmZWVkIHRoZW0gYW4gaW50ZXJuYWwgb2JqZWN0XHJcbiAqIGhlaXJhcmNoeSBjcmVhdGVkIGZvciBpbnRlcm5hbCB1c2UgZnJvbSBKU09OIG9iamVjdHMgZ2l2ZW4gdG8gdGhpcyBjb21wb25lbnQuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSAnLi90YWcuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHNlbGVjdG9yOiAndGFnYm94JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vdGFnYm94LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi90YWdib3guY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFRhZ0JveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgX3RhZ3M6IHN0cmluZ1tdID0gW107XHJcbiAgX3NlbGVjdGVkaW5kZXg6IG51bWJlcltdID0gW107XHJcbiAgXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3I9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBJbnB1dChcImJlZm9yZUFjdGlvblwiKVxyXG4gIGJlZm9yZUFjdGlvbiA9IChldmVudCkgPT4gdHJ1ZTtcclxuXHJcbiAgQElucHV0KFwiaWRcIilcclxuICBpZDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJwbGFjZWhvbGRlclwiKVxyXG4gIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBcIkFkZCBUYWdcIjtcclxuICBcclxuICBASW5wdXQoXCJtYXhib3hsZW5ndGhcIilcclxuICBtYXhib3hsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWF4dGFnbGVuZ3RoXCIpXHJcbiAgbWF4dGFnbGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1heHRhZ3NcIilcclxuICBtYXh0YWdzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1pbnRhZ3NcIilcclxuICBtaW50YWdzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcImZvcm1Db250cm9sbGVyXCIpXHJcbiAgZm9ybUNvbnRyb2xsZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICBASW5wdXQoXCJ0YWdzXCIpXHJcbiAgdGFnczogYW55O1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3RlZGluZGV4XCIpXHJcbiAgc2VsZWN0ZWRpbmRleDogYW55O1xyXG5cclxuICBASW5wdXQoXCJkZWxpbmVhdGVieVwiKVxyXG4gIGRlbGluZWF0ZWJ5OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcImZvcm1hdFwiKVxyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyLCBwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XHJcblx0ICBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRpbmRleCAmJiBcclxuICAgICAgICAodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgU3RyaW5nKSAmJiBcclxuICAgICAgICAodGhpcy50YWdzICYmICEodGhpcy50YWdzIGluc3RhbmNlb2YgU3RyaW5nKSkpIHtcclxuICAgICAgY29uc3QgeDogc3RyaW5nID0gU3RyaW5nKHRoaXMuc2VsZWN0ZWRpbmRleCk7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB4LnNwbGl0KFwiLFwiKTtcclxuICAgICAgbGlzdC5tYXAoKHQpID0+IHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2gocGFyc2VJbnQodCkpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSB0aGlzLnNlbGVjdGVkaW5kZXggPyB0aGlzLnNlbGVjdGVkaW5kZXggOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy50YWdzICYmICEodGhpcy50YWdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgIGNvbnN0IHg6IHN0cmluZyA9IFN0cmluZyh0aGlzLnRhZ3MpO1xyXG4gICAgICB0aGlzLl90YWdzID0geC5zcGxpdCh0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3RhZ3MgPSB0aGlzLnRhZ3MgPyB0aGlzLnRhZ3MgOiBbXTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXCJyb2xlXCIsXCJsaXN0XCIpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG5cclxuICB9XHJcblxyXG4gIGl0ZW1TZWxlY3RlZEF0KGluZGV4KSB7XHJcbiAgICBjb25zdCBjYW5TZWxlY3QgPSB0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkO1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCkgPCAwID8gZmFsc2UgOiBjYW5TZWxlY3Q7XHJcbiAgfVxyXG5cclxuICBpdGVtU2VsZWN0aW9uQ2xhc3MoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5pdGVtU2VsZWN0ZWRBdChpbmRleCk7XHJcbiAgICByZXR1cm4gc2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiAoKGluZGV4IDwgMCB8fCB0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSA/IFwibGVmdC1wYWRkZWRcIiA6IFwiXCIpO1xyXG4gIH1cclxuXHJcbiAgaXNSZW1vdmFibGUoKSB7XHJcbiAgICBsZXQgY2FuUmVtb3ZlID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZFJlbW92ZU1vZGlmeSk7XHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5yZW1vdmVPbmx5KTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgJiYgKCF0aGlzLm1pbnRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoID4gdGhpcy5taW50YWdzKSk7XHJcblxyXG4gICAgaWYgKCFjYW5SZW1vdmUpIHtcclxuICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gcmVtb3ZlIHRhZy4gT3BlcmF0aW9uIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0R1cGxpY2F0ZShuYW1lKSB7XHJcbiAgICBjb25zdCBmbGFnID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpIDwgMCA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIGlmIChmbGFnKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLiBSZXN1bHRpbmcgZHVwbGljYXRlIHRhZ3MgaXMgbm90IGFsbG93ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZsYWc7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFsbG93ZWRUb2FkZEl0ZW0obmFtZSkge1xyXG4gICAgbGV0IGNhbkFkZCA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gICAgY2FuQWRkID0gY2FuQWRkIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkT25seSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICghdGhpcy5tYXh0YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA8IHRoaXMubWF4dGFncykpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCAmJiAhdGhpcy5pc0R1cGxpY2F0ZShuYW1lKTtcclxuXHJcbiAgICBpZiAoY2FuQWRkICYmIHRoaXMubWF4dGFnbGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IHggPSB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgICBpZiAoeC5sZW5ndGgrbmFtZS5sZW5ndGgrMSA+PSB0aGlzLm1heGJveGxlbmd0aCkge1xyXG4gICAgICAgIGNhbkFkZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIGFkZCB0YWcuIFJlc3VsdGluZyBjb250ZW50IHdpbGwgZXhjZWVkIG1heHRhZ2xlbmd0aC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICByZXR1cm4gIGNhbkFkZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm90aWZ5Q2hhbmdlKCkge1xyXG4gICAgdGhpcy50YWdzID0gKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXMuX3RhZ3MgOiB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgdGhpcy5zZWxlY3RlZGluZGV4ID0gISh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbmNoYW5nZS5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHRhZ3M6IHRoaXMudGFncyxcclxuICAgICAgc2VsZWNlZEluZGV4OiB0aGlzLnNlbGVjdGVkaW5kZXgsXHJcbiAgICAgIGZvcm1Db250cm9sbGVyOiB0aGlzLmZvcm1Db250cm9sbGVyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBub3RpZnlTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9zZWxlY3RlZGluZGV4Lmxlbmd0aCA/IHRoaXMuX3NlbGVjdGVkaW5kZXguam9pbihcIixcIikgOiBcIlwiKTtcclxuICAgIHRoaXMub25zZWxlY3QuZW1pdCh7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGNyZWF0ZURyb3BSZXF1ZXN0KGFjdGlvbiwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVxdWVzdDogXCJkcm9wXCIsXHJcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICBzb3VyY2U6IHtcclxuICAgICAgICBpZDogc291cmNlLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBzb3VyY2UubmFtZVxyXG4gICAgICB9LFxyXG4gICAgICBkZXN0aW5hdGlvbjoge1xyXG4gICAgICAgIGlkOiBkZXN0aW5hdGlvbi5wYXJlbnQuaWQsXHJcbiAgICAgICAgbmFtZTogZGVzdGluYXRpb24ubmFtZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgcHJlcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gc291cmNlLm5hbWUgICsgXCIgXCIgKyB0aGlzLl90YWdzW2luZGV4XTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwicHJlcGVuZFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG5ld05hbWU7XHJcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcHJpdmF0ZSBhcHBlbmRUYWdBdChpbmRleCwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IHRoaXMuX3RhZ3NbaW5kZXhdICsgXCIgXCIgKyBzb3VyY2UubmFtZTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwiYXBwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICByZW1vdmVUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwicmVtb3ZlXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICBpZiAodGhpcy5fc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5fdGFncy5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICAgIFxyXG4gICAgaWYgKGluZGV4IDwgMCAgJiYgXHJcbiAgICAgICAgbmFtZS5sZW5ndGggJiYgXHJcbiAgICAgICAgdGhpcy5hbGxvd2VkVG9hZGRJdGVtKG5hbWUpICYmIFxyXG4gICAgICAgIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiYWRkXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICB0aGlzLl90YWdzLnB1c2gobmFtZSk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ1JlbW92ZShldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICB0aGlzLnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50Lm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgb25UYWdBZGQoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQubmFtZSkpIHtcclxuICAgICAgZXZlbnQubmFtZSA9IFwiXCI7XHJcbiAgICAgIGV2ZW50LmNsaWNrKG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnQ2hhbmdlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICghdGhpcy5pc0R1cGxpY2F0ZShldmVudC5uYW1lKSAmJiB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcImNoYW5nZVwiLCBpdGVtOiBldmVudC5vcmlnaW5hbE5hbWUsIHRvOiBldmVudC5uYW1lfSkpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQub3JpZ2luYWxOYW1lKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gZXZlbnQubmFtZTtcclxuICAgICAgZXZlbnQuaW5pdCgpO1xyXG4gICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnRHJvcChldmVudCkge1xyXG4gICAgY29uc3Qgc2luZCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICBjb25zdCBkaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LmRlc3RpbmF0aW9uLm5hbWUpO1xyXG5cclxuICAgIGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LmFwcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kucHJlcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKHNpbmQpO1xyXG4gICAgICAgICAgdGhpcy5fdGFncy5zcGxpY2Uoc2luZCwxKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuc3dhcE9uRHJvcCkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcInN3YXBcIiwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgICAgdGhpcy5fdGFnc1tzaW5kXSA9IHRoaXMuX3RhZ3Muc3BsaWNlKGRpbmQsIDEsIHRoaXMuX3RhZ3Nbc2luZF0pWzBdO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbiAgb25UYWdTZWxlY3QoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5vblRhZ0ZvY3VzKGV2ZW50KTtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0Olwic2VsZWN0XCIsIGl0ZW06IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LnNpbmdsZVNlbGVjdCkge1xyXG4gICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgLy8gMyBpcyB0ZXh0IGFuZCA4IGlzIGNvbW1lbnRcclxuICAgICAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ0ZvY3VzKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSB7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgIGlmIChsaXN0W2ldLm5vZGVUeXBlICE9PSAzICYmIGxpc3RbaV0ubm9kZVR5cGUgIT09IDgpIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwiZm9jdXNlZFwiLCBmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJmb2N1c2VkXCIsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==