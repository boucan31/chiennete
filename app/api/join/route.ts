import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // TODO: Intégrer un service d'envoi d'email ici
    // Options possibles:
    // - Resend (https://resend.com)
    // - SendGrid
    // - Mailgun
    // - Nodemailer avec SMTP
    // - Shopify Customer API pour ajouter à une liste
    
    // Pour l'instant, on log juste l'email
    console.log('📧 Email reçu pour inscription:', email);

    // Exemple avec Resend (décommentez et configurez):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'votre-email@example.com',
      subject: 'Nouvelle inscription - La Chienneté',
      html: `<p>Nouvel email inscrit: ${email}</p>`,
    });
    */

    // Exemple avec Shopify Customer API (si vous voulez ajouter à une liste):
    /*
    const shopifyResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/customers.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_ACCESS_TOKEN!,
        },
        body: JSON.stringify({
          customer: {
            email: email,
            tags: 'newsletter,waitlist',
          },
        }),
      }
    );
    */

    return NextResponse.json(
      { success: true, message: 'Email enregistré avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'email:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
