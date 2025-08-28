class MeetupsController < ApplicationController
    before_action :set_meetup, only: [:show, :update, :destroy]
    before_action :authenticate_request, only: [:create, :update, :destroy]

    def index
        meetups = Meetup.all
        render json: MeetupBlueprint.render(meetups), status: :ok
    end

    def show
        render json: MeetupBlueprint.render(@meetup, view: :extended), status: :ok
    end

    def create
        meetup = @current_user.meetups.build(meetup_params)
        if meetup.save
        render json: MeetupBlueprint.render_as_hash(meetup), status: :created
        else
        render json: { errors: meetup.errors.full_messages }, status: :unprocessable_content
        end
    end

    def update
        if @meetup.user != @current_user
        return render json: { errors: ['Unauthorized'] }, status: :unauthorized
        end

        if @meetup.update(meetup_params)
        render json: MeetupBlueprint.render_as_hash(@meetup), status: :ok
        else
        render json: { errors: @meetup.errors.full_messages }, status: :unprocessable_content
        end
    end

    def destroy
        if @meetup.user != @current_user
        return render json: { errors: ['Unauthorized'] }, status: :unauthorized
        end

        @meetup.destroy
        render json: { message: 'Meetup deleted successfully' }, status: :ok
    end

    private

    def set_meetup
        @meetup = Meetup.find(params[:id])
    rescue ActiveRecord::RecordNotFound
        render json: { errors: ['Meetup not found'] }, status: :not_found
    end

    def meetup_params
        params.require(:meetup).permit(:activity, :start_date_time, :end_date_time, :guests)
    end
end