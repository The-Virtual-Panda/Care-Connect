import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";
import { InviteStatus } from "./enums/invite-status";
import { OrgRole } from "./enums/org-role";

export interface OrgMembership {
    id: string;
    orgId: string;
    role: OrgRole;
    dateJoined: Date;
    inviteStatus: InviteStatus;
}

export interface OrgMembershipDoc {
    orgId: string;
    role: OrgRole;
    dateJoined: Timestamp;
    inviteStatus: InviteStatus;
}

export function toOrgMembership(id: string, doc: OrgMembershipDoc): OrgMembership {
    return {
        id: id,
        orgId: doc.orgId,
        role: doc.role,
        dateJoined: doc.dateJoined.toDate(),
        inviteStatus: doc.inviteStatus,
    };
}

export function fromOrgMembership(m: OrgMembership): OrgMembershipDoc {
    return {
        orgId: m.orgId,
        role: m.role,
        dateJoined: Timestamp.fromDate(m.dateJoined),
        inviteStatus: m.inviteStatus,
    };
}

export const orgMembershipConverter = {
    toFirestore: (m: OrgMembership) => fromOrgMembership(m),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrgMembershipDoc;
        return toOrgMembership(snapshot.id, data);
    }
};
