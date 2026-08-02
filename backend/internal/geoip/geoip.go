package geoip

import (
	"net/netip"

	"github.com/oschwald/geoip2-golang"
)

type Service struct {
	DB *geoip2.Reader
}

type Location struct {
	Country string
	City    string
}

func New(
	dbPath string,
) (*Service, error) {

	db, err :=
		geoip2.Open(
			dbPath,
		)

	if err != nil {
		return nil, err
	}

	return &Service{
		DB: db,
	}, nil
}

func (s *Service) Lookup(
	ip string,
) Location {

	parsedIP, err :=
		netip.ParseAddr(
			ip,
		)

	if err != nil {
		return Location{}
	}

	record, err :=
		s.DB.City(
			parsedIP.AsSlice(),
		)

	if err != nil {
		return Location{}
	}

	location :=
		Location{
			Country: record.Country.Names["en"],

			City: record.City.Names["en"],
		}

	if location.Country == "" {
		location.Country =
			"Unknown"
	}

	if location.City == "" {
		location.City =
			"Unknown"
	}

	return location
}
