import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Logger } from '@/utils/logger';

@Component({
    selector: 'app-phone-configure',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './phone-configure.component.html'
})
export class PhoneConfigureComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    phoneId: string | null = null;

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.phoneId = params.get('id');
            Logger.log('Phone ID from route:', this.phoneId);
        });
    }
}
