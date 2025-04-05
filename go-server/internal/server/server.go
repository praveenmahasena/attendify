package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/praveenmahasena/attendify/internal/server/handlers"
)

type Addr string

type Server struct {
	ListenAddr Addr // I dont need to make this one to be GLOBAL
}

func New(addr Addr) *Server {
	return &Server{
		addr,
	}
}

func (s *Server) Run(ctx context.Context, h *handlers.Handlers, errch chan error) {
	mux := http.NewServeMux()

	mux.HandleFunc("POST /admin/login", h.AdminLogin)

	ser := http.Server{
		Addr:    string(s.ListenAddr),
		Handler: HandleCors(mux),
	}

	go func() {
		if err := ser.ListenAndServe(); err != nil {
			errch <- fmt.Errorf("error during server events %v", err)
		}
	}()

	<-ctx.Done()
	cttx, cancel := context.WithTimeout(context.Background(), time.Duration(10)*time.Minute)
	cancel()

	if err := ser.Shutdown(cttx); err != nil {
		errch <- fmt.Errorf("error during shutting down event %v", err)
		return
	}
}

func HandleCors(next http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", " Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK) // no no debug
			return
		}
		next.ServeHTTP(w, r)
	}
}
