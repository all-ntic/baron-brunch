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

// Input validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 50;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get JWT token from Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    // Verify the JWT token and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication error:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { firstName, lastName, email, phone, eventId, ticketClassId }: RegistrationData = await req.json();

    // Input validation
    if (!validateName(firstName)) {
      return new Response(
        JSON.stringify({ error: 'First name must be between 2 and 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateName(lastName)) {
      return new Response(
        JSON.stringify({ error: 'Last name must be between 2 and 50 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!validatePhone(phone)) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid phone number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Registration attempt by user:', user.id, { firstName, lastName, email });

    // 1. Sauvegarder en base de données Supabase d'abord
    const { data: dbData, error: dbError } = await supabase
      .from('registrations')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone: phone,
          user_id: user.id
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