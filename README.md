# Welcome to TagBox!

Have you ever been in need of a tag box that can provide many built in functionalities that suites you needs? TagBox is built with Angular 4+ code and is developed specifically without needing to use ngModel to avoid an existing bug in Angular which makes any program non-responsive if any component that uses ngModel is used within a template.  In Addition TagBox enhances bugs that are exists in other tag Angular libraries.  This code is created instead of making change request in other libraries because it is drastically enhancing issues found and may be incompatible for use for those who are already using them.


[Live Demo](https://tagbox.stackblitz.io) | [Source code](https://github.com/msalehisedeh/tagbox)


# Version 0.1.1
Now you can tag a video!!
```
DEPENDENCIES: 
	"font-awesome": "^4.7.0", 
	"into-pipes": "^1.3.3"
```

# Version 0.1.0

The following are available functionalities presented in this version. 

```
DEPENDENCIES: 
	"font-awesome": "^4.7.0", 
	"into-pipes": "^0.0.0"
```

## Drag and Drop between tag boxes.

You can drag a tag from one box and drop it over another box. if adding policy on destination box is allowed,
drop operation on destination tag will complete and if removing policy on source tag is allowed, the source tag will be removed from source box.

## Events
You can now register to receive error events when internal calculations prevent completion of an action. For example, if resulting content exceeds maximum length of tag box content, add operation will be declined internally and an error message is published.

| Event               |Details                                                           |
|---------------------|------------------------------------------------------------------|
|onerror              |`'Unable to add tag. Resulting content will exceed maxtaglength.'`|


# Version 0.0.1

The following are available functionalities presented in this version. 

```
DEPENDENCIES: 
	"font-awesome": "^4.7.0",
	"into-pipes": "^0.0.0"
```

## Formatting the tag display content.

We are using "into-pipes" library. to see availabel formatting options, please follow what is supported by the library.

## Sample Use

```
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
```

# Version 0.0.0

The following are available functionalities presented in this version. 

```
DEPENDENCIES: "font-awesome": "^4.7.0"
```

## Selection Policy

**Selection Policy** allows you to decide if user click on a tag can result in a multi selection or single selection of tags, or if you want the tag selection is disabled entirely. Enabled or not, a selected index list of selected tags will be available for use by other parts of your code. if single selection is allowed, only one tag is returned back to you after modifications.

## Drag/Drop Policy

**DragDrop Policy** allows you to decide if dragging and dropping a tag is possible and if it can lead to swapping tags, or appending or prepending the content of dragged tag in to the drop destination tag.

## Edit Policy

**Edit Policy** allows you to decide if the tag box is disabled, or if user is allowed to add or delete tags from the box, or edit existing tags. Enabled or not, a list of tags will be available for use by other parts of your code.  If you supply the list of existing tags in a string, the list will be given back to you as a string. If the supplied list is an object, after any modifications, the resulting object will be given back to you in return.

## Placeholder Text

By choosing a **placeholder**, you can customize the text that will display for adding a new tag.

## Autocomplete

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
You can setup maximum and minimum number of tags within the box in addition to the maximum length of the resulting text out of string delineated tags.  In addition you can set the delineate character for the resulting string through **delineateby** attribute.  If not set, semicolon will be used.

## Events
You can register to receive the following events:

| Event       |Details                                                                                             |
|-------------|----------------------------------------------------------------------------------------------------|
|onselect     |`'{ "id": "<tag box ID>", "selecedIndex": "<index list of selected items>" }'`                      |
|onchange     |`'{ "id": "<tag box ID>", "tags": <list of tags>, "selecedIndex": <index list of selected items> }'`|

## Sample Use

```
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
```
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

![alt text](https://raw.githubusercontent.com/msalehisedeh/tagbox/master/sample.png  "What you would see when a tagbox is used")
