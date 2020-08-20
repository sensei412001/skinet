import { Router, NavigationExtras } from '@angular/router';
import { IOrder, IOrderToCreate } from './../../shared/models/order';
import { IBasket } from './../../shared/models/basket';
import { ToastrService } from 'ngx-toastr';
import { CheckoutService } from './../checkout.service';
import { BasketService } from '../../basket/basket.service';

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;

  constructor(
      private basketService: BasketService,
      private checkoutSerivce: CheckoutService,
      private router: Router,
      private toastr: ToastrService) { }

  ngOnInit(): void {
  }

  submitOrder() {
    const basket = this.basketService.getCurrentBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkoutSerivce.createOrder(orderToCreate).subscribe((order: IOrder) => {
      this.toastr.success('Order created successfully.');
      this.basketService.deleteLocalBasket(basket.id);

      const navigationExtras: NavigationExtras = { state: order  };
      this.router.navigate(['checkout/success'], navigationExtras);
    }, error => {
      this.toastr.error(error.message);
      console.log(error);
    });
  }

  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };

  }

}
