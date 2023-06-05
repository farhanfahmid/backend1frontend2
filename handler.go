package main

import (
	"encoding/json"
	"log"
	"net/http"
)

// LeaderboardEntry represents a leaderboard entry
type LeaderboardEntry struct {
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
	Country        string `json:"country"`
	ProfilePicture string `json:"profile_picture"`
	TotalPoints    int64  `json:"total_points"`
	Rank           int    `json:"rank"`
}

// LeaderboardHandler handles the leaderboard API endpoint
func LeaderboardHandler(w http.ResponseWriter, r *http.Request) {
	// Retrieve the leaderboard data
	users, err := CalculateTotalPoints()
	if err != nil {
		log.Println("Failed to retrieve leaderboard data:", err)
		http.Error(w, "Failed to retrieve leaderboard data", http.StatusInternalServerError)
		return
	}

	// Generate rankings based on the total points
	rankings := make([]*LeaderboardEntry, len(users))
	for i, user := range users {
		rankings[i] = &LeaderboardEntry{
			FirstName:      user.FirstName,
			LastName:       user.LastName,
			Country:        user.Country,
			ProfilePicture: user.ProfilePicture,
			TotalPoints:    user.TotalPoints,
			Rank:           i + 1,
		}
	}

	// Set the response content type to JSON
	w.Header().Set("Content-Type", "application/json")

	// Encode the rankings as JSON and write it to the response
	err = json.NewEncoder(w).Encode(rankings)
	if err != nil {
		log.Println("Failed to encode leaderboard data:", err)
		http.Error(w, "Failed to encode leaderboard data", http.StatusInternalServerError)
		return
	}
}
