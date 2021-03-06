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
  Input, Component, Output, AfterViewInit, EventEmitter, ChangeDetectorRef, SimpleChanges,
  OnChanges
} from '@angular/core';

export interface FilterTime {
  date: Date;
  selected: boolean;
}

@Component( {
  selector: 'tl-time-available-picker',
  templateUrl: './time-available-picker.html',
  styleUrls: [ './time-available-picker.scss' ],
} )
export class TlTimeAvailablePicker implements AfterViewInit, OnChanges {

  @Input() availableTimes: Array<Date> = [];

  @Input() color = 'basic';

  @Input() dateValue: Date = new Date();

  @Input() value: Array<Date> = [];

  @Output() changeSelect: EventEmitter<any> = new EventEmitter();

  public filterTimes: Array<FilterTime> = [];

  public selectedTime: Array<FilterTime> = [];

  constructor( private change: ChangeDetectorRef ) {}

  ngAfterViewInit() {
    this.setUpData();
    this.handleValueChange();
  }

  private setUpData() {
    this.availableTimes.forEach( ( value ) => {
      this.filterTimes.push( { date: value, selected: false } );
    } );
  }

  private handleValueChange() {
    if ( this.value.length > 0 ) {
      this.value.forEach( ( date: Date ) => {
        if (this.getDateOnFilter(date) >= 0) {
          this.filterTimes[this.getDateOnFilter(date)].selected = true;
        }
      } );
      this.updateTime();
    }
  }

  private getDateOnFilter( date ) {
    return this.filterTimes.findIndex( ( item: FilterTime ) => item.date.getTime() === date.getTime());
  }

  private getSelectedArray() {
    return this.filterTimes.filter( ( item: FilterTime ) => item.selected );
  }

  private deselectAll() {
    this.filterTimes.forEach( ( item: FilterTime ) => item.selected = false );
  }

  private findSelected() {
    return this.filterTimes.findIndex( ( item: FilterTime ) => item.selected );
  }

  private handleDeselect( time: FilterTime ) {
    this.deselectAll();
    time.selected = true;
    this.updateTime();
  }

  setSelectedTime( time: FilterTime, index: number ) {
    const readySelected = this.findSelected();
    if ( ( index === 0 || index === this.filterTimes.length - 1 ) && !(readySelected >= 0) ) {
      this.handleDeselect( time );
      return;
    }
    if ( (this.filterTimes[ this.getFirstIndex( index ) ].selected || this.filterTimes[ this.getLastIndex( index ) ].selected )
      && this.getSelectedArray().length > 1 ) {
      this.handleDeselect( time );
      return;
    }
    time.selected = !time.selected;
    this.selectMany( time, readySelected, index );
  }

  private getFirstIndex( index ) {
    return index === 0 ? index : index - 1;
  }

  private getLastIndex( index ) {
    return index === this.filterTimes.length - 1 ? index : index + 1;
  }

  private selectMany( time: FilterTime, readySelected: number, index: number ) {
    this.filterTimes.forEach( ( value, index2, array ) => {
      if ( readySelected < 0 ) {
        time.selected = !time.selected;
        return;
      }
      if ( index2 > readySelected && index2 <= index ) {
        value.selected = true;
      }
      if ( index2 < readySelected && index2 >= index ) {
        value.selected = true;
      }
    } );
    this.updateTime();
  }

  private updateTime() {
    this.selectedTime = [];
    const allSelected = this.filterTimes.filter( ( value ) => value.selected );
    if ( allSelected.length > 0 ) {
      this.selectedTime[ 0 ] = allSelected[ 0 ];
      if ( allSelected.length > 1 ) {
        this.selectedTime[ 1 ] = allSelected[ allSelected.length - 1 ];
      }
    }
    this.changeSelect.emit( this.getSelectedArray().map((item) => item.date) );
    this.change.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableTimes']) {
      this.setUpData();
    }
    if (changes['value']) {
      this.handleValueChange();
    }
  }

}
