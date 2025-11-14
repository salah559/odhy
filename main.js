const API_URL = window.location.origin;

console.log('API URL:', API_URL);

fetch(`${API_URL}/api/products`)
  .then(res => res.json())
  .then(data => console.log("المنتجات:", data))
  .catch(err => console.error("خطأ:", err));
