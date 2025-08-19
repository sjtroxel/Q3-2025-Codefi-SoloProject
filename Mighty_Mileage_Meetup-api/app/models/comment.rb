class Comment < ApplicationRecord
  validates :content, presence: true, length: { maximum: 2000 }
  belongs_to :user
  belongs_to :meetup
end
