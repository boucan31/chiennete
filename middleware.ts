import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const template = searchParams.get('shopify_template');
  const handle = searchParams.get('shopify_handle');

  // Si on est sur la page d'accueil avec des paramètres Shopify, rediriger
  if (request.nextUrl.pathname === '/' && template && handle) {
    if (template === 'product') {
      return NextResponse.redirect(new URL(`/product/${handle}`, request.url));
    } else if (template === 'article') {
      return NextResponse.redirect(new URL(`/article/${handle}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/',
};

