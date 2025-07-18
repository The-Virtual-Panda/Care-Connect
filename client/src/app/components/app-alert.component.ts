import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';

export enum AlertSeverity {
    Success = 'success',
    Info = 'info',
    Warn = 'warn',
    Error = 'error',
    Secondary = 'secondary',
    Contrast = 'contrast',
}

@Component({
    selector: 'app-alert',
    templateUrl: './app-alert.component.html',
    standalone: true,
    imports: [CommonModule, MessageModule],
})
export class AppAlert {
    @Input() severity: AlertSeverity = AlertSeverity.Info;
    @Input() title: string = '';
    @Input() detail: string = '';
    @Input() closable: boolean = false;
    @Input() timeout: number | null = null;
    @Input() id: string = '';

    visible = false;
    timeoutId: any;

    show(severity: AlertSeverity, detail: string, title: string = '', timeout: number | null = null, closable: boolean = true) {
        this.severity = severity;
        this.detail = detail;
        this.title = title;
        this.closable = closable;
        this.visible = true;
        if (this.timeoutId) clearTimeout(this.timeoutId);
        if (timeout && timeout > 0) {
            this.timeoutId = setTimeout(() => this.close(), timeout);
        }
    }

    showSuccess(detail: string, title: string = 'Success', timeout: number | null = null, closable: boolean = true) {
        this.show(AlertSeverity.Success, detail, title, timeout, closable);
    }

    showInfo(detail: string, title: string = 'Info', timeout: number | null = null, closable: boolean = true) {
        this.show(AlertSeverity.Info, detail, title, timeout, closable);
    }

    showWarn(detail: string, title: string = 'Warning', timeout: number | null = null, closable: boolean = true) {
        this.show(AlertSeverity.Warn, detail, title, timeout, closable);
    }

    showError(detail: string, title: string = 'Error', timeout: number | null = null, closable: boolean = true) {
        this.show(AlertSeverity.Error, detail, title, timeout, closable);
    }

    close() {
        this.visible = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }
}
