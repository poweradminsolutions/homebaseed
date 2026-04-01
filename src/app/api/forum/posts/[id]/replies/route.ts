import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: postId } = await params;

    const { data: replies, error } = await supabase
      .from("forum_replies")
      .select(
        `
        id,
        body,
        author_id,
        created_at,
        profiles:author_id(display_name),
        forum_reply_likes(id)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch replies" },
        { status: 500 }
      );
    }

    const formattedReplies = (replies || []).map((reply: any) => ({
      id: reply.id,
      body: reply.body,
      author_id: reply.author_id,
      created_at: reply.created_at,
      display_name: reply.profiles?.display_name || "Anonymous",
      like_count: reply.forum_reply_likes?.length || 0,
    }));

    return NextResponse.json({ replies: formattedReplies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: postId } = await params;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { body: replyBody } = body;

    if (!replyBody || !replyBody.trim()) {
      return NextResponse.json(
        { error: "Reply body is required" },
        { status: 400 }
      );
    }

    // Verify post exists
    const { data: post, error: postError } = await supabase
      .from("forum_posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    const { data: reply, error: replyError } = await supabase
      .from("forum_replies")
      .insert({
        post_id: postId,
        body: replyBody.trim(),
        author_id: user.id,
      })
      .select(
        `
        id,
        body,
        author_id,
        created_at,
        profiles:author_id(display_name),
        forum_reply_likes(id)
      `
      )
      .single();

    if (replyError) {
      console.error("Database error:", replyError);
      return NextResponse.json(
        { error: "Failed to create reply" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        reply: {
          id: reply.id,
          body: reply.body,
          author_id: reply.author_id,
          created_at: reply.created_at,
          display_name: reply.profiles?.display_name || "Anonymous",
          like_count: reply.forum_reply_likes?.length || 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
