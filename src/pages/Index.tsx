import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import CountdownTimer from '@/components/CountdownTimer';
import EventRegistration from '@/components/EventRegistration';
import FAQ from '@/components/FAQ';
import Chatbot from '@/components/Chatbot';
import { 
  Calendar, 
  MapPin, 
  Phone, 
  Utensils, 
  Music, 
  Wine, 
  Zap, 
  Star,
  Share2,
  MessageCircle,
  Facebook,
  Instagram,
  LogOut,
  User
} from 'lucide-react';
import heroImage from '@/assets/hero-brunch.jpg';
import brunchAerialView from '@/assets/brunch-aerial-view.jpg';

const Index = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    });
  }, []);

  const scrollToRegistration = () => {
    document.getElementById('registration')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Authentication Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={handleAuthAction}
          variant={user ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {user ? (
            <>
              <LogOut className="w-4 h-4" />
              Sign Out
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              Sign In
            </>
          )}
        </Button>
      </div>

      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center parallax"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="text-center text-white z-10 px-4 max-w-6xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
            <span className="text-gradient">Le Brunch</span>
            <br />
            <span className="text-gradient">du Baron</span>
            <br />
            <span className="text-primary-glow">— Project X —</span>
          </h1>
          
          <p className="text-2xl md:text-3xl mb-8 animate-fade-in opacity-90">
            🥂 Une parenthèse de paix avant la tempête électorale… 🎉
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12 animate-fade-in">
            <div className="flex items-center gap-2 text-lg">
              <Calendar className="w-6 h-6 text-primary-glow" />
              <span>Dimanche 28 Septembre 2025 – 14h GMT</span>
            </div>
            <div className="flex items-center gap-2 text-lg">
              <MapPin className="w-6 h-6 text-primary-glow" />
              <span>Latrille Grillz – Angré Château</span>
            </div>
          </div>
          
          <Button 
            onClick={scrollToRegistration}
            className="btn-hero mb-12"
          >
            🎟️ Je réserve ma place
          </Button>
          
          <CountdownTimer />
        </div>
      </section>

      {/* Programme Section */}
      <section className="py-20 px-4 bg-gradient-champagne">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gradient mb-16">
            Au Programme
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-premium p-8 text-center animate-fade-in">
              <Utensils className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">🍴 Brunch Gourmand</h3>
              <p className="text-muted-foreground">Menu premium avec spécialités locales et internationales</p>
            </div>
            
            <div className="card-premium p-8 text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Music className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">🎶 Musique & Vibes</h3>
              <p className="text-muted-foreground">DJ sets et ambiance musicale pour tous les goûts</p>
            </div>
            
            <div className="card-premium p-8 text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Wine className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">🥂 Cocktails & Détente</h3>
              <p className="text-muted-foreground">Bar premium avec cocktails signature et boissons d'exception</p>
            </div>
            
            <div className="card-premium p-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">⚡ Activités Festives</h3>
              <p className="text-muted-foreground">Jeux, animations et surprises pour une journée inoubliable</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offre Spéciale */}
      <section className="py-20 px-4 section-premium">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gradient mb-12">
            Offre Exclusive
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="card-premium p-8 relative animate-fade-in">
              <CardContent className="text-center">
                <div className="text-6xl mb-4">🥂</div>
                <h3 className="text-2xl font-bold mb-4">Les Barons d'Arignac</h3>
                <div className="text-4xl font-bold text-gradient mb-2">7 000 F</div>
                <p className="text-muted-foreground">Accès complet + boisson de bienvenue</p>
              </CardContent>
            </Card>
            
            <Card className="card-premium p-8 relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Badge className="absolute -top-3 -right-3 bg-gradient-gold animate-glow-pulse">
                Offre Exclusive
              </Badge>
              <CardContent className="text-center">
                <div className="text-6xl mb-4">🍾</div>
                <h3 className="text-2xl font-bold mb-4">Pack 3 Bouteilles</h3>
                <div className="text-4xl font-bold text-gradient mb-2">20 000 F</div>
                <p className="text-muted-foreground">3 bouteilles premium + table VIP</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Galerie */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gradient mb-12">
            L'Ambiance Baron
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card-premium overflow-hidden animate-fade-in">
              <img 
                src={brunchAerialView} 
                alt="Vue aérienne du Brunch du Baron" 
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="card-premium p-8 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold">Ambiance Premium</h3>
              </div>
            </div>
            
            <div className="card-premium p-8 flex items-center justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-center">
                <div className="text-6xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold">Gastronomie d'Exception</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inscription */}
      <section id="registration" className="py-20 px-4 bg-gradient-champagne">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gradient mb-12">
            Réservez Votre Place
          </h2>
          
          <EventRegistration />
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Témoignages */}
      <section className="py-20 px-4 section-premium">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gradient mb-12">
            Ils ont vécu l'expérience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-premium p-6 animate-fade-in">
              <CardContent className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic mb-4">"Meilleur brunch d'Abidjan, vibes incroyables ! L'ambiance était parfaite."</p>
                <p className="font-semibold">— Aminata K.</p>
              </CardContent>
            </Card>
            
            <Card className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic mb-4">"Une expérience premium exceptionnelle. Je recommande à 100% !"</p>
                <p className="font-semibold">— David M.</p>
              </CardContent>
            </Card>
            
            <Card className="card-premium p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="text-center">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="italic mb-4">"Organisation au top, cuisine délicieuse, ambiance festive. À refaire !"</p>
                <p className="font-semibold">— Sarah L.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Partage */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold text-center text-gradient mb-12">
            Contact & Partage
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="card-premium p-8 animate-fade-in">
              <h3 className="text-2xl font-semibold mb-6">Informations Pratiques</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <a href="tel:+22507472866639" className="hover:text-primary transition-colors">
                    +225 07 47 28 66 39
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <a 
                    href="https://wa.me/22507472866639" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    WhatsApp Direct
                  </a>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Latrille Grillz – Angré Château (en face de la cité militaire)</span>
                </div>
              </div>
            </div>
            
            <div className="card-premium p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-2xl font-semibold mb-6">Partager l'événement</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Facebook className="w-4 h-4" />
                  Facebook
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Partager
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Premium */}
      <footer className="bg-elegant-black text-elegant-black-foreground py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gradient mb-4">
            Le Brunch du Baron – Project X
          </h3>
          
          <p className="text-lg mb-6 opacity-80">
            Dimanche 28 Septembre 2025 – 14h GMT
          </p>
          
          <div className="flex justify-center items-center gap-4 mb-8">
            <span className="text-primary-glow">Code événement :</span>
            <Badge className="bg-gradient-gold text-elegant-black font-bold text-lg px-4 py-2">
              1510
            </Badge>
          </div>
          
          <p className="text-2xl font-bold text-gradient animate-glow-pulse">
            « Vivre la vibe avant la tempête »
          </p>
          
          <div className="mt-8 pt-8 border-t border-primary/20">
            <p className="text-sm opacity-60">
              © 2025 Le Brunch du Baron. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default Index;