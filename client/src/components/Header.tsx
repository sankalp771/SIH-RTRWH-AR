import { Droplets, Menu, Moon, Sun, ChevronDown, Calculator, Globe, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { scrollToSection, type SectionId } from "@/lib/navigation";
import logoImage from "@assets/image_1759772124947.png";

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  const handleSectionScroll = (sectionId: SectionId) => {
    if (location !== '/') {
      setLocation('/');
      setTimeout(() => scrollToSection(sectionId), 100);
    } else {
      scrollToSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="hover-elevate">
            <div className="flex items-center gap-2" data-testid="link-home">
              <img src={logoImage} alt="NeerSetu Logo" className="w-10 h-10 object-contain" />
              <div>
                <h1 className="font-semibold text-lg">NeerSetu</h1>
                <p className="text-xs text-muted-foreground">{t('brand.tagline')}</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Link href="/">
                <Button
                  variant={location === '/' ? 'default' : 'ghost'}
                  size="sm"
                  data-testid="button-home"
                >
                  {t('nav.home')}
                </Button>
              </Link>
              
              {/* Calculator Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1"
                    data-testid="button-calculator-dropdown"
                  >
                    <Calculator className="w-4 h-4" />
                    {t('nav.calculator')}
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleSectionScroll('calculator')}>
                    <Droplets className="w-4 h-4 mr-2" />
                    {t('features.rainwaterTitle')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSectionScroll('calculator')}>
                    <Calculator className="w-4 h-4 mr-2" />
                    {t('features.rechargeTitle')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link href="/education">
                <Button
                  variant={location === '/education' ? 'default' : 'ghost'}
                  size="sm"
                  data-testid="button-education"
                >
                  {t('nav.education')}
                </Button>
              </Link>

              <Link href="/contractors">
                <Button
                  variant={location === '/contractors' ? 'default' : 'ghost'}
                  size="sm"
                  data-testid="button-contractors"
                >
                  {t('nav.contractors')}
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSectionScroll('testimonials')}
                data-testid="button-testimonials"
              >
                {t('nav.testimonials')}
              </Button>
            </nav>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-1 hidden md:flex"
                  data-testid="button-language"
                >
                  <Globe className="w-4 h-4" />
                  {t('nav.language')}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage('hi')}>
                  हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => i18n.changeLanguage('mr')}>
                  मराठी (Marathi)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-background/95 backdrop-blur-sm">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link href="/">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.home')}
                </Button>
              </Link>
              
              <div className="space-y-1">
                <p className="text-sm font-medium px-4 py-2 text-muted-foreground">{t('nav.calculator')}</p>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  onClick={() => handleSectionScroll('calculator')}
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  {t('features.rainwaterTitle')}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  onClick={() => handleSectionScroll('calculator')}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  {t('features.rechargeTitle')}
                </Button>
              </div>

              <Link href="/education">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.education')}
                </Button>
              </Link>

              <Link href="/contractors">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('nav.contractors')}
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSectionScroll('testimonials')}
              >
                {t('nav.testimonials')}
              </Button>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('nav.language')}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Globe className="w-4 h-4" />
                        {t('nav.language')}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => i18n.changeLanguage('en')}>
                        English
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => i18n.changeLanguage('hi')}>
                        हिंदी (Hindi)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => i18n.changeLanguage('mr')}>
                        मराठी (Marathi)
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}