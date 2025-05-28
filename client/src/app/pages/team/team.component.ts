import { TeamMember } from '@/models/team-member';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { SliderModule } from 'primeng/slider';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';

@Component({
    selector: 'app-team',
    imports: [
        TableModule,
        MultiSelectModule,
        SelectModule,
        InputIconModule,
        TagModule,
        InputTextModule,
        SliderModule,
        ProgressBarModule,
        ToggleButtonModule,
        ToastModule,
        CommonModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        RippleModule,
        IconFieldModule
    ],
    templateUrl: './team.component.html',
    standalone: true,
})
export class TeamComponent {

    teamMembers: TeamMember[] = [
        {
            id: '1',
            name: 'John Doe',
            phoneNumber: '+1234567890',
            dateCreated: new Date('2023-01-01'),
            dateUpdated: new Date('2023-01-02')
        },
        {
            id: '2',
            name: 'Jane Smith',
            phoneNumber: '+0987654321',
            dateCreated: new Date('2023-02-01'),
            dateUpdated: new Date('2023-02-02')
        }
    ];
    representatives: any[] | undefined;
    isLoading: boolean = false;

    getSeverity(arg0: any): string | null | undefined {
        throw new Error('Method not implemented.');
    }

    clear(_t14: Table<any>) {
        throw new Error('Method not implemented.');
    }

    onGlobalFilter(_t14: Table<any>, $event: Event) {
        throw new Error('Method not implemented.');
    }

}
