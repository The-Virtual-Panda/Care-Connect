import { Injectable, inject } from '@angular/core';
import { CollectionReference, DocumentReference, Firestore, FirestoreDataConverter, collection, doc } from '@angular/fire/firestore';

import { OrgMembership, orgMembershipConverter } from '@/api/models/org-membership';
import { Organization, orgConverter } from '@/api/models/organization';
import { teamMemberConverter } from '@/api/models/team-member';
import { User, userConverter } from '@/api/models/user';

import { phoneNumberConverter } from '../models/phone-number';
import { shiftConverter } from '../models/shift';

@Injectable({
    providedIn: 'root'
})
export class FirestoreCollectionsService {
    private firestore = inject(Firestore);

    // Helper to build top-level collections
    private createCollectionHelpers<T>(collectionPath: string, converter?: FirestoreDataConverter<T>) {
        return {
            path: collectionPath,
            collection: (): CollectionReference<T> => {
                return converter
                    ? collection(this.firestore, collectionPath).withConverter(converter)
                    : (collection(this.firestore, collectionPath) as CollectionReference<T>);
            },
            docPath: (id: string) => `${collectionPath}/${id}`,
            docRef: (id: string): DocumentReference<T> => {
                return converter
                    ? doc(this.firestore, `${collectionPath}/${id}`).withConverter(converter)
                    : (doc(this.firestore, `${collectionPath}/${id}`) as DocumentReference<T>);
            }
        };
    }

    // Helper to build subcollections
    private createSubcollectionHelpers<T>(getPath: (parentId: string) => string, converter?: FirestoreDataConverter<T>) {
        return {
            path: getPath,
            collection: (parentId: string): CollectionReference<T> => {
                return converter
                    ? collection(this.firestore, getPath(parentId)).withConverter(converter)
                    : (collection(this.firestore, getPath(parentId)) as CollectionReference<T>);
            },
            docPath: (parentId: string, docId: string) => `${getPath(parentId)}/${docId}`,
            docRef: (parentId: string, docId: string): DocumentReference<T> => {
                return converter
                    ? doc(this.firestore, `${getPath(parentId)}/${docId}`).withConverter(converter)
                    : (doc(this.firestore, `${getPath(parentId)}/${docId}`) as DocumentReference<T>);
            }
        };
    }

    // Create collection references
    public users = {
        ...this.createCollectionHelpers<User>('users', userConverter),
        orgMemberships: this.createSubcollectionHelpers<OrgMembership>((uid) => `users/${uid}/orgMemberships`, orgMembershipConverter)
    };

    public organizations = {
        ...this.createCollectionHelpers<Organization>('organizations', orgConverter),
        users: this.createSubcollectionHelpers<OrgMembership>((orgId) => `organizations/${orgId}/users`, orgMembershipConverter),
        teamMembers: this.createSubcollectionHelpers((orgId) => `organizations/${orgId}/teamMembers`, teamMemberConverter)
    };

    public phoneNumbers = {
        ...this.createCollectionHelpers('phoneNumbers', phoneNumberConverter(this)),
        shifts: this.createSubcollectionHelpers((id) => `phoneNumbers/${id}/shifts`, shiftConverter)
    };
}
