import { LayoutService } from '@/layouts/service/layout.service';

import { Component, inject } from '@angular/core';

import { AutoFocusModule } from 'primeng/autofocus';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: '[app-search]',
    standalone: true,
    imports: [DialogModule, InputTextModule, AutoFocusModule],
    template: ` <p-dialog
        [(visible)]="searchBarActive"
        [breakpoints]="{ '992px': '75vw', '576px': '90vw' }"
        modal
        dismissableMask
        styleClass="w-1/2 !overflow-hidden !rounded-[1.5rem]">
        <div class="search-container">
            <i class="pi pi-search"></i>
            <input pInputText type="text" [pAutoFocus]="true" class="p-inputtext search-input" placeholder="Search" (keydown.enter)="toggleSearchBar()" />
        </div>
    </p-dialog>`,
    styles: `
        :host ::ng-deep {
            .p-dialog-header {
                display: none;
            }
            .p-dialog-content {
                padding: 0px;
            }
        }
    `
})
export class AppSearch {
    layoutService = inject(LayoutService);

    toggleSearchBar() {
        this.layoutService.layoutState.update((value) => ({ ...value, searchBarActive: !value.searchBarActive }));
    }

    get searchBarActive(): boolean {
        return this.layoutService.layoutState().searchBarActive;
    }

    set searchBarActive(_val: boolean) {
        this.layoutService.layoutState.update((prev) => ({ ...prev, searchBarActive: _val }));
    }
}
