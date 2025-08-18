class User < ApplicationRecord
    has_secure_password

    # basic presence validations
    validates :first_name, presence: true
    validates :last_name, presence: true
    validates :email, presence: true
    validates :username, presence: true

    # username and email constraints
    validates :username, uniqueness: true, length: { maximum: 30 }
    validates :email, uniqueness: true, length: { maximum: 255 }, format: { with: URI::MailTo::EMAIL_REGEXP }

    # password validations
    validates :password, presence: true, length: { minimum: 6 }, format: { 
        with: /\A(?=.*[a-zA-Z])(?=.*\d).+\z/, 
        message: "Password must include at least one letter and one number!"
    }, allow_nil: true
end
