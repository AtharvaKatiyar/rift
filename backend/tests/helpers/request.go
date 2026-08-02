package helpers

import (
	"bytes"
	"encoding/json"
	"net/http"
)

func JSONRequest(
	method string,
	url string,
	body interface{},
) (*http.Request, error) {

	jsonBody, err :=
		json.Marshal(
			body,
		)

	if err != nil {
		return nil, err
	}

	req, err :=
		http.NewRequest(
			method,
			url,
			bytes.NewBuffer(
				jsonBody,
			),
		)

	if err != nil {
		return nil, err
	}

	req.Header.Set(
		"Content-Type",
		"application/json",
	)

	return req, nil
}
