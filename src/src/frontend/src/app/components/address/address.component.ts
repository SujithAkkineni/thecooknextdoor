import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {
  foodId: string = '';
  buyerName: string = '';
  address: string = '';
  deliveryOption: string = 'walk';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.foodId = params['foodId'];
    });
  }

  onSubmit(): void {
    if (this.buyerName && this.address && this.foodId) {
      const orderData = {
        foodId: this.foodId,
        buyerName: this.buyerName,
        address: this.address,
        deliveryOption: this.deliveryOption
      };

      this.apiService.placeOrder(orderData).subscribe({
        next: (order: any) => {
          alert('Order placed successfully!');
          this.router.navigate(['/payment'], {
            queryParams: { orderId: order._id }
          });
        },
        error: (error) => {
          console.error('Error placing order:', error);
          alert('Failed to place order. Please try again.');
        }
      });
    } else {
      alert('Please fill in all required fields.');
    }
  }

  goBack(): void {
    this.router.navigate(['/order']);
  }
}
