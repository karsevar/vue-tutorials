var eventBus = new Vue();

Vue.component("product-details", {
  props: {
    details: {
      type: Array,
      required: true,
    },
  },
  template: `<ul>
      <li v-for="detail in details">{{detail}}</li>
    </ul>`,
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
    cart: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div class="product">
    <div class="product-image">
      <img v-bind:src="image" />
    </div>
    <div class="product-info">
      <h1>{{ title }}</h1>
      <p>{{ sale }}</p>
      <p v-show="inventory > 10">In Stock</p>
      <p v-bind:style="[inStock ? objectClass1 : '']">Out of Stock</p>
      <p>Shipper: {{shipping}}</p>
      <product-details v-bind:details='details'></product-details>
      <div
        v-for="(variant, index) in variants"
        v-on:mouseover="updateProduct(index)"
        v-bind:key="variant.variantId"
        class="color-box"
        v-bind:style="{backgroundColor: variant.variantColor}"
      ></div>
      <button
        v-on:click="addToCart"
        v-bind:disabled="!inStock"
        v-bind:class="{disabledButton: !inStock}"
      >
        Add to Cart
      </button>
      <button @click="removeFromCart">Remove From Cart</button>
    </div>
    <product-tabs v-bind:reviews='reviews'></product-tabs>
  </div>
    `,
  data() {
    return {
      brand: "Vue Mastery",
      onSale: true,
      product: "Sock",
      selectedVariant: 0,
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
          variantQuantity: 10,
        },
      ],
      objectClass1: {
        "text-decoration": "line-through",
      },
      reviews: [],
    };
  },
  methods: {
    addToCart: function () {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    updateProduct: function (index) {
      this.selectedVariant = index;
    },
    removeFromCart: function () {
      if (this.cart.length > 0) {
        this.$emit(
          "remove-from-cart",
          this.variants[this.selectedVariant].variantId
        );
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
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    sale() {
      if (this.onSale) {
        return this.brand + " " + this.product + " is on sale.";
      } else {
        return this.brand + " " + this.product + " is not on sale.";
      }
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component("product-review", {
  template: `
        <form class='review-form' v-on:submit.prevent='onSubmit'>
        <p v-if='errors.length'>
            <b>Please correct the following error(s): </b>
            <ul>
                <li v-for='error in errors'>{{error}}</li>
            </ul>
        <p>
            <p>
                <label for='name'>Name:</label>
                <input id='name' v-model='name'>
            </p>
            <p>
                <label for='review'>Review:</label>
                <textarea id='review' v-model='review'></textarea>
            </p>
            <p>
                <label for='rating'>Rating:</label>
                <select id='rating' v-model.number='rating'>
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
            <p>
                <label for='recommend'>Would you recommend this product?</label>
                <label for='yes'>Yes <input type='radio' id='yes' v-model='recommend' value='Yes'></label>
                <label for='No'>No <input type='radio' id='no' v-model='recommend' value='No'></label>
            </p>
            <p>
                <input type='submit' value='Submit'>
            </p>
        </form>
    `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit: function () {
      if (this.name && this.review && this.rating && this.recommend) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;

        console.log("submitted form", productReview);
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
        if (!this.recommend) this.errors.push("Recommend required.");
      }
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
        <div>
            <span class='tab' v-bind:class='{activeTab: selectedTab === tab}' v-for='(tab, index) in tabs' :key='index' v-on:click='selectedTab = tab'>{{ tab }}</span>
            <div v-show="selectedTab === 'Reviews'">
        <h2>Reviews</h2>
        <p v-if='!reviews.length'>There are no reviews yet.</p>
        <ul>
            <li v-for='review in reviews'>
                <p>{{review.name}}</p>
                <p>Rating: {{review.rating}}</p>
                <p>{{review.review}}</p>
                <p>Recommend: {{review.recommend}}</p>
            </li>
        </ul>
        </div>
    <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>
    `,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeId(id) {
      var newCart = this.cart.filter((item) => item !== id);
      this.cart = newCart;
    },
  },
});
