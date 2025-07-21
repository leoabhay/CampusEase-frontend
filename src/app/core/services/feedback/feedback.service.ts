import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) {

  }

  postFeedbackData(obj: any): Observable<any> {
  return this.http.post(environment.api_url + 'addFeedback', obj)
  }
  getFeedbackData():Observable<any>{
    return this.http.get<any>(environment.api_url+'getFeedbackList')
  }
  getFeedbackByEmail():Observable<any>{
    return this.http.get<any>(environment.api_url+'getFeedbackbyemail')
  }
  getFeedbackbyroleData():Observable<any>{
    return this.http.get<any>(environment.api_url+'getFeedbackbyrole')
  }
  delFeedbackClubList(id:string):Observable<any>{
    return this.http.delete<any>(environment.api_url+(`deleteFeedback/${id}`))
  }
  updateFeedback(id: string, data: any) {
  return this.http.put<any>(environment.api_url + (`updateFeedback/${id}`), data);
}
  AllFeedbackData():Observable<any>{
    return this.http.get<any>(environment.api_url+'getAllFeedback')
  }
}
