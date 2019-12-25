import { __decorate } from 'tslib';
import { EventEmitter, Renderer, ElementRef, Output, Input, Component, Injectable, ViewChild, HostListener, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStorageModule } from '@sedeh/wizard-storage';
import { IntoPipeModule } from '@sedeh/into-pipes';

var DragDropPolicy;
(function (DragDropPolicy) {
    DragDropPolicy[DragDropPolicy["disabled"] = 1] = "disabled";
    DragDropPolicy[DragDropPolicy["appendOnDrop"] = 2] = "appendOnDrop";
    DragDropPolicy[DragDropPolicy["prependOnDrop"] = 3] = "prependOnDrop";
    DragDropPolicy[DragDropPolicy["swapOnDrop"] = 4] = "swapOnDrop";
})(DragDropPolicy || (DragDropPolicy = {}));
var EditPolicy;
(function (EditPolicy) {
    EditPolicy[EditPolicy["viewOnly"] = 1] = "viewOnly";
    EditPolicy[EditPolicy["addOnly"] = 2] = "addOnly";
    EditPolicy[EditPolicy["removeOnly"] = 4] = "removeOnly";
    EditPolicy[EditPolicy["addAndRemove"] = 6] = "addAndRemove";
    EditPolicy[EditPolicy["addRemoveModify"] = 7] = "addRemoveModify";
})(EditPolicy || (EditPolicy = {}));
var Selectionpolicy;
(function (Selectionpolicy) {
    Selectionpolicy[Selectionpolicy["disabled"] = 1] = "disabled";
    Selectionpolicy[Selectionpolicy["multiSelect"] = 2] = "multiSelect";
    Selectionpolicy[Selectionpolicy["singleSelect"] = 3] = "singleSelect";
})(Selectionpolicy || (Selectionpolicy = {}));

var TagBoxComponent = /** @class */ (function () {
    function TagBoxComponent(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this._tags = [];
        this._selectedindex = [];
        this.onchange = new EventEmitter();
        this.onerror = new EventEmitter();
        this.onselect = new EventEmitter();
        this.onaction = new EventEmitter();
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
            this._tags = this.tags ? this.tags : [];
        }
        this.renderer.setElementAttribute(this.el.nativeElement, "role", "list");
    };
    TagBoxComponent.prototype.ngOnChanges = function (changes) {
        if (changes.tags) {
            if (this.tags && (this.tags instanceof Array)) {
                this._tags = this.tags;
            }
        }
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
        canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        canRemove = canRemove && (!this.mintags || (this._tags.length > this.mintags));
        if (!canRemove) {
            this.onerror.emit("Unable to remove tag. Operation is not allowed.");
        }
        return canRemove;
    };
    TagBoxComponent.prototype.isDuplicate = function (name) {
        var flag = this._tags.indexOf(name) < 0 ? false : true;
        if (flag) {
            this.onerror.emit("Unable to perform operation. Resulting duplicate tags is not allowed.");
        }
        return flag;
    };
    TagBoxComponent.prototype.allowedToaddItem = function (name) {
        var canAdd = (this.editpolicy === EditPolicy.addAndRemove);
        canAdd = canAdd || (this.editpolicy === EditPolicy.addRemoveModify);
        canAdd = canAdd || (this.editpolicy === EditPolicy.addOnly);
        canAdd = canAdd && (!this.maxtags || (this._tags.length < this.maxtags));
        canAdd = canAdd && !this.isDuplicate(name);
        if (canAdd && this.maxtaglength) {
            var x = this._tags.join(this.delineateby ? this.delineateby : ",");
            if (x.length + name.length + 1 >= this.maxboxlength) {
                canAdd = false;
                this.onerror.emit("Unable to add tag. Resulting content will exceed maxtaglength.");
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
            selecedIndex: this.selectedindex,
            formController: this.formController
        });
    };
    TagBoxComponent.prototype.notifySelection = function () {
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onselect.emit({
            id: this.id,
            selecedIndex: this.selectedindex,
            formController: this.formController
        });
    };
    TagBoxComponent.prototype.createDropRequest = function (action, source, destination) {
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
    TagBoxComponent.prototype.prependTagAt = function (index, source, destination) {
        var result = false;
        var newName = source.name + " " + this._tags[index];
        if (!this.maxtaglength || (this.maxtaglength && source.name.length <= this.maxtaglength)) {
            if (this.beforeAction(this.createDropRequest("prepend", source, destination))) {
                this._tags[index] = newName;
                result = true;
            }
        }
        return result;
    };
    TagBoxComponent.prototype.appendTagAt = function (index, source, destination) {
        var result = false;
        var newName = this._tags[index] + " " + source.name;
        if (!this.maxtaglength || (this.maxtaglength && source.name.length <= this.maxtaglength)) {
            if (this.beforeAction(this.createDropRequest("append", source, destination))) {
                this._tags[index] = newName;
                result = true;
            }
        }
        return result;
    };
    TagBoxComponent.prototype.removeTagWithName = function (name) {
        if (this.isRemovable() && this.beforeAction({ request: "remove", item: name })) {
            if (this._selectedindex instanceof Array) {
                var index = this._tags.indexOf(name);
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
    TagBoxComponent.prototype.addTagWithName = function (name) {
        var index = this._tags.indexOf(name);
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
    TagBoxComponent.prototype.onTagRemove = function (event) {
        this.removeTagWithName(event.name);
    };
    TagBoxComponent.prototype.onTagAdd = function (event) {
        if (this.addTagWithName(event.name)) {
            event.name = "";
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
        var sind = this._tags.indexOf(event.source.name);
        var dind = this._tags.indexOf(event.destination.name);
        if (this.dragpolicy === DragDropPolicy.appendOnDrop) {
            if (event.source.parent.id === event.destination.parent.id) {
                if (this.appendTagAt(dind, event.source, event.destination)) {
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
    TagBoxComponent.prototype.onTagAction = function (event) {
        this.onaction.emit(event);
    };
    TagBoxComponent.prototype.onTagSelect = function (event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            this.onTagFocus(event);
            if (this.beforeAction({ request: "select", item: event.name })) {
                if (this.selectionpolicy === Selectionpolicy.singleSelect) {
                    var list = this.el.nativeElement.childNodes;
                    for (var i = 0; i < list.length; i++) {
                        // 3 is text and 8 is comment
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
                // 3 is text and 8 is comment
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
    TagBoxComponent.ctorParameters = function () { return [
        { type: Renderer },
        { type: ElementRef }
    ]; };
    __decorate([
        Output("onchange")
    ], TagBoxComponent.prototype, "onchange", void 0);
    __decorate([
        Output("onerror")
    ], TagBoxComponent.prototype, "onerror", void 0);
    __decorate([
        Output("onselect")
    ], TagBoxComponent.prototype, "onselect", void 0);
    __decorate([
        Output("onaction")
    ], TagBoxComponent.prototype, "onaction", void 0);
    __decorate([
        Input("beforeAction")
    ], TagBoxComponent.prototype, "beforeAction", void 0);
    __decorate([
        Input("boxTitle")
    ], TagBoxComponent.prototype, "boxTitle", void 0);
    __decorate([
        Input("id")
    ], TagBoxComponent.prototype, "id", void 0);
    __decorate([
        Input("placeholder")
    ], TagBoxComponent.prototype, "placeholder", void 0);
    __decorate([
        Input("maxboxlength")
    ], TagBoxComponent.prototype, "maxboxlength", void 0);
    __decorate([
        Input("maxtaglength")
    ], TagBoxComponent.prototype, "maxtaglength", void 0);
    __decorate([
        Input("maxtags")
    ], TagBoxComponent.prototype, "maxtags", void 0);
    __decorate([
        Input("mintags")
    ], TagBoxComponent.prototype, "mintags", void 0);
    __decorate([
        Input("formController")
    ], TagBoxComponent.prototype, "formController", void 0);
    __decorate([
        Input("tags")
    ], TagBoxComponent.prototype, "tags", void 0);
    __decorate([
        Input("selectedindex")
    ], TagBoxComponent.prototype, "selectedindex", void 0);
    __decorate([
        Input("delineateby")
    ], TagBoxComponent.prototype, "delineateby", void 0);
    __decorate([
        Input("format")
    ], TagBoxComponent.prototype, "format", void 0);
    __decorate([
        Input("autocomplete")
    ], TagBoxComponent.prototype, "autocomplete", void 0);
    __decorate([
        Input("selectionpolicy")
    ], TagBoxComponent.prototype, "selectionpolicy", void 0);
    __decorate([
        Input("editpolicy")
    ], TagBoxComponent.prototype, "editpolicy", void 0);
    __decorate([
        Input("dragpolicy")
    ], TagBoxComponent.prototype, "dragpolicy", void 0);
    TagBoxComponent = __decorate([
        Component({
            // changeDetection: ChangeDetectionStrategy.OnPush,
            selector: 'tagbox',
            template: "\r\n<span *ngIf=\"boxTitle\" class=\"box-title\" [textContent]=\"boxTitle\"></span>\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onaction)=\"onTagAction($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onaction)=\"onTagAction($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
            styles: [":host{background-color:#fff;border:1px solid #ced4da;box-sizing:border-box;display:inline-block;min-height:50px;padding:5px;width:100%;border-radius:5px;margin-bottom:15px;position:relative}:host.alert{background-color:#ff9f9b;border-color:#880500}:host .box-title{display:block;position:absolute;top:-11px;left:10px;background-color:#fff;padding:0 5px}:host:focus{border-color:#0ba}:host:hover{background-color:#ddd}"]
        })
    ], TagBoxComponent);
    return TagBoxComponent;
}());

var TagTransfer = /** @class */ (function () {
    function TagTransfer() {
        this.data = {};
    }
    TagTransfer.prototype.setData = function (name, value) {
        this.data[name] = value;
    };
    TagTransfer.prototype.getData = function (name) {
        return this.data[name];
    };
    TagTransfer = __decorate([
        Injectable()
    ], TagTransfer);
    return TagTransfer;
}());

var TagComponent = /** @class */ (function () {
    function TagComponent(dataTransfer, el, renderer) {
        this.dataTransfer = dataTransfer;
        this.el = el;
        this.renderer = renderer;
        this.selectedFiller = -1;
        this.onaction = new EventEmitter();
        this.onfocus = new EventEmitter();
        this.onchange = new EventEmitter();
        this.onselect = new EventEmitter();
        this.onremove = new EventEmitter();
        this.onadd = new EventEmitter();
        this.ondrop = new EventEmitter();
    }
    TagComponent.prototype.ngOnInit = function () {
        this.init();
        this.el.nativeElement.draggable = (this.dragpolicy !== DragDropPolicy.disabled);
    };
    TagComponent.prototype.dragStart = function (event) {
        event.stopPropagation();
        if (this.allowDrag()) {
            if (!this.isIE()) {
                event.dataTransfer.setData("source", this.name); // this is needed to get the darg/drop going..
            }
            this.dataTransfer.setData("source", this); // this is needed because event data transfer takes string not bject
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
            source: this.dataTransfer.getData("source"),
            destination: this
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
    TagComponent.prototype.isIE = function () {
        var match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
        var isIE = false;
        if (match !== -1) {
            isIE = true;
        }
        return isIE;
    };
    TagComponent.prototype.allowDrop = function (event) {
        var source = this.dataTransfer.getData("source");
        var allow = (source && source.name != this.name) &&
            (this.name && this.name.length > 0) &&
            ((!source.format && !this.format) || source.format == this.format);
        return allow;
    };
    TagComponent.prototype.allowDrag = function () {
        return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
    };
    TagComponent.prototype.keyup = function (event) {
        var _this = this;
        if (event.target === this.el.nativeElement ||
            (this.editor && event.target === this.editor.nativeElement)) {
            var code = event.which;
            if (code === 13) { // cariage return
                this.click(event);
            }
            else if (code === 9 && this.editMode) { // tab out
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
            else if (code === 38) { // arrow up
                if (this.filler) {
                    if (this.selectedFiller >= 0) {
                        this.selectedFiller--;
                    }
                    else {
                        this.selectedFiller = this.fillerList.length - 1;
                    }
                }
            }
            else if (code === 40) { // arrow down
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
            if (code === 13) { // cariage return
                if (this.isSelectable()) {
                    this.onselect.emit(this);
                }
            }
        }
        else if (this.holder && event.target === this.holder.nativeElement) {
            var code = event.which;
            if (code === 13) { // cariage return
                this.editMode = true;
                setTimeout(function () { return _this.editor.nativeElement.focus(); }, 33);
            }
        }
        else {
            var code = event.which;
            if (code === 13) { // cariage return
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
        canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        return canRemove;
    };
    TagComponent.prototype.isEditable = function () {
        return (this.editpolicy === EditPolicy.addRemoveModify);
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
    TagComponent.prototype.componentChanged = function (event) {
        this.onaction.emit(event);
    };
    TagComponent.ctorParameters = function () { return [
        { type: TagTransfer },
        { type: ElementRef },
        { type: Renderer }
    ]; };
    __decorate([
        Output("onaction")
    ], TagComponent.prototype, "onaction", void 0);
    __decorate([
        Output("onfocus")
    ], TagComponent.prototype, "onfocus", void 0);
    __decorate([
        Output("onchange")
    ], TagComponent.prototype, "onchange", void 0);
    __decorate([
        Output("onselect")
    ], TagComponent.prototype, "onselect", void 0);
    __decorate([
        Output("onremove")
    ], TagComponent.prototype, "onremove", void 0);
    __decorate([
        Output("onadd")
    ], TagComponent.prototype, "onadd", void 0);
    __decorate([
        Output("ondrop")
    ], TagComponent.prototype, "ondrop", void 0);
    __decorate([
        Input("format")
    ], TagComponent.prototype, "format", void 0);
    __decorate([
        Input("removable")
    ], TagComponent.prototype, "removable", void 0);
    __decorate([
        Input("maxlength")
    ], TagComponent.prototype, "maxlength", void 0);
    __decorate([
        Input("name")
    ], TagComponent.prototype, "name", void 0);
    __decorate([
        Input("placeholder")
    ], TagComponent.prototype, "placeholder", void 0);
    __decorate([
        Input("parent")
    ], TagComponent.prototype, "parent", void 0);
    __decorate([
        Input("autocomplete")
    ], TagComponent.prototype, "autocomplete", void 0);
    __decorate([
        Input("selectionpolicy")
    ], TagComponent.prototype, "selectionpolicy", void 0);
    __decorate([
        Input("editpolicy")
    ], TagComponent.prototype, "editpolicy", void 0);
    __decorate([
        Input("dragpolicy")
    ], TagComponent.prototype, "dragpolicy", void 0);
    __decorate([
        ViewChild("editor", { static: false })
    ], TagComponent.prototype, "editor", void 0);
    __decorate([
        ViewChild("selector", { static: false })
    ], TagComponent.prototype, "selector", void 0);
    __decorate([
        ViewChild("holder", { static: false })
    ], TagComponent.prototype, "holder", void 0);
    __decorate([
        ViewChild("filler", { static: false })
    ], TagComponent.prototype, "filler", void 0);
    __decorate([
        HostListener('dragstart', ['$event'])
    ], TagComponent.prototype, "dragStart", null);
    __decorate([
        HostListener('drag', ['$event'])
    ], TagComponent.prototype, "drag", null);
    __decorate([
        HostListener('dragend', ['$event'])
    ], TagComponent.prototype, "dragEnd", null);
    __decorate([
        HostListener('drop', ['$event'])
    ], TagComponent.prototype, "drop", null);
    __decorate([
        HostListener('dragenter', ['$event'])
    ], TagComponent.prototype, "dragEnter", null);
    __decorate([
        HostListener('dragleave', ['$event'])
    ], TagComponent.prototype, "dragLeave", null);
    __decorate([
        HostListener('dragover', ['$event'])
    ], TagComponent.prototype, "dragOver", null);
    __decorate([
        HostListener('keyup', ['$event'])
    ], TagComponent.prototype, "keyup", null);
    __decorate([
        HostListener('click', ['$event'])
    ], TagComponent.prototype, "click", null);
    __decorate([
        HostListener('focus', ['$event'])
    ], TagComponent.prototype, "focus", null);
    TagComponent = __decorate([
        Component({
            selector: 'tag',
            template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span #holder\r\n    *ngIf=\"!editMode && placeholder\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [innerHTML]=\"placeholder\"></span>\r\n<span #holder\r\n    *ngIf=\"!editMode && !placeholder\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [rawContent]=\"name\"\r\n    intoName=\"audio 1\" intoId=\"audio1\" \r\n    [into]=\"format\"\r\n    [onComponentChange]=\"componentChanged.bind(this)\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
            styles: ["@charset \"UTF-8\";:host{cursor:pointer;color:#fdfdfd;margin:4px 2px;display:inline-block;background-color:#1f84ab;border:1px solid #015e85;border-radius:8px 20px 20px 8px;box-sizing:border-box;padding:3px 0;position:relative}:host ::ng-deep img{height:25px}:host.left-padded{padding-left:8px}:host.drag-over{background-color:#add8e6!important;cursor:move}:host[placeholder]{background-color:transparent;color:#000;border:0}:host[placeholder]:hover{background-color:#eee!important}:host[placeholder] .editor{color:#000}:host:hover{background-color:#027912!important;border-color:#024b0b!important}:host.focused{background-color:#027912!important;border-color:#024b0b!important}:host.selected:hover{background-color:#d6534e}:host.selected{background-color:#d6534e}:host.selected .selection.fa:before{content:\"\uF00C\"!important}:host .selection{background-color:transparent;float:left;margin-right:3px;padding:5px 3px;width:10px;height:10px;font-size:.8rem}:host .selection.fa:before{content:\"\uF013\"}:host .editor{background-color:transparent;overflow:unset;max-width:inherit;width:inherit;color:#fff;border:none}:host .placeholder{color:#888585;float:right;font-size:1rem;height:20px;line-height:20px;margin-left:5px;text-align:center;width:20px}:host .remove{float:right;font-size:.7rem;height:20px;width:20px;color:#fff;text-align:center;margin-left:5px;line-height:20px;font-weight:bolder}:host .holder{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host .autocomplete{position:absolute;top:26px;z-index:5}:host .autocomplete.off{display:none}:host .autocomplete ul{border:1px solid #024b0b;border-top:0;list-style:none inside;background-color:#027912;margin:0;max-height:150px;overflow-y:auto;padding:0}:host .autocomplete ul li{color:#fdfdfd;padding:5px;white-space:nowrap}:host .autocomplete ul li.selected{background-color:#d6534e}:host .autocomplete ul li:hover{background-color:#0446a8;color:#fff}"]
        })
    ], TagComponent);
    return TagComponent;
}());

var TagBoxModule = /** @class */ (function () {
    function TagBoxModule() {
    }
    TagBoxModule = __decorate([
        NgModule({
            imports: [
                CommonModule,
                WizardStorageModule,
                IntoPipeModule
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
        })
    ], TagBoxModule);
    return TagBoxModule;
}());

/**
 * Generated bundle index. Do not edit.
 */

export { DragDropPolicy, EditPolicy, Selectionpolicy, TagBoxComponent, TagBoxModule, TagComponent as ɵa, TagTransfer as ɵb };
//# sourceMappingURL=sedeh-tagbox.js.map
