let productData = { product: "Loading...", carbon: "Fetching data..." };

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.event === "productData") {
        productData = { 
            product: message.product, 
            carbon: message.carbon || "Calculating..."
        };
        console.log("Updated Product Data:", productData);

        sendResponse({ status: "Received successfully!" });
    } 
    else if (message.event === "getProductData") {
        sendResponse(productData);
    }

    return true; // Keeps the message channel open for async handling
});
