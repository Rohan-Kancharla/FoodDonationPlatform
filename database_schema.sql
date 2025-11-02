-- FoodShare Database Schema

-- Users Table: Stores information about registered users (both donors and recipients)
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    user_type ENUM('donor', 'recipient', 'admin') NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    password_hash VARCHAR(255) DEFAULT 'placeholder_hash',
    profile_image VARCHAR(255),
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Donor Profiles: Additional information specific to donors
CREATE TABLE donor_profiles (
    donor_id INT PRIMARY KEY,
    business_name VARCHAR(100),
    business_type VARCHAR(50),
    average_donation_frequency VARCHAR(50),
    preferred_pickup_times TEXT,
    donation_history TEXT,
    FOREIGN KEY (donor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Recipient Profiles: Additional information specific to recipients
CREATE TABLE recipient_profiles (
    recipient_id INT PRIMARY KEY,
    organization_name VARCHAR(100) NOT NULL,
    organization_type VARCHAR(50) NOT NULL,
    tax_id VARCHAR(50),
    capacity INT,
    requirements TEXT,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Food Donations Table: Records of food donations
CREATE TABLE donations (
    donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT NOT NULL,
    food_type VARCHAR(50) NOT NULL,
    quantity VARCHAR(100) NOT NULL,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    pickup_address TEXT NOT NULL,
    expiration_date DATE,
    description TEXT,
    allergens TEXT,
    storage_requirements VARCHAR(100),
    status ENUM('available', 'claimed', 'completed', 'canceled') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Donation Images: Multiple images can be associated with a donation
CREATE TABLE donation_images (
    image_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE
);

-- Claims Table: Records when a recipient claims a donation
CREATE TABLE claims (
    claim_id INT PRIMARY KEY AUTO_INCREMENT,
    donation_id INT NOT NULL,
    recipient_id INT NOT NULL,
    claim_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pickup_date DATE,
    pickup_time TIME,
    pickup_notes TEXT,
    status ENUM('pending', 'confirmed', 'completed', 'canceled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Financial Donations Table: Records of monetary donations
CREATE TABLE financial_donations (
    financial_donation_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    donation_frequency ENUM('one_time', 'monthly', 'quarterly', 'annually') DEFAULT 'one_time',
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100),
    is_anonymous BOOLEAN DEFAULT FALSE,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Ratings and Reviews: Feedback system for donors and recipients
CREATE TABLE ratings (
    rating_id INT PRIMARY KEY AUTO_INCREMENT,
    reviewer_id INT NOT NULL,
    reviewee_id INT NOT NULL,
    donation_id INT,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE SET NULL
);

-- Messages Table: For internal communication between users
CREATE TABLE messages (
    message_id INT PRIMARY KEY AUTO_INCREMENT,
    sender_id INT NOT NULL,
    recipient_id INT NOT NULL,
    donation_id INT,
    subject VARCHAR(100),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (recipient_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (donation_id) REFERENCES donations(donation_id) ON DELETE SET NULL
);

-- Notifications Table: System notifications for users
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    related_id INT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Subscription Table: For newsletter subscribers
CREATE TABLE subscriptions (
    subscription_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100),
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- FAQ Table: For frequently asked questions
CREATE TABLE faqs (
    faq_id INT PRIMARY KEY AUTO_INCREMENT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(50),
    display_order INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Impact Metrics Table: For tracking impact statistics
CREATE TABLE impact_metrics (
    metric_id INT PRIMARY KEY AUTO_INCREMENT,
    metric_name VARCHAR(100) NOT NULL,
    metric_value INT NOT NULL,
    metric_date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for performance optimization
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_donor ON donations(donor_id);
CREATE INDEX idx_claims_recipient ON claims(recipient_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_type ON users(user_type);