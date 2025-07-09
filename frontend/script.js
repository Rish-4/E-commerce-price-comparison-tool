async function searchProduct() {
  const product = document.getElementById("productInput").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Loading...";

  try {
    const response = await fetch(`http://localhost:3000/compare?q=${encodeURIComponent(product)}`);
    const data = await response.json();

    if (data.error) throw new Error(data.error);

    resultsDiv.innerHTML = `
      <div class="card">
        <h3>Amazon</h3>
        <p>Price: ${data.amazon.price}</p>
        <a href="${data.amazon.link}" target="_blank">View on Amazon</a>
      </div>
      <div class="card">
        <h3>Flipkart</h3>
        <p>Price: ${data.flipkart.price}</p>
        <a href="${data.flipkart.link}" target="_blank">View on Flipkart</a>
      </div>
    `;
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">Failed to fetch data. Please check if backend is running.</p>`;
  }
}
