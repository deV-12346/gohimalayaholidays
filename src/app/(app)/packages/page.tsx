import Navbar from '@/components/layouts/Navbar'
import Packages from '@/components/packages/packages'

interface PageProps {
  searchParams: Promise<{ destination?: string }>
}

const Page = async ({ searchParams }: PageProps) => {
  const { destination: destinationId } = await searchParams

  return (
    <div>
      <Navbar transparent={false} />
      <Packages destinationId={destinationId} />
    </div>
  )
}

export default Page