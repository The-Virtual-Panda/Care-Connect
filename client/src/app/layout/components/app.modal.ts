import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-modal',
    templateUrl: './app.modal.html',
    standalone: true,
    imports: [CommonModule, Dialog, ButtonModule, InputTextModule, AvatarModule],
})
export class AppModal {
    @Input() public title: string = '';
    @Input() public cancelText: string = 'Cancel';
    @Input() public submitText: string = 'Sumbit';
    @Input() public draggable: boolean = false;

    public visible: boolean = false;

    @ContentChild('body') bodyTemplate: TemplateRef<any> | undefined;

    public showModal() {
        this.visible = true;
    }
}
