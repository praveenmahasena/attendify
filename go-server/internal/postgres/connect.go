package postgres

import (
	"fmt"
	"os"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

const (
	portParam     = "DB_PORT"
	nameParam     = "DB_NAME"
	passwordParam = "DB_PASSWORD"
	sslParam      = "DB_SSL"
	hostParam     = "DB_HOST"
	usrParam      = "DB_USR"
)

func connectionUri() string {
	// I know I should be doing os.LookUpEnv()
	port := os.Getenv(portParam)
	name := os.Getenv(nameParam)
	password := os.Getenv(passwordParam)
	host := os.Getenv(hostParam)
	ssl := os.Getenv(sslParam)
	usr := os.Getenv(usrParam)

	return fmt.Sprintf("host=%v port=%v password=%v sslmode=%v dbname=%v user=%v", host, port, password, ssl, name, usr)
}

func Connect() (*sqlx.DB, error) {
	uri := connectionUri()
	connection, connectionErr := sqlx.Open("postgres", uri)
	if connectionErr != nil {
		return nil, fmt.Errorf("error during connecting to db %v", connectionErr)
	}
	if err := connection.Ping(); err != nil {
		return nil, fmt.Errorf("error during connecting ping %v", err)
	}
	return connection, nil
}
