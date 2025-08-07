import { auth } from '../configs';
import { localOnRequest } from './local-on-request';
import { logger } from 'firebase-functions';

/**
 * Local development endpoint to grant a user the systemAdmin role.
 * This endpoint is only available in development environments.
 *
 * Example usage:
 * POST /grantSystemAdmin
 * Body: { "uid": "user-id-to-grant-admin-to" }
 */
export const grantSystemAdmin = localOnRequest(async (request, response) => {
    try {
        const uid = request.body.uid;

        if (!uid) {
            logger.log('Missing user ID in request body');
            response.status(400).json({
                success: false,
                message:
                    "Missing user ID. Please provide a 'uid' in the request body.",
            });
            return;
        }

        // Get the user to verify they exist
        try {
            await auth.getUser(uid);
        } catch (error) {
            response.status(404).json({
                success: false,
                message: `User with ID '${uid}' not found.`,
            });
            return;
        }

        // Set the custom claim for the user
        await auth.setCustomUserClaims(uid, { systemAdmin: true });

        response.status(200).json({
            success: true,
            message: `Successfully granted systemAdmin role to user ${uid}`,
            details:
                'User will need to sign out and sign back in for the claim to take effect.',
        });
    } catch (error: any) {
        console.error('Error granting systemAdmin role:', error);
        response.status(500).json({
            success: false,
            message: 'Failed to grant systemAdmin role',
            error: error.message || String(error),
        });
    }
});

/**
 * Local development endpoint to revoke a user's systemAdmin role.
 * This endpoint is only available in development environments.
 *
 * Example usage:
 * POST /revokeSystemAdmin
 * Body: { "uid": "user-id-to-revoke-admin-from" }
 */
export const revokeSystemAdmin = localOnRequest(async (request, response) => {
    try {
        const uid = request.body.uid;

        if (!uid) {
            response.status(400).json({
                success: false,
                message:
                    "Missing user ID. Please provide a 'uid' in the request body.",
            });
            return;
        }

        // Get the user to verify they exist and their current claims
        try {
            const user = await auth.getUser(uid);
            const currentClaims = user.customClaims || {};

            // Create new claims object without systemAdmin
            const { systemAdmin, ...remainingClaims } = currentClaims;

            // Set the updated custom claims
            await auth.setCustomUserClaims(uid, remainingClaims);
        } catch (error: any) {
            response.status(404).json({
                success: false,
                message: `User with ID '${uid}' not found or error updating claims: ${
                    error.message || String(error)
                }`,
            });
            return;
        }

        // Return success response
        response.status(200).json({
            success: true,
            message: `Successfully revoked systemAdmin role from user ${uid}`,
            details:
                'User will need to sign out and sign back in for the change to take effect.',
        });
    } catch (error: any) {
        console.error('Error revoking systemAdmin role:', error);
        response.status(500).json({
            success: false,
            message: 'Failed to revoke systemAdmin role',
            error: error.message || String(error),
        });
    }
});
