let productData = { product: "Loading...", carbon: "Fetching data..." };

// ✅ Listen for messages from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === "productData") {
        productData = { 
            product: message.product, 
            price: message.price || "Price not available",
            carbon: message.carbon || "Calculating..."
        };

        console.log("Updated Product Data:", productData);

        sendResponse({ status: "Received successfully!", data: productData });
    } 
    else if (message.event === "getProductData") {
        sendResponse(productData);
    }

    return true; // Keeps the message channel open for async handling
});
