/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntoPipeModule } from '@sedeh/into-pipes';
import { DragDropModule } from '@sedeh/drag-enabled';
import { TagComponent } from './components/tag.component';
import { TagBoxComponent } from './components/tagbox.component';
import { TagTransfer } from './components/tag.transfer';
var TagBoxModule = /** @class */ (function () {
    function TagBoxModule() {
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
    return TagBoxModule;
}());
export { TagBoxModule };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC90YWdib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRXJELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDJCQUEyQixDQUFDOzs7OztnQkFFdkQsUUFBUSxTQUFDO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxZQUFZO3dCQUNaLGNBQWM7d0JBQ2QsY0FBYztxQkFDZjtvQkFDRCxZQUFZLEVBQUU7d0JBQ1osZUFBZTt3QkFDZixZQUFZO3FCQUNiO29CQUNELE9BQU8sRUFBRTt3QkFDUCxlQUFlO3FCQUNoQjtvQkFDRCxlQUFlLEVBQUUsRUFDaEI7b0JBQ0QsU0FBUyxFQUFFO3dCQUNULFdBQVc7cUJBQ1o7b0JBQ0QsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ2xDOzt1QkE1QkQ7O1NBOEJhLFlBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSwgQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBJbnRvUGlwZU1vZHVsZSB9IGZyb20gJ0BzZWRlaC9pbnRvLXBpcGVzJztcclxuaW1wb3J0IHsgRHJhZ0Ryb3BNb2R1bGUgfSBmcm9tICdAc2VkZWgvZHJhZy1lbmFibGVkJztcclxuXHJcbmltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy90YWcuY29tcG9uZW50JztcclxuaW1wb3J0IHsgVGFnQm94Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZ2JveC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWdUcmFuc2ZlciB9IGZyb20gJy4vY29tcG9uZW50cy90YWcudHJhbnNmZXInO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICBpbXBvcnRzOiBbXHJcbiAgICBDb21tb25Nb2R1bGUsXHJcbiAgICBJbnRvUGlwZU1vZHVsZSxcclxuICAgIERyYWdEcm9wTW9kdWxlXHJcbiAgXSxcclxuICBkZWNsYXJhdGlvbnM6IFtcclxuICAgIFRhZ0JveENvbXBvbmVudCxcclxuICAgIFRhZ0NvbXBvbmVudFxyXG4gIF0sXHJcbiAgZXhwb3J0czogW1xyXG4gICAgVGFnQm94Q29tcG9uZW50XHJcbiAgXSxcclxuICBlbnRyeUNvbXBvbmVudHM6IFtcclxuICBdLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgVGFnVHJhbnNmZXJcclxuICBdLFxyXG4gIHNjaGVtYXM6IFtDVVNUT01fRUxFTUVOVFNfU0NIRU1BXVxyXG59KVxyXG5cclxuZXhwb3J0IGNsYXNzIFRhZ0JveE1vZHVsZSB7fVxyXG4iXX0=