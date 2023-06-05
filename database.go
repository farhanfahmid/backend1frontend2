package main

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

// Define your database connection information
const (
	dbDriver   = "mysql"
	dbUser     = "farhanfahmid"
	dbPassword = "rootpassword2"
	dbName     = "rankapi"
)

// RetrieveUser retrieves user data from the database based on user ID
func RetrieveUser(userID int64) (*User, error) {
	db, err := sql.Open(dbDriver, dbUser+":"+dbPassword+"@/"+dbName)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Retrieve user data from the database based on the provided user ID
	query := "SELECT id, first_name, last_name, country, profile_picture FROM users WHERE id = ?"
	row := db.QueryRow(query, userID)

	user := &User{}
	err = row.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Country, &user.ProfilePicture)
	if err != nil {
		return nil, err
	}

	return user, nil
}

// CalculateTotalPoints calculates the total points accumulated by each user
func CalculateTotalPoints() ([]*User, error) {
	db, err := sql.Open(dbDriver, dbUser+":"+dbPassword+"@/"+dbName)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Calculate total points for each user and return the results
	query := `
		SELECT users.id, users.first_name, users.last_name, users.country, users.profile_picture, SUM(activities.points) AS total_points
		FROM users
		JOIN activity_logs ON users.id = activity_logs.user_id
		JOIN activities ON activity_logs.activity_id = activities.id
		GROUP BY users.id, users.first_name, users.last_name, users.country, users.profile_picture
		ORDER BY total_points DESC
	`

	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []*User{}
	for rows.Next() {
		user := &User{}
		err = rows.Scan(&user.ID, &user.FirstName, &user.LastName, &user.Country, &user.ProfilePicture, &user.TotalPoints)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}
