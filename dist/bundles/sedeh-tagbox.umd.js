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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VkZWgtdGFnYm94LnVtZC5qcy5tYXAiLCJzb3VyY2VzIjpbIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzLnRzIiwibmc6Ly9Ac2VkZWgvdGFnYm94L3NyYy9hcHAvdGFnYm94L2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudC50cyIsIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy50cmFuc2Zlci50cyIsIm5nOi8vQHNlZGVoL3RhZ2JveC9zcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy5jb21wb25lbnQudHMiLCJuZzovL0BzZWRlaC90YWdib3gvc3JjL2FwcC90YWdib3gvdGFnYm94Lm1vZHVsZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcclxuZXhwb3J0IGVudW0gRHJhZ0Ryb3BQb2xpY3kge1xyXG4gIGRpc2FibGVkID0gMSxcclxuICBhcHBlbmRPbkRyb3AgPSAyLFxyXG4gIHByZXBlbmRPbkRyb3AgPSAzLFxyXG4gIHN3YXBPbkRyb3AgPSA0XHJcbn1cclxuZXhwb3J0IGVudW0gRWRpdFBvbGljeSB7XHJcbiAgdmlld09ubHkgPSAxLFxyXG4gIGFkZE9ubHkgPSAyLFxyXG4gIHJlbW92ZU9ubHkgPSA0LFxyXG4gIGFkZEFuZFJlbW92ZSA9IDZcclxufVxyXG5leHBvcnQgZW51bSBTZWxlY3Rpb25wb2xpY3kge1xyXG4gIGRpc2FibGVkID0gMSxcclxuICBtdWx0aVNlbGVjdCA9IDIsXHJcbiAgc2luZ2xlU2VsZWN0ID0gM1xyXG59XHJcbiIsIi8qXHJcbiAqIENvbXBhcmlzaW9uIFRvb2wgd2lsbCBsYXlvdXQgdHdvIGNvbXBhcmlzaW9uIHRyZWVzIHNpZGUgYnkgc2lkZSBhbmQgZmVlZCB0aGVtIGFuIGludGVybmFsIG9iamVjdFxyXG4gKiBoZWlyYXJjaHkgY3JlYXRlZCBmb3IgaW50ZXJuYWwgdXNlIGZyb20gSlNPTiBvYmplY3RzIGdpdmVuIHRvIHRoaXMgY29tcG9uZW50LlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgRXZlbnRFbWl0dGVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vdGFnLmNvbXBvbmVudCc7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICAvLyBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICBzZWxlY3RvcjogJ3RhZ2JveCcsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZ2JveC5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnYm94LmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdCb3hDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XHJcblxyXG4gIF90YWdzOiBzdHJpbmdbXSA9IFtdO1xyXG4gIF9zZWxlY3RlZGluZGV4OiBudW1iZXJbXSA9IFtdO1xyXG4gIFxyXG4gIEBPdXRwdXQoXCJvbmNoYW5nZVwiKVxyXG4gIG9uY2hhbmdlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uZXJyb3JcIilcclxuICBvbmVycm9yPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uc2VsZWN0XCIpXHJcbiAgb25zZWxlY3Q9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoXCJiZWZvcmVBY3Rpb25cIilcclxuICBiZWZvcmVBY3Rpb24gPSAoZXZlbnQpID0+IHRydWU7XHJcblxyXG4gIEBJbnB1dChcImlkXCIpXHJcbiAgaWQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicGxhY2Vob2xkZXJcIilcclxuICBwbGFjZWhvbGRlcjogc3RyaW5nID0gXCJBZGQgVGFnXCI7XHJcbiAgXHJcbiAgQElucHV0KFwibWF4Ym94bGVuZ3RoXCIpXHJcbiAgbWF4Ym94bGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gIEBJbnB1dChcIm1heHRhZ2xlbmd0aFwiKVxyXG4gIG1heHRhZ2xlbmd0aDogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtYXh0YWdzXCIpXHJcbiAgbWF4dGFnczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJtaW50YWdzXCIpXHJcbiAgbWludGFnczogbnVtYmVyO1xyXG5cclxuICBASW5wdXQoXCJmb3JtQ29udHJvbGxlclwiKVxyXG4gIGZvcm1Db250cm9sbGVyOiBIVE1MRWxlbWVudDtcclxuXHJcbiAgQElucHV0KFwidGFnc1wiKVxyXG4gIHRhZ3M6IGFueTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0ZWRpbmRleFwiKVxyXG4gIHNlbGVjdGVkaW5kZXg6IGFueTtcclxuXHJcbiAgQElucHV0KFwiZGVsaW5lYXRlYnlcIilcclxuICBkZWxpbmVhdGVieTogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoXCJmb3JtYXRcIilcclxuICBmb3JtYXQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwiYXV0b2NvbXBsZXRlXCIpXHJcbiAgYXV0b2NvbXBsZXRlOiBzdHJpbmdbXTtcclxuXHJcbiAgQElucHV0KFwic2VsZWN0aW9ucG9saWN5XCIpXHJcbiAgc2VsZWN0aW9ucG9saWN5OiBTZWxlY3Rpb25wb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImVkaXRwb2xpY3lcIilcclxuICBlZGl0cG9saWN5OiBFZGl0UG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJkcmFncG9saWN5XCIpXHJcbiAgZHJhZ3BvbGljeTogRHJhZ0Ryb3BQb2xpY3k7XHJcblxyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlciwgcHJpdmF0ZSBlbDogRWxlbWVudFJlZikge1xyXG5cdCAgXHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdGVkaW5kZXggJiYgXHJcbiAgICAgICAgKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIFN0cmluZykgJiYgXHJcbiAgICAgICAgKHRoaXMudGFncyAmJiAhKHRoaXMudGFncyBpbnN0YW5jZW9mIFN0cmluZykpKSB7XHJcbiAgICAgIGNvbnN0IHg6IHN0cmluZyA9IFN0cmluZyh0aGlzLnNlbGVjdGVkaW5kZXgpO1xyXG4gICAgICBjb25zdCBsaXN0ID0geC5zcGxpdChcIixcIik7XHJcbiAgICAgIGxpc3QubWFwKCh0KSA9PiB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5wdXNoKHBhcnNlSW50KHQpKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gdGhpcy5zZWxlY3RlZGluZGV4ID8gdGhpcy5zZWxlY3RlZGluZGV4IDogW107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMudGFncyAmJiAhKHRoaXMudGFncyBpbnN0YW5jZW9mIEFycmF5KSkge1xyXG4gICAgICBjb25zdCB4OiBzdHJpbmcgPSBTdHJpbmcodGhpcy50YWdzKTtcclxuICAgICAgdGhpcy5fdGFncyA9IHguc3BsaXQodGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl90YWdzID0gdGhpcy50YWdzID8gdGhpcy50YWdzIDogW107XHJcbiAgICB9XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRBdHRyaWJ1dGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LFwicm9sZVwiLFwibGlzdFwiKTtcclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXMpIHtcclxuXHJcbiAgfVxyXG5cclxuICBpdGVtU2VsZWN0ZWRBdChpbmRleCkge1xyXG4gICAgY29uc3QgY2FuU2VsZWN0ID0gdGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZDtcclxuICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpIDwgMCA/IGZhbHNlIDogY2FuU2VsZWN0O1xyXG4gIH1cclxuXHJcbiAgaXRlbVNlbGVjdGlvbkNsYXNzKGluZGV4KSB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuaXRlbVNlbGVjdGVkQXQoaW5kZXgpO1xyXG4gICAgcmV0dXJuIHNlbGVjdGVkID8gXCJzZWxlY3RlZFwiIDogKChpbmRleCA8IDAgfHwgdGhpcy5zZWxlY3Rpb25wb2xpY3kgPT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkgPyBcImxlZnQtcGFkZGVkXCIgOiBcIlwiKTtcclxuICB9XHJcblxyXG4gIGlzUmVtb3ZhYmxlKCkge1xyXG4gICAgbGV0IGNhblJlbW92ZSA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5yZW1vdmVPbmx5KTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgJiYgKCF0aGlzLm1pbnRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoID4gdGhpcy5taW50YWdzKSk7XHJcblxyXG4gICAgaWYgKCFjYW5SZW1vdmUpIHtcclxuICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gcmVtb3ZlIHRhZy4gT3BlcmF0aW9uIGlzIG5vdCBhbGxvd2VkLlwiKTtcclxuICAgIH1cclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpc0R1cGxpY2F0ZShuYW1lKSB7XHJcbiAgICBjb25zdCBmbGFnID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpIDwgMCA/IGZhbHNlIDogdHJ1ZTtcclxuICAgIGlmIChmbGFnKSB7XHJcbiAgICAgIHRoaXMub25lcnJvci5lbWl0KFwiVW5hYmxlIHRvIHBlcmZvcm0gb3BlcmF0aW9uLiBSZXN1bHRpbmcgZHVwbGljYXRlIHRhZ3MgaXMgbm90IGFsbG93ZWQuXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZsYWc7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFsbG93ZWRUb2FkZEl0ZW0obmFtZSkge1xyXG4gICAgbGV0IGNhbkFkZCA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRPbmx5KTtcclxuXHJcbiAgICBjYW5BZGQgPSBjYW5BZGQgJiYgKCF0aGlzLm1heHRhZ3MgfHwgKHRoaXMuX3RhZ3MubGVuZ3RoIDwgdGhpcy5tYXh0YWdzKSk7XHJcblxyXG4gICAgY2FuQWRkID0gY2FuQWRkICYmICF0aGlzLmlzRHVwbGljYXRlKG5hbWUpO1xyXG5cclxuICAgIGlmIChjYW5BZGQgJiYgdGhpcy5tYXh0YWdsZW5ndGgpIHtcclxuICAgICAgY29uc3QgeCA9IHRoaXMuX3RhZ3Muam9pbiggdGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICAgIGlmICh4Lmxlbmd0aCtuYW1lLmxlbmd0aCsxID49IHRoaXMubWF4Ym94bGVuZ3RoKSB7XHJcbiAgICAgICAgY2FuQWRkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5vbmVycm9yLmVtaXQoXCJVbmFibGUgdG8gYWRkIHRhZy4gUmVzdWx0aW5nIGNvbnRlbnQgd2lsbCBleGNlZWQgbWF4dGFnbGVuZ3RoLlwiKTtcclxuICAgICAgfVxyXG4gICAgfSAgICBcclxuICAgIHJldHVybiAgY2FuQWRkO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBub3RpZnlDaGFuZ2UoKSB7XHJcbiAgICB0aGlzLnRhZ3MgPSAodGhpcy50YWdzIGluc3RhbmNlb2YgQXJyYXkpID8gdGhpcy5fdGFncyA6IHRoaXMuX3RhZ3Muam9pbiggdGhpcy5kZWxpbmVhdGVieSA/IHRoaXMuZGVsaW5lYXRlYnkgOiBcIixcIik7XHJcbiAgICB0aGlzLnNlbGVjdGVkaW5kZXggPSAhKHRoaXMuc2VsZWN0ZWRpbmRleCBpbnN0YW5jZW9mIEFycmF5KSA/IFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAodGhpcy5fc2VsZWN0ZWRpbmRleC5sZW5ndGggPyB0aGlzLl9zZWxlY3RlZGluZGV4LmpvaW4oXCIsXCIpIDogXCJcIik7XHJcbiAgICB0aGlzLm9uY2hhbmdlLmVtaXQoe1xyXG4gICAgICBpZDogdGhpcy5pZCxcclxuICAgICAgdGFnczogdGhpcy50YWdzLFxyXG4gICAgICBzZWxlY2VkSW5kZXg6IHRoaXMuc2VsZWN0ZWRpbmRleCxcclxuICAgICAgZm9ybUNvbnRyb2xsZXI6IHRoaXMuZm9ybUNvbnRyb2xsZXJcclxuICAgIH0pO1xyXG4gIH1cclxuICBwcml2YXRlIG5vdGlmeVNlbGVjdGlvbigpIHtcclxuICAgIHRoaXMuc2VsZWN0ZWRpbmRleCA9ICEodGhpcy5zZWxlY3RlZGluZGV4IGluc3RhbmNlb2YgQXJyYXkpID8gXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggOiBcclxuICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMuX3NlbGVjdGVkaW5kZXgubGVuZ3RoID8gdGhpcy5fc2VsZWN0ZWRpbmRleC5qb2luKFwiLFwiKSA6IFwiXCIpO1xyXG4gICAgdGhpcy5vbnNlbGVjdC5lbWl0KHtcclxuICAgICAgaWQ6IHRoaXMuaWQsXHJcbiAgICAgIHNlbGVjZWRJbmRleDogdGhpcy5zZWxlY3RlZGluZGV4LFxyXG4gICAgICBmb3JtQ29udHJvbGxlcjogdGhpcy5mb3JtQ29udHJvbGxlclxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIHByaXZhdGUgY3JlYXRlRHJvcFJlcXVlc3QoYWN0aW9uLCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICByZXF1ZXN0OiBcImRyb3BcIixcclxuICAgICAgYWN0aW9uOiBhY3Rpb24sXHJcbiAgICAgIHNvdXJjZToge1xyXG4gICAgICAgIGlkOiBzb3VyY2UucGFyZW50LmlkLFxyXG4gICAgICAgIG5hbWU6IHNvdXJjZS5uYW1lXHJcbiAgICAgIH0sXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB7XHJcbiAgICAgICAgaWQ6IGRlc3RpbmF0aW9uLnBhcmVudC5pZCxcclxuICAgICAgICBuYW1lOiBkZXN0aW5hdGlvbi5uYW1lXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBwcmVwZW5kVGFnQXQoaW5kZXgsIHNvdXJjZSwgZGVzdGluYXRpb24pIHtcclxuICAgIGxldCByZXN1bHQgPSBmYWxzZTtcclxuICAgIGNvbnN0IG5ld05hbWUgPSBzb3VyY2UubmFtZSAgKyBcIiBcIiArIHRoaXMuX3RhZ3NbaW5kZXhdO1xyXG4gICAgaWYgKCF0aGlzLm1heHRhZ2xlbmd0aCB8fCAgKHRoaXMubWF4dGFnbGVuZ3RoICYmIHNvdXJjZS5uYW1lLmxlbmd0aCA8PSB0aGlzLm1heHRhZ2xlbmd0aCkpIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJwcmVwZW5kXCIsIHNvdXJjZSwgZGVzdGluYXRpb24pKSkge1xyXG4gICAgICAgIHRoaXMuX3RhZ3NbaW5kZXhdID0gbmV3TmFtZTtcclxuICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBwcml2YXRlIGFwcGVuZFRhZ0F0KGluZGV4LCBzb3VyY2UsIGRlc3RpbmF0aW9uKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICBjb25zdCBuZXdOYW1lID0gdGhpcy5fdGFnc1tpbmRleF0gKyBcIiBcIiArIHNvdXJjZS5uYW1lO1xyXG4gICAgaWYgKCF0aGlzLm1heHRhZ2xlbmd0aCB8fCAgKHRoaXMubWF4dGFnbGVuZ3RoICYmIHNvdXJjZS5uYW1lLmxlbmd0aCA8PSB0aGlzLm1heHRhZ2xlbmd0aCkpIHtcclxuICAgICAgaWYgKHRoaXMuYmVmb3JlQWN0aW9uKHRoaXMuY3JlYXRlRHJvcFJlcXVlc3QoXCJhcHBlbmRcIiwgc291cmNlLCBkZXN0aW5hdGlvbikpKSB7XHJcbiAgICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBuZXdOYW1lO1xyXG4gICAgICAgIHJlc3VsdCA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG4gIHJlbW92ZVRhZ1dpdGhOYW1lKG5hbWUpIHtcclxuICAgIGlmICh0aGlzLmlzUmVtb3ZhYmxlKCkgJiYgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJyZW1vdmVcIiwgaXRlbTogbmFtZX0pKSB7XHJcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fdGFncy5pbmRleE9mKG5hbWUpO1xyXG4gICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuXHJcbiAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKGluZGV4LDEpO1xyXG4gICAgICBpZiAoaSA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGFkZFRhZ1dpdGhOYW1lKG5hbWUpIHtcclxuICAgIGxldCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihuYW1lKTtcclxuICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gICAgXHJcbiAgICBpZiAoaW5kZXggPCAwICAmJiBcclxuICAgICAgICBuYW1lLmxlbmd0aCAmJiBcclxuICAgICAgICB0aGlzLmFsbG93ZWRUb2FkZEl0ZW0obmFtZSkgJiYgXHJcbiAgICAgICAgdGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJhZGRcIiwgaXRlbTogbmFtZX0pKSB7XHJcbiAgICAgIHRoaXMuX3RhZ3MucHVzaChuYW1lKTtcclxuICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uVGFnUmVtb3ZlKGV2ZW50OiBUYWdDb21wb25lbnQpIHtcclxuICAgIHRoaXMucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQubmFtZSk7XHJcbiAgfVxyXG5cclxuICBvblRhZ0FkZChldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5hZGRUYWdXaXRoTmFtZShldmVudC5uYW1lKSkge1xyXG4gICAgICBldmVudC5uYW1lID0gXCJcIjtcclxuICAgICAgZXZlbnQuY2xpY2sobnVsbCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudC5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25UYWdDaGFuZ2UoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKCF0aGlzLmlzRHVwbGljYXRlKGV2ZW50Lm5hbWUpICYmIHRoaXMuYmVmb3JlQWN0aW9uKHtyZXF1ZXN0OlwiY2hhbmdlXCIsIGl0ZW06IGV2ZW50Lm9yaWdpbmFsTmFtZSwgdG86IGV2ZW50Lm5hbWV9KSkge1xyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5vcmlnaW5hbE5hbWUpO1xyXG4gICAgICBcclxuICAgICAgdGhpcy5fdGFnc1tpbmRleF0gPSBldmVudC5uYW1lO1xyXG4gICAgICBldmVudC5pbml0KCk7XHJcbiAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBldmVudC5yZXNldCgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgb25UYWdEcm9wKGV2ZW50KSB7XHJcbiAgICBjb25zdCBzaW5kID0gdGhpcy5fdGFncy5pbmRleE9mKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgIGNvbnN0IGRpbmQgPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQuZGVzdGluYXRpb24ubmFtZSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZHJhZ3BvbGljeSA9PT0gRHJhZ0Ryb3BQb2xpY3kuYXBwZW5kT25Ecm9wKSB7XHJcbiAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5hcHBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgY29uc3QgaSA9IHRoaXMuX3NlbGVjdGVkaW5kZXguaW5kZXhPZihzaW5kKTtcclxuICAgICAgICAgIHRoaXMuX3RhZ3Muc3BsaWNlKHNpbmQsMSk7XHJcbiAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgICBldmVudC5zb3VyY2UucGFyZW50LnJlbW92ZVRhZ1dpdGhOYW1lKGV2ZW50LnNvdXJjZS5uYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5wcmVwZW5kT25Ecm9wKSB7XHJcbiAgICAgIGlmIChldmVudC5zb3VyY2UucGFyZW50LmlkID09PSBldmVudC5kZXN0aW5hdGlvbi5wYXJlbnQuaWQpIHtcclxuICAgICAgICBpZiAodGhpcy5wcmVwZW5kVGFnQXQoZGluZCwgZXZlbnQuc291cmNlLCBldmVudC5kZXN0aW5hdGlvbikpIHtcclxuICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2Yoc2luZCk7XHJcbiAgICAgICAgICB0aGlzLl90YWdzLnNwbGljZShzaW5kLDEpO1xyXG4gICAgICAgICAgdGhpcy5fc2VsZWN0ZWRpbmRleC5zcGxpY2UoaSwxKTtcclxuICAgICAgICAgIHRoaXMubm90aWZ5Q2hhbmdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLnByZXBlbmRUYWdBdChkaW5kLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkge1xyXG4gICAgICAgICAgdGhpcy5ub3RpZnlDaGFuZ2UoKTtcclxuICAgICAgICAgIGV2ZW50LnNvdXJjZS5wYXJlbnQucmVtb3ZlVGFnV2l0aE5hbWUoZXZlbnQuc291cmNlLm5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBpZiAodGhpcy5kcmFncG9saWN5ID09PSBEcmFnRHJvcFBvbGljeS5zd2FwT25Ecm9wKSB7XHJcbiAgICAgIGlmICh0aGlzLmJlZm9yZUFjdGlvbih0aGlzLmNyZWF0ZURyb3BSZXF1ZXN0KFwic3dhcFwiLCBldmVudC5zb3VyY2UsIGV2ZW50LmRlc3RpbmF0aW9uKSkpIHtcclxuICAgICAgICBpZiAoZXZlbnQuc291cmNlLnBhcmVudC5pZCA9PT0gZXZlbnQuZGVzdGluYXRpb24ucGFyZW50LmlkKSB7XHJcbiAgICAgICAgICB0aGlzLl90YWdzW3NpbmRdID0gdGhpcy5fdGFncy5zcGxpY2UoZGluZCwgMSwgdGhpcy5fdGFnc1tzaW5kXSlbMF07XHJcbiAgICAgICAgICB0aGlzLm5vdGlmeUNoYW5nZSgpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5hZGRUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5kZXN0aW5hdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgZXZlbnQuc291cmNlLnBhcmVudC5yZW1vdmVUYWdXaXRoTmFtZShldmVudC5zb3VyY2UubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IFxyXG4gIH1cclxuICBvblRhZ1NlbGVjdChldmVudDogVGFnQ29tcG9uZW50KSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCkge1xyXG4gICAgICB0aGlzLm9uVGFnRm9jdXMoZXZlbnQpO1xyXG4gICAgICBpZiAodGhpcy5iZWZvcmVBY3Rpb24oe3JlcXVlc3Q6XCJzZWxlY3RcIiwgaXRlbTogZXZlbnQubmFtZX0pKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ID09PSBTZWxlY3Rpb25wb2xpY3kuc2luZ2xlU2VsZWN0KSB7XHJcbiAgICAgICAgICBjb25zdCBsaXN0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkTm9kZXM7XHJcbiAgICAgICAgICBmb3IobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgICAgICAvLyAzIGlzIHRleHQgYW5kIDggaXMgY29tbWVudFxyXG4gICAgICAgICAgICBpZiAobGlzdFtpXS5ub2RlVHlwZSAhPT0gMyAmJiBsaXN0W2ldLm5vZGVUeXBlICE9PSA4KSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MobGlzdFtpXSwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl90YWdzLmluZGV4T2YoZXZlbnQubmFtZSk7XHJcbiAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xyXG4gICAgICAgICAgICBjb25zdCBpID0gdGhpcy5fc2VsZWN0ZWRpbmRleC5pbmRleE9mKGluZGV4KTtcclxuICBcclxuICAgICAgICAgICAgaWYgKGkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCB0cnVlKTtcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4ID0gW2luZGV4XTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIGZhbHNlKVxyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXggPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICBcclxuICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGkgPSB0aGlzLl9zZWxlY3RlZGluZGV4LmluZGV4T2YoaW5kZXgpO1xyXG4gIFxyXG4gICAgICAgICAgICBpZiAoaSA8IDApIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcInNlbGVjdGVkXCIsIHRydWUpO1xyXG4gICAgICAgICAgICAgIHRoaXMuX3NlbGVjdGVkaW5kZXgucHVzaChpbmRleCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MoZXZlbnQuZWwubmF0aXZlRWxlbWVudCwgXCJzZWxlY3RlZFwiLCBmYWxzZSlcclxuICAgICAgICAgICAgICB0aGlzLl9zZWxlY3RlZGluZGV4LnNwbGljZShpLDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5U2VsZWN0aW9uKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIG9uVGFnRm9jdXMoZXZlbnQ6IFRhZ0NvbXBvbmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpIHtcclxuICAgICAgY29uc3QgbGlzdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZE5vZGVzO1xyXG4gICAgICBmb3IobGV0IGk9MDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspe1xyXG4gICAgICAgIC8vIDMgaXMgdGV4dCBhbmQgOCBpcyBjb21tZW50XHJcbiAgICAgICAgaWYgKGxpc3RbaV0ubm9kZVR5cGUgIT09IDMgJiYgbGlzdFtpXS5ub2RlVHlwZSAhPT0gOCkge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3MobGlzdFtpXSwgXCJmb2N1c2VkXCIsIGZhbHNlKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuX3RhZ3MuaW5kZXhPZihldmVudC5uYW1lKTtcclxuICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyhldmVudC5lbC5uYXRpdmVFbGVtZW50LCBcImZvY3VzZWRcIiwgdHJ1ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuIiwiaW1wb3J0IHsgSW5qZWN0YWJsZSwgSW5qZWN0ICB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVGFnVHJhbnNmZXIge1xyXG4gICAgXHJcbiAgICBwcml2YXRlIGRhdGE6IGFueSA9IHt9O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge31cclxuXHJcbiAgICBzZXREYXRhKG5hbWUsIHZhbHVlKXtcclxuICAgICAgICB0aGlzLmRhdGFbbmFtZV0gPSB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXREYXRhKG5hbWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW25hbWVdO1xyXG4gICAgfVxyXG4gICAgICAgICAgICBcclxufSIsIi8qXHJcbiAqIEEgY29tcGFyaXNpb24gdHJlZSB3aWxsIGxheW91dCBlYWNoIGF0dHJpYnV0ZSBvZiBhIGpzb24gZGVlcCB0aHJvdWdoIGl0cyBoZWlyYXJjaHkgd2l0aCBnaXZlbiB2aXN1YWwgcXVldWVzXHJcbiAqIHRoYXQgcmVwcmVzZW50cyBhIGRlbGV0aW9uLCBhZGl0aW9uLCBvciBjaGFuZ2Ugb2YgYXR0cmlidXRlIGZyb20gdGhlIG90aGVyIHRyZWUuIFRoZSBzdGF0dXMgb2YgZWFjaCBub2RlIGlzIFxyXG4gKiBldmFsdWF0ZWQgYnkgdGhlIHBhcmVudCBjb21wYXJpc2lvbiB0b29sLlxyXG4gKi9cclxuaW1wb3J0IHtcclxuICBDb21wb25lbnQsXHJcbiAgT25Jbml0LFxyXG4gIElucHV0LFxyXG4gIE91dHB1dCxcclxuICBIb3N0TGlzdGVuZXIsXHJcbiAgRWxlbWVudFJlZixcclxuICBSZW5kZXJlcixcclxuICBWaWV3Q2hpbGQsXHJcbiAgRXZlbnRFbWl0dGVyXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBJblRvUGlwZSB9IGZyb20gJ0BzZWRlaC9pbnRvLXBpcGVzJztcclxuXHJcbmltcG9ydCB7XHJcbiAgRHJhZ0Ryb3BQb2xpY3ksXHJcbiAgU2VsZWN0aW9ucG9saWN5LFxyXG4gIEVkaXRQb2xpY3lcclxufSBmcm9tICcuLi9pbnRlcmZhY2VzL3RhZ2JveC5pbnRlcmZhY2VzJztcclxuXHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi90YWcudHJhbnNmZXInO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICd0YWcnLFxyXG4gIHRlbXBsYXRlVXJsOiAnLi90YWcuY29tcG9uZW50Lmh0bWwnLFxyXG4gIHN0eWxlVXJsczogWycuL3RhZy5jb21wb25lbnQuc2NzcyddLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGFnQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcclxuICBlZGl0TW9kZTogYm9vbGVhbjtcclxuXHJcbiAgb3JpZ2luYWxOYW1lOiBzdHJpbmc7XHJcbiAgc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICBmaWxsZXJMaXN0OiBzdHJpbmdbXTtcclxuXHJcbiAgQE91dHB1dChcIm9uZm9jdXNcIilcclxuICBvbmZvY3VzPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnJlbW92ZVwiKVxyXG4gIG9ucmVtb3ZlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uYWRkXCIpXHJcbiAgb25hZGQ9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25kcm9wXCIpXHJcbiAgb25kcm9wPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInJlbW92YWJsZVwiKVxyXG4gIHJlbW92YWJsZTogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwibWF4bGVuZ3RoXCIpXHJcbiAgbWF4bGVuZ3RoOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcIm5hbWVcIilcclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IGJvb2xlYW47XHJcblxyXG4gIEBJbnB1dChcInBhcmVudFwiKVxyXG4gIHBhcmVudDogYW55O1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcbiAgQFZpZXdDaGlsZChcImVkaXRvclwiKVxyXG4gIGVkaXRvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcInNlbGVjdG9yXCIpXHJcbiAgc2VsZWN0b3I7XHJcblxyXG4gIEBWaWV3Q2hpbGQoXCJmaWxsZXJcIilcclxuICBmaWxsZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBkYXRhVHJhbnNmZXI6IFRhZ1RyYW5zZmVyLFxyXG4gICAgcHJpdmF0ZSBpbnRvOiBJblRvUGlwZSxcclxuICAgIHB1YmxpYyBlbDogRWxlbWVudFJlZiwgXHJcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlclxyXG4gICl7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmRyYWdnYWJsZSA9ICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdzdGFydCcsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdTdGFydChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG4gICAgICBpZiAodGhpcy5hbGxvd0RyYWcoKSkge1xyXG4gICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwic291cmNlXCIsdGhpcy5uYW1lKTsgLy8gdGhpcyBpcyBuZWVkZWQgdG8gZ2V0IHRoZSBkYXJnL2Ryb3AgZ29pbmcuLlxyXG4gICAgICAgIHRoaXMuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJzb3VyY2VcIix0aGlzKTsgLy8gdGhpcyBpcyBuZWVkZWQgYmVjYXVzZSBldmVudCBkYXRhIHRyYW5zZmVyIHRha2VzIHN0cmluZyBub3QgYmplY3RcclxuICAgICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcmFnJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZyhldmVudCkge31cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0VuZChldmVudCkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG5cclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxyXG4gIGRyb3AoZXZlbnQpIHtcclxuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgIHRoaXMub25kcm9wLmVtaXQoe1xyXG4gICAgICBzb3VyY2U6IHRoaXMuZGF0YVRyYW5zZmVyLmdldERhdGEoXCJzb3VyY2VcIiksXHJcbiAgICAgIGRlc3RpbmF0aW9uOiB0aGlzXHJcbiAgICB9KVxyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW50ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnRW50ZXIoZXZlbnQpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKHRoaXMuYWxsb3dEcm9wKGV2ZW50KSkge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdMZWF2ZShldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnT3ZlcihldmVudCkge1xyXG4gICAgICBpZiAodGhpcy5hbGxvd0Ryb3AoZXZlbnQpKSB7XHJcbiAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIGFsbG93RHJvcChldmVudCk6IGJvb2xlYW4ge1xyXG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwic291cmNlXCIpO1xyXG5cclxuICAgICAgcmV0dXJuIChzb3VyY2UgJiYgc291cmNlLm5hbWUgIT0gdGhpcy5uYW1lKSAmJiB0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDA7XHJcbiAgfVxyXG5cclxuICBhbGxvd0RyYWcoKSA6IGJvb2xlYW4ge1xyXG4gICAgcmV0dXJuICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKSAmJiB0aGlzLm5hbWUgJiYgdGhpcy5uYW1lLmxlbmd0aCA+IDA7XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdrZXl1cCcsIFsnJGV2ZW50J10pIFxyXG4gIGtleXVwKGV2ZW50KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgfHxcclxuICAgICAgICh0aGlzLmVkaXRvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5jbGljayhldmVudClcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDkgJiYgdGhpcy5lZGl0TW9kZSkgeyAvLyB0YWIgb3V0XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCA2Nik7XHJcbiAgICAgIH1lbHNlIGlmIChjb2RlID09PSAzOCkgeyAvLyBhcnJvdyB1cFxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyLS07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gdGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB9ICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDQwKSB7IC8vIGFycm93IGRvd25cclxuICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyIDwgKHRoaXMuZmlsbGVyTGlzdC5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyKys7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICB9ICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSkgXHJcbiAgY2xpY2soZXZlbnQpIHtcclxuICAgIGlmICh0aGlzLnNlbGVjdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGlmICh0aGlzLmlzU2VsZWN0YWJsZSgpKSB7XHJcbiAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5pc0VkaXRhYmxlKCkpIHtcclxuICAgICAgdGhpcy5lZGl0TW9kZSA9ICF0aGlzLmVkaXRNb2RlO1xyXG4gICAgICBpZiAodGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRmlsbGVyTGlzdCh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5maWxsZXIubmF0aXZlRWxlbWVudCwgXCJvZmZcIiwgZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSw2Nik7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA+PSAwKSB7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGgpIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoIXRoaXMuZWRpdE1vZGUpIHtcclxuICAgICAgICAgIHNldFRpbWVvdXQoKCk9Pnt0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKSB9LDY2KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdmb2N1cycsIFsnJGV2ZW50J10pIFxyXG4gIGZvY3VzKGV2ZW50KSB7XHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICB0aGlzLm9uZm9jdXMuZW1pdCh0aGlzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNSZW1vdmFibGUoKSB7XHJcbiAgICBsZXQgY2FuUmVtb3ZlID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LnJlbW92ZU9ubHkpO1xyXG4gICAgXHJcbiAgICByZXR1cm4gIGNhblJlbW92ZTtcclxuICB9XHJcblxyXG4gIGlzRWRpdGFibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmVkaXRwb2xpY3kgIT09IEVkaXRQb2xpY3kudmlld09ubHkpO1xyXG4gIH1cclxuXHJcbiAgaXNEcmFnZ2FibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIGlzU2VsZWN0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuICBzZWxlY3QoKSB7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIHRhYm91dChldmVudCkge1xyXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgIHRoaXMubmFtZSA9IHRoaXMuc2VsZWN0ZWRGaWxsZXIgPCAwID8gZXZlbnQudGFyZ2V0LnZhbHVlIDogdGhpcy5maWxsZXJMaXN0W3RoaXMuc2VsZWN0ZWRGaWxsZXJdO1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gZmFsc2U7XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGggJiYgdGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH0sIDY2KVxyXG4gIH1cclxuICBlZGl0KGV2ZW50KSB7XHJcbiAgICB0aGlzLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICB0aGlzLnVwZGF0ZUZpbGxlckxpc3QodGhpcy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUZpbGxlckxpc3QodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5maWxsZXJMaXN0ID0gdGhpcy5hdXRvY29tcGxldGUuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmluZGV4T2YodmFsdWUpID49IDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5vcmlnaW5hbE5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5uYW1lID0gdGhpcy5vcmlnaW5hbE5hbWU7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25yZW1vdmUuZW1pdCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvcm1hdHRlZE5hbWUoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5uYW1lO1xyXG4gICAgaWYgKHRoaXMuZm9ybWF0KSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaW50by50cmFuc2Zvcm0odGhpcy5uYW1lLCB0aGlzLmZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIiwiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgSW50b1BpcGVNb2R1bGUgfSBmcm9tICdAc2VkZWgvaW50by1waXBlcyc7XHJcbmltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnQHNlZGVoL2RyYWctZW5hYmxlZCc7XHJcblxyXG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ0JveENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWdib3guY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFnVHJhbnNmZXIgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnLnRyYW5zZmVyJztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgSW50b1BpcGVNb2R1bGUsXHJcblx0RHJhZ0Ryb3BNb2R1bGVcclxuICBdLFxyXG4gIGRlY2xhcmF0aW9uczogW1xyXG4gICAgVGFnQm94Q29tcG9uZW50LFxyXG4gICAgVGFnQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBUYWdCb3hDb21wb25lbnRcclxuICBdLFxyXG4gIGVudHJ5Q29tcG9uZW50czogW1xyXG4gIF0sXHJcbiAgcHJvdmlkZXJzOiBbXHJcbiAgICBUYWdUcmFuc2ZlclxyXG4gIF0sXHJcbiAgc2NoZW1hczogW0NVU1RPTV9FTEVNRU5UU19TQ0hFTUFdXHJcbn0pXHJcblxyXG5leHBvcnQgY2xhc3MgVGFnQm94TW9kdWxlIHt9XHJcbiJdLCJuYW1lcyI6WyJFdmVudEVtaXR0ZXIiLCJDb21wb25lbnQiLCJSZW5kZXJlciIsIkVsZW1lbnRSZWYiLCJPdXRwdXQiLCJJbnB1dCIsIkluamVjdGFibGUiLCJJblRvUGlwZSIsIlZpZXdDaGlsZCIsIkhvc3RMaXN0ZW5lciIsIk5nTW9kdWxlIiwiQ29tbW9uTW9kdWxlIiwiSW50b1BpcGVNb2R1bGUiLCJE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