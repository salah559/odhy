fetch("http://localhost:5000/api/products")
  .then(res => res.json())
  .then(data => console.log("المنتجات:", data))
  .catch(err => console.error(err));
