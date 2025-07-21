import * as dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

import { auth } from '../src/firebase-config';
import * as readline from 'readline';

/**
 * Creates an interface for reading input from the command line
 */
function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

/**
 * Grants the systemAdmin role to a specified user
 * @param uid User ID to grant the system admin role to
 */
async function grantSystemAdminRole(uid: string): Promise<void> {
    try {
        // Verify the user exists
        try {
            await auth.getUser(uid);
        } catch (error) {
            console.error(`User with ID '${uid}' not found.`);
            return;
        }

        // Set the custom claim for the user
        await auth.setCustomUserClaims(uid, { systemAdmin: true });
        console.log(`✅ Successfully granted systemAdmin role to user ${uid}`);
        console.log(
            `Note: User will need to sign out and sign back in for the claim to take effect.`
        );
    } catch (error: any) {
        console.error('Error granting systemAdmin role:', error);
    }
}

/**
 * Revokes the systemAdmin role from a specified user
 * @param uid User ID to revoke the system admin role from
 */
async function revokeSystemAdminRole(uid: string): Promise<void> {
    try {
        // Get the user to verify they exist and their current claims
        try {
            const user = await auth.getUser(uid);
            const currentClaims = user.customClaims || {};

            // Create new claims object without systemAdmin
            const { systemAdmin, ...remainingClaims } = currentClaims;

            // Set the updated custom claims
            await auth.setCustomUserClaims(uid, remainingClaims);
            console.log(
                `✅ Successfully revoked systemAdmin role from user ${uid}`
            );
            console.log(
                `Note: User will need to sign out and sign back in for the change to take effect.`
            );
        } catch (error: any) {
            console.error(
                `User with ID '${uid}' not found or error updating claims: ${
                    error.message || String(error)
                }`
            );
            return;
        }
    } catch (error: any) {
        console.error('Error revoking systemAdmin role:', error);
    }
}

/**
 * Main function to handle command line arguments and execute the appropriate action
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0]?.toLowerCase();
    const userId = args[1];

    if (!command || (command !== 'grant' && command !== 'revoke')) {
        console.log('Usage: npx ts-node grant-role.ts [grant|revoke] [userId]');
        console.log('  grant  - Grant systemAdmin role to specified user');
        console.log('  revoke - Revoke systemAdmin role from specified user');
        return;
    }

    if (!userId) {
        const rl = createInterface();
        rl.question('Enter user ID: ', async (answer) => {
            if (!answer.trim()) {
                console.error('User ID is required');
                rl.close();
                return;
            }

            if (command === 'grant') {
                await grantSystemAdminRole(answer.trim());
            } else {
                await revokeSystemAdminRole(answer.trim());
            }
            rl.close();
        });
    } else {
        if (command === 'grant') {
            await grantSystemAdminRole(userId);
        } else {
            await revokeSystemAdminRole(userId);
        }
    }
}

// Only execute the script if it's run directly (not imported)
if (require.main === module) {
    main().catch((err) => {
        console.error('Error executing script:', err);
        process.exit(1);
    });
}
