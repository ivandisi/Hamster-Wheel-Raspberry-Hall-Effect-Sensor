import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Trip } from '../../model/Trip';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'week-report',
  templateUrl: './week-report.html',
  styleUrls: ['./week-report.css'],
  imports: [CommonModule],
})

export class WeekReportComponent implements OnInit {
  
  daysLabel: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  values: Trip[] = [];
  days: string[] = [];
  maxTrips: number = 0;

  todayString: string = '';

  activeTab: number = 1;

  switchTab(tabIndex: number) {
    this.activeTab = tabIndex;
  }

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    const today = new Date();
    this.todayString = today.toISOString().slice(0,10);
    this.onDateChange(today);
  }

  onDateChange(eventOrDate: any) {
    let date: Date;
    if (eventOrDate instanceof Date) {
      date = eventOrDate;
    } else {
      date = new Date(eventOrDate.target.value);
    }

    const weekDates = this.getWeekFromDate(date);
    this.days = weekDates.map(d => d.toISOString().slice(0,10).replace(/-/g,''));

    this.callApiWithDates(this.days);
  }

  getWeekFromDate(date: Date): Date[] {
    const dayOfWeek = date.getDay();
    const monday = new Date(date);
    const diffToMonday = (dayOfWeek + 6) % 7;
    monday.setDate(date.getDate() - diffToMonday);

    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d);
    }
    return week;
  }

  callApiWithDates(dates: string[]) {
    const jsonStr = JSON.stringify(dates);
    const base64 = btoa(jsonStr);

    const params = { days: base64 };

    this.http.get<Trip[]>('/api/getByDays', { params }).subscribe({
      next: res => {
        this.values = res.map(v => ({
          ...v,
          trips: Number(v.trips)  
        }));
        this.maxTrips = Math.max(...this.values.map(v => v.trips));
        this.cdr.detectChanges();
      },
      error: err => console.error('Errore API:', err)
    });
  }

}