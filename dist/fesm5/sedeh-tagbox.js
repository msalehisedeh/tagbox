import { Component, Input, Output, EventEmitter, ElementRef, Renderer, Injectable, HostListener, ViewChild, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InToPipe, IntoPipeModule } from '@sedeh/into-pipes';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@sedeh/drag-enabled';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @enum {number} */
var DragDropPolicy = {
    disabled: 1,
    appendOnDrop: 2,
    prependOnDrop: 3,
    swapOnDrop: 4,
};
DragDropPolicy[DragDropPolicy.disabled] = 'disabled';
DragDropPolicy[DragDropPolicy.appendOnDrop] = 'appendOnDrop';
DragDropPolicy[DragDropPolicy.prependOnDrop] = 'prependOnDrop';
DragDropPolicy[DragDropPolicy.swapOnDrop] = 'swapOnDrop';
/** @enum {number} */
var EditPolicy = {
    viewOnly: 1,
    addOnly: 2,
    removeOnly: 4,
    addAndRemove: 6,
    addRemoveModify: 7,
};
EditPolicy[EditPolicy.viewOnly] = 'viewOnly';
EditPolicy[EditPolicy.addOnly] = 'addOnly';
EditPolicy[EditPolicy.removeOnly] = 'removeOnly';
EditPolicy[EditPolicy.addAndRemove] = 'addAndRemove';
EditPolicy[EditPolicy.addRemoveModify] = 'addRemoveModify';
/** @enum {number} */
var Selectionpolicy = {
    disabled: 1,
    multiSelect: 2,
    singleSelect: 3,
};
Selectionpolicy[Selectionpolicy.disabled] = 'disabled';
Selectionpolicy[Selectionpolicy.multiSelect] = 'multiSelect';
Selectionpolicy[Selectionpolicy.singleSelect] = 'singleSelect';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TagTransfer = /** @class */ (function () {
    function TagTransfer() {
        this.data = {};
    }
    /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    TagTransfer.prototype.setData = /**
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function (name, value) {
        this.data[name] = value;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    TagTransfer.prototype.getData = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        return this.data[name];
    };
    TagTransfer.decorators = [
        { type: Injectable }
    ];
    /** @nocollapse */
    TagTransfer.ctorParameters = function () { return []; };
    return TagTransfer;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TagComponent = /** @class */ (function () {
    function TagComponent(dataTransfer, into, el, renderer) {
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
    TagComponent.prototype.ngOnInit = /**
     * @return {?}
     */
    function () {
        this.init();
        this.el.nativeElement.draggable = (this.dragpolicy !== DragDropPolicy.disabled);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.dragStart = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
        if (this.allowDrag()) {
            event.dataTransfer.setData("source", this.name); // this is needed to get the darg/drop going..
            this.dataTransfer.setData("source", this); // this is needed because event data transfer takes string not bject
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.drag = /**
     * @param {?} event
     * @return {?}
     */
    function (event) { };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.dragEnd = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.stopPropagation();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.drop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        this.ondrop.emit({
            source: this.dataTransfer.getData("source"),
            destination: this
        });
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.dragEnter = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        if (this.allowDrop(event)) {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.dragLeave = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.dragOver = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.allowDrop(event)) {
            event.preventDefault();
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.allowDrop = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        /** @type {?} */
        var source = this.dataTransfer.getData("source");
        /** @type {?} */
        var allow = (source && source.name != this.name) &&
            (this.name && this.name.length > 0) &&
            ((!source.format && !this.format) || source.format == this.format);
        return allow;
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.allowDrag = /**
     * @return {?}
     */
    function () {
        return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.keyup = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        if (event.target === this.el.nativeElement ||
            (this.editor && event.target === this.editor.nativeElement)) {
            /** @type {?} */
            var code = event.which;
            if (code === 13) {
                // cariage return
                this.click(event);
            }
            else if (code === 9 && this.editMode) {
                // tab out
                setTimeout(function () {
                    _this.editMode = false;
                    if (_this.originalName.length && _this.originalName !== _this.name) {
                        _this.onchange.emit(_this);
                    }
                    else {
                        _this.onadd.emit(_this);
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
            var code = event.which;
            if (code === 13) {
                // cariage return
                if (this.isSelectable()) {
                    this.onselect.emit(this);
                }
            }
        }
        else if (this.holder && event.target === this.holder.nativeElement) {
            /** @type {?} */
            var code = event.which;
            if (code === 13) {
                // cariage return
                this.editMode = true;
                setTimeout(function () { return _this.editor.nativeElement.focus(); }, 33);
            }
        }
        else {
            /** @type {?} */
            var code = event.which;
            if (code === 13) {
                // cariage return
                this.remove();
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.click = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        if (this.selector && event.target === this.selector.nativeElement) {
            if (this.isSelectable()) {
                this.onselect.emit(this);
            }
        }
        else if (this.isEditable()) {
            this.editMode = !this.editMode;
            if (this.editMode) {
                setTimeout(function () {
                    if (_this.filler) {
                        _this.selectedFiller = -1;
                        _this.updateFillerList(_this.name);
                    }
                    if (_this.editor) {
                        _this.editor.nativeElement.focus();
                        if (_this.filler) {
                            _this.renderer.setElementClass(_this.filler.nativeElement, "off", false);
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
                    setTimeout(function () { _this.el.nativeElement.focus(); }, 66);
                }
            }
            else {
                this.onadd.emit(this);
            }
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.focus = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        if (this.isSelectable()) {
            this.onfocus.emit(this);
        }
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.isRemovable = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        return canRemove;
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.isEditable = /**
     * @return {?}
     */
    function () {
        return (this.editpolicy === EditPolicy.addRemoveModify);
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.isDraggable = /**
     * @return {?}
     */
    function () {
        return (this.dragpolicy !== DragDropPolicy.disabled);
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.isSelectable = /**
     * @return {?}
     */
    function () {
        return (this.selectionpolicy !== Selectionpolicy.disabled);
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.select = /**
     * @return {?}
     */
    function () {
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.tabout = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        var _this = this;
        setTimeout(function () {
            _this.name = _this.selectedFiller < 0 ? event.target.value : _this.fillerList[_this.selectedFiller];
            _this.editMode = false;
            if (_this.originalName.length && _this.originalName !== _this.name) {
                _this.onchange.emit(_this);
            }
            else {
                _this.onadd.emit(_this);
            }
        }, 66);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    TagComponent.prototype.edit = /**
     * @param {?} event
     * @return {?}
     */
    function (event) {
        this.name = event.target.value;
        this.updateFillerList(this.name);
    };
    /**
     * @param {?} value
     * @return {?}
     */
    TagComponent.prototype.updateFillerList = /**
     * @param {?} value
     * @return {?}
     */
    function (value) {
        if (value && this.autocomplete instanceof Array) {
            if (value) {
                this.fillerList = this.autocomplete.filter(function (item) { return item.indexOf(value) >= 0; });
            }
        }
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.init = /**
     * @return {?}
     */
    function () {
        this.originalName = this.name;
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.reset = /**
     * @return {?}
     */
    function () {
        this.name = this.originalName;
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.remove = /**
     * @return {?}
     */
    function () {
        if (this.isRemovable()) {
            this.onremove.emit(this);
        }
    };
    /**
     * @return {?}
     */
    TagComponent.prototype.formattedName = /**
     * @return {?}
     */
    function () {
        /** @type {?} */
        var result = this.name;
        if (this.format) {
            result = this.into.transform(this.name, this.format);
        }
        return result;
    };
    TagComponent.decorators = [
        { type: Component, args: [{
                    selector: 'tag',
                    template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span #holder\r\n    *ngIf=\"!editMode\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
                    styles: [":host{cursor:pointer;color:#fdfdfd;margin:4px 2px;display:inline-block;background-color:#1f84ab;border:1px solid #015e85;border-radius:8px 20px 20px 8px;box-sizing:border-box;padding:3px 0;position:relative}:host ::ng-deep img{height:25px}:host.left-padded{padding-left:8px}:host.drag-over{background-color:#add8e6!important;cursor:move}:host[placeholder]{background-color:transparent;color:#000;border:0}:host[placeholder]:hover{background-color:#eee!important}:host[placeholder] .editor{color:#000}:host:hover{background-color:#027912!important;border-color:#024b0b!important}:host.focused{background-color:#027912!important;border-color:#024b0b!important}:host.selected:hover{background-color:#d6534e}:host.selected{background-color:#d6534e}:host.selected .selection.fa:before{content:\"\\f00c\"!important}:host .selection{background-color:transparent;float:left;margin-right:3px;padding:5px 3px;width:10px;height:10px;font-size:.8rem}:host .selection.fa:before{content:\"\\f013\"}:host .editor{background-color:transparent;overflow:unset;max-width:inherit;width:inherit;color:#fff;border:none}:host .placeholder{color:#888585;float:right;font-size:1rem;height:20px;line-height:20px;margin-left:5px;text-align:center;width:20px}:host .remove{float:right;font-size:.7rem;height:20px;width:20px;color:#fff;text-align:center;margin-left:5px;line-height:20px;font-weight:bolder}:host .holder{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host .autocomplete{position:absolute;top:26px;z-index:5}:host .autocomplete.off{display:none}:host .autocomplete ul{border:1px solid #024b0b;border-top:0;list-style:none inside;background-color:#027912;margin:0;max-height:150px;overflow-y:auto;padding:0}:host .autocomplete ul li{color:#fdfdfd;padding:5px;white-space:nowrap}:host .autocomplete ul li.selected{background-color:#d6534e}:host .autocomplete ul li:hover{background-color:#0446a8;color:#fff}"]
                }] }
    ];
    /** @nocollapse */
    TagComponent.ctorParameters = function () { return [
        { type: TagTransfer },
        { type: InToPipe },
        { type: ElementRef },
        { type: Renderer }
    ]; };
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
    return TagComponent;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
var TagBoxModule = /** @class */ (function () {
    function TagBoxModule() {
    }
    TagBoxModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        IntoPipeModule,
                        DragDropModule
                    ],
                    declarations: [
                        TagBoxComponent,
                        TagComponent
                    ],
                    exports: [
                        TagBoxComponent
                    ],
                    entryComponents: [],
                    providers: [
                        TagTransfer
                    ],
                    schemas: [CUSTOM_ELEMENTS_SCHEMA]
                },] }
    ];
    return TagBoxModule;
}());

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */

export { TagBoxComponent, DragDropPolicy, EditPolicy, Selectionpolicy, TagBoxModule, TagComponent as ɵa, TagTransfer as ɵb };

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtdGFnYm94LmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly9Ac2VkZWgvdGFnYm94L3NyYy9hcHAvdGFnYm94L2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMudHMiLCJuZzovL0BzZWRlaC90YWdib3gvc3JjL2FwcC90YWdib3gvY29tcG9uZW50cy90YWdib3guY29tcG9uZW50LnRzIiwibmc6Ly9Ac2VkZWgvdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnLnRyYW5zZmVyLnRzIiwibmc6Ly9Ac2VkZWgvdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnLmNvbXBvbmVudC50cyIsIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC90YWdib3gubW9kdWxlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlxyXG5leHBvcnQgZW51bSBEcmFnRHJvcFBvbGljeSB7XHJcbiAgZGlzYWJsZWQgPSAxLFxyXG4gIGFwcGVuZE9uRHJvcCA9IDIsXHJcbiAgcHJlcGVuZE9uRHJvcCA9IDMsXHJcbiAgc3dhcE9uRHJvcCA9IDRcclxufVxyXG5leHBvcnQgZW51bSBFZGl0UG9saWN5IHtcclxuICB2aWV3T25seSA9IDEsXHJcbiAgYWRkT25seSA9IDIsXHJcbiAgcmVtb3ZlT25seSA9IDQsXHJcbiAgYWRkQW5kUmVtb3ZlID0gNixcclxuICBhZGRSZW1vdmVNb2RpZnkgPSA3XHJcbn1cclxuZXhwb3J0IGVudW0gU2VsZWN0aW9ucG9saWN5IHtcclxuICBkaXNhYmxlZCA9IDEsXHJcbiAgbXVsdGlTZWxlY3QgPSAyLFxyXG4gIHNpbmdsZVNlbGVjdCA9IDNcclxufVxyXG4iLCIvKlxyXG4gKiBDb21wYXJpc2lvbiBUb29sIHdpbGwgbGF5b3V0IHR3byBjb21wYXJpc2lvbiB0cmVlcyBzaWRlIGJ5IHNpZGUgYW5kIGZlZWQgdGhlbSBhbiBpbnRlcm5hbCBvYmplY3RcclxuICogaGVpcmFyY2h5IGNyZWF0ZWQgZm9yIGludGVybmFsIHVzZSBmcm9tIEpTT04gb2JqZWN0cyBnaXZlbiB0byB0aGlzIGNvbXBvbmVudC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBFbGVtZW50UmVmLFxyXG4gIFJlbmRlcmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gIERyYWdEcm9wUG9saWN5LFxyXG4gIFNlbGVjdGlvbnBvbGljeSxcclxuICBFZGl0UG9saWN5XHJcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy90YWdib3guaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tICcuL3RhZy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgLy8gY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgc2VsZWN0b3I6ICd0YWdib3gnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWdib3guY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZ2JveC5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBfdGFnczogc3RyaW5nW10gPSBbXTtcclxuICBfc2VsZWN0ZWRpbmRleDogbnVtYmVyW10gPSBbXTtcclxuICBcclxuICBAT3V0cHV0KFwib25jaGFuZ2VcIilcclxuICBvbmNoYW5nZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmVycm9yXCIpXHJcbiAgb25lcnJvcj0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnNlbGVjdFwiKVxyXG4gIG9uc2VsZWN0PSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiYmVmb3JlQWN0aW9uXCIpXHJcbiAgYmVmb3JlQWN0aW9uID0gKGV2ZW50KSA9PiB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJpZFwiKVxyXG4gIGlkOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IHN0cmluZyA9IFwiQWRkIFRhZ1wiO1xyXG4gIFxyXG4gIEBJbnB1dChcIm1heGJveGxlbmd0aFwiKVxyXG4gIG1heGJveGxlbmd0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtYXh0YWdsZW5ndGhcIilcclxuICBtYXh0YWdsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWF4dGFnc1wiKVxyXG4gIG1heHRhZ3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWludGFnc1wiKVxyXG4gIG1pbnRhZ3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwiZm9ybUNvbnRyb2xsZXJcIilcclxuICBmb3JtQ29udHJvbGxlcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIEBJbnB1dChcInRhZ3NcIilcclxuICB0YWdzOiBhbnk7XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGVkaW5kZXhcIilcclxuICBzZWxlY3RlZGluZGV4OiBhbnk7XHJcblxyXG4gIEBJbnB1dChcImRlbGluZWF0ZWJ5XCIpXHJcbiAgZGVsaW5lYXRlYnk6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcImF1dG9jb21wbGV0ZVwiKVxyXG4gIGF1dG9jb21wbGV0ZTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGlvbnBvbGljeVwiKVxyXG4gIHNlbGVjdGlvbnBvbGljeTogU2VsZWN0aW9ucG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJlZGl0cG9saWN5XCIpXHJcbiAgZWRpdHBvbGljeTogRWRpdFBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZHJhZ3BvbGljeVwiKVxyXG4gIGRyYWdwb2xpY3k6IERyYWdEcm9wUG9saWN5O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIsIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcclxuXHQgIFxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZGluZGV4ICYmIFxyXG4gICAgICAgICh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBTdHJpbmcpICYmIFxyXG4gICAgICAgICh0aGlzLnRhZ3MgJiYgISh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBTdHJpbmcpKSkge1xyXG4gICAgICBjb25zdCB4OiBzdHJpbmcgPSBTdHJpbmcodGhpcy5zZWxlY3RlZGluZGV4KTtcclxuICAgICAgY29uc3QgbGlzdCA9IHguc3BsaXQoXCIsXCIpO1xyXG4gICAgICBsaXN0Lm1hcCgodCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXgucHVzaChwYXJzZUludCh0KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IHRoaXMuc2VsZWN0ZWRpbmRleCA/IHRoaXMuc2VsZWN0ZWRpbmRleCA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRhZ3MgJiYgISh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgY29uc3QgeDogc3RyaW5nID0gU3RyaW5nKHRoaXMudGFncyk7XHJcbiAgICAgIHRoaXMuX3RhZ3MgPSB4LnNwbGl0KHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fdGFncyA9IHRoaXMudGFncyA/IHRoaXMudGFncyA6IFtdO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCxcInJvbGVcIixcImxpc3RcIik7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgaXRlbVNlbGVjdGVkQXQoaW5kZXgpIHtcclxuICAgIGNvbnN0IGNhblNlbGVjdCA9IHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQ7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KSA8IDAgPyBmYWxzZSA6IGNhblNlbGVjdDtcclxuICB9XHJcblxyXG4gIGl0ZW1TZWxlY3Rpb25DbGFzcyhpbmRleCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLml0ZW1TZWxlY3RlZEF0KGluZGV4KTtcclxuICAgIHJldHVybiBzZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6ICgoaW5kZXggPCAwIHx8IHRoaXMuc2VsZWN0aW9ucG9saWN5ID09PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpID8gXCJsZWZ0LXBhZGRlZFwiIDogXCJcIik7XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkUmVtb3ZlTW9kaWZ5KTtcclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LnJlbW92ZU9ubHkpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSAmJiAoIXRoaXMubWludGFncyB8fCAodGhpcy5fdGFncy5sZW5ndGggPiB0aGlzLm1pbnRhZ3MpKTtcclxuXHJcbiAgICBpZiAoIWNhblJlbW92ZSkge1xyXG4gICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byByZW1vdmUgdGFnLiBPcGVyYXRpb24gaXMgbm90IGFsbG93ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICBjYW5SZW1vdmU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGlzRHVwbGljYXRlKG5hbWUpIHtcclxuICAgIGNvbnN0IGZsYWcgPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSkgPCAwID8gZmFsc2UgOiB0cnVlO1xyXG4gICAgaWYgKGZsYWcpIHtcclxuICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gcGVyZm9ybSBvcGVyYXRpb24uIFJlc3VsdGluZyBkdXBsaWNhdGUgdGFncyBpcyBub3QgYWxsb3dlZC5cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmxhZztcclxuICB9XHJcblxyXG4gIHByaXZhdGUgYWxsb3dlZFRvYWRkSXRlbShuYW1lKSB7XHJcbiAgICBsZXQgY2FuQWRkID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZFJlbW92ZU1vZGlmeSk7XHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRPbmx5KTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgJiYgKCF0aGlzLm1heHRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoIDwgdGhpcy5tYXh0YWdzKSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICF0aGlzLmlzRHVwbGljYXRlKG5hbWUpO1xyXG5cclxuICAgIGlmIChjYW5BZGQgJiYgdGhpcy5tYXh0YWdsZW5ndGgpIHtcclxuICAgICAgY29uc3QgeCA9IHRoaXMuX3RhZ3Muam9pbiggdGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICAgIGlmICh4Lmxlbmd0aCtuYW1lLmxlbmd0aCsxID49IHRoaXMubWF4Ym94bGVuZ3RoKSB7XHJcbiAgICAgICAgY2FuQWRkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gYWRkIHRhZy4gUmVzdWx0aW5nIGNvbnRlbnQgd2lsbCBleGNlZWQgbWF4dGFnbGVuZ3RoLlwiKTtcclxuICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIHJldHVybiAgY2FuQWRkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub3RpZnlDaGFuZ2UoKSB7XHJcbiAgICB0aGlzLnRhZ3MgPSAodGhpcy50YWdzIGluc3RhbmNlb2YgQXJyYXkpID8gdGhpcy5fdGFncyA6IHRoaXMuX3RhZ3Muam9pbiggdGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5fc2VsZWN0ZWRpbmRleC5sZW5ndGggPyB0aGlzLl9zZWxlY3RlZGluZGV4LmpvaW4oXCIsXCIpIDogXCJcIik7XHJcbiAgICB0aGlzLm9uY2hhbmdlLmVtaXQoe1xyXG4gICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgdGFnczogdGhpcy50YWdzLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIG5vdGlmeVNlbGVjdGlvbigpIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRpbmRleCA9ICEodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgQXJyYXkpID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbnNlbGVjdC5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHNlbGVjZWRJbmRleDogdGhpcy5zZWxlY3RlZGluZGV4LFxyXG4gICAgICBmb3JtQ29udHJvbGxlcjogdGhpcy5mb3JtQ29udHJvbGxlclxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgY3JlYXRlRHJvcFJlcXVlc3QoYWN0aW9uLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXF1ZXN0OiBcImRyb3BcIixcclxuICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgIHNvdXJjZToge1xyXG4gICAgICAgIGlkOiBzb3VyY2UucGFyZW50LmlkLFxyXG4gICAgICAgIG5hbWU6IHNvdXJjZS5uYW1lXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB7XHJcbiAgICAgICAgaWQ6IGRlc3RpbmF0aW9uLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBkZXN0aW5hdGlvbi5uYW1lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBwcmVwZW5kVGFnQXQoaW5kZXgsIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgIGNvbnN0IG5ld05hbWUgPSBzb3VyY2UubmFtZSAgKyBcIiBcIiArIHRoaXMuX3RhZ3NbaW5kZXhdO1xyXG4gICAgaWYgKCF0aGlzLm1heHRhZ2xlbmd0aCB8fCAgKHRoaXMubWF4dGFnbGVuZ3RoICYmIHNvdXJjZS5uYW1lLmxlbmd0aCA8PSB0aGlzLm1heHRhZ2xlbmd0aCkpIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJwcmVwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwcml2YXRlIGFwcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gdGhpcy5fdGFnc1tpbmRleF0gKyBcIiBcIiArIHNvdXJjZS5uYW1lO1xyXG4gICAgaWYgKCF0aGlzLm1heHRhZ2xlbmd0aCB8fCAgKHRoaXMubWF4dGFnbGVuZ3RoICYmIHNvdXJjZS5uYW1lLmxlbmd0aCA8PSB0aGlzLm1heHRhZ2xlbmd0aCkpIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJhcHBlbmRcIiwgc291cmNlLCBkZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBuZXdOYW1lO1xyXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHJlbW92ZVRhZ1dpdGhOYW1lKG5hbWUpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkgJiYgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJyZW1vdmVcIiwgaXRlbTogbmFtZX0pKSB7XHJcbiAgICAgIGlmICh0aGlzLl9zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgQXJyYXkpIHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKTtcclxuICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICB0aGlzLl90YWdzLnNwbGljZShpbmRleCwxKTtcclxuICAgICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFRhZ1dpdGhOYW1lKG5hbWUpIHtcclxuICAgIGxldCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKTtcclxuICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gICAgXHJcbiAgICBpZiAoaW5kZXggPCAwICAmJiBcclxuICAgICAgICBuYW1lLmxlbmd0aCAmJiBcclxuICAgICAgICB0aGlzLmFsbG93ZWRUb2FkZEl0ZW0obmFtZSkgJiYgXHJcbiAgICAgICAgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJhZGRcIiwgaXRlbTogbmFtZX0pKSB7XHJcbiAgICAgIHRoaXMuX3RhZ3MucHVzaChuYW1lKTtcclxuICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uVGFnUmVtb3ZlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQubmFtZSk7XHJcbiAgfVxyXG5cclxuICBvblRhZ0FkZChldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5hZGRUYWdXaXRoTmFtZShldmVudC5uYW1lKSkge1xyXG4gICAgICBldmVudC5uYW1lID0gXCJcIjtcclxuICAgICAgZXZlbnQuY2xpY2sobnVsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudC5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25UYWdDaGFuZ2UoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKCF0aGlzLmlzRHVwbGljYXRlKGV2ZW50Lm5hbWUpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiY2hhbmdlXCIsIGl0ZW06IGV2ZW50Lm9yaWdpbmFsTmFtZSwgdG86IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5vcmlnaW5hbE5hbWUpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBldmVudC5uYW1lO1xyXG4gICAgICBldmVudC5pbml0KCk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudC5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25UYWdEcm9wKGV2ZW50KSB7XHJcbiAgICBjb25zdCBzaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgIGNvbnN0IGRpbmQgPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuYXBwZW5kT25Ecm9wKSB7XHJcbiAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihzaW5kKTtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKHNpbmQsMSk7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5wcmVwZW5kT25Ecm9wKSB7XHJcbiAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5zd2FwT25Ecm9wKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwic3dhcFwiLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgICB0aGlzLl90YWdzW3NpbmRdID0gdGhpcy5fdGFncy5zcGxpY2UoZGluZCwgMSwgdGhpcy5fdGFnc1tzaW5kXSlbMF07XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5hZGRUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5kZXN0aW5hdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IFxyXG4gIH1cclxuICBvblRhZ1NlbGVjdChldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkge1xyXG4gICAgICB0aGlzLm9uVGFnRm9jdXMoZXZlbnQpO1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJzZWxlY3RcIiwgaXRlbTogZXZlbnQubmFtZX0pKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ID09PSBTZWxlY3Rpb25wb2xpY3kuc2luZ2xlU2VsZWN0KSB7XHJcbiAgICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgICAgICBmb3IobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5ub2RlVHlwZSAhPT0gMyAmJiBsaXN0W2ldLm5vZGVUeXBlICE9PSA4KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MobGlzdFtpXSwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW2luZGV4XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICBcclxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gIFxyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXgucHVzaChpbmRleCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uVGFnRm9jdXMoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICBmb3IobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIC8vIDMgaXMgdGV4dCBhbmQgOCBpcyBjb21tZW50XHJcbiAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MobGlzdFtpXSwgXCJmb2N1c2VkXCIsIGZhbHNlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcImZvY3VzZWRcIiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFnVHJhbnNmZXIge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGRhdGE6IGFueSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzZXREYXRhKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSl7XHJcbiAgICAgICAgdGhpcy5kYXRhW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW25hbWVdO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxufSIsIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcixcclxuICBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBJblRvUGlwZSB9IGZyb20gJ0BzZWRlaC9pbnRvLXBpcGVzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi90YWcudHJhbnNmZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd0YWcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZy5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBlZGl0TW9kZTogYm9vbGVhbjtcclxuXHJcbiAgb3JpZ2luYWxOYW1lOiBzdHJpbmc7XHJcbiAgc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICBmaWxsZXJMaXN0OiBzdHJpbmdbXTtcclxuXHJcbiAgQE91dHB1dChcIm9uZm9jdXNcIilcclxuICBvbmZvY3VzPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnJlbW92ZVwiKVxyXG4gIG9ucmVtb3ZlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uYWRkXCIpXHJcbiAgb25hZGQ9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25kcm9wXCIpXHJcbiAgb25kcm9wPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInJlbW92YWJsZVwiKVxyXG4gIHJlbW92YWJsZTogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwibWF4bGVuZ3RoXCIpXHJcbiAgbWF4bGVuZ3RoOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcIm5hbWVcIilcclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IGJvb2xlYW47XHJcblxyXG4gIEBJbnB1dChcInBhcmVudFwiKVxyXG4gIHBhcmVudDogYW55O1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcbiAgQFZpZXdDaGlsZChcImVkaXRvclwiKVxyXG4gIGVkaXRvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcInNlbGVjdG9yXCIpXHJcbiAgc2VsZWN0b3I7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJob2xkZXJcIilcclxuICBob2xkZXI7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJmaWxsZXJcIilcclxuICBmaWxsZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBkYXRhVHJhbnNmZXI6IFRhZ1RyYW5zZmVyLFxyXG4gICAgcHJpdmF0ZSBpbnRvOiBJblRvUGlwZSxcclxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlclxyXG4gICl7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9ICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdzdGFydCcsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdTdGFydChldmVudDogYW55KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZygpKSB7XHJcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzLm5hbWUpOyAvLyB0aGlzIGlzIG5lZWRlZCB0byBnZXQgdGhlIGRhcmcvZHJvcCBnb2luZy4uXHJcbiAgICAgICAgdGhpcy5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNvdXJjZVwiLHRoaXMpOyAvLyB0aGlzIGlzIG5lZWRlZCBiZWNhdXNlIGV2ZW50IGRhdGEgdHJhbnNmZXIgdGFrZXMgc3RyaW5nIG5vdCBiamVjdFxyXG4gICAgICB9XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWcnLCBbJyRldmVudCddKSBcclxuICBkcmFnKGV2ZW50OiBhbnkpIHt9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VuZCcsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdFbmQoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG5cclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxyXG4gIGRyb3AoZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgdGhpcy5vbmRyb3AuZW1pdCh7XHJcbiAgICAgIHNvdXJjZTogdGhpcy5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNvdXJjZVwiKSxcclxuICAgICAgZGVzdGluYXRpb246IHRoaXNcclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdFbnRlcihldmVudDogYW55KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKSBcclxuICBkcmFnTGVhdmUoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnT3ZlcihldmVudDogYW55KSB7XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgYWxsb3dEcm9wKGV2ZW50OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNvdXJjZVwiKTtcclxuICAgICAgY29uc3QgYWxsb3cgPSAoc291cmNlICYmIHNvdXJjZS5uYW1lICE9IHRoaXMubmFtZSkgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoKCFzb3VyY2UuZm9ybWF0ICYmICF0aGlzLmZvcm1hdCkgfHwgc291cmNlLmZvcm1hdCA9PSB0aGlzLmZvcm1hdCk7XHJcbiAgICAgIHJldHVybiBhbGxvdztcclxuICB9XHJcblxyXG4gIGFsbG93RHJhZygpIDogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpICYmIHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgXHJcbiAga2V5dXAoZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50IHx8XHJcbiAgICAgICAodGhpcy5lZGl0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50KSkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMuY2xpY2soZXZlbnQpXHJcbiAgICAgIH1lbHNlIGlmIChjb2RlID09PSA5ICYmIHRoaXMuZWRpdE1vZGUpIHsgLy8gdGFiIG91dFxyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGggJiYgdGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNjYpO1xyXG4gICAgICB9ZWxzZSBpZiAoY29kZSA9PT0gMzgpIHsgLy8gYXJyb3cgdXBcclxuICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlci0tO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlciA9IHRoaXMuZmlsbGVyTGlzdC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgfSAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjb2RlID09PSA0MCkgeyAvLyBhcnJvdyBkb3duXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA8ICh0aGlzLmZpbGxlckxpc3QubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlcisrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gICAgICAgICAgfSAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgICAgIHRoaXMub25zZWxlY3QuZW1pdCh0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlICBpZiAodGhpcy5ob2xkZXIgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLmhvbGRlci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+dGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpLDMzKTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pIFxyXG4gIGNsaWNrKGV2ZW50OiBFdmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRWRpdGFibGUoKSkge1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gIXRoaXMuZWRpdE1vZGU7XHJcbiAgICAgIGlmICh0aGlzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZXJMaXN0KHRoaXMubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodGhpcy5lZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmZpbGxlci5uYXRpdmVFbGVtZW50LCBcIm9mZlwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LDY2KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyID49IDApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuZWwubmF0aXZlRWxlbWVudC5mb2N1cygpIH0sNjYpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyckZXZlbnQnXSkgXHJcbiAgZm9jdXMoZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgdGhpcy5vbmZvY3VzLmVtaXQodGhpcylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUmVtb3ZhYmxlKCkge1xyXG4gICAgbGV0IGNhblJlbW92ZSA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcbiAgICBcclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgaXNFZGl0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gIH1cclxuXHJcbiAgaXNEcmFnZ2FibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIGlzU2VsZWN0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuICBzZWxlY3QoKSB7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIHRhYm91dChldmVudDogYW55KSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5uYW1lID0gdGhpcy5zZWxlY3RlZEZpbGxlciA8IDAgPyBldmVudC50YXJnZXQudmFsdWUgOiB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSwgNjYpXHJcbiAgfVxyXG4gIGVkaXQoZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgdGhpcy51cGRhdGVGaWxsZXJMaXN0KHRoaXMubmFtZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVGaWxsZXJMaXN0KHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgJiYgdGhpcy5hdXRvY29tcGxldGUgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuZmlsbGVyTGlzdCA9IHRoaXMuYXV0b2NvbXBsZXRlLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pbmRleE9mKHZhbHVlKSA+PSAwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMub3JpZ2luYWxOYW1lID0gdGhpcy5uYW1lO1xyXG4gIH1cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMubmFtZSA9IHRoaXMub3JpZ2luYWxOYW1lO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKCkge1xyXG4gICAgaWYgKHRoaXMuaXNSZW1vdmFibGUoKSkge1xyXG4gICAgICB0aGlzLm9ucmVtb3ZlLmVtaXQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmb3JtYXR0ZWROYW1lKCkge1xyXG4gICAgbGV0IHJlc3VsdCA9IHRoaXMubmFtZTtcclxuICAgIGlmICh0aGlzLmZvcm1hdCkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmludG8udHJhbnNmb3JtKHRoaXMubmFtZSwgdGhpcy5mb3JtYXQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG59XHJcbiIsImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEludG9QaXBlTW9kdWxlIH0gZnJvbSAnQHNlZGVoL2ludG8tcGlwZXMnO1xyXG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJ0BzZWRlaC9kcmFnLWVuYWJsZWQnO1xyXG5cclxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWdCb3hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy50cmFuc2Zlcic7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEludG9QaXBlTW9kdWxlLFxyXG4gICAgRHJhZ0Ryb3BNb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgVGFnQm94Q29tcG9uZW50LFxyXG4gICAgVGFnQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBUYWdCb3hDb21wb25lbnRcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBUYWdUcmFuc2ZlclxyXG4gIF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgVGFnQm94TW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVFLFdBQVk7SUFDWixlQUFnQjtJQUNoQixnQkFBaUI7SUFDakIsYUFBYzs7OEJBSGQsUUFBUTs4QkFDUixZQUFZOzhCQUNaLGFBQWE7OEJBQ2IsVUFB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