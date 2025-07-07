import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DiscussionService {

  constructor(private http:HttpClient) { }


  postDiscussion(obj:any):Observable<any>{
    return this.http.post(environment.api_url+'discussion',obj)
  }
  getdiscussionData():Observable<any>{
    return this.http.get<any>(environment.api_url+'getdiscussion')
  }
  getdiscussionDataById(id:String):Observable<any>{
    return this.http.get<any>(environment.api_url+(`discussion/${id}`))
  }
  deleteDiscussion(id:string):Observable<any>{
    return this.http.delete(environment.api_url+(`discussion/${id}`))
  }
  editDiscussion(id: string, obj: any): Observable<any> {
    return this.http.put(environment.api_url + 'discussion/' + id, obj);
  }
  updateDiscussion(id: string, obj: any): Observable<any> {
    return this.http.put(environment.api_url + (`discussion/${id}`), obj);
  }
}
