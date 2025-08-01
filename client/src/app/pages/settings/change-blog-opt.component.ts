import { AuthService } from '@/api/services/auth.service';
import { UserService } from '@/api/services/user.service';
import { ToastService } from '@/services/toast.service';
import { Logger } from '@/utils/logger';

import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-change-blog-opt',
    imports: [FormsModule, ToggleSwitchModule],
    template: `
        <div class="w-max">
            <p class="mb-2">See this indicator when you have unread release notes?</p>
            <div class="flex flex-row items-end justify-center gap-4">
                <button [disabled]="true" class="app-config-button show-spinner" pTooltip="Release Notes" tooltipPosition="bottom">
                    <i class="pi pi-bell"></i>
                </button>
                <p-toggleswitch [(ngModel)]="notifyNewChanges" (onChange)="onToggleChange()" />
            </div>
        </div>
    `
})
export class ChangeBlogOptComponent {
    private authService = inject(AuthService);
    private userService = inject(UserService);
    private toastService = inject(ToastService);

    notifyNewChanges: boolean = this.authService.notifyNewChangeBlogs();

    onToggleChange() {
        Logger.log('ChangeBlogOptComponent', 'Toggle changed:', this.notifyNewChanges);
        const userId = this.authService.userId();
        this.userService.updateChangeBlogNotificationPreference(userId, this.notifyNewChanges).subscribe({
            next: () => {
                const message = this.notifyNewChanges
                    ? 'Great! You will be notified of all new release notes.'
                    : 'Okay - You will not be bothered by new release notes.';

                if (this.notifyNewChanges) {
                    this.toastService.showSuccess('Saved Preference', message);
                } else {
                    this.toastService.showInfo('Saved Preference', message);
                }

                // Update the auth service to reflect the new preference
                const session = this.authService.userSession();
                if (!session || !session.profile) return;

                const updatedProfile = {
                    ...session.profile,
                    notifyNewChangeBlogs: this.notifyNewChanges
                };

                this.authService.userSession.update((state) => ({
                    ...state,
                    profile: updatedProfile
                }));
                Logger.log('Updated user session with new change blog notification preference');
            },
            error: () => {
                this.toastService.showError('Failed to save preference', 'Unable to save preference to the database. Please try again later.');
            }
        });
    }
}
