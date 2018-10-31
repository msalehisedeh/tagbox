import { Component, Input, Output, EventEmitter, ElementRef, Renderer, Injectable, HostListener, ViewChild, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InToPipe, IntoPipeModule } from 'into-pipes';
import { CommonModule } from '@angular/common';
import { DragDropModule } from 'drag-enabled';

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
};
EditPolicy[EditPolicy.viewOnly] = 'viewOnly';
EditPolicy[EditPolicy.addOnly] = 'addOnly';
EditPolicy[EditPolicy.removeOnly] = 'removeOnly';
EditPolicy[EditPolicy.addAndRemove] = 'addAndRemove';
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
        return (source && source.name != this.name) && this.name && this.name.length > 0;
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
        return (this.editpolicy !== EditPolicy.viewOnly);
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
                    template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span \r\n    *ngIf=\"!editMode\" \r\n    class=\"holder\" \r\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94LmpzLm1hcCIsInNvdXJjZXMiOlsibmc6Ly90YWdib3gvc3JjL2FwcC90YWdib3gvaW50ZXJmYWNlcy90YWdib3guaW50ZXJmYWNlcy50cyIsIm5nOi8vdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudC50cyIsIm5nOi8vdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnLnRyYW5zZmVyLnRzIiwibmc6Ly90YWdib3gvc3JjL2FwcC90YWdib3gvY29tcG9uZW50cy90YWcuY29tcG9uZW50LnRzIiwibmc6Ly90YWdib3gvc3JjL2FwcC90YWdib3gvdGFnYm94Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGVudW0gRHJhZ0Ryb3BQb2xpY3kge1xyXG4gIGRpc2FibGVkID0gMSxcclxuICBhcHBlbmRPbkRyb3AgPSAyLFxyXG4gIHByZXBlbmRPbkRyb3AgPSAzLFxyXG4gIHN3YXBPbkRyb3AgPSA0XHJcbn1cclxuZXhwb3J0IGVudW0gRWRpdFBvbGljeSB7XHJcbiAgdmlld09ubHkgPSAxLFxyXG4gIGFkZE9ubHkgPSAyLFxyXG4gIHJlbW92ZU9ubHkgPSA0LFxyXG4gIGFkZEFuZFJlbW92ZSA9IDZcclxufVxyXG5leHBvcnQgZW51bSBTZWxlY3Rpb25wb2xpY3kge1xyXG4gIGRpc2FibGVkID0gMSxcclxuICBtdWx0aVNlbGVjdCA9IDIsXHJcbiAgc2luZ2xlU2VsZWN0ID0gM1xyXG59XHJcbiIsIi8qXHJcbiAqIENvbXBhcmlzaW9uIFRvb2wgd2lsbCBsYXlvdXQgdHdvIGNvbXBhcmlzaW9uIHRyZWVzIHNpZGUgYnkgc2lkZSBhbmQgZmVlZCB0aGVtIGFuIGludGVybmFsIG9iamVjdFxyXG4gKiBoZWlyYXJjaHkgY3JlYXRlZCBmb3IgaW50ZXJuYWwgdXNlIGZyb20gSlNPTiBvYmplY3RzIGdpdmVuIHRvIHRoaXMgY29tcG9uZW50LlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vdGFnLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBzZWxlY3RvcjogJ3RhZ2JveCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZ2JveC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnYm94LmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdCb3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIF90YWdzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIF9zZWxlY3RlZGluZGV4OiBudW1iZXJbXSA9IFtdO1xyXG4gIFxyXG4gIEBPdXRwdXQoXCJvbmNoYW5nZVwiKVxyXG4gIG9uY2hhbmdlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uZXJyb3JcIilcclxuICBvbmVycm9yPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uc2VsZWN0XCIpXHJcbiAgb25zZWxlY3Q9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoXCJiZWZvcmVBY3Rpb25cIilcclxuICBiZWZvcmVBY3Rpb24gPSAoZXZlbnQpID0+IHRydWU7XHJcblxyXG4gIEBJbnB1dChcImlkXCIpXHJcbiAgaWQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicGxhY2Vob2xkZXJcIilcclxuICBwbGFjZWhvbGRlcjogc3RyaW5nID0gXCJBZGQgVGFnXCI7XHJcbiAgXHJcbiAgQElucHV0KFwibWF4Ym94bGVuZ3RoXCIpXHJcbiAgbWF4Ym94bGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1heHRhZ2xlbmd0aFwiKVxyXG4gIG1heHRhZ2xlbmd0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtYXh0YWdzXCIpXHJcbiAgbWF4dGFnczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtaW50YWdzXCIpXHJcbiAgbWludGFnczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJmb3JtQ29udHJvbGxlclwiKVxyXG4gIGZvcm1Db250cm9sbGVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgQElucHV0KFwidGFnc1wiKVxyXG4gIHRhZ3M6IGFueTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0ZWRpbmRleFwiKVxyXG4gIHNlbGVjdGVkaW5kZXg6IGFueTtcclxuXHJcbiAgQElucHV0KFwiZGVsaW5lYXRlYnlcIilcclxuICBkZWxpbmVhdGVieTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJmb3JtYXRcIilcclxuICBmb3JtYXQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwiYXV0b2NvbXBsZXRlXCIpXHJcbiAgYXV0b2NvbXBsZXRlOiBzdHJpbmdbXTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0aW9ucG9saWN5XCIpXHJcbiAgc2VsZWN0aW9ucG9saWN5OiBTZWxlY3Rpb25wb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImVkaXRwb2xpY3lcIilcclxuICBlZGl0cG9saWN5OiBFZGl0UG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJkcmFncG9saWN5XCIpXHJcbiAgZHJhZ3BvbGljeTogRHJhZ0Ryb3BQb2xpY3k7XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xyXG5cdCAgXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkaW5kZXggJiYgXHJcbiAgICAgICAgKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIFN0cmluZykgJiYgXHJcbiAgICAgICAgKHRoaXMudGFncyAmJiAhKHRoaXMudGFncyBpbnN0YW5jZW9mIFN0cmluZykpKSB7XHJcbiAgICAgIGNvbnN0IHg6IHN0cmluZyA9IFN0cmluZyh0aGlzLnNlbGVjdGVkaW5kZXgpO1xyXG4gICAgICBjb25zdCBsaXN0ID0geC5zcGxpdChcIixcIik7XHJcbiAgICAgIGxpc3QubWFwKCh0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5wdXNoKHBhcnNlSW50KHQpKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gdGhpcy5zZWxlY3RlZGluZGV4ID8gdGhpcy5zZWxlY3RlZGluZGV4IDogW107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudGFncyAmJiAhKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICBjb25zdCB4OiBzdHJpbmcgPSBTdHJpbmcodGhpcy50YWdzKTtcclxuICAgICAgdGhpcy5fdGFncyA9IHguc3BsaXQodGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl90YWdzID0gdGhpcy50YWdzID8gdGhpcy50YWdzIDogW107XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LFwicm9sZVwiLFwibGlzdFwiKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpdGVtU2VsZWN0ZWRBdChpbmRleCkge1xyXG4gICAgY29uc3QgY2FuU2VsZWN0ID0gdGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZDtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpIDwgMCA/IGZhbHNlIDogY2FuU2VsZWN0O1xyXG4gIH1cclxuXHJcbiAgaXRlbVNlbGVjdGlvbkNsYXNzKGluZGV4KSB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuaXRlbVNlbGVjdGVkQXQoaW5kZXgpO1xyXG4gICAgcmV0dXJuIHNlbGVjdGVkID8gXCJzZWxlY3RlZFwiIDogKChpbmRleCA8IDAgfHwgdGhpcy5zZWxlY3Rpb25wb2xpY3kgPT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkgPyBcImxlZnQtcGFkZGVkXCIgOiBcIlwiKTtcclxuICB9XHJcblxyXG4gIGlzUmVtb3ZhYmxlKCkge1xyXG4gICAgbGV0IGNhblJlbW92ZSA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5yZW1vdmVPbmx5KTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgJiYgKCF0aGlzLm1pbnRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoID4gdGhpcy5taW50YWdzKSk7XHJcblxyXG4gICAgaWYgKCFjYW5SZW1vdmUpIHtcclxuICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gcmVtb3ZlIHRhZy4gT3BlcmF0aW9uIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0R1cGxpY2F0ZShuYW1lKSB7XHJcbiAgICBjb25zdCBmbGFnID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpIDwgMCA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIGlmIChmbGFnKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLiBSZXN1bHRpbmcgZHVwbGljYXRlIHRhZ3MgaXMgbm90IGFsbG93ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZsYWc7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFsbG93ZWRUb2FkZEl0ZW0obmFtZSkge1xyXG4gICAgbGV0IGNhbkFkZCA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRPbmx5KTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgJiYgKCF0aGlzLm1heHRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoIDwgdGhpcy5tYXh0YWdzKSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICF0aGlzLmlzRHVwbGljYXRlKG5hbWUpO1xyXG5cclxuICAgIGlmIChjYW5BZGQgJiYgdGhpcy5tYXh0YWdsZW5ndGgpIHtcclxuICAgICAgY29uc3QgeCA9IHRoaXMuX3RhZ3Muam9pbiggdGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICAgIGlmICh4Lmxlbmd0aCtuYW1lLmxlbmd0aCsxID49IHRoaXMubWF4Ym94bGVuZ3RoKSB7XHJcbiAgICAgICAgY2FuQWRkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gYWRkIHRhZy4gUmVzdWx0aW5nIGNvbnRlbnQgd2lsbCBleGNlZWQgbWF4dGFnbGVuZ3RoLlwiKTtcclxuICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIHJldHVybiAgY2FuQWRkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub3RpZnlDaGFuZ2UoKSB7XHJcbiAgICB0aGlzLnRhZ3MgPSAodGhpcy50YWdzIGluc3RhbmNlb2YgQXJyYXkpID8gdGhpcy5fdGFncyA6IHRoaXMuX3RhZ3Muam9pbiggdGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5fc2VsZWN0ZWRpbmRleC5sZW5ndGggPyB0aGlzLl9zZWxlY3RlZGluZGV4LmpvaW4oXCIsXCIpIDogXCJcIik7XHJcbiAgICB0aGlzLm9uY2hhbmdlLmVtaXQoe1xyXG4gICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgdGFnczogdGhpcy50YWdzLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIG5vdGlmeVNlbGVjdGlvbigpIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRpbmRleCA9ICEodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgQXJyYXkpID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbnNlbGVjdC5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHNlbGVjZWRJbmRleDogdGhpcy5zZWxlY3RlZGluZGV4LFxyXG4gICAgICBmb3JtQ29udHJvbGxlcjogdGhpcy5mb3JtQ29udHJvbGxlclxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgY3JlYXRlRHJvcFJlcXVlc3QoYWN0aW9uLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXF1ZXN0OiBcImRyb3BcIixcclxuICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgIHNvdXJjZToge1xyXG4gICAgICAgIGlkOiBzb3VyY2UucGFyZW50LmlkLFxyXG4gICAgICAgIG5hbWU6IHNvdXJjZS5uYW1lXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB7XHJcbiAgICAgICAgaWQ6IGRlc3RpbmF0aW9uLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBkZXN0aW5hdGlvbi5uYW1lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBwcmVwZW5kVGFnQXQoaW5kZXgsIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgIGNvbnN0IG5ld05hbWUgPSBzb3VyY2UubmFtZSAgKyBcIiBcIiArIHRoaXMuX3RhZ3NbaW5kZXhdO1xyXG4gICAgaWYgKCF0aGlzLm1heHRhZ2xlbmd0aCB8fCAgKHRoaXMubWF4dGFnbGVuZ3RoICYmIHNvdXJjZS5uYW1lLmxlbmd0aCA8PSB0aGlzLm1heHRhZ2xlbmd0aCkpIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJwcmVwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwcml2YXRlIGFwcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gdGhpcy5fdGFnc1tpbmRleF0gKyBcIiBcIiArIHNvdXJjZS5uYW1lO1xyXG4gICAgaWYgKCF0aGlzLm1heHRhZ2xlbmd0aCB8fCAgKHRoaXMubWF4dGFnbGVuZ3RoICYmIHNvdXJjZS5uYW1lLmxlbmd0aCA8PSB0aGlzLm1heHRhZ2xlbmd0aCkpIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJhcHBlbmRcIiwgc291cmNlLCBkZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBuZXdOYW1lO1xyXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHJlbW92ZVRhZ1dpdGhOYW1lKG5hbWUpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkgJiYgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJyZW1vdmVcIiwgaXRlbTogbmFtZX0pKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpO1xyXG4gICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuXHJcbiAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFRhZ1dpdGhOYW1lKG5hbWUpIHtcclxuICAgIGxldCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKTtcclxuICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gICAgXHJcbiAgICBpZiAoaW5kZXggPCAwICAmJiBcclxuICAgICAgICBuYW1lLmxlbmd0aCAmJiBcclxuICAgICAgICB0aGlzLmFsbG93ZWRUb2FkZEl0ZW0obmFtZSkgJiYgXHJcbiAgICAgICAgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJhZGRcIiwgaXRlbTogbmFtZX0pKSB7XHJcbiAgICAgIHRoaXMuX3RhZ3MucHVzaChuYW1lKTtcclxuICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uVGFnUmVtb3ZlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQubmFtZSk7XHJcbiAgfVxyXG5cclxuICBvblRhZ0FkZChldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5hZGRUYWdXaXRoTmFtZShldmVudC5uYW1lKSkge1xyXG4gICAgICBldmVudC5uYW1lID0gXCJcIjtcclxuICAgICAgZXZlbnQuY2xpY2sobnVsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudC5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25UYWdDaGFuZ2UoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKCF0aGlzLmlzRHVwbGljYXRlKGV2ZW50Lm5hbWUpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiY2hhbmdlXCIsIGl0ZW06IGV2ZW50Lm9yaWdpbmFsTmFtZSwgdG86IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5vcmlnaW5hbE5hbWUpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBldmVudC5uYW1lO1xyXG4gICAgICBldmVudC5pbml0KCk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudC5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25UYWdEcm9wKGV2ZW50KSB7XHJcbiAgICBjb25zdCBzaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgIGNvbnN0IGRpbmQgPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuYXBwZW5kT25Ecm9wKSB7XHJcbiAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihzaW5kKTtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKHNpbmQsMSk7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5wcmVwZW5kT25Ecm9wKSB7XHJcbiAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5zd2FwT25Ecm9wKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwic3dhcFwiLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgICB0aGlzLl90YWdzW3NpbmRdID0gdGhpcy5fdGFncy5zcGxpY2UoZGluZCwgMSwgdGhpcy5fdGFnc1tzaW5kXSlbMF07XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5hZGRUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5kZXN0aW5hdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IFxyXG4gIH1cclxuICBvblRhZ1NlbGVjdChldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkge1xyXG4gICAgICB0aGlzLm9uVGFnRm9jdXMoZXZlbnQpO1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJzZWxlY3RcIiwgaXRlbTogZXZlbnQubmFtZX0pKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ID09PSBTZWxlY3Rpb25wb2xpY3kuc2luZ2xlU2VsZWN0KSB7XHJcbiAgICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgICAgICBmb3IobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5ub2RlVHlwZSAhPT0gMyAmJiBsaXN0W2ldLm5vZGVUeXBlICE9PSA4KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MobGlzdFtpXSwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW2luZGV4XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICBcclxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gIFxyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXgucHVzaChpbmRleCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uVGFnRm9jdXMoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICBmb3IobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIC8vIDMgaXMgdGV4dCBhbmQgOCBpcyBjb21tZW50XHJcbiAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MobGlzdFtpXSwgXCJmb2N1c2VkXCIsIGZhbHNlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcImZvY3VzZWRcIiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0ICB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFnVHJhbnNmZXIge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGRhdGE6IGFueSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzZXREYXRhKG5hbWUsIHZhbHVlKXtcclxuICAgICAgICB0aGlzLmRhdGFbbmFtZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW25hbWVdO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxufSIsIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcixcclxuICBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBJblRvUGlwZSB9IGZyb20gJ2ludG8tcGlwZXMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnVHJhbnNmZXIgfSBmcm9tICcuL3RhZy50cmFuc2Zlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3RhZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGVkaXRNb2RlOiBib29sZWFuO1xyXG5cclxuICBvcmlnaW5hbE5hbWU6IHN0cmluZztcclxuICBzZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gIGZpbGxlckxpc3Q6IHN0cmluZ1tdO1xyXG5cclxuICBAT3V0cHV0KFwib25mb2N1c1wiKVxyXG4gIG9uZm9jdXM9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25jaGFuZ2VcIilcclxuICBvbmNoYW5nZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnNlbGVjdFwiKVxyXG4gIG9uc2VsZWN0PSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9ucmVtb3ZlXCIpXHJcbiAgb25yZW1vdmU9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25hZGRcIilcclxuICBvbmFkZD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmRyb3BcIilcclxuICBvbmRyb3A9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoXCJmb3JtYXRcIilcclxuICBmb3JtYXQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicmVtb3ZhYmxlXCIpXHJcbiAgcmVtb3ZhYmxlOiBib29sZWFuO1xyXG5cclxuICBASW5wdXQoXCJtYXhsZW5ndGhcIilcclxuICBtYXhsZW5ndGg6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwibmFtZVwiKVxyXG4gIG5hbWU6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicGxhY2Vob2xkZXJcIilcclxuICBwbGFjZWhvbGRlcjogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwicGFyZW50XCIpXHJcbiAgcGFyZW50OiBhbnk7XHJcblxyXG4gIEBJbnB1dChcImF1dG9jb21wbGV0ZVwiKVxyXG4gIGF1dG9jb21wbGV0ZTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGlvbnBvbGljeVwiKVxyXG4gIHNlbGVjdGlvbnBvbGljeTogU2VsZWN0aW9ucG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJlZGl0cG9saWN5XCIpXHJcbiAgZWRpdHBvbGljeTogRWRpdFBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZHJhZ3BvbGljeVwiKVxyXG4gIGRyYWdwb2xpY3k6IERyYWdEcm9wUG9saWN5O1xyXG5cclxuICBAVmlld0NoaWxkKFwiZWRpdG9yXCIpXHJcbiAgZWRpdG9yO1xyXG5cclxuICBAVmlld0NoaWxkKFwic2VsZWN0b3JcIilcclxuICBzZWxlY3RvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcImZpbGxlclwiKVxyXG4gIGZpbGxlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGRhdGFUcmFuc2ZlcjogVGFnVHJhbnNmZXIsXHJcbiAgICBwcml2YXRlIGludG86IEluVG9QaXBlLFxyXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLCBcclxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXHJcbiAgKXtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ1N0YXJ0KGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZygpKSB7XHJcbiAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzLm5hbWUpOyAvLyB0aGlzIGlzIG5lZWRlZCB0byBnZXQgdGhlIGRhcmcvZHJvcCBnb2luZy4uXHJcbiAgICAgICAgdGhpcy5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNvdXJjZVwiLHRoaXMpOyAvLyB0aGlzIGlzIG5lZWRlZCBiZWNhdXNlIGV2ZW50IGRhdGEgdHJhbnNmZXIgdGFrZXMgc3RyaW5nIG5vdCBiamVjdFxyXG4gICAgICB9XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWcnLCBbJyRldmVudCddKSBcclxuICBkcmFnKGV2ZW50KSB7fVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbmQnLCBbJyRldmVudCddKSBcclxuICBkcmFnRW5kKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcblxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXHJcbiAgZHJvcChldmVudCkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgdGhpcy5vbmRyb3AuZW1pdCh7XHJcbiAgICAgIHNvdXJjZTogdGhpcy5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNvdXJjZVwiKSxcclxuICAgICAgZGVzdGluYXRpb246IHRoaXNcclxuICAgIH0pXHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdFbnRlcihldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0xlYXZlKGV2ZW50KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdPdmVyKGV2ZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgYWxsb3dEcm9wKGV2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIik7XHJcblxyXG4gICAgICByZXR1cm4gKHNvdXJjZSAmJiBzb3VyY2UubmFtZSAhPSB0aGlzLm5hbWUpICYmIHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIGFsbG93RHJhZygpIDogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpICYmIHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgXHJcbiAga2V5dXAoZXZlbnQpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCB8fFxyXG4gICAgICAgKHRoaXMuZWRpdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudCkpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLmNsaWNrKGV2ZW50KVxyXG4gICAgICB9ZWxzZSBpZiAoY29kZSA9PT0gOSAmJiB0aGlzLmVkaXRNb2RlKSB7IC8vIHRhYiBvdXRcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUubGVuZ3RoICYmIHRoaXMub3JpZ2luYWxOYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDY2KTtcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDM4KSB7IC8vIGFycm93IHVwXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXItLTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSB0aGlzLmZpbGxlckxpc3QubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDApIHsgLy8gYXJyb3cgZG93blxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAodGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIrKztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgIH0gICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKSBcclxuICBjbGljayhldmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRWRpdGFibGUoKSkge1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gIXRoaXMuZWRpdE1vZGU7XHJcbiAgICAgIGlmICh0aGlzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZXJMaXN0KHRoaXMubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodGhpcy5lZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmZpbGxlci5uYXRpdmVFbGVtZW50LCBcIm9mZlwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LDY2KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyID49IDApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuZWwubmF0aXZlRWxlbWVudC5mb2N1cygpIH0sNjYpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyckZXZlbnQnXSkgXHJcbiAgZm9jdXMoZXZlbnQpIHtcclxuICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25mb2N1cy5lbWl0KHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcbiAgICBcclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgaXNFZGl0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZWRpdHBvbGljeSAhPT0gRWRpdFBvbGljeS52aWV3T25seSk7XHJcbiAgfVxyXG5cclxuICBpc0RyYWdnYWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgaXNTZWxlY3RhYmxlKCkge1xyXG4gICAgcmV0dXJuICAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCk7XHJcbiAgfVxyXG4gIHNlbGVjdCgpIHtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgdGFib3V0KGV2ZW50KSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5uYW1lID0gdGhpcy5zZWxlY3RlZEZpbGxlciA8IDAgPyBldmVudC50YXJnZXQudmFsdWUgOiB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSwgNjYpXHJcbiAgfVxyXG4gIGVkaXQoZXZlbnQpIHtcclxuICAgIHRoaXMubmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRmlsbGVyTGlzdCh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlICYmIHRoaXMuYXV0b2NvbXBsZXRlIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZpbGxlckxpc3QgPSB0aGlzLmF1dG9jb21wbGV0ZS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uaW5kZXhPZih2YWx1ZSkgPj0gMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsTmFtZSA9IHRoaXMubmFtZTtcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9yaWdpbmFsTmFtZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkpIHtcclxuICAgICAgdGhpcy5vbnJlbW92ZS5lbWl0KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9ybWF0dGVkTmFtZSgpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzLm5hbWU7XHJcbiAgICBpZiAodGhpcy5mb3JtYXQpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5pbnRvLnRyYW5zZm9ybSh0aGlzLm5hbWUsIHRoaXMuZm9ybWF0KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbnRvUGlwZU1vZHVsZSB9IGZyb20gJ2ludG8tcGlwZXMnO1xyXG5pbXBvcnQgeyBEcmFnRHJvcE1vZHVsZSB9IGZyb20gJ2RyYWctZW5hYmxlZCc7XHJcblxyXG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ0JveENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWdib3guY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFnVHJhbnNmZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLnRyYW5zZmVyJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgSW50b1BpcGVNb2R1bGUsXHJcblx0RHJhZ0Ryb3BNb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgVGFnQm94Q29tcG9uZW50LFxyXG4gICAgVGFnQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBUYWdCb3hDb21wb25lbnRcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBUYWdUcmFuc2ZlclxyXG4gIF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgVGFnQm94TW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztJQUVFLFdBQVk7SUFDWixlQUFnQjtJQUNoQixnQkFBaUI7SUFDakIsYUFBYzs7OEJBSGQsUUFBUTs4QkFDUixZQUFZOzhCQUNaLGFBQWE7OEJBQ2IsVUFBVTs7O0lBR1YsV0FBWTtJQUNaLFVBQVc7SUFDWCxhQUFjO0lBQ2QsZUFBZ0I7O3NCQUhoQixRQUFRO3NCQUNSLE9BQU87c0JBQ1AsVUFBVTtzQkFDVixZQUFZOzs7SUFHWixXQUFZO0lBQ1osY0FBZTtJQUNm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