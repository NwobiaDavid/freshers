"use client"

import React, { useEffect, useState } from 'react';

function LikeButton({ productId }) {
  const [likes, setLikes] = useState(0);
  const [userLiked, setUserLiked] = useState(() => {
    const userLiked = localStorage.getItem(`userLiked_${productId}`);
    return userLiked ? JSON.parse(userLiked) : false;
  });

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch(`/api/products/${productId}/likecount`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productId: productId
            })
          });
        if (response.ok) {
          const data = await response.json();
          setLikes(data.data);


          
        } else {
          console.error('Failed to fetch likes');
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [productId]);

  const handleLike = async () => {
    try {
        const method = userLiked ? 'unlike' : 'like';
      const response = await fetch(`/api/products/${productId}/${method}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: productId
        })
      });

      console.log("----------entered---------")
      if (response.ok) {
        const data = await response.json();
        console.log("resp=> "+ JSON.stringify(data))
        setLikes(data.data);
        setUserLiked(!userLiked);
        localStorage.setItem(`userLiked_${productId}`, JSON.stringify(!userLiked));
      } else {
        console.error('Failed to update likes');
      }
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  return (
    <button onClick={handleLike}>
      {userLiked ? 'Unlike' : 'Like'} ({likes})
    </button>
  );
}

export default LikeButton;
