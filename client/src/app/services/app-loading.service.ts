import { AppBlockLoaderComponent } from '@/components/app-block.component';

import { Injectable, inject } from '@angular/core';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
    providedIn: 'root'
})
export class AppLoadingService {
    dialogService = inject(DialogService);

    dialogRef: DynamicDialogRef | undefined;

    showBlockingLoader(loadingHeader: string = 'Loading...') {
        this.dialogRef = this.dialogService.open(AppBlockLoaderComponent, {
            header: loadingHeader,
            modal: true,
            contentStyle: { overflow: 'auto' }
        });
    }

    hideBlockingLoader() {
        this.dialogRef?.close();
    }
}
