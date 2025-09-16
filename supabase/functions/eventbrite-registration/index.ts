import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const eventbriteApiKey = Deno.env.get('EVENTBRITE_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  eventId: string;
  ticketClassId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { firstName, lastName, email, phone, eventId, ticketClassId }: RegistrationData = await req.json();

    console.log('Début inscription Eventbrite pour:', { firstName, lastName, email });

    // Créer un client Supabase avec la clé de service
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // 1. Sauvegarder en base de données Supabase d'abord
    const { data: dbData, error: dbError } = await supabase
      .from('registrations')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone
        }
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Erreur Supabase:', dbError);
      throw new Error(`Erreur base de données: ${dbError.message}`);
    }

    console.log('Inscription sauvegardée en DB:', dbData.id);

    // 2. Créer l'inscription Eventbrite
    const eventbriteUrl = `https://www.eventbriteapi.com/v3/events/${eventId}/orders/`;
    
    const orderData = {
      tickets: [
        {
          ticket_class_id: ticketClassId,
          quantity: 1
        }
      ],
      attendees: [
        {
          ticket_class_id: ticketClassId,
          profile: {
            name: `${firstName} ${lastName}`,
            email: email,
            cell_phone: phone
          }
        }
      ]
    };

    console.log('Envoi vers Eventbrite:', { eventId, ticketClassId });

    const eventbriteResponse = await fetch(eventbriteUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${eventbriteApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    });

    const eventbriteData = await eventbriteResponse.json();
    console.log('Réponse Eventbrite:', eventbriteData);

    if (!eventbriteResponse.ok) {
      console.error('Erreur Eventbrite:', eventbriteData);
      throw new Error(eventbriteData.error_description || 'Erreur lors de la création du ticket Eventbrite');
    }

    // 3. Mettre à jour l'enregistrement avec l'ID Eventbrite
    const { error: updateError } = await supabase
      .from('registrations')
      .update({ 
        eventbrite_order_id: eventbriteData.id 
      })
      .eq('id', dbData.id);

    if (updateError) {
      console.error('Erreur mise à jour Eventbrite ID:', updateError);
    }

    console.log('Inscription complète réussie');

    return new Response(JSON.stringify({
      success: true,
      message: 'Inscription réussie ! Votre ticket Eventbrite a été créé.',
      orderId: eventbriteData.id,
      registrationId: dbData.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erreur dans eventbrite-registration:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});