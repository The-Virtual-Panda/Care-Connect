import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable, inject } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore';

import { PhoneNumber, phoneNumberConverter } from '../models/phone-number';
import { Shift } from '../models/shift';
import { FirestoreCollectionsService } from './firestore-collections';

@Injectable({ providedIn: 'root' })
export class PhoneService {
    private firestoreCollections = inject(FirestoreCollectionsService);

    public getOrgPhoneNumbers(orgId: string): Observable<PhoneNumber[]> {
        // Use the phoneNumbers collection from firestoreCollections
        const phoneNumbersCollection = this.firestoreCollections.phoneNumbers.collection();

        // Create query to filter by orgId only
        const phoneNumbersQuery = query(phoneNumbersCollection, where('orgId', '==', orgId));

        // Execute query and map results
        return from(getDocs(phoneNumbersQuery)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    public getPhoneShifts(phoneId: string): Observable<Shift[]> {
        // Use the shifts subcollection from firestoreCollections
        const shiftsCollection = this.firestoreCollections.phoneNumbers.shifts.collection(phoneId);

        // Create query to order by start date
        const shiftsQuery = query(shiftsCollection, orderBy('start', 'asc'));

        // Execute query and map results
        return from(getDocs(shiftsQuery)).pipe(map((snapshot) => snapshot.docs.map((doc) => doc.data())));
    }

    public saveShift(phoneId: string, shift: Shift): Observable<void> {
        const shiftsCollection = this.firestoreCollections.phoneNumbers.shifts.collection(phoneId);

        if (shift.id) {
            // Update existing shift
            const shiftRef = this.firestoreCollections.phoneNumbers.shifts.docRef(phoneId, shift.id);
            return from(
                updateDoc(shiftRef, {
                    assigneeId: shift.assigneeId,
                    start: shift.start,
                    end: shift.end,
                    enabled: shift.enabled,
                    timeZone: shift.timeZone
                })
            );
        } else {
            // Add new shift
            return from(addDoc(shiftsCollection, shift)).pipe(map(() => void 0));
        }
    }

    public deleteShift(phoneId: string, shiftId: string): Observable<void> {
        const shiftRef = this.firestoreCollections.phoneNumbers.shifts.docRef(phoneId, shiftId);
        return from(deleteDoc(shiftRef));
    }

    public deleteShifts(phoneId: string, shiftIds: string[]): Observable<void[]> {
        const deletePromises = shiftIds.map((id) => {
            const shiftRef = this.firestoreCollections.phoneNumbers.shifts.docRef(phoneId, id);
            return deleteDoc(shiftRef);
        });

        return from(Promise.all(deletePromises));
    }
}
