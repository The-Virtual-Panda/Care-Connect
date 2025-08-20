import sgMail, { MailDataRequired } from '@sendgrid/mail';

type EmailAddress = string | { email: string; name?: string };

type Attachment = {
    content: string; // base64-encoded
    filename: string;
    type?: string; // e.g., 'application/pdf'
    disposition?: 'inline' | 'attachment';
    contentId?: string; // for inline images
};

export interface SendEmailParams {
    to: EmailAddress | EmailAddress[];
    subject: string;
    html?: string;
    text?: string;
    cc?: EmailAddress | EmailAddress[];
    bcc?: EmailAddress | EmailAddress[];
    attachments?: Attachment[];
    headers?: Record<string, string>;
    categories?: string[];
    customArgs?: Record<string, string>;
}

export interface SendTemplateEmailParams {
    to: EmailAddress | EmailAddress[];
    templateId: string; // Twilio SendGrid Dynamic Template ID
    dynamicTemplateData?: Record<string, unknown>;
    cc?: EmailAddress | EmailAddress[];
    bcc?: EmailAddress | EmailAddress[];
    attachments?: Attachment[];
    headers?: Record<string, string>;
    categories?: string[];
    customArgs?: Record<string, string>;
}

let initialized = false;
let defaultFrom: EmailAddress | undefined;
let defaultReplyTo: EmailAddress | undefined;

/**
 * Initialize Twilio SendGrid.
 * If apiKey is omitted, reads process.env.SENDGRID_API_KEY.
 */
function initSendGrid(): void {
    if (initialized) return;

    const key = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    const replyToEmail = process.env.SENDGRID_REPLY_TO_EMAIL;

    if (!key || !fromEmail || !replyToEmail) {
        throw new Error(
            'SendGrid is not configured: SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, and SENDGRID_REPLY_TO_EMAIL must be set.'
        );
    }

    sgMail.setApiKey(key);
    defaultFrom = fromEmail;
    defaultReplyTo = replyToEmail;

    initialized = true;
}

export async function sendEmail(
    params: SendEmailParams
): Promise<{ messageId?: string }> {
    initSendGrid();

    if (!params.text && !params.html) {
        throw new Error('Either text or html must be provided for sendEmail.');
    }

    const msg: MailDataRequired = {
        to: params.to,
        from: defaultFrom!,
        subject: params.subject,
        ...(params.html ? { html: params.html } : {}),
        ...(params.text ? { text: params.text } : {}),
        cc: params.cc,
        bcc: params.bcc,
        replyTo: defaultReplyTo!,
        attachments: params.attachments as any,
        headers: params.headers,
        categories: params.categories,
        customArgs: params.customArgs,
    } as MailDataRequired;

    const [response] = await sgMail.send(msg);
    const messageId = response.headers?.['x-message-id'] as string | undefined;
    return { messageId };
}

export async function sendTemplateEmail(
    params: SendTemplateEmailParams
): Promise<{ messageId?: string }> {
    initSendGrid();

    if (!params.templateId) {
        throw new Error('templateId is required for sendTemplateEmail.');
    }

    const msg: MailDataRequired = {
        to: params.to,
        from: defaultFrom!,
        templateId: params.templateId,
        dynamicTemplateData: params.dynamicTemplateData,
        cc: params.cc,
        bcc: params.bcc,
        replyTo: defaultReplyTo!,
        attachments: params.attachments as any,
        headers: params.headers,
        categories: params.categories,
        customArgs: params.customArgs,
    };

    const [response] = await sgMail.send(msg);
    const messageId = response.headers?.['x-message-id'] as string | undefined;
    return { messageId };
}
