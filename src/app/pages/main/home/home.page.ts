import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userName: string | null = null;
  futureClasses = [
    { name: 'Programacion', time: '10:00 AM', sala: 'Sala 503' },
    { name: 'Proyectos', time: '12:00 PM', sala: 'Sala 702' }
  ]; 

  constructor(private firebaseSvc: FirebaseService) {}

  async ngOnInit() {
    this.userName = await this.firebaseSvc.getUserName();
  }
}
