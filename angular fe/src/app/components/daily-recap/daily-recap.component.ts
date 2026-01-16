import { Component, ElementRef, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Trip } from '../../model/Trip';
import { ChangeDetectorRef } from '@angular/core';
import { Speed } from '../../model/Speed';

@Component({
  selector: 'daily-recap',
  templateUrl: './daily-recap.html',
  styleUrls: ['./daily-recap.css'],
  imports: [CommonModule],
})

export class DailyRecapComponent implements OnInit {
  
  speed: Speed = {
    speed: '',
    speedKM: 0,
    deltaT: 0
  }
  
  values: Trip[] = [];

  day: string = '';

  dailyLength: number = 0
  dailyTotalTrips: number = 0

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

    this.day = this.formatDateYYYYMMDD(date)

    this.callApiWithDates();
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

  callApiWithDates() {
    const params = { day: this.day };

    this.http.get<Trip[]>('/api/getByDay', { params }).subscribe({
      next: res => {
        this.values = res.map(v => ({
          ...v,
          trips: Number(v.trips)  
        }));
     
        this.dailyLength = 0;
        this.dailyTotalTrips = 0;

        this.values.forEach((element) => {this.dailyLength += element.length; this.dailyTotalTrips += element.trips})

        this.callSpeedApiWithDates();
      },
      error: err => console.error('Errore API:', err)
    });
  }

}