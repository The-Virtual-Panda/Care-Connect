import { format } from 'date-fns';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { collection, getDocs, getFirestore, query, where } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Organization } from '@/api/models/organization';
import { User } from '@/api/models/user';
import { FirestoreCollectionsService } from '@/api/services/firestore-collections';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SkeletonModule } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

interface OrganizationOption {
    id: string;
    name: string;
}

@Component({
    selector: 'app-system-users',
    templateUrl: './system-users.component.html',
    standalone: true,
    imports: [
        CommonModule,
        InputIconModule,
        FormsModule,
        TableModule,
        ToastModule,
        ButtonModule,
        InputTextModule,
        SelectButtonModule,
        SkeletonModule,
        TooltipModule,
        IconFieldModule
    ],
    providers: [MessageService]
})
export class SystemUsersComponent implements OnInit, OnDestroy {
    private firestore = getFirestore();
    private firestoreCollections = inject(FirestoreCollectionsService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    users: User[] = [];
    filteredUsers: User[] = [];
    organizations: Organization[] = [];
    orgFilterOptions: OrganizationOption[] = [];
    isLoading = true;
    searchTerm = '';
    selectedOrgFilter: string | null = null;

    private subscriptions: Subscription[] = [];

    ngOnInit(): void {
        this.loadUsers();
        this.loadOrganizations();
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    async loadUsers(): Promise<void> {
        this.isLoading = true;
        try {
            const usersCollection = this.firestoreCollections.users.collection();
            const userSnapshot = await getDocs(usersCollection);

            this.users = userSnapshot.docs.map((doc) => {
                return doc.data();
            });

            this.filteredUsers = [...this.users];
            this.isLoading = false;
        } catch (error) {
            console.error('Error loading users:', error);
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load users. Please try again.'
            });
            this.isLoading = false;
        }
    }

    async loadOrganizations(): Promise<void> {
        try {
            const orgsCollection = this.firestoreCollections.organizations.collection();
            const orgSnapshot = await getDocs(orgsCollection);

            this.organizations = orgSnapshot.docs.map((doc) => {
                return doc.data();
            });

            this.orgFilterOptions = this.organizations.map((org) => ({
                id: org.id,
                name: org.name
            }));
        } catch (error) {
            console.error('Error loading organizations:', error);
        }
    }

    applyFilter(): void {
        this.filteredUsers = this.users.filter((user) => {
            const matchesSearch =
                !this.searchTerm ||
                user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(this.searchTerm.toLowerCase());

            const matchesOrg = !this.selectedOrgFilter || user.defaultOrgId === this.selectedOrgFilter;

            return matchesSearch && matchesOrg;
        });
    }

    onOrgFilterChange(): void {
        this.applyFilter();
    }

    formatDateTime(date: Date | null): string {
        if (!date) return 'Never';
        return format(date, 'MMM d, yyyy h:mm a');
    }

    getOrganizationName(orgId: string): string {
        const org = this.organizations.find((o) => o.id === orgId);
        return org ? org.name : 'Unknown Organization';
    }

    viewUserDetails(user: User): void {
        this.router.navigate(['/admin/users', user.uid]);
    }

    clear(table: Table): void {
        table.clear();
        this.searchTerm = '';
        this.selectedOrgFilter = null;
        this.filteredUsers = [...this.users];
    }

    reset(): void {
        this.loadUsers();
        this.searchTerm = '';
        this.selectedOrgFilter = null;
    }
}
