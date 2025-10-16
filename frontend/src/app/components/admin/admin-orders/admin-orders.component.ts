import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

// Define interface for admin order component separately
interface AdminOrder {
  _id: string;
  foodId: {
    _id?: string; // Making optional since backend populates with full object
    name: string;
    price: number;
  };
  buyerName: string;
  address: string;
  deliveryOption: string;
  paymentStatus: string;
  createdAt: string;
}

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  filteredOrders: AdminOrder[] = [];
  loading = true;
  currentAdmin: any = null;
  statusFilter = 'all';
  searchTerm = '';

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentAdmin = this.authService.getCurrentAdmin();
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.adminService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesStatus = this.statusFilter === 'all' || order.paymentStatus === this.statusFilter;
      const matchesSearch = !this.searchTerm ||
        order.buyerName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.foodId.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }

  onStatusFilterChange(status: string) {
    this.statusFilter = status;
    this.applyFilters();
  }

  onSearchChange(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    this.adminService.updateOrderStatus(orderId, newStatus).subscribe({
      next: (updatedOrder) => {
        // Update the order in the local array
        const index = this.orders.findIndex(order => order._id === orderId);
        if (index !== -1) {
          this.orders[index] = updatedOrder;
          this.applyFilters();
        }
      },
      error: (error) => {
        console.error('Error updating order status:', error);
        alert('Failed to update order status. Please try again.');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'pending': return 'status-pending';
      case 'cancelled': return 'status-cancelled';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  navigateTo(section: string) {
    this.router.navigate(['/admin', section]);
  }
}
