import { TeamMember } from "./team-member";

/** An organization (your customer) in pure domain terms */
export interface Organization {
    name: string;
    dateCreated: Date;
    dateUpdated: Date;
}

export interface OrganizationWithTeamMembers extends Organization {
    teamMembers: TeamMember[];
}
