import { SearchProvider } from '@/contexts/SearchContext'
import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import ProductGrid from '@/components/ProductGrid'
import Categories from '@/components/Categories'
import Brands from '@/components/Brands'
import Footer from '@/components/Footer'

const Index = () => {
  return (
    <SearchProvider>
      <div className="min-h-screen">
        <Header />
        <main role="main">
          <HeroBanner />
          <ProductGrid />
          <Categories />
          <Brands />
        </main>
        <Footer />
      </div>
    </SearchProvider>
  )
}

export default Index
