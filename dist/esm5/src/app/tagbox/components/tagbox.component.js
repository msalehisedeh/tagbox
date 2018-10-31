/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, EventEmitter, ElementRef, Renderer } from '@angular/core';
import { DragDropPolicy, Selectionpolicy, EditPolicy } from '../interfaces/tagbox.interfaces';
var TagBoxComponent = /** @class */ (function () {
    function TagBoxComponent(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this._tags = [];
        this._selectedindex = [];
        this.onchange = new EventEmitter();
        this.onerror = new EventEmitter();
        this.onselect = new EventEmitter();
        this.beforeAction = function (event) { return true; };
        this.placeholder = "Add Tag";
    }
    /**
     * @return {?}
     */
    TagBoxComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        var _this = this;
        if (this.selectedindex &&
            (this.selectedindex instanceof String) &&
            (this.tags && !(this.tags instanceof String))) {
            /** @type {?} */
            var x = String(this.selectedindex);
            /** @type {?} */
            var list = x.split(",");
            list.map(function (t) {
                _this._selectedindex.push(parseInt(t));
            });
        }
        else {
            this._selectedindex = this.selectedindex ? this.selectedindex : [];
        }
        if (this.tags && !(this.tags instanceof Array)) {
            /** @type {?} */
            var x = String(this.tags);
            this._tags = x.split(this.delineateby ? this.delineateby : ",");
        }
        else {
            this._tags = this.tags ? this.tags : [];
        }
        this.renderer.setElementAttribute(this.el.nativeElement, "role", "list");
    };
    /**
     * @param {?} changes
     * @return {?}
     */
    TagBoxComponent.prototype.ngOnChanges = /**
     * @param {?} changes
     * @return {?}
     */
    function (changes) {
    };
    /**
     * @param {?} index
     * @return {?}
     */
    TagBoxComponent.prototype.itemSelectedAt = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var canSelect = this.selectionpolicy !== Selectionpolicy.disabled;
        return this._selectedindex.indexOf(index) < 0 ? false : canSelect;
    };
    /**
     * @param {?} index
     * @return {?}
     */
    TagBoxComponent.prototype.itemSelectionClass = /**
     * @param {?} index
     * @return {?}
     */
    function (index) {
        /** @type {?} */
        var selected = this.itemSelectedAt(index);
        return selected ? "selected" : ((index < 0 || this.selectionpolicy === Selectionpolicy.disabled) ? "left-padded" : "");
    };
    /**
     * @return {?}
     */
    TagBoxComponent.prototype.isRemovable = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        canRemove = canRemove && (!this.mintags || (this._tags.length > this.mintags));
        if (!canRemove) {
            this.onerror.emit("Unable to remove tag. Operation is not allowed.");
        }
        return canRemove;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    TagBoxComponent.prototype.isDuplicate = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var flag = this._tags.indexOf(name) < 0 ? false : true;
        if (flag) {
            this.onerror.emit("Unable to perform operation. Resulting duplicate tags is not allowed.");
        }
        return flag;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    TagBoxComponent.prototype.allowedToaddItem = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var canAdd = (this.editpolicy === EditPolicy.addAndRemove);
        canAdd = canAdd || (this.editpolicy === EditPolicy.addOnly);
        canAdd = canAdd && (!this.maxtags || (this._tags.length < this.maxtags));
        canAdd = canAdd && !this.isDuplicate(name);
        if (canAdd && this.maxtaglength) {
            /** @type {?} */
            var x = this._tags.join(this.delineateby ? this.delineateby : ",");
            if (x.length + name.length + 1 >= this.maxboxlength) {
                canAdd = false;
                this.onerror.emit("Unable to add tag. Resulting content will exceed maxtaglength.");
            }
        }
        return canAdd;
    };
    /**
     * @return {?}
     */
    TagBoxComponent.prototype.notifyChange = /**
     * @return {?}
     */
    function () {
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
    };
    /**
     * @return {?}
     */
    TagBoxComponent.prototype.notifySelection = /**
     * @return {?}
     */
    function () {
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onselect.emit({
            id: this.id,
            selecedIndex: this.selectedindex,
            formController: this.formController
        });
    };
    /**
     * @param {?} action
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    TagBoxComponent.prototype.createDropRequest = /**
     * @param {?} action
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    function (action, source, destination) {
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
    };
    /**
     * @param {?} index
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    TagBoxComponent.prototype.prependTagAt = /**
     * @param {?} index
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    function (index, source, destination) {
        /** @type {?} */
        var result = false;
        /** @type {?} */
        var newName = source.name + " " + this._tags[index];
        if (!this.maxtaglength || (this.maxtaglength && source.name.length <= this.maxtaglength)) {
            if (this.beforeAction(this.createDropRequest("prepend", source, destination))) {
                this._tags[index] = newName;
                result = true;
            }
        }
        return result;
    };
    /**
     * @param {?} index
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    TagBoxComponent.prototype.appendTagAt = /**
     * @param {?} index
     * @param {?} source
     * @param {?} destination
     * @return {?}
     */
    function (index, source, destination) {
        /** @type {?} */
        var result = false;
        /** @type {?} */
        var newName = this._tags[index] + " " + source.name;
        if (!this.maxtaglength || (this.maxtaglength && source.name.length <= this.maxtaglength)) {
            if (this.beforeAction(this.createDropRequest("append", source, destination))) {
                this._tags[index] = newName;
                result = true;
            }
        }
        return result;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    TagBoxComponent.prototype.removeTagWithName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        if (this.isRemovable() && this.beforeAction({ request: "remove", item: name })) {
            /** @type {?} */
            var index = this._tags.indexOf(name);
            /** @type {?} */
            var i = this._selectedindex.indexOf(index);
            this._tags.splice(index, 1);
            if (i >= 0) {
                this._selectedindex.splice(i, 1);
                this.notifyChange();
            }
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    TagBoxComponent.prototype.addTagWithName = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var index = this._tags.indexOf(name);
        /** @type {?} */
        var i = this._selectedindex.indexOf(index);
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagBoxComponent.prototype.onTagRemove = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.removeTagWithName(event.name);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagBoxComponent.prototype.onTagAdd = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.addTagWithName(event.name)) {
            event.name = "";
            event.click(null);
        }
        else {
            event.reset();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagBoxComponent.prototype.onTagChange = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (!this.isDuplicate(event.name) && this.beforeAction({ request: "change", item: event.originalName, to: event.name })) {
            /** @type {?} */
            var index = this._tags.indexOf(event.originalName);
            this._tags[index] = event.name;
            event.init();
            this.notifyChange();
        }
        else {
            event.reset();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagBoxComponent.prototype.onTagDrop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var sind = this._tags.indexOf(event.source.name);
        /** @type {?} */
        var dind = this._tags.indexOf(event.destination.name);
        if (this.dragpolicy === DragDropPolicy.appendOnDrop) {
            if (event.source.parent.id === event.destination.parent.id) {
                if (this.appendTagAt(dind, event.source, event.destination)) {
                    /** @type {?} */
                    var i = this._selectedindex.indexOf(sind);
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
                    var i = this._selectedindex.indexOf(sind);
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagBoxComponent.prototype.onTagSelect = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            this.onTagFocus(event);
            if (this.beforeAction({ request: "select", item: event.name })) {
                if (this.selectionpolicy === Selectionpolicy.singleSelect) {
                    /** @type {?} */
                    var list = this.el.nativeElement.childNodes;
                    for (var i = 0; i < list.length; i++) {
                        // 3 is text and 8 is comment
                        if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                            this.renderer.setElementClass(list[i], "selected", false);
                        }
                    }
                    /** @type {?} */
                    var index = this._tags.indexOf(event.name);
                    if (index >= 0) {
                        /** @type {?} */
                        var i = this._selectedindex.indexOf(index);
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
                    var index = this._tags.indexOf(event.name);
                    if (index >= 0) {
                        /** @type {?} */
                        var i = this._selectedindex.indexOf(index);
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagBoxComponent.prototype.onTagFocus = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            /** @type {?} */
            var list = this.el.nativeElement.childNodes;
            for (var i = 0; i < list.length; i++) {
                // 3 is text and 8 is comment
                if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                    this.renderer.setElementClass(list[i], "focused", false);
                }
            }
            /** @type {?} */
            var index = this._tags.indexOf(event.name);
            if (index >= 0) {
                this.renderer.setElementClass(event.el.nativeElement, "focused", true);
            }
        }
    };
    TagBoxComponent.decorators = [
        { type: Component, args: [{
                    // changeDetection: ChangeDetectionStrategy.OnPush,
                    selector: 'tagbox',
                    template: "\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    tabindex=\"0\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
                    styles: [":host{background-color:#fff;border:1px solid #ced4da;box-sizing:border-box;display:inline-block;min-height:50px;padding:5px;width:100%;border-radius:5px;margin-bottom:5px}:host.alert{background-color:#ff9f9b;border-color:#880500}:host:focus{border-color:#0ba}:host:hover{background-color:#ddd}"]
                }] }
    ];
    /** @nocollapse */
    TagBoxComponent.ctorParameters = function () { return [
        { type: Renderer },
        { type: ElementRef }
    ]; };
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
    return TagBoxComponent;
}());
export { TagBoxComponent };
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3RhZ2JveC8iLCJzb3VyY2VzIjpbInNyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUEsT0FBTyxFQUNMLFNBQVMsRUFJVCxLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsUUFBUSxFQUNULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxjQUFjLEVBQ2QsZUFBZSxFQUNmLFVBQVUsRUFDWCxNQUFNLGlDQUFpQyxDQUFDOztJQXlFdkMseUJBQW9CLFFBQWtCLEVBQVUsRUFBYztRQUExQyxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBWTtxQkE3RDVDLEVBQUU7OEJBQ08sRUFBRTt3QkFHbkIsSUFBSSxZQUFZLEVBQUU7dUJBR25CLElBQUksWUFBWSxFQUFFO3dCQUdqQixJQUFJLFlBQVksRUFBRTs0QkFHYixVQUFDLEtBQUssSUFBSyxPQUFBLElBQUksRUFBSixDQUFJOzJCQU1SLFNBQVM7S0E0QzlCOzs7O0lBRUQsa0NBQVE7OztJQUFSO1FBQUEsaUJBb0JDO1FBbkJDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhO1lBQ2xCLENBQUMsSUFBSSxDQUFDLGFBQWEsWUFBWSxNQUFNLENBQUM7WUFDdEMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztZQUNsRCxJQUFNLENBQUMsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztZQUM3QyxJQUFNLElBQUksR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDO2dCQUNULEtB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OEJBR3JCLEtBQUssU0FBQyxhQUFhO3lCQUduQixLQUFLLFNBQUMsUUFBUTsrQkFHZCxLQUFLLFNBQUMsY0FBYztrQ0FHcEIsS0FBSyxTQUFDLGlCQUFpQjs2QkFHdkIsS0FBSyxTQUFDLFlBQVk7NkJBR2xCLEtBQUssU0FBQyxZQUFZOzswQkF6RnJCOztTQThCYSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQ29tcGFyaXNpb24gVG9vbCB3aWxsIGxheW91dCB0d28gY29tcGFyaXNpb24gdHJlZXMgc2lkZSBieSBzaWRlIGFuZCBmZWVkIHRoZW0gYW4gaW50ZXJuYWwgb2JqZWN0XHJcbiAqIGhlaXJhcmNoeSBjcmVhdGVkIGZvciBpbnRlcm5hbCB1c2UgZnJvbSBKU09OIG9iamVjdHMgZ2l2ZW4gdG8gdGhpcyBjb21wb25lbnQuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSAnLi90YWcuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHNlbGVjdG9yOiAndGFnYm94JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vdGFnYm94LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi90YWdib3guY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFRhZ0JveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgX3RhZ3M6IHN0cmluZ1tdID0gW107XHJcbiAgX3NlbGVjdGVkaW5kZXg6IG51bWJlcltdID0gW107XHJcbiAgXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3I9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBJbnB1dChcImJlZm9yZUFjdGlvblwiKVxyXG4gIGJlZm9yZUFjdGlvbiA9IChldmVudCkgPT4gdHJ1ZTtcclxuXHJcbiAgQElucHV0KFwiaWRcIilcclxuICBpZDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJwbGFjZWhvbGRlclwiKVxyXG4gIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBcIkFkZCBUYWdcIjtcclxuICBcclxuICBASW5wdXQoXCJtYXhib3hsZW5ndGhcIilcclxuICBtYXhib3hsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWF4dGFnbGVuZ3RoXCIpXHJcbiAgbWF4dGFnbGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1heHRhZ3NcIilcclxuICBtYXh0YWdzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1pbnRhZ3NcIilcclxuICBtaW50YWdzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcImZvcm1Db250cm9sbGVyXCIpXHJcbiAgZm9ybUNvbnRyb2xsZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICBASW5wdXQoXCJ0YWdzXCIpXHJcbiAgdGFnczogYW55O1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3RlZGluZGV4XCIpXHJcbiAgc2VsZWN0ZWRpbmRleDogYW55O1xyXG5cclxuICBASW5wdXQoXCJkZWxpbmVhdGVieVwiKVxyXG4gIGRlbGluZWF0ZWJ5OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcImZvcm1hdFwiKVxyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyLCBwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XHJcblx0ICBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRpbmRleCAmJiBcclxuICAgICAgICAodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgU3RyaW5nKSAmJiBcclxuICAgICAgICAodGhpcy50YWdzICYmICEodGhpcy50YWdzIGluc3RhbmNlb2YgU3RyaW5nKSkpIHtcclxuICAgICAgY29uc3QgeDogc3RyaW5nID0gU3RyaW5nKHRoaXMuc2VsZWN0ZWRpbmRleCk7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB4LnNwbGl0KFwiLFwiKTtcclxuICAgICAgbGlzdC5tYXAoKHQpID0+IHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2gocGFyc2VJbnQodCkpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSB0aGlzLnNlbGVjdGVkaW5kZXggPyB0aGlzLnNlbGVjdGVkaW5kZXggOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy50YWdzICYmICEodGhpcy50YWdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgIGNvbnN0IHg6IHN0cmluZyA9IFN0cmluZyh0aGlzLnRhZ3MpO1xyXG4gICAgICB0aGlzLl90YWdzID0geC5zcGxpdCh0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3RhZ3MgPSB0aGlzLnRhZ3MgPyB0aGlzLnRhZ3MgOiBbXTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXCJyb2xlXCIsXCJsaXN0XCIpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG5cclxuICB9XHJcblxyXG4gIGl0ZW1TZWxlY3RlZEF0KGluZGV4KSB7XHJcbiAgICBjb25zdCBjYW5TZWxlY3QgPSB0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkO1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCkgPCAwID8gZmFsc2UgOiBjYW5TZWxlY3Q7XHJcbiAgfVxyXG5cclxuICBpdGVtU2VsZWN0aW9uQ2xhc3MoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5pdGVtU2VsZWN0ZWRBdChpbmRleCk7XHJcbiAgICByZXR1cm4gc2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiAoKGluZGV4IDwgMCB8fCB0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSA/IFwibGVmdC1wYWRkZWRcIiA6IFwiXCIpO1xyXG4gIH1cclxuXHJcbiAgaXNSZW1vdmFibGUoKSB7XHJcbiAgICBsZXQgY2FuUmVtb3ZlID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LnJlbW92ZU9ubHkpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSAmJiAoIXRoaXMubWludGFncyB8fCAodGhpcy5fdGFncy5sZW5ndGggPiB0aGlzLm1pbnRhZ3MpKTtcclxuXHJcbiAgICBpZiAoIWNhblJlbW92ZSkge1xyXG4gICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byByZW1vdmUgdGFnLiBPcGVyYXRpb24gaXMgbm90IGFsbG93ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICBjYW5SZW1vdmU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzRHVwbGljYXRlKG5hbWUpIHtcclxuICAgIGNvbnN0IGZsYWcgPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSkgPCAwID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgaWYgKGZsYWcpIHtcclxuICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uIFJlc3VsdGluZyBkdXBsaWNhdGUgdGFncyBpcyBub3QgYWxsb3dlZC5cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhZztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWxsb3dlZFRvYWRkSXRlbShuYW1lKSB7XHJcbiAgICBsZXQgY2FuQWRkID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZE9ubHkpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCAmJiAoIXRoaXMubWF4dGFncyB8fCAodGhpcy5fdGFncy5sZW5ndGggPCB0aGlzLm1heHRhZ3MpKTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgJiYgIXRoaXMuaXNEdXBsaWNhdGUobmFtZSk7XHJcblxyXG4gICAgaWYgKGNhbkFkZCAmJiB0aGlzLm1heHRhZ2xlbmd0aCkge1xyXG4gICAgICBjb25zdCB4ID0gdGhpcy5fdGFncy5qb2luKCB0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgICAgaWYgKHgubGVuZ3RoK25hbWUubGVuZ3RoKzEgPj0gdGhpcy5tYXhib3hsZW5ndGgpIHtcclxuICAgICAgICBjYW5BZGQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byBhZGQgdGFnLiBSZXN1bHRpbmcgY29udGVudCB3aWxsIGV4Y2VlZCBtYXh0YWdsZW5ndGguXCIpO1xyXG4gICAgICB9XHJcbiAgICB9ICAgIFxyXG4gICAgcmV0dXJuICBjYW5BZGQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG5vdGlmeUNoYW5nZSgpIHtcclxuICAgIHRoaXMudGFncyA9ICh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBBcnJheSkgPyB0aGlzLl90YWdzIDogdGhpcy5fdGFncy5qb2luKCB0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRpbmRleCA9ICEodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgQXJyYXkpID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9zZWxlY3RlZGluZGV4Lmxlbmd0aCA/IHRoaXMuX3NlbGVjdGVkaW5kZXguam9pbihcIixcIikgOiBcIlwiKTtcclxuICAgIHRoaXMub25jaGFuZ2UuZW1pdCh7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MsXHJcbiAgICAgIHNlbGVjZWRJbmRleDogdGhpcy5zZWxlY3RlZGluZGV4LFxyXG4gICAgICBmb3JtQ29udHJvbGxlcjogdGhpcy5mb3JtQ29udHJvbGxlclxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgbm90aWZ5U2VsZWN0aW9uKCkge1xyXG4gICAgdGhpcy5zZWxlY3RlZGluZGV4ID0gISh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5fc2VsZWN0ZWRpbmRleC5sZW5ndGggPyB0aGlzLl9zZWxlY3RlZGluZGV4LmpvaW4oXCIsXCIpIDogXCJcIik7XHJcbiAgICB0aGlzLm9uc2VsZWN0LmVtaXQoe1xyXG4gICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgc2VsZWNlZEluZGV4OiB0aGlzLnNlbGVjdGVkaW5kZXgsXHJcbiAgICAgIGZvcm1Db250cm9sbGVyOiB0aGlzLmZvcm1Db250cm9sbGVyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjcmVhdGVEcm9wUmVxdWVzdChhY3Rpb24sIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlcXVlc3Q6IFwiZHJvcFwiLFxyXG4gICAgICBhY3Rpb246IGFjdGlvbixcclxuICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgaWQ6IHNvdXJjZS5wYXJlbnQuaWQsXHJcbiAgICAgICAgbmFtZTogc291cmNlLm5hbWVcclxuICAgICAgfSxcclxuICAgICAgZGVzdGluYXRpb246IHtcclxuICAgICAgICBpZDogZGVzdGluYXRpb24ucGFyZW50LmlkLFxyXG4gICAgICAgIG5hbWU6IGRlc3RpbmF0aW9uLm5hbWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHByZXBlbmRUYWdBdChpbmRleCwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IHNvdXJjZS5uYW1lICArIFwiIFwiICsgdGhpcy5fdGFnc1tpbmRleF07XHJcbiAgICBpZiAoIXRoaXMubWF4dGFnbGVuZ3RoIHx8ICAodGhpcy5tYXh0YWdsZW5ndGggJiYgc291cmNlLm5hbWUubGVuZ3RoIDw9IHRoaXMubWF4dGFnbGVuZ3RoKSkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcInByZXBlbmRcIiwgc291cmNlLCBkZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBuZXdOYW1lO1xyXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHByaXZhdGUgYXBwZW5kVGFnQXQoaW5kZXgsIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgIGNvbnN0IG5ld05hbWUgPSB0aGlzLl90YWdzW2luZGV4XSArIFwiIFwiICsgc291cmNlLm5hbWU7XHJcbiAgICBpZiAoIXRoaXMubWF4dGFnbGVuZ3RoIHx8ICAodGhpcy5tYXh0YWdsZW5ndGggJiYgc291cmNlLm5hbWUubGVuZ3RoIDw9IHRoaXMubWF4dGFnbGVuZ3RoKSkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcImFwcGVuZFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG5ld05hbWU7XHJcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcmVtb3ZlVGFnV2l0aE5hbWUobmFtZSkge1xyXG4gICAgaWYgKHRoaXMuaXNSZW1vdmFibGUoKSAmJiB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcInJlbW92ZVwiLCBpdGVtOiBuYW1lfSkpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG5cclxuICAgICAgdGhpcy5fdGFncy5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgIGlmIChpID49IDApIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgYWRkVGFnV2l0aE5hbWUobmFtZSkge1xyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpO1xyXG4gICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgICBcclxuICAgIGlmIChpbmRleCA8IDAgICYmIFxyXG4gICAgICAgIG5hbWUubGVuZ3RoICYmIFxyXG4gICAgICAgIHRoaXMuYWxsb3dlZFRvYWRkSXRlbShuYW1lKSAmJiBcclxuICAgICAgICB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcImFkZFwiLCBpdGVtOiBuYW1lfSkpIHtcclxuICAgICAgdGhpcy5fdGFncy5wdXNoKG5hbWUpO1xyXG4gICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgb25UYWdSZW1vdmUoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgdGhpcy5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5uYW1lKTtcclxuICB9XHJcblxyXG4gIG9uVGFnQWRkKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLmFkZFRhZ1dpdGhOYW1lKGV2ZW50Lm5hbWUpKSB7XHJcbiAgICAgIGV2ZW50Lm5hbWUgPSBcIlwiO1xyXG4gICAgICBldmVudC5jbGljayhudWxsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGV2ZW50LnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblRhZ0NoYW5nZShldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNEdXBsaWNhdGUoZXZlbnQubmFtZSkgJiYgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJjaGFuZ2VcIiwgaXRlbTogZXZlbnQub3JpZ2luYWxOYW1lLCB0bzogZXZlbnQubmFtZX0pKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm9yaWdpbmFsTmFtZSk7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLl90YWdzW2luZGV4XSA9IGV2ZW50Lm5hbWU7XHJcbiAgICAgIGV2ZW50LmluaXQoKTtcclxuICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGV2ZW50LnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblRhZ0Ryb3AoZXZlbnQpIHtcclxuICAgIGNvbnN0IHNpbmQgPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgY29uc3QgZGluZCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5kZXN0aW5hdGlvbi5uYW1lKTtcclxuXHJcbiAgICBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5hcHBlbmRPbkRyb3ApIHtcclxuICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKHNpbmQpO1xyXG4gICAgICAgICAgdGhpcy5fdGFncy5zcGxpY2Uoc2luZCwxKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LnByZXBlbmRPbkRyb3ApIHtcclxuICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihzaW5kKTtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKHNpbmQsMSk7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LnN3YXBPbkRyb3ApIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJzd2FwXCIsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Nbc2luZF0gPSB0aGlzLl90YWdzLnNwbGljZShkaW5kLCAxLCB0aGlzLl90YWdzW3NpbmRdKVswXTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGlzLmFkZFRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LmRlc3RpbmF0aW9uLm5hbWUpO1xyXG4gICAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG4gIG9uVGFnU2VsZWN0KGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSB7XHJcbiAgICAgIHRoaXMub25UYWdGb2N1cyhldmVudCk7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcInNlbGVjdFwiLCBpdGVtOiBldmVudC5uYW1lfSkpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgPT09IFNlbGVjdGlvbnBvbGljeS5zaW5nbGVTZWxlY3QpIHtcclxuICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgICAgIGZvcihsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vIDMgaXMgdGV4dCBhbmQgOCBpcyBjb21tZW50XHJcbiAgICAgICAgICAgIGlmIChsaXN0W2ldLm5vZGVUeXBlICE9PSAzICYmIGxpc3RbaV0ubm9kZVR5cGUgIT09IDgpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhsaXN0W2ldLCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gIFxyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gIFxyXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgb25UYWdGb2N1cyhldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkge1xyXG4gICAgICBjb25zdCBsaXN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgIGZvcihsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgLy8gMyBpcyB0ZXh0IGFuZCA4IGlzIGNvbW1lbnRcclxuICAgICAgICBpZiAobGlzdFtpXS5ub2RlVHlwZSAhPT0gMyAmJiBsaXN0W2ldLm5vZGVUeXBlICE9PSA4KSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhsaXN0W2ldLCBcImZvY3VzZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwiZm9jdXNlZFwiLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=