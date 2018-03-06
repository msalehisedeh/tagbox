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

import {
  DragDropPolicy,
  Selectionpolicy,
  EditPolicy
} from '../interfaces/tagbox.interfaces';

import { InToPipe } from 'into-pipes';

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

  @ViewChild("filler")
  filler;

  constructor(
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
  dragStart(event) {
      event.stopPropagation();	
      if (this.allowDrag()) {
          event.dataTransfer.setData("source",this.name);
      }
  }
  @HostListener('drag', ['$event']) 
  drag(event) {}
  
  @HostListener('dragend', ['$event']) 
  dragEnd(event) {
      event.stopPropagation();	

      this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
  }
  @HostListener('drop', ['$event'])
  drop(event) {
    event.preventDefault();
    this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
    this.ondrop.emit({
      source: event.dataTransfer.getData("source"),
      destination: this.name
    })
  }
  
  @HostListener('dragenter', ['$event']) 
  dragEnter(event) {
      event.preventDefault();
      if (this.allowDrop(event)) {
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
      } else {
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
      }
  }
  
  @HostListener('dragleave', ['$event']) 
  dragLeave(event) {
      event.preventDefault();
              
      this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
  }
  
  @HostListener('dragover', ['$event']) 
  dragOver(event) {
      if (this.allowDrop(event)) {
          event.preventDefault();
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", true);
      } else {
          this.renderer.setElementClass(this.el.nativeElement, "drag-over", false);
      }
  }
  
  allowDrop(event): boolean {
      const source = event.dataTransfer.getData("source");

      return (source && source != this.name) && this.name && this.name.length > 0;
  }

  allowDrag() : boolean {
    return (this.dragpolicy !== DragDropPolicy.disabled) && this.name && this.name.length > 0;
  }

  @HostListener('keyup', ['$event']) 
  keyup(event) {
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
    } else {
      const code = event.which;
      if (code === 13) { // cariage return
        this.remove();
      }      
    }
  }

  @HostListener('click', ['$event']) 
  click(event) {
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
  focus(event) {
    if (this.isSelectable()) {
      this.onfocus.emit(this)
    }
  }

  isRemovable() {
    let canRemove = (this.editpolicy === EditPolicy.addAndRemove);

    canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);
    
    return  canRemove;
  }

  isEditable() {
    return  (this.editpolicy !== EditPolicy.viewOnly);
  }

  isDraggable() {
    return  (this.dragpolicy !== DragDropPolicy.disabled);
  }

  isSelectable() {
    return  (this.selectionpolicy !== Selectionpolicy.disabled);
  }
  select() {
    
  }

  tabout(event) {
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
  edit(event) {
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
