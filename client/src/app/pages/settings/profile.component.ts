import { Component } from '@angular/core';

import { Button } from 'primeng/button';
import { FileUpload } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    imports: [FileUpload, TextareaModule, Button, InputGroupModule, InputTextModule, InputGroupAddonModule]
})
export class ProfileComponent {}
