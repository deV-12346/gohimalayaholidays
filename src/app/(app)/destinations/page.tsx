import DestinationsPage from '@/components/destinations/Destinations'
import Navbar from '@/components/Navbar'
const page = () => {  
  return (
    <div>
      <Navbar transparent={true} />
      <DestinationsPage/>
    </div>
  )
}

export default page