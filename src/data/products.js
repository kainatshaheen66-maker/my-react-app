import lamp1 from "../assets/Lamps/images (1).jpeg";
import lamp2 from "../assets/Lamps/images (2).jpeg";
import lamp3 from "../assets/Lamps/images (3).jpeg";
import lamp4 from "../assets/Lamps/IMG-20250729-WA0031.jpg";
import lamp5 from "../assets/Lamps/IMG-20250729-WA0052.jpg";


const productGroups = [
  {
    id: "Salt-Wall",
    title: "Salt Wall",
    mainImage: lamp1,
    products: [
      { id: 1, name: "Salt Wall",  image: lamp1, price: 25 },
      { id: 2, name: "Salt Brick", image: lamp2, price: 30 },
      { id: 3, name: "Salt Tile", image: lamp3, price: 18 }
    ]
  },

{
    id: "Salt-Balls",
    title: "Crafted Lamps",
    mainImage: lamp4,
    products: [
      { id: 4, name: "Salt Lion", image: lamp4, price: 10 },
      { id: 5, name: "LED Salt Lamp", image: lamp5, price: 12 }
    ]
  }
];

export default productGroups;