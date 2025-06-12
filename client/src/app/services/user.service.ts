// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';
import { from, forkJoin, Observable, switchMap } from 'rxjs';
import { User } from '@/models/user';
import { OrgRole } from '@/models/enums/org-role';
import { OrgMember } from '@/models/org-member';
import { FirestoreCollections } from './firestore-collections';
import { AuthService } from './auth.service';
import { InviteStatus } from '@/models/enums/invite-status';
import { OrgMemberDoc } from '../models/org-member';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private firestore: Firestore,
        private authService: AuthService) { }

    registerSelf(
        email: string,
        password: string,
        name: string,
        orgId: string,
        role: OrgMember['role'] = OrgRole.Admin
    ): Observable<void[]> {
        return this.authService
            .register(email, password)
            .pipe(
                switchMap(cred => {
                    const uid = cred.uid;

                    const userRef = doc(this.firestore, FirestoreCollections.users.doc(uid));
                    const membershipRef = doc(
                        this.firestore,
                        FirestoreCollections.users.orgMemberships.doc(uid, orgId)
                    );
                    const orgUserRef = doc(
                        this.firestore,
                        FirestoreCollections.organizations.members.doc(orgId, uid)
                    );

                    const userData: User = {
                        uid: uid,
                        email,
                        name: name,
                        defaultOrgId: orgId,
                        lastLogin: null,
                        dateCreated: new Date(),
                        dateUpdated: new Date(),
                    };

                    const membershipData: OrgMember = {
                        id: '', // This will be set by Firestore
                        orgId: orgId,
                        role: role,
                        dateJoined: new Date(),
                        inviteStatus: InviteStatus.Active
                    };

                    return forkJoin([
                        from(
                            setDoc(userRef, {
                                ...userData,
                                dateCreated: serverTimestamp(),
                                dateUpdated: serverTimestamp(),
                                lastLogin: serverTimestamp(),
                            })
                        ),
                        from(
                            setDoc(membershipRef, {
                                ...membershipData,
                                dateJoined: serverTimestamp(),
                            })
                        ),
                        from(
                            setDoc(orgUserRef, {
                                uid,
                                email,
                                role,
                                joinedAt: serverTimestamp(),
                                status: 'active',
                            })
                        ),
                    ]);
                })
            );
    }

}
