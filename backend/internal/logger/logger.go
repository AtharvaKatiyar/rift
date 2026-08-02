package logger

import (
	"go.uber.org/zap"
)

var Log *zap.Logger

func Init(
	isProduction bool,
) error {

	var err error

	if isProduction {

		Log, err =
			zap.NewProduction()

	} else {

		Log, err =
			zap.NewDevelopment()
	}

	if err != nil {
		return err
	}

	return nil
}

func Sync() {
	_ = Log.Sync()
}
