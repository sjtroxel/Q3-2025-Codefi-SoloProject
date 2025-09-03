export interface Meetup {
  id: number;
  activity: 'run' | 'bicycle';
  start_date_time: string;
  end_date_time: string;
  guests: number;
  user_id: number;
  location?: Location;
}
