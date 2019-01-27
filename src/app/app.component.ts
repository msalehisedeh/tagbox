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

  myVideoTags= [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  ];
  myImageTags= [
    "https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?h=350&auto=compress&cs=tinysrgb"
  ];
  myListTags = ["something 1", "something 2", "something 3", "something 4", "something 5"];
  myStringTags = "something 1, something 2, something 3";
  mySelectionPolicy: Selectionpolicy = Selectionpolicy.multiSelect;
  myEditPolicy: EditPolicy = EditPolicy.addRemoveModify;
  myDragPolicy: DragDropPolicy = DragDropPolicy.swapOnDrop;

  mySelectionPolicy2: Selectionpolicy = Selectionpolicy.singleSelect;
  myEditPolicy2: EditPolicy = EditPolicy.addRemoveModify;
  myDragPolicy2: DragDropPolicy = DragDropPolicy.swapOnDrop;

  myAutocompleteSource: string[] = ["something 6", "something 9","something 11", "something 12"];

  constructor() {

  }

  showError(event) {
    this.events.push(event);
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
