import { withHandler } from "@/libs/withHandler"
import { NextRequest, NextResponse } from "next/server"

export const POST = withHandler(async (req:NextRequest,user) => {
    return NextResponse.json({
        succcess:true
    })
}) 