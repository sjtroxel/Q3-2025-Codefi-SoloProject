import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Meetup } from '../../shared/models/meetup';
import { Location } from '../../shared/models/location';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private readonly apiUrl = `${environment.apiUrl}/meetups`;

  constructor(private http: HttpClient) {}

  // Get all meetups
  getAllMeetups(): Observable<Meetup[]> {
    return this.http.get<Meetup[]>(this.apiUrl);
  }

  // Get a single meetup by ID
  getMeetup(id: number): Observable<Meetup> {
    return this.http.get<Meetup>(`${this.apiUrl}/${id}`);
  }

  // Create a new meetup
  createMeetup(meetup: Partial<Meetup>): Observable<Meetup> {
    return this.http.post<Meetup>(this.apiUrl, meetup);
  }

  // Update an existing meetup
  updateMeetup(id: number, meetup: Partial<Meetup>): Observable<Meetup> {
    return this.http.put<Meetup>(`${this.apiUrl}/${id}`, meetup);
  }

  // Delete a meetup
  deleteMeetup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Optional: Join a meetup
  joinMeetup(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/join`, {});
  }

  // Optional: Leave a meetup
  leaveMeetup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/leave`);
  }
}
