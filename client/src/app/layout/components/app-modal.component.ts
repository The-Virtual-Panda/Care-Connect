import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-modal',
    templateUrl: './app-modal.component.html',
    standalone: true,
    imports: [CommonModule, Dialog, ButtonModule, InputTextModule, AvatarModule],
})
export class AppModal {
    @Input() public title: string = '';
    @Input() public cancelText: string = 'Cancel';
    @Input() public submitText: string = 'Submit';
    @Input() public draggable: boolean = false;
    @Input() public closeOnSubmit: boolean = true;

    public visible: boolean = false;

    @Output() public submit: EventEmitter<void> = new EventEmitter<void>();
    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();

    @ContentChild('body') bodyTemplate: TemplateRef<any> | undefined;
    @ContentChild('footer') footerTemplate: TemplateRef<any> | undefined;

    public showModal() {
        this.visible = true;
    }

    public onSubmit() {
        this.submit.emit();
        if (this.closeOnSubmit) {
            this.visible = false;
        }
    }

    public onCancel() {
        this.cancel.emit();
        this.visible = false;
    }

    public hideModal() {
        this.visible = false;
    }
}
