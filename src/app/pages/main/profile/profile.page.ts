import { Component } from '@angular/core';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.page.html',
  styleUrls: ['./student-profile.page.scss'],
})
export class StudentProfilePage {
  student = {
    photoUrl:'https://photos.app.goo.gl/GyfCLgCntPtBmZiA8', // URL de la foto del alumno
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    career: 'Ingeniería en Informática'
  };

  constructor() {}
}