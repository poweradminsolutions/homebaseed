import { NextRequest, NextResponse } from "next/server";

interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  subject: string;
  message: string;
}

const MAILGUN_DOMAIN = "sandbox93c8e3e3f3544b73843a3a8a17db3d18.mailgun.org";
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Generate HTML email content
function generateEmailHTML(data: ContactFormData): string {
  const { firstName, lastName, email, mobile, subject, message } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #1B6B4A; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 16px; }
    .field-label { font-weight: 600; color: #1B6B4A; margin-bottom: 4px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    .field-value { color: #333; padding: 8px; background-color: white; border-radius: 4px; border-left: 3px solid #1B6B4A; padding-left: 12px; }
    .message-content { background-color: white; padding: 12px; border-left: 3px solid #1B6B4A; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">New Contact Form Submission</h1>
    </div>
    <div class="content">
      <div class="field">
        <div class="field-label">Name</div>
        <div class="field-value">${firstName} ${lastName}</div>
      </div>
      <div class="field">
        <div class="field-label">Email</div>
        <div class="field-value">${email}</div>
      </div>
      ${mobile ? `
      <div class="field">
        <div class="field-label">Mobile Phone</div>
        <div class="field-value">${mobile}</div>
      </div>
      ` : ""}
      <div class="field">
        <div class="field-label">Subject</div>
        <div class="field-value">${subject}</div>
      </div>
      <div class="field">
        <div class="field-label">Message</div>
        <div class="message-content">${message}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { firstName, lastName, email, mobile, subject, message } = body as ContactFormData;

    // Validation
    if (!firstName || !firstName.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    if (!lastName || !lastName.trim()) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Check Mailgun API key
    if (!MAILGUN_API_KEY) {
      console.error("MAILGUN_API_KEY is not set");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    // Prepare email data
    const emailSubject = `Contact Form: ${subject} from ${firstName} ${lastName}`;
    const htmlContent = generateEmailHTML({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      mobile: mobile?.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    // Send via Mailgun
    const formData = new FormData();
    formData.append("from", `The Homeschool Source <noreply@${MAILGUN_DOMAIN}>`);
    formData.append("to", "bunnyhedaya@gmail.com");
    formData.append("cc", "hhedaya@mac.com");
    formData.append("subject", emailSubject);
    formData.append("html", htmlContent);
    formData.append("reply-to", email.trim());

    const mailgunResponse = await fetch(
      `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
        },
        body: formData,
      }
    );

    if (!mailgunResponse.ok) {
      const errorData = await mailgunResponse.text();
      console.error("Mailgun error:", mailgunResponse.status, errorData);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
