import { OrganizationRole } from '@/api/models/entity/organization-role';
import { OrgPermission, OrgPermissionGroup } from '@/api/models/enums/org-permission';
import { AuthService } from '@/api/services/auth.service';
import { OrgService } from '@/api/services/org.service';
import { AppAlert } from '@/components/app-alert.component';
import { AppModal } from '@/components/app-modal.component';
import { ToastService } from '@/services/toast.service';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, effect, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { FloatLabel } from 'primeng/floatlabel';
import { Fluid } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'org-roles-master',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TableModule,
        ToolbarModule,
        ButtonModule,
        InputIconModule,
        IconFieldModule,
        InputTextModule,
        FloatLabel,
        CheckboxModule,
        MessageModule,
        ConfirmDialog,
        AppAlert,
        AppModal,
        Skeleton,
        Fluid,
        TooltipModule
    ],
    templateUrl: './roles-master.component.html',
    providers: [ConfirmationService]
})
export class OrgRolesMasterComponent implements OnInit, OnDestroy {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private confirmationService = inject(ConfirmationService);
    private formBuilder = inject(FormBuilder);
    private orgService = inject(OrgService);

    @ViewChild(AppAlert) alert: AppAlert | undefined;
    @ViewChild(AppModal) modal!: AppModal;

    roles: OrganizationRole[] = [];
    selectedRoles: OrganizationRole[] = [];
    isLoading = true;
    searchQuery = '';

    roleForm: FormGroup;
    submitted = false;
    private subscription: Subscription | null = null;

    // Permissions UI
    readonly permissionGroups = OrgPermissionGroup.values;
    readonly permissionValues = OrgPermission.values;
    groupLabel(g: OrgPermissionGroup) {
        return OrgPermissionGroup.display(g);
    }

    permLabel(p: OrgPermission) {
        return OrgPermission.display(p);
    }

    displayPerms(perms: OrgPermission[] = []): string {
        return perms
            .map((p) => OrgPermission.display(p))
            .sort((a, b) => a.localeCompare(b))
            .join(', ');
    }

    permsByGroup(g: OrgPermissionGroup): OrgPermission[] {
        return OrgPermission.byGroup(g);
    }

    isPermSelected(p: OrgPermission): boolean {
        const perms: OrgPermission[] = this.roleForm.get('permissions')?.value || [];
        return perms.includes(p);
    }

    isPermAvailable(permission: OrgPermission): boolean {
        return OrgPermission.isAvailable(permission);
    }

    onPermToggle(p: OrgPermission, checked: boolean) {
        const ctrl = this.roleForm.get('permissions');
        const curr: OrgPermission[] = (ctrl?.value as OrgPermission[]) || [];
        const set = new Set(curr);
        if (checked) set.add(p);
        else set.delete(p);
        ctrl?.setValue(Array.from(set));
        ctrl?.markAsDirty();
        ctrl?.markAsTouched();
    }

    constructor() {
        this.roleForm = this.formBuilder.group({
            id: [''],
            name: ['', Validators.required],
            permissions: [[]],
            dateUpdated: [null],
            dateCreated: [null]
        });
    }

    ngOnInit(): void {
        this.reload();
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }

    reload(): void {
        this.isLoading = true;
        this.alert?.close();
        const orgId = this.authService.currentOrgId();
        this.subscription = this.orgService.getRoles(orgId).subscribe({
            next: (roles) => {
                this.roles = roles;
                this.isLoading = false;
            },
            error: (err) => {
                this.alert?.showError(`Failed to load roles: ${err.message}`);
                this.isLoading = false;
            }
        });
    }

    reset() {
        this.selectedRoles = [];
        this.reload();
    }

    clearFilters(table: Table<any>) {
        table.clear();
        this.searchQuery = '';
    }

    onGlobalFilter(table: Table<any>, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    addRole() {
        this.submitted = false;
        this.roleForm.reset();
        this.roleForm.patchValue({ permissions: [] });
        this.modal.title = 'Add Role';
        this.modal?.showModal();
    }

    editRole(role: OrganizationRole) {
        this.submitted = false;
        this.roleForm.patchValue({
            id: role.id,
            name: role.name,
            permissions: role.permissions,
            dateUpdated: role.dateUpdated,
            dateCreated: role.dateCreated
        });
        this.roleForm.markAsPristine();
        this.roleForm.markAsUntouched();
        this.modal.title = 'Edit Role';
        this.modal?.showModal();
    }

    onSubmitRole() {
        this.submitted = true;
        if (this.roleForm.invalid) return;
        const roleData = this.roleForm.value as Partial<OrganizationRole>;
        this.isLoading = true;
        const orgId = this.authService.currentOrgId();
        this.orgService.saveRole(orgId, roleData).subscribe({
            next: () => {
                this.modal.hideModal();
                this.toastService.showSuccess('Success', 'Role saved successfully');
                this.reload();
            },
            error: (error: Error) => {
                this.alert?.showError(`Failed to save role: ${error.message}`);
                this.isLoading = false;
            }
        });
    }

    isFieldInvalid(field: string): boolean {
        const control = this.roleForm.get(field);
        return (control?.invalid && (control?.touched || this.submitted)) ?? false;
    }

    confirmDelete() {
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected role(s)?',
            header: 'Danger Zone',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
            acceptButtonProps: { label: 'Delete', severity: 'danger' },
            accept: () => this.deleteSelectedRoles()
        });
    }

    deleteSelectedRoles() {
        if (!this.selectedRoles?.length) return;
        const ids = this.selectedRoles.map((r) => r.id);
        this.isLoading = true;
        const orgId = this.authService.currentOrgId();
        this.orgService.deleteRoles(orgId, ids).subscribe({
            next: () => {
                this.toastService.showSuccess('Success', 'Role(s) deleted successfully');
                this.selectedRoles = [];
                this.reload();
            },
            error: (error: Error) => this.alert?.showError(`Failed to delete role(s): ${error.message}`)
        });
    }
}
