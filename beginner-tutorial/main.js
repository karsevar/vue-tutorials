var app = new Vue({
  el: "#app",
  data: {
    brand: "Vue Mastery",
    product: "Sock",
    selectedVariant: 0,
    inStock: false,
    inventory: 100,
    details: ["80% cotton", "20% Polyester", "Gender-neutral"],
    variants: [
      {
        variantId: 2234,
        variantColor: "green",
        variantImage: "./assets/vmSocks-green-onWhite.jpg",
        variantQuantity: 10,
      },
      {
        variantId: 2235,
        variantColor: "blue",
        variantImage: "./assets/vmSocks-blue-onWhite.jpg",
        variantQuantity: 0,
      },
    ],
    objectClass1: {
      "text-decoration": "line-through",
    },
    cart: 0,
  },
  methods: {
    addToCart: function () {
      this.cart += 1;
    },
    updateProduct: function (index) {
      this.selectedVariant = index;
    },
    removeFromCart: function () {
      if (this.cart > 0) {
        this.cart -= 1;
      }
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
  },
});
