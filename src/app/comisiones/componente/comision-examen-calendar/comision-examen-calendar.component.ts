import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { CalendarEventTimesChangedEvent } from 'angular-calendar';

@Component({
  selector: 'app-comision-examen-calendar-component',
  templateUrl: './comision-examen-calendar.component.html',
  styleUrls: ['./comision-examen-calendar.component.scss']
})
export class ComisionExamenCalendarComponent implements OnInit {
  activeDayIsOpen: boolean = false;
  viewDateChange: EventEmitter<Date> = new EventEmitter();
  view: string = 'month';
  viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [
    {
      title: 'An event',
      start: new Date(),
    }
  ];
  
  constructor() { }

  ngOnInit() {
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
  handleEvent(action: string, event: CalendarEvent): void {
    
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

}
