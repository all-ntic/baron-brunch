import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const faqs = [
    {
      question: "Quels sont les moyens de paiement acceptés ?",
      answer: "Nous acceptons les paiements par Mobile Money (Orange Money, MTN Money), carte bancaire, et espèces sur place. Le paiement s'effectue directement via Eventbrite lors de votre inscription."
    },
    {
      question: "Comment accéder à mes tickets après achat ?",
      answer: "Après votre inscription, vous recevrez immédiatement votre ticket officiel Eventbrite par email. Vous pouvez également retrouver vos tickets dans votre compte Eventbrite."
    },
    {
      question: "Comment valider mon ticket à l'entrée ?",
      answer: "Présentez votre ticket Eventbrite (format digital ou imprimé) à l'entrée. Nos équipes scanneront le QR code pour valider votre accès à l'événement."
    },
    {
      question: "Puis-je acheter des tickets pour d'autres personnes ?",
      answer: "Oui, vous pouvez acheter plusieurs tickets en une seule commande sur Eventbrite. Chaque ticket sera nominatif et devra être présenté individuellement à l'entrée."
    },
    {
      question: "L'événement est-il maintenu en cas de pluie ?",
      answer: "Oui, l'événement se déroule dans un espace couvert chez Latrille Grillz. En cas de conditions météo difficiles, nous avons des espaces intérieurs pour maintenir la fête !"
    },
    {
      question: "Y a-t-il un dress code ?",
      answer: "L'ambiance est décontractée mais élégante. Venez avec style pour profiter pleinement de cette expérience premium ! Évitez les tongs et privilégiez une tenue soignée."
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gradient mb-12">
          Questions fréquentes
        </h2>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="card-premium px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pt-2">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;