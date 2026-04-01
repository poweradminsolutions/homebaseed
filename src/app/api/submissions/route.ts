import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { signToken } from "@/lib/token";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = "thehomeschoolsource.com";

interface SubmissionData {
  type: string;
  name: string;
  email: string;
  website?: string;
  description?: string;
  location?: string;
  [key: string]: unknown;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as SubmissionData;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Insert submission
    const { data: submission, error } = await (supabase as any)
      .from("submissions")
      .insert({
        user_id: user?.id || null,
        type: body.type,
        name: body.name,
        email: body.email,
        website: body.website || null,
        description: body.description || null,
        location: body.location || null,
        data: body,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Submission creation error:", error);
      return NextResponse.json(
        { error: "Failed to create submission" },
        { status: 500 }
      );
    }

    // Generate approval/rejection tokens
    const approveToken = signToken({
      submissionId: submission.id,
      action: "approve",
    });
    const rejectToken = signToken({
      submissionId: submission.id,
      action: "reject",
    });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thehomeschoolsource.com";
    const approveUrl = `${baseUrl}/api/submissions/${submission.id}/approve?token=${encodeURIComponent(approveToken)}`;
    const rejectUrl = `${baseUrl}/api/submissions/${submission.id}/reject?token=${encodeURIComponent(rejectToken)}`;

    // Send notification email via Mailgun
    const formData = new FormData();
    formData.append("from", `The Homeschool Source <noreply@${MAILGUN_DOMAIN}>`);
    formData.append("to", "bunnyhedaya@gmail.com");
    formData.append("cc", "hhedaya@mac.com");
    formData.append(
      "subject",
      `New Submission: ${body.type} - ${body.name}`
    );
    formData.append(
      "html",
      `
        <h2>New Submission Received</h2>
        <p><strong>Type:</strong> ${body.type}</p>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        ${body.website ? `<p><strong>Website:</strong> <a href="${body.website}">${body.website}</a></p>` : ""}
        ${body.location ? `<p><strong>Location:</strong> ${body.location}</p>` : ""}
        ${body.description ? `<p><strong>Description:</strong></p><p>${body.description}</p>` : ""}

        <h3>Actions:</h3>
        <p>
          <a href="${approveUrl}" style="background-color: #1B6B4A; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-right: 10px;">Approve</a>
          <a href="${rejectUrl}" style="background-color: #dc2626; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reject</a>
        </p>
      `
    );

    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString("base64")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      console.error("Mailgun error:", await response.text());
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for your submission! We will review it shortly.",
        submissionId: submission.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
