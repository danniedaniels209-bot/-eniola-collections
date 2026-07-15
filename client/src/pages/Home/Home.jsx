import Hero from '../../sections/Hero/Hero'
import Categories from '../../sections/Categories/Categories'
import InfiniteGallery from '../../sections/InfiniteGallery/InfiniteGallery'
import ProductRail from '../../sections/ProductRail/ProductRail'
import CollectionStory from '../../sections/CollectionStory/CollectionStory'
import AboutBrand from '../../sections/AboutBrand/AboutBrand'
import Reviews from '../../sections/Reviews/Reviews'
import Footer from '../../sections/Footer/Footer'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <InfiniteGallery />
      <ProductRail eyebrow="Just In" title="New Arrivals" query="newArrival=true&limit=4" viewAll="/shop?sort=newest" />
      <ProductRail eyebrow="Most Loved" title="Best Sellers" query="bestSeller=true&limit=4" viewAll="/shop?sort=bestsellers" />
      <CollectionStory />
      <AboutBrand />
      <Reviews />
      <Footer />
    </>
  )
}
