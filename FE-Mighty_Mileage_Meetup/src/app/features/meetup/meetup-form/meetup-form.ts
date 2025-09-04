import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MeetupService } from '../../../core/services/meetup';
import { Meetup } from '../../../shared/models/meetup';
import { Location } from '../../../shared/models/location';

@Component({
  selector: 'app-meetup-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meetup-form.html',
  styleUrl: './meetup-form.scss'
})
export class MeetupFormComponent {
  meetupService = inject(MeetupService);
  form: FormGroup;

  // ✅ Predefined activities array
  activities = ['run', 'bicycle'];

  // ✅ Add a locations signal - TEMPORARY DUMMY DATA - use third-party API for final??!!
  locations = signal<Location[]>([
    {
      id: 1,
      city: 'Austin',
      state: 'TX',
      address: '123 Main St',
      zip_code: '78701',
      country: 'USA'
    },
    {
      id: 2,
      city: 'Chicago',
      state: 'IL',
      address: '456 Oak Ave',
      zip_code: '60601',
      country: 'USA'
    }
  ]);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      activity: ['run', Validators.required],
      start_date_time: ['', Validators.required],
      end_date_time: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]],
      location: [null, Validators.required]
    });

    // Effect to patch form when a meetup is set to edit
    effect(() => {
      const editingMeetup = this.meetupService.meetupToEdit();
      if (editingMeetup) {
        this.form.patchValue({
          ...editingMeetup,
          location: editingMeetup.location || null
        });
      }
    });
  }

  onSubmit() {
    const formData = this.form.value;
    const editing = this.meetupService.meetupToEdit();

    if (editing) {
      const updatedMeetup: Meetup = { ...editing, ...formData };
      this.meetupService.updateMeetup(updatedMeetup);
      this.meetupService.clearMeetupToEdit();
    } else {
      const newMeetup: Meetup = { id: Date.now(), ...formData, user_id: 1 };
      this.meetupService.addMeetup(newMeetup);
    }

    this.form.reset();
    console.log('Meetup submitted');
  }
}
