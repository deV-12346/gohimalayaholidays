import { NextRequest, NextResponse } from "next/server";
type RouteHandler = (req: NextRequest, ...args: any[]) => Promise<NextResponse>

export function withErrorHandler(handler: RouteHandler): RouteHandler {
  return async (req, ...args) => {
    try {
      return await handler(req, ...args)
    } catch (error) {
      console.log(error)
      return NextResponse.json({ 
        success: false, 
        message: "Something went wrong"
     },{ status: 500 })
    }
  }
}