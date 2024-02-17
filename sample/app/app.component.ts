import { Component } from '@angular/core';

import {
  DragDropPolicy,
  Selectionpolicy,
  EditPolicy
} from '@sedeh/tagbox';

import { TaggerService } from '@sedeh/tagger';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tag Box';
  events: any[] = [];

  myAudioTags= [
    "https://google.github.io/tacotron/publications/tacotron2/demos/gan_or_vae.wav"
  ];
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
  formatOption = 'mask';

  selectable = [
    {label: 'Disabled', value: 1},
    {label: 'Multi select', value: 2},
    {label: 'Single select', value: 3}
  ];
  editable = [
    {label: 'View only', value: 1},
    {label: 'Add only', value: 2},
    {label: 'Remove only', value: 4},
    {label: 'Add and remove', value: 6},
    {label: 'Add, remove, and modify', value: 7}
  ];
  draggable = [
    {label: 'Disabled', value: 1},
    {label: 'Append on drop', value: 2},
    {label: 'Prepend on drop', value: 3},
    {label: 'Swap on drop', value: 4}
  ];

  formats = [
    {label: 'Mask', value: 'mask'},
    {label: 'Email', value: 'email'},
    {label: 'Phone', value: 'phone'},
    {label: 'Address', value: 'address'}
  ];

  myAutocompleteSource: string[] = ["something 6", "something 9","something 11", "something 12"];

  constructor(
    private taggerService: TaggerService
  ) {
    // this.myImageTags.map((item) => this.taggerService.tagItem('image-box', item));
    // this.myVideoTags.map((item) => this.taggerService.tagItem('video-box', item));
  }

  updateFormatOption(event: string) {
    this.formatOption = event;
  }
  updateSelectionOption(event: any) {
    switch(event) {
      case '1': this.mySelectionPolicy = Selectionpolicy.disabled;break;
      case '2': this.mySelectionPolicy = Selectionpolicy.multiSelect;break;
      case '3': this.mySelectionPolicy = Selectionpolicy.singleSelect;break;
    }
  }
  updateDragOption(event: any) {
    switch(event) {
      case '1': this.myDragPolicy = DragDropPolicy.disabled;break;
      case '2': this.myDragPolicy = DragDropPolicy.appendOnDrop;break;
      case '3': this.myDragPolicy = DragDropPolicy.prependOnDrop;break;
      case '4': this.myDragPolicy = DragDropPolicy.swapOnDrop;break;
    }
  }
  updateEditMode(event: any) {
    switch(event) {
      case '1': this.myEditPolicy = EditPolicy.viewOnly;break;
      case '2': this.myEditPolicy = EditPolicy.addOnly;break;
      case '4': this.myEditPolicy = EditPolicy.removeOnly;break;
      case '6': this.myEditPolicy = EditPolicy.addAndRemove;break;
      case '7': this.myEditPolicy = EditPolicy.addRemoveModify;break;
    }
  }
  showError(event: any) {
    this.events.push(event);
  }
  evaluateAction(event: any) {
    this.events.push(event);
    return true;
  }
  updateSelection(event: any) {
    this.events.push(event);
  }
  updateTag(event: any) {
    this.events.push(event);
  }
  updateAction(event: any) {
    this.events.push(event);
  }
  keyup(event: any) {
    const code = event.which;
    if (code === 13) {
      event.target.click();
		}
  }
  click(event: any, key: string) {
    (<any>this)[key] = event.target.checked;
  }
  itemTagUpdate(event: any) {
    const list = this.taggerService.getTaggedItems(event);
    if (event === 'image-box') {
      this.myImageTags = list;
    } else if (event === 'video-box') {
      this.myVideoTags = list;
    }
    this.events.push({eventId: event, items: list});
  }
}
