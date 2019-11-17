import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { CalendarEvent } from 'calendar-utils';
import { Calendar, Schedule, RScheduleConfig, Rule, DateAdapter } from '@rschedule/rschedule';
import { StandardDateAdapter } from '@rschedule/standard-date-adapter';
import * as moment from 'moment';
import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-comision-asistencia-calendar-component',
  templateUrl: './comision-asistencia-calendar.component.html',
  styleUrls: ['./comision-asistencia-calendar.component.scss']
})
export class ComisionAsistenciaCalendarComponent implements OnInit {
  activeDayIsOpen: boolean = false;
  viewDateChange: EventEmitter<Date> = new EventEmitter();
  @Input() view: string = 'week';
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  @Input() events: CalendarEvent[] = [];

  @Input() calendar = new Calendar({
    schedules: new Schedule({
      rrules: [
        new Rule({
          frequency: 'WEEKLY',
          byDayOfWeek: ['MO'],
          start: moment().startOf('month').toDate(),
        },{
          dateAdapter: StandardDateAdapter,
        }),
      ],
      dateAdapter: StandardDateAdapter,
    }),
    dateAdapter: StandardDateAdapter,
  });

  eventsCalendar: CalendarEvent[];

  constructor() { }

  ngOnInit() {
    if(this.view == CalendarView.Week){
      this.actualizar();
    }
  }

  actualizar() {
    this.eventsCalendar = this.events.concat(this.calculateEvents(this.viewDate));
  }

  private calculateEvents(date: Date): CalendarEvent[] {
    let collection = this.calendar.collections({
      start: date,
      weekStart: 'SU',
      granularity:'WEEKLY',
      incrementLinearly:true,
    }).next().value;

    const dates = collection && collection.dates || [];
    return dates.map(adapter => ({
      start: adapter.date,
      end: moment(adapter.date).add('second',adapter.duration).toDate(),
      title: 'Horario',
    }))
  }

}
