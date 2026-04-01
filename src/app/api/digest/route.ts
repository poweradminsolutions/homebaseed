import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY!;
const MAILGUN_DOMAIN = "sandbox93c8e3e3f3544b73843a3a8a17db3d18.mailgun.org"; // Using sandbox domain

interface DigestUser {
  id: string;
  email: string;
  display_name: string;
  state_filter: string | null;
}

interface DigestContent {
  newListings: Array<{ id: string; name: string; category: string; state: string }>;
  popularPosts: Array<{ id: string; title: string; category: string; reply_count: number }>;
  newReviews: Array<{ id: string; resource_name: string; rating: number }>;
}

async function getNewListings(
  supabase: any,
  daysSince: number = 7,
  stateFilter?: string
): Promise<any[]> {
  let query = supabase
    .from("resources")
    .select("id, name, category, state")
    .gt("created_at", new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000).toISOString())
    .limit(10);

  if (stateFilter) {
    query = query.eq("state", stateFilter);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching listings:", error);
    return [];
  }
  return data || [];
}

async function getPopularPosts(
  supabase: any,
  daysSince: number = 7,
  stateFilter?: string
): Promise<any[]> {
  let query = supabase
    .from("forum_posts")
    .select("id, title, category, forum_replies(id)")
    .gt("created_at", new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000).toISOString())
    .limit(5);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  return (data || []).map((post: any) => ({
    id: post.id,
    title: post.title,
    category: post.category,
    reply_count: post.forum_replies?.length || 0,
  }));
}

async function getNewReviews(
  supabase: any,
  daysSince: number = 7,
  stateFilter?: string
): Promise<any[]> {
  let query = supabase
    .from("resource_reviews")
    .select("id, resource_id, rating, resources(name)")
    .gt("created_at", new Date(Date.now() - daysSince * 24 * 60 * 60 * 1000).toISOString())
    .order("rating", { ascending: false })
    .limit(5);

  const { data, error } = await query;
  if (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }

  return (data || []).map((review: any) => ({
    id: review.id,
    resource_name: review.resources?.name || "Unknown",
    rating: review.rating,
  }));
}

async function sendDigestEmail(
  user: DigestUser,
  content: DigestContent
): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://thehomeschoolsource.com";

  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1B6B4A;">The Homeschool Source - Weekly Digest</h1>
          <p>Hi ${user.display_name},</p>
          <p>Here's what's new in the homeschooling community this week.</p>

          ${
            content.newListings.length > 0
              ? `
              <h2 style="color: #1B6B4A; margin-top: 30px;">New Listings</h2>
              <ul>
                ${content.newListings
                  .map(
                    (listing) => `
                  <li>
                    <strong>${listing.name}</strong> (${listing.category})
                    ${listing.state ? `in ${listing.state}` : ""}
                  </li>
                `
                  )
                  .join("")}
              </ul>
              <a href="${baseUrl}/find" style="color: #1B6B4A; text-decoration: none;">See all new resources →</a>
            `
              : ""
          }

          ${
            content.popularPosts.length > 0
              ? `
              <h2 style="color: #1B6B4A; margin-top: 30px;">Popular Forum Discussions</h2>
              <ul>
                ${content.popularPosts
                  .map(
                    (post) => `
                  <li>
                    <a href="${baseUrl}/forum/post/${post.id}" style="color: #1B6B4A; text-decoration: none;">
                      ${post.title}
                    </a>
                    (${post.reply_count} replies in ${post.category})
                  </li>
                `
                  )
                  .join("")}
              </ul>
            `
              : ""
          }

          ${
            content.newReviews.length > 0
              ? `
              <h2 style="color: #1B6B4A; margin-top: 30px;">Highly Rated Resources</h2>
              <ul>
                ${content.newReviews
                  .map(
                    (review) => `
                  <li>
                    <strong>${review.resource_name}</strong> -
                    ${"★".repeat(Math.floor(review.rating))} (${review.rating.toFixed(1)}/5)
                  </li>
                `
                  )
                  .join("")}
              </ul>
            `
              : ""
          }

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666;">
            <p>
              <a href="${baseUrl}/account/notifications" style="color: #1B6B4A; text-decoration: none;">
                Update notification preferences
              </a>
            </p>
            <p>
              This is an automated email. Please do not reply to this message.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const formData = new FormData();
  formData.append("from", `The Homeschool Source <noreply@${MAILGUN_DOMAIN}>`);
  formData.append("to", user.email);
  formData.append("subject", "Your Weekly Homeschool Digest");
  formData.append("html", htmlContent);

  try {
    const response = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString(
          "base64"
        )}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Mailgun error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Add a simple auth check for cron jobs
    const authHeader = request.headers.get("authorization");
    if (
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      // Allow if CRON_SECRET is not set (for development)
      if (process.env.CRON_SECRET) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    }

    const supabase = await createClient();

    // Get all users with weekly_digest enabled
    const { data: users, error: usersError } = await supabase
      .from("digest_preferences")
      .select("user_id, state_filter, profiles(email, display_name)")
      .eq("weekly_digest", true);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    if (!users || users.length === 0) {
      return NextResponse.json({ sent: 0, message: "No users to send digests to" });
    }

    let successCount = 0;
    let failureCount = 0;

    // Send digests to each user
    for (const userPref of users) {
      if (!userPref.profiles) {
        failureCount++;
        continue;
      }

      const digestUser: DigestUser = {
        id: userPref.user_id,
        email: userPref.profiles.email,
        display_name: userPref.profiles.display_name || "Friend",
        state_filter: userPref.state_filter,
      };

      const [listings, posts, reviews] = await Promise.all([
        getNewListings(supabase, 7, userPref.state_filter ?? undefined),
        getPopularPosts(supabase, 7, userPref.state_filter ?? undefined),
        getNewReviews(supabase, 7, userPref.state_filter ?? undefined),
      ]);

      const content: DigestContent = {
        newListings: listings,
        popularPosts: posts,
        newReviews: reviews,
      };

      const sent = await sendDigestEmail(digestUser, content);
      if (sent) {
        successCount++;
      } else {
        failureCount++;
      }
    }

    return NextResponse.json({
      sent: successCount,
      failed: failureCount,
      message: `Sent ${successCount} digests successfully, ${failureCount} failed`,
    });
  } catch (error) {
    console.error("Error in digest route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
