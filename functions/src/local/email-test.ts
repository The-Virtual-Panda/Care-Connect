import { sendEmail } from '../services/sendgrid-service';
import { localOnRequest } from './local-on-request';

export const testEmailSending = localOnRequest(async (request, response) => {
    try {
        const { messageId } = await sendEmail({
            to: 'brenton.s.unger@live.com',
            subject: 'Care Connect Test Email',
            text: 'Hello! This is a basic SendGrid test email from Care Connect.',
        });

        response.status(200).json({ ok: true, messageId });
    } catch (error: any) {
        console.error('Failed to send email:', error);
        response
            .status(500)
            .json({ ok: false, error: error?.message ?? 'Unknown error' });
    }
});
