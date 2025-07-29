import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import ProductGrid from '@/components/ProductGrid';
import Categories from '@/components/Categories';
import Education from '@/components/Education';
import Brands from '@/components/Brands';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main role="main">
        <HeroBanner />
        <ProductGrid />
        <Categories />
        <Education />
        <Brands />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
