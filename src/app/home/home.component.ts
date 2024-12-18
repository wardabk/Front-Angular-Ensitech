import { Component, OnInit, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { CoursService } from 'src/app/cours/cours.service';
import { EtudiantService } from 'src/app/etudiant/etudiant.service';
import { EnseignantService } from 'src/app/enseignant/enseignant.service';
import { NoteService } from 'src/app/note/note.service';
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
    private CoursService: CoursService,
    private NoteService: NoteService
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

    ngAfterViewInit() {}

    createPieChart() {
      if (this.pieChart && this.pieChart.nativeElement) {
        this.CoursService.getAllCours().subscribe((cours) => {
          const coursLabels = cours.map((c) => c.theme); // Extraire les noms des cours
          const coursCounts = cours.map(() => 1); // Chaque cours compte pour 1 unité

          // Créer le Pie Chart
          new Chart(this.pieChart.nativeElement, {
            type: 'pie',
            data: {
              labels: coursLabels, // Les noms des cours comme labels
              datasets: [
                {
                  data: coursCounts, // Chaque cours a une valeur de 1
                  backgroundColor: this.generateColors(cours.length), // Générer des couleurs dynamiquement
                },
              ],
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            },
          });
        });
      }
    }

    // Méthode pour générer des couleurs aléatoires pour le Pie Chart
    generateColors(count: number): string[] {
      const colors = [];
      for (let i = 0; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.7)`);
      }
      return colors;
    }


createBarChart() {
  if (this.barChart && this.barChart.nativeElement) {
    this.NoteService.getAllNote().subscribe((notes) => {

      // Récupérer les noms et les notes des étudiants
      const etudiantNames = notes.map((note) => note.nomEtudiant ); // Remplacez 'nom' par le champ exact de l'étudiant
      const etudiantGrades = notes.map((note) => note.valeur); // Remplacez 'note' par le champ exact des notes des étudiants
      const cours = notes.map((note) => note.themeCours); // Matières associées

      // Créer le Bar Chart avec les données des étudiants
      new Chart(this.barChart.nativeElement, {
        type: 'bar',
        data: {
          labels: etudiantNames, // Noms des étudiants comme labels
          datasets: [{
            label: 'Notes des étudiants',
            data: etudiantGrades, // Notes des étudiants
            backgroundColor: 'rgba(75, 192, 192, 0.7)' , // Couleur des barres
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                // Ajouter la matière dans les tooltips
                label: function(tooltipItem) {
                  const index = tooltipItem.dataIndex;
                  return `Note: ${tooltipItem.raw}, cours: ${cours[index]}`;
                }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true, // Commencer l'axe Y à 0
            },
          },
        },
      });
    });
  }
}

}
