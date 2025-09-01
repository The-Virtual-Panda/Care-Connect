import { Observable, from, map, of } from 'rxjs';

import { Injectable, inject } from '@angular/core';
import { collectionData, deleteDoc, doc, setDoc } from '@angular/fire/firestore';

import { OrganizationRole } from '../models/entity/organization-role';
import { FirestoreCollectionsService } from './firestore-collections';

@Injectable()
export class OrgService {
    private firestoreCollections = inject(FirestoreCollectionsService);

    /**
     * Get all roles for an organization (live stream)
     */
    getRoles(orgId: string | null): Observable<OrganizationRole[]> {
        if (!orgId) return of([]);
        const rolesCollection = this.firestoreCollections.organizations.roles.collection(orgId);
        return collectionData(rolesCollection) as Observable<OrganizationRole[]>;
    }

    /**
     * Create or update a role within an organization
     */
    saveRole(orgId: string | null, role: Partial<OrganizationRole>): Observable<string> {
        if (!orgId) throw new Error('No organization selected');

        const isNew = !role.id;
        const roleId = role.id || doc(this.firestoreCollections.organizations.roles.collection(orgId)).id;

        const now = new Date();
        const roleToSave: OrganizationRole = {
            id: roleId,
            name: role.name || '',
            permissions: role.permissions || [],
            dateUpdated: now,
            dateCreated: isNew ? now : role.dateCreated || now
        };

        const roleDocRef = this.firestoreCollections.organizations.roles.docRef(orgId, roleId);
        return from(setDoc(roleDocRef, roleToSave as any)).pipe(map(() => roleId));
    }

    /**
     * Delete multiple roles by id
     */
    deleteRoles(orgId: string | null, roleIds: string[]): Observable<void> {
        if (!orgId) throw new Error('No organization selected');
        if (!roleIds || !roleIds.length) return of(undefined);

        // TODO: Verify roles are not assigned

        const deletions = roleIds.map((id) => deleteDoc(this.firestoreCollections.organizations.roles.docRef(orgId, id)));
        return from(Promise.all(deletions)).pipe(map(() => undefined));
    }
}
