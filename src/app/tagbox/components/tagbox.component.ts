/*
 * Comparision Tool will layout two comparision trees side by side and feed them an internal object
 * heirarchy created for internal use from JSON objects given to this component.
 */
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  Renderer
} from '@angular/core';

import {
  DragDropPolicy,
  Selectionpolicy,
  EditPolicy
} from '../interfaces/tagbox.interfaces';

import { TagComponent } from './tag.component';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tagbox',
  templateUrl: './tagbox.component.html',
  styleUrls: ['./tagbox.component.scss'],
})
export class TagBoxComponent implements OnInit, OnChanges {

  _tags: string[] = [];
  _selectedindex: number[] = [];
  
  @Output("onchange")
  onchange= new EventEmitter()

  @Output("onerror")
  onerror= new EventEmitter()

  @Output("onselect")
  onselect= new EventEmitter()

  @Input("beforeAction")
  beforeAction = (event) => true;

  @Input("id")
  id: string;

  @Input("placeholder")
  placeholder: string = "Add Tag";
  
  @Input("maxboxlength")
  maxboxlength: number;

  @Input("maxtaglength")
  maxtaglength: number;

  @Input("maxtags")
  maxtags: number;

  @Input("mintags")
  mintags: number;

  @Input("formController")
  formController: HTMLElement;

  @Input("tags")
  tags: any;

  @Input("selectedindex")
  selectedindex: any;

  @Input("delineateby")
  delineateby: string;

  @Input("format")
  format: string;

  @Input("autocomplete")
  autocomplete: string[];

  @Input("selectionpolicy")
  selectionpolicy: Selectionpolicy;

  @Input("editpolicy")
  editpolicy: EditPolicy;

  @Input("dragpolicy")
  dragpolicy: DragDropPolicy;


  constructor(private renderer: Renderer, private el: ElementRef) {
	  
  }

  ngOnInit() {
    if (this.selectedindex && 
        (this.selectedindex instanceof String) && 
        (this.tags && !(this.tags instanceof String))) {
      const x: string = String(this.selectedindex);
      const list = x.split(",");
      list.map((t) => {
        this._selectedindex.push(parseInt(t));
      });
    } else {
      this._selectedindex = this.selectedindex ? this.selectedindex : [];
    }

    if (this.tags && !(this.tags instanceof Array)) {
      const x: string = String(this.tags);
      this._tags = x.split(this.delineateby ? this.delineateby : ",");
    } else {
      this._tags = this.tags ? this.tags : [];
    }
    this.renderer.setElementAttribute(this.el.nativeElement,"role","list");
  }

  ngOnChanges(changes) {

  }

  itemSelectedAt(index) {
    const canSelect = this.selectionpolicy !== Selectionpolicy.disabled;
    return this._selectedindex.indexOf(index) < 0 ? false : canSelect;
  }

  itemSelectionClass(index) {
    const selected = this.itemSelectedAt(index);
    return selected ? "selected" : ((index < 0 || this.selectionpolicy === Selectionpolicy.disabled) ? "left-padded" : "");
  }

  isRemovable() {
    let canRemove = (this.editpolicy === EditPolicy.addAndRemove);

    canRemove = canRemove || (this.editpolicy === EditPolicy.addRemoveModify);
    canRemove = canRemove || (this.editpolicy === EditPolicy.removeOnly);

    canRemove = canRemove && (!this.mintags || (this._tags.length > this.mintags));

    if (!canRemove) {
      this.onerror.emit("Unable to remove tag. Operation is not allowed.");
    }
    return  canRemove;
  }

  private isDuplicate(name) {
    const flag = this._tags.indexOf(name) < 0 ? false : true;
    if (flag) {
      this.onerror.emit("Unable to perform operation. Resulting duplicate tags is not allowed.");
    }
    return flag;
  }

  private allowedToaddItem(name) {
    let canAdd = (this.editpolicy === EditPolicy.addAndRemove);

    canAdd = canAdd || (this.editpolicy === EditPolicy.addRemoveModify);
    canAdd = canAdd || (this.editpolicy === EditPolicy.addOnly);

    canAdd = canAdd && (!this.maxtags || (this._tags.length < this.maxtags));

    canAdd = canAdd && !this.isDuplicate(name);

    if (canAdd && this.maxtaglength) {
      const x = this._tags.join( this.delineateby ? this.delineateby : ",");
      if (x.length+name.length+1 >= this.maxboxlength) {
        canAdd = false;
        this.onerror.emit("Unable to add tag. Resulting content will exceed maxtaglength.");
      }
    }    
    return  canAdd;
  }

  private notifyChange() {
    this.tags = (this.tags instanceof Array) ? this._tags : this._tags.join( this.delineateby ? this.delineateby : ",");
    this.selectedindex = !(this.selectedindex instanceof Array) ? 
                          this._selectedindex : 
                          (this._selectedindex.length ? this._selectedindex.join(",") : "");
    this.onchange.emit({
      id: this.id,
      tags: this.tags,
      selecedIndex: this.selectedindex,
      formController: this.formController
    });
  }
  private notifySelection() {
    this.selectedindex = !(this.selectedindex instanceof Array) ? 
                        this._selectedindex : 
                        (this._selectedindex.length ? this._selectedindex.join(",") : "");
    this.onselect.emit({
      id: this.id,
      selecedIndex: this.selectedindex,
      formController: this.formController
    });
  }
  private createDropRequest(action, source, destination) {
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
    }
  }
  private prependTagAt(index, source, destination) {
    let result = false;
    const newName = source.name  + " " + this._tags[index];
    if (!this.maxtaglength ||  (this.maxtaglength && source.name.length <= this.maxtaglength)) {
      if (this.beforeAction(this.createDropRequest("prepend", source, destination))) {
        this._tags[index] = newName;
        result = true;
      }
    }
    return result;
  }
  private appendTagAt(index, source, destination) {
    let result = false;
    const newName = this._tags[index] + " " + source.name;
    if (!this.maxtaglength ||  (this.maxtaglength && source.name.length <= this.maxtaglength)) {
      if (this.beforeAction(this.createDropRequest("append", source, destination))) {
        this._tags[index] = newName;
        result = true;
      }
    }
    return result;
  }
  removeTagWithName(name) {
    if (this.isRemovable() && this.beforeAction({request:"remove", item: name})) {
      if (this._selectedindex instanceof Array) {
        const index = this._tags.indexOf(name);
        const i = this._selectedindex.indexOf(index);
  
        this._tags.splice(index,1);
        if (i >= 0) {
          this._selectedindex.splice(i,1);
          this.notifyChange();
        }
      } else {
        this._selectedindex = [];
      }
    }
  }
  addTagWithName(name) {
    let index = this._tags.indexOf(name);
    const i = this._selectedindex.indexOf(index);
    
    if (index < 0  && 
        name.length && 
        this.allowedToaddItem(name) && 
        this.beforeAction({request:"add", item: name})) {
      this._tags.push(name);
      this.notifyChange();
      return true;
    } else {
      return false;
    }
  }
  onTagRemove(event: TagComponent) {
    this.removeTagWithName(event.name);
  }

  onTagAdd(event: TagComponent) {
    if (this.addTagWithName(event.name)) {
      event.name = "";
      event.click(null);
    } else {
      event.reset();
    }
  }

  onTagChange(event: TagComponent) {
    if (!this.isDuplicate(event.name) && this.beforeAction({request:"change", item: event.originalName, to: event.name})) {
      const index = this._tags.indexOf(event.originalName);
      
      this._tags[index] = event.name;
      event.init();
      this.notifyChange();
    } else {
      event.reset();
    }
  }

  onTagDrop(event) {
    const sind = this._tags.indexOf(event.source.name);
    const dind = this._tags.indexOf(event.destination.name);

    if (this.dragpolicy === DragDropPolicy.appendOnDrop) {
      if (event.source.parent.id === event.destination.parent.id) {
        if (this.appendTagAt(dind, event.source, event.destination)) {
          const i = this._selectedindex.indexOf(sind);
          this._tags.splice(sind,1);
          this._selectedindex.splice(i,1);
          this.notifyChange();
        }
      } else {
        if (this.appendTagAt(dind, event.source, event.destination)) {
          this.notifyChange();
          event.source.parent.removeTagWithName(event.source.name);
        }
      }
    } else if (this.dragpolicy === DragDropPolicy.prependOnDrop) {
      if (event.source.parent.id === event.destination.parent.id) {
        if (this.prependTagAt(dind, event.source, event.destination)) {
          const i = this._selectedindex.indexOf(sind);
          this._tags.splice(sind,1);
          this._selectedindex.splice(i,1);
          this.notifyChange();
        }
      } else {
        if (this.prependTagAt(dind, event.source, event.destination)) {
          this.notifyChange();
          event.source.parent.removeTagWithName(event.source.name);
        }
      }
    } if (this.dragpolicy === DragDropPolicy.swapOnDrop) {
      if (this.beforeAction(this.createDropRequest("swap", event.source, event.destination))) {
        if (event.source.parent.id === event.destination.parent.id) {
          this._tags[sind] = this._tags.splice(dind, 1, this._tags[sind])[0];
          this.notifyChange();
        } else {
          if (this.addTagWithName(event.source.name)) {
            this.removeTagWithName(event.destination.name);
            event.source.parent.removeTagWithName(event.source.name);
          }
        }
      }
    } 
  }
  onTagSelect(event: TagComponent) {
    if (this.selectionpolicy !== Selectionpolicy.disabled) {
      this.onTagFocus(event);
      if (this.beforeAction({request:"select", item: event.name})) {
        if (this.selectionpolicy === Selectionpolicy.singleSelect) {
          const list = this.el.nativeElement.childNodes;
          for(let i=0; i < list.length; i++){
            // 3 is text and 8 is comment
            if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
              this.renderer.setElementClass(list[i], "selected", false)
            }
          }
          const index = this._tags.indexOf(event.name);
          if (index >= 0) {
            const i = this._selectedindex.indexOf(index);
  
            if (i < 0) {
              this.renderer.setElementClass(event.el.nativeElement, "selected", true);
              this._selectedindex = [index];
            } else {
              this.renderer.setElementClass(event.el.nativeElement, "selected", false)
              this._selectedindex = [];
            }
            this.notifySelection();
          }
        } else {
          const index = this._tags.indexOf(event.name);
  
          if (index >= 0) {
            const i = this._selectedindex.indexOf(index);
  
            if (i < 0) {
              this.renderer.setElementClass(event.el.nativeElement, "selected", true);
              this._selectedindex.push(index);
            } else {
              this.renderer.setElementClass(event.el.nativeElement, "selected", false)
              this._selectedindex.splice(i,1);
            }
            this.notifySelection();
          }
        }
      }
    }
  }
  onTagFocus(event: TagComponent) {
    if (this.selectionpolicy !== Selectionpolicy.disabled) {
      const list = this.el.nativeElement.childNodes;
      for(let i=0; i < list.length; i++){
        // 3 is text and 8 is comment
        if (list[i].nodeType !== 3 && list[i].nodeType !== 8) {
          this.renderer.setElementClass(list[i], "focused", false)
        }
      }
      const index = this._tags.indexOf(event.name);
      if (index >= 0) {
        this.renderer.setElementClass(event.el.nativeElement, "focused", true);
      }
    }
  }
}
