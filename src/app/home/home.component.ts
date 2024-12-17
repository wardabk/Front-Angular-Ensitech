import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CoursService } from 'src/app/cours/cours.service';
import { EtudiantService } from 'src/app/etudiant/etudiant.service';
import { EnseignantService } from 'src/app/enseignant/enseignant.service';
import Chart from 'chart.js/auto';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {

// Références aux balises canvas dans le HTML
@ViewChild('pieChart', { static: true }) pieChart!: ElementRef;
@ViewChild('barChart', { static: true }) barChart!: ElementRef;

  // Statistiques
  nombreEtudiants : number = 0;
  nombreEnseignants : number = 0;
  nombreCours : number = 0;


  constructor(
    private EtudiantService: EtudiantService,
    private EnseignantService: EnseignantService,
    private CoursService: CoursService
  ) {}


  ngOnInit() {
    // Abonnement aux observables et récupération des données
    this.EtudiantService.getAll().subscribe(etudiants => {
      this.nombreEtudiants = etudiants.length;

    });

    this.EnseignantService.getAllEnseignant().subscribe(enseignants => {
      this.nombreEnseignants = enseignants.length;
    });

    this.CoursService.getAllCours().subscribe(cours => {
      this.nombreCours = cours.length;

       // Appeler la création des graphiques une fois que toutes les données sont disponibles
    this.createPieChart();
    this.createBarChart();
    });

  }


    ngAfterViewInit() {

    }


  createPieChart() {
    if (this.pieChart && this.pieChart.nativeElement){
    new Chart(this.pieChart.nativeElement, {
      type: 'pie',
      data: {
        labels: ['Étudiants', 'Enseignants', 'Cours'],
        datasets: [{
          data: [

            this.nombreEtudiants,
            this.nombreEnseignants,
            this.nombreCours,

          ],
          backgroundColor: [

            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 182, 193, 0.7)',
            'rgba(255, 206, 86, 0.7)'

          ]
        }]
      }
    });
  }
}

  createBarChart() {
    if (this.barChart && this.barChart.nativeElement) {
    new Chart(this.barChart.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Étudiants', 'Enseignants', 'Cours'],
        datasets: [{
          label: 'Nombre par catégorie',
          data: [

            this.nombreEtudiants,
            this.nombreEnseignants,
            this.nombreCours,
          ],
          backgroundColor: [

            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 182, 193, 0.7)',
            'rgba(255, 206, 86, 0.7)'

          ]
        }]
      }
    });
  }
}
}
