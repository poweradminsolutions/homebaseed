import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { id: postId } = await params;

    const { data: post, error } = await supabase
      .from("forum_posts")
      .select(
        `
        id,
        title,
        body,
        category,
        author_id,
        created_at,
        profiles:author_id(display_name),
        forum_replies(id),
        forum_likes(id)
      `
      )
      .eq("id", postId)
      .single();

    if (error || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Fetch replies
    const { data: replies, error: repliesError } = await supabase
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

    if (repliesError) {
      console.error("Error fetching replies:", repliesError);
      return NextResponse.json(
        { error: "Failed to fetch replies" },
        { status: 500 }
      );
    }

    // Check if user has liked the post
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let userHasLiked = false;
    if (user) {
      const { data: likeData } = await supabase
        .from("forum_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      userHasLiked = !!likeData;
    }

    return NextResponse.json({
      post: {
        id: post.id,
        title: post.title,
        body: post.body,
        category: post.category,
        author_id: post.author_id,
        created_at: post.created_at,
        display_name: post.profiles?.display_name || "Anonymous",
        reply_count: post.forum_replies?.length || 0,
        like_count: post.forum_likes?.length || 0,
        user_has_liked: userHasLiked,
      },
      replies: (replies || []).map((reply: any) => ({
        id: reply.id,
        body: reply.body,
        author_id: reply.author_id,
        created_at: reply.created_at,
        display_name: reply.profiles?.display_name || "Anonymous",
        like_count: reply.forum_reply_likes?.length || 0,
      })),
    });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user owns the post
    const { data: post, error: fetchError } = await supabase
      .from("forum_posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (fetchError || !post) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.author_id !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Delete the post (cascade will handle replies and likes)
    const { error: deleteError } = await supabase
      .from("forum_posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      console.error("Error deleting post:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
