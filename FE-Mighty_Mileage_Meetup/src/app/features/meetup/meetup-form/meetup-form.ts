import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MeetupService } from '../../../core/services/meetup';
import { Meetup } from '../../../shared/models/meetup';

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

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      activity: ['run', Validators.required],
      start_date_time: ['', Validators.required],
      end_date_time: ['', Validators.required],
      guests: [1, [Validators.required, Validators.min(1)]]
    });

    // Effect to patch form when a meetup is set to edit
    effect(() => {
      const editingMeetup = this.meetupService.meetupToEdit();
      if (editingMeetup) {
        this.form.patchValue(editingMeetup);
      }
    });
  }

  onSubmit() {
    const formData = this.form.value;
    const editing = this.meetupService.meetupToEdit();

    if (editing) {
      // Update existing meetup
      const updatedMeetup: Meetup = {
        ...editing,
        ...formData
      };
      this.meetupService.updateMeetup(updatedMeetup);
      this.meetupService.clearMeetupToEdit();
    } else {
      // Create new meetup
      const newMeetup: Meetup = {
        id: Date.now(), // temp ID
        ...formData,
        user_id: 1 // replace with actual logged-in user later
      };
      this.meetupService.addMeetup(newMeetup);
    }

    this.form.reset();
    console.log('Meetup submitted');
  }
}
