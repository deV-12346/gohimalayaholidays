import { NextRequest, NextResponse } from "next/server";
import { destinationModel } from "@/models/destination.model";
import { connectDb } from "@/libs/ConnectDb";

export async function GET(req: NextRequest) {
  try {
    await connectDb();
    const destinations = await destinationModel.find();
    return NextResponse.json(
      { success: true, message: "Destinations fetched successfully!", destinations },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch destinations!", error },
      { status: 500 }
    );
  }
}