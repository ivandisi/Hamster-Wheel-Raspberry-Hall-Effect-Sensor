import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Trip } from '../../model/Trip';
import { ChangeDetectorRef } from '@angular/core';
import { Speed } from '../../model/Speed';

@Component({
  selector: 'daily-report',
  templateUrl: './daily-report.html',
  styleUrls: ['./daily-report.css'],
  imports: [CommonModule],
})

export class DailyReportComponent implements OnInit {

  speed: Speed = {
    speed: '',
    speedKM: 0,
    deltaT: 0
  }
    
  day: string = '';

  dailyLength: number = 0
  dailyTotalTrips: number = 0
  
  values: Trip[] = [];
  days: string[] = [];
  maxTrips: number = 0;
  
  loading = false;

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

    formatDateYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() = 0-11
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}`;
  }

  onDateChange(eventOrDate: any) {
    let date: Date;
    if (eventOrDate instanceof Date) {
      date = eventOrDate;
    } else {
      date = new Date(eventOrDate.target.value);
    }

    this.todayString = date.toISOString().slice(0,10);
    this.day = this.formatDateYYYYMMDD(date)

    this.callApiWithDates(this.formatDateYYYYMMDD(date));
  }

  callSpeedApiWithDates() {
    const params = { day: this.day };

    this.http.get<Speed>('/api/getMaxSpeed', { params }).subscribe({
      next: res => {
        this.speed = res;

        this.cdr.detectChanges();
      },
      error: err => console.error('Errore API:', err)
    });
  }

  callApiWithDates(date: string) {
    
    this.loading = true;
    const params = { day: date };

    this.http.get<Trip[]>('/api/getByDay', { params }).subscribe({
      next: res => {
        this.loading = false;
        this.values = res.map(v => ({
          ...v,
          trips: Number(v.trips)  
        }));

      
        this.dailyLength = 0;
        this.dailyTotalTrips = 0;

        this.maxTrips = Math.max(...this.values.map(v => v.trips));
        this.values.forEach((element) => {this.dailyLength += element.length; this.dailyTotalTrips += element.trips})

        this.callSpeedApiWithDates();
      },
      error: err => {
          this.loading = false;
          console.error('Errore API:', err)
      }
    });
  }

}