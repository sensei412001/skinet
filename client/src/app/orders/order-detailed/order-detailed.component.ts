import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrdersService } from './../orders.service';
import { IOrder } from './../../shared/models/order';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-detailed',
  templateUrl: './order-detailed.component.html',
  styleUrls: ['./order-detailed.component.scss']
})
export class OrderDetailedComponent implements OnInit {
  order: IOrder;

  constructor(
    private orderService: OrdersService,
    private breadCrumbService: BreadcrumbService, private route: ActivatedRoute) {
      this.breadCrumbService.set('@OrderDetailed', '');
    }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderService.getOrderDetailed(id).subscribe((order: IOrder) => {
      this.order = order;
      this.breadCrumbService.set('@OrderDetailed', `Order# ${order.id} - ${order.status}`);
    }, error => {
      console.log(error);
    });
  }

}
