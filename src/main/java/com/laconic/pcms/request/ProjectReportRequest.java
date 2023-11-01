package com.laconic.pcms.request;

import java.util.Date;

public record ProjectReportRequest (Long companyId, Date startDate, Date endDate) {
}
