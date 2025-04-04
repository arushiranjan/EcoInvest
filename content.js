let productName, price, weight, material;
const API_KEY = "6D0K850P610V309BE8WS7MBQ80"; 
const DEFAULT_PRODUCT_WEIGHT = "1 kg"; 
const DEFAULT_EMISSION_FACTOR = 5.0; // fallback

// Load emission data from CSV
async function loadEmissionFactors() {
    const response = await fetch(chrome.runtime.getURL("emission_factors.csv"));
    const text = await response.text();
    const lines = text.split("\n").slice(1); // Skip header

    return lines
        .map(line => line.trim().split(","))
        .filter(parts => parts.length === 2 && !isNaN(parseFloat(parts[1])))
        .map(([name, factor]) => ({
            name: name.trim().toLowerCase(),
            factor: parseFloat(factor)
        }));
}

async function getCarbonFootprint(material, weightString) {
    const emissionData = await loadEmissionFactors();
    let factor = DEFAULT_EMISSION_FACTOR;
    let matchedMaterial = material;

    const weight = parseFloat(weightString.replace(/[^\d.]/g, "")) || 1;

    if (material && material.toLowerCase() !== "not available") {
        const lowerMaterial = material.toLowerCase();
        const match = emissionData.find(item => item.name === lowerMaterial) ||
                      emissionData.find(item => lowerMaterial.includes(item.name));
        if (match) {
            factor = match.factor;
            matchedMaterial = match.name;
        }
    } else {
        const lowerTitle = productName?.toLowerCase() || "";
        const titleMatch = emissionData.find(item => lowerTitle.includes(item.name));
        if (titleMatch) {
            factor = titleMatch.factor;
            matchedMaterial = titleMatch.name;
            console.log("Inferred material from title:", matchedMaterial);
        } else {
            console.warn("No material matched in title. Using default factor.");
        }
    }

    console.log("Final Material Used:", matchedMaterial);
    console.log("Weight (kg):", weight);

    const carbonEmission = factor * weight;
    return carbonEmission.toFixed(2);
}

function extractProductDetails() {
    if (window.location.href.includes("amazon") && document.querySelector("#productTitle")) {
        productName = document.querySelector("#productTitle")?.innerText.trim();
        price = document.querySelector(".a-price .a-offscreen")?.innerText || "Price not available";

        let weightElement = [...document.querySelectorAll("tr")]
            .find(tr => tr.querySelector("th")?.innerText.includes("Item Weight"))
            ?.querySelector("td");
        weight = weightElement ? weightElement.innerText.trim() : DEFAULT_PRODUCT_WEIGHT;

        const materialRow = [...document.querySelectorAll("tr")]
            .find(tr => tr.querySelector("th.a-color-secondary.a-size-base.prodDetSectionEntry")?.innerText.trim().toLowerCase() === "material");

        material = materialRow 
            ? materialRow.querySelector("td.a-size-base.prodDetAttrValue")?.innerText.trim() 
            : "Not available";

        console.log("Product Name:", productName);
        console.log("Price:", price);
        console.log("Weight:", weight);
        console.log("Material:", material);

        // ✅ Now calculate carbon footprint here
        (async () => {
            const carbonFootprint = await getCarbonFootprint(material, weight);
            console.log("Estimated Carbon Footprint:", carbonFootprint, "kg CO₂");

            chrome.runtime.sendMessage(
                { 
                    event: "productData", 
                    product: productName || "Product not found", 
                    price: price || "Price not available",
                    carbon: `${carbonFootprint} kg CO₂`
                },
                (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError);
                    } else {
                        console.log("Response from background.js:", response);
                    }
                }
            );
        })();
    }
}

// Watch for dynamic loading on Amazon
const observer = new MutationObserver((mutations, obs) => {
    if (document.querySelector("#productTitle")) {
        extractProductDetails();
        obs.disconnect();
    }
});
observer.observe(document.body, { childList: true, subtree: true });


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
