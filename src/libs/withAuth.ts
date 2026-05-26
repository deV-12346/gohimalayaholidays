import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/option";

export type AuthHandler = (req: NextRequest, user: User) => Promise<NextResponse>

export function withAuth(handler: AuthHandler) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ 
        success: false, 
        message: "Unauthorized" 
    },{ status: 401 })
    }
    return handler(req, session?.user as User)
  }
}