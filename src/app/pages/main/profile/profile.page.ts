import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  student = {
    photoUrl:'https://photos.google.com/share/AF1QipM6EJeEbRWrBtJEpKySwrhPC7IjS3-jFGdpE214QfxC1VZspbuGh_Tf0k6dsC6nTg/photo/AF1QipPzFb65UFIcehJXmM5-BADZ8dSS0DbbakFQqNMk?key=X21HMlU1OEJYM1ROZ2o2QVBORVV2RDZsY3VwUE1R', // URL de la foto del alumno
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    career: 'Ingeniería en Informática'
  };

  constructor() {}
}