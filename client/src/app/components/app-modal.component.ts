import { CommonModule } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, TemplateRef } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

/**
 * Available size options for the modal component.
 * - 'small': 25rem width (400px)
 * - 'medium': 40rem width (640px)
 * - 'large': 60rem width (960px)
 * - 'custom': Uses the customWidth input property
 */
export type ModalSize = 'small' | 'medium' | 'large' | 'custom';

/**
 * A reusable modal/dialog component that provides consistent styling and behavior across the application.
 *
 * @example
 * Basic usage:
 * ```html
 * <app-modal
 *    title="Add User"
 *    size="medium"
 *    [closeOnSubmit]="true"
 *    (submit)="onSubmit()">
 *    <ng-template #body>
 *        <!-- Modal content goes here -->
 *    </ng-template>
 * </app-modal>
 * ```
 *
 * @example
 * With custom footer:
 * ```html
 * <app-modal title="Custom Modal">
 *    <ng-template #body>
 *        <!-- Modal content goes here -->
 *    </ng-template>
 *    <ng-template #footer>
 *        <!-- Custom footer content -->
 *        <button pButton label="Custom Action"></button>
 *    </ng-template>
 * </app-modal>
 * ```
 */
@Component({
    selector: 'app-modal',
    templateUrl: './app-modal.component.html',
    standalone: true,
    imports: [CommonModule, Dialog, ButtonModule, InputTextModule, AvatarModule]
})
export class AppModal {
    /**
     * The title displayed in the modal header.
     * @default ''
     */
    @Input() public title: string = '';

    /**
     * The text for the cancel button.
     * @default 'Cancel'
     */
    @Input() public cancelText: string = 'Cancel';

    /**
     * The text for the submit button.
     * @default 'Submit'
     */
    @Input() public submitText: string = 'Submit';

    /**
     * Whether the modal can be dragged around the screen.
     * @default false
     */
    @Input() public draggable: boolean = false;

    /**
     * Whether to automatically close the modal when the submit button is clicked.
     * @default true
     */
    @Input() public closeOnSubmit: boolean = true;

    /**
     * Controls the size of the modal.
     * - 'small': 25rem width
     * - 'medium': 40rem width
     * - 'large': 60rem width
     * - 'custom': Uses the customWidth property
     * @default 'medium'
     */
    @Input() public size: ModalSize = 'medium';

    /**
     * Custom width for the modal when size is set to 'custom'.
     * Specify a valid CSS width value (e.g. '500px', '50%').
     */
    @Input() public customWidth?: string;

    /**
     * Controls the visibility of the modal.
     * - When true: The modal is displayed
     * - When false: The modal is hidden
     *
     * Use showModal() and hideModal() methods to control this property.
     */
    public visible: boolean = false;

    /**
     * Event emitted when the submit button is clicked.
     */
    @Output() public submit: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Event emitted when the cancel button is clicked or the modal is closed.
     */
    @Output() public cancel: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Template reference for the modal body content.
     * Use with <ng-template #body> in your component to define the main content of the modal.
     * This is required for the modal to display any content.
     *
     * @example
     * ```html
     * <app-modal>
     *    <ng-template #body>
     *        Your content here
     *    </ng-template>
     * </app-modal>
     * ```
     */
    @ContentChild('body') bodyTemplate: TemplateRef<any> | undefined;

    /**
     * Optional template reference for custom footer content.
     * Use with <ng-template #footer> in your component to replace the default footer.
     * When provided, replaces the default submit/cancel buttons with your custom content.
     *
     * @example
     * ```html
     * <app-modal>
     *    <ng-template #body>Content here</ng-template>
     *    <ng-template #footer>
     *        <p-button label="Custom Action" (click)="customAction()"></p-button>
     *    </ng-template>
     * </app-modal>
     * ```
     */
    @ContentChild('footer') footerTemplate: TemplateRef<any> | undefined;

    /**
     * Returns the appropriate width value for the modal based on size setting.
     * - For 'custom' size: Returns the customWidth value if provided
     * - For predefined sizes: Returns the corresponding width value
     *
     * @returns A CSS width value as a string (e.g., '25rem', '40rem', etc.)
     */
    public get modalWidth(): string {
        if (this.size === 'custom' && this.customWidth) {
            return this.customWidth;
        }

        switch (this.size) {
            case 'small':
                return '25rem';
            case 'large':
                return '60rem';
            case 'medium':
            default:
                return '40rem';
        }
    }

    /**
     * Shows the modal dialog.
     * Call this method to programmatically open the modal.
     */
    public showModal() {
        this.visible = true;
    }

    /**
     * Handles the submit button click.
     * Emits the submit event and conditionally closes the modal based on closeOnSubmit.
     */
    public onSubmit() {
        this.submit.emit();
        if (this.closeOnSubmit) {
            this.visible = false;
        }
    }

    /**
     * Handles the cancel button click.
     * Emits the cancel event and closes the modal.
     */
    public onCancel() {
        this.cancel.emit();
        this.visible = false;
    }

    /**
     * Hides the modal dialog.
     * Call this method to programmatically close the modal.
     */
    public hideModal() {
        this.visible = false;
    }
}
