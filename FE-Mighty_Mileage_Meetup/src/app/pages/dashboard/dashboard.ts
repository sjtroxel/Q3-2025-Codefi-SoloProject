import { Component, inject, OnInit, signal } from '@angular/core';
import { MeetupService } from '../../core/services/meetup';
import { Meetup } from '../../shared/models/meetup';
import { Location } from '../../shared/models/location';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})

export class DashboardComponent implements OnInit {
  meetupService = inject(MeetupService);

  meetups = signal<Meetup[]>([]);
  loading = signal(true);

  showModal = signal(false);
  meetupToEdit = signal<Meetup | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.loadMeetups();
  }

  loadMeetups(): void {
    this.loading.set(true);
    this.meetupService.getAllMeetups().subscribe({
      next: (data) => {
        this.meetups.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error fetching meetups', err);
        this.loading.set(false);
      }
    });
  }

  openModal(meetup?: Meetup): void {
    if (meetup) {
      this.meetupToEdit.set(meetup);
    } else {
      this.meetupToEdit.set(null);
    }
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.meetupToEdit.set(null);
  }

  deleteMeetup(meetupId: number): void {
    this.meetupService.deleteMeetup(meetupId).subscribe(() => {
      this.meetups.set(this.meetups().filter(m => m.id !== meetupId));
    });
  }
}
