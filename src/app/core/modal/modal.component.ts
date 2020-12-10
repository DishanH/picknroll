import { animate, style, transition, trigger } from '@angular/animations';
import { Component } from '@angular/core';

export const fadeInAnimation =
  // trigger name for attaching this animation to an element using the [@triggerName] syntax
  trigger('fadeInAnimation', [
    // route 'enter' transition
    transition(':enter', [
      // css styles at start of transition
      style({ opacity: 0 }),

      // animation and styles at end of transition
      animate('.3s', style({ opacity: 1 })),
    ]),
  ]);

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [fadeInAnimation],
  host: { '[@fadeInAnimation]': '' }
})
export class ModalComponent {}
