import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

export interface User {
    uid: string;
    email: string;
    name: string;
    defaultOrgId: string;
    lastLogin: Date | null;
    avatarUrl?: string | null;
    dateAvatarUpdated?: Date | null;
    lastChangeBlogRead?: string;

    /**
     * Whether the user wants to be notified of new change blogs in the application
     * This is a user preference that can be toggled in settings.
     */
    notifyNewChangeBlogs?: boolean;

    dateUpdated: Date;
    dateCreated: Date;
}

export interface UserDoc {
    email: string;
    name: string;
    defaultOrgId: string;
    lastLogin: Timestamp | null;
    avatarUrl?: string | null;
    dateAvatarUpdated?: Timestamp | null;
    lastChangeBlogRead?: string;
    notifyNewChangeBlogs?: boolean;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;
}

export function toUser(uid: string, doc: UserDoc): User {
    return {
        uid: uid,
        email: doc.email,
        name: doc.name,
        defaultOrgId: doc.defaultOrgId,
        lastLogin: doc.lastLogin ? doc.lastLogin.toDate() : null,
        avatarUrl: doc.avatarUrl || null,
        dateAvatarUpdated: doc.dateAvatarUpdated ? doc.dateAvatarUpdated.toDate() : null,
        dateUpdated: doc.dateUpdated.toDate(),
        dateCreated: doc.dateCreated.toDate()
    };
}

export function fromUser(user: User): UserDoc {
    return {
        email: user.email,
        name: user.name,
        defaultOrgId: user.defaultOrgId,
        lastLogin: user.lastLogin ? Timestamp.fromDate(user.lastLogin) : null,
        avatarUrl: user.avatarUrl || null,
        dateAvatarUpdated: user.dateAvatarUpdated ? Timestamp.fromDate(user.dateAvatarUpdated) : null,
        dateCreated: Timestamp.fromDate(user.dateCreated),
        dateUpdated: Timestamp.fromDate(user.dateUpdated)
    };
}

export const userConverter = {
    toFirestore: (user: User) => fromUser(user),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as UserDoc;
        return toUser(snapshot.id, data);
    }
};
