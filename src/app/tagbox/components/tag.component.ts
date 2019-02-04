/*
 * A comparision tree will layout each attribute of a json deep through its heirarchy with given visual queues
 * that represents a deletion, adition, or change of attribute from the other tree. The status of each node is 
 * evaluated by the parent comparision tool.
 */
import {
  Component,
  OnInit,
  Input,
  Output,
  HostListener,
  ElementRef,
  Renderer,
  ViewChild,
  EventEmitter
} from '@angular/core';

import { InToPipe } from '@sedeh/into-pipes';

import {
  DragDropPolicy,
  Selectionpolicy,
  EditPolicy
} from '../interfaces/tagbox.interfaces';

import { TagTransfer } from './tag.transfer';

@Component({
  selector: 'tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit {
  editMode: boolean;

  originalName: string;
  selectedFiller = -1;
  fillerList: string[];

  @Output("onfocus")
  onfocus= new EventEmitter()

  @Output("onchange")
  onchange= new EventEmitter()

  @Output("onselect")
  onselect= new EventEmitter()

  @Output("onremove")
  onremove= new EventEmitter()

  @Output("onadd")
  onadd= new EventEmitter()

  @Output("ondrop")
  ondrop= new EventEmitter()

  @Input("format")
  format: string;

  @Input("removable")
  removable: boolean;

  @Input("maxlength")
  maxlength: string;

  @Input("name")
  name: string;

  @Input("placeholder")
  placeholder: boolean;

  @Input("parent")
  parent: any;

  @Input("autocomplete")
  autocomplete: string[];

  @Input("selectionpolicy")
  selectionpolicy: Selectionpolicy;

  @Input("editpolicy")
  editpolicy: EditPolicy;

  @Input("dragpolicy")
  dragpolicy: DragDropPolicy;

  @ViewChild("editor")
  editor;

  @ViewChild("selector")
  selector;

  @ViewChild("holder")
  holder;

  @ViewChild("filler")
  filler;

  constructor(
    private dataTransfer: TagTransfer,
    private into: InToPipe,
    public el: ElementRef, 
    private renderer: Renderer
  ){
  }

  ngOnInit() {
    this.init();
    this.el.nativeElement.draggable = (this.dragpolicy !== DragDropPolicy.disabled);
  }

  @HostListener('dragstart', ['$event']) 
  dragStart(event: any) {
      event.stopPropagation();	
      if (this.allowDrag()) {
        if (!this.isIE()) {
          event.dataTransfer.setData("source",this.name); // this is needed to get the darg/drop going..
        }
        this.dataTransfer.setData("source",this); // this is needed because event data transfer takes string not bject
      }
  }
  @HostListener('drag', ['$event']) 
  drag(event: any) {}
  
  @HostListener('dragend', ['$event']) 
  dragEnd(event: any) {
      event.stopPropagation();	

      this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
  }
  @HostListener('drop', ['$event'])
  drop(event: any) {
    event.preventDefault();
    this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    this.ondrop.emit({
      source: this.dataTransfer.getData("source"),
      destination: this
    })
  }
  @HostListener('dragenter', ['$event']) 
  dragEnter(event: any) {
      event.preventDefault();
      if (this.allowDrop(event)) {
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
      } else {
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
      }
  }
  @HostListener('dragleave', ['$event']) 
  dragLeave(event: any) {
      event.preventDefault();
              
      this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
  }
  @HostListener('dragover', ['$event']) 
  dragOver(event: any) {
      if (this.allowDrop(event)) {
          event.preventDefault();
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
      } else {
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
      }
  }
  private isIE() {
    const match = navigator.userAgent.search(/(?:Edge|MSIE|Trident\/.*; rv:)/);
    let isIE = false;

    if (match !== -1) {
        isIE = true;
    }
    return isIE;
  }
  allowDrop(event: any): boolean {
      const source = this.dataTransfer.getData("source");
      const allow = (source && source.name != this.name) && 
                    (this.name && this.name.length > 0) &&
                    ((!source.format && !this.format) || source.format == this.format);
      return allow;
  }

  allowDrag() : boolean {
    return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
  }

  @HostListener('keyup', ['$event']) 
  keyup(event: any) {
    if (event.target === this.el.nativeElement ||
       (this.editor && event.target === this.editor.nativeElement)) {
      const code = event.which;
      if (code === 13) { // cariage return
        this.click(event)
      }else if (code === 9 && this.editMode) { // tab out
        setTimeout(()=>{
          this.editMode = false;
          if (this.originalName.length && this.originalName !== this.name) {
            this.onchange.emit(this);
          } else {
            this.onadd.emit(this);
          }
        }, 66);
      }else if (code === 38) { // arrow up
        if (this.filler) {
          if (this.selectedFiller >= 0) {
            this.selectedFiller--;
          } else {
            this.selectedFiller = this.fillerList.length - 1;
          }         
        }
      } else if (code === 40) { // arrow down
        if (this.filler) {
          if (this.selectedFiller < (this.fillerList.length - 1)) {
            this.selectedFiller++;
          } else {
            this.selectedFiller = -1;
          }   
        }
      }
    } else if (this.selector && event.target === this.selector.nativeElement) {
      const code = event.which;
      if (code === 13) { // cariage return
        if (this.isSelectable()) {
          this.onselect.emit(this)
        }
      }
    } else  if (this.holder && event.target === this.holder.nativeElement) {
      const code = event.which;
      if (code === 13) { // cariage return
        this.editMode = true;
        setTimeout(()=>this.editor.nativeElement.focus(),33);
      }      
    } else {
      const code = event.which;
      if (code === 13) { // cariage return
        this.remove();
      }      
    }
  }

  @HostListener('click', ['$event']) 
  click(event: Event) {
    if (this.selector && event.target === this.selector.nativeElement) {
      if (this.isSelectable()) {
        this.onselect.emit(this)
      }
    } else if (this.isEditable()) {
      this.editMode = !this.editMode;
      if (this.editMode) {
        setTimeout(()=>{
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
        },66);
      } else if (this.selectedFiller >= 0) {
        this.name = this.fillerList[this.selectedFiller];
      }
      if (this.originalName.length) {
        if (this.originalName !== this.name) {
          this.onchange.emit(this);
        }
        if (!this.editMode) {
          setTimeout(()=>{this.el.nativeElement.focus() },66);
        }
      } else {
        this.onadd.emit(this);
      }
    }
  }

  @HostListener('focus', ['$event']) 
  focus(event: any) {
    if (this.isSelectable()) {
      this.onfocus.emit(this)
    }
  }

  isRemovable() {
    let canRemove = (this.editpolicy === EditPolicy.addAndRemove);

    canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
    canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
    
    return  canRemove;
  }

  isEditable() {
    return  (this.editpolicy === EditPolicy.addRemoveModify);
  }

  isDraggable() {
    return  (this.dragpolicy !== DragDropPolicy.disabled);
  }

  isSelectable() {
    return  (this.selectionpolicy !== Selectionpolicy.disabled);
  }
  select() {
    
  }

  tabout(event: any) {
    setTimeout(() => {
      this.name = this.selectedFiller < 0 ? event.target.value : this.fillerList[this.selectedFiller];
      this.editMode = false;
      if (this.originalName.length && this.originalName !== this.name) {
        this.onchange.emit(this);
      } else {
        this.onadd.emit(this);
      }
    }, 66)
  }
  edit(event: any) {
    this.name = event.target.value;
    this.updateFillerList(this.name);
  }

  updateFillerList(value) {
    if (value && this.autocomplete instanceof Array){
      if (value) {
        this.fillerList = this.autocomplete.filter((item) => item.indexOf(value) >= 0);
      }
    }
  }

  init() {
    this.originalName = this.name;
  }
  reset() {
    this.name = this.originalName;
  }

  remove() {
    if (this.isRemovable()) {
      this.onremove.emit(this);
    }
  }

  formattedName() {
    let result = this.name;
    if (this.format) {
      result = this.into.transform(this.name, this.format);
    }
    return result;
  }

}
