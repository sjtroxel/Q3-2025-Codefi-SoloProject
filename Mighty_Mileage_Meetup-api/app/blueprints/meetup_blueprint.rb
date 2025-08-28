# frozen_string_literal: true

class MeetupBlueprint < Blueprinter::Base
  identifier :id

  fields :activity, :start_date_time, :end_date_time, :guests, :created_at, :updated_at

  association :user, blueprint: UserBlueprint

  association :location, blueprint: LocationBlueprint, if: ->(meetup, _) { meetup.location.present? }

  view :extended do
    association :comments, blueprint: CommentBlueprint
    association :meetup_participants, blueprint: MeetupParticipantBlueprint
  end
end