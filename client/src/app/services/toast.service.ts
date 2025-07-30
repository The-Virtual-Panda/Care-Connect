import { Injectable, inject } from '@angular/core';

import { MessageService } from 'primeng/api';

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private readonly _TOAST_KEY: string = 'global-toast';

    private messageService: MessageService = inject(MessageService);

    showSuccess(summary: string, detail?: string) {
        this.showToast(summary, 'success', detail);
    }

    showInfo(summary: string, detail?: string) {
        this.showToast(summary, 'info', detail);
    }

    showWarn(summary: string, detail?: string) {
        this.showToast(summary, 'warn', detail);
    }

    showError(summary: string, detail?: string, life?: number) {
        this.showToast(summary, 'error', detail, life);
    }

    showToast(summary: string, severity: string, detail?: string, life: number = 5000): void {
        console.log('showToast', severity, summary, detail);
        this.messageService.add({
            key: this._TOAST_KEY,
            severity: severity,
            summary: summary,
            detail: detail,
            life: life // life: 0 for persistent toast
        });
    }
}
