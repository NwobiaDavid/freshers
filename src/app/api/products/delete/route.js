import { headers } from "next/dist/client/components/headers";
import { NextResponse } from "next/server";
import connectToDB from "../../../../../utlis/connectMongo";
import productModal from "../../../../../utlis/model/product";
import { getServerSession } from "next-auth";
// import { getToken } from "next-auth/jwt";
// import jwt from "jsonwebtoken";

export async function DELETE(request) {
  if (request.method !== "DELETE") {
    return NextResponse.json({ message: "invalid request" }, { status: 409 });
  }

  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: "Not authorized!" }, { status: 401 });
  }

  try {
    connectToDB();

 
    const head = headers();
    const id = head.get("x-id");

    const product = await productModal.deleteOne({ _id: id });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "SUCCESSFULLY DELETED DATA",
    },
    { status: 201 },
  );
}
