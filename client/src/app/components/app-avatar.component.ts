import { UserService } from '@/api/services/user.service';
import { Logger } from '@/utils/logger';

import { Component, OnInit, inject } from '@angular/core';
import { Input } from '@angular/core';

import { AvatarModule } from 'primeng/avatar';

@Component({
    selector: 'app-avatar',
    templateUrl: './app-avatar.component.html',
    imports: [AvatarModule]
})
export class AppAvatarComponent implements OnInit {
    @Input() userId: string | null = null;
    @Input() size: 'normal' | 'large' | 'xlarge' = 'normal';
    @Input() styleClass: string | undefined;

    userService = inject(UserService);

    isLoading = true;
    avatarUrl: string | null = null;

    ngOnInit(): void {
        if (this.userId) {
            this.userService.getProfileImageUrl(this.userId).subscribe({
                next: (url) => {
                    this.avatarUrl = url;
                    this.isLoading = false;
                },
                error: () => {
                    this.isLoading = false;
                }
            });
        }
    }
}
