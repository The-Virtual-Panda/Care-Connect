import { logger } from "firebase-functions";
import { fireDb } from "../firebase-config";
import { organizationConverter } from "../models/dto/firestore/organization-dto";
import { phoneNumberConverter } from "../models/dto/firestore/phone-number-dto";
import { Organization, OrganizationWithTeamMembers } from "../models/domain/organization";
import { PhoneNumber } from "../models/domain/phone-number";
import { teamMemberConverter } from "../models/dto/firestore/team-member-dto";
import { TeamMember } from "../models/domain/team-member";

const Collections = {
    organization: {
        root: "organizations",
        teamMembers: "teamMembers",
    },
    phoneNumbers: {
        root: "phoneNumbers",
    },
};

export class FirestoreService {
    /**
     * Fetch a single organization and its team members by organization ID.
     * Returns the organization with its team members, or null if not found.
     */
    async getOrganizationWithTeamMembersById(organizationId: string): Promise<OrganizationWithTeamMembers | null> {
        const orgRef = fireDb.collection(Collections.organization.root)
            .doc(organizationId)
            .withConverter(organizationConverter);

        const orgDoc = await orgRef.get();
        if (!orgDoc.exists) return null;

        const orgData = orgDoc.data();
        if (!orgData) {
            logger.error(`Organization data not found for ID: ${organizationId}`);
            return null;
        }

        const teamMembers: TeamMember[] = await this.getTeamMembersForOrganization(organizationId);

        // Return the organization data along with its team members
        const fullOrg: OrganizationWithTeamMembers = {
            ...orgData,
            id: orgDoc.id,
            teamMembers
        }

        return fullOrg;
    }

    async getOrganizations(): Promise<Organization[]> {
        const orgsSnap = await fireDb.collection(Collections.organization.root)
            .withConverter(organizationConverter).get();
        const organizations: Organization[] = orgsSnap.docs.map(doc => ({
            ...doc.data()
        }));
        return organizations;
    }

    /**
     * Fetch all phone numbers from the phoneNumbers collection.
     * Returns an array of objects with the phone number (document ID) and its data.
     */
    async getAllPhoneNumbers(): Promise<PhoneNumber[]> {
        const phoneNumbersSnap = await fireDb.collection(Collections.phoneNumbers.root)
            .withConverter(phoneNumberConverter).get();
        const phoneNumbers: PhoneNumber[] = phoneNumbersSnap.docs.map(doc => ({
            ...doc.data(),
        }));
        return phoneNumbers;
    }

    /**
     * Fetch a specific phone number document by its ID.
     * Returns the phone number document data, or null if not found.
     */
    async getPhoneNumber(phoneNumberId: string): Promise<PhoneNumber | null> {
        const phoneDoc = await fireDb.collection(Collections.phoneNumbers.root)
            .withConverter(phoneNumberConverter)
            .doc(phoneNumberId)
            .get();

        if (!phoneDoc.exists) {
            logger.warn(`No phone number document found for: ${phoneNumberId}`);
            return null;
        }

        return phoneDoc.data() as PhoneNumber;
    }

    /**
     * Fetch a specific organization document by its ID.
     * Returns the organization document data, or null if not found.
     */
    async getOrganizationById(organizationId: string): Promise<Organization | null> {
        const orgDoc = await fireDb.collection(Collections.organization.root)
            .withConverter(organizationConverter)
            .doc(organizationId)
            .get();

        if (!orgDoc.exists) {
            logger.warn(`No organization document found for: ${organizationId}`);
            return null;
        }

        return orgDoc.data() as Organization;
    }

    /**
     * Fetch all team members for a specific organization by organization ID.
     * Returns an array of TeamMember objects, or an empty array if none found.
     */
    async getTeamMembersForOrganization(organizationId: string): Promise<TeamMember[]> {
        const teamMembersSnap = await fireDb
            .collection(Collections.organization.root)
            .doc(organizationId)
            .collection(Collections.organization.teamMembers)
            .withConverter(teamMemberConverter)
            .get();

        return teamMembersSnap.docs.map(doc => doc.data());
    }

    /**
     * Fetch the organization (and its team members) referenced by a phoneNumbers document.
     * The phoneNumbers collection contains docs with a reference to the organization.
     * Returns the organization with its team members, or null if not found.
     */
    async getOrganizationByPhoneNumber(phoneNumber: string): Promise<Organization | null> {
        // Normalize phone number: remove leading '+' if present
        logger.info(`Looking up an organization tied to phone number: ${phoneNumber}`);

        const number = await this.getPhoneNumber(phoneNumber);
        if (!number) {
            logger.warn(`No phone number document found for: ${phoneNumber}`);
            return null;
        }

        const foundOrg = this.getOrganizationWithTeamMembersById(number.orgId);
        if (!foundOrg) {
            logger.warn(`No organization document found for: ${number.orgId}`);
            return null;
        }

        return foundOrg;
    }
}

