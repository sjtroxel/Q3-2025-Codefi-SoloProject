class User < ApplicationRecord
    has_secure_password

    # basic presence validations
    validates :first_name, presence: true
    validates :last_name, presence: true
    validates :email, presence: true
    validates :username, presence: true

    # username and email constraints
    validates :username, uniqueness: true, length: { minimum: 3, maximum: 30 }
        validate :validate_username
    validates :email, uniqueness: true, length: { minimum: 5, maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP }

    # password validations
    validates :password, presence: true, length: { minimum: 6 }, format: { 
        with: /\A(?=.*[a-zA-Z])(?=.*\d).+\z/, 
        message: "Password must include at least one letter and one number!"
    }, allow_nil: true

    private
    def validate_username
        unless username =~ /\A[a-zA-Z0-9_]+\Z/
            errors.add(:username, "can only contain letters, numbers, and underscores - and must contain at least one letter or number!")
        end
    end
end
