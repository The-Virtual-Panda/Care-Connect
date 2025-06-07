import { Organization, organizationConverter } from '@/models/organization';
import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, DocumentReference } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrgService {
    constructor(private firestore: Firestore) { }

    private orgsCollection() {
        return collection(this.firestore, 'organizations').withConverter(organizationConverter);
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
        const docRef = doc(this.firestore, `organizations/${orgId}`).withConverter(organizationConverter);
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
        const docRef = doc(this.firestore, `organizations/${orgId}`).withConverter(organizationConverter);
        // If updating, you may want to convert partials manually if they include dates
        const updateData = org as any;
        if (updateData.dateCreated instanceof Date) {
            updateData.dateCreated = (window as any).firebase.firestore.Timestamp.fromDate(updateData.dateCreated);
        }
        if (updateData.dateUpdated instanceof Date) {
            updateData.dateUpdated = (window as any).firebase.firestore.Timestamp.fromDate(updateData.dateUpdated);
        }
        return from(updateDoc(docRef, updateData));
    }

    deleteOrganization(orgId: string): Observable<void> {
        const docRef = doc(this.firestore, `organizations/${orgId}`).withConverter(organizationConverter);
        return from(deleteDoc(docRef));
    }
}
