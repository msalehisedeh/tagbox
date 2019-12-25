import { Component } from '@angular/core';

import {
  DragDropPolicy,
  Selectionpolicy,
  EditPolicy
} from './tagbox/interfaces/tagbox.interfaces';

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

  myAutocompleteSource: string[] = ["something 6", "something 9","something 11", "something 12"];

  constructor(
    private taggerService: TaggerService
  ) {
    this.taggerService.setTaggedItems('immage-box', this.myImageTags);
    this.taggerService.setTaggedItems('video-box', this.myVideoTags);
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
