package email

import (
	"bytes"
	"context"
	"fmt"
	"html/template"
	texttemplate "text/template"

	"github.com/resend/resend-go/v2"
)

type ResendService struct {
	client *resend.Client

	from string

	htmlTemplates *template.Template

	textTemplates *texttemplate.Template
}

func NewResendService(
	apiKey string,
	from string,
) (*ResendService, error) {

	htmlTemplates, err := template.ParseFS(
		templateFS,
		"templates/*.html",
	)	
	if err != nil {
		return nil, err
	}

	textTemplates, err := texttemplate.ParseFS(
		templateFS,
		"templates/*.txt",
	)
	if err != nil {
		return nil, err
	}

	return &ResendService{
		client: resend.NewClient(apiKey),

		from: from,

		htmlTemplates: htmlTemplates,

		textTemplates: textTemplates,
	}, nil
}

func (s *ResendService) SendPasswordResetEmail(
	ctx context.Context,
	request PasswordResetRequest,
) error {

	var html bytes.Buffer

	if err := s.htmlTemplates.ExecuteTemplate(
		&html,
		"reset_password.html",
		request,
	); err != nil {
		return err
	}

	var text bytes.Buffer

	if err := s.textTemplates.ExecuteTemplate(
		&text,
		"reset_password.txt",
		request,
	); err != nil {
		return err
	}

	subject := "Reset your Rift password"

	return s.send(
		ctx,
		request.To,
		subject,
		html.String(),
		text.String(),
	)
}

func (s *ResendService) send(
	ctx context.Context,
	to string,
	subject string,
	html string,
	text string,
) error {

	params := &resend.SendEmailRequest{

		From: s.from,

		To: []string{
			to,
		},

		Subject: subject,

		Html: html,

		Text: text,

		ReplyTo: "support@rift.dpdns.org",

	}

	_, err := s.client.Emails.SendWithContext(
		ctx,
		params,
	)

	if err != nil {
		return fmt.Errorf(
			"send email: %w",
			err,
		)
	}

	return nil
}

func (s *ResendService) SendEmailVerificationEmail(
	ctx context.Context,
	req EmailVerificationRequest,
) error {

	var html bytes.Buffer

	if err := s.htmlTemplates.ExecuteTemplate(
		&html,
		"verify_email.html",
		req,
	); err != nil {
		return err
	}

	var text bytes.Buffer

	if err := s.textTemplates.ExecuteTemplate(
		&text,
		"verify_email.txt",
		req,
	); err != nil {
		return err
	}

	subject := "Verify your Rift email address"

	return s.send(
		ctx,
		req.To,
		subject,
		html.String(),
		text.String(),
	)
}