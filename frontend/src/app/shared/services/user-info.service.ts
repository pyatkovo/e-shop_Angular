import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {UserInfoType} from "../../../types/userInfo.type";


@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  constructor(private http: HttpClient) {
  }

  updateUserInfo(params: UserInfoType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'user', params)
  }

  getUserInfo(): Observable<DefaultResponseType | UserInfoType>{
    return  this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'user')
  }



}
