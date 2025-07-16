import { Routes } from '@angular/router';

import { PhoneDetailsComponent } from '@/pages/phone/phone-details.component';

export const phoneRoutes: Routes = [
    {
        path: ':id/config',
        component: PhoneDetailsComponent,
        data: { breadcrumb: 'Shifts' }
    }
];
