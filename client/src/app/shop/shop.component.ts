import { ShopParams } from './../shared/models/shopParams';
import { IProductType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', {static: false }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IProductType[];
  shopParams: ShopParams;
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name'},
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProduts(true);
    this.getBrands();
    this.getProductTypes();
  }

  getProduts(useCache = false) {
    this.shopService
      .getProducts(useCache)
      .subscribe(resp => {
      this.products = resp.data;
      this.totalCount = resp.count;
    }, error => {
      console.log(error);
    });
  }

  getBrands() {
    this.shopService.getBrands().subscribe(resp => {
      this.brands = [{ id: 0, name: 'All'}, ... resp];
    }, error => {
      console.log(error);
    });
  }

  getProductTypes() {
    this.shopService.getProductTypes().subscribe(resp => {
      this.types = [{ id: 0, name: 'All'}, ... resp];
    }, error => {
      console.log(error);
    });
  }

  onBrandSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.brandId = brandId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProduts();
  }

  onTypeIdSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.typeId = typeId;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProduts();
  }

  onSortSelected(sort: string) {
    const params = this.shopService.getShopParams();
    params.sort = sort;
    this.shopService.setShopParams(params);
    this.getProduts();
  }

  onPageChanged(event: any) {
    const params = this.shopService.getShopParams();
    if (params.pageNumber !== event)
    {
      params.pageNumber = event;
      this.shopService.setShopParams(params);
      this.getProduts(true);
    }
  }

  onSearch() {
    const params = this.shopService.getShopParams();
    params.search = this.searchTerm.nativeElement.value;
    params.pageNumber = 1;
    this.shopService.setShopParams(params);
    this.getProduts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopService.setShopParams(this.shopParams);
    this.getProduts();
  }

}
