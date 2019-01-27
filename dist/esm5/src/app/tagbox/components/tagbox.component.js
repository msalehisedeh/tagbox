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
        canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
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
        canAdd = canAdd || (this.editpolicy === EditPolicy.addRemoveModify);
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
            if (this._selectedindex instanceof Array) {
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
            else {
                this._selectedindex = [];
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
                    template: "\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZ2JveC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUlBLE9BQU8sRUFDTCxTQUFTLEVBSVQsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFFBQVEsRUFDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixVQUFVLEVBQ1gsTUFBTSxpQ0FBaUMsQ0FBQzs7SUF5RXZDLHlCQUFvQixRQUFrQixFQUFVLEVBQWM7UUFBMUMsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUFVLE9BQUUsR0FBRixFQUFFLENBQVk7cUJBN0Q1QyxFQUFFOzhCQUNPLEVBQUU7d0JBR25CLElBQUksWUFBWSxFQUFFO3VCQUduQixJQUFJLFlBQVksRUFBRTt3QkFHakIsSUFBSSxZQUFZLEVBQUU7NEJBR2IsVUFBQyxLQUFLLElBQUssT0FBQSxJQUFJLEVBQUosQ0FBSTsyQkFNUixTQUFTO0tBNEM5Qjs7OztJQUVELGtDQUFROzs7SUFBUjtRQUFBLGlCQW9CQztRQW5CQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYTtZQUNsQixDQUFDLElBQUksQ0FBQyxhQUFhLFlBQVksTUFBTSxDQUFDO1lBQ3RDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7WUFDbEQsSUFBTSxDQUFDLEdBQVcsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQzs7WUFDN0MsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQztn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LFVBQVU7OzsyQkF1QlQsTUFBTSxTQUFDLFVBQVU7MEJBR2pCLE1BQU0sU0FBQyxTQUFTOzJCQUdoQixNQUFNLFNBQUMsVUFBVTsrQkFHakIsS0FBSyxTQUFDLGNBQWM7cUJBR3BCLEtBQUssU0FBQyxJQUFJOzhCQUdWLEtBQUssU0FBQyxhQUFhOytCQUduQixLQUFLLFNBQUMsY0FBYzsrQkFHcEIsS0FBSyxTQUFDLGNBQWM7MEJBR3BCLEtBQUssU0FBQyxTQUFTOzBCQUdmLEtBQUssU0FBQyxTQUFTO2lDQUdmLEtBQUssU0FBQyxnQkFBZ0I7dUJBR3RCLEtBQUssU0FBQyxNQUFNO2dDQUdaLEtBQUssU0FBQyxlQUFlOzhCQUdyQixLQUFLLFNBQUMsYUFBYTt5QkFHbkIsS0FBSyxTQUFDLFFBQVE7K0JBR2QsS0FBSyxTQUFDLGNBQWM7a0NBR3BCLEtBQUssU0FBQyxpQkFBaUI7NkJBR3ZCLEtBQUssU0FBQyxZQUFZOzZCQUdsQixLQUFLLFNBQUMsWUFBWTs7MEJBekZyQjs7U0E4QmEsZUFBZSIsInNvdXJjZXNDb250ZW50IjpbIi8qXHJcbiAqIENvbXBhcmlzaW9uIFRvb2wgd2lsbCBsYXlvdXQgdHdvIGNvbXBhcmlzaW9uIHRyZWVzIHNpZGUgYnkgc2lkZSBhbmQgZmVlZCB0aGVtIGFuIGludGVybmFsIG9iamVjdFxyXG4gKiBoZWlyYXJjaHkgY3JlYXRlZCBmb3IgaW50ZXJuYWwgdXNlIGZyb20gSlNPTiBvYmplY3RzIGdpdmVuIHRvIHRoaXMgY29tcG9uZW50LlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vdGFnLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBzZWxlY3RvcjogJ3RhZ2JveCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZ2JveC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnYm94LmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdCb3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIF90YWdzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIF9zZWxlY3RlZGluZGV4OiBudW1iZXJbXSA9IFtdO1xyXG4gIFxyXG4gIEBPdXRwdXQoXCJvbmNoYW5nZVwiKVxyXG4gIG9uY2hhbmdlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uZXJyb3JcIilcclxuICBvbmVycm9yPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uc2VsZWN0XCIpXHJcbiAgb25zZWxlY3Q9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoXCJiZWZvcmVBY3Rpb25cIilcclxuICBiZWZvcmVBY3Rpb24gPSAoZXZlbnQpID0+IHRydWU7XHJcblxyXG4gIEBJbnB1dChcImlkXCIpXHJcbiAgaWQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicGxhY2Vob2xkZXJcIilcclxuICBwbGFjZWhvbGRlcjogc3RyaW5nID0gXCJBZGQgVGFnXCI7XHJcbiAgXHJcbiAgQElucHV0KFwibWF4Ym94bGVuZ3RoXCIpXHJcbiAgbWF4Ym94bGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1heHRhZ2xlbmd0aFwiKVxyXG4gIG1heHRhZ2xlbmd0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtYXh0YWdzXCIpXHJcbiAgbWF4dGFnczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtaW50YWdzXCIpXHJcbiAgbWludGFnczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJmb3JtQ29udHJvbGxlclwiKVxyXG4gIGZvcm1Db250cm9sbGVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgQElucHV0KFwidGFnc1wiKVxyXG4gIHRhZ3M6IGFueTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0ZWRpbmRleFwiKVxyXG4gIHNlbGVjdGVkaW5kZXg6IGFueTtcclxuXHJcbiAgQElucHV0KFwiZGVsaW5lYXRlYnlcIilcclxuICBkZWxpbmVhdGVieTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJmb3JtYXRcIilcclxuICBmb3JtYXQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwiYXV0b2NvbXBsZXRlXCIpXHJcbiAgYXV0b2NvbXBsZXRlOiBzdHJpbmdbXTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0aW9ucG9saWN5XCIpXHJcbiAgc2VsZWN0aW9ucG9saWN5OiBTZWxlY3Rpb25wb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImVkaXRwb2xpY3lcIilcclxuICBlZGl0cG9saWN5OiBFZGl0UG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJkcmFncG9saWN5XCIpXHJcbiAgZHJhZ3BvbGljeTogRHJhZ0Ryb3BQb2xpY3k7XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xyXG5cdCAgXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkaW5kZXggJiYgXHJcbiAgICAgICAgKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIFN0cmluZykgJiYgXHJcbiAgICAgICAgKHRoaXMudGFncyAmJiAhKHRoaXMudGFncyBpbnN0YW5jZW9mIFN0cmluZykpKSB7XHJcbiAgICAgIGNvbnN0IHg6IHN0cmluZyA9IFN0cmluZyh0aGlzLnNlbGVjdGVkaW5kZXgpO1xyXG4gICAgICBjb25zdCBsaXN0ID0geC5zcGxpdChcIixcIik7XHJcbiAgICAgIGxpc3QubWFwKCh0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5wdXNoKHBhcnNlSW50KHQpKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gdGhpcy5zZWxlY3RlZGluZGV4ID8gdGhpcy5zZWxlY3RlZGluZGV4IDogW107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudGFncyAmJiAhKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICBjb25zdCB4OiBzdHJpbmcgPSBTdHJpbmcodGhpcy50YWdzKTtcclxuICAgICAgdGhpcy5fdGFncyA9IHguc3BsaXQodGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl90YWdzID0gdGhpcy50YWdzID8gdGhpcy50YWdzIDogW107XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LFwicm9sZVwiLFwibGlzdFwiKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpdGVtU2VsZWN0ZWRBdChpbmRleCkge1xyXG4gICAgY29uc3QgY2FuU2VsZWN0ID0gdGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZDtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpIDwgMCA/IGZhbHNlIDogY2FuU2VsZWN0O1xyXG4gIH1cclxuXHJcbiAgaXRlbVNlbGVjdGlvbkNsYXNzKGluZGV4KSB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuaXRlbVNlbGVjdGVkQXQoaW5kZXgpO1xyXG4gICAgcmV0dXJuIHNlbGVjdGVkID8gXCJzZWxlY3RlZFwiIDogKChpbmRleCA8IDAgfHwgdGhpcy5zZWxlY3Rpb25wb2xpY3kgPT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkgPyBcImxlZnQtcGFkZGVkXCIgOiBcIlwiKTtcclxuICB9XHJcblxyXG4gIGlzUmVtb3ZhYmxlKCkge1xyXG4gICAgbGV0IGNhblJlbW92ZSA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlICYmICghdGhpcy5taW50YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA+IHRoaXMubWludGFncykpO1xyXG5cclxuICAgIGlmICghY2FuUmVtb3ZlKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHJlbW92ZSB0YWcuIE9wZXJhdGlvbiBpcyBub3QgYWxsb3dlZC5cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNEdXBsaWNhdGUobmFtZSkge1xyXG4gICAgY29uc3QgZmxhZyA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKSA8IDAgPyBmYWxzZSA6IHRydWU7XHJcbiAgICBpZiAoZmxhZykge1xyXG4gICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byBwZXJmb3JtIG9wZXJhdGlvbi4gUmVzdWx0aW5nIGR1cGxpY2F0ZSB0YWdzIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmbGFnO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhbGxvd2VkVG9hZGRJdGVtKG5hbWUpIHtcclxuICAgIGxldCBjYW5BZGQgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkUmVtb3ZlTW9kaWZ5KTtcclxuICAgIGNhbkFkZCA9IGNhbkFkZCB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZE9ubHkpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCAmJiAoIXRoaXMubWF4dGFncyB8fCAodGhpcy5fdGFncy5sZW5ndGggPCB0aGlzLm1heHRhZ3MpKTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgJiYgIXRoaXMuaXNEdXBsaWNhdGUobmFtZSk7XHJcblxyXG4gICAgaWYgKGNhbkFkZCAmJiB0aGlzLm1heHRhZ2xlbmd0aCkge1xyXG4gICAgICBjb25zdCB4ID0gdGhpcy5fdGFncy5qb2luKCB0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgICAgaWYgKHgubGVuZ3RoK25hbWUubGVuZ3RoKzEgPj0gdGhpcy5tYXhib3hsZW5ndGgpIHtcclxuICAgICAgICBjYW5BZGQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byBhZGQgdGFnLiBSZXN1bHRpbmcgY29udGVudCB3aWxsIGV4Y2VlZCBtYXh0YWdsZW5ndGguXCIpO1xyXG4gICAgICB9XHJcbiAgICB9ICAgIFxyXG4gICAgcmV0dXJuICBjYW5BZGQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIG5vdGlmeUNoYW5nZSgpIHtcclxuICAgIHRoaXMudGFncyA9ICh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBBcnJheSkgPyB0aGlzLl90YWdzIDogdGhpcy5fdGFncy5qb2luKCB0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgIHRoaXMuc2VsZWN0ZWRpbmRleCA9ICEodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgQXJyYXkpID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9zZWxlY3RlZGluZGV4Lmxlbmd0aCA/IHRoaXMuX3NlbGVjdGVkaW5kZXguam9pbihcIixcIikgOiBcIlwiKTtcclxuICAgIHRoaXMub25jaGFuZ2UuZW1pdCh7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICB0YWdzOiB0aGlzLnRhZ3MsXHJcbiAgICAgIHNlbGVjZWRJbmRleDogdGhpcy5zZWxlY3RlZGluZGV4LFxyXG4gICAgICBmb3JtQ29udHJvbGxlcjogdGhpcy5mb3JtQ29udHJvbGxlclxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgbm90aWZ5U2VsZWN0aW9uKCkge1xyXG4gICAgdGhpcy5zZWxlY3RlZGluZGV4ID0gISh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA6IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5fc2VsZWN0ZWRpbmRleC5sZW5ndGggPyB0aGlzLl9zZWxlY3RlZGluZGV4LmpvaW4oXCIsXCIpIDogXCJcIik7XHJcbiAgICB0aGlzLm9uc2VsZWN0LmVtaXQoe1xyXG4gICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgc2VsZWNlZEluZGV4OiB0aGlzLnNlbGVjdGVkaW5kZXgsXHJcbiAgICAgIGZvcm1Db250cm9sbGVyOiB0aGlzLmZvcm1Db250cm9sbGVyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBjcmVhdGVEcm9wUmVxdWVzdChhY3Rpb24sIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHJlcXVlc3Q6IFwiZHJvcFwiLFxyXG4gICAgICBhY3Rpb246IGFjdGlvbixcclxuICAgICAgc291cmNlOiB7XHJcbiAgICAgICAgaWQ6IHNvdXJjZS5wYXJlbnQuaWQsXHJcbiAgICAgICAgbmFtZTogc291cmNlLm5hbWVcclxuICAgICAgfSxcclxuICAgICAgZGVzdGluYXRpb246IHtcclxuICAgICAgICBpZDogZGVzdGluYXRpb24ucGFyZW50LmlkLFxyXG4gICAgICAgIG5hbWU6IGRlc3RpbmF0aW9uLm5hbWVcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBwcml2YXRlIHByZXBlbmRUYWdBdChpbmRleCwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IHNvdXJjZS5uYW1lICArIFwiIFwiICsgdGhpcy5fdGFnc1tpbmRleF07XHJcbiAgICBpZiAoIXRoaXMubWF4dGFnbGVuZ3RoIHx8ICAodGhpcy5tYXh0YWdsZW5ndGggJiYgc291cmNlLm5hbWUubGVuZ3RoIDw9IHRoaXMubWF4dGFnbGVuZ3RoKSkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcInByZXBlbmRcIiwgc291cmNlLCBkZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBuZXdOYW1lO1xyXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHByaXZhdGUgYXBwZW5kVGFnQXQoaW5kZXgsIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgIGNvbnN0IG5ld05hbWUgPSB0aGlzLl90YWdzW2luZGV4XSArIFwiIFwiICsgc291cmNlLm5hbWU7XHJcbiAgICBpZiAoIXRoaXMubWF4dGFnbGVuZ3RoIHx8ICAodGhpcy5tYXh0YWdsZW5ndGggJiYgc291cmNlLm5hbWUubGVuZ3RoIDw9IHRoaXMubWF4dGFnbGVuZ3RoKSkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcImFwcGVuZFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG5ld05hbWU7XHJcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcmVtb3ZlVGFnV2l0aE5hbWUobmFtZSkge1xyXG4gICAgaWYgKHRoaXMuaXNSZW1vdmFibGUoKSAmJiB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcInJlbW92ZVwiLCBpdGVtOiBuYW1lfSkpIHtcclxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkge1xyXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpO1xyXG4gICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gIFxyXG4gICAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICAgIGlmIChpID49IDApIHtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW107XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgYWRkVGFnV2l0aE5hbWUobmFtZSkge1xyXG4gICAgbGV0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpO1xyXG4gICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgICBcclxuICAgIGlmIChpbmRleCA8IDAgICYmIFxyXG4gICAgICAgIG5hbWUubGVuZ3RoICYmIFxyXG4gICAgICAgIHRoaXMuYWxsb3dlZFRvYWRkSXRlbShuYW1lKSAmJiBcclxuICAgICAgICB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcImFkZFwiLCBpdGVtOiBuYW1lfSkpIHtcclxuICAgICAgdGhpcy5fdGFncy5wdXNoKG5hbWUpO1xyXG4gICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICB9XHJcbiAgb25UYWdSZW1vdmUoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgdGhpcy5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5uYW1lKTtcclxuICB9XHJcblxyXG4gIG9uVGFnQWRkKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLmFkZFRhZ1dpdGhOYW1lKGV2ZW50Lm5hbWUpKSB7XHJcbiAgICAgIGV2ZW50Lm5hbWUgPSBcIlwiO1xyXG4gICAgICBldmVudC5jbGljayhudWxsKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGV2ZW50LnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblRhZ0NoYW5nZShldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNEdXBsaWNhdGUoZXZlbnQubmFtZSkgJiYgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJjaGFuZ2VcIiwgaXRlbTogZXZlbnQub3JpZ2luYWxOYW1lLCB0bzogZXZlbnQubmFtZX0pKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm9yaWdpbmFsTmFtZSk7XHJcbiAgICAgIFxyXG4gICAgICB0aGlzLl90YWdzW2luZGV4XSA9IGV2ZW50Lm5hbWU7XHJcbiAgICAgIGV2ZW50LmluaXQoKTtcclxuICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGV2ZW50LnJlc2V0KCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBvblRhZ0Ryb3AoZXZlbnQpIHtcclxuICAgIGNvbnN0IHNpbmQgPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgY29uc3QgZGluZCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5kZXN0aW5hdGlvbi5uYW1lKTtcclxuXHJcbiAgICBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5hcHBlbmRPbkRyb3ApIHtcclxuICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKHNpbmQpO1xyXG4gICAgICAgICAgdGhpcy5fdGFncy5zcGxpY2Uoc2luZCwxKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LnByZXBlbmRPbkRyb3ApIHtcclxuICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihzaW5kKTtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKHNpbmQsMSk7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LnN3YXBPbkRyb3ApIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJzd2FwXCIsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Nbc2luZF0gPSB0aGlzLl90YWdzLnNwbGljZShkaW5kLCAxLCB0aGlzLl90YWdzW3NpbmRdKVswXTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0aGlzLmFkZFRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKSkge1xyXG4gICAgICAgICAgICB0aGlzLnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LmRlc3RpbmF0aW9uLm5hbWUpO1xyXG4gICAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gXHJcbiAgfVxyXG4gIG9uVGFnU2VsZWN0KGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSB7XHJcbiAgICAgIHRoaXMub25UYWdGb2N1cyhldmVudCk7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcInNlbGVjdFwiLCBpdGVtOiBldmVudC5uYW1lfSkpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgPT09IFNlbGVjdGlvbnBvbGljeS5zaW5nbGVTZWxlY3QpIHtcclxuICAgICAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgICAgIGZvcihsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgICAgIC8vIDMgaXMgdGV4dCBhbmQgOCBpcyBjb21tZW50XHJcbiAgICAgICAgICAgIGlmIChsaXN0W2ldLm5vZGVUeXBlICE9PSAzICYmIGxpc3RbaV0ubm9kZVR5cGUgIT09IDgpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhsaXN0W2ldLCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gIFxyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbaW5kZXhdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gIFxyXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5wdXNoKGluZGV4KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgb25UYWdGb2N1cyhldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkge1xyXG4gICAgICBjb25zdCBsaXN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgIGZvcihsZXQgaT0wOyBpIDwgbGlzdC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgICAgLy8gMyBpcyB0ZXh0IGFuZCA4IGlzIGNvbW1lbnRcclxuICAgICAgICBpZiAobGlzdFtpXS5ub2RlVHlwZSAhPT0gMyAmJiBsaXN0W2ldLm5vZGVUeXBlICE9PSA4KSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhsaXN0W2ldLCBcImZvY3VzZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwiZm9jdXNlZFwiLCB0cnVlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=