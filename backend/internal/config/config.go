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
	FrontendURL		 string
	EnableWorkers	 bool
	AppEnv			 string
	DodoEnvironment  string
	DodoAPIKey			 string
	DodoWebhookSecret	 string
	DodoStarterProductID string
	DodoProProductID	 string
	DodoSuccessURL		 string
	EmailFrom		string
	ResendAPIKey	string
}

func LoadConfig() *Config {
	env :=
		os.Getenv(
			"APP_ENV",
		)

	if env == "" {
		env = "development"
	}
	if os.Getenv("DOCKER_ENV") != "true"{
	
		var err error
	
		switch env {
	
		case "production":
	
			err =
				godotenv.Load(
					".env.production",
				)
	
		case "test":
	
			err =
				godotenv.Load(
					".env.test",
				)
	
		default:
	
			err =
				godotenv.Load(
					".env.development",
				)
		}
		if err != nil {
			log.Println(
				"env file not found:",
				err,
			)
		}
	}
	return &Config{
		PostgresUser:    	 	MustGetEnv("POSTGRES_USER"),
		PostgresPassword: 		MustGetEnv("POSTGRES_PASSWORD"),
		PostgresDB:       		MustGetEnv("POSTGRES_DB"),
		PostgresPort:     		MustGetEnv("POSTGRES_PORT"),
		PostgresSSLMode:  		MustGetEnv("POSTGRES_SSLMODE"),
		PostgresHost:     		MustGetEnv("POSTGRES_HOST"),
		ServerPort:       		MustGetEnv("PORT"),
		RedisPort:        		MustGetEnv("REDIS_PORT"),
		RedisHost:        		MustGetEnv("REDIS_HOST"),
		RedisPassword:    		MustGetEnv("REDIS_PASSWORD"),
		JWTSecret:        		MustGetEnv("JWT_SECRET"),
		JWTExpiration:    		MustGetEnv("JWT_EXPIRATION"),
		BaseURL:          		MustGetEnv("BASE_URL"),
		FrontendURL:      		MustGetEnv("FRONTEND_URL"),
		EnableWorkers:    		MustGetEnv("ENABLE_WORKERS") == "true",
		DodoEnvironment: 		MustGetEnv("DODO_ENVIRONMENT"),
		DodoAPIKey:       		MustGetEnv("DODO_API_KEY"),
		DodoWebhookSecret: 		MustGetEnv("DODO_WEBHOOK_SECRET"),
		DodoStarterProductID: 	MustGetEnv("DODO_STARTER_PRODUCT_ID"),
		DodoProProductID:     	MustGetEnv("DODO_PRO_PRODUCT_ID"),
		DodoSuccessURL:       	MustGetEnv("DODO_SUCCESS_URL"),
		EmailFrom:				MustGetEnv("EMAIL_FROM"),
		ResendAPIKey:			MustGetEnv("RESEND_API_KEY"),
		AppEnv:           		env,
	}
}