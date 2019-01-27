(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@sedeh/into-pipes'), require('@angular/common'), require('@sedeh/drag-enabled')) :
    typeof define === 'function' && define.amd ? define('@sedeh/tagbox', ['exports', '@angular/core', '@sedeh/into-pipes', '@angular/common', '@sedeh/drag-enabled'], factory) :
    (factory((global.sedeh = global.sedeh || {}, global.sedeh.tagbox = {}),global.ng.core,global['into-pipes'],global.ng.common,global['drag-enabled']));
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
            { type: core.Component, args: [{
                        // changeDetection: ChangeDetectionStrategy.OnPush,
                        selector: 'tagbox',
                        template: "\r\n<tag theme\r\n    *ngFor=\"let t of _tags; let i=index\"\r\n    [class]=\"itemSelectionClass(i)\"\r\n    [name]=\"t\"\r\n    [parent]=\"this\"\r\n    [removable]=\"isRemovable()\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onselect)=\"onTagSelect($event)\"\r\n    (onfocus)=\"onTagFocus($event)\">\r\n</tag><tag theme\r\n    placeholder\r\n    tabindex=\"0\"\r\n    name=\"\"\r\n    [parent]=\"this\"\r\n    [class]=\"itemSelectionClass(-1)\"\r\n    [maxlength]=\"maxtaglength\"\r\n    [placeholder]=\"placeholder\"\r\n    [format]=\"format\"\r\n    [autocomplete]=\"autocomplete\"\r\n    [attr.role]=\"'listitem'\"\r\n    [selectionpolicy]=\"selectionpolicy\"\r\n    [editpolicy]=\"editpolicy\" \r\n    [dragpolicy]=\"dragpolicy\"\r\n    (ondrop)=\"onTagDrop($event)\"\r\n    (onchange)=\"onTagChange($event)\"\r\n    (onadd)=\"onTagAdd($event)\"\r\n    (onremove)=\"onTagRemove($event)\"\r\n    (onfocus)=\"onTagFocus($event)\"></tag>\r\n",
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
            { type: core.Component, args: [{
                        selector: 'tag',
                        template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span #holder\r\n    *ngIf=\"!editMode\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [innerHTML]=\"placeholder ? placeholder : formattedName()\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
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
            holder: [{ type: core.ViewChild, args: ["holder",] }],
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtdGFnYm94LnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzLnRzIiwibmc6Ly9Ac2VkZWgvdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudC50cyIsIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy50cmFuc2Zlci50cyIsIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC90YWdib3gvc3JjL2FwcC90YWdib3gvdGFnYm94Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGVudW0gRHJhZ0Ryb3BQb2xpY3kge1xyXG4gIGRpc2FibGVkID0gMSxcclxuICBhcHBlbmRPbkRyb3AgPSAyLFxyXG4gIHByZXBlbmRPbkRyb3AgPSAzLFxyXG4gIHN3YXBPbkRyb3AgPSA0XHJcbn1cclxuZXhwb3J0IGVudW0gRWRpdFBvbGljeSB7XHJcbiAgdmlld09ubHkgPSAxLFxyXG4gIGFkZE9ubHkgPSAyLFxyXG4gIHJlbW92ZU9ubHkgPSA0LFxyXG4gIGFkZEFuZFJlbW92ZSA9IDYsXHJcbiAgYWRkUmVtb3ZlTW9kaWZ5ID0gN1xyXG59XHJcbmV4cG9ydCBlbnVtIFNlbGVjdGlvbnBvbGljeSB7XHJcbiAgZGlzYWJsZWQgPSAxLFxyXG4gIG11bHRpU2VsZWN0ID0gMixcclxuICBzaW5nbGVTZWxlY3QgPSAzXHJcbn1cclxuIiwiLypcclxuICogQ29tcGFyaXNpb24gVG9vbCB3aWxsIGxheW91dCB0d28gY29tcGFyaXNpb24gdHJlZXMgc2lkZSBieSBzaWRlIGFuZCBmZWVkIHRoZW0gYW4gaW50ZXJuYWwgb2JqZWN0XHJcbiAqIGhlaXJhcmNoeSBjcmVhdGVkIGZvciBpbnRlcm5hbCB1c2UgZnJvbSBKU09OIG9iamVjdHMgZ2l2ZW4gdG8gdGhpcyBjb21wb25lbnQuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBPbkluaXQsXHJcbiAgT25DaGFuZ2VzLFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSAnLi90YWcuY29tcG9uZW50JztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIC8vIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG4gIHNlbGVjdG9yOiAndGFnYm94JyxcclxuICB0ZW1wbGF0ZVVybDogJy4vdGFnYm94LmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi90YWdib3guY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFRhZ0JveENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzIHtcclxuXHJcbiAgX3RhZ3M6IHN0cmluZ1tdID0gW107XHJcbiAgX3NlbGVjdGVkaW5kZXg6IG51bWJlcltdID0gW107XHJcbiAgXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25lcnJvclwiKVxyXG4gIG9uZXJyb3I9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBJbnB1dChcImJlZm9yZUFjdGlvblwiKVxyXG4gIGJlZm9yZUFjdGlvbiA9IChldmVudCkgPT4gdHJ1ZTtcclxuXHJcbiAgQElucHV0KFwiaWRcIilcclxuICBpZDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJwbGFjZWhvbGRlclwiKVxyXG4gIHBsYWNlaG9sZGVyOiBzdHJpbmcgPSBcIkFkZCBUYWdcIjtcclxuICBcclxuICBASW5wdXQoXCJtYXhib3hsZW5ndGhcIilcclxuICBtYXhib3hsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgQElucHV0KFwibWF4dGFnbGVuZ3RoXCIpXHJcbiAgbWF4dGFnbGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1heHRhZ3NcIilcclxuICBtYXh0YWdzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1pbnRhZ3NcIilcclxuICBtaW50YWdzOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcImZvcm1Db250cm9sbGVyXCIpXHJcbiAgZm9ybUNvbnRyb2xsZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICBASW5wdXQoXCJ0YWdzXCIpXHJcbiAgdGFnczogYW55O1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3RlZGluZGV4XCIpXHJcbiAgc2VsZWN0ZWRpbmRleDogYW55O1xyXG5cclxuICBASW5wdXQoXCJkZWxpbmVhdGVieVwiKVxyXG4gIGRlbGluZWF0ZWJ5OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcImZvcm1hdFwiKVxyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyLCBwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7XHJcblx0ICBcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0ZWRpbmRleCAmJiBcclxuICAgICAgICAodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgU3RyaW5nKSAmJiBcclxuICAgICAgICAodGhpcy50YWdzICYmICEodGhpcy50YWdzIGluc3RhbmNlb2YgU3RyaW5nKSkpIHtcclxuICAgICAgY29uc3QgeDogc3RyaW5nID0gU3RyaW5nKHRoaXMuc2VsZWN0ZWRpbmRleCk7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB4LnNwbGl0KFwiLFwiKTtcclxuICAgICAgbGlzdC5tYXAoKHQpID0+IHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2gocGFyc2VJbnQodCkpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSB0aGlzLnNlbGVjdGVkaW5kZXggPyB0aGlzLnNlbGVjdGVkaW5kZXggOiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy50YWdzICYmICEodGhpcy50YWdzIGluc3RhbmNlb2YgQXJyYXkpKSB7XHJcbiAgICAgIGNvbnN0IHg6IHN0cmluZyA9IFN0cmluZyh0aGlzLnRhZ3MpO1xyXG4gICAgICB0aGlzLl90YWdzID0geC5zcGxpdCh0aGlzLmRlbGluZWF0ZWJ5ID8gdGhpcy5kZWxpbmVhdGVieSA6IFwiLFwiKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX3RhZ3MgPSB0aGlzLnRhZ3MgPyB0aGlzLnRhZ3MgOiBbXTtcclxuICAgIH1cclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudEF0dHJpYnV0ZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsXCJyb2xlXCIsXCJsaXN0XCIpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlcykge1xyXG5cclxuICB9XHJcblxyXG4gIGl0ZW1TZWxlY3RlZEF0KGluZGV4KSB7XHJcbiAgICBjb25zdCBjYW5TZWxlY3QgPSB0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkO1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCkgPCAwID8gZmFsc2UgOiBjYW5TZWxlY3Q7XHJcbiAgfVxyXG5cclxuICBpdGVtU2VsZWN0aW9uQ2xhc3MoaW5kZXgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5pdGVtU2VsZWN0ZWRBdChpbmRleCk7XHJcbiAgICByZXR1cm4gc2VsZWN0ZWQgPyBcInNlbGVjdGVkXCIgOiAoKGluZGV4IDwgMCB8fCB0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSA/IFwibGVmdC1wYWRkZWRcIiA6IFwiXCIpO1xyXG4gIH1cclxuXHJcbiAgaXNSZW1vdmFibGUoKSB7XHJcbiAgICBsZXQgY2FuUmVtb3ZlID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZFJlbW92ZU1vZGlmeSk7XHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5yZW1vdmVPbmx5KTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgJiYgKCF0aGlzLm1pbnRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoID4gdGhpcy5taW50YWdzKSk7XHJcblxyXG4gICAgaWYgKCFjYW5SZW1vdmUpIHtcclxuICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gcmVtb3ZlIHRhZy4gT3BlcmF0aW9uIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0R1cGxpY2F0ZShuYW1lKSB7XHJcbiAgICBjb25zdCBmbGFnID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpIDwgMCA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIGlmIChmbGFnKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLiBSZXN1bHRpbmcgZHVwbGljYXRlIHRhZ3MgaXMgbm90IGFsbG93ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZsYWc7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFsbG93ZWRUb2FkZEl0ZW0obmFtZSkge1xyXG4gICAgbGV0IGNhbkFkZCA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gICAgY2FuQWRkID0gY2FuQWRkIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkT25seSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICghdGhpcy5tYXh0YWdzIHx8ICh0aGlzLl90YWdzLmxlbmd0aCA8IHRoaXMubWF4dGFncykpO1xyXG5cclxuICAgIGNhbkFkZCA9IGNhbkFkZCAmJiAhdGhpcy5pc0R1cGxpY2F0ZShuYW1lKTtcclxuXHJcbiAgICBpZiAoY2FuQWRkICYmIHRoaXMubWF4dGFnbGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IHggPSB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgICBpZiAoeC5sZW5ndGgrbmFtZS5sZW5ndGgrMSA+PSB0aGlzLm1heGJveGxlbmd0aCkge1xyXG4gICAgICAgIGNhbkFkZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIGFkZCB0YWcuIFJlc3VsdGluZyBjb250ZW50IHdpbGwgZXhjZWVkIG1heHRhZ2xlbmd0aC5cIik7XHJcbiAgICAgIH1cclxuICAgIH0gICAgXHJcbiAgICByZXR1cm4gIGNhbkFkZDtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgbm90aWZ5Q2hhbmdlKCkge1xyXG4gICAgdGhpcy50YWdzID0gKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSA/IHRoaXMuX3RhZ3MgOiB0aGlzLl90YWdzLmpvaW4oIHRoaXMuZGVsaW5lYXRlYnkgPyB0aGlzLmRlbGluZWF0ZWJ5IDogXCIsXCIpO1xyXG4gICAgdGhpcy5zZWxlY3RlZGluZGV4ID0gISh0aGlzLnNlbGVjdGVkaW5kZXggaW5zdGFuY2VvZiBBcnJheSkgPyBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbmNoYW5nZS5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHRhZ3M6IHRoaXMudGFncyxcclxuICAgICAgc2VsZWNlZEluZGV4OiB0aGlzLnNlbGVjdGVkaW5kZXgsXHJcbiAgICAgIGZvcm1Db250cm9sbGVyOiB0aGlzLmZvcm1Db250cm9sbGVyXHJcbiAgICB9KTtcclxuICB9XHJcbiAgcHJpdmF0ZSBub3RpZnlTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4IDogXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICh0aGlzLl9zZWxlY3RlZGluZGV4Lmxlbmd0aCA/IHRoaXMuX3NlbGVjdGVkaW5kZXguam9pbihcIixcIikgOiBcIlwiKTtcclxuICAgIHRoaXMub25zZWxlY3QuZW1pdCh7XHJcbiAgICAgIGlkOiB0aGlzLmlkLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIGNyZWF0ZURyb3BSZXF1ZXN0KGFjdGlvbiwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgcmVxdWVzdDogXCJkcm9wXCIsXHJcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxyXG4gICAgICBzb3VyY2U6IHtcclxuICAgICAgICBpZDogc291cmNlLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBzb3VyY2UubmFtZVxyXG4gICAgICB9LFxyXG4gICAgICBkZXN0aW5hdGlvbjoge1xyXG4gICAgICAgIGlkOiBkZXN0aW5hdGlvbi5wYXJlbnQuaWQsXHJcbiAgICAgICAgbmFtZTogZGVzdGluYXRpb24ubmFtZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHByaXZhdGUgcHJlcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gc291cmNlLm5hbWUgICsgXCIgXCIgKyB0aGlzLl90YWdzW2luZGV4XTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwicHJlcGVuZFwiLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICB0aGlzLl90YWdzW2luZGV4XSA9IG5ld05hbWU7XHJcbiAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbiAgcHJpdmF0ZSBhcHBlbmRUYWdBdChpbmRleCwgc291cmNlLCBkZXN0aW5hdGlvbikge1xyXG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgY29uc3QgbmV3TmFtZSA9IHRoaXMuX3RhZ3NbaW5kZXhdICsgXCIgXCIgKyBzb3VyY2UubmFtZTtcclxuICAgIGlmICghdGhpcy5tYXh0YWdsZW5ndGggfHwgICh0aGlzLm1heHRhZ2xlbmd0aCAmJiBzb3VyY2UubmFtZS5sZW5ndGggPD0gdGhpcy5tYXh0YWdsZW5ndGgpKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwiYXBwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICByZW1vdmVUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwicmVtb3ZlXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICBpZiAodGhpcy5fc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgdGhpcy5fdGFncy5zcGxpY2UoaW5kZXgsMSk7XHJcbiAgICAgICAgaWYgKGkgPj0gMCkge1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBhZGRUYWdXaXRoTmFtZShuYW1lKSB7XHJcbiAgICBsZXQgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YobmFtZSk7XHJcbiAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICAgIFxyXG4gICAgaWYgKGluZGV4IDwgMCAgJiYgXHJcbiAgICAgICAgbmFtZS5sZW5ndGggJiYgXHJcbiAgICAgICAgdGhpcy5hbGxvd2VkVG9hZGRJdGVtKG5hbWUpICYmIFxyXG4gICAgICAgIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiYWRkXCIsIGl0ZW06IG5hbWV9KSkge1xyXG4gICAgICB0aGlzLl90YWdzLnB1c2gobmFtZSk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ1JlbW92ZShldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICB0aGlzLnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50Lm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgb25UYWdBZGQoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQubmFtZSkpIHtcclxuICAgICAgZXZlbnQubmFtZSA9IFwiXCI7XHJcbiAgICAgIGV2ZW50LmNsaWNrKG51bGwpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnQ2hhbmdlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICghdGhpcy5pc0R1cGxpY2F0ZShldmVudC5uYW1lKSAmJiB0aGlzLmJlZm9yZUFjdGlvbih7cmVxdWVzdDpcImNoYW5nZVwiLCBpdGVtOiBldmVudC5vcmlnaW5hbE5hbWUsIHRvOiBldmVudC5uYW1lfSkpIHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQub3JpZ2luYWxOYW1lKTtcclxuICAgICAgXHJcbiAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gZXZlbnQubmFtZTtcclxuICAgICAgZXZlbnQuaW5pdCgpO1xyXG4gICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZXZlbnQucmVzZXQoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG9uVGFnRHJvcChldmVudCkge1xyXG4gICAgY29uc3Qgc2luZCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICBjb25zdCBkaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LmRlc3RpbmF0aW9uLm5hbWUpO1xyXG5cclxuICAgIGlmICh0aGlzLmRyYWdwb2xpY3kgPT09IERyYWdEcm9wUG9saWN5LmFwcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kucHJlcGVuZE9uRHJvcCkge1xyXG4gICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucHJlcGVuZFRhZ0F0KGRpbmQsIGV2ZW50LnNvdXJjZSwgZXZlbnQuZGVzdGluYXRpb24pKSB7XHJcbiAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKHNpbmQpO1xyXG4gICAgICAgICAgdGhpcy5fdGFncy5zcGxpY2Uoc2luZCwxKTtcclxuICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXguc3BsaWNlKGksMSk7XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuc3dhcE9uRHJvcCkge1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24odGhpcy5jcmVhdGVEcm9wUmVxdWVzdChcInN3YXBcIiwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgaWYgKGV2ZW50LnNvdXJjZS5wYXJlbnQuaWQgPT09IGV2ZW50LmRlc3RpbmF0aW9uLnBhcmVudC5pZCkge1xyXG4gICAgICAgICAgdGhpcy5fdGFnc1tzaW5kXSA9IHRoaXMuX3RhZ3Muc3BsaWNlKGRpbmQsIDEsIHRoaXMuX3RhZ3Nbc2luZF0pWzBdO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHRoaXMuYWRkVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBcclxuICB9XHJcbiAgb25UYWdTZWxlY3QoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5vblRhZ0ZvY3VzKGV2ZW50KTtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0Olwic2VsZWN0XCIsIGl0ZW06IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSA9PT0gU2VsZWN0aW9ucG9saWN5LnNpbmdsZVNlbGVjdCkge1xyXG4gICAgICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAgICAgLy8gMyBpcyB0ZXh0IGFuZCA4IGlzIGNvbW1lbnRcclxuICAgICAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50Lm5hbWUpO1xyXG4gICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihpbmRleCk7XHJcbiAgXHJcbiAgICAgICAgICAgIGlmIChpIDwgMCkge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleCA9IFtpbmRleF07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlTZWxlY3Rpb24oKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgXHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnB1c2goaW5kZXgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGV2ZW50LmVsLm5hdGl2ZUVsZW1lbnQsIFwic2VsZWN0ZWRcIiwgZmFsc2UpXHJcbiAgICAgICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBvblRhZ0ZvY3VzKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKSB7XHJcbiAgICAgIGNvbnN0IGxpc3QgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGROb2RlcztcclxuICAgICAgZm9yKGxldCBpPTA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKXtcclxuICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgIGlmIChsaXN0W2ldLm5vZGVUeXBlICE9PSAzICYmIGxpc3RbaV0ubm9kZVR5cGUgIT09IDgpIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKGxpc3RbaV0sIFwiZm9jdXNlZFwiLCBmYWxzZSlcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJmb2N1c2VkXCIsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFRhZ1RyYW5zZmVyIHtcclxuICAgIFxyXG4gICAgcHJpdmF0ZSBkYXRhOiBhbnkgPSB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHt9XHJcblxyXG4gICAgc2V0RGF0YShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpe1xyXG4gICAgICAgIHRoaXMuZGF0YVtuYW1lXSA9IHZhbHVlO1xyXG4gICAgfVxyXG5cclxuICAgIGdldERhdGEobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtuYW1lXTtcclxuICAgIH1cclxuICAgICAgICAgICAgXHJcbn0iLCIvKlxyXG4gKiBBIGNvbXBhcmlzaW9uIHRyZWUgd2lsbCBsYXlvdXQgZWFjaCBhdHRyaWJ1dGUgb2YgYSBqc29uIGRlZXAgdGhyb3VnaCBpdHMgaGVpcmFyY2h5IHdpdGggZ2l2ZW4gdmlzdWFsIHF1ZXVlc1xyXG4gKiB0aGF0IHJlcHJlc2VudHMgYSBkZWxldGlvbiwgYWRpdGlvbiwgb3IgY2hhbmdlIG9mIGF0dHJpYnV0ZSBmcm9tIHRoZSBvdGhlciB0cmVlLiBUaGUgc3RhdHVzIG9mIGVhY2ggbm9kZSBpcyBcclxuICogZXZhbHVhdGVkIGJ5IHRoZSBwYXJlbnQgY29tcGFyaXNpb24gdG9vbC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXIsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHsgSW5Ub1BpcGUgfSBmcm9tICdAc2VkZWgvaW50by1waXBlcyc7XHJcblxyXG5pbXBvcnQge1xyXG4gIERyYWdEcm9wUG9saWN5LFxyXG4gIFNlbGVjdGlvbnBvbGljeSxcclxuICBFZGl0UG9saWN5XHJcbn0gZnJvbSAnLi4vaW50ZXJmYWNlcy90YWdib3guaW50ZXJmYWNlcyc7XHJcblxyXG5pbXBvcnQgeyBUYWdUcmFuc2ZlciB9IGZyb20gJy4vdGFnLnRyYW5zZmVyJztcclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAndGFnJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vdGFnLmNvbXBvbmVudC5odG1sJyxcclxuICBzdHlsZVVybHM6IFsnLi90YWcuY29tcG9uZW50LnNjc3MnXSxcclxufSlcclxuZXhwb3J0IGNsYXNzIFRhZ0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAgZWRpdE1vZGU6IGJvb2xlYW47XHJcblxyXG4gIG9yaWdpbmFsTmFtZTogc3RyaW5nO1xyXG4gIHNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgZmlsbGVyTGlzdDogc3RyaW5nW107XHJcblxyXG4gIEBPdXRwdXQoXCJvbmZvY3VzXCIpXHJcbiAgb25mb2N1cz0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmNoYW5nZVwiKVxyXG4gIG9uY2hhbmdlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uc2VsZWN0XCIpXHJcbiAgb25zZWxlY3Q9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25yZW1vdmVcIilcclxuICBvbnJlbW92ZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmFkZFwiKVxyXG4gIG9uYWRkPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uZHJvcFwiKVxyXG4gIG9uZHJvcD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBJbnB1dChcImZvcm1hdFwiKVxyXG4gIGZvcm1hdDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJyZW1vdmFibGVcIilcclxuICByZW1vdmFibGU6IGJvb2xlYW47XHJcblxyXG4gIEBJbnB1dChcIm1heGxlbmd0aFwiKVxyXG4gIG1heGxlbmd0aDogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJuYW1lXCIpXHJcbiAgbmFtZTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJwbGFjZWhvbGRlclwiKVxyXG4gIHBsYWNlaG9sZGVyOiBib29sZWFuO1xyXG5cclxuICBASW5wdXQoXCJwYXJlbnRcIilcclxuICBwYXJlbnQ6IGFueTtcclxuXHJcbiAgQElucHV0KFwiYXV0b2NvbXBsZXRlXCIpXHJcbiAgYXV0b2NvbXBsZXRlOiBzdHJpbmdbXTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0aW9ucG9saWN5XCIpXHJcbiAgc2VsZWN0aW9ucG9saWN5OiBTZWxlY3Rpb25wb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImVkaXRwb2xpY3lcIilcclxuICBlZGl0cG9saWN5OiBFZGl0UG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJkcmFncG9saWN5XCIpXHJcbiAgZHJhZ3BvbGljeTogRHJhZ0Ryb3BQb2xpY3k7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJlZGl0b3JcIilcclxuICBlZGl0b3I7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJzZWxlY3RvclwiKVxyXG4gIHNlbGVjdG9yO1xyXG5cclxuICBAVmlld0NoaWxkKFwiaG9sZGVyXCIpXHJcbiAgaG9sZGVyO1xyXG5cclxuICBAVmlld0NoaWxkKFwiZmlsbGVyXCIpXHJcbiAgZmlsbGVyO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgZGF0YVRyYW5zZmVyOiBUYWdUcmFuc2ZlcixcclxuICAgIHByaXZhdGUgaW50bzogSW5Ub1BpcGUsXHJcbiAgICBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIFxyXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXJcclxuICApe1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmluaXQoKTtcclxuICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5kcmFnZ2FibGUgPSAodGhpcy5kcmFncG9saWN5ICE9PSBEcmFnRHJvcFBvbGljeS5kaXNhYmxlZCk7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdkcmFnc3RhcnQnLCBbJyRldmVudCddKSBcclxuICBkcmFnU3RhcnQoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICBpZiAodGhpcy5hbGxvd0RyYWcoKSkge1xyXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwic291cmNlXCIsdGhpcy5uYW1lKTsgLy8gdGhpcyBpcyBuZWVkZWQgdG8gZ2V0IHRoZSBkYXJnL2Ryb3AgZ29pbmcuLlxyXG4gICAgICAgIHRoaXMuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzKTsgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBldmVudCBkYXRhIHRyYW5zZmVyIHRha2VzIHN0cmluZyBub3QgYmplY3RcclxuICAgICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcmFnJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZyhldmVudDogYW55KSB7fVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbmQnLCBbJyRldmVudCddKSBcclxuICBkcmFnRW5kKGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuXHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcm9wJywgWyckZXZlbnQnXSlcclxuICBkcm9wKGV2ZW50OiBhbnkpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgIHRoaXMub25kcm9wLmVtaXQoe1xyXG4gICAgICBzb3VyY2U6IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIiksXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB0aGlzXHJcbiAgICB9KVxyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnRW50ZXIoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2xlYXZlJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0xlYXZlKGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICBcclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdvdmVyJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ092ZXIoZXZlbnQ6IGFueSkge1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGFsbG93RHJvcChldmVudDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIik7XHJcbiAgICAgIGNvbnN0IGFsbG93ID0gKHNvdXJjZSAmJiBzb3VyY2UubmFtZSAhPSB0aGlzLm5hbWUpICYmIFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDApICYmXHJcbiAgICAgICAgICAgICAgICAgICAgKCghc291cmNlLmZvcm1hdCAmJiAhdGhpcy5mb3JtYXQpIHx8IHNvdXJjZS5mb3JtYXQgPT0gdGhpcy5mb3JtYXQpO1xyXG4gICAgICByZXR1cm4gYWxsb3c7XHJcbiAgfVxyXG5cclxuICBhbGxvd0RyYWcoKSA6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKSAmJiB0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDA7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pIFxyXG4gIGtleXVwKGV2ZW50OiBhbnkpIHtcclxuICAgIGlmIChldmVudC50YXJnZXQgPT09IHRoaXMuZWwubmF0aXZlRWxlbWVudCB8fFxyXG4gICAgICAgKHRoaXMuZWRpdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudCkpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLmNsaWNrKGV2ZW50KVxyXG4gICAgICB9ZWxzZSBpZiAoY29kZSA9PT0gOSAmJiB0aGlzLmVkaXRNb2RlKSB7IC8vIHRhYiBvdXRcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUubGVuZ3RoICYmIHRoaXMub3JpZ2luYWxOYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDY2KTtcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDM4KSB7IC8vIGFycm93IHVwXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXItLTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSB0aGlzLmZpbGxlckxpc3QubGVuZ3RoIC0gMTtcclxuICAgICAgICAgIH0gICAgICAgICBcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gNDApIHsgLy8gYXJyb3cgZG93blxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAodGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDEpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIrKztcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgIH0gICBcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSAgaWYgKHRoaXMuaG9sZGVyICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5ob2xkZXIubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMuZWRpdE1vZGUgPSB0cnVlO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PnRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSwzMyk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5yZW1vdmUoKTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignY2xpY2snLCBbJyRldmVudCddKSBcclxuICBjbGljayhldmVudDogRXZlbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0VkaXRhYmxlKCkpIHtcclxuICAgICAgdGhpcy5lZGl0TW9kZSA9ICF0aGlzLmVkaXRNb2RlO1xyXG4gICAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5maWxsZXIubmF0aXZlRWxlbWVudCwgXCJvZmZcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSw2Nik7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSB9LDY2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdmb2N1cycsIFsnJGV2ZW50J10pIFxyXG4gIGZvY3VzKGV2ZW50OiBhbnkpIHtcclxuICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25mb2N1cy5lbWl0KHRoaXMpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpc1JlbW92YWJsZSgpIHtcclxuICAgIGxldCBjYW5SZW1vdmUgPSAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZEFuZFJlbW92ZSk7XHJcblxyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkUmVtb3ZlTW9kaWZ5KTtcclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LnJlbW92ZU9ubHkpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIGlzRWRpdGFibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkUmVtb3ZlTW9kaWZ5KTtcclxuICB9XHJcblxyXG4gIGlzRHJhZ2dhYmxlKCkge1xyXG4gICAgcmV0dXJuICAodGhpcy5kcmFncG9saWN5ICE9PSBEcmFnRHJvcFBvbGljeS5kaXNhYmxlZCk7XHJcbiAgfVxyXG5cclxuICBpc1NlbGVjdGFibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLnNlbGVjdGlvbnBvbGljeSAhPT0gU2VsZWN0aW9ucG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcbiAgc2VsZWN0KCkge1xyXG4gICAgXHJcbiAgfVxyXG5cclxuICB0YWJvdXQoZXZlbnQ6IGFueSkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAwID8gZXZlbnQudGFyZ2V0LnZhbHVlIDogdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGggJiYgdGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sIDY2KVxyXG4gIH1cclxuICBlZGl0KGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMubmFtZSA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlRmlsbGVyTGlzdCh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlICYmIHRoaXMuYXV0b2NvbXBsZXRlIGluc3RhbmNlb2YgQXJyYXkpe1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICB0aGlzLmZpbGxlckxpc3QgPSB0aGlzLmF1dG9jb21wbGV0ZS5maWx0ZXIoKGl0ZW0pID0+IGl0ZW0uaW5kZXhPZih2YWx1ZSkgPj0gMCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLm9yaWdpbmFsTmFtZSA9IHRoaXMubmFtZTtcclxuICB9XHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLm5hbWUgPSB0aGlzLm9yaWdpbmFsTmFtZTtcclxuICB9XHJcblxyXG4gIHJlbW92ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkpIHtcclxuICAgICAgdGhpcy5vbnJlbW92ZS5lbWl0KHRoaXMpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZm9ybWF0dGVkTmFtZSgpIHtcclxuICAgIGxldCByZXN1bHQgPSB0aGlzLm5hbWU7XHJcbiAgICBpZiAodGhpcy5mb3JtYXQpIHtcclxuICAgICAgcmVzdWx0ID0gdGhpcy5pbnRvLnRyYW5zZm9ybSh0aGlzLm5hbWUsIHRoaXMuZm9ybWF0KTtcclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbnRvUGlwZU1vZHVsZSB9IGZyb20gJ0BzZWRlaC9pbnRvLXBpcGVzJztcclxuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuXHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFnQm94Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZ2JveC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWdUcmFuc2ZlciB9IGZyb20gJy4vY29tcG9uZW50cy90YWcudHJhbnNmZXInO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBJbnRvUGlwZU1vZHVsZSxcclxuICAgIERyYWdEcm9wTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFRhZ0JveENvbXBvbmVudCxcclxuICAgIFRhZ0NvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgVGFnQm94Q29tcG9uZW50XHJcbiAgXSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgVGFnVHJhbnNmZXJcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhZ0JveE1vZHVsZSB7fVxyXG4iXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwiQ29tcG9uZW50IiwiUmVuZGVyZXIiLCJFbGVtZW50UmVmIiwiT3V0cHV0IiwiSW5wdXQiLCJJbmplY3RhYmxlIiwiSW5Ub1BpcGUiLCJWaWV3Q2hpbGQiLCJIb3N0TGlzdGVuZXIiLCJOZ01vZHVsZSIsIkNvbW1vbk1vZHVsZSIsIkludG9QaXBlTW9kdWxlIiwiRHJhZ0Ryb3BNb2R1bGUiLCJDVVNUT01fRUxFTUVOVFNfU0NIRU1BIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7UUFFRSxXQUFZO1FBQ1osZUFBZ0I7UUFDaEIsZ0JBQWlCO1FBQ2pCLGFBQWM7O2tDQUhkLFFBQVE7a0NBQ1IsWUFBWTtrQ0FDWixhQUFhO2tDQUNiLFVBQVU7OztRQUdWLFdBQVk7UUFDWixVQUFXO1FBQ1gsYUFBYztRQUNkLGVBQWdCO1FBQ2hCLGtCQUFtQjs7MEJBSm5CLFFBQVE7MEJBQ1IsT0FBTzswQkFDUCxVQUFVOzBCQUNWLFlBQVk7MEJBQ1osZUFBZTs7O1FBR2YsV0FBWTtRQUNaLGNBQWU7UUFDZixlQUFnQjs7b0NBRmhCLFFBQVE7b0NBQ1IsV0FBVztvQ0FDWCxZQUFZOzs7Ozs7QUNiZDtRQXlGRSx5QkFBb0IsUUFBa0IsRUFBVSxFQUFjO1lBQTFDLGFBQVEsR0FBUixRQUFRLENBQVU7WUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFZO3lCQTdENUMsRUFBRTtrQ0FDTyxFQUFFOzRCQUduQixJQUFJQSxpQkFBWSxFQUFFOzJCQUduQixJQUFJQSxpQkFBWSxFQUFFOzRCQUdqQixJQUFJQSxpQkFBWSxFQUFFO2dDQUdiLFVBQUMsS0FBSyxJQUFLLE9BQUEsSUFBSSxHQUFBOytCQU1SLFNBQVM7U0E0QzlCOzs7O1FBRUQsa0NBQVE7OztZQUFSO2dCQUFBLGlCQW9CQztnQkFuQkMsSUFBSSxJQUFJLENBQUMsYUFBYTtxQkFDakIsSUFBSSxDQUFDLGFBQWEsWUFBWSxNQUFNLENBQUM7cUJBQ3JDLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxZQUFZLE1BQU0sQ0FBQyxDQUFDLEVBQUU7O29CQUNqRCxJQUFNLENBQUMsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDOztvQkFDN0MsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FB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