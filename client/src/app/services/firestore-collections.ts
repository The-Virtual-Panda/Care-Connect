import { OrgMembership, orgMembershipConverter } from "@/models/org-membership";
import { Organization, orgConverter } from "@/models/organization";
import { teamMemberConverter } from "@/models/team-member";
import { User, userConverter } from "@/models/user";
import { collection, CollectionReference, doc, DocumentReference, Firestore } from "@angular/fire/firestore";
import { FirestoreDataConverter } from "@angular/fire/firestore";


// Helper function to generate collection helpers
function createCollectionHelpers<T>(collectionPath: string,
    converter?: FirestoreDataConverter<T>) {
    return {
        path: collectionPath,
        collection: (fs: Firestore): CollectionReference<T> =>
            converter
                ? collection(fs, collectionPath).withConverter(converter)
                : collection(fs, collectionPath) as CollectionReference<T>,
        docPath: (id: string) => `${collectionPath}/${id}`,
        docRef: (fs: Firestore, id: string): DocumentReference<T> =>
            converter
                ? doc(fs, `${collectionPath}/${id}`).withConverter(converter)
                : doc(fs, `${collectionPath}/${id}`) as DocumentReference<T>,
    };
}

// Helper function to create subcollection helpers
function createSubcollectionHelpers<T>(
    getCollectionPath: (parentId: string) => string,
    converter?: FirestoreDataConverter<T>
) {
    return {
        path: getCollectionPath,
        collection: (fs: Firestore, parentId: string): CollectionReference<T> =>
            converter
                ? collection(fs, getCollectionPath(parentId)).withConverter(converter)
                : collection(fs, getCollectionPath(parentId)) as CollectionReference<T>,
        docPath: (parentId: string, docId: string) => `${getCollectionPath(parentId)}/${docId}`,
        docRef: (fs: Firestore, parentId: string, docId: string): DocumentReference<T> =>
            converter
                ? doc(fs, `${getCollectionPath(parentId)}/${docId}`).withConverter(converter)
                : doc(fs, `${getCollectionPath(parentId)}/${docId}`) as DocumentReference<T>,
    };
}

// Define the Firestore collections using the helper function
export const FirestoreCollections = {
    users: {
        ...createCollectionHelpers<User>('users', userConverter),

        orgMemberships: createSubcollectionHelpers<OrgMembership>(
            (uid) => `users/${uid}/orgMemberships`,
            orgMembershipConverter
        ),
    },

    organizations: {
        ...createCollectionHelpers<Organization>('organizations', orgConverter),

        users: createSubcollectionHelpers<OrgMembership>(
            (orgId) => `organizations/${orgId}/users`,
            orgMembershipConverter
        ),

        teamMembers: createSubcollectionHelpers(
            (orgId) => `organizations/${orgId}/teamMembers`,
            teamMemberConverter
        ),
    },

    phoneNumbers: {
        ...createCollectionHelpers('phoneNumbers'),
        shifts: createSubcollectionHelpers(
            (id) => `phoneNumbers/${id}/shifts`
        ),
    },
};
