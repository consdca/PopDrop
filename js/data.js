const PRODUCTS = [
  {
    id: 1,
    name: "Citrus Burst",
    flavor: "Citrus Soda",
    tagline: "Zest meets fizz",
    description: "A tangy explosion of grapefruit, lime, and yuzu. Citrus Burst is the wake-up call your taste buds didn't know they needed. Crisp, refreshing, and unapologetically bold.",
    price: 65,
    image: "images/CitrusSoda200x200.png",
    canColor: "#FF8C00",
    labelColor: "#FFD166",
    accentColor: "#FF4500",
    highlight: "#FFF3CD",
    ingredients: ["Carbonated Water", "Citric Acid", "Yuzu Extract", "Grapefruit Oil", "Cane Sugar"],
    calories: 120,
    volume: "355ml"
  },
  {
    id: 2,
    name: "Orange Fizz",
    flavor: "Orange Soda",
    tagline: "Classic reimagined",
    description: "Real Valencia orange juice meets sparkling water in this nostalgic crowd-pleaser. Bright, sunny, and effervescent — the original PopDrop flavor that started it all.",
    price: 65,
    image: "images/OrangeSoda200x200.png",
    canColor: "#FF4500",
    labelColor: "#FF6B35",
    accentColor: "#FF8C00",
    highlight: "#FFE8D6",
    ingredients: ["Carbonated Water", "Valencia Orange Juice", "Cane Sugar", "Natural Flavors", "Vitamin C"],
    calories: 130,
    volume: "355ml"
  },
  {
    id: 3,
    name: "Lemon Drop",
    flavor: "Lemon Soda",
    tagline: "Tart. Bright. Alive.",
    description: "Sicilian lemon zest distilled into every sip. Lemon Drop walks the perfect line between sweet and sour, delivering a sunshine-in-a-can experience from first pop to last drop.",
    price: 65,
    image: "images/LemonSoda200x200.png",
    canColor: "#F7C31A",
    labelColor: "#FFE234",
    accentColor: "#FFAA00",
    highlight: "#FFFBE6",
    ingredients: ["Carbonated Water", "Sicilian Lemon Juice", "Cane Sugar", "Lemon Zest Extract", "Sea Salt"],
    calories: 110,
    volume: "355ml"
  },
  {
    id: 4,
    name: "Berry Blast",
    flavor: "Berry & Orchard Soda",
    tagline: "The whole orchard, carbonated",
    description: "Blackberry, raspberry, and wild cherry converge in a deep, fruit-forward soda that tastes like summer at peak ripeness. Complex, layered, dangerously drinkable.",
    price: 75,
    image: "images/BerryOrchardSoda200x200.png",
    canColor: "#C0392B",
    labelColor: "#E84560",
    accentColor: "#8A2BE2",
    highlight: "#F8E0E6",
    ingredients: ["Carbonated Water", "Blackberry Juice", "Raspberry Puree", "Wild Cherry Extract", "Cane Sugar"],
    calories: 140,
    volume: "355ml"
  },
  {
    id: 5,
    name: "Grape Gang",
    flavor: "Grape Soda",
    tagline: "Purple reign",
    description: "Concord grape concentrate meets a hint of elderflower for a soda that's regal, complex, and impossibly smooth. Grape Gang doesn't follow trends — it sets them.",
    price: 75,
    image: "images/GrapeSoda200x200.png",
    canColor: "#8A2BE2",
    labelColor: "#A855F7",
    accentColor: "#6A1AB2",
    highlight: "#F0E6FF",
    ingredients: ["Carbonated Water", "Concord Grape Concentrate", "Elderflower Extract", "Cane Sugar", "Natural Flavors"],
    calories: 125,
    volume: "355ml"
  }
];

function formatPeso(value) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2
  }).format(Number(value) || 0);
}

function makeProductImage(p, size) {
  size = size || 180;
  return `<img class="product-image" src="${p.image}" alt="${p.name} ${p.flavor}" width="${size}" height="${size}" />`;
}

function getOrderPricing(items) {
  const subtotal = items.reduce((sum, item) => {
    const product = PRODUCTS.find(product => product.id === item.id);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);
  const totalItems = items.reduce((sum, item) => sum + item.qty, 0);
  const promotionApplied = totalItems >= 6;
  const discount = promotionApplied ? subtotal * 0.10 : 0;
  const discountedSubtotal = subtotal - discount;
  const shipping = promotionApplied || subtotal >= 999 ? 0 : 120;
  const vat = discountedSubtotal * 12 / 112;

  return {
    subtotal,
    totalItems,
    promotionApplied,
    discount,
    shipping,
    vat,
    total: discountedSubtotal + shipping
  };
}
