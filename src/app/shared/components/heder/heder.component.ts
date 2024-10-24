import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-heder',
  templateUrl: './heder.component.html',
  styleUrls: ['./heder.component.scss'],
})
export class HederComponent  implements OnInit {
 @Input() title!: string;
 @Input() backButton!: string;

  constructor() { }

  ngOnInit() {}

}
