import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";
import { InviteStatus } from "./enums/invite-status";
import { OrgRole } from "./enums/org-role";

export interface OrgMember {
    id: string;
    orgId: string;
    role: OrgRole;
    dateJoined: Date;
    inviteStatus: InviteStatus;
}

export interface OrgMemberDoc {
    orgId: string;
    role: OrgRole;
    joinedAt: Timestamp;
    inviteStatus: InviteStatus;
}

export function toOrgMembership(id: string, doc: OrgMemberDoc): OrgMember {
    return {
        id: id,
        orgId: doc.orgId,
        role: doc.role,
        dateJoined: doc.joinedAt.toDate(),
        inviteStatus: doc.inviteStatus,
    };
}

export function fromOrgMembership(m: OrgMember): OrgMemberDoc {
    return {
        orgId: m.orgId,
        role: m.role,
        joinedAt: Timestamp.fromDate(m.dateJoined),
        inviteStatus: m.inviteStatus,
    };
}

export const orgMembershipConverter = {
    toFirestore: (m: OrgMember) => fromOrgMembership(m),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrgMemberDoc;
        return toOrgMembership(snapshot.id, data);
    }
};
