import { NextResponse } from "next/server";
import productModal from "../../../../../utlis/model/product";
import connectToDB from "../../../../../utlis/connectMongo";
import { getServerSession } from "next-auth";
import userModal from "../../../../../utlis/model/user";
import { redirect } from "next/dist/server/api-utils";

export async function POST(request) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "invalid request" }, { status: 409 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
  }

  await connectToDB();
  // console.log("-------entered-----------")

  const { title, price } = await request.json();
  // console.log("title and price =>"+title+price)


  // console.log("creator name and id =>"+session.user.name+" "+JSON.stringify(session.user))

  try {
    const dbUser = await userModal.findOne({ email: session.user.email });
    if (!dbUser) {
      return NextResponse.json(
        { message: "User not found in database" },
        { status: 404 },
      );
    }

    const products = new productModal({
      title: title,
      price: price,
      creator: dbUser._id,
      creatorName: session.user.name
    });

    await products.save();
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "SUCCESSFULLY POSTED DATA",
    },
    { status: 201 },
  );
}
