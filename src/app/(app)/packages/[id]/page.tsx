interface PageProps {
  params: {
    id: string
  }
}
const Page = ({ params }: PageProps) => {
  const packageId = params.id
  console.log("Package ID:", params?.id)
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Package ID: {packageId}
    </div>
  )
}

export default Page