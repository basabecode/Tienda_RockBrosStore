import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import ProductGrid from '@/components/ProductGrid'
import Categories from '@/components/Categories'
import Brands from '@/components/Brands'
import Footer from '@/components/Footer'
import ImprovementNotification from '@/components/ImprovementNotification'

const Index = () => {
  console.log('Index page rendering')
  return (
    <div className="min-h-screen">
      <Header />
      <main role="main">
        <HeroBanner />
        <ProductGrid />
        <Categories />
        <Brands />
      </main>
      <Footer />
      <ImprovementNotification />
    </div>
  )
}

export default Index
