import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private http:HttpClient) { }
  login(credentials: { email: string; password: string }) {
    return this.http.post<any>('http://localhost:3200/login', credentials).pipe(
      tap(({ accessToken }) => {
        localStorage.setItem('accessToken', accessToken);
      })
    );
  }

postuserRegister(obj:any):Observable<any>{
  return this.http.post(environment.api_url+'signupUser',obj)
}
postUserSignIn(obj:any):Observable<any>{
  return this.http.post(environment.api_url+'signin',obj)
}
getuserDara():Observable<any>{
  return this.http.get(environment.api_url+'userdata')
}
getuserDataLogin():Observable<any>{
  return this.http.get(environment.api_url+'getuserdata')
}
getTeacherData():Observable<any>{
  return this.http.get(environment.api_url+'user/faculty')
}
getStudentData():Observable<any>{
  return this.http.get(environment.api_url+'user/student')
}
getSecretarytData():Observable<any>{
  return this.http.get(environment.api_url+'user/secretary')
}
getIdCardData():Observable<any>{
  return this.http.get(environment.api_url+'idcard')
}
delTeacherList(id:string):Observable<any>{
  return this.http.delete<any>(environment.api_url+(`deleteTeacher/${id}`))
  // return this.http.delete<any>(environment.api_url+(`userdata/${userId}`))
}
// updateUserProfile(userId: string, formData: any): Observable<any> {
//    return this.http.put(environment.api_url +(`userdata/${userId}`), formData);
// }
saveProfile(userId: string,data: FormData): Observable<any> {
  return this.http.put<any>(environment.api_url+(`userdata/${userId}`), data);
}
getProfile(): Observable<any> {
  return this.http.get<any>(environment.api_url+'profileData')
}
changePassword(userId: string, data: any, options: { headers: HttpHeaders }): Observable<any> {
  return this.http.put(environment.api_url+(`password/${userId}`), data, options);
}


setUserDara(user:any){
  localStorage.setItem('userData',JSON.stringify(user))
}
getUserData(){
  return JSON.parse(localStorage.getItem('userData')||'{}')
}
setUserRole(role: string) {
  localStorage.setItem('userRole', role);
}

getUserRole() {
  return localStorage.getItem('userRole');
}

setUserToken(token: string) {
  localStorage.setItem('userToken', token);
}

getUserToken() {
  return localStorage.getItem('userToken');
}

isLoggedIn(): Observable<boolean> {
  const authToken = localStorage.getItem('userToken');
  return of(!!authToken); // Convert the existence of authToken into a boolean
}
logout() {
  localStorage.removeItem('userData');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userToken');
}

}
