import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
// The service will interact with the JSON server to validate user data.
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<boolean> {
    return this.http.get<any[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map((users) => {
        if (users.length > 0) {
          // localStorage.setItem('authToken', users[0].authToken); // Save token to localStorage
          localStorage.setItem("connectedUser", JSON.stringify(users[0])); // Save token to localStorage
          return true;
        }
        return false;
      })
    );
  }

  isAuthenticated(): boolean {
    const isConnected = localStorage.getItem('connectedUser');
    return !!isConnected;
  }

  logout(): void {
    localStorage.removeItem('connectedUser');
  }
}
