import * as tslib_1 from "tslib";
/*
 * A comparision tree will layout each attribute of a json deep through its heirarchy with given visual queues
 * that represents a deletion, adition, or change of attribute from the other tree. The status of each node is
 * evaluated by the parent comparision tool.
 */
import { Component, OnInit, Input, Output, HostListener, ElementRef, Renderer, ViewChild, EventEmitter } from '@angular/core';
import { DragDropPolicy, Selectionpolicy, EditPolicy } from '../interfaces/tagbox.interfaces';
import { TagTransfer } from './tag.transfer';
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
    tslib_1.__decorate([
        Output("onaction")
    ], TagComponent.prototype, "onaction", void 0);
    tslib_1.__decorate([
        Output("onfocus")
    ], TagComponent.prototype, "onfocus", void 0);
    tslib_1.__decorate([
        Output("onchange")
    ], TagComponent.prototype, "onchange", void 0);
    tslib_1.__decorate([
        Output("onselect")
    ], TagComponent.prototype, "onselect", void 0);
    tslib_1.__decorate([
        Output("onremove")
    ], TagComponent.prototype, "onremove", void 0);
    tslib_1.__decorate([
        Output("onadd")
    ], TagComponent.prototype, "onadd", void 0);
    tslib_1.__decorate([
        Output("ondrop")
    ], TagComponent.prototype, "ondrop", void 0);
    tslib_1.__decorate([
        Input("format")
    ], TagComponent.prototype, "format", void 0);
    tslib_1.__decorate([
        Input("removable")
    ], TagComponent.prototype, "removable", void 0);
    tslib_1.__decorate([
        Input("maxlength")
    ], TagComponent.prototype, "maxlength", void 0);
    tslib_1.__decorate([
        Input("name")
    ], TagComponent.prototype, "name", void 0);
    tslib_1.__decorate([
        Input("placeholder")
    ], TagComponent.prototype, "placeholder", void 0);
    tslib_1.__decorate([
        Input("parent")
    ], TagComponent.prototype, "parent", void 0);
    tslib_1.__decorate([
        Input("autocomplete")
    ], TagComponent.prototype, "autocomplete", void 0);
    tslib_1.__decorate([
        Input("selectionpolicy")
    ], TagComponent.prototype, "selectionpolicy", void 0);
    tslib_1.__decorate([
        Input("editpolicy")
    ], TagComponent.prototype, "editpolicy", void 0);
    tslib_1.__decorate([
        Input("dragpolicy")
    ], TagComponent.prototype, "dragpolicy", void 0);
    tslib_1.__decorate([
        ViewChild("editor", { static: false })
    ], TagComponent.prototype, "editor", void 0);
    tslib_1.__decorate([
        ViewChild("selector", { static: false })
    ], TagComponent.prototype, "selector", void 0);
    tslib_1.__decorate([
        ViewChild("holder", { static: false })
    ], TagComponent.prototype, "holder", void 0);
    tslib_1.__decorate([
        ViewChild("filler", { static: false })
    ], TagComponent.prototype, "filler", void 0);
    tslib_1.__decorate([
        HostListener('dragstart', ['$event'])
    ], TagComponent.prototype, "dragStart", null);
    tslib_1.__decorate([
        HostListener('drag', ['$event'])
    ], TagComponent.prototype, "drag", null);
    tslib_1.__decorate([
        HostListener('dragend', ['$event'])
    ], TagComponent.prototype, "dragEnd", null);
    tslib_1.__decorate([
        HostListener('drop', ['$event'])
    ], TagComponent.prototype, "drop", null);
    tslib_1.__decorate([
        HostListener('dragenter', ['$event'])
    ], TagComponent.prototype, "dragEnter", null);
    tslib_1.__decorate([
        HostListener('dragleave', ['$event'])
    ], TagComponent.prototype, "dragLeave", null);
    tslib_1.__decorate([
        HostListener('dragover', ['$event'])
    ], TagComponent.prototype, "dragOver", null);
    tslib_1.__decorate([
        HostListener('keyup', ['$event'])
    ], TagComponent.prototype, "keyup", null);
    tslib_1.__decorate([
        HostListener('click', ['$event'])
    ], TagComponent.prototype, "click", null);
    tslib_1.__decorate([
        HostListener('focus', ['$event'])
    ], TagComponent.prototype, "focus", null);
    TagComponent = tslib_1.__decorate([
        Component({
            selector: 'tag',
            template: "\r\n<span #selector\r\n    *ngIf=\"!editMode && removable && isSelectable()\" \r\n    tabindex=\"0\" \r\n    class=\"selection fa\"\r\n    (click)=\"select()\"></span>\r\n<input \r\n    *ngIf=\"editMode\" \r\n    class=\"editor\" \r\n    (blur)=\"tabout($event)\"\r\n    (keyup)=\"edit($event)\" \r\n    [value]=\"name\"\r\n    [attr.maxlength]=\"maxlength\"\r\n    [attr.placeholder]=\"placeholder\" #editor/>\r\n<div class=\"autocomplete off\" *ngIf=\"editMode && autocomplete\" #filler>\r\n  <ul>\r\n      <li *ngFor=\"let x of fillerList; let i = index\" \r\n        (click)=\"selectedFiller = i\" \r\n        [class.selected]=\"selectedFiller === i\"\r\n        [textContent]=\"x\"></li>\r\n  </ul>\r\n</div>\r\n<span #holder\r\n    *ngIf=\"!editMode && placeholder\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [innerHTML]=\"placeholder\"></span>\r\n<span #holder\r\n    *ngIf=\"!editMode && !placeholder\" \r\n    [tabindex]=\"isEditable() ? 0 : -1\" \r\n    [rawContent]=\"name\"\r\n    intoName=\"audio 1\" intoId=\"audio1\" \r\n    [into]=\"format\"\r\n    [onComponentChange]=\"componentChanged.bind(this)\"></span>\r\n<span \r\n    *ngIf=\"!editMode && removable\" \r\n    tabindex=\"0\" \r\n    class=\"remove fa fa-times\" \r\n    (click)=\"remove()\"></span>\r\n<span \r\n    *ngIf=\"!removable\" \r\n    class=\"placeholder fa fa-plus-circle\"></span>",
            styles: ["@charset \"UTF-8\";:host{cursor:pointer;color:#fdfdfd;margin:4px 2px;display:inline-block;background-color:#1f84ab;border:1px solid #015e85;border-radius:8px 20px 20px 8px;box-sizing:border-box;padding:3px 0;position:relative}:host ::ng-deep img{height:25px}:host.left-padded{padding-left:8px}:host.drag-over{background-color:#add8e6!important;cursor:move}:host[placeholder]{background-color:transparent;color:#000;border:0}:host[placeholder]:hover{background-color:#eee!important}:host[placeholder] .editor{color:#000}:host:hover{background-color:#027912!important;border-color:#024b0b!important}:host.focused{background-color:#027912!important;border-color:#024b0b!important}:host.selected:hover{background-color:#d6534e}:host.selected{background-color:#d6534e}:host.selected .selection.fa:before{content:\"\uF00C\"!important}:host .selection{background-color:transparent;float:left;margin-right:3px;padding:5px 3px;width:10px;height:10px;font-size:.8rem}:host .selection.fa:before{content:\"\uF013\"}:host .editor{background-color:transparent;overflow:unset;max-width:inherit;width:inherit;color:#fff;border:none}:host .placeholder{color:#888585;float:right;font-size:1rem;height:20px;line-height:20px;margin-left:5px;text-align:center;width:20px}:host .remove{float:right;font-size:.7rem;height:20px;width:20px;color:#fff;text-align:center;margin-left:5px;line-height:20px;font-weight:bolder}:host .holder{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}:host .autocomplete{position:absolute;top:26px;z-index:5}:host .autocomplete.off{display:none}:host .autocomplete ul{border:1px solid #024b0b;border-top:0;list-style:none inside;background-color:#027912;margin:0;max-height:150px;overflow-y:auto;padding:0}:host .autocomplete ul li{color:#fdfdfd;padding:5px;white-space:nowrap}:host .autocomplete ul li.selected{background-color:#d6534e}:host .autocomplete ul li:hover{background-color:#0446a8;color:#fff}"]
        })
    ], TagComponent);
    return TagComponent;
}());
export { TagComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7QUFDSCxPQUFPLEVBQ0wsU0FBUyxFQUNULE1BQU0sRUFDTixLQUFLLEVBQ0wsTUFBTSxFQUNOLFlBQVksRUFDWixVQUFVLEVBQ1YsUUFBUSxFQUNSLFNBQVMsRUFDVCxZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUNMLGNBQWMsRUFDZCxlQUFlLEVBQ2YsVUFBVSxFQUNYLE1BQU0saUNBQWlDLENBQUM7QUFFekMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBTzdDO0lBK0RFLHNCQUNVLFlBQXlCLEVBQzFCLEVBQWMsRUFDYixRQUFrQjtRQUZsQixpQkFBWSxHQUFaLFlBQVksQ0FBYTtRQUMxQixPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQ2IsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQTlENUIsbUJBQWMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUlwQixhQUFRLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUc1QixZQUFPLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUczQixhQUFRLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUc1QixhQUFRLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUc1QixhQUFRLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUc1QixVQUFLLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtRQUd6QixXQUFNLEdBQUUsSUFBSSxZQUFZLEVBQUUsQ0FBQTtJQTBDMUIsQ0FBQztJQUVELCtCQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxTQUFT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QW1DOztTQUVwQyxDQUFDO09BQ1csWUFBWSxDQXVUeEI7SUFBRCxtQkFBQztDQUFBLEFBdlRELElBdVRDO1NBdlRZLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxyXG4gKiBBIGNvbXBhcmlzaW9uIHRyZWUgd2lsbCBsYXlvdXQgZWFjaCBhdHRyaWJ1dGUgb2YgYSBqc29uIGRlZXAgdGhyb3VnaCBpdHMgaGVpcmFyY2h5IHdpdGggZ2l2ZW4gdmlzdWFsIHF1ZXVlc1xyXG4gKiB0aGF0IHJlcHJlc2VudHMgYSBkZWxldGlvbiwgYWRpdGlvbiwgb3IgY2hhbmdlIG9mIGF0dHJpYnV0ZSBmcm9tIHRoZSBvdGhlciB0cmVlLiBUaGUgc3RhdHVzIG9mIGVhY2ggbm9kZSBpcyBcclxuICogZXZhbHVhdGVkIGJ5IHRoZSBwYXJlbnQgY29tcGFyaXNpb24gdG9vbC5cclxuICovXHJcbmltcG9ydCB7XHJcbiAgQ29tcG9uZW50LFxyXG4gIE9uSW5pdCxcclxuICBJbnB1dCxcclxuICBPdXRwdXQsXHJcbiAgSG9zdExpc3RlbmVyLFxyXG4gIEVsZW1lbnRSZWYsXHJcbiAgUmVuZGVyZXIsXHJcbiAgVmlld0NoaWxkLFxyXG4gIEV2ZW50RW1pdHRlclxyXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnVHJhbnNmZXIgfSBmcm9tICcuL3RhZy50cmFuc2Zlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3RhZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGVkaXRNb2RlOiBib29sZWFuO1xyXG5cclxuICBvcmlnaW5hbE5hbWU6IHN0cmluZztcclxuICBzZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gIGZpbGxlckxpc3Q6IHN0cmluZ1tdO1xyXG4gIFxyXG4gIEBPdXRwdXQoXCJvbmFjdGlvblwiKVxyXG4gIG9uYWN0aW9uPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uZm9jdXNcIilcclxuICBvbmZvY3VzPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uY2hhbmdlXCIpXHJcbiAgb25jaGFuZ2U9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25zZWxlY3RcIilcclxuICBvbnNlbGVjdD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnJlbW92ZVwiKVxyXG4gIG9ucmVtb3ZlPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9uYWRkXCIpXHJcbiAgb25hZGQ9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25kcm9wXCIpXHJcbiAgb25kcm9wPSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQElucHV0KFwiZm9ybWF0XCIpXHJcbiAgZm9ybWF0OiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInJlbW92YWJsZVwiKVxyXG4gIHJlbW92YWJsZTogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwibWF4bGVuZ3RoXCIpXHJcbiAgbWF4bGVuZ3RoOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcIm5hbWVcIilcclxuICBuYW1lOiBzdHJpbmc7XHJcblxyXG4gIEBJbnB1dChcInBsYWNlaG9sZGVyXCIpXHJcbiAgcGxhY2Vob2xkZXI6IGJvb2xlYW47XHJcblxyXG4gIEBJbnB1dChcInBhcmVudFwiKVxyXG4gIHBhcmVudDogYW55O1xyXG5cclxuICBASW5wdXQoXCJhdXRvY29tcGxldGVcIilcclxuICBhdXRvY29tcGxldGU6IHN0cmluZ1tdO1xyXG5cclxuICBASW5wdXQoXCJzZWxlY3Rpb25wb2xpY3lcIilcclxuICBzZWxlY3Rpb25wb2xpY3k6IFNlbGVjdGlvbnBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZWRpdHBvbGljeVwiKVxyXG4gIGVkaXRwb2xpY3k6IEVkaXRQb2xpY3k7XHJcblxyXG4gIEBJbnB1dChcImRyYWdwb2xpY3lcIilcclxuICBkcmFncG9saWN5OiBEcmFnRHJvcFBvbGljeTtcclxuXHJcbiAgQFZpZXdDaGlsZChcImVkaXRvclwiLCB7c3RhdGljOiBmYWxzZX0pIGVkaXRvcjtcclxuICBAVmlld0NoaWxkKFwic2VsZWN0b3JcIiwge3N0YXRpYzogZmFsc2V9KSBzZWxlY3RvcjtcclxuICBAVmlld0NoaWxkKFwiaG9sZGVyXCIsIHtzdGF0aWM6IGZhbHNlfSkgaG9sZGVyO1xyXG4gIEBWaWV3Q2hpbGQoXCJmaWxsZXJcIiwge3N0YXRpYzogZmFsc2V9KSBmaWxsZXI7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBkYXRhVHJhbnNmZXI6IFRhZ1RyYW5zZmVyLFxyXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLCBcclxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXHJcbiAgKXtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ1N0YXJ0KGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKCkpIHtcclxuICAgICAgICBpZiAoIXRoaXMuaXNJRSgpKSB7XHJcbiAgICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNvdXJjZVwiLHRoaXMubmFtZSk7IC8vIHRoaXMgaXMgbmVlZGVkIHRvIGdldCB0aGUgZGFyZy9kcm9wIGdvaW5nLi5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNvdXJjZVwiLHRoaXMpOyAvLyB0aGlzIGlzIG5lZWRlZCBiZWNhdXNlIGV2ZW50IGRhdGEgdHJhbnNmZXIgdGFrZXMgc3RyaW5nIG5vdCBiamVjdFxyXG4gICAgICB9XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWcnLCBbJyRldmVudCddKSBcclxuICBkcmFnKGV2ZW50OiBhbnkpIHt9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VuZCcsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdFbmQoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcdFxyXG5cclxuICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2Ryb3AnLCBbJyRldmVudCddKVxyXG4gIGRyb3AoZXZlbnQ6IGFueSkge1xyXG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgdGhpcy5vbmRyb3AuZW1pdCh7XHJcbiAgICAgIHNvdXJjZTogdGhpcy5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNvdXJjZVwiKSxcclxuICAgICAgZGVzdGluYXRpb246IHRoaXNcclxuICAgIH0pXHJcbiAgfVxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdlbnRlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdFbnRlcihldmVudDogYW55KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gIH1cclxuICBASG9zdExpc3RlbmVyKCdkcmFnbGVhdmUnLCBbJyRldmVudCddKSBcclxuICBkcmFnTGVhdmUoZXZlbnQ6IGFueSkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgIFxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ292ZXInLCBbJyRldmVudCddKSBcclxuICBkcmFnT3ZlcihldmVudDogYW55KSB7XHJcbiAgICAgIGlmICh0aGlzLmFsbG93RHJvcChldmVudCkpIHtcclxuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICAgIH1cclxuICB9XHJcbiAgcHJpdmF0ZSBpc0lFKCkge1xyXG4gICAgY29uc3QgbWF0Y2ggPSBuYXZpZ2F0b3IudXNlckFnZW50LnNlYXJjaCgvKD86RWRnZXxNU0lFfFRyaWRlbnRcXC8uKjsgcnY6KS8pO1xyXG4gICAgbGV0IGlzSUUgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAobWF0Y2ggIT09IC0xKSB7XHJcbiAgICAgICAgaXNJRSA9IHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXNJRTtcclxuICB9XHJcbiAgYWxsb3dEcm9wKGV2ZW50OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgY29uc3Qgc291cmNlID0gdGhpcy5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInNvdXJjZVwiKTtcclxuICAgICAgY29uc3QgYWxsb3cgPSAoc291cmNlICYmIHNvdXJjZS5uYW1lICE9IHRoaXMubmFtZSkgJiYgXHJcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMCkgJiZcclxuICAgICAgICAgICAgICAgICAgICAoKCFzb3VyY2UuZm9ybWF0ICYmICF0aGlzLmZvcm1hdCkgfHwgc291cmNlLmZvcm1hdCA9PSB0aGlzLmZvcm1hdCk7XHJcbiAgICAgIHJldHVybiBhbGxvdztcclxuICB9XHJcblxyXG4gIGFsbG93RHJhZygpIDogYm9vbGVhbiB7XHJcbiAgICByZXR1cm4gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpICYmIHRoaXMubmFtZSAmJiB0aGlzLm5hbWUubGVuZ3RoID4gMDtcclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2tleXVwJywgWyckZXZlbnQnXSkgXHJcbiAga2V5dXAoZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGhpcy5lbC5uYXRpdmVFbGVtZW50IHx8XHJcbiAgICAgICAodGhpcy5lZGl0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50KSkge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMuY2xpY2soZXZlbnQpXHJcbiAgICAgIH1lbHNlIGlmIChjb2RlID09PSA5ICYmIHRoaXMuZWRpdE1vZGUpIHsgLy8gdGFiIG91dFxyXG4gICAgICAgIHNldFRpbWVvdXQoKCk9PntcclxuICAgICAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZS5sZW5ndGggJiYgdGhpcy5vcmlnaW5hbE5hbWUgIT09IHRoaXMubmFtZSkge1xyXG4gICAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgNjYpO1xyXG4gICAgICB9ZWxzZSBpZiAoY29kZSA9PT0gMzgpIHsgLy8gYXJyb3cgdXBcclxuICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyID49IDApIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlci0tO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlciA9IHRoaXMuZmlsbGVyTGlzdC5sZW5ndGggLSAxO1xyXG4gICAgICAgICAgfSAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIGlmIChjb2RlID09PSA0MCkgeyAvLyBhcnJvdyBkb3duXHJcbiAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZEZpbGxlciA8ICh0aGlzLmZpbGxlckxpc3QubGVuZ3RoIC0gMSkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlcisrO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gICAgICAgICAgfSAgIFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdG9yICYmIGV2ZW50LnRhcmdldCA9PT0gdGhpcy5zZWxlY3Rvci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgICAgIHRoaXMub25zZWxlY3QuZW1pdCh0aGlzKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlICBpZiAodGhpcy5ob2xkZXIgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLmhvbGRlci5uYXRpdmVFbGVtZW50KSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5lZGl0TW9kZSA9IHRydWU7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+dGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpLDMzKTtcclxuICAgICAgfSAgICAgIFxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBASG9zdExpc3RlbmVyKCdjbGljaycsIFsnJGV2ZW50J10pIFxyXG4gIGNsaWNrKGV2ZW50OiBFdmVudCkge1xyXG4gICAgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgICB0aGlzLm9uc2VsZWN0LmVtaXQodGhpcylcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLmlzRWRpdGFibGUoKSkge1xyXG4gICAgICB0aGlzLmVkaXRNb2RlID0gIXRoaXMuZWRpdE1vZGU7XHJcbiAgICAgIGlmICh0aGlzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgaWYgKHRoaXMuZmlsbGVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRGaWxsZXIgPSAtMTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVGaWxsZXJMaXN0KHRoaXMubmFtZSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodGhpcy5lZGl0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy5lZGl0b3IubmF0aXZlRWxlbWVudC5mb2N1cygpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmZpbGxlci5uYXRpdmVFbGVtZW50LCBcIm9mZlwiLCBmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LDY2KTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyID49IDApIHtcclxuICAgICAgICB0aGlzLm5hbWUgPSB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCkge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICghdGhpcy5lZGl0TW9kZSkge1xyXG4gICAgICAgICAgc2V0VGltZW91dCgoKT0+e3RoaXMuZWwubmF0aXZlRWxlbWVudC5mb2N1cygpIH0sNjYpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm9uYWRkLmVtaXQodGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2ZvY3VzJywgWyckZXZlbnQnXSkgXHJcbiAgZm9jdXMoZXZlbnQ6IGFueSkge1xyXG4gICAgaWYgKHRoaXMuaXNTZWxlY3RhYmxlKCkpIHtcclxuICAgICAgdGhpcy5vbmZvY3VzLmVtaXQodGhpcylcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlzUmVtb3ZhYmxlKCkge1xyXG4gICAgbGV0IGNhblJlbW92ZSA9ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kuYWRkQW5kUmVtb3ZlKTtcclxuXHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gICAgY2FuUmVtb3ZlID0gY2FuUmVtb3ZlIHx8ICh0aGlzLmVkaXRwb2xpY3kgPT09IEVkaXRQb2xpY3kucmVtb3ZlT25seSk7XHJcbiAgICBcclxuICAgIHJldHVybiAgY2FuUmVtb3ZlO1xyXG4gIH1cclxuXHJcbiAgaXNFZGl0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRSZW1vdmVNb2RpZnkpO1xyXG4gIH1cclxuXHJcbiAgaXNEcmFnZ2FibGUoKSB7XHJcbiAgICByZXR1cm4gICh0aGlzLmRyYWdwb2xpY3kgIT09IERyYWdEcm9wUG9saWN5LmRpc2FibGVkKTtcclxuICB9XHJcblxyXG4gIGlzU2VsZWN0YWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuc2VsZWN0aW9ucG9saWN5ICE9PSBTZWxlY3Rpb25wb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuICBzZWxlY3QoKSB7XHJcbiAgICBcclxuICB9XHJcblxyXG4gIHRhYm91dChldmVudDogYW55KSB7XHJcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgdGhpcy5uYW1lID0gdGhpcy5zZWxlY3RlZEZpbGxlciA8IDAgPyBldmVudC50YXJnZXQudmFsdWUgOiB0aGlzLmZpbGxlckxpc3RbdGhpcy5zZWxlY3RlZEZpbGxlcl07XHJcbiAgICAgIHRoaXMuZWRpdE1vZGUgPSBmYWxzZTtcclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgdGhpcy5vbmNoYW5nZS5lbWl0KHRoaXMpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfSwgNjYpXHJcbiAgfVxyXG4gIGVkaXQoZXZlbnQ6IGFueSkge1xyXG4gICAgdGhpcy5uYW1lID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xyXG4gICAgdGhpcy51cGRhdGVGaWxsZXJMaXN0KHRoaXMubmFtZSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVGaWxsZXJMaXN0KHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUgJiYgdGhpcy5hdXRvY29tcGxldGUgaW5zdGFuY2VvZiBBcnJheSl7XHJcbiAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgIHRoaXMuZmlsbGVyTGlzdCA9IHRoaXMuYXV0b2NvbXBsZXRlLmZpbHRlcigoaXRlbSkgPT4gaXRlbS5pbmRleE9mKHZhbHVlKSA+PSAwKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaW5pdCgpIHtcclxuICAgIHRoaXMub3JpZ2luYWxOYW1lID0gdGhpcy5uYW1lO1xyXG4gIH1cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMubmFtZSA9IHRoaXMub3JpZ2luYWxOYW1lO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKCkge1xyXG4gICAgaWYgKHRoaXMuaXNSZW1vdmFibGUoKSkge1xyXG4gICAgICB0aGlzLm9ucmVtb3ZlLmVtaXQodGhpcyk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBjb21wb25lbnRDaGFuZ2VkKGV2ZW50OiBhbnkpIHtcclxuICAgIHRoaXMub25hY3Rpb24uZW1pdChldmVudCk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=