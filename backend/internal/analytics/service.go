
package analytics

import (
	"context"
	"errors"
	"net/netip"
	"time"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/gin-gonic/gin"
	"github.com/AtharvaKatiyar/rift/internal/logger"
	"go.uber.org/zap"
	db "github.com/AtharvaKatiyar/rift/internal/database/sqlc"
	"github.com/AtharvaKatiyar/rift/internal/utils"
	"github.com/AtharvaKatiyar/rift/internal/geoip"
)

type Service struct {
	Queries *db.Queries
	Queue   chan db.CreateLinkAnalyticsParams
	GeoIP   *geoip.Service
}

func (s *Service) StartWorkers(
	ctx context.Context,
	workers int,
) {

	for i := 0; i < workers; i++ {

		go func() {

			for {

				select {

				case <-ctx.Done():
					return

				case analytics :=
					<-s.Queue:

					_ = s.Queries.CreateLinkAnalytics(
						ctx,
						analytics,
					)
				}
			}
		}()
	}
}

func (s *Service) Enqueue(
	data db.CreateLinkAnalyticsParams,
) {

	select {

	case s.Queue <- data:

	default:
		// drop under overload
	}
}

func (s *Service) TrackClick(
	ctx context.Context,
	linkID string,
	c *gin.Context,
) {

	parsed :=
		ParseRequest(c)

	isBot :=
		IsBot(
			c.Request.UserAgent(),
		)

	utmSource :=
		c.Query(
			"utm_source",
		)

	utmMedium :=
		c.Query(
			"utm_medium",
		)

	utmCampaign :=
		c.Query(
			"utm_campaign",
		)

	utmTerm :=
		c.Query(
			"utm_term",
		)

	utmContent :=
		c.Query(
			"utm_content",
		)

	location :=
		geoip.Location{
			Country: "Unknown",
			City:    "Unknown",
		}
	if s.GeoIP != nil {
		location =
			s.GeoIP.Lookup(
				parsed.IPAddress,
			)
	}
		
	// logger.Log.Info(
	// 	"geo lookup",
	// 	zap.String(
	// 		"ip",
	// 		parsed.IPAddress,
	// 	),
	// 	zap.String(
	// 		"country",
	// 		location.Country,
	// 	),
	// 	zap.String(
	// 		"city",
	// 		location.City,
	// 	),
	// )


	parsedUUID, err :=
		utils.ParseUUID(
			linkID,
		)

	if err != nil {
		return
	}

	var ipAddr netip.Addr

	ip, err :=
		netip.ParseAddr(
			parsed.IPAddress,
		)

	if err == nil {
		ipAddr = ip
	}

	s.Enqueue(
		db.CreateLinkAnalyticsParams{
			LinkID:
				parsedUUID,

			Referrer:
				pgtype.Text{
					String:
						parsed.Referrer,
					Valid: true,
				},

			Country:
				pgtype.Text{
					String:
						location.Country,
					Valid: true,
				},

			City:
				pgtype.Text{
					String:
						location.City,
					Valid: true,
				},

			Browser:
				pgtype.Text{
					String:
						parsed.Browser,
					Valid: true,
				},

			Os:
				pgtype.Text{
					String:
						parsed.OS,
					Valid: true,
				},

			Device:
				pgtype.Text{
					String:
						parsed.Device,
					Valid: true,
				},

			IpAddress:
				&ipAddr,

			UtmSource:
				pgtype.Text{
					String:
						utmSource,
					Valid:
						utmSource != "",
				},

			UtmMedium:
				pgtype.Text{
					String:
						utmMedium,
					Valid:
						utmMedium != "",
				},

			UtmCampaign:
				pgtype.Text{
					String:
						utmCampaign,
					Valid:
						utmCampaign != "",
				},

			UtmTerm:
				pgtype.Text{
					String:
						utmTerm,
					Valid:
						utmTerm != "",
				},

			UtmContent:
				pgtype.Text{
					String:
						utmContent,
					Valid:
						utmContent != "",
				},
			
			IsBot:
				isBot,
		},
	)
}

func (s *Service) GetLinkAnalytics(
	ctx context.Context,
	linkID string,
	userID string,
	rangeValue string,
) (*LinkAnalyticsResponse, error) {

	parsedUUID, err :=
		utils.ParseUUID(
			linkID,
		)

	if err != nil {
		return nil, err
	}

	parsedUserID, err :=
		utils.ParseUUID(
			userID,
		)
	
	if err != nil {
		return nil, err
	}

	duration :=
		ParseRange(
			rangeValue,
		)

	since :=
		time.Now().
			Add(-duration)

	now :=
		time.Now()

		currentStart :=
		now.Add(-duration)

		previousStart :=
		currentStart.Add(-duration)

		previousEnd :=
		currentStart

	logger.Log.Info(
		"analytics range",
		zap.String(
			"range",
			rangeValue,
		),
		zap.Time(
			"since",
			since,
		),
	)


	ownsLink, err :=
		s.Queries.VerifyLinkOwnership(
			ctx,
			db.VerifyLinkOwnershipParams{
				ID:
					parsedUUID,

				UserID:
					parsedUserID,
			},
		)

	if err != nil {
		return nil, err
	}

	if !ownsLink {
		return nil,
			errors.New(
				"unauthorized",
			)
	}

	currentClicks, err :=
		s.Queries.GetClicksInRange(
			ctx,
			db.GetClicksInRangeParams{
				LinkID:
					parsedUUID,

				StartTime:
					pgtype.Timestamptz{
						Time:
							currentStart,
						Valid:
							true,
					},

				EndTime:
					pgtype.Timestamptz{
						Time:
							now,
						Valid:
							true,
					},
			},
		)

	if err != nil {
		return nil, err
	}
	
	previousClicks, err :=
		s.Queries.GetClicksInRange(
			ctx,
			db.GetClicksInRangeParams{
				LinkID:
					parsedUUID,

				StartTime:
					pgtype.Timestamptz{
						Time:
							previousStart,
						Valid:
							true,
					},

				EndTime:
					pgtype.Timestamptz{
						Time:
							previousEnd,
						Valid:
							true,
					},
			},
		)

	if err != nil {
		return nil, err
	}

	var changePercentage float64
	trend := "stable"

	switch {

	case previousClicks == 0 &&
		currentClicks > 0:

		changePercentage = 100
		trend = "up"

	case previousClicks > 0:

		changePercentage =
			(float64(
				currentClicks-previousClicks,
			) /
				float64(previousClicks)) *
				100

		switch {

		case currentClicks > previousClicks:
			trend = "up"

		case currentClicks < previousClicks:
			trend = "down"
		}
	}

	sinceParam :=
		pgtype.Timestamptz{
			Valid: false,
		}


	if duration > 0 {

		sinceParam =
			pgtype.Timestamptz{
				Time:
					since,

				Valid:
					true,
			}
	}
		
	overview, err :=
		s.Queries.GetLinkAnalyticsOverview(
			ctx,
			db.GetLinkAnalyticsOverviewParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	timelineRows, err :=
		s.Queries.GetClicksTimeline(
			ctx,
			db.GetClicksTimelineParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	hourlyRows, err :=
		s.Queries.GetHourlyClicks(
			ctx,
			db.GetHourlyClicksParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	recentRows, err :=
		s.Queries.GetRecentClicks(
			ctx,
			db.GetRecentClicksParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
			return nil, err
	}

	browserRows, err :=
		s.Queries.GetTopBrowsers(
			ctx,
			db.GetTopBrowsersParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	deviceRows, err :=
		s.Queries.GetTopDevices(
			ctx,
			db.GetTopDevicesParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	referrerRows, err :=
		s.Queries.GetTopReferrers(
			ctx,
			db.GetTopReferrersParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	operatingSystems, err :=
		s.Queries.GetTopOperatingSystems(
			ctx,
			db.GetTopOperatingSystemsParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	countryRows, err :=
		s.Queries.GetTopCountries(
			ctx,
			db.GetTopCountriesParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	cityRows, err :=
		s.Queries.GetTopCities(
			ctx,
			db.GetTopCitiesParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	campaignRows, err :=
		s.Queries.GetTopCampaigns(
			ctx,
			db.GetTopCampaignsParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	sourceRows, err :=
		s.Queries.GetTopSources(
			ctx,
			db.GetTopSourcesParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	mediumRows, err :=
		s.Queries.GetTopMediums(
			ctx,
			db.GetTopMediumsParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	termRows, err :=
		s.Queries.GetTopTerms(
			ctx,
			db.GetTopTermsParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	contentRows, err :=
		s.Queries.GetTopContent(
			ctx,
			db.GetTopContentParams{
				LinkID:
					parsedUUID,

				Column2:
					sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	repeatVisitors, err :=
		s.Queries.GetRepeatVisitors(
			ctx,
			db.GetRepeatVisitorsParams{
				LinkID: parsedUUID,
				Column2: sinceParam,
			},
		)
	
	if err != nil {
		return nil, err
	}

	averageClicks, err :=
		s.Queries.GetAverageClicksPerVisitor(
			ctx,
			db.GetAverageClicksPerVisitorParams{
				LinkID: parsedUUID,
				Column2: sinceParam,
			},
		)

	if err != nil {
		return nil, err
	}

	var averageClicksValue float64

	numericValue, ok :=
		averageClicks.(pgtype.Numeric)

	if ok {

		floatValue, err :=
			numericValue.Float64Value()

		if err == nil {

			averageClicksValue =
				floatValue.Float64
		}
	}

	response :=
		&LinkAnalyticsResponse{
			Overview: Overview{
				TotalClicks:
					overview.TotalClicks,

				ClicksToday:
					overview.ClicksToday,

				UniqueVisitors:
					overview.UniqueVisitors,

				RepeatVisitors:
					repeatVisitors,

				AvgClicksPerVisitor:
					averageClicksValue,

				ChangePercentage: changePercentage,
				Trend:              trend,
			},
		}

	for _, row :=
		range timelineRows {

		response.Timeline =
			append(
				response.Timeline,
				TimelinePoint{
					Day:
						row.Day.Time.Format(
							"2006-01-02",
						),

					Clicks:
						row.Clicks,
				},
			)
	}

	for _, row :=
		range hourlyRows {

		response.Hourly =
			append(
				response.Hourly,
				HourlyPoint{
					Hour:
						row.Hour,

					Clicks:
						row.Clicks,
				},
			)
	}

	for _, row :=
		range browserRows {
		response.Browsers =
			append(
				response.Browsers,
				Breakdown{
					Name:
						row.Browser.String,
					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range deviceRows {
		response.Devices =
			append(
				response.Devices,
				Breakdown{
					Name:
						row.Device.String,
					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range operatingSystems {

		response.OperatingSystems =
			append(
				response.OperatingSystems,
				Breakdown{
					Name:
						row.Name.String,
					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row := range countryRows {
		name, ok := row.Name.(string)
		if !ok {
			name = ""
		}

		response.Countries = append(
			response.Countries,
			Breakdown{
				Name:   name,
				Clicks: row.Clicks,
			},
		)
	}
	for _, row :=
		range cityRows {

		name, ok :=
			row.Name.(string)

		if !ok {
			name = ""
		}

		response.Cities =
			append(
				response.Cities,
				Breakdown{
					Name:
						name,

					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range campaignRows {

		name, ok :=
			row.Name.(string)

		if !ok {
			name = ""
		}

		response.Campaigns =
			append(
				response.Campaigns,
				Breakdown{
					Name:
						name,

					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range sourceRows {

		name, ok :=
			row.Name.(string)

		if !ok {
			name = ""
		}

		response.Sources =
			append(
				response.Sources,
				Breakdown{
					Name:
						name,

					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range mediumRows {

		name, ok :=
			row.Name.(string)

		if !ok {
			name = ""
		}

		response.Mediums =
			append(
				response.Mediums,
				Breakdown{
					Name:
						name,

					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range termRows {

		name, ok :=
			row.Name.(string)

		if !ok {
			name = ""
		}

		response.Terms =
			append(
				response.Terms,
				Breakdown{
					Name:
						name,

					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range contentRows {

		name, ok :=
			row.Name.(string)

		if !ok {
			name = ""
		}

		response.Content =
			append(
				response.Content,
				Breakdown{
					Name:
						name,

					Clicks:
						row.Clicks,
				},
			)
	}
	for _, row :=
		range referrerRows {
		response.Referrers =
			append(
				response.Referrers,
				Breakdown{
					Name:
						row.Source,
					Clicks:
						row.Clicks,
				},
			)
	}

	for _, row :=
		range recentRows {

		referrer :=
			"Direct"

		if row.Referrer.Valid &&
			row.Referrer.String != "" {

			referrer =
				row.Referrer.String
		}

		country :=
			"Unknown"

		if row.Country.Valid {
			country =
				row.Country.String
		}

		city :=
			"Unknown"

		if row.City.Valid {
			city =
				row.City.String
		}

		response.RecentClicks =
			append(
				response.RecentClicks,
				RecentClick{
					ClickedAt:
						row.ClickedAt.Time.Format(
							time.RFC3339,
						),

					Referrer:
						referrer,

					Country:
						country,

					City:
						city,

					Browser:
						row.Browser.String,

					OS:
						row.Os.String,

					Device:
						row.Device.String,
				},
			)
	}
	return response, nil
}