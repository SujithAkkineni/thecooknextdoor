import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  orderId: string = '';
  paymentAmount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'];
    });
  }

  processPayment(): void {
    if (this.orderId) {
      this.apiService.processPayment(this.orderId).subscribe({
        next: (result) => {
          alert('Payment successful! Your order has been confirmed.');
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Payment error:', error);
          alert('Payment failed. Please try again.');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/address']);
  }
}
