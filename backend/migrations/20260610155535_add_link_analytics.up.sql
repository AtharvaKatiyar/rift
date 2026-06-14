CREATE TABLE link_analytics (
    id UUID PRIMARY KEY
        DEFAULT gen_random_uuid(),

    link_id UUID NOT NULL
        REFERENCES central_links(id)
        ON DELETE CASCADE,

    referrer TEXT,

    country TEXT,
    city TEXT,

    browser TEXT,
    os TEXT,
    device TEXT,

    ip_address INET,

    clicked_at TIMESTAMPTZ
        NOT NULL
        DEFAULT NOW()
);

-- Core lookup index
CREATE INDEX idx_link_analytics_link_id
ON link_analytics(link_id);

-- Time-series analytics
CREATE INDEX idx_link_analytics_clicked_at
ON link_analytics(clicked_at DESC);

-- Fast chart queries
CREATE INDEX idx_link_analytics_link_time
ON link_analytics(
    link_id,
    clicked_at DESC
);

-- Referrer analytics
CREATE INDEX idx_link_analytics_referrer
ON link_analytics(
    link_id,
    referrer
);

-- Geo analytics
CREATE INDEX idx_link_analytics_country
ON link_analytics(
    link_id,
    country
);

-- Device/browser analytics
CREATE INDEX idx_link_analytics_device
ON link_analytics(
    link_id,
    device
);

CREATE INDEX idx_link_analytics_browser
ON link_analytics(
    link_id,
    browser
);

CREATE INDEX idx_link_analytics_os
ON link_analytics(
    link_id,
    os
);