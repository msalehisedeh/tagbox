import { Component, Input, Output, EventEmitter, ElementRef, Renderer, HostListener, ViewChild, NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { InToPipe, IntoPipeModule } from 'into-pipes';
import { CommonModule } from '@angular/common';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/** @enum {number} */
const DragDropPolicy = {
    disabled: 1,
    appendOnDrop: 2,
    prependOnDrop: 3,
    swapOnDrop: 4,
};
DragDropPolicy[DragDropPolicy.disabled] = "disabled";
DragDropPolicy[DragDropPolicy.appendOnDrop] = "appendOnDrop";
DragDropPolicy[DragDropPolicy.prependOnDrop] = "prependOnDrop";
DragDropPolicy[DragDropPolicy.swapOnDrop] = "swapOnDrop";
/** @enum {number} */
const EditPolicy = {
    viewOnly: 1,
    addOnly: 2,
    removeOnly: 4,
    addAndRemove: 6,
};
EditPolicy[EditPolicy.viewOnly] = "viewOnly";
EditPolicy[EditPolicy.addOnly] = "addOnly";
EditPolicy[EditPolicy.removeOnly] = "removeOnly";
EditPolicy[EditPolicy.addAndRemove] = "addAndRemove";
/** @enum {number} */
const Selectionpolicy = {
    disabled: 1,
    multiSelect: 2,
    singleSelect: 3,
};
Selectionpolicy[Selectionpolicy.disabled] = "disabled";
Selectionpolicy[Selectionpolicy.multiSelect] = "multiSelect";
Selectionpolicy[Selectionpolicy.singleSelect] = "singleSelect";

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class TagBoxComponent {
    /**
     * @param {?} renderer
     * @param {?} el
     */
    constructor(renderer, el) {
        this.renderer = renderer;
        this.el = el;
        this._tags = [];
        this._selectedindex = [];
        this.onchange = new EventEmitter();
        this.onselect = new EventEmitter();
        this.beforeAction = (event) => true;
        this.placeholder = "Add Tag";
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.selectedindex &&
            (this.selectedindex instanceof String) &&
            (this.tags && !(this.tags instanceof String))) {
            const /** @type {?} */ x = String(this.selectedindex);
            const /** @type {?} */ list = x.split(",");
            list.map((t) => {
                this._selectedindex.push(parseInt(t));
            });
        }
        else {
            this._selectedindex = this.selectedindex ? this.selectedindex : [];
        }
        if (this.tags && !(this.tags instanceof Array)) {
            const /** @type {?} */ x = String(this.tags);
            this._tags = x.split(this.delineateby ? this.delineateby : ",");
        }
        else {
            this._tags = this.tags;
        }
        this.renderer.setElementAttribute(this.el.nativeElement, "role", "list");
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
    }
    /**
     * @param {?} index
     * @return {?}
     */
    itemSelectedAt(index) {
        const /** @type {?} */ canSelect = this.selectionpolicy !== Selectionpolicy.disabled;
        return this._selectedindex.indexOf(index) < 0 ? false : canSelect;
    }
    /**
     * @param {?} index
     * @return {?}
     */
    itemSelectionClass(index) {
        const /** @type {?} */ selected = this.itemSelectedAt(index);
        return selected ? "selected" : ((index < 0 || this.selectionpolicy === Selectionpolicy.disabled) ? "left-padded" : "");
    }
    /**
     * @return {?}
     */
    isRemovable() {
        let /** @type {?} */ canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        canRemove = canRemove && (!this.mintags || (this._tags.length > this.mintags));
        return canRemove;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    isDuplicate(name) {
        return this._tags.indexOf(name) < 0 ? false : true;
    }
    /**
     * @param {?} tag
     * @return {?}
     */
    allowedToaddItem(tag) {
        let /** @type {?} */ canAdd = (this.editpolicy === EditPolicy.addAndRemove);
        canAdd = canAdd || (this.editpolicy === EditPolicy.addOnly);
        canAdd = canAdd && (!this.maxtags || (this._tags.length < this.maxtags - 1));
        canAdd = canAdd && !this.isDuplicate(tag.name);
        if (canAdd && this.maxtaglength) {
            const /** @type {?} */ x = this._tags.join(this.delineateby ? this.delineateby : ",");
            if (x.length + tag.name.length + 1 >= this.maxboxlength) {
                canAdd = false;
                this.renderer.setElementClass(this.el.nativeElement, "alert", true);
            }
            else {
                this.renderer.setElementClass(this.el.nativeElement, "alert", false);
            }
        }
        return canAdd;
    }
    /**
     * @return {?}
     */
    notifyChange() {
        this.tags = (this.tags instanceof Array) ? this._tags : this._tags.join(this.delineateby ? this.delineateby : ",");
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onchange.emit({
            id: this.id,
            tags: this.tags,
            selecedIndex: this.selectedindex
        });
    }
    /**
     * @return {?}
     */
    notifySelection() {
        this.selectedindex = !(this.selectedindex instanceof Array) ?
            this._selectedindex :
            (this._selectedindex.length ? this._selectedindex.join(",") : "");
        this.onselect.emit({
            id: this.id,
            selecedIndex: this.selectedindex
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagRemove(event) {
        if (this.isRemovable() && this.beforeAction({ request: "remove", item: event.name })) {
            const /** @type {?} */ index = this._tags.indexOf(event.name);
            const /** @type {?} */ i = this._selectedindex.indexOf(index);
            this._tags.splice(index, 1);
            if (i >= 0) {
                this._selectedindex.splice(i, 1);
                this.notifyChange();
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagAdd(event) {
        let /** @type {?} */ index = this._tags.indexOf(event.name);
        const /** @type {?} */ i = this._selectedindex.indexOf(index);
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagChange(event) {
        if (!this.isDuplicate(event.name) && this.beforeAction({ request: "change", item: event.originalName, to: event.name })) {
            const /** @type {?} */ index = this._tags.indexOf(event.originalName);
            this._tags[index] = event.name;
            event.init();
            this.notifyChange();
        }
        else {
            event.reset();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagDrop(event) {
        const /** @type {?} */ sind = this._tags.indexOf(event.source);
        const /** @type {?} */ dind = this._tags.indexOf(event.destination);
        if (this.dragpolicy === DragDropPolicy.appendOnDrop) {
            const /** @type {?} */ i = this._selectedindex.indexOf(sind);
            const /** @type {?} */ name = event.destination + " " + event.source;
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
            const /** @type {?} */ i = this._selectedindex.indexOf(sind);
            const /** @type {?} */ name = event.source + " " + event.destination;
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagSelect(event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            this.onTagFocus(event);
            if (this.beforeAction({ request: "select", item: event.name })) {
                if (this.selectionpolicy === Selectionpolicy.singleSelect) {
                    const /** @type {?} */ list = this.el.nativeElement.childNodes;
                    for (let /** @type {?} */ i = 0; i < list.length; i++) {
                        // 3 is text and 8 is comment
                        if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                            this.renderer.setElementClass(list[i], "selected", false);
                        }
                    }
                    const /** @type {?} */ index = this._tags.indexOf(event.name);
                    if (index >= 0) {
                        const /** @type {?} */ i = this._selectedindex.indexOf(index);
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
                    const /** @type {?} */ index = this._tags.indexOf(event.name);
                    if (index >= 0) {
                        const /** @type {?} */ i = this._selectedindex.indexOf(index);
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onTagFocus(event) {
        if (this.selectionpolicy !== Selectionpolicy.disabled) {
            const /** @type {?} */ list = this.el.nativeElement.childNodes;
            for (let /** @type {?} */ i = 0; i < list.length; i++) {
                // 3 is text and 8 is comment
                if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
                    this.renderer.setElementClass(list[i], "focused", false);
                }
            }
            const /** @type {?} */ index = this._tags.indexOf(event.name);
            if (index >= 0) {
                this.renderer.setElementClass(event.el.nativeElement, "focused", true);
            }
        }
    }
}
TagBoxComponent.decorators = [
    { type: Component, args: [{
                selector: 'tagbox',
                template: `
<tag theme
    *ngFor="let t of _tags; let i=index"
    tabindex="0"
    [class]="itemSelectionClass(i)"
    [name]="t"
    [removable]="isRemovable()"
    [maxlength]="maxtaglength"
    [format]="format"
    [autocomplete]="autocomplete"
    [attr.role]="'listitem'"
    [selectionpolicy]="selectionpolicy"
    [editpolicy]="editpolicy"
    [dragpolicy]="dragpolicy"
    (ondrop)="onTagDrop($event)"
    (onchange)="onTagChange($event)"
    (onadd)="onTagAdd($event)"
    (onremove)="onTagRemove($event)"
    (onselect)="onTagSelect($event)"
    (onfocus)="onTagFocus($event)">
</tag><tag theme
    placeholder
    tabindex="0"
    name=""
    [class]="itemSelectionClass(-1)"
    [maxlength]="maxtaglength"
    [placeholder]="placeholder"
    [format]="format"
    [autocomplete]="autocomplete"
    [attr.role]="'listitem'"
    [selectionpolicy]="selectionpolicy"
    [editpolicy]="editpolicy"
    [dragpolicy]="dragpolicy"
    (ondrop)="onTagDrop($event)"
    (onchange)="onTagChange($event)"
    (onadd)="onTagAdd($event)"
    (onremove)="onTagRemove($event)"
    (onfocus)="onTagFocus($event)"></tag>
`,
                styles: [`:host{
  background-color:#fff;
  border:1px inset #888;
  -webkit-box-sizing:border-box;
  box-sizing:border-box;
  display:inline-block;
  min-height:50px;
  padding:5px;
  width:100%;
  border-radius:5px;
  margin-bottom:5px; }
  :host.alert{
    background-color:#ff9f9b;
    border-color:#880500; }
:host:focus{
  border-color:#0ba; }
:host:hover{
  background-color:#ddd; }
`],
            },] },
];
/** @nocollapse */
TagBoxComponent.ctorParameters = () => [
    { type: Renderer, },
    { type: ElementRef, },
];
TagBoxComponent.propDecorators = {
    "onchange": [{ type: Output, args: ["onchange",] },],
    "onselect": [{ type: Output, args: ["onselect",] },],
    "beforeAction": [{ type: Input, args: ["beforeAction",] },],
    "id": [{ type: Input, args: ["id",] },],
    "placeholder": [{ type: Input, args: ["placeholder",] },],
    "maxboxlength": [{ type: Input, args: ["maxboxlength",] },],
    "maxtaglength": [{ type: Input, args: ["maxtaglength",] },],
    "maxtags": [{ type: Input, args: ["maxtags",] },],
    "mintags": [{ type: Input, args: ["mintags",] },],
    "tags": [{ type: Input, args: ["tags",] },],
    "selectedindex": [{ type: Input, args: ["selectedindex",] },],
    "delineateby": [{ type: Input, args: ["delineateby",] },],
    "format": [{ type: Input, args: ["format",] },],
    "autocomplete": [{ type: Input, args: ["autocomplete",] },],
    "selectionpolicy": [{ type: Input, args: ["selectionpolicy",] },],
    "editpolicy": [{ type: Input, args: ["editpolicy",] },],
    "dragpolicy": [{ type: Input, args: ["dragpolicy",] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class TagComponent {
    /**
     * @param {?} into
     * @param {?} el
     * @param {?} renderer
     */
    constructor(into, el, renderer) {
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
    ngOnInit() {
        this.init();
        this.el.nativeElement.draggable = (this.dragpolicy !== DragDropPolicy.disabled);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragStart(event) {
        event.stopPropagation();
        if (this.allowDrag()) {
            event.dataTransfer.setData("source", this.name);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drag(event) { }
    /**
     * @param {?} event
     * @return {?}
     */
    dragEnd(event) {
        event.stopPropagation();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    drop(event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        this.ondrop.emit({
            source: event.dataTransfer.getData("source"),
            destination: this.name
        });
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragEnter(event) {
        event.preventDefault();
        if (this.allowDrop(event)) {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragLeave(event) {
        event.preventDefault();
        this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    dragOver(event) {
        if (this.allowDrop(event)) {
            event.preventDefault();
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
        }
        else {
            this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    allowDrop(event) {
        const /** @type {?} */ source = event.dataTransfer.getData("source");
        return (source && source != this.name) && this.name && this.name.length > 0;
    }
    /**
     * @return {?}
     */
    allowDrag() {
        return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    keyup(event) {
        if (event.target === this.el.nativeElement ||
            (this.editor && event.target === this.editor.nativeElement)) {
            const /** @type {?} */ code = event.which;
            if (code === 13) {
                // cariage return
                this.click(event);
            }
            else if (code === 9 && this.editMode) {
                // tab out
                setTimeout(() => {
                    this.editMode = false;
                    if (this.originalName.length && this.originalName !== this.name) {
                        this.onchange.emit(this);
                    }
                    else {
                        this.onadd.emit(this);
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
            const /** @type {?} */ code = event.which;
            if (code === 13) {
                // cariage return
                if (this.isSelectable()) {
                    this.onselect.emit(this);
                }
            }
        }
        else {
            const /** @type {?} */ code = event.which;
            if (code === 13) {
                // cariage return
                this.remove();
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    click(event) {
        if (this.selector && event.target === this.selector.nativeElement) {
            if (this.isSelectable()) {
                this.onselect.emit(this);
            }
        }
        else if (this.isEditable()) {
            this.editMode = !this.editMode;
            if (this.editMode) {
                setTimeout(() => {
                    if (this.filler) {
                        this.selectedFiller = -1;
                        this.updateFillerList(this.name);
                    }
                    if (this.editor) {
                        this.editor.nativeElement.focus();
                        if (this.filler) {
                            this.renderer.setElementClass(this.filler.nativeElement, "off", false);
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
                    setTimeout(() => { this.el.nativeElement.focus(); }, 66);
                }
            }
            else {
                this.onadd.emit(this);
            }
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    focus(event) {
        if (this.isSelectable()) {
            this.onfocus.emit(this);
        }
    }
    /**
     * @return {?}
     */
    isRemovable() {
        let /** @type {?} */ canRemove = (this.editpolicy === EditPolicy.addAndRemove);
        canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
        return canRemove;
    }
    /**
     * @return {?}
     */
    isEditable() {
        return (this.editpolicy !== EditPolicy.viewOnly);
    }
    /**
     * @return {?}
     */
    isDraggable() {
        return (this.dragpolicy !== DragDropPolicy.disabled);
    }
    /**
     * @return {?}
     */
    isSelectable() {
        return (this.selectionpolicy !== Selectionpolicy.disabled);
    }
    /**
     * @return {?}
     */
    select() {
    }
    /**
     * @param {?} event
     * @return {?}
     */
    tabout(event) {
        setTimeout(() => {
            this.name = this.selectedFiller < 0 ? event.target.value : this.fillerList[this.selectedFiller];
            this.editMode = false;
            if (this.originalName.length && this.originalName !== this.name) {
                this.onchange.emit(this);
            }
            else {
                this.onadd.emit(this);
            }
        }, 66);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    edit(event) {
        this.name = event.target.value;
        this.updateFillerList(this.name);
    }
    /**
     * @param {?} value
     * @return {?}
     */
    updateFillerList(value) {
        if (value && this.autocomplete instanceof Array) {
            if (value) {
                this.fillerList = this.autocomplete.filter((item) => item.indexOf(value) >= 0);
            }
        }
    }
    /**
     * @return {?}
     */
    init() {
        this.originalName = this.name;
    }
    /**
     * @return {?}
     */
    reset() {
        this.name = this.originalName;
    }
    /**
     * @return {?}
     */
    remove() {
        if (this.isRemovable()) {
            this.onremove.emit(this);
        }
    }
    /**
     * @return {?}
     */
    formattedName() {
        let /** @type {?} */ result = this.name;
        if (this.format) {
            result = this.into.transform(this.name, this.format);
        }
        return result;
    }
}
TagComponent.decorators = [
    { type: Component, args: [{
                selector: 'tag',
                template: `
<span #selector
    *ngIf="!editMode && removable && isSelectable()"
    tabindex="0"
    class="selection fa"
    (click)="select()"></span>
<input
    *ngIf="editMode"
    class="editor"
    (blur)="tabout($event)"
    (keyup)="edit($event)"
    [value]="name"
    [attr.maxlength]="maxlength"
    [attr.placeholder]="placeholder" #editor/>
<div class="autocomplete off" *ngIf="editMode && autocomplete" #filler>
  <ul>
      <li *ngFor="let x of fillerList; let i = index"
        (click)="selectedFiller = i"
        [class.selected]="selectedFiller === i"
        [textContent]="x"></li>
  </ul>
</div>
<span
    *ngIf="!editMode"
    class="holder"
    [innerHTML]="placeholder ? placeholder : formattedName()"></span>
<span
    *ngIf="!editMode && removable"
    tabindex="0"
    class="remove fa fa-times"
    (click)="remove()"></span>
<span
    *ngIf="!removable"
    class="placeholder fa fa-plus-circle"></span>`,
                styles: [`:host{
  cursor:pointer;
  color:#fdfdfd;
  margin:4px 2px;
  display:inline-block;
  background-color:#1F84AB;
  border:1px solid #015E85;
  border-radius:8px 20px 20px 8px;
  -webkit-box-sizing:border-box;
          box-sizing:border-box;
  padding:3px 0;
  position:relative; }
  :host ::ng-deep img{
    width:50px; }
  :host.left-padded{
    padding-left:8px; }
  :host.drag-over:hover{
    background-color:#add8e6;
    cursor:move; }
  :host[placeholder]{
    background-color:transparent;
    color:#000;
    border:0; }
    :host[placeholder]:hover{
      background-color:#eee !important; }
    :host[placeholder] .editor{
      color:#000; }
  :host:hover{
    background-color:#027912 !important;
    border-color:#024b0b !important; }
  :host.focused{
    background-color:#027912 !important;
    border-color:#024b0b !important; }
  :host.selected:hover{
    background-color:#D6534E; }
  :host.selected{
    background-color:#D6534E; }
    :host.selected .selection.fa:before{
      content:"\\f00c" !important; }
  :host .selection{
    background-color:transparent;
    float:left;
    margin-right:3px;
    padding:0;
    width:10px;
    height:10px;
    font-size:0.8rem;
    padding:5px 3px; }
    :host .selection.fa:before{
      content:"\\f013"; }
  :host .editor{
    background-color:transparent;
    overflow:unset;
    max-width:inherit;
    width:inherit;
    color:#fff;
    border:none; }
  :host .placeholder{
    color:#888585;
    float:right;
    font-size:1rem;
    height:20px;
    line-height:20px;
    margin-left:5px;
    text-align:center;
    width:20px; }
  :host .remove{
    float:right;
    font-size:0.7rem;
    height:20px;
    width:20px;
    color:#fff;
    text-align:center;
    margin-left:5px;
    line-height:20px;
    font-weight:bolder; }
  :host .holder{
    pointer-events:none;
    -webkit-user-select:none;
    -moz-user-select:none;
    -ms-user-select:none;
    user-select:none; }
  :host .autocomplete{
    position:absolute;
    top:26px;
    z-index:5; }
    :host .autocomplete.off{
      display:none; }
    :host .autocomplete ul{
      border:1px solid #024b0b;
      border-top:0;
      list-style:none;
      background-color:#027912;
      list-style-position:inside;
      margin:0;
      max-height:150px;
      overflow-y:auto;
      padding:0; }
      :host .autocomplete ul li{
        color:#fdfdfd;
        padding:5px;
        white-space:nowrap; }
        :host .autocomplete ul li.selected{
          background-color:#D6534E; }
        :host .autocomplete ul li:hover{
          background-color:#0446a8;
          color:#fff; }
`],
            },] },
];
/** @nocollapse */
TagComponent.ctorParameters = () => [
    { type: InToPipe, },
    { type: ElementRef, },
    { type: Renderer, },
];
TagComponent.propDecorators = {
    "onfocus": [{ type: Output, args: ["onfocus",] },],
    "onchange": [{ type: Output, args: ["onchange",] },],
    "onselect": [{ type: Output, args: ["onselect",] },],
    "onremove": [{ type: Output, args: ["onremove",] },],
    "onadd": [{ type: Output, args: ["onadd",] },],
    "ondrop": [{ type: Output, args: ["ondrop",] },],
    "format": [{ type: Input, args: ["format",] },],
    "removable": [{ type: Input, args: ["removable",] },],
    "maxlength": [{ type: Input, args: ["maxlength",] },],
    "name": [{ type: Input, args: ["name",] },],
    "placeholder": [{ type: Input, args: ["placeholder",] },],
    "autocomplete": [{ type: Input, args: ["autocomplete",] },],
    "selectionpolicy": [{ type: Input, args: ["selectionpolicy",] },],
    "editpolicy": [{ type: Input, args: ["editpolicy",] },],
    "dragpolicy": [{ type: Input, args: ["dragpolicy",] },],
    "editor": [{ type: ViewChild, args: ["editor",] },],
    "selector": [{ type: ViewChild, args: ["selector",] },],
    "filler": [{ type: ViewChild, args: ["filler",] },],
    "dragStart": [{ type: HostListener, args: ['dragstart', ['$event'],] },],
    "drag": [{ type: HostListener, args: ['drag', ['$event'],] },],
    "dragEnd": [{ type: HostListener, args: ['dragend', ['$event'],] },],
    "drop": [{ type: HostListener, args: ['drop', ['$event'],] },],
    "dragEnter": [{ type: HostListener, args: ['dragenter', ['$event'],] },],
    "dragLeave": [{ type: HostListener, args: ['dragleave', ['$event'],] },],
    "dragOver": [{ type: HostListener, args: ['dragover', ['$event'],] },],
    "keyup": [{ type: HostListener, args: ['keyup', ['$event'],] },],
    "click": [{ type: HostListener, args: ['click', ['$event'],] },],
    "focus": [{ type: HostListener, args: ['focus', ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class TagBoxModule {
}
TagBoxModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
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
                providers: [],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] },
];
/** @nocollapse */
TagBoxModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { TagBoxComponent, DragDropPolicy, EditPolicy, Selectionpolicy, TagBoxModule, TagComponent as ɵa };
//# sourceMappingURL=tagbox.js.map
