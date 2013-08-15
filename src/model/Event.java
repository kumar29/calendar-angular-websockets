package model;

import java.sql.Date;

public class Event extends DomainObject {

	private Date dateAndTime;

	public Date getDateAndTime() {
		return dateAndTime;
	}

	public void setDateAndTime(Date dateAndTime) {
		this.dateAndTime = dateAndTime;
	}
		
}
