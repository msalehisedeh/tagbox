import { Component } from '@angular/core';

import {
  DragDropPolicy,
  Selectionpolicy,
  EditPolicy
} from './tagbox/interfaces/tagbox.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tag Box';
  events: string[] = [];
  myListTags = ["something 1", "something 2", "something 3", "something 4", "something 5"];
  myStringTags = "something 1, something 2, something 3";
  mySelectionPolicy: Selectionpolicy = Selectionpolicy.multiSelect;
  myEditPolicy: EditPolicy = EditPolicy.addAndRemove;
  myDragPolicy: DragDropPolicy = DragDropPolicy.prependOnDrop;

  mySelectionPolicy2: Selectionpolicy = Selectionpolicy.singleSelect;
  myEditPolicy2: EditPolicy = EditPolicy.addAndRemove;
  myDragPolicy2: DragDropPolicy = DragDropPolicy.swapOnDrop;

  myAutocompleteSource: string[] = ["something 6", "something 9","something 11", "something 12"];

  constructor() {

  }

  evaluateAction(event) {
    this.events.push(event);
    return true;
  }
  updateSelection(event) {
    this.events.push(event);
  }
  updateTag(event) {
    this.events.push(event);
  }
}
