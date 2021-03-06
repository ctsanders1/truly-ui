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

import { Component, ElementRef } from '@angular/core';
import { BlockUIConfig } from './blockui-config';

@Component({
    selector: 'tl-blockui-component',
    template: `
      <div id="blockui">
        <div class="blockui-content">
          <tl-icon [size]="'3em'" [animation]="config.spin ? 'spin' : null">{{ config.icon }}</tl-icon>
          <span *ngIf="config.message">{{ config.message }}</span>
        </div>
      </div>`,
    styleUrls: ['./blockui.scss']
})
export class TlBlockUIComponent {

    public config: BlockUIConfig = new BlockUIConfig();

    constructor( public element: ElementRef ) {}
}
