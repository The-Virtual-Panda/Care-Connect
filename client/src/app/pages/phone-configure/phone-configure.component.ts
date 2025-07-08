import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

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
        this.route.paramMap.subscribe(params => {
            this.phoneId = params.get('id');
            console.log('Phone ID from route:', this.phoneId);
        });
    }
}
