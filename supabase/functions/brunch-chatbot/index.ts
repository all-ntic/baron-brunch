import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BRUNCH_INFO = `
🎉 Le Brunch du Baron – Project X 🎉

📅 Date : Dimanche 28 Septembre 2025 – 14h GMT
📍 Lieu : Latrille Grillz – Angré Château (en face de la cité militaire)
💰 Prix : À partir de 7 000 F CFA
📞 Contact : +225 07 47 28 66 39
🔖 Code événement : 1510

🍴 AU PROGRAMME :
- Brunch gourmand avec spécialités locales et internationales
- Musique & DJ sets pour une ambiance festive
- Cocktails premium et boissons d'exception
- Activités festives, jeux et animations
- Ambiance premium dans un cadre exceptionnel

💰 OFFRES :
🥂 Les Barons d'Arignac : 7 000 F (accès complet + boisson de bienvenue)
🍾 Pack 3 Bouteilles : 20 000 F (3 bouteilles premium + table VIP)

📞 CONTACT :
Téléphone : +225 07 47 28 66 39
WhatsApp : https://wa.me/22507472866639

🎯 OBJECTIF : "Une parenthèse de paix avant la tempête électorale"
🎭 AMBIANCE : Luxe, détente, festivité et convivialité

Le ticket est GRATUIT via notre formulaire d'inscription !
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es l'assistant virtuel officiel du "Brunch du Baron - Project X". Tu es chaleureux, enthousiaste et professionnel. Ton rôle est de :

1. Présenter l'événement avec enthousiasme
2. Répondre aux questions sur le programme, les prix, le lieu, la date
3. Encourager les visiteurs à s'inscrire via le formulaire pour obtenir leur ticket GRATUIT
4. Créer une ambiance festive et premium dans tes réponses
5. Utiliser des emojis appropriés pour rendre les réponses vivantes

INFORMATIONS SUR L'ÉVÉNEMENT :
${BRUNCH_INFO}

INSTRUCTIONS IMPORTANTES :
- Réponds UNIQUEMENT aux questions liées au Brunch du Baron
- Encourage toujours l'inscription via le formulaire
- Mentionne que le ticket est GRATUIT via l'inscription
- Reste positif et festif
- Si on te demande autre chose, redirige poliment vers l'événement
- Utilise un ton chaleureux et ivoirien quand approprié`
          },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    console.log('OpenAI Response:', data);

    const botMessage = data.choices[0].message.content;

    return new Response(JSON.stringify({ message: botMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Erreur dans brunch-chatbot:', error);
    return new Response(JSON.stringify({ 
      error: 'Une erreur est survenue. Veuillez réessayer.',
      message: "Désolé, je rencontre un petit problème technique. 😅 N'hésitez pas à me reposer votre question ou à consulter directement les informations sur la page !"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});