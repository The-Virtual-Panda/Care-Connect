import { Organization, orgConverter } from '@/models/organization';
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, DocumentReference, Timestamp } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { FirestoreCollections } from './firestore-collections';

@Injectable({
    providedIn: 'root'
})
export class OrgService {
    constructor(private firestore: Firestore) { }

    private orgsCollection() {
        return collection(this.firestore, FirestoreCollections.organizations.path).withConverter(orgConverter);
    }

    getOrganizations(): Observable<Organization[]> {
        const colRef = this.orgsCollection();
        return from(
            getDocs(colRef).then(snapshot =>
                snapshot.docs.map(doc => doc.data())
            )
        );
    }

    getOrganizationById(orgId: string): Observable<Organization | null> {
        const docRef = doc(this.firestore, FirestoreCollections.organizations.docPath(orgId)).withConverter(orgConverter);
        return from(
            getDoc(docRef).then(snapshot =>
                snapshot.exists() ? snapshot.data()! : null
            )
        );
    }

    addOrganization(org: Organization): Observable<DocumentReference<Organization>> {
        const colRef = this.orgsCollection();
        return from(addDoc(colRef, org));
    }

    updateOrganization(orgId: string, org: Partial<Organization>): Observable<void> {
        const docRef = doc(this.firestore, FirestoreCollections.organizations.docPath(orgId))
            .withConverter(orgConverter);

        return from(updateDoc(docRef, org as any));
    }

    deleteOrganization(orgId: string): Observable<void> {
        const docRef = doc(this.firestore, FirestoreCollections.organizations.docPath(orgId)).withConverter(orgConverter);
        return from(deleteDoc(docRef));
    }
}
