import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Meetup } from '../../shared/models/meetup';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MeetupService {
  private readonly apiUrl = `${environment.apiUrl}/meetups`;

  constructor(private http: HttpClient) {}

  // Signals
  private meetupsSignal = signal<Meetup[]>([]);
  private meetupToEditSignal = signal<Meetup | null>(null);
  private loadingSignal = signal<boolean>(false);

  // Exposed signals
  meetups = this.meetupsSignal.asReadonly();
  meetupToEdit = this.meetupToEditSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();

  // Setters
  setMeetupToEdit(meetup: Meetup) {
    this.meetupToEditSignal.set(meetup);
  }

  clearMeetupToEdit() {
    this.meetupToEditSignal.set(null);
  }

  // Load meetups from API
  loadMeetups() {
    this.loadingSignal.set(true);
    this.http.get<Meetup[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.meetupsSignal.set(data);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error loading meetups:', err);
        this.loadingSignal.set(false);
      },
    });
  }

  // Add / Update / Delete
  addMeetup(newMeetup: Meetup) {
    this.http.post<Meetup>(this.apiUrl, newMeetup).subscribe({
      next: (created) => {
        this.meetupsSignal.update((current) => [...current, created]);
      },
      error: (err) => console.error('Error adding meetup:', err),
    });
  }

  updateMeetup(updatedMeetup: Meetup) {
    this.http.put<Meetup>(`${this.apiUrl}/${updatedMeetup.id}`, updatedMeetup).subscribe({
      next: (saved) => {
        this.meetupsSignal.update((current) =>
          current.map((m) => (m.id === saved.id ? saved : m))
        );
      },
      error: (err) => console.error('Error updating meetup:', err),
    });
  }

  deleteMeetup(id: number) {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.meetupsSignal.update((current) => current.filter((m) => m.id !== id));
      },
      error: (err) => console.error('Error deleting meetup:', err),
    });
  }
}
