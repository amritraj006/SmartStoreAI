/**
 * AI Service to handle product content generation.
 * Connects to OpenAI API using native fetch, and falls back to a highly realistic template-based
 * generator if the key is invalid or not provided.
 */

const generateContent = async ({ title, category, price }) => {
  const apiKey = process.env.OPENAI_API_KEY;
  const isDummyKey = !apiKey || apiKey === "your_openai_api_key" || apiKey.trim() === "";

  if (!isDummyKey) {
    try {
      console.log("Calling OpenAI completions API...");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are an expert e-commerce copywriter. Generate high-converting product content. You must return your response in raw JSON format matching this schema:\n{\n  \"description\": \"String (detailed product description)\",\n  \"seoTags\": [\"String (5-7 relevant tags for search engines)\"],\n  \"marketingCaptions\": \"String (social media marketing post with emojis)\"\n}\nDo not include any markdown styling like ```json or backticks.",
            },
            {
              role: "user",
              content: `Generate description, seoTags, and marketingCaptions for a product titled "${title}" in the category "${category}" priced at $${price}.`,
            },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const contentStr = data.choices[0].message.content.trim();
        // Parse JSON
        try {
          const parsed = JSON.parse(contentStr);
          if (parsed.description && parsed.seoTags && parsed.marketingCaptions) {
            return parsed;
          }
        } catch (parseErr) {
          // If JSON parse fails, try extracting fields or clean string
          console.warn("OpenAI response JSON parsing failed, trying cleanup...", parseErr);
          const cleanStr = contentStr.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsedCleaned = JSON.parse(cleanStr);
          return parsedCleaned;
        }
      } else {
        const errText = await response.text();
        console.error("OpenAI API returned error status:", response.status, errText);
      }
    } catch (error) {
      console.error("OpenAI API fetch error, falling back to local generator:", error);
    }
  }

  // Graceful Fallback Generator
  console.log("Using local AI generator fallback...");
  
  // Format variables
  const cleanTitle = title || "Premium Product";
  const cleanCategory = category || "General Store";
  const cleanPrice = price ? `$${price}` : "a competitive price";

  // Pre-configured descriptions based on category or general
  let description = "";
  let seoTags = [];
  let marketingCaptions = "";

  const catLower = cleanCategory.toLowerCase();
  if (catLower.includes("elect") || catLower.includes("gadg") || catLower.includes("tech")) {
    description = `Elevate your digital life with the all-new ${cleanTitle}. Expertly engineered to deliver top-tier performance, this state-of-the-art item brings convenience and state-of-the-art functionality to your everyday routine. Ideal for enthusiasts of high-quality engineering, it combines durability with a streamlined minimalist appearance. Elevate your tech collection now!`;
    seoTags = [
      catLower,
      cleanTitle.toLowerCase(),
      "smart device",
      "tech gadget",
      "premium electronics",
      "innovative design",
    ];
    marketingCaptions = `⚡️ Upgrade your tech setup with the brand new ${cleanTitle}! Sleek design, unbeatable speed, and premium build quality. Get yours today for only ${cleanPrice}! 🌐✨ #TechInnovation #SmartLife #ECommerce`;
  } else if (catLower.includes("cloth") || catLower.includes("wear") || catLower.includes("fashion")) {
    description = `Step out in style with the ${cleanTitle}. Tailored from premium quality fabrics, this design merges timeless fashion with daily comfort. Breathable, durable, and crafted to fit perfectly, it's a versatile choice suitable for any casual or formal wardrobe. Experience premium comfort without sacrificing style!`;
    seoTags = [
      catLower,
      cleanTitle.toLowerCase(),
      "fashion wear",
      "stylish apparel",
      "premium fabric",
      "street style",
      "daily outfit",
    ];
    marketingCaptions = `✨ Turn heads wherever you go! The new ${cleanTitle} combines effortless style with ultimate comfort. Grab this wardrobe essential now for just ${cleanPrice}! 🛍️🧥 #FashionVibes #StyleInspo #PremiumApparel`;
  } else if (catLower.includes("access") || catLower.includes("bag") || catLower.includes("watch")) {
    description = `Add the perfect finishing touch to your everyday look with the ${cleanTitle}. A blend of practical utility and elegant craftsmanship, this premium accessory is built to stand out and keep your essentials organized. Designed with premium materials for maximum durability and refined taste.`;
    seoTags = [
      catLower,
      cleanTitle.toLowerCase(),
      "luxury accessory",
      "premium quality",
      "daily carry",
      "elegant details",
      "essential gear",
    ];
    marketingCaptions = `💼 Elevate your everyday style with the sophisticated ${cleanTitle}. Elegant, durable, and highly functional. Shop now for ${cleanPrice} and stand out from the crowd! ⌚️🕶️ #AccessoryGram #ElevatedStyle #ShopPremium`;
  } else {
    description = `Introducing our latest item, the ${cleanTitle}. Designed to fit seamlessly into your lifestyle, this product is made with high-quality materials to ensure durability and top performance. Whether you're purchasing it for yourself or as a gift, it offers excellent value at ${cleanPrice}.`;
    seoTags = [
      "trending product",
      cleanTitle.toLowerCase(),
      catLower || "smart store",
      "top quality",
      "best value",
      "must have",
    ];
    marketingCaptions = `🔥 Don't miss out on the incredible new ${cleanTitle}! The perfect combination of quality, reliability, and value. Secure yours today for ${cleanPrice}! 🚀📦 #MustHave #SmartShopping #BestDeal`;
  }

  // Deduplicate and filter tags
  seoTags = [...new Set(seoTags)].filter(Boolean);

  return {
    description,
    seoTags,
    marketingCaptions,
  };
};

module.exports = { generateContent };
