import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const sort = searchParams.get("sort") || "newest";
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "20");

    let query = supabase
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
      `,
        { count: "exact" }
      );

    if (category) {
      query = query.eq("category", category);
    }

    if (search) {
      query = query.or(
        `title.ilike.%${search}%,body.ilike.%${search}%`
      );
    }

    // Sort
    if (sort === "liked") {
      query = query.order("created_at", { ascending: false });
    } else if (sort === "replied") {
      query = query.order("created_at", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    query = query.limit(limit);

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    const posts = (data || []).map((post: any) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      category: post.category,
      author_id: post.author_id,
      created_at: post.created_at,
      display_name: post.profiles?.display_name || "Anonymous",
      reply_count: post.forum_replies?.length || 0,
      like_count: post.forum_likes?.length || 0,
    }));

    // Sort by engagement if needed
    if (sort === "liked") {
      posts.sort((a, b) => b.like_count - a.like_count);
    } else if (sort === "replied") {
      posts.sort((a, b) => b.reply_count - a.reply_count);
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

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
    const { title, body: postBody, category } = body;

    if (!title || !postBody || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data: post, error } = await supabase
      .from("forum_posts")
      .insert({
        title,
        body: postBody,
        category,
        author_id: user.id,
      })
      .select(
        `
        id,
        title,
        body,
        category,
        author_id,
        created_at,
        profiles:author_id(display_name)
      `
      )
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        post: {
          id: post.id,
          title: post.title,
          body: post.body,
          category: post.category,
          author_id: post.author_id,
          created_at: post.created_at,
          display_name: post.profiles?.display_name || "Anonymous",
          reply_count: 0,
          like_count: 0,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
