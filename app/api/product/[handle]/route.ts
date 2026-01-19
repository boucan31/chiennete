import { getProductByHandle } from '@/lib/shopify';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle: handleParam } = await params;
    
    // Essayer d'abord le paramètre de route, puis le query parameter
    const handle = handleParam || request.nextUrl.searchParams.get('handle');

    if (!handle) {
      return NextResponse.json(
        { error: 'Handle is required' },
        { status: 400 }
      );
    }

    // Décoder le handle (les espaces et caractères spéciaux sont encodés dans l'URL)
    const decodedHandle = decodeURIComponent(handle);
    
    console.log(`API Route - Received handle: "${handle}"`);
    console.log(`API Route - Decoded handle: "${decodedHandle}"`);

    const product = await getProductByHandle(decodedHandle);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
