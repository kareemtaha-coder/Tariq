import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  public contactsSubject = new BehaviorSubject<any[]>([]);

  constructor(private _HtttpClient: HttpClient) {}
  public contacts$ = this.contactsSubject.asObservable();

  getContacts():Observable<any>{
    const token = localStorage!.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this._HtttpClient.get('https://localhost:7181/api/Contacts',{ headers })
  }

  toggleContactStatus(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return this._HtttpClient.put(`https://localhost:7181/api/Contacts/toggle-contact-status/${id}`,{}, { headers });
  }

  contact(contactData: object): Observable<any> {
    return this._HtttpClient.post(
      'https://localhost:7181/api/Contacts',
      contactData
    );
  }


  private isModalOpenSubject = new BehaviorSubject<boolean>(false);
  isModalOpen$ = this.isModalOpenSubject.asObservable();

  /**
   * Opens the contact form modal
   */
  openModal(): void {
    this.isModalOpenSubject.next(true);
  }

  /**
   * Closes the contact form modal
   */
  closeModal(): void {
    this.isModalOpenSubject.next(false);
  }
}
