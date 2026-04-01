import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's favorites
    const { data: favorites, error } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json(
        { error: "Failed to fetch favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error in favorites GET:", error);
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
    const {
      resource_type,
      resource_id,
      collection_name = "Saved",
      notes = null,
    } = body;

    if (!resource_type || !resource_id) {
      return NextResponse.json(
        { error: "resource_type and resource_id are required" },
        { status: 400 }
      );
    }

    // Insert favorite
    const { data: favorite, error } = await supabase
      .from("favorites")
      .insert({
        user_id: user.id,
        resource_type,
        resource_id,
        collection_name,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating favorite:", error);
      // Check if it's a duplicate
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "This item is already saved" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to create favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ favorite }, { status: 201 });
  } catch (error) {
    console.error("Error in favorites POST:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
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
    const { resource_type, resource_id } = body;

    if (!resource_type || !resource_id) {
      return NextResponse.json(
        { error: "resource_type and resource_id are required" },
        { status: 400 }
      );
    }

    // Delete favorite
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("resource_type", resource_type)
      .eq("resource_id", resource_id);

    if (error) {
      console.error("Error deleting favorite:", error);
      return NextResponse.json(
        { error: "Failed to delete favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in favorites DELETE:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
