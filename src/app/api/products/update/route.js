import connectToDB from "../../../../../utlis/connectMongo";
import { NextResponse } from "next/server";
import productModal from "../../../../../utlis/model/product";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

export async function PUT(request){
  if (request.method !== "PUT") {
    return NextResponse.json({ message: "invalid request" }, { status: 409 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
  }

  try {
    // Connect to the MongoDB database
    await connectToDB();

    // Parse the request body to extract updated product details
    const { title, price } = await request.json();
    const head = headers();
    const productId = head.get("x-id");

    // Validate the request
    if (!title || !price || !productId) {
      return NextResponse.json({ message: "Invalid request. Title, price, and product ID are required." }, { status: 400 });
    }

    // Find the product by ID
    const existingProduct = await productModal.findById(productId);

    // Check if the product exists
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    // Update the product with the new details
    existingProduct.title = title;
    existingProduct.price = price;

    // Save the updated product
    await existingProduct.save();

    // return NextResponse.json({ message: "Product updated successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }

  return NextResponse.json(
    {
      message: "SUCCESSFULLY POSTED DATA",
    },
    { status: 200 },
  );
}
