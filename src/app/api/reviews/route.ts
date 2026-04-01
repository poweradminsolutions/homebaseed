import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resource_type = searchParams.get("resource_type");
    const resource_id = searchParams.get("resource_id");

    if (!resource_type || !resource_id) {
      return NextResponse.json(
        { error: "resource_type and resource_id are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch reviews for the resource
    const { data: reviews, error } = await supabase
      .from("resource_reviews")
      .select(
        `
        id,
        user_id,
        resource_type,
        resource_id,
        rating,
        title,
        body,
        helpful_count,
        created_at,
        profiles!inner(display_name, avatar_url)
      `
      )
      .eq("resource_type", resource_type)
      .eq("resource_id", resource_id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    // Calculate average rating
    const avgRating =
      reviews && reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
          reviews.length
        : 0;

    return NextResponse.json({ reviews: reviews || [], averageRating: avgRating });
  } catch (error) {
    console.error("Error in reviews GET:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { resource_type, resource_id, rating, title = null, body: reviewBody = null } = body;

    if (!resource_type || !resource_id || !rating) {
      return NextResponse.json(
        { error: "resource_type, resource_id, and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Insert review
    const { data: review, error } = await supabase
      .from("resource_reviews")
      .insert({
        user_id: user.id,
        resource_type,
        resource_id,
        rating,
        title,
        body: reviewBody,
      })
      .select(
        `
        id,
        user_id,
        resource_type,
        resource_id,
        rating,
        title,
        body,
        helpful_count,
        created_at,
        profiles!inner(display_name, avatar_url)
      `
      )
      .single();

    if (error) {
      console.error("Error creating review:", error);
      // Check if it's a duplicate
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "You have already reviewed this resource" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 }
      );
    }

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Error in reviews POST:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
