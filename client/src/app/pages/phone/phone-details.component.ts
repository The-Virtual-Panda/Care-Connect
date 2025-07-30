import { PhoneNumber } from '@/api/models/phone-number';
import { PhoneService } from '@/api/services/phone.service';
import { PhonePipe } from '@/pipes/phone.pipe';
import { Logger } from '@/utils/logger';

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CardModule } from 'primeng/card';

import { ShiftsMasterComponent } from './shifts-master.component';

@Component({
    selector: 'cc-phone-details',
    standalone: true,
    imports: [CommonModule, FormsModule, ShiftsMasterComponent, CardModule, PhonePipe],
    templateUrl: './phone-details.component.html'
})
export class PhoneDetailsComponent implements OnInit {
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private phoneService = inject(PhoneService);

    phoneId = signal<string | null>(null);
    phoneInfo = signal<PhoneNumber | null>(null);

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.phoneId.set(params.get('id'));
            Logger.log('Phone ID from route:', this.phoneId());
            this.reload();
        });
    }

    private reload() {
        const phoneNumber = this.phoneId();
        this.phoneService.getPhoneNumber(phoneNumber).subscribe((phone) => {
            this.phoneInfo.set(phone);
        });
    }
}
