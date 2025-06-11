import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonCheckbox,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonAlert,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, time, notifications, trash, create, save, close } from 'ionicons/icons';

export interface Recordatorio {
  id: string;
  nombreMedicamento: string;
  dosis: string;
  frecuencia: 'diaria' | 'semanal' | 'personalizada';
  horarios: string[];
  diasSemana?: string[];
  fechaInicio: string;
  fechaFin?: string;
  activo: boolean;
  notas?: string;
}

@Component({
  selector: 'app-recordatorios',
  templateUrl: './recordatorios.page.html',
  styleUrls: ['./recordatorios.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonCheckbox,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonAlert
  ]
})
export class RecordatoriosPage implements OnInit {

  recordatorios: Recordatorio[] = [];
  nuevoRecordatorio: Partial<Recordatorio> = {
    nombreMedicamento: '',
    dosis: '',
    frecuencia: 'diaria',
    horarios: [],
    diasSemana: [],
    fechaInicio: new Date().toISOString(),
    activo: true,
    notas: ''
  };

  isModalOpen = false;
  editando = false;
  recordatorioEditando: Recordatorio | null = null;
  nuevoHorario = '';
  isAlertOpen = false;
  alertButtons = ['OK'];

  diasSemanaOptions = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
  ];

  constructor(private alertController: AlertController) {
    addIcons({ add, time, notifications, trash, create, save, close });
  }

  ngOnInit() {
    this.cargarRecordatorios();
  }

  cargarRecordatorios() {
    // Simulamos algunos recordatorios de ejemplo
    const recordatoriosEjemplo: Recordatorio[] = [
      {
        id: '1',
        nombreMedicamento: 'Aspirina',
        dosis: '100mg',
        frecuencia: 'diaria',
        horarios: ['08:00', '20:00'],
        fechaInicio: new Date().toISOString(),
        activo: true,
        notas: 'Tomar con comida'
      },
      {
        id: '2',
        nombreMedicamento: 'Vitamina D',
        dosis: '1000 UI',
        frecuencia: 'semanal',
        horarios: ['09:00'],
        diasSemana: ['lunes'],
        fechaInicio: new Date().toISOString(),
        activo: true
      }
    ];

    // Cargar de localStorage si existe, sino usar ejemplos
    const stored = localStorage.getItem('medialert_recordatorios');
    if (stored) {
      this.recordatorios = JSON.parse(stored);
    } else {
      this.recordatorios = recordatoriosEjemplo;
      this.guardarRecordatorios();
    }
  }

  guardarRecordatorios() {
    localStorage.setItem('medialert_recordatorios', JSON.stringify(this.recordatorios));
  }

  abrirModal(recordatorio?: Recordatorio) {
    if (recordatorio) {
      this.editando = true;
      this.recordatorioEditando = recordatorio;
      this.nuevoRecordatorio = { ...recordatorio };
    } else {
      this.editando = false;
      this.recordatorioEditando = null;
      this.nuevoRecordatorio = {
        nombreMedicamento: '',
        dosis: '',
        frecuencia: 'diaria',
        horarios: [],
        diasSemana: [],
        fechaInicio: new Date().toISOString(),
        activo: true,
        notas: ''
      };
    }
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.nuevoHorario = '';
  }

  agregarHorario() {
    if (this.nuevoHorario && !this.nuevoRecordatorio.horarios?.includes(this.nuevoHorario)) {
      if (!this.nuevoRecordatorio.horarios) {
        this.nuevoRecordatorio.horarios = [];
      }
      this.nuevoRecordatorio.horarios.push(this.nuevoHorario);
      this.nuevoHorario = '';
    }
  }

  eliminarHorario(horario: string) {
    if (this.nuevoRecordatorio.horarios) {
      this.nuevoRecordatorio.horarios = this.nuevoRecordatorio.horarios.filter(h => h !== horario);
    }
  }

  onFrecuenciaChange() {
    if (this.nuevoRecordatorio.frecuencia === 'diaria') {
      this.nuevoRecordatorio.diasSemana = [];
    } else if (this.nuevoRecordatorio.frecuencia === 'semanal') {
      this.nuevoRecordatorio.diasSemana = ['lunes'];
    }
  }

  async guardarRecordatorio() {
    if (!this.nuevoRecordatorio.nombreMedicamento ||
        !this.nuevoRecordatorio.dosis ||
        !this.nuevoRecordatorio.horarios?.length) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos obligatorios: nombre del medicamento, dosis y al menos un horario.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.nuevoRecordatorio.frecuencia === 'semanal' && !this.nuevoRecordatorio.diasSemana?.length) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Para frecuencia semanal, debes seleccionar al menos un día.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    if (this.editando && this.recordatorioEditando) {
      // Actualizar recordatorio existente
      const index = this.recordatorios.findIndex(r => r.id === this.recordatorioEditando!.id);
      this.recordatorios[index] = { ...this.nuevoRecordatorio as Recordatorio, id: this.recordatorioEditando.id };
    } else {
      // Crear nuevo recordatorio
      const nuevo: Recordatorio = {
        ...this.nuevoRecordatorio as Recordatorio,
        id: Date.now().toString()
      };
      this.recordatorios.push(nuevo);
    }

    this.guardarRecordatorios();
    this.cerrarModal();

    const alert = await this.alertController.create({
      header: 'Éxito',
      message: `Recordatorio ${this.editando ? 'actualizado' : 'creado'} correctamente.`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async eliminarRecordatorio(recordatorio: Recordatorio) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar el recordatorio para ${recordatorio.nombreMedicamento}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.recordatorios = this.recordatorios.filter(r => r.id !== recordatorio.id);
            this.guardarRecordatorios();
          }
        }
      ]
    });

    await alert.present();
  }

  toggleRecordatorio(recordatorio: Recordatorio) {
    recordatorio.activo = !recordatorio.activo;
    this.guardarRecordatorios();
  }

  getFrecuenciaLabel(frecuencia: string): string {
    switch (frecuencia) {
      case 'diaria': return 'Diaria';
      case 'semanal': return 'Semanal';
      case 'personalizada': return 'Personalizada';
      default: return frecuencia;
    }
  }

  getDiasSemanaText(diasSemana?: string[]): string {
    if (!diasSemana || diasSemana.length === 0) return '';

    const diasTexto = diasSemana.map(dia => {
      const diaOption = this.diasSemanaOptions.find(d => d.value === dia);
      return diaOption ? diaOption.label : dia;
    });

    return diasTexto.join(', ');
  }
}
