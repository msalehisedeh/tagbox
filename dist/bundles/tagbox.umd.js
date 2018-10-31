(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('into-pipes'), require('@angular/common'), require('drag-enabled')) :
    typeof define === 'function' && define.amd ? define('tagbox', ['exports', '@angular/core', 'into-pipes', '@angular/common', 'drag-enabled'], factory) :
    (factory((global.tagbox = {}),global.ng.core,global.intoPipes,global.ng.common,global.dragEnabled));
}(this, (function (exports,core,intoPipes,common,dragEnabled) { 'use strict';

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
    var TagBoxComponent = (function () {
        function TagBoxComponent(renderer, el) {
            this.renderer = renderer;
            this.el = el;
            this._tags = [];
            this._selectedindex = [];
            this.onchange = new core.EventEmitter();
            this.onerror = new core.EventEmitter();
            this.onselect = new core.EventEmitter();
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
            { type: core.Component, args: [{
                        // changeDetection: ChangeDetectionStrategy.OnPush,
                        selector: 'tagbox',
                        template: "\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    tabindex=\"0\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
                        styles: [":host{background-color:#fff;border:1px solid #ced4da;box-sizing:border-box;display:inline-block;min-height:50px;padding:5px;width:100%;border-radius:5px;margin-bottom:5px}:host.alert{background-color:#ff9f9b;border-color:#880500}:host:focus{border-color:#0ba}:host:hover{background-color:#ddd}"]
                    }] }
        ];
        /** @nocollapse */
        TagBoxComponent.ctorParameters = function () {
            return [
                { type: core.Renderer },
                { type: core.ElementRef }
            ];
        };
        TagBoxComponent.propDecorators = {
            onchange: [{ type: core.Output, args: ["onchange",] }],
            onerror: [{ type: core.Output, args: ["onerror",] }],
            onselect: [{ type: core.Output, args: ["onselect",] }],
            beforeAction: [{ type: core.Input, args: ["beforeAction",] }],
            id: [{ type: core.Input, args: ["id",] }],
            placeholder: [{ type: core.Input, args: ["placeholder",] }],
            maxboxlength: [{ type: core.Input, args: ["maxboxlength",] }],
            maxtaglength: [{ type: core.Input, args: ["maxtaglength",] }],
            maxtags: [{ type: core.Input, args: ["maxtags",] }],
            mintags: [{ type: core.Input, args: ["mintags",] }],
            formController: [{ type: core.Input, args: ["formController",] }],
            tags: [{ type: core.Input, args: ["tags",] }],
            selectedindex: [{ type: core.Input, args: ["selectedindex",] }],
            delineateby: [{ type: core.Input, args: ["delineateby",] }],
            format: [{ type: core.Input, args: ["format",] }],
            autocomplete: [{ type: core.Input, args: ["autocomplete",] }],
            selectionpolicy: [{ type: core.Input, args: ["selectionpolicy",] }],
            editpolicy: [{ type: core.Input, args: ["editpolicy",] }],
            dragpolicy: [{ type: core.Input, args: ["dragpolicy",] }]
        };
        return TagBoxComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TagTransfer = (function () {
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
            { type: core.Injectable }
        ];
        /** @nocollapse */
        TagTransfer.ctorParameters = function () { return []; };
        return TagTransfer;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TagComponent = (function () {
        function TagComponent(dataTransfer, into, el, renderer) {
            this.dataTransfer = dataTransfer;
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
            { type: core.Component, args: [{
                        selector: 'tag',
                        template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span \r\n    *ngIf=\"!editMode\" \r\n    class=\"holder\" \r\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
                        styles: [":host{cursor:pointer;color:#fdfdfd;margin:4px 2px;display:inline-block;background-color:#1f84ab;border:1px solid #015e85;border-radius:8px 20px 20px 8px;box-sizing:border-box;padding:3px 0;position:relative}:host ::ng-deep img{height:25px}:host.left-padded{padding-left:8px}:host.drag-over{background-color:#add8e6!important;cursor:move}:host[placeholder]{background-color:transparent;color:#000;border:0}:host[placeholder]:hover{background-color:#eee!important}:host[placeholder] .editor{color:#000}:host:hover{background-color:#027912!important;border-color:#024b0b!important}:host.focused{background-color:#027912!important;border-color:#024b0b!important}:host.selected:hover{background-color:#d6534e}:host.selected{background-color:#d6534e}:host.selected .selection.fa:before{content:\"\\f00c\"!important}:host .selection{background-color:transparent;float:left;margin-right:3px;padding:5px 3px;width:10px;height:10px;font-size:.8rem}:host .selection.fa:before{content:\"\\f013\"}:host .editor{background-color:transparent;overflow:unset;max-width:inherit;width:inherit;color:#fff;border:none}:host .placeholder{color:#888585;float:right;font-size:1rem;height:20px;line-height:20px;margin-left:5px;text-align:center;width:20px}:host .remove{float:right;font-size:.7rem;height:20px;width:20px;color:#fff;text-align:center;margin-left:5px;line-height:20px;font-weight:bolder}:host .holder{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host .autocomplete{position:absolute;top:26px;z-index:5}:host .autocomplete.off{display:none}:host .autocomplete ul{border:1px solid #024b0b;border-top:0;list-style:none inside;background-color:#027912;margin:0;max-height:150px;overflow-y:auto;padding:0}:host .autocomplete ul li{color:#fdfdfd;padding:5px;white-space:nowrap}:host .autocomplete ul li.selected{background-color:#d6534e}:host .autocomplete ul li:hover{background-color:#0446a8;color:#fff}"]
                    }] }
        ];
        /** @nocollapse */
        TagComponent.ctorParameters = function () {
            return [
                { type: TagTransfer },
                { type: intoPipes.InToPipe },
                { type: core.ElementRef },
                { type: core.Renderer }
            ];
        };
        TagComponent.propDecorators = {
            onfocus: [{ type: core.Output, args: ["onfocus",] }],
            onchange: [{ type: core.Output, args: ["onchange",] }],
            onselect: [{ type: core.Output, args: ["onselect",] }],
            onremove: [{ type: core.Output, args: ["onremove",] }],
            onadd: [{ type: core.Output, args: ["onadd",] }],
            ondrop: [{ type: core.Output, args: ["ondrop",] }],
            format: [{ type: core.Input, args: ["format",] }],
            removable: [{ type: core.Input, args: ["removable",] }],
            maxlength: [{ type: core.Input, args: ["maxlength",] }],
            name: [{ type: core.Input, args: ["name",] }],
            placeholder: [{ type: core.Input, args: ["placeholder",] }],
            parent: [{ type: core.Input, args: ["parent",] }],
            autocomplete: [{ type: core.Input, args: ["autocomplete",] }],
            selectionpolicy: [{ type: core.Input, args: ["selectionpolicy",] }],
            editpolicy: [{ type: core.Input, args: ["editpolicy",] }],
            dragpolicy: [{ type: core.Input, args: ["dragpolicy",] }],
            editor: [{ type: core.ViewChild, args: ["editor",] }],
            selector: [{ type: core.ViewChild, args: ["selector",] }],
            filler: [{ type: core.ViewChild, args: ["filler",] }],
            dragStart: [{ type: core.HostListener, args: ['dragstart', ['$event'],] }],
            drag: [{ type: core.HostListener, args: ['drag', ['$event'],] }],
            dragEnd: [{ type: core.HostListener, args: ['dragend', ['$event'],] }],
            drop: [{ type: core.HostListener, args: ['drop', ['$event'],] }],
            dragEnter: [{ type: core.HostListener, args: ['dragenter', ['$event'],] }],
            dragLeave: [{ type: core.HostListener, args: ['dragleave', ['$event'],] }],
            dragOver: [{ type: core.HostListener, args: ['dragover', ['$event'],] }],
            keyup: [{ type: core.HostListener, args: ['keyup', ['$event'],] }],
            click: [{ type: core.HostListener, args: ['click', ['$event'],] }],
            focus: [{ type: core.HostListener, args: ['focus', ['$event'],] }]
        };
        return TagComponent;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
     */
    var TagBoxModule = (function () {
        function TagBoxModule() {
        }
        TagBoxModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [
                            common.CommonModule,
                            intoPipes.IntoPipeModule,
                            dragEnabled.DragDropModule
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
                        schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
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

    exports.TagBoxComponent = TagBoxComponent;
    exports.DragDropPolicy = DragDropPolicy;
    exports.EditPolicy = EditPolicy;
    exports.Selectionpolicy = Selectionpolicy;
    exports.TagBoxModule = TagBoxModule;
    exports.ɵa = TagComponent;
    exports.ɵb = TagTransfer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94LnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vdGFnYm94L3NyYy9hcHAvdGFnYm94L2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMudHMiLCJuZzovL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZ2JveC5jb21wb25lbnQudHMiLCJuZzovL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy50cmFuc2Zlci50cyIsIm5nOi8vdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnLmNvbXBvbmVudC50cyIsIm5nOi8vdGFnYm94L3NyYy9hcHAvdGFnYm94L3RhZ2JveC5tb2R1bGUudHMiXSwic291cmNlc0NvbnRlbnQiOlsiXHJcbmV4cG9ydCBlbnVtIERyYWdEcm9wUG9saWN5IHtcclxuICBkaXNhYmxlZCA9IDEsXHJcbiAgYXBwZW5kT25Ecm9wID0gMixcclxuICBwcmVwZW5kT25Ecm9wID0gMyxcclxuICBzd2FwT25Ecm9wID0gNFxyXG59XHJcbmV4cG9ydCBlbnVtIEVkaXRQb2xpY3kge1xyXG4gIHZpZXdPbmx5ID0gMSxcclxuICBhZGRPbmx5ID0gMixcclxuICByZW1vdmVPbmx5ID0gNCxcclxuICBhZGRBbmRSZW1vdmUgPSA2XHJcbn1cclxuZXhwb3J0IGVudW0gU2VsZWN0aW9ucG9saWN5IHtcclxuICBkaXNhYmxlZCA9IDEsXHJcbiAgbXVsdGlTZWxlY3QgPSAyLFxyXG4gIHNpbmdsZVNlbGVjdCA9IDNcclxufVxyXG4iLCIvKlxyXG4gKiBDb21wYXJpc2lvbiBUb29sIHdpbGwgbGF5b3V0IHR3byBjb21wYXJpc2lvbiB0cmVlcyBzaWRlIGJ5IHNpZGUgYW5kIGZlZWQgdGhlbSBhbiBpbnRlcm5hbCBvYmplY3RcclxuICogaGVpcmFyY2h5IGNyZWF0ZWQgZm9yIGludGVybmFsIHVzZSBmcm9tIEpTT04gb2JqZWN0cyBnaXZlbiB0byB0aGlzIGNvbXBvbmVudC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxyXG4gIE9uSW5pdCxcclxuICBPbkNoYW5nZXMsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEV2ZW50RW1pdHRlcixcclxuICBFbGVtZW50UmVmLFxyXG4gIFJlbmRlcmVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQge1xyXG4gIERyYWdEcm9wUG9saWN5LFxyXG4gIFNlbGVjdGlvbnBvbGljeSxcclxuICBFZGl0UG9saWN5XHJcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy90YWdib3guaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tICcuL3RhZy5jb21wb25lbnQnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgLy8gY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgc2VsZWN0b3I6ICd0YWdib3gnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWdib3guY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZ2JveC5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQm94Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMge1xyXG5cclxuICBfdGFnczogc3RyaW5nW10gPSBbXTtcclxuICBfc2VsZWN0ZWRpbmRleDogbnVtYmVyW10gPSBbXTtcclxuICBcclxuICBAT3V0cHV0KFwib25jaGFuZ2VcIilcclxuICBvbmNoYW5nZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmVycm9yXCIpXHJcbiAgb25lcnJvcj0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnNlbGVjdFwiKVxyXG4gIG9uc2VsZWN0PSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiYmVmb3JlQWN0aW9uXCIpXHJcbiAgYmVmb3JlQWN0aW9uID0gKGV2ZW50KSA9PiB0cnVlO1xyXG5cclxuICBASW5wdXQoXCJpZFwiKVxyXG4gIGlkOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IHN0cmluZyA9IFwiQWRkIFRhZ1wiO1xyXG4gIFxyXG4gIEBJbnB1dChcIm1heGJveGxlbmd0aFwiKVxyXG4gIG1heGJveGxlbmd0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtYXh0YWdsZW5ndGhcIilcclxuICBtYXh0YWdsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWF4dGFnc1wiKVxyXG4gIG1heHRhZ3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWludGFnc1wiKVxyXG4gIG1pbnRhZ3M6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwiZm9ybUNvbnRyb2xsZXJcIilcclxuICBmb3JtQ29udHJvbGxlcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIEBJbnB1dChcInRhZ3NcIilcclxuICB0YWdzOiBhbnk7XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGVkaW5kZXhcIilcclxuICBzZWxlY3RlZGluZGV4OiBhbnk7XHJcblxyXG4gIEBJbnB1dChcImRlbGluZWF0ZWJ5XCIpXHJcbiAgZGVsaW5lYXRlYnk6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcImF1dG9jb21wbGV0ZVwiKVxyXG4gIGF1dG9jb21wbGV0ZTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGlvbnBvbGljeVwiKVxyXG4gIHNlbGVjdGlvbnBvbGljeTogU2VsZWN0aW9ucG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJlZGl0cG9saWN5XCIpXHJcbiAgZWRpdHBvbGljeTogRWRpdFBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZHJhZ3BvbGljeVwiKVxyXG4gIGRyYWdwb2xpY3k6IERyYWdEcm9wUG9saWN5O1xyXG5cclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIsIHByaXZhdGUgZWw6IEVsZW1lbnRSZWYpIHtcclxuXHQgIFxyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RlZGluZGV4ICYmIFxyXG4gICAgICAgICh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBTdHJpbmcpICYmIFxyXG4gICAgICAgICh0aGlzLnRhZ3MgJiYgISh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBTdHJpbmcpKSkge1xyXG4gICAgICBjb25zdCB4OiBzdHJpbmcgPSBTdHJpbmcodGhpcy5zZWxlY3RlZGluZGV4KTtcclxuICAgICAgY29uc3QgbGlzdCA9IHguc3BsaXQoXCIsXCIpO1xyXG4gICAgICBsaXN0Lm1hcCgodCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXgucHVzaChwYXJzZUludCh0KSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IHRoaXMuc2VsZWN0ZWRpbmRleCA/IHRoaXMuc2VsZWN0ZWRpbmRleCA6IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnRhZ3MgJiYgISh0aGlzLnRhZ3MgaW5zdGFuY2VvZiBBcnJheSkpIHtcclxuICAgICAgY29uc3QgeDogc3RyaW5nID0gU3RyaW5nKHRoaXMudGFncyk7XHJcbiAgICAgIHRoaXMuX3RhZ3MgPSB4LnNwbGl0KHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fdGFncyA9IHRoaXMudGFncyA/IHRoaXMudGFncyA6IFtdO1xyXG4gICAgfVxyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50QXR0cmlidXRlKHRoaXMuZWwubmF0aXZlRWxlbWVudCxcInJvbGVcIixcImxpc3RcIik7XHJcbiAgfVxyXG5cclxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgaXRlbVNlbGVjdGVkQXQoaW5kZXgpIHtcclxuICAgIGNvbnN0IGNhblNlbGVjdCA9IHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQ7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KSA8IDAgPyBmYWxzZSA6IGNhblNlbGVjdDtcclxuICB9XHJcblxyXG4gIGl0ZW1TZWxlY3Rpb25DbGFzcyhpbmRleCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSB0aGlzLml0ZW1TZWxlY3RlZEF0KGluZGV4KTtcclxuICAgIHJldHVybiBzZWxlY3RlZCA/IFwic2VsZWN0ZWRcIiA6ICgoaW5kZXggPCAwIHx8IHRoaXMuc2VsZWN0aW9ucG9saWN5ID09PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpID8gXCJsZWZ0LXBhZGRlZFwiIDogXCJcIik7XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlICYmICghdGhpcy5taW50YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA+IHRoaXMubWludGFncykpO1xyXG5cclxuICAgIGlmICghY2FuUmVtb3ZlKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHJlbW92ZSB0YWcuIE9wZXJhdGlvbiBpcyBub3QgYWxsb3dlZC5cIik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgaXNEdXBsaWNhdGUobmFtZSkge1xyXG4gICAgY29uc3QgZmxhZyA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKSA8IDAgPyBmYWxzZSA6IHRydWU7XHJcbiAgICBpZiAoZmxhZykge1xyXG4gICAgICB0aGlzLm9uZXJyb3IuZW1pdChcIlVuYWJsZSB0byBwZXJmb3JtIG9wZXJhdGlvbi4gUmVzdWx0aW5nIGR1cGxpY2F0ZSB0YWdzIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmbGFnO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBhbGxvd2VkVG9hZGRJdGVtKG5hbWUpIHtcclxuICAgIGxldCBjYW5BZGQgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkT25seSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICghdGhpcy5tYXh0YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA8IHRoaXMubWF4dGFncykpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCAmJiAhdGhpcy5pc0R1cGxpY2F0ZShuYW1lKTtcclxuXHJcbiAgICBpZiAoY2FuQWRkICYmIHRoaXMubWF4dGFnbGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IHggPSB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgICBpZiAoeC5sZW5ndGgrbmFtZS5sZW5ndGgrMSA+PSB0aGlzLm1heGJveGxlbmd0aCkge1xyXG4gICAgICAgIGNhbkFkZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIGFkZCB0YWcuIFJlc3VsdGluZyBjb250ZW50IHdpbGwgZXhjZWVkIG1heHRhZ2xlbmd0aC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICByZXR1cm4gIGNhbkFkZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm90aWZ5Q2hhbmdlKCkge1xyXG4gICAgdGhpcy50YWdzID0gKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXMuX3RhZ3MgOiB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgdGhpcy5zZWxlY3RlZGluZGV4ID0gISh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbmNoYW5nZS5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHRhZ3M6IHRoaXMudGFncyxcclxuICAgICAgc2VsZWNlZEluZGV4OiB0aGlzLnNlbGVjdGVkaW5kZXgsXHJcbiAgICAgIGZvcm1Db250cm9sbGVyOiB0aGlzLmZvcm1Db250cm9sbGVyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBub3RpZnlTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9zZWxlY3RlZGluZGV4Lmxlbmd0aCA/IHRoaXMuX3NlbGVjdGVkaW5kZXguam9pbihcIixcIikgOiBcIlwiKTtcclxuICAgIHRoaXMub25zZWxlY3QuZW1pdCh7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGNyZWF0ZURyb3BSZXF1ZXN0KGFjdGlvbiwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVxdWVzdDogXCJkcm9wXCIsXHJcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICBzb3VyY2U6IHtcclxuICAgICAgICBpZDogc291cmNlLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBzb3VyY2UubmFtZVxyXG4gICAgICB9LFxyXG4gICAgICBkZXN0aW5hdGlvbjoge1xyXG4gICAgICAgIGlkOiBkZXN0aW5hdGlvbi5wYXJlbnQuaWQsXHJcbiAgICAgICAgbmFtZTogZGVzdGluYXRpb24ubmFtZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgcHJlcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gc291cmNlLm5hbWUgICsgXCIgXCIgKyB0aGlzLl90YWdzW2luZGV4XTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwicHJlcGVuZFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG5ld05hbWU7XHJcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcHJpdmF0ZSBhcHBlbmRUYWdBdChpbmRleCwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IHRoaXMuX3RhZ3NbaW5kZXhdICsgXCIgXCIgKyBzb3VyY2UubmFtZTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwiYXBwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICByZW1vdmVUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwicmVtb3ZlXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKTtcclxuICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcblxyXG4gICAgICB0aGlzLl90YWdzLnNwbGljZShpbmRleCwxKTtcclxuICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICAgIFxyXG4gICAgaWYgKGluZGV4IDwgMCAgJiYgXHJcbiAgICAgICAgbmFtZS5sZW5ndGggJiYgXHJcbiAgICAgICAgdGhpcy5hbGxvd2VkVG9hZGRJdGVtKG5hbWUpICYmIFxyXG4gICAgICAgIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiYWRkXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICB0aGlzLl90YWdzLnB1c2gobmFtZSk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ1JlbW92ZShldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICB0aGlzLnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50Lm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgb25UYWdBZGQoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQubmFtZSkpIHtcclxuICAgICAgZXZlbnQubmFtZSA9IFwiXCI7XHJcbiAgICAgIGV2ZW50LmNsaWNrKG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnQ2hhbmdlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICghdGhpcy5pc0R1cGxpY2F0ZShldmVudC5uYW1lKSAmJiB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcImNoYW5nZVwiLCBpdGVtOiBldmVudC5vcmlnaW5hbE5hbWUsIHRvOiBldmVudC5uYW1lfSkpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQub3JpZ2luYWxOYW1lKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gZXZlbnQubmFtZTtcclxuICAgICAgZXZlbnQuaW5pdCgpO1xyXG4gICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnRHJvcChldmVudCkge1xyXG4gICAgY29uc3Qgc2luZCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICBjb25zdCBkaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LmRlc3RpbmF0aW9uLm5hbWUpO1xyXG5cclxuICAgIGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LmFwcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kucHJlcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKHNpbmQpO1xyXG4gICAgICAgICAgdGhpcy5fdGFncy5zcGxpY2Uoc2luZCwxKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuc3dhcE9uRHJvcCkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcInN3YXBcIiwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgICAgdGhpcy5fdGFnc1tzaW5kXSA9IHRoaXMuX3RhZ3Muc3BsaWNlKGRpbmQsIDEsIHRoaXMuX3RhZ3Nbc2luZF0pWzBdO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbiAgb25UYWdTZWxlY3QoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5vblRhZ0ZvY3VzKGV2ZW50KTtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0Olwic2VsZWN0XCIsIGl0ZW06IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LnNpbmdsZVNlbGVjdCkge1xyXG4gICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgLy8gMyBpcyB0ZXh0IGFuZCA4IGlzIGNvbW1lbnRcclxuICAgICAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ0ZvY3VzKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSB7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgIGlmIChsaXN0W2ldLm5vZGVUeXBlICE9PSAzICYmIGxpc3RbaV0ubm9kZVR5cGUgIT09IDgpIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwiZm9jdXNlZFwiLCBmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJmb2N1c2VkXCIsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUsIEluamVjdCAgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhZ1RyYW5zZmVyIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBkYXRhOiBhbnkgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc2V0RGF0YShuYW1lLCB2YWx1ZSl7XHJcbiAgICAgICAgdGhpcy5kYXRhW25hbWVdID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0RGF0YShuYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtuYW1lXTtcclxuICAgIH1cclxuICAgICAgICAgICAgXHJcbn0iLCIvKlxyXG4gKiBBIGNvbXBhcmlzaW9uIHRyZWUgd2lsbCBsYXlvdXQgZWFjaCBhdHRyaWJ1dGUgb2YgYSBqc29uIGRlZXAgdGhyb3VnaCBpdHMgaGVpcmFyY2h5IHdpdGggZ2l2ZW4gdmlzdWFsIHF1ZXVlc1xyXG4gKiB0aGF0IHJlcHJlc2VudHMgYSBkZWxldGlvbiwgYWRpdGlvbiwgb3IgY2hhbmdlIG9mIGF0dHJpYnV0ZSBmcm9tIHRoZSBvdGhlciB0cmVlLiBUaGUgc3RhdHVzIG9mIGVhY2ggbm9kZSBpcyBcclxuICogZXZhbHVhdGVkIGJ5IHRoZSBwYXJlbnQgY29tcGFyaXNpb24gdG9vbC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXIsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgSW5Ub1BpcGUgfSBmcm9tICdpbnRvLXBpcGVzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi90YWcudHJhbnNmZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd0YWcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZy5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBlZGl0TW9kZTogYm9vbGVhbjtcclxuXHJcbiAgb3JpZ2luYWxOYW1lOiBzdHJpbmc7XHJcbiAgc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICBmaWxsZXJMaXN0OiBzdHJpbmdbXTtcclxuXHJcbiAgQE91dHB1dChcIm9uZm9jdXNcIilcclxuICBvbmZvY3VzPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnJlbW92ZVwiKVxyXG4gIG9ucmVtb3ZlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uYWRkXCIpXHJcbiAgb25hZGQ9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25kcm9wXCIpXHJcbiAgb25kcm9wPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInJlbW92YWJsZVwiKVxyXG4gIHJlbW92YWJsZTogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwibWF4bGVuZ3RoXCIpXHJcbiAgbWF4bGVuZ3RoOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcIm5hbWVcIilcclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IGJvb2xlYW47XHJcblxyXG4gIEBJbnB1dChcInBhcmVudFwiKVxyXG4gIHBhcmVudDogYW55O1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcbiAgQFZpZXdDaGlsZChcImVkaXRvclwiKVxyXG4gIGVkaXRvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcInNlbGVjdG9yXCIpXHJcbiAgc2VsZWN0b3I7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJmaWxsZXJcIilcclxuICBmaWxsZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBkYXRhVHJhbnNmZXI6IFRhZ1RyYW5zZmVyLFxyXG4gICAgcHJpdmF0ZSBpbnRvOiBJblRvUGlwZSxcclxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlclxyXG4gICl7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9ICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdzdGFydCcsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdTdGFydChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICBpZiAodGhpcy5hbGxvd0RyYWcoKSkge1xyXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwic291cmNlXCIsdGhpcy5uYW1lKTsgLy8gdGhpcyBpcyBuZWVkZWQgdG8gZ2V0IHRoZSBkYXJnL2Ryb3AgZ29pbmcuLlxyXG4gICAgICAgIHRoaXMuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzKTsgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBldmVudCBkYXRhIHRyYW5zZmVyIHRha2VzIHN0cmluZyBub3QgYmplY3RcclxuICAgICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcmFnJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZyhldmVudCkge31cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0VuZChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG5cclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxyXG4gIGRyb3AoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgIHRoaXMub25kcm9wLmVtaXQoe1xyXG4gICAgICBzb3VyY2U6IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIiksXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB0aGlzXHJcbiAgICB9KVxyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnRW50ZXIoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKHRoaXMuYWxsb3dEcm9wKGV2ZW50KSkge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdMZWF2ZShldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnT3ZlcihldmVudCkge1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGFsbG93RHJvcChldmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwic291cmNlXCIpO1xyXG5cclxuICAgICAgcmV0dXJuIChzb3VyY2UgJiYgc291cmNlLm5hbWUgIT0gdGhpcy5uYW1lKSAmJiB0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDA7XHJcbiAgfVxyXG5cclxuICBhbGxvd0RyYWcoKSA6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKSAmJiB0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDA7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pIFxyXG4gIGtleXVwKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgfHxcclxuICAgICAgICh0aGlzLmVkaXRvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5jbGljayhldmVudClcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDkgJiYgdGhpcy5lZGl0TW9kZSkgeyAvLyB0YWIgb3V0XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCA2Nik7XHJcbiAgICAgIH1lbHNlIGlmIChjb2RlID09PSAzOCkgeyAvLyBhcnJvdyB1cFxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyLS07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gdGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB9ICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDQwKSB7IC8vIGFycm93IGRvd25cclxuICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyIDwgKHRoaXMuZmlsbGVyTGlzdC5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyKys7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICB9ICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSkgXHJcbiAgY2xpY2soZXZlbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0VkaXRhYmxlKCkpIHtcclxuICAgICAgdGhpcy5lZGl0TW9kZSA9ICF0aGlzLmVkaXRNb2RlO1xyXG4gICAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5maWxsZXIubmF0aXZlRWxlbWVudCwgXCJvZmZcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSw2Nik7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSB9LDY2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdmb2N1cycsIFsnJGV2ZW50J10pIFxyXG4gIGZvY3VzKGV2ZW50KSB7XHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICB0aGlzLm9uZm9jdXMuZW1pdCh0aGlzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNSZW1vdmFibGUoKSB7XHJcbiAgICBsZXQgY2FuUmVtb3ZlID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LnJlbW92ZU9ubHkpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIGlzRWRpdGFibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmVkaXRwb2xpY3kgIT09IEVkaXRQb2xpY3kudmlld09ubHkpO1xyXG4gIH1cclxuXHJcbiAgaXNEcmFnZ2FibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIGlzU2VsZWN0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuICBzZWxlY3QoKSB7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIHRhYm91dChldmVudCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAwID8gZXZlbnQudGFyZ2V0LnZhbHVlIDogdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGggJiYgdGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sIDY2KVxyXG4gIH1cclxuICBlZGl0KGV2ZW50KSB7XHJcbiAgICB0aGlzLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICB0aGlzLnVwZGF0ZUZpbGxlckxpc3QodGhpcy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUZpbGxlckxpc3QodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5maWxsZXJMaXN0ID0gdGhpcy5hdXRvY29tcGxldGUuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmluZGV4T2YodmFsdWUpID49IDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5vcmlnaW5hbE5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5uYW1lID0gdGhpcy5vcmlnaW5hbE5hbWU7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25yZW1vdmUuZW1pdCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvcm1hdHRlZE5hbWUoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5uYW1lO1xyXG4gICAgaWYgKHRoaXMuZm9ybWF0KSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaW50by50cmFuc2Zvcm0odGhpcy5uYW1lLCB0aGlzLmZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW50b1BpcGVNb2R1bGUgfSBmcm9tICdpbnRvLXBpcGVzJztcclxuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdkcmFnLWVuYWJsZWQnO1xyXG5cclxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWdCb3hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy50cmFuc2Zlcic7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIEludG9QaXBlTW9kdWxlLFxyXG5cdERyYWdEcm9wTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFRhZ0JveENvbXBvbmVudCxcclxuICAgIFRhZ0NvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgVGFnQm94Q29tcG9uZW50XHJcbiAgXSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgVGFnVHJhbnNmZXJcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhZ0JveE1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiQ29tcG9uZW50IiwiUmVuZGVyZXIiLCJFbGVtZW50UmVmIiwiT3V0cHV0IiwiSW5wdXQiLCJJbmplY3RhYmxlIiwiSW5Ub1BpcGUiLCJWaWV3Q2hpbGQiLCJIb3N0TGlzdGVuZXIiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkludG9QaXBlTW9kdWxlIiwiRHJhZ0Ryb3BNb2R1bGUiLCJDVVNUT01fRUxFTUVOVFNfU0NIRU1BIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7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