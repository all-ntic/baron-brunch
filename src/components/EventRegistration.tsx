import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Ticket, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const EventRegistration = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    eventId: '1234567890', // Remplacer par votre vrai Event ID Eventbrite
    ticketClassId: '9876543210' // Remplacer par votre vrai Ticket Class ID Eventbrite
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  // Redirect to auth if not authenticated
  if (!user || !session) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>
            Please sign in to register for the event
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={() => navigate('/auth')}
            className="w-full"
          >
            Sign In / Sign Up
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Envoi inscription avec:', formData);

      // Appel à notre edge function pour l'inscription Eventbrite + Supabase
      const { data, error } = await supabase.functions.invoke('eventbrite-registration', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          eventId: formData.eventId,
          ticketClassId: formData.ticketClassId
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      console.log('Réponse edge function:', { data, error });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de l\'inscription');
      }

      setIsSuccess(true);
      toast({
        title: "✅ Inscription confirmée !",
        description: "Votre ticket Eventbrite a été créé et sera envoyé par email.",
      });

    } catch (error) {
      console.error('Erreur inscription:', error);
      toast({
        title: "❌ Erreur d'inscription",
        description: error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer.",
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