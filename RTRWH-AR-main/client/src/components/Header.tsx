import { Droplets, Menu, Moon, Sun, ChevronDown, Calculator, Globe, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Link, useLocation } from "wouter";
import { scrollToSection, type SectionId } from "@/lib/navigation";

export default function Header() {
  const [isDark, setIsDark] = useState(false);
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');

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
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="hover-elevate">
            <div className="flex items-center gap-2" data-testid="link-home">
              <div className="p-2 bg-primary rounded-md">
                <Droplets className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-lg">RTRWH/AR</h1>
                <p className="text-xs text-muted-foreground">Rainwater Assistant</p>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <Button
                variant={location === '/' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleSectionScroll('hero')}
                data-testid="button-home"
              >
                Home
              </Button>
              
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
                    Calculator
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => handleSectionScroll('calculator')}>
                    <Droplets className="w-4 h-4 mr-2" />
                    Rainwater Harvesting
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSectionScroll('calculator')}>
                    <Calculator className="w-4 h-4 mr-2" />
                    Artificial Recharge
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSectionScroll('about')}
                data-testid="button-about"
              >
                About
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSectionScroll('testimonials')}
                data-testid="button-testimonials"
              >
                Testimonials
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
                  {currentLanguage}
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setCurrentLanguage('English')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentLanguage('हिंदी')}>
                  हिंदी (Hindi)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentLanguage('Regional')}>
                  Regional
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
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSectionScroll('hero')}
              >
                Home
              </Button>
              
              <div className="space-y-1">
                <p className="text-sm font-medium px-4 py-2 text-muted-foreground">Calculator</p>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  onClick={() => handleSectionScroll('calculator')}
                >
                  <Droplets className="w-4 h-4 mr-2" />
                  Rainwater Harvesting
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start pl-8"
                  onClick={() => handleSectionScroll('calculator')}
                >
                  <Calculator className="w-4 h-4 mr-2" />
                  Artificial Recharge
                </Button>
              </div>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSectionScroll('about')}
              >
                About
              </Button>
              
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => handleSectionScroll('testimonials')}
              >
                Testimonials
              </Button>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Language</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Globe className="w-4 h-4" />
                        {currentLanguage}
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setCurrentLanguage('English')}>
                        English
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentLanguage('हिंदी')}>
                        हिंदी (Hindi)
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setCurrentLanguage('Regional')}>
                        Regional
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