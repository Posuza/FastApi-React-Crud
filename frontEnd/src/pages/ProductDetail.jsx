import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (res.status === 404) {
          navigate("/404");
          return;
        }
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        // Optionally handle/log error here
        navigate("/404");
      }
    };
    fetchProduct();
  }, [id, navigate]);

  // Update a product by ID
  const updateProduct = async (id, updatedData) => {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      if (!res.ok) throw new Error("Failed to update product");
      const data = await res.json();
      // Optionally update local state/UI here
      return data;
    } catch (error) {
      // Handle error (show toast, message, etc.)
      console.error(error);
      throw error;
    }
  };

  // Delete a product by ID
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`https://fakestoreapi.com/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      const data = await res.json();
      // Optionally update local state/UI here or navigate away
      return data;
    } catch (error) {
      // Handle error (show toast, message, etc.)
      console.error(error);
      throw error;
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{product.title}</h2>
      <img src={product.image} alt={product.title} className="h-32 mb-4" />
      <p>{product.description}</p>
      <p className="mt-2 font-semibold">${product.price}</p>
      <button
        onClick={() =>
          updateProduct(product.id, { ...product, title: "New Title" })
        }
      >
        Update
      </button>
      <button onClick={() => deleteProduct(product.id)}>Delete</button>
    </div>
  );
};

export default ProductDetail;