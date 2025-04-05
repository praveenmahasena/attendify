package types

type AdminLogin struct {
	Email    string `json:"email" db:"email"`
	Password string `json:"password" db:"password"`
}
