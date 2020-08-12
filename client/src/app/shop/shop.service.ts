import { IProductType } from './../shared/models/productType';
import { IBrand } from './../shared/models/brand';
import { IPagination } from '../shared/models/pagination';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ShopParams } from '../shared/models/shopParams';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';

  constructor(private http: HttpClient) { }

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    const brandId = shopParams.brandId;
    const typeId = shopParams.typeId;
    const sort = shopParams.sort;
    const pageNumber = shopParams.pageNumber.toString();
    const pageSize = shopParams.pageSize.toString();
    const search = shopParams.search;

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
        return resp.body;
      })
    );
  }

  getProduct(id: number) {
    return this.http.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands() {
    return this.http.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getProductTypes() {
    return this.http.get<IProductType[]>(this.baseUrl + 'products/types');
  }
}
