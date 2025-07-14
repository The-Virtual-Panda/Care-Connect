import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Logger } from '@/utils/logger';

import { ShiftsMasterComponent } from './shifts-master.component';

@Component({
    selector: 'cc-phone-details',
    standalone: true,
    imports: [CommonModule, ShiftsMasterComponent],
    templateUrl: './phone-details.component.html'
})
export class PhoneDetailsComponent implements OnInit {
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
