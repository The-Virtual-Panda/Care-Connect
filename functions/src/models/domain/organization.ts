import { TeamMember } from './team-member';

/** An organization (your customer) in pure domain terms */
export interface Organization {
    id: string;
    name: string;
    dateCreated: Date;
    dateUpdated: Date;
    stripeCustomerId?: string;
    twilioAccountSid?: string;
    twilioAuthToken?: string;
}

export interface OrganizationWithTeamMembers extends Organization {
    teamMembers: TeamMember[];
}
