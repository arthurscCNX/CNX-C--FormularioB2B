import UrgencyBar from '@/components/home/UrgencyBar';
import Header from '@/components/home/Header';
import Hero from '@/components/home/Hero';
import Numbers from '@/components/home/Numbers';
import Partners from '@/components/home/Partners';
import Experiences from '@/components/home/Experiences';
import HowItWorks from '@/components/home/HowItWorks';
import Calculator from '@/components/home/Calculator';
import Testimonials from '@/components/home/Testimonials';
import Plans from '@/components/home/Plans';
import Guarantee from '@/components/home/Guarantee';
import Faq from '@/components/home/Faq';
import Footer from '@/components/home/Footer';

export default function Home() {
  return (
    <>
      <UrgencyBar />
      <Header />
      <main>
        <Hero />
        <Numbers />
        <Partners />
        <Experiences />
        <HowItWorks />
        <Calculator />
        <Testimonials />
        <Plans />
        <Guarantee />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
