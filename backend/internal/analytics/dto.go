package analytics

type Overview struct {
	TotalClicks   		int64 		`json:"total_clicks"`
	ClicksToday   		int64 		`json:"clicks_today"`
	UniqueVisitors 		int64 		`json:"unique_visitors"`
	ChangePercentage 	float64 	`json:"change_percentage"`
	Trend             	string  	`json:"trend"`
	RepeatVisitors 		int64   	`json:"repeat_visitors"`
	AvgClicksPerVisitor float64 	`json:"avg_clicks_per_visitor"`

}

type TimelinePoint struct {
	Day    string `json:"day"`
	Clicks int64  `json:"clicks"`
}

type Breakdown struct {
	Name   string `json:"name"`
	Clicks int64  `json:"clicks"`
}

type HourlyPoint struct {
	Hour   int32 `json:"hour"`
	Clicks int64 `json:"clicks"`
}

type RecentClick struct {
	ClickedAt string `json:"clicked_at"`
	Referrer  string `json:"referrer"`
	Country   string `json:"country"`
	City      string `json:"city"`
	Browser   string `json:"browser"`
	OS         string `json:"os"`
	Device    string `json:"device"`
}

type LinkAnalyticsResponse struct {
	Overview  			Overview       		`json:"overview"`
	Timeline  			[]TimelinePoint 	`json:"timeline"`
	Hourly              []HourlyPoint    	`json:"hourly"`
	Browsers  			[]Breakdown    		`json:"browsers"`
	Devices   			[]Breakdown    		`json:"devices"`
	OperatingSystems    []Breakdown    		`json:"operating_systems"`
	Countries 			[]Breakdown 		`json:"countries"`
	Cities 				[]Breakdown 		`json:"cities"`
	Referrers 			[]Breakdown    		`json:"referrers"`
	Campaigns 			[]Breakdown 		`json:"campaigns"`
	Sources   			[]Breakdown 		`json:"sources"`
	Mediums   			[]Breakdown 		`json:"mediums"`
	Terms   			[]Breakdown 		`json:"terms"`
	Content 			[]Breakdown 		`json:"content"`
	RecentClicks 		[]RecentClick 		`json:"recent_clicks"`
}