package config

import (
	"log"
	"os"
	"github.com/joho/godotenv"
)

type Config struct {
	PostgresUser     string
	PostgresPassword string
	PostgresDB       string
	PostgresPort     string
	PostgresSSLMode  string
	PostgresHost	 string
	ServerPort       string
	RedisPort        string
	RedisHost        string
	RedisPassword    string
	JWTSecret        string
	JWTExpiration    string
	BaseURL			 string
	AppEnv			 string
}

func LoadConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env not found")
	}
	return &Config{
		PostgresUser:     os.Getenv("POSTGRES_USER"),
		PostgresPassword: os.Getenv("POSTGRES_PASSWORD"),
		PostgresDB:       os.Getenv("POSTGRES_DB"),
		PostgresPort:     os.Getenv("POSTGRES_PORT"),
		PostgresSSLMode:  os.Getenv("POSTGRES_SSLMODE"),
		PostgresHost:     os.Getenv("POSTGRES_HOST"),
		ServerPort:       os.Getenv("PORT"),
		RedisPort:        os.Getenv("REDIS_PORT"),
		RedisHost:        os.Getenv("REDIS_HOST"),
		RedisPassword:    os.Getenv("REDIS_PASSWORD"),
		JWTSecret:        os.Getenv("JWT_SECRET"),
		JWTExpiration:    os.Getenv("JWT_EXPIRATION"),
		BaseURL:          os.Getenv("BASE_URL"),
		AppEnv:           os.Getenv("APP_ENV"),
	}
}