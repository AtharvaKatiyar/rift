package auth

type RegisterRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required,min=8"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ForgotPasswordRequest struct {
	Email	string	`json:"email" binding:"required,email"`
}

type ResetPasswordRequest struct {
	Token	string	`json:"token" binding:"required"`
	Password string `json:"password" binding:"required,min=8,max=128"`
}

type SendVerificationEmailRequest struct {
	Email string `json:"email" binding:"required,email"`
}

type VerifyEmailRequest struct {
	Token string `json:"token" binding:"required"`
}