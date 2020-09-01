import { environment } from './../../environments/environment';
import { Pagination } from './../shared/models/pagination';
import { IProductType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  brands: IBrand[] = [];
  types: IProductType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();

  constructor(private http: HttpClient) { }

  getProducts(useCache: boolean) {
    if (useCache === false) {
      this.products = [];
    }

    if (this.products.length > 0 && useCache === true) {
      const pagesReceived = Math.ceil(this.products.length / this.shopParams.pageSize);

      if (this.shopParams.pageNumber <= pagesReceived) {
        this.pagination.data = this.products.slice(
          (this.shopParams.pageNumber - 1) * this.shopParams.pageSize,
          (this.shopParams.pageNumber * this.shopParams.pageSize)
        );

        return of(this.pagination);
      }
    }

    let params = new HttpParams();
    const brandId = this.shopParams.brandId;
    const typeId = this.shopParams.typeId;
    const sort = this.shopParams.sort;
    const pageNumber = this.shopParams.pageNumber.toString();
    const pageSize = this.shopParams.pageSize.toString();
    const search = this.shopParams.search;

    if (brandId !== 0) {
      params = params.append('brandId', brandId.toString());
    }
    if (typeId !== 0) {
      params = params.append('typeId', typeId.toString());
    }
    if (search) {
      params = params.append('search', search);
    }

    params = params.append('sort', sort);
    params = params.append('pageIndex', pageNumber);
    params = params.append('pageIndex', pageSize);

    return this.http.get<IPagination>(
      this.baseUrl + 'products', { observe: 'response', params }
    ).pipe(
      map(resp => {
        this.products = [...this.products, ...resp.body.data];
        this.pagination = resp.body;
        return this.pagination;
      })
    );
  }

  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    const product = this.products.find(p => p.id === id);

    if (product) {
      return of(product);
    }

    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands').pipe(
      map(response => {
        this.brands = response;
        return response;
      })
    );
  }

  getProductTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IProductType[]>(this.baseUrl + 'products/types').pipe(
      map(response => {
        this.types = response;
        return response;
      })
    );
  }
}
