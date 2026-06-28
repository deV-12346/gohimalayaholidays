"use client"

import { useParams } from "next/navigation"

const Page = () => {

  const params = useParams()

  // URL => /packages/685f8f4a2b1c
  const packageId = params.slug

  console.log("Package ID:", packageId)

  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Package ID: {packageId}
    </div>
  )
}

export default Page