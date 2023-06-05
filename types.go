package main

// User represents a user record in the database
type User struct {
	ID             int64  `json:"id"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	Country        string `json:"country"`
	ProfilePicture string `json:"profile_picture"`
	TotalPoints    int64  `json:"total_points"`
}

// ActivityLog represents an activity log record in the database
type ActivityLog struct {
	ID         int64  `json:"id"`
	UserID     int64  `json:"user_id"`
	ActivityID int64  `json:"activity_id"`
	LoggedAt   string `json:"logged_at"`
}

// Activity represents an activity record in the database
type Activity struct {
	ID    int64 `json:"id"`
	Point int64 `json:"point"`
}
