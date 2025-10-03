import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import TestimonialsSection from './TestimonialsSection';
import FooterHeroSection from './FooterHeroSection';

interface LandingPageProps {
  onSelectPath: (path: 'rainwater' | 'recharge') => void;
}

export default function LandingPage({ onSelectPath }: LandingPageProps) {
  return (
    <div className="min-h-screen">
      <HeroSection onSelectPath={onSelectPath} />
      <AboutSection />
      <TestimonialsSection />
      <FooterHeroSection onSelectPath={onSelectPath} />
    </div>
  );
}