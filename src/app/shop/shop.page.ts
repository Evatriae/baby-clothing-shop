import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar,
  IonButtons,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
  IonList,
  IonItem,
  IonBadge,
  IonCard,
  IonCardContent,
  IonModal,
  IonBackdrop
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline, personCircleOutline, basketOutline, closeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.page.html',
  styleUrls: ['./shop.page.scss'],
  standalone: true,
  imports: [
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule,
    RouterModule,
    IonButtons,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonIcon,
    IonList,
    IonItem,
    IonBadge,
    IonCard,
    IonCardContent,
    IonModal,
    IonBackdrop
  ]
})
export class ShopPage implements OnInit {
  showAccordion = false;
  cartItemCount = 0;
  showProductModal = false;
  selectedProduct: any = null;

  categories = [
    {
      id: 1,
      name: 'Rompers & Onesies',
      image: 'assets/Romper with hearts.png',
      products: [
        { 
          id: 1, 
          name: 'Heart Romper', 
          price: '$24.99', 
          image: 'assets/Romper with hearts.png',
          description: 'Adorable romper with heart patterns. Made from 100% organic cotton, perfect for sensitive baby skin. Features snap closures for easy diaper changes.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink', 'White', 'Lavender']
        },
        { 
          id: 2, 
          name: 'Striped Romper', 
          price: '$22.99', 
          image: 'assets/Romper with stripes.png',
          description: 'Classic striped design that never goes out of style. Soft, breathable fabric ensures all-day comfort. Easy-care machine washable.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Blue/White', 'Pink/White', 'Gray/White']
        },
        { 
          id: 3, 
          name: 'Pink Romper', 
          price: '$26.99', 
          image: 'assets/Pink Dress.png',
          description: 'Beautiful pink romper with delicate details. Premium quality fabric with a comfortable fit. Perfect for special occasions.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink', 'Rose', 'Coral']
        },
        { 
          id: 4, 
          name: 'Flower Romper', 
          price: '$28.99', 
          image: 'assets/Pink with Flowers.png',
          description: 'Charming floral print romper. Features beautiful flower designs that are perfect for spring and summer. Ultra-soft material.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink Floral', 'White Floral', 'Yellow Floral']
        },
        { 
          id: 5, 
          name: 'Summer Romper', 
          price: '$25.99', 
          image: 'assets/Romper with hearts.png',
          description: 'Lightweight summer romper perfect for warm weather. Breathable fabric keeps baby cool and comfortable all day long.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Light Blue', 'Mint Green', 'Peach']
        },
        { 
          id: 6, 
          name: 'Classic Romper', 
          price: '$23.99', 
          image: 'assets/Romper with stripes.png',
          description: 'Timeless design that works for any occasion. Durable construction ensures this romper will last through multiple washes.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Navy', 'Gray', 'Cream']
        }
      ]
    },
    {
      id: 2,
      name: 'Dresses & Sets',
      image: 'assets/Pink Dress.png',
      products: [
        { 
          id: 7, 
          name: 'Pink Dress', 
          price: '$32.99', 
          image: 'assets/Pink Dress.png',
          description: 'Elegant pink dress perfect for special occasions. Features beautiful embroidered details and a comfortable fit.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink', 'White', 'Lavender']
        },
        { 
          id: 8, 
          name: 'Flower Set', 
          price: '$34.99', 
          image: 'assets/Flowers Sets.png',
          description: 'Complete flower-themed outfit set. Includes matching top and bottom with coordinating accessories.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink Floral', 'Blue Floral', 'Yellow Floral']
        },
        { 
          id: 9, 
          name: 'Chloe Set', 
          price: '$36.99', 
          image: 'assets/Chloe sets.png',
          description: 'Premium designer-inspired set with attention to detail. High-quality materials and craftsmanship.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Blush', 'Ivory', 'Sage']
        },
        { 
          id: 10, 
          name: 'Summer Dress', 
          price: '$30.99', 
          image: 'assets/Pink with Flowers.png',
          description: 'Light and airy summer dress with beautiful floral patterns. Perfect for warm weather outings.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink Floral', 'White Floral', 'Coral Floral']
        },
        { 
          id: 11, 
          name: 'Party Dress', 
          price: '$38.99', 
          image: 'assets/Pink Dress.png',
          description: 'Special occasion dress with elegant details. Features delicate lace trim and pearl accents.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink', 'White', 'Champagne']
        },
        { 
          id: 12, 
          name: 'Garden Set', 
          price: '$35.99', 
          image: 'assets/Flowers Sets.png',
          description: 'Nature-inspired set with garden motifs. Includes coordinating pieces for a complete look.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Garden Print', 'Butterfly Print', 'Bee Print']
        }
      ]
    },
    {
      id: 3,
      name: 'Seasonal Collection',
      image: 'assets/Flowers Sets.png',
      products: [
        { 
          id: 13, 
          name: 'Spring Flowers', 
          price: '$29.99', 
          image: 'assets/Flowers Sets.png',
          description: 'Celebrate spring with this beautiful floral collection. Fresh colors and patterns perfect for the season.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Spring Bloom', 'Cherry Blossom', 'Tulip Pink']
        },
        { 
          id: 14, 
          name: 'Summer Bloom', 
          price: '$31.99', 
          image: 'assets/Pink with Flowers.png',
          description: 'Vibrant summer collection with bold floral prints. Lightweight fabric perfect for hot days.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Summer Pink', 'Sunshine Yellow', 'Ocean Blue']
        },
        { 
          id: 15, 
          name: 'Garden Party', 
          price: '$33.99', 
          image: 'assets/Chloe sets.png',
          description: 'Sophisticated garden party ensemble. Elegant design suitable for special events and celebrations.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Rose Garden', 'Mint Sage', 'Peachy Cream']
        },
        { 
          id: 16, 
          name: 'Blossom Set', 
          price: '$28.99', 
          image: 'assets/Flowers Sets.png',
          description: 'Delicate blossom patterns inspired by nature. Soft colors and comfortable fit for everyday wear.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Blossom Pink', 'Petal White', 'Leaf Green']
        },
        { 
          id: 17, 
          name: 'Petal Dress', 
          price: '$32.99', 
          image: 'assets/Pink Dress.png',
          description: 'Graceful dress with petal-like layers. Creates a beautiful silhouette while maintaining comfort.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Petal Pink', 'Ivory Cream', 'Dusty Rose']
        },
        { 
          id: 18, 
          name: 'Daisy Collection', 
          price: '$30.99', 
          image: 'assets/Pink with Flowers.png',
          description: 'Cheerful daisy prints that bring joy to any day. Made with eco-friendly materials.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Daisy White', 'Sunny Yellow', 'Field Green']
        }
      ]
    },
    {
      id: 4,
      name: 'Essential Sets',
      image: 'assets/Chloe sets.png',
      products: [
        { 
          id: 19, 
          name: 'Chloe Essential', 
          price: '$27.99', 
          image: 'assets/Chloe sets.png',
          description: 'Essential everyday set with versatile styling. Mix and match pieces for different looks.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Natural', 'Stone', 'Cream']
        },
        { 
          id: 20, 
          name: 'Basic Hearts', 
          price: '$24.99', 
          image: 'assets/Romper with hearts.png',
          description: 'Classic heart pattern basics that never go out of style. Perfect for building a capsule wardrobe.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Pink Hearts', 'Blue Hearts', 'Gray Hearts']
        },
        { 
          id: 21, 
          name: 'Stripe Basics', 
          price: '$23.99', 
          image: 'assets/Romper with stripes.png',
          description: 'Essential striped pieces for mixing and matching. Timeless design that grows with your baby.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Navy Stripe', 'Pink Stripe', 'Gray Stripe']
        },
        { 
          id: 22, 
          name: 'Pink Essentials', 
          price: '$26.99', 
          image: 'assets/Pink Dress.png',
          description: 'Must-have pink pieces for your baby\'s wardrobe. Soft, comfortable, and stylish.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Soft Pink', 'Rose Pink', 'Blush Pink']
        },
        { 
          id: 23, 
          name: 'Comfort Set', 
          price: '$25.99', 
          image: 'assets/Chloe sets.png',
          description: 'Ultra-comfortable set designed for all-day wear. Premium soft fabrics and thoughtful construction.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['Cloud White', 'Sky Blue', 'Mint Green']
        },
        { 
          id: 24, 
          name: 'Daily Wear', 
          price: '$22.99', 
          image: 'assets/Romper with hearts.png',
          description: 'Practical daily wear essentials. Durable, easy-care fabrics perfect for active babies.',
          sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
          colors: ['White', 'Gray', 'Beige']
        }
      ]
    }
  ];

  constructor() {
    addIcons({ menuOutline, personCircleOutline, basketOutline, closeOutline });
  }

  ngOnInit() {
  }

  toggleAccordion() {
    this.showAccordion = !this.showAccordion;
  }

  openProductModal(product: any) {
    this.selectedProduct = product;
    this.showProductModal = true;
  }

  closeProductModal() {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  addToCart(product: any) {
    this.cartItemCount++;
    // Add cart logic here
    console.log('Added to cart:', product);
  }
}
