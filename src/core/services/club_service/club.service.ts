import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClubService {

  constructor(private http:HttpClient) { }
  postAddClub(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'addClub',obj)
  }
  getClubList():Observable<any>{
    return this.http.get<any>(environment.api_url+'getClubList')
  }
  getClubListById(id:string):Observable<any>{
    return this.http.get<any>(environment.api_url+(`getClubList/${id}`))
  }
  updateClubList(id: string, obj: any): Observable<any> {
    return this.http.put(environment.api_url + (`updateClub/${id}`), obj);
  }


  delDeleteClubList(id:string):Observable<any>{
    return this.http.delete<any>(environment.api_url+(`deleteClub/${id}`))
  }
  postJoinClub(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'joinclub',obj)
  }
  getClubListByEmail():Observable<any>{
    return this.http.get<any>(environment.api_url+'getjoinedclubbyemail')
  }
  getJoinedClubbyClubnameApi():Observable<any>{
    return this.http.get<any>(environment.api_url+'getjoinedclubbyclubname')
  }
  updateClubStatus(id: string, decision: string): Observable<any> {
    return this.http.put(environment.api_url + (`joinclubbyid/${id}`), {decision});
  }
}
