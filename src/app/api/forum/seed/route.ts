import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { forumSeeds } from "@/data/forum-seeds";

export async function POST(request: NextRequest) {
  try {
    // Simple auth check - only allow with CRON_SECRET or in development
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

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

    // We need a user to be the author. Get the first admin user, or any user.
    const { data: adminUser } = await supabase
      .from("profiles")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (!adminUser) {
      return NextResponse.json(
        { error: "No admin user found. Create an admin account first, then seed." },
        { status: 400 }
      );
    }

    let insertedCount = 0;

    for (const seed of forumSeeds) {
      const { error: insertError } = await supabase.from("forum_posts").insert({
        title: seed.title,
        body: seed.body,
        category: seed.category,
        author_id: adminUser.id,
      });

      if (!insertError) {
        insertedCount++;
      } else {
        console.error("Error inserting seed post:", insertError.message);
      }
    }

    return NextResponse.json({
      message: `Seeded ${insertedCount} forum posts`,
      count: insertedCount,
    });
  } catch (error) {
    console.error("Error seeding forum:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
