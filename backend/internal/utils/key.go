package utils

import (
	"crypto/rand"
	"math/big"
)

const (
	charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	DefaultKeySize = 12
	
) 

func GeneratePublicKey() (string, error) {

	result := make([]byte, DefaultKeySize)

	for i := range result {

		num, err := rand.Int(
			rand.Reader,
			big.NewInt(
				int64(len(charset)),
			),
		)

		if err != nil {
			return "", err
		}

		result[i] = charset[num.Int64()]
	}

	return string(result), nil
}