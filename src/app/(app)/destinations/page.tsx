import DestinationsPage from '@/components/destinations/Destinations'
import Navbar from '@/components/layouts/Navbar'
const page = () => {  
  return (
    <div>
      <Navbar transparent={false} />
      <DestinationsPage/>
    </div>
  )
}

export default page