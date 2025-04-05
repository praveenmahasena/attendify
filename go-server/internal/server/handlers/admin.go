package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/praveenmahasena/attendify/internal/types"
)

func (h *Handlers)AdminLogin(w http.ResponseWriter, r *http.Request){
	a:=new(types.AdminLogin)
	json.NewDecoder(r.Body).Decode(&a)
}
