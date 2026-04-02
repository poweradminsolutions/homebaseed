import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { forumSeedPosts } from "@/data/forum-seeds";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Use service role client to bypass RLS for seeding
function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for seeding");
  }
  return createSupabaseClient(url, serviceKey);
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (
      process.env.CRON_SECRET &&
      authHeader !== `Bearer ${process.env.CRON_SECRET}`
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createServiceClient();

    // Check if forum already has posts
    const { data: existingPosts, error: checkError } = await supabase
      .from("forum_posts")
      .select("id")
      .limit(1);

    if (checkError) {
      return NextResponse.json(
        { error: "Failed to check existing posts", details: checkError.message },
        { status: 500 }
      );
    }

    if (existingPosts && existingPosts.length > 0) {
      return NextResponse.json(
        { message: "Forum already has posts. Skipping seed.", count: 0 },
        { status: 200 }
      );
    }

    // Collect unique display names from seed data
    const displayNames = new Set<string>();
    for (const post of forumSeedPosts) {
      displayNames.add(post.display_name);
      for (const reply of post.replies) {
        displayNames.add(reply.display_name);
      }
    }

    // Create fake auth users and profiles for each unique display name
    const userMap = new Map<string, string>(); // display_name -> user_id

    for (const name of displayNames) {
      const email = `${name.toLowerCase().replace(/[^a-z0-9]/g, ".")}@seed.thehomeschoolsource.com`;

      const { data: authUser, error: authError } =
        await supabase.auth.admin.createUser({
          email,
          email_confirm: true,
          user_metadata: { display_name: name, is_seed: true },
        });

      if (authError) {
        // User might already exist
        const { data: existingUsers } = await supabase.auth.admin.listUsers();
        const existing = existingUsers?.users?.find((u) => u.email === email);
        if (existing) {
          userMap.set(name, existing.id);
        } else {
          console.error(`Failed to create user ${name}:`, authError.message);
          continue;
        }
      } else {
        userMap.set(name, authUser.user.id);
      }

      // Upsert profile
      const userId = userMap.get(name);
      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          display_name: name,
          email,
          role: "parent",
        });
      }
    }

    // Insert posts and replies
    let postCount = 0;
    let replyCount = 0;

    // Spread posts over the last 90 days for realistic timestamps
    const now = Date.now();
    const ninetyDays = 90 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < forumSeedPosts.length; i++) {
      const seed = forumSeedPosts[i];
      const authorId = userMap.get(seed.display_name);
      if (!authorId) continue;

      // Spread post timestamps across 90 days
      const postTime = new Date(
        now - ninetyDays + (i / forumSeedPosts.length) * ninetyDays
      ).toISOString();

      const { data: insertedPost, error: insertError } = await supabase
        .from("forum_posts")
        .insert({
          title: seed.title,
          body: seed.body,
          category: seed.category,
          author_id: authorId,
          created_at: postTime,
          reply_count: seed.replies.length,
        })
        .select("id")
        .single();

      if (insertError || !insertedPost) {
        console.error("Error inserting post:", insertError?.message);
        continue;
      }

      postCount++;

      // Insert replies
      for (let j = 0; j < seed.replies.length; j++) {
        const reply = seed.replies[j];
        const replyAuthorId = userMap.get(reply.display_name);
        if (!replyAuthorId) continue;

        // Replies come after the post, spread over a few days
        const replyTime = new Date(
          new Date(postTime).getTime() +
            ((j + 1) / (seed.replies.length + 1)) * 3 * 24 * 60 * 60 * 1000
        ).toISOString();

        const { error: replyError } = await supabase
          .from("forum_replies")
          .insert({
            post_id: insertedPost.id,
            author_id: replyAuthorId,
            body: reply.body,
            created_at: replyTime,
          });

        if (!replyError) {
          replyCount++;
        } else {
          console.error("Error inserting reply:", replyError.message);
        }
      }
    }

    return NextResponse.json({
      message: `Seeded ${postCount} posts with ${replyCount} replies (${userMap.size} users created)`,
      posts: postCount,
      replies: replyCount,
      users: userMap.size,
    });
  } catch (error) {
    console.error("Error seeding forum:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred", details: String(error) },
      { status: 500 }
    );
  }
}
