import { Injectable, inject } from "@angular/core";
import { FirestoreCollectionsService } from "./firestore-collections";
import { collection, query, where, getDocs, orderBy } from '@angular/fire/firestore';
import { PhoneNumber, phoneNumberConverter } from '../models/phone-number';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PhoneService {

    private firestoreCollections = inject(FirestoreCollectionsService);

    public getOrgPhoneNumbers(orgId: string): Observable<PhoneNumber[]> {
        // Use the phoneNumbers collection from firestoreCollections
        const phoneNumbersCollection = this.firestoreCollections.phoneNumbers.collection();

        // Create query to filter by orgId only
        const phoneNumbersQuery = query(
            phoneNumbersCollection,
            where('orgId', '==', orgId)
        );

        // Execute query and map results
        return from(getDocs(phoneNumbersQuery)).pipe(
            map(snapshot => snapshot.docs.map(doc => doc.data()))
        );
    }

}
