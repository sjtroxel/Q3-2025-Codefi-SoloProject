class CreateMeetups < ActiveRecord::Migration[8.0]
  def change
    create_table :meetups do |t|
      t.string :title, limit: 30, null: false
      t.string :activity, null: false
      t.string :location, limit: 30, null: false
      t.datetime :date_time, null: false
      t.text :description
      t.integer :host_id, null: false

      t.timestamps
    end

    # add foreign key so host_id points to a valid user
    add_foreign_key :meetups, :users, column: :host_id
    add_index :meetups, :host_id
  end
end
