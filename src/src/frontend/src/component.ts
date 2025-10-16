import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  foods: any[] = [];
  constructor() { }
  ngOnInit(): void {
    // TODO: Load foods
  }

  onOrder(food: any) {
    // Navigate to address page
  }
}
