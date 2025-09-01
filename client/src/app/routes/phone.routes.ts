import { CallHistoryComponent } from '@/pages/phone/call-history.component';
import { PhoneDetailsComponent } from '@/pages/phone/phone-details.component';

import { Routes } from '@angular/router';

export const phoneRoutes: Routes = [
    {
        path: ':id/call-flow',
        component: PhoneDetailsComponent
        // data: { breadcrumb: 'Shifts' }
    },
    {
        path: 'call-history',
        component: CallHistoryComponent,
        data: { breadcrumb: 'Call History' }
    }
];
