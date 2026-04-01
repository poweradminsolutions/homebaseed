import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { verifyToken } from "@/lib/token";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const data = verifyToken(token);

    if (
      !data ||
      data.submissionId !== id ||
      data.action !== "reject"
    ) {
      return new NextResponse("Invalid or expired token", { status: 401 });
    }

    const supabase = await createClient();

    // Update submission status
    const { error } = await (supabase as any)
      .from("submissions")
      .update({ status: "rejected" })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return new NextResponse("Failed to reject submission", { status: 500 });
    }

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Submission Rejected</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: #FAFAF8;
            color: #1A1A1A;
            margin: 0;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .container {
            background: white;
            border: 1px solid #E2E2E0;
            border-radius: 8px;
            padding: 40px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .icon {
            width: 64px;
            height: 64px;
            background-color: #fee2e2;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px;
            color: #dc2626;
          }
          .icon svg {
            width: 32px;
            height: 32px;
          }
          h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 12px 0;
          }
          p {
            font-size: 16px;
            color: #6B6B6B;
            margin: 0 0 24px 0;
            line-height: 1.5;
          }
          a {
            display: inline-block;
            padding: 10px 20px;
            background-color: #1B6B4A;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.2s;
          }
          a:hover {
            background-color: #145236;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>
          <h1>Submission Rejected</h1>
          <p>The submission has been rejected. If you believe this was done in error, please contact support.</p>
          <a href="https://thehomeschoolsource.com">Back to Site</a>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      status: 200,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } catch (error) {
    console.error("Rejection error:", error);
    return new NextResponse("An error occurred", { status: 500 });
  }
}
