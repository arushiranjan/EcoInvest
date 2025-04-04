let productName, price, carbonFootprint;
const API_KEY = "6D0K850P610V309BE8WS7MBQ80"; 
const DEFAULT_PRODUCT_WEIGHT = 1; // Assume 1kg if weight is unknown

// Extract product details for Amazon
if (window.location.href.includes("amazon") && document.querySelector("#productTitle")) {
    let productName = document.querySelector("#productTitle")?.innerText.trim();
    let price = document.querySelector(".a-price .a-offscreen")?.innerText;
    
    // Extract Material
    let materialElement = document.querySelector('.po-material .a-span-last span');
    let material = materialElement ? materialElement.innerText.trim() : "Not Available";

    console.log("Product Name:", productName);
    console.log("Price:", price);
    console.log("Material:", material);
}



// Function to get the activity ID for the product
// function getActivityId(productName) {
//     productName = productName.toLowerCase();
//     if (productName.includes("shirt") || productName.includes("jeans")) return "consumer_goods-type_clothes";
//     if (productName.includes("phone") || productName.includes("laptop")) return "consumer_goods-type_electronics";
//     if (productName.includes("fridge") || productName.includes("refrigerator")) return "manufacturing_appliance-refrigerator";
//     if (productName.includes("shoe") || productName.includes("sneaker")) return "consumer_goods-type_shoes";
//     return "consumer_goods-type_general"; // Default category
// }

// // Function to calculate the carbon footprint
// async function getCarbonFootprint(productName, productWeight) {
//     let activityId = getActivityId(productName);

//     try {
//         const response = await fetch("https://beta3.api.climatiq.io/estimate", {
//             method: "POST",
//             headers: {
//                 "Authorization": `Bearer ${API_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({
//                 emission_factor: {
//                     activity_id: activityId,
//                     region: "US",
//                     source: "climatiq"
//                 },
//                 parameters: {
//                     mass: productWeight || DEFAULT_PRODUCT_WEIGHT, // Use default if not provided
//                     mass_unit: "kg"
//                 }
//             })
//         });

//         const data = await response.json();
//         console.log(data);
//         console.log("Carbon Footprint Data:", data.co2e ? `${data.co2e} kg CO₂` : "Data not available");
//         return data.co2e ? data.co2e : -1; // Return actual CO2e value
//     } catch (error) {
//         console.error("Error fetching carbon footprint:", error);
//         return -1;
//     }
// }

// // If product is found, calculate the carbon footprint
// if (productName) {
//     (async () => {
//         carbonFootprint = await getCarbonFootprint(productName, DEFAULT_PRODUCT_WEIGHT);
//         console.log("Extracted Product:", productName);
//         console.log("Estimated Carbon Footprint:", carbonFootprint);

//         // Send extracted data to background.js
//         chrome.runtime.sendMessage(
//             { 
//                 event: "productData", 
//                 product: productName || "Product not found", 
//                 price: price || "Price not available",
//                 carbon: carbonFootprint !== -1 ? `${carbonFootprint} kg CO₂` : "Data not available"
//             },
//             (response) => {
//                 if (chrome.runtime.lastError) {
//                     console.error("Error sending message:", chrome.runtime.lastError);
//                 } else {
//                     console.log("Response from background.js:", response);
//                 }
//             }
//         );
//     })();
// }
