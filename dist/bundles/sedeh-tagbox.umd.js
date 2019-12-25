(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@sedeh/wizard-storage'), require('@sedeh/into-pipes')) :
    typeof define === 'function' && define.amd ? define('@sedeh/tagbox', ['exports', '@angular/core', '@angular/common', '@sedeh/wizard-storage', '@sedeh/into-pipes'], factory) :
    (global = global || self, factory((global.sedeh = global.sedeh || {}, global.sedeh.tagbox = {}), global.ng.core, global.ng.common, global.wizardStorage, global['into-pipes']));
}(this, (function (exports, core, common, wizardStorage, intoPipes) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    function __exportStar(m, exports) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }

    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m) return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    }

    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }

    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }

    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    }

    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }

    function __asyncValues(o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    }

    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    function __importStar(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
        result.default = mod;
        return result;
    }

    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }

    (function (DragDropPolicy) {
        DragDropPolicy[DragDropPolicy["disabled"] = 1] = "disabled";
        DragDropPolicy[DragDropPolicy["appendOnDrop"] = 2] = "appendOnDrop";
        DragDropPolicy[DragDropPolicy["prependOnDrop"] = 3] = "prependOnDrop";
        DragDropPolicy[DragDropPolicy["swapOnDrop"] = 4] = "swapOnDrop";
    })(exports.DragDropPolicy || (exports.DragDropPolicy = {}));

    (function (EditPolicy) {
        EditPolicy[EditPolicy["viewOnly"] = 1] = "viewOnly";
        EditPolicy[EditPolicy["addOnly"] = 2] = "addOnly";
        EditPolicy[EditPolicy["removeOnly"] = 4] = "removeOnly";
        EditPolicy[EditPolicy["addAndRemove"] = 6] = "addAndRemove";
        EditPolicy[EditPolicy["addRemoveModify"] = 7] = "addRemoveModify";
    })(exports.EditPolicy || (exports.EditPolicy = {}));

    (function (Selectionpolicy) {
        Selectionpolicy[Selectionpolicy["disabled"] = 1] = "disabled";
        Selectionpolicy[Selectionpolicy["multiSelect"] = 2] = "multiSelect";
        Selectionpolicy[Selectionpolicy["singleSelect"] = 3] = "singleSelect";
    })(exports.Selectionpolicy || (exports.Selectionpolicy = {}));

    var TagBoxComponent = /** @class */ (function () {
        function TagBoxComponent(renderer, el) {
            this.renderer = renderer;
            this.el = el;
            this._tags = [];
            this._selectedindex = [];
            this.onchange = new core.EventEmitter();
            this.onerror = new core.EventEmitter();
            this.onselect = new core.EventEmitter();
            this.onaction = new core.EventEmitter();
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
            var canSelect = this.selectionpolicy !== exports.Selectionpolicy.disabled;
            return this._selectedindex.indexOf(index) < 0 ? false : canSelect;
        };
        TagBoxComponent.prototype.itemSelectionClass = function (index) {
            var selected = this.itemSelectedAt(index);
            return selected ? "selected" : ((index < 0 || this.selectionpolicy === exports.Selectionpolicy.disabled) ? "left-padded" : "");
        };
        TagBoxComponent.prototype.isRemovable = function () {
            var canRemove = (this.editpolicy === exports.EditPolicy.addAndRemove);
            canRemove = canRemove || (this.editpolicy === exports.EditPolicy.addRemoveModify);
            canRemove = canRemove || (this.editpolicy === exports.EditPolicy.removeOnly);
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
            var canAdd = (this.editpolicy === exports.EditPolicy.addAndRemove);
            canAdd = canAdd || (this.editpolicy === exports.EditPolicy.addRemoveModify);
            canAdd = canAdd || (this.editpolicy === exports.EditPolicy.addOnly);
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
            if (this.dragpolicy === exports.DragDropPolicy.appendOnDrop) {
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
            else if (this.dragpolicy === exports.DragDropPolicy.prependOnDrop) {
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
            if (this.dragpolicy === exports.DragDropPolicy.swapOnDrop) {
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
            if (this.selectionpolicy !== exports.Selectionpolicy.disabled) {
                this.onTagFocus(event);
                if (this.beforeAction({ request: "select", item: event.name })) {
                    if (this.selectionpolicy === exports.Selectionpolicy.singleSelect) {
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
            if (this.selectionpolicy !== exports.Selectionpolicy.disabled) {
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
            { type: core.Renderer },
            { type: core.ElementRef }
        ]; };
        __decorate([
            core.Output("onchange")
        ], TagBoxComponent.prototype, "onchange", void 0);
        __decorate([
            core.Output("onerror")
        ], TagBoxComponent.prototype, "onerror", void 0);
        __decorate([
            core.Output("onselect")
        ], TagBoxComponent.prototype, "onselect", void 0);
        __decorate([
            core.Output("onaction")
        ], TagBoxComponent.prototype, "onaction", void 0);
        __decorate([
            core.Input("beforeAction")
        ], TagBoxComponent.prototype, "beforeAction", void 0);
        __decorate([
            core.Input("boxTitle")
        ], TagBoxComponent.prototype, "boxTitle", void 0);
        __decorate([
            core.Input("id")
        ], TagBoxComponent.prototype, "id", void 0);
        __decorate([
            core.Input("placeholder")
        ], TagBoxComponent.prototype, "placeholder", void 0);
        __decorate([
            core.Input("maxboxlength")
        ], TagBoxComponent.prototype, "maxboxlength", void 0);
        __decorate([
            core.Input("maxtaglength")
        ], TagBoxComponent.prototype, "maxtaglength", void 0);
        __decorate([
            core.Input("maxtags")
        ], TagBoxComponent.prototype, "maxtags", void 0);
        __decorate([
            core.Input("mintags")
        ], TagBoxComponent.prototype, "mintags", void 0);
        __decorate([
            core.Input("formController")
        ], TagBoxComponent.prototype, "formController", void 0);
        __decorate([
            core.Input("tags")
        ], TagBoxComponent.prototype, "tags", void 0);
        __decorate([
            core.Input("selectedindex")
        ], TagBoxComponent.prototype, "selectedindex", void 0);
        __decorate([
            core.Input("delineateby")
        ], TagBoxComponent.prototype, "delineateby", void 0);
        __decorate([
            core.Input("format")
        ], TagBoxComponent.prototype, "format", void 0);
        __decorate([
            core.Input("autocomplete")
        ], TagBoxComponent.prototype, "autocomplete", void 0);
        __decorate([
            core.Input("selectionpolicy")
        ], TagBoxComponent.prototype, "selectionpolicy", void 0);
        __decorate([
            core.Input("editpolicy")
        ], TagBoxComponent.prototype, "editpolicy", void 0);
        __decorate([
            core.Input("dragpolicy")
        ], TagBoxComponent.prototype, "dragpolicy", void 0);
        TagBoxComponent = __decorate([
            core.Component({
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
            core.Injectable()
        ], TagTransfer);
        return TagTransfer;
    }());

    var TagComponent = /** @class */ (function () {
        function TagComponent(dataTransfer, el, renderer) {
            this.dataTransfer = dataTransfer;
            this.el = el;
            this.renderer = renderer;
            this.selectedFiller = -1;
            this.onaction = new core.EventEmitter();
            this.onfocus = new core.EventEmitter();
            this.onchange = new core.EventEmitter();
            this.onselect = new core.EventEmitter();
            this.onremove = new core.EventEmitter();
            this.onadd = new core.EventEmitter();
            this.ondrop = new core.EventEmitter();
        }
        TagComponent.prototype.ngOnInit = function () {
            this.init();
            this.el.nativeElement.draggable = (this.dragpolicy !== exports.DragDropPolicy.disabled);
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
            return (this.dragpolicy !== exports.DragDropPolicy.disabled) && this.name && this.name.length > 0;
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
            var canRemove = (this.editpolicy === exports.EditPolicy.addAndRemove);
            canRemove = canRemove || (this.editpolicy === exports.EditPolicy.addRemoveModify);
            canRemove = canRemove || (this.editpolicy === exports.EditPolicy.removeOnly);
            return canRemove;
        };
        TagComponent.prototype.isEditable = function () {
            return (this.editpolicy === exports.EditPolicy.addRemoveModify);
        };
        TagComponent.prototype.isDraggable = function () {
            return (this.dragpolicy !== exports.DragDropPolicy.disabled);
        };
        TagComponent.prototype.isSelectable = function () {
            return (this.selectionpolicy !== exports.Selectionpolicy.disabled);
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
            { type: core.ElementRef },
            { type: core.Renderer }
        ]; };
        __decorate([
            core.Output("onaction")
        ], TagComponent.prototype, "onaction", void 0);
        __decorate([
            core.Output("onfocus")
        ], TagComponent.prototype, "onfocus", void 0);
        __decorate([
            core.Output("onchange")
        ], TagComponent.prototype, "onchange", void 0);
        __decorate([
            core.Output("onselect")
        ], TagComponent.prototype, "onselect", void 0);
        __decorate([
            core.Output("onremove")
        ], TagComponent.prototype, "onremove", void 0);
        __decorate([
            core.Output("onadd")
        ], TagComponent.prototype, "onadd", void 0);
        __decorate([
            core.Output("ondrop")
        ], TagComponent.prototype, "ondrop", void 0);
        __decorate([
            core.Input("format")
        ], TagComponent.prototype, "format", void 0);
        __decorate([
            core.Input("removable")
        ], TagComponent.prototype, "removable", void 0);
        __decorate([
            core.Input("maxlength")
        ], TagComponent.prototype, "maxlength", void 0);
        __decorate([
            core.Input("name")
        ], TagComponent.prototype, "name", void 0);
        __decorate([
            core.Input("placeholder")
        ], TagComponent.prototype, "placeholder", void 0);
        __decorate([
            core.Input("parent")
        ], TagComponent.prototype, "parent", void 0);
        __decorate([
            core.Input("autocomplete")
        ], TagComponent.prototype, "autocomplete", void 0);
        __decorate([
            core.Input("selectionpolicy")
        ], TagComponent.prototype, "selectionpolicy", void 0);
        __decorate([
            core.Input("editpolicy")
        ], TagComponent.prototype, "editpolicy", void 0);
        __decorate([
            core.Input("dragpolicy")
        ], TagComponent.prototype, "dragpolicy", void 0);
        __decorate([
            core.ViewChild("editor", { static: false })
        ], TagComponent.prototype, "editor", void 0);
        __decorate([
            core.ViewChild("selector", { static: false })
        ], TagComponent.prototype, "selector", void 0);
        __decorate([
            core.ViewChild("holder", { static: false })
        ], TagComponent.prototype, "holder", void 0);
        __decorate([
            core.ViewChild("filler", { static: false })
        ], TagComponent.prototype, "filler", void 0);
        __decorate([
            core.HostListener('dragstart', ['$event'])
        ], TagComponent.prototype, "dragStart", null);
        __decorate([
            core.HostListener('drag', ['$event'])
        ], TagComponent.prototype, "drag", null);
        __decorate([
            core.HostListener('dragend', ['$event'])
        ], TagComponent.prototype, "dragEnd", null);
        __decorate([
            core.HostListener('drop', ['$event'])
        ], TagComponent.prototype, "drop", null);
        __decorate([
            core.HostListener('dragenter', ['$event'])
        ], TagComponent.prototype, "dragEnter", null);
        __decorate([
            core.HostListener('dragleave', ['$event'])
        ], TagComponent.prototype, "dragLeave", null);
        __decorate([
            core.HostListener('dragover', ['$event'])
        ], TagComponent.prototype, "dragOver", null);
        __decorate([
            core.HostListener('keyup', ['$event'])
        ], TagComponent.prototype, "keyup", null);
        __decorate([
            core.HostListener('click', ['$event'])
        ], TagComponent.prototype, "click", null);
        __decorate([
            core.HostListener('focus', ['$event'])
        ], TagComponent.prototype, "focus", null);
        TagComponent = __decorate([
            core.Component({
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
            core.NgModule({
                imports: [
                    common.CommonModule,
                    wizardStorage.WizardStorageModule,
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
                providers: [
                    TagTransfer
                ],
                schemas: [core.CUSTOM_ELEMENTS_SCHEMA]
            })
        ], TagBoxModule);
        return TagBoxModule;
    }());

    exports.TagBoxComponent = TagBoxComponent;
    exports.TagBoxModule = TagBoxModule;
    exports.ɵa = TagComponent;
    exports.ɵb = TagTransfer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=sedeh-tagbox.umd.js.map
