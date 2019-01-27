# Welcome to TagBox!

Have you ever been in need of a tag box that can provide many built in functionalities that suites you needs? TagBox is built with Angular 4+ code and is developed specifically without needing to use ngModel to avoid an existing bug in Angular which makes any program non-responsive if any component that uses ngModel is used within a template.  In Addition TagBox enhances bugs that are exists in other tag Angular libraries.  This code is created instead of making change request in other libraries because it is drastically enhancing issues found and may be incompatible for use for those who are already using them.

**NOTE:** If your project still is angular 2, 4, or 5; please luck-down your version reference to flexible table to 1.1.1 version by removing ^ from the version dependency in your package json. Otherwise for Angular 6+, please use 1.1.2 version or higher.

**NOTE:** Starting with version 1.2.1 you need to import this library through @sedeh/tagbox.

[Live Demo](https://tagbox.stackblitz.io) | [Source code](https://github.com/msalehisedeh/tagbox/tree/master/src/app) | [Comments/Requests](https://github.com/msalehisedeh/tagbox/issues)

```
DEPENDENCIES: 
	"font-awesome": "^4.7.0", 
    "@sedeh/drag-enabled": "^2.0.1",
    "@sedeh/into-pipes": "^2.1.1",
```
## Functionalities

### Drag and Drop between tag boxes.

You can drag a tag from one box and drop it over another box. if adding policy on destination box is allowed,
drop operation on destination tag will complete and if removing policy on source tag is allowed, the source tag will be removed from source box.

#### Events
You can now register to receive error events when internal calculations prevent completion of an action. For example, if resulting content exceeds maximum length of tag box content, add operation will be declined internally and an error message is published.

| Event               |Details                                                           |
|---------------------|------------------------------------------------------------------|
|onerror              |`'Unable to add tag. Resulting content will exceed maxtaglength.'`|


### Formatting the tag display content.

We are using "into-pipes" library. to find out what formatting options are available, please follow what is supported by the library.

#### Sample usage

```javascript
<tagbox
	id="tag1"
	[tags]="myListOfTagedImageUrls"
	[format]="image"
	[selectionpolicy]="mySelectionPolicy"
	[editpolicy]="myEditPolicy"
	[dragpolicy]="myDragPolicy"></tagbox>

<tagbox
	id="tag1"
	[tags]="myTags"
	[format]="wrap:@:?"
	[selectionpolicy]="mySelectionPolicy"
	[editpolicy]="myEditPolicy"
	[dragpolicy]="myDragPolicy"></tagbox>
<tagbox
	id="tag1"
	[tags]="myTags"
	[format]="date:MMDDYYY"
	[selectionpolicy]="mySelectionPolicy"
	[editpolicy]="myEditPolicy"
	[dragpolicy]="myDragPolicy"></tagbox>
<tagbox
	id="tag1"
	maxboxlength="300"
	maxtaglength="20"
	maxtags="12"
	mintags="1"
	tabindex="0"
	title="text to show when hover on tagbox"
	placeholder="Add new Tag"
	(onselect)="updateSelection($event)"
	(onchange)="updateTag($event)"
	[tags]="myListTags"
	[selectedindex]="[1,3]"
	[beforeAction]="evaluateAction.bind(this)"
	[autocomplete]="myAutocompleteSource"
	[selectionpolicy]="mySelectionPolicy"
	[editpolicy]="myEditPolicy"
	[dragpolicy]="myDragPolicy"></tagbox>
```


#### Selection Policy

**Selection Policy** allows you to decide if user click on a tag can result in a multi selection or single selection of tags, or if you want the tag selection is disabled entirely. Enabled or not, a selected index list of selected tags will be available for use by other parts of your code. if single selection is allowed, only one tag is returned back to you after modifications.

```javascript
  disabled     // disable selection
  multiSelect  // allow selection of multipple tags
  singleSelect // only one tag at a time should be selected
```

#### Drag/Drop Policy

**DragDrop Policy** allows you to decide if dragging and dropping a tag is possible and if it can lead to swapping tags, or appending or prepending the content of dragged tag in to the drop destination tag.

```javascript
  disabled      // drag drop not allowed
  appendOnDrop  // append source to destination
  prependOnDrop // prepend source into destination
  swapOnDrop    // swap the tags
```

#### Edit Policy

**Edit Policy** allows you to decide if the tag box is disabled, or if user is allowed to add or delete tags from the box, or edit existing tags. Enabled or not, a list of tags will be available for use by other parts of your code.  If you supply the list of existing tags in a string, the list will be given back to you as a string. If the supplied list is an object, after any modifications, the resulting object will be given back to you in return.

```javascript
  viewOnly        //box is locked down.
  addOnly         //allow add new tag
  removeOnly      //allow remove existing tag
  addAndRemove    //allow add new tag or remove existing tag
  addRemoveModify //allow add new tag, remove existing tag, or edit a tag
```

#### Placeholder Text

By choosing a **placeholder**, you can customize the text that will display for adding a new tag.

#### Autocomplete

For this version, if a list of per-determined tag names is supplied, auto fill list of remaining names will be displayed as user starts typing characters when editing tags.

## Decision making override

You can supply a decision making override function **beforeAction"**. If supplied, for every action performed a call will be made to that function.
The following will be given to you for approval of any action. If your function returned true, action will take be considered as approved and will take place. Otherwise, the action will be revered.

| Action        |request                                                                                |
|---------------|---------------------------------------------------------------------------------------|
|Select Tag     |`'{ "request": "select", "item": "<tag>" }'`                                           |
|Drag Drop Tag  |`'{ "request": "drop", "action": "swap", "source": "<tag>", "destination": "<tag>" }'` |
|Add Tag        |`'{ "request": "add", "item": "<new tag>" }'`                                          |
|Remove Tag     |`'{ "request": "remove", "item": "<tag>" }'`                                           |
|Modify Tag     |`'{"request": "change", "item": "<original tag>", "to": "<new tag>" }'`                |

## Setting up limits
You can set-up maximum and minimum number of tags within the box in addition to the maximum length of the resulting text out of string delineated tags.  In addition you can set the delineate character for the resulting string through **delineateby** attribute.  If not set, semicolon will be used.

## Events
You can register to receive the following events:

| Event       |Details                                                                                             |
|-------------|----------------------------------------------------------------------------------------------------|
|onselect     |`'{ "id": "<tag box ID>", "selecedIndex": "<index list of selected items>" }'`                      |
|onchange     |`'{ "id": "<tag box ID>", "tags": <list of tags>, "selecedIndex": <index list of selected items> }'`|

```javascript
mySelectionPolicy: Selectionpolicy = Selectionpolicy.multiSelect;
myEditPolicy: EditPolicy = EditPolicy.addAndRemove;
myDragPolicy: DragDropPolicy = DragDropPolicy.prependOnDrop;

myAutocompleteSource: string[] = [
	"something 6",
	"something 9",
	"something 11",
	"something 12"
];

myListTags = [
	"something 1",
	"something 2",
	"something 3",
	"something 4",
	"something 5"
];

evaluateAction(event) {
	console.log(event);
	return  true;
}

updateSelection(event) {
	console.log(event);
}

updateTag(event) {
	console.log(event);
}
```

## Revision History

| Version | Description                                                                                              |
|---------|----------------------------------------------------------------------------------------------------------|
| 1.2.2   | Fixed ADA issues. Updated edit policy. Now in order to allow updating a tag, edit policy should be addRemoveEdit. Modified drag drop behavior. If dropping over another tag box both should have the same format option. |
| 1.2.1   | Updated dependencies.                                                                                    |
| 1.2.0   | It was brought to my attention that some users have trouble using my components in their angular 6 environment. Since I had only updated few dependencies when moved to Angular 6, I am thinking dependencies are causing issues. So, for this release, I am updating all dependencies to what Angular 6 applications are expecting to have. Please let me know if this is fixing or not fixing any issues you are facing. |
| 1.1.2   | Rolling to angular 6+ after fixing the dependency issue.                                                 |
| 1.1.1   | Temporary roll-back to angular 5. I forgot to luck-down the dependencies for angular 5 before upgrading to angular 6. this will cause problem if you are still using angular 5.  |
| 1.1.0   | Updated libraries to become compatible with Angular 6+.                                                  |
| 1.0.0   | Compiled with AOT option and resolved issues.                                                            |
| 0.1.1   | Now you can tag a video!!                                                                                |
| 0.1.0   | You can drag a tag from one box and drop it over another box.                                            |
| 0.0.1   | Added dependency with into-pipes to format the tag display content.                                      |
| 0.0.0   | Initial Release.                                                                                         |


![alt text](https://raw.githubusercontent.com/msalehisedeh/tagbox/master/sample.png  "What you would see when a tagbox is used")
