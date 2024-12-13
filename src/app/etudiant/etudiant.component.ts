import { Component, OnInit } from '@angular/core';
import { StudentInterface } from '../student-interface';
import { StudentServiceService } from '../student-service.service';


@Component({
  selector: 'app-etudiant',
  templateUrl: './etudiant.component.html',
  styleUrls: ['./etudiant.component.css']
})
export class EtudiantComponent implements OnInit {

  allStudent: StudentInterface[] = [];

  constructor(private studentService: StudentServiceService){}

  ngOnInit(): void {
    this.studentService.getAll().subscribe((data) => {
      this.allStudent = data;
    })
  }
}
