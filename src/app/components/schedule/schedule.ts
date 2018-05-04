/*
 MIT License

 Copyright (c) 2018 Temainfo Software

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
 */
import {
  Component, Input, OnChanges, SimpleChanges, OnInit, Output, EventEmitter, ViewChild, ElementRef, AfterContentInit,
  AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { ScheduleDataSource } from './types/datasource.type';

@Component( {
  selector: 'tl-schedule',
  templateUrl: './schedule.html',
  styleUrls: [ './schedule.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TlSchedule implements OnInit, AfterViewInit, OnChanges {

  // @Input() currentView: 'day' | 'week' | 'month';

  // @Input() views: Array<string>; // ["day", "week", "workWeek", "month"],

  @Input() currentDate = new Date().getTime();

  @Input() height = '550px';

  @Input() duration = 30;

  @Input('endDayHour') set setEndDayHour(hour: string) {
    const endHourSplited = hour.split(':');
    this.endDayMilliseconds = new Date(2018, 4, 4, Number(endHourSplited[0]), Number( endHourSplited[1])).getTime();
  }

  @Input('startDayHour') set startDayHour( hour: string ) {
    const startHourSplited = hour.split(':');
    this.startDayMilliseconds = new Date(2018, 4, 4, Number(startHourSplited[0]), Number( startHourSplited[1])).getTime();
  }

  @Input('dataSource') set dataSource( dataSource: ScheduleDataSource[] ) {
    this._dataSource = dataSource.sort(( a, b ) =>  a.date.start - b.date.start );
    this.generateEventsPositions();
  }
  get dataSource () {
    return this._dataSource;
  }

  @Output() rowClick = new EventEmitter();

  @ViewChild('scheduleSlats') scheduleSlats: ElementRef;

  public timesCollection: Array<Date> = [];

  public nowIndicatorPositionTop: number;

  private _dataSource: ScheduleDataSource[];

  private startDayMilliseconds: number;

  private endDayMilliseconds: number;

  private eventsPositionsCollection = [];


  constructor( private changeDetectionRef: ChangeDetectorRef ) {}

  ngOnInit() {
    this.generateTimes();
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngAfterViewInit() {
    this.inicializeNowIndicator();

    // console.log('STARTDAY', this.startDayMilliseconds, new Date(this.startDayMilliseconds));
    // console.log('ENDDAY', this.endDayMilliseconds, new Date(this.endDayMilliseconds));
    // console.log('CURRENTDAY', new Date().getTime());
    //
    // console.log('CALC CURRENT',  new Date().getTime() - this.startDayMilliseconds );
    // console.log('CAL FACTOR', this.endDayMilliseconds - this.startDayMilliseconds );
    //
    // console.log('HEIGHT:', this.scheduleSlats.nativeElement.offsetHeight);
    // console.log('FINAL TOP: ',this.nowIndicatorPositionTop );
  }

  public calcPositionEvent(index, event: ScheduleDataSource) {

    const BOTTOM_POSITION = this.convertMillisecondsToPixel(event.date.end) * -1;
    const TOP_POSITION    = this.convertMillisecondsToPixel(event.date.start);

    const RIGHT_POSITION = this.calcRightPosition(event);
    const LEFT_POSITION = this.calcLeftPosition(event);

    return {top: TOP_POSITION + 'px', left: LEFT_POSITION + '%', right: RIGHT_POSITION + '%', bottom: BOTTOM_POSITION  + 'px'};
  }

  calcLeftPosition( event: ScheduleDataSource ) {

    const lenghtFromTimestamp = this.eventsPositionsCollection[event.date.start].length;

    const indexOf = this.eventsPositionsCollection[event.date.start].indexOf(event);
    const divisor = 100 / lenghtFromTimestamp ;

    return indexOf * divisor;
  }

  calcRightPosition( event: ScheduleDataSource ) {

    const lenghtFromTimestamp = this.eventsPositionsCollection[event.date.start].length;

    const indexOf = this.eventsPositionsCollection[event.date.start].indexOf(event);
    const divisor = 100 / lenghtFromTimestamp ;

    return ((lenghtFromTimestamp - 1 - indexOf) * divisor);
  }

  private inicializeNowIndicator() {
    this.nowIndicatorPositionTop = this.convertMillisecondsToPixel();
    this.changeDetectionRef.detectChanges();

    setInterval(() => {
      this.nowIndicatorPositionTop = this.convertMillisecondsToPixel();
      this.currentDate = new Date().getTime();
      this.changeDetectionRef.detectChanges();
    }, 1000);
  }

  private convertMillisecondsToPixel(date = new Date().getTime()) {
    const heightBody = this.scheduleSlats.nativeElement.offsetHeight;
    const currentDate = date - this.startDayMilliseconds;

    return ( heightBody * currentDate ) / ( this.endDayMilliseconds - this.startDayMilliseconds);
  }

  private generateTimes() {
    const MIN_TO_MILLESECOND = 60000;

    let currentHour_ms = this.startDayMilliseconds;
    let nextHourBreak_ms = this.startDayMilliseconds;

    while ( currentHour_ms < this.endDayMilliseconds ) {
       if ( currentHour_ms === nextHourBreak_ms  ) {
         this.timesCollection.push( new Date(nextHourBreak_ms) );
         nextHourBreak_ms =  nextHourBreak_ms + (this.duration * MIN_TO_MILLESECOND);
       }
      currentHour_ms++;
    }
  }

  private generateEventsPositions() {
   this.dataSource.forEach((value, index, array) => {
     if (this.eventsPositionsCollection.indexOf(value.date.start) < 0 ) {
       this.eventsPositionsCollection[value.date.start] = [];
     }
   });
    this.dataSource.forEach((value, index, array) => {
      if (this.eventsPositionsCollection.indexOf(value.date.start) < 0 ) {
        this.eventsPositionsCollection[value.date.start].push(value);
      }
    });

   console.log(this.eventsPositionsCollection);
  }
}

// startIn: [{
//     1231231231312: [
//       {
//         value: '1',
//         title: 'William Aguera',
//         detail: 'Consulta | Particular',
//         allday: false,
//         date: { start: new Date().getTime() , end: new Date().getTime() + 1800000 }
//       },
//       {
//         value: '2',
//         title: 'William Aguera',
//         detail: 'Consulta | Particular',
//         allday: false
//       }
//     ],
//     616161616161: [
//       {
//         value: '1',
//         title: 'William Aguera',
//         detail: 'Consulta | Particular',
//         allday: false
//       },
//       {
//         value: '2',
//         title: 'William Aguera',
//         detail: 'Consulta | Particular',
//         allday: false
//       }
//     ]
// }]