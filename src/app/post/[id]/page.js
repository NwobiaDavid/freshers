/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { useParams, usePathname } from "next/navigation";

import React, { Fragment, useEffect, useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";

 function  page({session}) {
  // const router = useRouter();
  // const { id } = router.query;

  const params = useParams();
  const [query, setQuery] = useState({
    title: "",
    price: 0,
    creatorName: "",
    creator: "",
    session: ""
  });
  // const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  // const session = await getServerSession();
  // const { data: session } = useSession();

  useEffect(() => {
    const urlparams = new URLSearchParams(window.location.search);

    let qry = {};
    for (const [key, value] of urlparams.entries()) {
      qry[key] = value;
    }

    setQuery(qry);
  }, [params.id]);

  const router = useRouter();

  async function handleUpdate() {
    try {
      setResponseMsg("");
      setIsLoading(true);
  
      // Construct the request body with the updated product details
      const requestBody = {
        title: `updated ${query.title}`,
        price: query.price,
      };
  
      // Send the PUT request to update the product
      const response = await fetch(`http://localhost:3000/api/products/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "X-ID": params.id,
        },
        body: JSON.stringify(requestBody),
      });
  
      // Parse the response
      const responseData = await response.json();
  
      // Check if the request was successful
      if (response.status === 200) {
        setResponseMsg(responseData.message);
        
      } else {
        throw new Error(responseData.message);
      }
    } catch (error) {
      setResponseMsg("Error updating product: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }
  

  
  async function handleDelete() {
    let responseData;
    try {
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:3000/api/products/delete`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
            "X-ID": params.id,
          },
        },
      );

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      router.push('/dashboard');
    } catch (error) {
      setResponseMsg(error.message);
      setIsLoading(false);
      return;
    }

    setResponseMsg(responseData.message);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "50px",
        marginTop: "50px",
      }}
    >
      {isLoading && <h2>Deleting data...</h2>}

      {responseMsg !== "" ? (
        <h2>{responseMsg}</h2>
      ) : (
        <div className={styles.card}>
          {" "}
          <h2> "name" : "{query.title}"</h2>
          <h3 style={{ color: "green" }}> "price" : "{query.price}"</h3>
          <h4> "creator" : "{query.creatorName}"</h4>
          
          {query.creatorName === query.session ? (
            <>

            <button onClick={handleDelete}>Delete</button>

            <button onClick={handleUpdate}>Edit</button>
            </>
          ) : null}
          {console.log("sessions=> "+ JSON.stringify(query.session))}
        </div>
      )}
    </div>
  );
}

export default page;
