import { Component } from '@angular/core';

import { ProgressSpinner } from 'primeng/progressspinner';

@Component({
    selector: 'app-loading-block',
    imports: [ProgressSpinner],
    template: `
        <div class="flex justify-center">
            <p-progress-spinner ariaLabel="loading" />
        </div>
    `
})
export class AppBlockLoaderComponent {}
