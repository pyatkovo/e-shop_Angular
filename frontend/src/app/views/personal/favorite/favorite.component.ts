import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {FavoriteType} from "../../../../types/favorite.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {environment} from "../../../../environments/environment";
import {CartService} from "../../../shared/services/cart.service";
import {CartType} from "../../../../types/cart.type";
import {ProductType} from "../../../../types/product.type";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit {

  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;
  cartData: CartType | null = null;
  count: number = 1;

  constructor(private favoriteServices: FavoriteService, private cartService: CartService) {
  }

  ngOnInit(): void {
    this.favoriteServices.getFavorites()
      .subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          const error = (data as DefaultResponseType).message;
          throw new Error(error);
        }
        const favorites = data as FavoriteType[];

        // Теперь загружаем корзину
        this.cartService.getCart()
          .subscribe((cartData: CartType | DefaultResponseType) => {
            if ((cartData as DefaultResponseType).error !== undefined) {
              throw new Error((cartData as DefaultResponseType).message);
            }

            const cart = cartData as CartType;

            // Проставим countInCart для каждого товара
            this.products = favorites.map(product => {
              const cartItem = cart.items.find(item => item.product.id === product.id);
              if(cartItem){
                return {
                  ...product,
                  countInCart: cartItem.quantity
                };
              }
              return product

            });
            console.log(this.products)
            this.cartData = cart;
          });
      });
  }


  removeFromFavorites(id: string) {
    this.favoriteServices.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) {
          throw new Error(data.message);
        }
        this.products = this.products.filter(item => item.id !== id);
      })
  }

  updateCount(value: number, product: FavoriteType) {
    this.cartService.updateCart(product.id, value)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.countInCart = value;
      });
  }


  addToCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.countInCart = 1; // <- добавляем сюда
      });
  }

  removeFromCart(product: FavoriteType){
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if((data as DefaultResponseType).error !== undefined){
          throw new Error((data as DefaultResponseType).message);
        }
        product.countInCart = 0;
      });
  }

}
