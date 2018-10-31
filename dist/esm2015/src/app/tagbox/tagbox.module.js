/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from 'into-pipes';
import { DragDropModule } from 'drag-enabled';
import { TagComponent } from './components/tag.component';
import { TagBoxComponent } from './components/tagbox.component';
import { TagTransfer } from './components/tag.transfer';
export class TagBoxModule {
}
TagBoxModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    IntoPipeModule,
                    DragDropModule
                ],
                declarations: [
                    TagBoxComponent,
                    TagComponent
                ],
                exports: [
                    TagBoxComponent
                ],
                entryComponents: [],
                providers: [
                    TagTransfer
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            },] }
];

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL3RhZ2JveC8iLCJzb3VyY2VzIjpbInNyYy9hcHAvdGFnYm94L3RhZ2JveC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDakUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDNUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUU5QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQXVCeEQsTUFBTTs7O1lBckJMLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixjQUFjO29CQUNqQixjQUFjO2lCQUNaO2dCQUNELFlBQVksRUFBRTtvQkFDWixlQUFlO29CQUNmLFlBQVk7aUJBQ2I7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGVBQWU7aUJBQ2hCO2dCQUNELGVBQWUsRUFBRSxFQUNoQjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsV0FBVztpQkFDWjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxzQkFBc0IsQ0FBQzthQUNsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBDVVNUT01fRUxFTUVOVFNfU0NIRU1BIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XHJcbmltcG9ydCB7IEludG9QaXBlTW9kdWxlIH0gZnJvbSAnaW50by1waXBlcyc7XHJcbmltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gZnJvbSAnZHJhZy1lbmFibGVkJztcclxuXHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFnQm94Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZ2JveC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWdUcmFuc2ZlciB9IGZyb20gJy4vY29tcG9uZW50cy90YWcudHJhbnNmZXInO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBJbnRvUGlwZU1vZHVsZSxcclxuXHREcmFnRHJvcE1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBUYWdCb3hDb21wb25lbnQsXHJcbiAgICBUYWdDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFRhZ0JveENvbXBvbmVudFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIFRhZ1RyYW5zZmVyXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWdCb3hNb2R1bGUge31cclxuIl19