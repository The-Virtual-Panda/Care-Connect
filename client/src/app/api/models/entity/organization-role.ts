import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

import { OrgPermission } from '../enums/org-permission';

export interface OrganizationRole {
    id: string;
    name: string;
    permissions: OrgPermission[];
    dateCreated: Date;
    dateUpdated: Date;
}

interface OrganizationRoleFireDoc {
    name: string;
    permissions: OrgPermission[];
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

function fromFireDoc(doc: OrganizationRoleFireDoc, id: string): OrganizationRole {
    return {
        id,
        name: doc.name,
        permissions: doc.permissions,
        dateCreated: doc.dateCreated.toDate(),
        dateUpdated: doc.dateUpdated.toDate()
    };
}

function toFireDoc(role: OrganizationRole): OrganizationRoleFireDoc {
    return {
        name: role.name,
        permissions: role.permissions,
        dateCreated: Timestamp.fromDate(role.dateCreated),
        dateUpdated: Timestamp.fromDate(role.dateUpdated)
    };
}

export const orgRoleConverter = {
    toFirestore: (role: OrganizationRole) => toFireDoc(role),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrganizationRoleFireDoc;
        return fromFireDoc(data, snapshot.id);
    }
};
