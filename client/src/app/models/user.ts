import { DocumentData, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from "@angular/fire/firestore";

export interface User {
    uid: string;
    email: string;
    name: string;
    defaultOrgId: string;
    dateCreated: Date;
    lastLogin: Date;
}

export interface UserDoc {
    email: string;
    name: string;
    defaultOrgId: string;
    dateCreated: Timestamp;
    lastLogin: Timestamp;
}

export function toUser(doc: UserDoc, uid: string): User {
    return {
        uid,
        email: doc.email,
        name: doc.name,
        defaultOrgId: doc.defaultOrgId,
        dateCreated: doc.dateCreated.toDate(),
        lastLogin: doc.lastLogin.toDate(),
    };
}

export function fromUser(user: User): UserDoc {
    return {
        email: user.email,
        name: user.name,
        defaultOrgId: user.defaultOrgId,
        dateCreated: Timestamp.fromDate(user.dateCreated),
        lastLogin: Timestamp.fromDate(user.lastLogin),
    };
}

export const userConverter = {
    toFirestore: (user: User) => fromUser(user),
    fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>, options: SnapshotOptions) => {
        const data = snapshot.data(options) as UserDoc;
        return toUser(data, snapshot.id);
    }
};
