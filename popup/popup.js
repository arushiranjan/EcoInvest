document.addEventListener("DOMContentLoaded", () => {
    const getCarbonBtn = document.getElementById("get-carbon");
    const carbonInfoDiv = document.getElementById("carbon-info");
    const productInfo = document.getElementById("product-info");
    const carbonScore = document.getElementById("carbon-score");

    getCarbonBtn.addEventListener("click", () => {
        chrome.runtime.sendMessage({ event: "getProductData" }, (response) => {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
                return;
            }
            console.log("Received data:", response);

            // Update UI with product details
            productInfo.innerText = response.product || "No product found";
            carbonScore.innerText = "Carbon Footprint: " + (response.carbon || "--");

            // Make the carbon info visible
            carbonInfoDiv.style.display = "block";
        });
    });
});
