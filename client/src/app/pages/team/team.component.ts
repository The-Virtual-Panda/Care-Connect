import { TeamMember } from '@/models/team-member';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject, ViewChild, AfterViewInit, OnInit } from '@angular/core';
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
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TeamService } from '@/services/team.service';
import { AppAlert } from '@/layout/components/app.alert';
import { ToolbarModule } from 'primeng/toolbar';
import { Skeleton } from 'primeng/skeleton';

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
        IconFieldModule,
        ToolbarModule,
        Skeleton,
        AppAlert
    ],
    templateUrl: './team.component.html',
    standalone: true,
    providers: [MessageService]
})
export class TeamComponent implements OnInit, OnDestroy {

    teamService = inject(TeamService);
    messageService = inject(MessageService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;

    teamMembers: TeamMember[] = [];
    selectedMembers: TeamMember[] = [];
    isLoading: boolean = true;
    searchQuery: string = '';

    private subscription: Subscription | null = null;

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    reload(): void {
        this.isLoading = true;
        this.alert?.close();

        this.subscription = this.teamService.getTeamMembers().subscribe({
            next: (members) => {
                this.teamMembers = members;
                this.isLoading = false;
            },
            error: (error) => {
                this.alert?.showError(`Failed to load team members: ${error.message}`);
                this.isLoading = false;
            }
        });
    }

    reset() {
        this.selectedMembers = [];
        this.reload();
    }

    clear(table: Table<any>) {
        table.clear();
        this.searchQuery = '';
    }

    onGlobalFilter(table: Table<any>, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    deleteSelectedMembers() {
        throw new Error('Method not implemented.');
    }
}
