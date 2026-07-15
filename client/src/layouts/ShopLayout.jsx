import { Outlet } from 'react-router-dom'
import Footer from '../sections/Footer/Footer'

// Inner-page shell: leaves room for the fixed nav, then renders the page + footer.
export default function ShopLayout() {
  return (
    <>
      <div className="min-h-screen bg-obsidian pt-28 md:pt-32">
        <Outlet />
      </div>
      <Footer />
    </>
  )
}
