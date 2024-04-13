
import LogoutButton from "@/components/buttons/LogoutButton";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, AwaitedReactNode } from "react";

export default async function Protected() {
  const session = await getServerSession();
  if (!session) {
    redirect("/api/auth/signin");
  }

  async function fetchData() {
    let responseData;
    try {
      const response = await fetch("http://localhost:3000/api/products", {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      });
  
      responseData = await response.json();
      if (response.status !== 200) {
        throw new Error(responseData.message);
      }
    } catch (error:any) {
      const errorMessage = ("ERROR : "+ error.message);
      return errorMessage;
    }
  
    const products = responseData.products;
    // console.log("PRODUCTS", products);
    // console.log(products);
  
    return products;
  }

  const products = await fetchData();

  // const pathname = usePathname();


  return (
    <main className="max-w-2xl min-h-screen flex flex-col items-center mx-auto">
      <div className="w-full flex justify-between my-10">
        <h1 className="text-2xl font-bold">Dashboard Page</h1>
        {session ? <LogoutButton /> : null}
      </div>
      <Link
        href="/post/create"
        // style={{ color: pathname === "/post/create" ? "white" : "grey" }}
      >
        Add a product
      </Link>
      {session.user?.name}
      {session.user?.email}
      {session.user?.image}
      <pre className="w-full bg-gray-200 p-4 rounded break-words whitespace-pre-wrap">
        {JSON.stringify(session, null, 2)}
      </pre>

      {typeof products === "string" ? (
          <h2>{products}</h2>
        ) : products?.length === 0 ? (
          <h2>No products found!</h2>
        ) : (
          products?.map((item: { _id: Key | null | undefined; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; price: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<AwaitedReactNode> | null | undefined; creatorName: any; creator: any; }) => (
            <div key={item._id} >
              <h2>{item.title}</h2>
              <h3>{item.price}</h3>
              <Link
                href={{
                  pathname: `/post/${item._id}`,
                  query: {
                    title: item.title,
                    price: item.price,
                    creatorName: item.creatorName,
                    creator: item.creator,
                    session: session.user?.name
                  },
                }}
              >
                Proceed
              </Link>
            </div>
          ))
        )}
    </main>
  );
}
