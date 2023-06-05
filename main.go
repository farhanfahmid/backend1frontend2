package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	// Create a new router instance
	router := mux.NewRouter()

	// Enable CORS
	router.Use(enableCors)

	// Define your API routes and their corresponding handlers
	router.HandleFunc("/leaderboard", LeaderboardHandler).Methods("GET")

	// Initialize the HTTP server
	server := &http.Server{
		Addr:    ":8080",
		Handler: router,
	}

	// Start the server
	log.Fatal(server.ListenAndServe())
}

// enableCors is a middleware function to enable CORS headers
func enableCors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Access-Control-Max-Age", "86400")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
