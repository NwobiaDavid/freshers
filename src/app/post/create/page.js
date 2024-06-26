/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { useSession } from "next-auth/react";
import { redirect ,useRouter} from "next/navigation";
// import {  } from "next/router";

function page() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const { data } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin");
    },
  });

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const router = useRouter();

  async function postData() {
    if (title === "" || price === "") {
      alert("Plase insert title and price correctly");
      return;
    }

    let responseData;
    try {
      setResponseMsg("");
      setIsLoading(true);
      const response = await fetch("http://localhost:3000/api/products/post", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title,
          price: price,
        }),
      });

      responseData = await response.json();
      if (response.status !== 201) {
        throw new Error(responseData.message);
      }

      setIsLoading(false);
      
      router.push('/dashboard');
    } catch (error) {
      setResponseMsg("ERROR : "+ error.message);
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
        marginTop: "100px",
      }}
    >
      {isLoading === true && <h2>Loading...</h2>}
      {responseMsg !== "" && <h2>{responseMsg}</h2>}

      <h3>You are logged in as :{data?.user?.name} </h3>
      <h3 style={{ marginBottom: "20px" }}>email : {data?.user?.email} </h3>

      <input
        className={styles.inputField}
        type="text"
        placeholder="title"
        value={title}
        onChange={handleTitle}
      />
      <input
        className={styles.inputField}
        type="number"
        placeholder="price"
        value={price}
        onChange={handlePrice}
      />
      <button className={styles.btn} onClick={postData}>
        POST DATA
      </button>
    </div>
  );
}

export default page;
