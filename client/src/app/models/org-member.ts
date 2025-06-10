import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";
import { InviteStatus } from "./enums/invite-status";
import { OrgRole } from "./enums/org-role";

export interface OrgMember {
    orgId: string;
    role: OrgRole;
    joinedAt: Date;
    inviteStatus: InviteStatus;
}

export interface OrgMemberDoc {
    orgId: string;
    role: OrgRole;
    joinedAt: Timestamp;
    inviteStatus: InviteStatus;
}

export function toOrgMembership(doc: OrgMemberDoc): OrgMember {
    return {
        orgId: doc.orgId,
        role: doc.role,
        joinedAt: doc.joinedAt.toDate(),
        inviteStatus: doc.inviteStatus,
    };
}

export function fromOrgMembership(m: OrgMember): OrgMemberDoc {
    return {
        orgId: m.orgId,
        role: m.role,
        joinedAt: Timestamp.fromDate(m.joinedAt),
        inviteStatus: m.inviteStatus,
    };
}

export const orgMembershipConverter = {
    toFirestore: (m: OrgMember) => fromOrgMembership(m),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as OrgMemberDoc;
        return toOrgMembership(data);
    }
};
