package handlers

import "github.com/jmoiron/sqlx"

type Handlers struct{
	DB *sqlx.DB
}

func New(db *sqlx.DB)*Handlers{
	return &Handlers{db}
}
