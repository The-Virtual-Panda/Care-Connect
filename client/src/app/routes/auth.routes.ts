import { ForgotPassword } from '@/pages/auth/forgotpassword';
import { Login } from '@/pages/auth/login.component';
import { NewPassword } from '@/pages/auth/newpassword';
import { Register } from '@/pages/auth/register.component';

import { Routes } from '@angular/router';

export const authRoutes: Routes = [
    {
        path: 'login',
        component: Login
    },
    {
        path: 'register',
        component: Register
    },
    {
        path: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: 'new-password',
        component: NewPassword
    }
];
