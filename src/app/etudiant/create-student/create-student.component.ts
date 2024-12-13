import { Component } from '@angular/core';
import { StudentServiceService } from 'src/app/student-service.service';
import { Route, Router } from '@angular/router';
import { StudentInterface } from 'src/app/student-interface';

@Component({
  selector: 'app-create-student',
  templateUrl: './create-student.component.html',
  styleUrls: ['./create-student.component.css']
})
export class CreateStudentComponent {
  constructor(private studentService: StudentServiceService, private router: Router){}

  formdata: Omit<StudentInterface, 'id'> = {
    firstName: "",
    lastName: "",
    tel: 0,
    address: ""
  };

  create() {
    this.studentService.create(this.formdata).subscribe({
      next: (data) => {
        console.log('Student created successfully:', data);
        this.router.navigate(["student"]);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
