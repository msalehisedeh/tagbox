/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { Component, Input, Output, HostListener, ElementRef, Renderer, ViewChild, EventEmitter } from '@angular/core';
import { InToPipe } from '@sedeh/into-pipes';
import { DragDropPolicy, Selectionpolicy, EditPolicy } from '../interfaces/tagbox.interfaces';
import { TagTransfer } from './tag.transfer';
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
export { TagComponent };
if (false) {
    /** @type {?} */
    TagComponent.prototype.editMode;
    /** @type {?} */
    TagComponent.prototype.originalName;
    /** @type {?} */
    TagComponent.prototype.selectedFiller;
    /** @type {?} */
    TagComponent.prototype.fillerList;
    /** @type {?} */
    TagComponent.prototype.onfocus;
    /** @type {?} */
    TagComponent.prototype.onchange;
    /** @type {?} */
    TagComponent.prototype.onselect;
    /** @type {?} */
    TagComponent.prototype.onremove;
    /** @type {?} */
    TagComponent.prototype.onadd;
    /** @type {?} */
    TagComponent.prototype.ondrop;
    /** @type {?} */
    TagComponent.prototype.format;
    /** @type {?} */
    TagComponent.prototype.removable;
    /** @type {?} */
    TagComponent.prototype.maxlength;
    /** @type {?} */
    TagComponent.prototype.name;
    /** @type {?} */
    TagComponent.prototype.placeholder;
    /** @type {?} */
    TagComponent.prototype.parent;
    /** @type {?} */
    TagComponent.prototype.autocomplete;
    /** @type {?} */
    TagComponent.prototype.selectionpolicy;
    /** @type {?} */
    TagComponent.prototype.editpolicy;
    /** @type {?} */
    TagComponent.prototype.dragpolicy;
    /** @type {?} */
    TagComponent.prototype.editor;
    /** @type {?} */
    TagComponent.prototype.selector;
    /** @type {?} */
    TagComponent.prototype.holder;
    /** @type {?} */
    TagComponent.prototype.filler;
    /** @type {?} */
    TagComponent.prototype.dataTransfer;
    /** @type {?} */
    TagComponent.prototype.into;
    /** @type {?} */
    TagComponent.prototype.el;
    /** @type {?} */
    TagComponent.prototype.renderer;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC9jb21wb25lbnRzL3RhZy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUtBLE9BQU8sRUFDTCxTQUFTLEVBRVQsS0FBSyxFQUNMLE1BQU0sRUFDTixZQUFZLEVBQ1osVUFBVSxFQUNWLFFBQVEsRUFDUixTQUFTLEVBQ1QsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUU3QyxPQUFPLEVBQ0wsY0FBYyxFQUNkLGVBQWUsRUFDZixVQUFVLEVBQ1gsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7O0lBMEUzQyxzQkFDVSxjQUNBLE1BQ0QsSUFDQztRQUhBLGlCQUFZLEdBQVosWUFBWTtRQUNaLFNBQUksR0FBSixJQUFJO1FBQ0wsT0FBRSxHQUFGLEVBQUU7UUFDRCxhQUFRLEdBQVIsUUFBUTs4QkFuRUQsQ0FBQyxDQUFDO3VCQUlWLElBQUksWUFBWSxFQUFFO3dCQUdqQixJQUFJLFlBQVksRUFBRTt3QkFHbEIsSUFBSSxZQUFZLEVBQUU7d0JBR2xCLElBQUksWUFBWSxFQUFFO3FCQUdyQixJQUFJLFlBQVksRUFBRTtzQkFHakIsSUFBSSxZQUFZLEVBQUU7S0FrRHpCOzs7O0lBRUQsK0JBQVE7OztJQUFSO1FBQ0UsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ1osSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDakY7Ozs7O0lBR0QsZ0NBQVM7Ozs7SUFEVCxVQUNVLEtBQVU7UUFDaEIsS0FBSyxDQUFDLGVBQWUsRUFBRSxDQUFDO1FB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QUFDOzt1QkE3UW5DOztTQWdDYSxZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiLypcclxuICogQSBjb21wYXJpc2lvbiB0cmVlIHdpbGwgbGF5b3V0IGVhY2ggYXR0cmlidXRlIG9mIGEganNvbiBkZWVwIHRocm91Z2ggaXRzIGhlaXJhcmNoeSB3aXRoIGdpdmVuIHZpc3VhbCBxdWV1ZXNcclxuICogdGhhdCByZXByZXNlbnRzIGEgZGVsZXRpb24sIGFkaXRpb24sIG9yIGNoYW5nZSBvZiBhdHRyaWJ1dGUgZnJvbSB0aGUgb3RoZXIgdHJlZS4gVGhlIHN0YXR1cyBvZiBlYWNoIG5vZGUgaXMgXHJcbiAqIGV2YWx1YXRlZCBieSB0aGUgcGFyZW50IGNvbXBhcmlzaW9uIHRvb2wuXHJcbiAqL1xyXG5pbXBvcnQge1xyXG4gIENvbXBvbmVudCxcclxuICBPbkluaXQsXHJcbiAgSW5wdXQsXHJcbiAgT3V0cHV0LFxyXG4gIEhvc3RMaXN0ZW5lcixcclxuICBFbGVtZW50UmVmLFxyXG4gIFJlbmRlcmVyLFxyXG4gIFZpZXdDaGlsZCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuXHJcbmltcG9ydCB7IEluVG9QaXBlIH0gZnJvbSAnQHNlZGVoL2ludG8tcGlwZXMnO1xyXG5cclxuaW1wb3J0IHtcclxuICBEcmFnRHJvcFBvbGljeSxcclxuICBTZWxlY3Rpb25wb2xpY3ksXHJcbiAgRWRpdFBvbGljeVxyXG59IGZyb20gJy4uL2ludGVyZmFjZXMvdGFnYm94LmludGVyZmFjZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnVHJhbnNmZXIgfSBmcm9tICcuL3RhZy50cmFuc2Zlcic7XHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3RhZycsXHJcbiAgdGVtcGxhdGVVcmw6ICcuL3RhZy5jb21wb25lbnQuaHRtbCcsXHJcbiAgc3R5bGVVcmxzOiBbJy4vdGFnLmNvbXBvbmVudC5zY3NzJ10sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUYWdDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIGVkaXRNb2RlOiBib29sZWFuO1xyXG5cclxuICBvcmlnaW5hbE5hbWU6IHN0cmluZztcclxuICBzZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gIGZpbGxlckxpc3Q6IHN0cmluZ1tdO1xyXG5cclxuICBAT3V0cHV0KFwib25mb2N1c1wiKVxyXG4gIG9uZm9jdXM9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25jaGFuZ2VcIilcclxuICBvbmNoYW5nZT0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbnNlbGVjdFwiKVxyXG4gIG9uc2VsZWN0PSBuZXcgRXZlbnRFbWl0dGVyKClcclxuXHJcbiAgQE91dHB1dChcIm9ucmVtb3ZlXCIpXHJcbiAgb25yZW1vdmU9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBAT3V0cHV0KFwib25hZGRcIilcclxuICBvbmFkZD0gbmV3IEV2ZW50RW1pdHRlcigpXHJcblxyXG4gIEBPdXRwdXQoXCJvbmRyb3BcIilcclxuICBvbmRyb3A9IG5ldyBFdmVudEVtaXR0ZXIoKVxyXG5cclxuICBASW5wdXQoXCJmb3JtYXRcIilcclxuICBmb3JtYXQ6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicmVtb3ZhYmxlXCIpXHJcbiAgcmVtb3ZhYmxlOiBib29sZWFuO1xyXG5cclxuICBASW5wdXQoXCJtYXhsZW5ndGhcIilcclxuICBtYXhsZW5ndGg6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwibmFtZVwiKVxyXG4gIG5hbWU6IHN0cmluZztcclxuXHJcbiAgQElucHV0KFwicGxhY2Vob2xkZXJcIilcclxuICBwbGFjZWhvbGRlcjogYm9vbGVhbjtcclxuXHJcbiAgQElucHV0KFwicGFyZW50XCIpXHJcbiAgcGFyZW50OiBhbnk7XHJcblxyXG4gIEBJbnB1dChcImF1dG9jb21wbGV0ZVwiKVxyXG4gIGF1dG9jb21wbGV0ZTogc3RyaW5nW107XHJcblxyXG4gIEBJbnB1dChcInNlbGVjdGlvbnBvbGljeVwiKVxyXG4gIHNlbGVjdGlvbnBvbGljeTogU2VsZWN0aW9ucG9saWN5O1xyXG5cclxuICBASW5wdXQoXCJlZGl0cG9saWN5XCIpXHJcbiAgZWRpdHBvbGljeTogRWRpdFBvbGljeTtcclxuXHJcbiAgQElucHV0KFwiZHJhZ3BvbGljeVwiKVxyXG4gIGRyYWdwb2xpY3k6IERyYWdEcm9wUG9saWN5O1xyXG5cclxuICBAVmlld0NoaWxkKFwiZWRpdG9yXCIpXHJcbiAgZWRpdG9yO1xyXG5cclxuICBAVmlld0NoaWxkKFwic2VsZWN0b3JcIilcclxuICBzZWxlY3RvcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcImhvbGRlclwiKVxyXG4gIGhvbGRlcjtcclxuXHJcbiAgQFZpZXdDaGlsZChcImZpbGxlclwiKVxyXG4gIGZpbGxlcjtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGRhdGFUcmFuc2ZlcjogVGFnVHJhbnNmZXIsXHJcbiAgICBwcml2YXRlIGludG86IEluVG9QaXBlLFxyXG4gICAgcHVibGljIGVsOiBFbGVtZW50UmVmLCBcclxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyXHJcbiAgKXtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZHJhZ2dhYmxlID0gKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ3N0YXJ0JywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ1N0YXJ0KGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHRcclxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKCkpIHtcclxuICAgICAgICBldmVudC5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInNvdXJjZVwiLHRoaXMubmFtZSk7IC8vIHRoaXMgaXMgbmVlZGVkIHRvIGdldCB0aGUgZGFyZy9kcm9wIGdvaW5nLi5cclxuICAgICAgICB0aGlzLmRhdGFUcmFuc2Zlci5zZXREYXRhKFwic291cmNlXCIsdGhpcyk7IC8vIHRoaXMgaXMgbmVlZGVkIGJlY2F1c2UgZXZlbnQgZGF0YSB0cmFuc2ZlciB0YWtlcyBzdHJpbmcgbm90IGJqZWN0XHJcbiAgICAgIH1cclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZycsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWcoZXZlbnQ6IGFueSkge31cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnZW5kJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0VuZChldmVudDogYW55KSB7XHJcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1x0XHJcblxyXG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICB9XHJcbiAgQEhvc3RMaXN0ZW5lcignZHJvcCcsIFsnJGV2ZW50J10pXHJcbiAgZHJvcChldmVudDogYW55KSB7XHJcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCBmYWxzZSk7XHJcbiAgICB0aGlzLm9uZHJvcC5lbWl0KHtcclxuICAgICAgc291cmNlOiB0aGlzLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwic291cmNlXCIpLFxyXG4gICAgICBkZXN0aW5hdGlvbjogdGhpc1xyXG4gICAgfSlcclxuICB9XHJcbiAgXHJcbiAgQEhvc3RMaXN0ZW5lcignZHJhZ2VudGVyJywgWyckZXZlbnQnXSkgXHJcbiAgZHJhZ0VudGVyKGV2ZW50OiBhbnkpIHtcclxuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgaWYgKHRoaXMuYWxsb3dEcm9wKGV2ZW50KSkge1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRFbGVtZW50Q2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LCBcImRyYWctb3ZlclwiLCB0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gICAgICB9XHJcbiAgfVxyXG4gIFxyXG4gIEBIb3N0TGlzdGVuZXIoJ2RyYWdsZWF2ZScsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdMZWF2ZShldmVudDogYW55KSB7XHJcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgXHJcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgZmFsc2UpO1xyXG4gIH1cclxuICBcclxuICBASG9zdExpc3RlbmVyKCdkcmFnb3ZlcicsIFsnJGV2ZW50J10pIFxyXG4gIGRyYWdPdmVyKGV2ZW50OiBhbnkpIHtcclxuICAgICAgaWYgKHRoaXMuYWxsb3dEcm9wKGV2ZW50KSkge1xyXG4gICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgXCJkcmFnLW92ZXJcIiwgdHJ1ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldEVsZW1lbnRDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsIFwiZHJhZy1vdmVyXCIsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gIH1cclxuICBcclxuICBhbGxvd0Ryb3AoZXZlbnQ6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICBjb25zdCBzb3VyY2UgPSB0aGlzLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwic291cmNlXCIpO1xyXG4gICAgICBjb25zdCBhbGxvdyA9IChzb3VyY2UgJiYgc291cmNlLm5hbWUgIT0gdGhpcy5uYW1lKSAmJiBcclxuICAgICAgICAgICAgICAgICAgICAodGhpcy5uYW1lICYmIHRoaXMubmFtZS5sZW5ndGggPiAwKSAmJlxyXG4gICAgICAgICAgICAgICAgICAgICgoIXNvdXJjZS5mb3JtYXQgJiYgIXRoaXMuZm9ybWF0KSB8fCBzb3VyY2UuZm9ybWF0ID09IHRoaXMuZm9ybWF0KTtcclxuICAgICAgcmV0dXJuIGFsbG93O1xyXG4gIH1cclxuXHJcbiAgYWxsb3dEcmFnKCkgOiBib29sZWFuIHtcclxuICAgIHJldHVybiAodGhpcy5kcmFncG9saWN5ICE9PSBEcmFnRHJvcFBvbGljeS5kaXNhYmxlZCkgJiYgdGhpcy5uYW1lICYmIHRoaXMubmFtZS5sZW5ndGggPiAwO1xyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcigna2V5dXAnLCBbJyRldmVudCddKSBcclxuICBrZXl1cChldmVudDogYW55KSB7XHJcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgfHxcclxuICAgICAgICh0aGlzLmVkaXRvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuZWRpdG9yLm5hdGl2ZUVsZW1lbnQpKSB7XHJcbiAgICAgIGNvbnN0IGNvZGUgPSBldmVudC53aGljaDtcclxuICAgICAgaWYgKGNvZGUgPT09IDEzKSB7IC8vIGNhcmlhZ2UgcmV0dXJuXHJcbiAgICAgICAgdGhpcy5jbGljayhldmVudClcclxuICAgICAgfWVsc2UgaWYgKGNvZGUgPT09IDkgJiYgdGhpcy5lZGl0TW9kZSkgeyAvLyB0YWIgb3V0XHJcbiAgICAgICAgc2V0VGltZW91dCgoKT0+e1xyXG4gICAgICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lLmxlbmd0aCAmJiB0aGlzLm9yaWdpbmFsTmFtZSAhPT0gdGhpcy5uYW1lKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCA2Nik7XHJcbiAgICAgIH1lbHNlIGlmIChjb2RlID09PSAzOCkgeyAvLyBhcnJvdyB1cFxyXG4gICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPj0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyLS07XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gdGhpcy5maWxsZXJMaXN0Lmxlbmd0aCAtIDE7XHJcbiAgICAgICAgICB9ICAgICAgICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKGNvZGUgPT09IDQwKSB7IC8vIGFycm93IGRvd25cclxuICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdGVkRmlsbGVyIDwgKHRoaXMuZmlsbGVyTGlzdC5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyKys7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkRmlsbGVyID0gLTE7XHJcbiAgICAgICAgICB9ICAgXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0b3IgJiYgZXZlbnQudGFyZ2V0ID09PSB0aGlzLnNlbGVjdG9yLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICAgICAgdGhpcy5vbnNlbGVjdC5lbWl0KHRoaXMpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgIGlmICh0aGlzLmhvbGRlciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuaG9sZGVyLm5hdGl2ZUVsZW1lbnQpIHtcclxuICAgICAgY29uc3QgY29kZSA9IGV2ZW50LndoaWNoO1xyXG4gICAgICBpZiAoY29kZSA9PT0gMTMpIHsgLy8gY2FyaWFnZSByZXR1cm5cclxuICAgICAgICB0aGlzLmVkaXRNb2RlID0gdHJ1ZTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT50aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmZvY3VzKCksMzMpO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBjb2RlID0gZXZlbnQud2hpY2g7XHJcbiAgICAgIGlmIChjb2RlID09PSAxMykgeyAvLyBjYXJpYWdlIHJldHVyblxyXG4gICAgICAgIHRoaXMucmVtb3ZlKCk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH1cclxuICB9XHJcblxyXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJywgWyckZXZlbnQnXSkgXHJcbiAgY2xpY2soZXZlbnQ6IEV2ZW50KSB7XHJcbiAgICBpZiAodGhpcy5zZWxlY3RvciAmJiBldmVudC50YXJnZXQgPT09IHRoaXMuc2VsZWN0b3IubmF0aXZlRWxlbWVudCkge1xyXG4gICAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICAgIHRoaXMub25zZWxlY3QuZW1pdCh0aGlzKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNFZGl0YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMuZWRpdE1vZGUgPSAhdGhpcy5lZGl0TW9kZTtcclxuICAgICAgaWYgKHRoaXMuZWRpdE1vZGUpIHtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpPT57XHJcbiAgICAgICAgICBpZiAodGhpcy5maWxsZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZEZpbGxlciA9IC0xO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUZpbGxlckxpc3QodGhpcy5uYW1lKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh0aGlzLmVkaXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvci5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmZpbGxlcikge1xyXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIuc2V0RWxlbWVudENsYXNzKHRoaXMuZmlsbGVyLm5hdGl2ZUVsZW1lbnQsIFwib2ZmXCIsIGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sNjYpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuc2VsZWN0ZWRGaWxsZXIgPj0gMCkge1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHRoaXMuZmlsbGVyTGlzdFt0aGlzLnNlbGVjdGVkRmlsbGVyXTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUubGVuZ3RoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxOYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICAgIHRoaXMub25jaGFuZ2UuZW1pdCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCF0aGlzLmVkaXRNb2RlKSB7XHJcbiAgICAgICAgICBzZXRUaW1lb3V0KCgpPT57dGhpcy5lbC5uYXRpdmVFbGVtZW50LmZvY3VzKCkgfSw2Nik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMub25hZGQuZW1pdCh0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgQEhvc3RMaXN0ZW5lcignZm9jdXMnLCBbJyRldmVudCddKSBcclxuICBmb2N1cyhldmVudDogYW55KSB7XHJcbiAgICBpZiAodGhpcy5pc1NlbGVjdGFibGUoKSkge1xyXG4gICAgICB0aGlzLm9uZm9jdXMuZW1pdCh0aGlzKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaXNSZW1vdmFibGUoKSB7XHJcbiAgICBsZXQgY2FuUmVtb3ZlID0gKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5hZGRBbmRSZW1vdmUpO1xyXG5cclxuICAgIGNhblJlbW92ZSA9IGNhblJlbW92ZSB8fCAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZFJlbW92ZU1vZGlmeSk7XHJcbiAgICBjYW5SZW1vdmUgPSBjYW5SZW1vdmUgfHwgKHRoaXMuZWRpdHBvbGljeSA9PT0gRWRpdFBvbGljeS5yZW1vdmVPbmx5KTtcclxuICAgIFxyXG4gICAgcmV0dXJuICBjYW5SZW1vdmU7XHJcbiAgfVxyXG5cclxuICBpc0VkaXRhYmxlKCkge1xyXG4gICAgcmV0dXJuICAodGhpcy5lZGl0cG9saWN5ID09PSBFZGl0UG9saWN5LmFkZFJlbW92ZU1vZGlmeSk7XHJcbiAgfVxyXG5cclxuICBpc0RyYWdnYWJsZSgpIHtcclxuICAgIHJldHVybiAgKHRoaXMuZHJhZ3BvbGljeSAhPT0gRHJhZ0Ryb3BQb2xpY3kuZGlzYWJsZWQpO1xyXG4gIH1cclxuXHJcbiAgaXNTZWxlY3RhYmxlKCkge1xyXG4gICAgcmV0dXJuICAodGhpcy5zZWxlY3Rpb25wb2xpY3kgIT09IFNlbGVjdGlvbnBvbGljeS5kaXNhYmxlZCk7XHJcbiAgfVxyXG4gIHNlbGVjdCgpIHtcclxuICAgIFxyXG4gIH1cclxuXHJcbiAgdGFib3V0KGV2ZW50OiBhbnkpIHtcclxuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICB0aGlzLm5hbWUgPSB0aGlzLnNlbGVjdGVkRmlsbGVyIDwgMCA/IGV2ZW50LnRhcmdldC52YWx1ZSA6IHRoaXMuZmlsbGVyTGlzdFt0aGlzLnNlbGVjdGVkRmlsbGVyXTtcclxuICAgICAgdGhpcy5lZGl0TW9kZSA9IGZhbHNlO1xyXG4gICAgICBpZiAodGhpcy5vcmlnaW5hbE5hbWUubGVuZ3RoICYmIHRoaXMub3JpZ2luYWxOYW1lICE9PSB0aGlzLm5hbWUpIHtcclxuICAgICAgICB0aGlzLm9uY2hhbmdlLmVtaXQodGhpcyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5vbmFkZC5lbWl0KHRoaXMpO1xyXG4gICAgICB9XHJcbiAgICB9LCA2NilcclxuICB9XHJcbiAgZWRpdChldmVudDogYW55KSB7XHJcbiAgICB0aGlzLm5hbWUgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICB0aGlzLnVwZGF0ZUZpbGxlckxpc3QodGhpcy5uYW1lKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZUZpbGxlckxpc3QodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSAmJiB0aGlzLmF1dG9jb21wbGV0ZSBpbnN0YW5jZW9mIEFycmF5KXtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgdGhpcy5maWxsZXJMaXN0ID0gdGhpcy5hdXRvY29tcGxldGUuZmlsdGVyKChpdGVtKSA9PiBpdGVtLmluZGV4T2YodmFsdWUpID49IDApO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5vcmlnaW5hbE5hbWUgPSB0aGlzLm5hbWU7XHJcbiAgfVxyXG4gIHJlc2V0KCkge1xyXG4gICAgdGhpcy5uYW1lID0gdGhpcy5vcmlnaW5hbE5hbWU7XHJcbiAgfVxyXG5cclxuICByZW1vdmUoKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlbW92YWJsZSgpKSB7XHJcbiAgICAgIHRoaXMub25yZW1vdmUuZW1pdCh0aGlzKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZvcm1hdHRlZE5hbWUoKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5uYW1lO1xyXG4gICAgaWYgKHRoaXMuZm9ybWF0KSB7XHJcbiAgICAgIHJlc3VsdCA9IHRoaXMuaW50by50cmFuc2Zvcm0odGhpcy5uYW1lLCB0aGlzLmZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuIl19