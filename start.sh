#!/bin/bash

# Start the backend server
echo "Starting backend server..."
cd backend
npm install
npm start &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start the frontend server
echo "Starting frontend server..."
cd ../frontend
npm install
npm start &
FRONTEND_PID=$!

echo "Both servers are starting..."
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Press Ctrl+C to stop both servers"

# Function to kill both processes when script is terminated
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit 0
}

trap cleanup SIGINT SIGTERM

# Keep the script running
wait
