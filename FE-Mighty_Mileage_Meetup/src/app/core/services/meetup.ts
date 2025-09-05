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

  // --- Helper to ensure iterable ---
  private ensureArray(data: any): Meetup[] {
    return Array.isArray(data) ? data : [];
  }

  // Load meetups from API
  loadMeetups() {
    this.loadingSignal.set(true);
    this.http.get<any>(this.apiUrl).subscribe({
      next: (data) => {
        // Ensure we always store an array
        this.meetupsSignal.set(this.ensureArray(data));
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error loading meetups:', err);
        this.meetupsSignal.set([]); // fallback
        this.loadingSignal.set(false);
      },
    });
  }

  // Add a new meetup
  addMeetup(newMeetup: Meetup) {
    this.http.post<any>(this.apiUrl, newMeetup).subscribe({
      next: (created) => {
        const current = this.ensureArray(this.meetupsSignal());
        this.meetupsSignal.set([...current, created]);
      },
      error: (err) => console.error('Error adding meetup:', err),
    });
  }

  // Update existing meetup
  updateMeetup(updatedMeetup: Meetup) {
    this.http.put<any>(`${this.apiUrl}/${updatedMeetup.id}`, updatedMeetup).subscribe({
      next: (saved) => {
        const current = this.ensureArray(this.meetupsSignal());
        this.meetupsSignal.set(
          current.map((m) => (m.id === saved.id ? saved : m))
        );
      },
      error: (err) => console.error('Error updating meetup:', err),
    });
  }

  // Delete a meetup
  deleteMeetup(id: number) {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        const current = this.ensureArray(this.meetupsSignal());
        this.meetupsSignal.set(current.filter((m) => m.id !== id));
      },
      error: (err) => console.error('Error deleting meetup:', err),
    });
  }
}
