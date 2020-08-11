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
  @ViewChild('search', {static: true }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IBrand[];
  types: IProductType[];
  shopParams = new ShopParams();
  totalCount: number;
  sortOptions = [
    { name: 'Alphabetical', value: 'name'},
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProduts();
    this.getBrands();
    this.getProductTypes();
  }

  getProduts() {
    this.shopService
      .getProducts(this.shopParams)
      .subscribe(resp => {
      this.products = resp.data;
      this.shopParams.pageNumber = resp.pageIndex;
      this.shopParams.pageSize = resp.pageSize;
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
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProduts();
  }

  onTypeIdSelected(typeId: number) {
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProduts();
  }

  onSortSelected(sort: string) {
    this.shopParams.sort = sort;
    this.getProduts();
  }

  onPageChanged(event: any) {
    if (this.shopParams.pageNumber !== event)
    {
      this.shopParams.pageNumber = event;
      this.getProduts();
    }
  }

  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProduts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProduts();
  }

}
