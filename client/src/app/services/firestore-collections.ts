export const FirestoreCollections = {
    users: {
        path: 'users',
        doc: (uid: string) => `users/${uid}`,
        orgMemberships: {
            path: (uid: string) => `users/${uid}/orgMemberships`,
            doc: (uid: string, orgId: string) => `users/${uid}/orgMemberships/${orgId}`,
        },
    },

    // invites: {
    //     path: 'invites',
    //     doc: (id: string) => `invites/${id}`,
    //     byEmail: (email: string) => `invites`,
    // },

    organizations: {
        path: 'organizations',
        doc: (orgId: string) => `organizations/${orgId}`,
        users: {
            path: (orgId: string) => `organizations/${orgId}/users`,
            doc: (orgId: string, uid: string) => `organizations/${orgId}/users/${uid}`,
        },
        teamMembers: {
            path: (orgId: string) => `organizations/${orgId}/teamMembers`,
            doc: (orgId: string, uid: string) => `organizations/${orgId}/teamMembers/${uid}`,
        },
    },

    phoneNumbers: {
        path: 'phoneNumbers',
        doc: (id: string) => `phoneNumbers/${id}`,
        shifts: {
            path: (id: string) => `phoneNumbers/${id}/shifts`,
            doc: (id: string, shiftId: string) => `phoneNumbers/${id}/shifts/${shiftId}`,
        }
    },


};
