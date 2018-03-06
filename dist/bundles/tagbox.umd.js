(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('into-pipes'), require('@angular/common')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', 'into-pipes', '@angular/common'], factory) :
	(factory((global.tagbox = {}),global.ng.core,global.intoPipes,global.ng.common));
}(this, (function (exports,core,intoPipes,common) { 'use strict';

var DragDropPolicy = {
    disabled: 1,
    appendOnDrop: 2,
    prependOnDrop: 3,
    swapOnDrop: 4,
};
DragDropPolicy[DragDropPolicy.disabled] = "disabled";
DragDropPolicy[DragDropPolicy.appendOnDrop] = "appendOnDrop";
DragDropPolicy[DragDropPolicy.prependOnDrop] = "prependOnDrop";
DragDropPolicy[DragDropPolicy.swapOnDrop] = "swapOnDrop";
var EditPolicy = {
    viewOnly: 1,
    addOnly: 2,
    removeOnly: 4,
    addAndRemove: 6,
};
EditPolicy[EditPolicy.viewOnly] = "viewOnly";
EditPolicy[EditPolicy.addOnly] = "addOnly";
EditPolicy[EditPolicy.removeOnly] = "removeOnly";
EditPolicy[EditPolicy.addAndRemove] = "addAndRemove";
var Selectionpolicy = {
    disabled: 1,
    multiSelect: 2,
    singleSelect: 3,
};
Selectionpolicy[Selectionpolicy.disabled] = "disabled";
Selectionpolicy[Selectionpolicy.multiSelect] = "multiSelect";
Selectionpolicy[Selectionpolicy.singleSelect] = "singleSelect";
var TagBoxComponent = /** @class */ (function () {
    function TagBoxComponent(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this._tags = [];
        this._selectedindex = [];
        this.onchange = new core.EventEmitter();
        this.onselect = new core.EventEmitter();
        this.beforeAction = function (event) { return true; };
        this.placeholder = "Add Tag";
    }
    TagBoxComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.selectedindex &&
            (this.selectedindex instanceof String) &&
            (this.tags && !(this.tags instanceof String))) {
            var x = String(this.selectedindex);
            var list = x.split(",");
            list.map(function (t) {
                _this._selectedindex.push(parseInt(t));
            });
        }
        else {
            this._selectedindex = this.selectedindex ? this.selectedindex : [];
        }
        if (this.tags && !(this.tags instanceof Array)) {
            var x = String(this.tags);
            this._tags = x.split(this.delineateby ? this.delineateby : ",");
        }
        else {
            this._tags = this.tags;
        }
        this.renderer.setElementAttribute(this.el.nativeElement, "role", "list");
    };
    TagBoxComponent.prototype.ngOnChanges = function (changes) {
    };
    TagBoxComponent.prototype.itemSelectedAt = function (index) {
        var canSelect = this.selectionpolicy !== Selectionpolicy.disabled;
        return this._selectedindex.indexOf(index) < 0 ? false : canSelect;
    };
    TagBoxComponent.prototype.itemSelectionClass = function (index) {
        var selected = this.itemSelectedAt(index);
        return selected ? "selected" : ((index < 0 || this.selectionpolicy === Selectionpolicy.disabled) ? "left-padded" : "");
    };
    TagBoxComponent.prototype.isRemovable = function () {
        var canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        canRemove = canRemove && (!this.mintags || (this._tags.length > this.mintags));
        return canRemove;
    };
    TagBoxComponent.prototype.isDuplicate = function (name) {
        return this._tags.indexOf(name) < 0 ? false : true;
    };
    TagBoxComponent.prototype.allowedToaddItem = function (tag) {
        var canAdd = (this.editpolicy === EditPolicy.addAndRemove);
        canAdd = canAdd || (this.editpolicy === EditPolicy.addOnly);
        canAdd = canAdd && (!this.maxtags || (this._tags.length < this.maxtags - 1));
        canAdd = canAdd && !this.isDuplicate(tag.name);
        if (canAdd && this.maxtaglength) {
            var x = this._tags.join(this.delineateby ? this.delineateby : ",");
            if (x.length + tag.name.length + 1 >= this.maxboxlength) {
                canAdd = false;
                this.renderer.setElementClass(this.el.nativeElement, "alert", true);
            }
            else {
                this.renderer.setElementClass(this.el.nativeElement, "alert", false);
            }
        }
        return canAdd;
    };
    TagBoxComponent.prototype.notifyChange = function () {
        this.tags = (this.tags instanceof Array) ? this._tags : this._tags.join(this.delineateby ? this.delineateby : ",");
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onchange.emit({
            id: this.id,
            tags: this.tags,
            selecedIndex: this.selectedindex
        });
    };
    TagBoxComponent.prototype.notifySelection = function () {
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onselect.emit({
            id: this.id,
            selecedIndex: this.selectedindex
        });
    };
    TagBoxComponent.prototype.onTagRemove = function (event) {
        if (this.isRemovable() && this.beforeAction({ request: "remove", item: event.name })) {
            var index = this._tags.indexOf(event.name);
            var i = this._selectedindex.indexOf(index);
            this._tags.splice(index, 1);
            if (i >= 0) {
                this._selectedindex.splice(i, 1);
                this.notifyChange();
            }
        }
    };
    TagBoxComponent.prototype.onTagAdd = function (event) {
        var index = this._tags.indexOf(event.name);
        var i = this._selectedindex.indexOf(index);
        if (index < 0 &&
            event.name.length &&
            this.allowedToaddItem(event) &&
            this.beforeAction({ request: "add", item: event.name })) {
            this._tags.push(event.name);
            event.name = "";
            this.notifyChange();
            event.click(null);
        }
        else {
            event.reset();
        }
    };
    TagBoxComponent.prototype.onTagChange = function (event) {
        if (!this.isDuplicate(event.name) && this.beforeAction({ request: "change", item: event.originalName, to: event.name })) {
            var index = this._tags.indexOf(event.originalName);
            this._tags[index] = event.name;
            event.init();
            this.notifyChange();
        }
        else {
            event.reset();
        }
    };
    TagBoxComponent.prototype.onTagDrop = function (event) {
        var sind = this._tags.indexOf(event.source);
        var dind = this._tags.indexOf(event.destination);
        if (this.dragpolicy === DragDropPolicy.appendOnDrop) {
            var i = this._selectedindex.indexOf(sind);
            var name = event.destination + " " + event.source;
            if (!this.maxtaglength || (this.maxtaglength && name.length <= this.maxtaglength)) {
                if (this.beforeAction({ request: "drop", action: "append", source: event.source, destination: event.destination })) {
                    this._tags[dind] = name;
                    this._tags.splice(sind, 1);
                    this._selectedindex.splice(i, 1);
                    this.notifyChange();
                }
            }
        }
        else if (this.dragpolicy === DragDropPolicy.prependOnDrop) {
            var i = this._selectedindex.indexOf(sind);
            var name = event.source + " " + event.destination;
            if (!this.maxtaglength || (this.maxtaglength && name.length <= this.maxtaglength)) {
                if (this.beforeAction({ request: "drop", action: "prepend", source: event.source, destination: event.destination })) {
                    this._tags[dind] = name;
                    this._tags.splice(sind, 1);
                    this._selectedindex.splice(i, 1);
                    this.notifyChange();
                }
            }
        }
        if (this.dragpolicy === DragDropPolicy.swapOnDrop) {
            if (this.beforeAction({ request: "drop", action: "swap", source: event.source, destination: event.destination })) {
                this._tags[sind] = this._tags.splice(dind, 1, this._tags[sind])[0];
                this.notifyChange();
            }
        }
    };
    TagBoxComponent.prototype.onTagSelect = function (event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            this.onTagFocus(event);
            if (this.beforeAction({ request: "select", item: event.name })) {
                if (this.selectionpolicy === Selectionpolicy.singleSelect) {
                    var list = this.el.nativeElement.childNodes;
                    for (var i = 0; i < list.length; i++) {
                        if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                            this.renderer.setElementClass(list[i], "selected", false);
                        }
                    }
                    var index = this._tags.indexOf(event.name);
                    if (index >= 0) {
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
                    var index = this._tags.indexOf(event.name);
                    if (index >= 0) {
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
    TagBoxComponent.prototype.onTagFocus = function (event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            var list = this.el.nativeElement.childNodes;
            for (var i = 0; i < list.length; i++) {
                if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                    this.renderer.setElementClass(list[i], "focused", false);
                }
            }
            var index = this._tags.indexOf(event.name);
            if (index >= 0) {
                this.renderer.setElementClass(event.el.nativeElement, "focused", true);
            }
        }
    };
    return TagBoxComponent;
}());
TagBoxComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'tagbox',
                template: "\n<tag theme\n    *ngFor=\"let t of _tags; let i=index\"\n    tabindex=\"0\"\n    [class]=\"itemSelectionClass(i)\"\n    [name]=\"t\"\n    [removable]=\"isRemovable()\"\n    [maxlength]=\"maxtaglength\"\n    [format]=\"format\"\n    [autocomplete]=\"autocomplete\"\n    [attr.role]=\"'listitem'\"\n    [selectionpolicy]=\"selectionpolicy\"\n    [editpolicy]=\"editpolicy\"\n    [dragpolicy]=\"dragpolicy\"\n    (ondrop)=\"onTagDrop($event)\"\n    (onchange)=\"onTagChange($event)\"\n    (onadd)=\"onTagAdd($event)\"\n    (onremove)=\"onTagRemove($event)\"\n    (onselect)=\"onTagSelect($event)\"\n    (onfocus)=\"onTagFocus($event)\">\n</tag><tag theme\n    placeholder\n    tabindex=\"0\"\n    name=\"\"\n    [class]=\"itemSelectionClass(-1)\"\n    [maxlength]=\"maxtaglength\"\n    [placeholder]=\"placeholder\"\n    [format]=\"format\"\n    [autocomplete]=\"autocomplete\"\n    [attr.role]=\"'listitem'\"\n    [selectionpolicy]=\"selectionpolicy\"\n    [editpolicy]=\"editpolicy\"\n    [dragpolicy]=\"dragpolicy\"\n    (ondrop)=\"onTagDrop($event)\"\n    (onchange)=\"onTagChange($event)\"\n    (onadd)=\"onTagAdd($event)\"\n    (onremove)=\"onTagRemove($event)\"\n    (onfocus)=\"onTagFocus($event)\"></tag>\n",
                styles: [":host{\n  background-color:#fff;\n  border:1px inset #888;\n  -webkit-box-sizing:border-box;\n  box-sizing:border-box;\n  display:inline-block;\n  min-height:50px;\n  padding:5px;\n  width:100%;\n  border-radius:5px;\n  margin-bottom:5px; }\n  :host.alert{\n    background-color:#ff9f9b;\n    border-color:#880500; }\n:host:focus{\n  border-color:#0ba; }\n:host:hover{\n  background-color:#ddd; }\n"],
            },] },
];
TagBoxComponent.ctorParameters = function () { return [
    { type: core.Renderer, },
    { type: core.ElementRef, },
]; };
TagBoxComponent.propDecorators = {
    "onchange": [{ type: core.Output, args: ["onchange",] },],
    "onselect": [{ type: core.Output, args: ["onselect",] },],
    "beforeAction": [{ type: core.Input, args: ["beforeAction",] },],
    "id": [{ type: core.Input, args: ["id",] },],
    "placeholder": [{ type: core.Input, args: ["placeholder",] },],
    "maxboxlength": [{ type: core.Input, args: ["maxboxlength",] },],
    "maxtaglength": [{ type: core.Input, args: ["maxtaglength",] },],
    "maxtags": [{ type: core.Input, args: ["maxtags",] },],
    "mintags": [{ type: core.Input, args: ["mintags",] },],
    "tags": [{ type: core.Input, args: ["tags",] },],
    "selectedindex": [{ type: core.Input, args: ["selectedindex",] },],
    "delineateby": [{ type: core.Input, args: ["delineateby",] },],
    "format": [{ type: core.Input, args: ["format",] },],
    "autocomplete": [{ type: core.Input, args: ["autocomplete",] },],
    "selectionpolicy": [{ type: core.Input, args: ["selectionpolicy",] },],
    "editpolicy": [{ type: core.Input, args: ["editpolicy",] },],
    "dragpolicy": [{ type: core.Input, args: ["dragpolicy",] },],
};
var TagComponent = /** @class */ (function () {
    function TagComponent(into, el, renderer) {
        this.into = into;
        this.el = el;
        this.renderer = renderer;
        this.selectedFiller = -1;
        this.onfocus = new core.EventEmitter();
        this.onchange = new core.EventEmitter();
        this.onselect = new core.EventEmitter();
        this.onremove = new core.EventEmitter();
        this.onadd = new core.EventEmitter();
        this.ondrop = new core.EventEmitter();
    }
    TagComponent.prototype.ngOnInit = function () {
        this.init();
        this.el.nativeElement.draggable = (this.dragpolicy !== DragDropPolicy.disabled);
    };
    TagComponent.prototype.dragStart = function (event) {
        event.stopPropagation();
        if (this.allowDrag()) {
            event.dataTransfer.setData("source", this.name);
        }
    };
    TagComponent.prototype.drag = function (event) { };
    TagComponent.prototype.dragEnd = function (event) {
        event.stopPropagation();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    };
    TagComponent.prototype.drop = function (event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        this.ondrop.emit({
            source: event.dataTransfer.getData("source"),
            destination: this.name
        });
    };
    TagComponent.prototype.dragEnter = function (event) {
        event.preventDefault();
        if (this.allowDrop(event)) {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    };
    TagComponent.prototype.dragLeave = function (event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    };
    TagComponent.prototype.dragOver = function (event) {
        if (this.allowDrop(event)) {
            event.preventDefault();
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    };
    TagComponent.prototype.allowDrop = function (event) {
        var source = event.dataTransfer.getData("source");
        return (source && source != this.name) && this.name && this.name.length > 0;
    };
    TagComponent.prototype.allowDrag = function () {
        return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
    };
    TagComponent.prototype.keyup = function (event) {
        var _this = this;
        if (event.target === this.el.nativeElement ||
            (this.editor && event.target === this.editor.nativeElement)) {
            var code = event.which;
            if (code === 13) {
                this.click(event);
            }
            else if (code === 9 && this.editMode) {
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
            var code = event.which;
            if (code === 13) {
                if (this.isSelectable()) {
                    this.onselect.emit(this);
                }
            }
        }
        else {
            var code = event.which;
            if (code === 13) {
                this.remove();
            }
        }
    };
    TagComponent.prototype.click = function (event) {
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
    TagComponent.prototype.focus = function (event) {
        if (this.isSelectable()) {
            this.onfocus.emit(this);
        }
    };
    TagComponent.prototype.isRemovable = function () {
        var canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        return canRemove;
    };
    TagComponent.prototype.isEditable = function () {
        return (this.editpolicy !== EditPolicy.viewOnly);
    };
    TagComponent.prototype.isDraggable = function () {
        return (this.dragpolicy !== DragDropPolicy.disabled);
    };
    TagComponent.prototype.isSelectable = function () {
        return (this.selectionpolicy !== Selectionpolicy.disabled);
    };
    TagComponent.prototype.select = function () {
    };
    TagComponent.prototype.tabout = function (event) {
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
    TagComponent.prototype.edit = function (event) {
        this.name = event.target.value;
        this.updateFillerList(this.name);
    };
    TagComponent.prototype.updateFillerList = function (value) {
        if (value && this.autocomplete instanceof Array) {
            if (value) {
                this.fillerList = this.autocomplete.filter(function (item) { return item.indexOf(value) >= 0; });
            }
        }
    };
    TagComponent.prototype.init = function () {
        this.originalName = this.name;
    };
    TagComponent.prototype.reset = function () {
        this.name = this.originalName;
    };
    TagComponent.prototype.remove = function () {
        if (this.isRemovable()) {
            this.onremove.emit(this);
        }
    };
    TagComponent.prototype.formattedName = function () {
        var result = this.name;
        if (this.format) {
            result = this.into.transform(this.name, this.format);
        }
        return result;
    };
    return TagComponent;
}());
TagComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'tag',
                template: "\n<span #selector\n    *ngIf=\"!editMode && removable && isSelectable()\"\n    tabindex=\"0\"\n    class=\"selection fa\"\n    (click)=\"select()\"></span>\n<input\n    *ngIf=\"editMode\"\n    class=\"editor\"\n    (blur)=\"tabout($event)\"\n    (keyup)=\"edit($event)\"\n    [value]=\"name\"\n    [attr.maxlength]=\"maxlength\"\n    [attr.placeholder]=\"placeholder\" #editor/>\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\n  <ul>\n      <li *ngFor=\"let x of fillerList; let i = index\"\n        (click)=\"selectedFiller = i\"\n        [class.selected]=\"selectedFiller === i\"\n        [textContent]=\"x\"></li>\n  </ul>\n</div>\n<span\n    *ngIf=\"!editMode\"\n    class=\"holder\"\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\n<span\n    *ngIf=\"!editMode && removable\"\n    tabindex=\"0\"\n    class=\"remove fa fa-times\"\n    (click)=\"remove()\"></span>\n<span\n    *ngIf=\"!removable\"\n    class=\"placeholder fa fa-plus-circle\"></span>",
                styles: [":host{\n  cursor:pointer;\n  color:#fdfdfd;\n  margin:4px 2px;\n  display:inline-block;\n  background-color:#1F84AB;\n  border:1px solid #015E85;\n  border-radius:8px 20px 20px 8px;\n  -webkit-box-sizing:border-box;\n          box-sizing:border-box;\n  padding:3px 0;\n  position:relative; }\n  :host ::ng-deep img{\n    width:50px; }\n  :host.left-padded{\n    padding-left:8px; }\n  :host.drag-over:hover{\n    background-color:#add8e6;\n    cursor:move; }\n  :host[placeholder]{\n    background-color:transparent;\n    color:#000;\n    border:0; }\n    :host[placeholder]:hover{\n      background-color:#eee !important; }\n    :host[placeholder] .editor{\n      color:#000; }\n  :host:hover{\n    background-color:#027912 !important;\n    border-color:#024b0b !important; }\n  :host.focused{\n    background-color:#027912 !important;\n    border-color:#024b0b !important; }\n  :host.selected:hover{\n    background-color:#D6534E; }\n  :host.selected{\n    background-color:#D6534E; }\n    :host.selected .selection.fa:before{\n      content:\"\\f00c\" !important; }\n  :host .selection{\n    background-color:transparent;\n    float:left;\n    margin-right:3px;\n    padding:0;\n    width:10px;\n    height:10px;\n    font-size:0.8rem;\n    padding:5px 3px; }\n    :host .selection.fa:before{\n      content:\"\\f013\"; }\n  :host .editor{\n    background-color:transparent;\n    overflow:unset;\n    max-width:inherit;\n    width:inherit;\n    color:#fff;\n    border:none; }\n  :host .placeholder{\n    color:#888585;\n    float:right;\n    font-size:1rem;\n    height:20px;\n    line-height:20px;\n    margin-left:5px;\n    text-align:center;\n    width:20px; }\n  :host .remove{\n    float:right;\n    font-size:0.7rem;\n    height:20px;\n    width:20px;\n    color:#fff;\n    text-align:center;\n    margin-left:5px;\n    line-height:20px;\n    font-weight:bolder; }\n  :host .holder{\n    pointer-events:none;\n    -webkit-user-select:none;\n    -moz-user-select:none;\n    -ms-user-select:none;\n    user-select:none; }\n  :host .autocomplete{\n    position:absolute;\n    top:26px;\n    z-index:5; }\n    :host .autocomplete.off{\n      display:none; }\n    :host .autocomplete ul{\n      border:1px solid #024b0b;\n      border-top:0;\n      list-style:none;\n      background-color:#027912;\n      list-style-position:inside;\n      margin:0;\n      max-height:150px;\n      overflow-y:auto;\n      padding:0; }\n      :host .autocomplete ul li{\n        color:#fdfdfd;\n        padding:5px;\n        white-space:nowrap; }\n        :host .autocomplete ul li.selected{\n          background-color:#D6534E; }\n        :host .autocomplete ul li:hover{\n          background-color:#0446a8;\n          color:#fff; }\n"],
            },] },
];
TagComponent.ctorParameters = function () { return [
    { type: intoPipes.InToPipe, },
    { type: core.ElementRef, },
    { type: core.Renderer, },
]; };
TagComponent.propDecorators = {
    "onfocus": [{ type: core.Output, args: ["onfocus",] },],
    "onchange": [{ type: core.Output, args: ["onchange",] },],
    "onselect": [{ type: core.Output, args: ["onselect",] },],
    "onremove": [{ type: core.Output, args: ["onremove",] },],
    "onadd": [{ type: core.Output, args: ["onadd",] },],
    "ondrop": [{ type: core.Output, args: ["ondrop",] },],
    "format": [{ type: core.Input, args: ["format",] },],
    "removable": [{ type: core.Input, args: ["removable",] },],
    "maxlength": [{ type: core.Input, args: ["maxlength",] },],
    "name": [{ type: core.Input, args: ["name",] },],
    "placeholder": [{ type: core.Input, args: ["placeholder",] },],
    "autocomplete": [{ type: core.Input, args: ["autocomplete",] },],
    "selectionpolicy": [{ type: core.Input, args: ["selectionpolicy",] },],
    "editpolicy": [{ type: core.Input, args: ["editpolicy",] },],
    "dragpolicy": [{ type: core.Input, args: ["dragpolicy",] },],
    "editor": [{ type: core.ViewChild, args: ["editor",] },],
    "selector": [{ type: core.ViewChild, args: ["selector",] },],
    "filler": [{ type: core.ViewChild, args: ["filler",] },],
    "dragStart": [{ type: core.HostListener, args: ['dragstart', ['$event'],] },],
    "drag": [{ type: core.HostListener, args: ['drag', ['$event'],] },],
    "dragEnd": [{ type: core.HostListener, args: ['dragend', ['$event'],] },],
    "drop": [{ type: core.HostListener, args: ['drop', ['$event'],] },],
    "dragEnter": [{ type: core.HostListener, args: ['dragenter', ['$event'],] },],
    "dragLeave": [{ type: core.HostListener, args: ['dragleave', ['$event'],] },],
    "dragOver": [{ type: core.HostListener, args: ['dragover', ['$event'],] },],
    "keyup": [{ type: core.HostListener, args: ['keyup', ['$event'],] },],
    "click": [{ type: core.HostListener, args: ['click', ['$event'],] },],
    "focus": [{ type: core.HostListener, args: ['focus', ['$event'],] },],
};
var TagBoxModule = /** @class */ (function () {
    function TagBoxModule() {
    }
    return TagBoxModule;
}());
TagBoxModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule,
                    intoPipes.IntoPipeModule
                ],
                declarations: [
                    TagBoxComponent,
                    TagComponent
                ],
                exports: [
                    TagBoxComponent
                ],
                entryComponents: [],
                providers: [],
                schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
TagBoxModule.ctorParameters = function () { return []; };

exports.TagBoxComponent = TagBoxComponent;
exports.DragDropPolicy = DragDropPolicy;
exports.EditPolicy = EditPolicy;
exports.Selectionpolicy = Selectionpolicy;
exports.TagBoxModule = TagBoxModule;
exports.ɵa = TagComponent;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tagbox.umd.js.map
