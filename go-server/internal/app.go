package internal

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv" // I hate using this I wanna make my own env reader fr
	"github.com/praveenmahasena/attendify/internal/postgres"
	"github.com/praveenmahasena/attendify/internal/server"
	"github.com/praveenmahasena/attendify/internal/server/handlers"
)

func Run() error {
	if err := godotenv.Load(); err != nil {
		return fmt.Errorf("error during reading up env file %v", err)
	}

	db, dbErr := postgres.Connect()

	if dbErr != nil {
		return dbErr
	}

	handler := handlers.New(db)

	ser := server.New(":4242")

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel() // I DONT WANT CTX LEAK EMBARASSSING
	errCh := make(chan error)

	go func() {
		ser.Run(ctx, handler, errCh)
	}()

	sigCh := make(chan os.Signal, 1)

	signal.Notify(sigCh, syscall.SIGTERM, syscall.SIGINT)

	select {
	case err := <-errCh:
		if err != nil { // okay WHY am i doing this if check here? cuz what if the error is null but coming when the server being killed with no value? its better to check imo back me up if im wrong
			// I can still handle the shutdown error event here as well
			return fmt.Errorf("error during server activity %v", err)
		}
		return nil
	case <-sigCh:
		fmt.Println("sending signal to kill server....")
		cancel()
	}

	return <-errCh
}
