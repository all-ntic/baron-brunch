import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Ticket, CheckCircle } from 'lucide-react';

const EventRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulation d'appel API Eventbrite
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulation
      
      // En réalité, ici on ferait l'appel à l'API Eventbrite
      // const response = await fetch('/api/eventbrite-registration', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     ...formData,
      //     event_id: 'EVENTBRITE_EVENT_ID',
      //     ticket_class_id: 'EVENTBRITE_TICKET_CLASS_ID'
      //   })
      // });

      setIsSuccess(true);
      toast({
        title: "✅ Inscription confirmée !",
        description: "Votre ticket Eventbrite a été envoyé par email.",
      });
    } catch (error) {
      toast({
        title: "❌ Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="card-premium max-w-md mx-auto animate-fade-in">
        <CardContent className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gradient mb-2">Inscription confirmée !</h3>
          <p className="text-muted-foreground mb-4">
            Votre ticket Eventbrite a été envoyé par email.
          </p>
          <p className="text-sm bg-secondary/20 p-3 rounded-lg">
            📧 Vérifiez votre boîte mail (et les spams) pour récupérer votre ticket officiel.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-premium max-w-md mx-auto animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-gradient flex items-center justify-center gap-2">
          <Ticket className="w-6 h-6" />
          Obtenir mon ticket
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Prénom *</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Nom *</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Téléphone *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="mt-1"
              placeholder="+225 XX XX XX XX XX"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full btn-premium" 
            disabled={isLoading}
          >
            {isLoading ? '⏳ Inscription en cours...' : '🎟️ Obtenir mon ticket'}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            En vous inscrivant, vous acceptez de recevoir votre ticket par email via Eventbrite.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventRegistration;