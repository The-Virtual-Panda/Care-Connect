export const FirestoreCollections = {
    users: {
        path: 'users',
        doc: (uid: string) => `users/${uid}`,
        orgMemberships: {
            path: (uid: string) => `users/${uid}/orgMemberships`,
            doc: (uid: string, orgId: string) => `users/${uid}/orgMemberships/${orgId}`,
        },
    },

    organizations: {
        path: 'organizations',
        doc: (orgId: string) => `organizations/${orgId}`,
        users: {
            path: (orgId: string) => `organizations/${orgId}/users`,
            doc: (orgId: string, uid: string) => `organizations/${orgId}/users/${uid}`,
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

    teamMembers: {
        path: 'teamMembers',
        doc: (id: string) => `teamMembers/${id}`,
    },
};
