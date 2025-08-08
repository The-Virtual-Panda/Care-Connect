import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';

export interface User {
    // Required fields
    id: string;
    email: string;
    name: string;
    dateUpdated: Date;
    dateCreated: Date;

    // Can be null but must be intentionally null
    defaultOrgId: string | null;

    // Can be ignored in instantiation
    lastLogin?: Date | null;
    avatarUrl?: string | null;
    dateAvatarUpdated?: Date | null;
    notifyNewChangeBlogs?: boolean;
    lastChangeBlogRead?: string | null;
}

interface UserFireDoc {
    // Required - Guaranteed
    email: string;
    name: string;
    dateCreated: Timestamp;
    dateUpdated: Timestamp;

    // Optional Fields
    lastLogin: Timestamp | null;
    defaultOrgId: string | null;
    avatarUrl: string | null;
    dateAvatarUpdated: Timestamp | null;
    lastChangeBlogRead: string | null;
    notifyNewChangeBlogs: boolean | null;
}

function fromFireDoc(uid: string, doc: UserFireDoc): User {
    return {
        id: uid,
        email: doc.email,
        name: doc.name,
        dateUpdated: doc.dateUpdated.toDate(),
        dateCreated: doc.dateCreated.toDate(),

        defaultOrgId: doc.defaultOrgId ?? null,
        lastLogin: doc.lastLogin ? doc.lastLogin.toDate() : null,
        avatarUrl: doc.avatarUrl ?? null,
        dateAvatarUpdated: doc.dateAvatarUpdated ? doc.dateAvatarUpdated.toDate() : null,
        lastChangeBlogRead: doc.lastChangeBlogRead ?? null,
        notifyNewChangeBlogs: doc.notifyNewChangeBlogs ?? true
    };
}

function toFireDoc(user: User): UserFireDoc {
    return {
        email: user.email,
        name: user.name,
        defaultOrgId: user.defaultOrgId ?? null,
        dateCreated: Timestamp.fromDate(user.dateCreated),
        dateUpdated: Timestamp.fromDate(user.dateUpdated),
        lastLogin: user.lastLogin ? Timestamp.fromDate(user.lastLogin) : null,
        avatarUrl: user.avatarUrl || null,
        dateAvatarUpdated: user.dateAvatarUpdated ? Timestamp.fromDate(user.dateAvatarUpdated) : null,
        lastChangeBlogRead: user.lastChangeBlogRead || null,
        notifyNewChangeBlogs: user.notifyNewChangeBlogs ?? true
    };
}

export const userConverter = {
    toFirestore: (user: User) => toFireDoc(user),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as UserFireDoc;
        return fromFireDoc(snapshot.id, data);
    }
};
