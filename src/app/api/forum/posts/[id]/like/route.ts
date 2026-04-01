import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

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

    // Check if user already liked the post
    const { data: existingLike } = await supabase
      .from("forum_likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .single();

    if (existingLike) {
      // Unlike the post
      await supabase
        .from("forum_likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      // Like the post
      await supabase.from("forum_likes").insert({
        post_id: postId,
        user_id: user.id,
      });
    }

    // Get updated like count
    const { data: likes, error: likesError } = await supabase
      .from("forum_likes")
      .select("id")
      .eq("post_id", postId);

    if (likesError) {
      console.error("Error fetching likes:", likesError);
      return NextResponse.json(
        { error: "Failed to update like" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      user_has_liked: !existingLike,
      like_count: likes?.length || 0,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
