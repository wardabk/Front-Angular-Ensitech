import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentInterface } from 'src/app/student-interface';
import { StudentServiceService } from 'src/app/student-service.service';


@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.css']
})
export class EditStudentComponent implements OnInit {

  constructor(private studentService: StudentServiceService, private router: Router, private route: ActivatedRoute){}

  formdata: StudentInterface = {
    id: 0,
    firstName: '',
    lastName: '',
    tel: 0,
    address: ''
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      const id = Number(param.get('id')); // Use `Number` to convert string to number
      this.studentService.getById(id).subscribe((data) => {
        this.formdata = data; // Assign fetched data to formdata
      });
    });
  }

  // getById(id:number){
  //   this.studentService.edit(id).subscribe((data) =>{
  //     console.log(data)
  //   });
  // }

  update() {
    if (!this.formdata.firstName || !this.formdata.lastName) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
  
    this.studentService.update(this.formdata).subscribe({
      next: () => {
        console.log('Mise à jour réussie');
        this.router.navigate(['/student']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }
  

  // update() {
  //   this.studentService.edit().subscribe({
  //     next: () => {
  //       // Handle success, for example, navigate to a different route
  //       this.router.navigate(['/student']);
  //     },
  //     error: (err) => {
  //       console.error(err); // Handle error
  //     }
  //   });
  // }
}
