export const plansMap = [
  {
    id: "basic",
    name: "Basic",
    description: "Get Started with Video2Blog",
    price: "9.99",
    items: ["3 Blog Posts", "3 Transcriptions"],
    paymentLink: "https://buy.stripe.com/test_dR65nteEH8EV9GwcMO",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1Q0OgiC5NvX3gfoYIyazVKBp"
        : "",
  },
  {
    id: "pro",
    name: "Pro",
    description: "All Blog Posts, let's go!",
    price: "19.99",
    items: ["Unlimited Blog Posts", "Unlimited Transcriptions"],
    paymentLink: "https://buy.stripe.com/test_fZe3flcwz08pdWMfZ1",
    priceId:
      process.env.NODE_ENV === "development"
        ? "price_1Q0Oh6C5NvX3gfoYamp1QYBW"
        : "",
  },
];
