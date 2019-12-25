import * as tslib_1 from "tslib";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WizardStorageModule } from '@sedeh/wizard-storage';
import { IntoPipeModule } from '@sedeh/into-pipes';
import { TagComponent } from './components/tag.component';
import { TagBoxComponent } from './components/tagbox.component';
import { TagTransfer } from './components/tag.transfer';
var TagBoxModule = /** @class */ (function () {
    function TagBoxModule() {
    }
    TagBoxModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                WizardStorageModule,
                IntoPipeModule
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
        })
    ], TagBoxModule);
    return TagBoxModule;
}());
export { TagBoxModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFnYm94Lm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL0BzZWRlaC90YWdib3gvIiwic291cmNlcyI6WyJzcmMvYXBwL3RhZ2JveC90YWdib3gubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLHNCQUFzQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBQzFELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUNoRSxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUF1QnhEO0lBQUE7SUFBMkIsQ0FBQztJQUFmLFlBQVk7UUFyQnhCLFFBQVEsQ0FBQztZQUNSLE9BQU8sRUFBRTtnQkFDUCxZQUFZO2dCQUNaLG1CQUFtQjtnQkFDbkIsY0FBYzthQUNmO1lBQ0QsWUFBWSxFQUFFO2dCQUNaLGVBQWU7Z0JBQ2YsWUFBWTthQUNiO1lBQ0QsT0FBTyxFQUFFO2dCQUNQLGVBQWU7YUFDaEI7WUFDRCxlQUFlLEVBQUUsRUFDaEI7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsV0FBVzthQUNaO1lBQ0QsT0FBTyxFQUFFLENBQUMsc0JBQXNCLENBQUM7U0FDbEMsQ0FBQztPQUVXLFlBQVksQ0FBRztJQUFELG1CQUFDO0NBQUEsQUFBNUIsSUFBNEI7U0FBZixZQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUsIENVU1RPTV9FTEVNRU5UU19TQ0hFTUEgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgV2l6YXJkU3RvcmFnZU1vZHVsZSB9IGZyb20gJ0BzZWRlaC93aXphcmQtc3RvcmFnZSc7XHJcbmltcG9ydCB7IEludG9QaXBlTW9kdWxlIH0gZnJvbSAnQHNlZGVoL2ludG8tcGlwZXMnO1xyXG5cclxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBUYWdCb3hDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvdGFnYm94LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFRhZ1RyYW5zZmVyIH0gZnJvbSAnLi9jb21wb25lbnRzL3RhZy50cmFuc2Zlcic7XHJcblxyXG5ATmdNb2R1bGUoe1xyXG4gIGltcG9ydHM6IFtcclxuICAgIENvbW1vbk1vZHVsZSxcclxuICAgIFdpemFyZFN0b3JhZ2VNb2R1bGUsXHJcbiAgICBJbnRvUGlwZU1vZHVsZVxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBUYWdCb3hDb21wb25lbnQsXHJcbiAgICBUYWdDb21wb25lbnRcclxuICBdLFxyXG4gIGV4cG9ydHM6IFtcclxuICAgIFRhZ0JveENvbXBvbmVudFxyXG4gIF0sXHJcbiAgZW50cnlDb21wb25lbnRzOiBbXHJcbiAgXSxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIFRhZ1RyYW5zZmVyXHJcbiAgXSxcclxuICBzY2hlbWFzOiBbQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQV1cclxufSlcclxuXHJcbmV4cG9ydCBjbGFzcyBUYWdCb3hNb2R1bGUge31cclxuIl19