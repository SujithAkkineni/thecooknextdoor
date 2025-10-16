import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-food-items',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class FoodItemsComponent implements OnInit {
  foods: any[] | null = null;
  selectedFood: any = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadFoods();
  }

  loadFoods(): void {
    this.foods = null; // Show loading state
    this.apiService.getFoods().subscribe({
      next: (foods: any[]) => {
        this.foods = foods;
      },
      error: (error) => {
        console.error('Error loading foods:', error);
        this.foods = []; // Show no foods message on error
      }
    });
  }

  onOrder(food: any): void {
    this.selectedFood = food;
    this.router.navigate(['/address'], {
      queryParams: { foodId: food._id }
    });
  }
}
