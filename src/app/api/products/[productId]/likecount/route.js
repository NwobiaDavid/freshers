

import { NextResponse } from 'next/server';
import connectToDB from '../../../../../../utlis/connectMongo';
import Product from '../../../../../../utlis/model/product';
import { getServerSession } from 'next-auth';
import { useParams } from 'next/navigation';

export async function POST(req) {
    console.log("-----------------inside-------------------")

  if (req.method !== 'POST') {
    return NextResponse.json({ message: 'Invalid request' }, { status: 409 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: 'Not authorized!' }, { status: 401 });
  }

  
  try {
    await connectToDB();

    const {productId} = await req.json();
    const product = await Product.findById(productId);

    if (!product) {
      return NextResponse.json({ message: 'Product not found in database' }, { status: 404 });
    }

    // product.likes += 1;
    // await product.save();

    return NextResponse.json({ message: 'Success', data: product.likes }, { status: 200 });
  } catch (error) {
    console.error('Error updating likes:', error);
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 });
  }
}
