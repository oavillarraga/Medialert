import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonCheckbox,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  IonBadge,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonButtons,
  IonSearchbar,
  IonProgressBar,
  AlertController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  medical,
  time,
  calendar,
  checkmarkCircle,
  ellipse,
  search,
  filter,
  eye,
  stopCircle,
  playCircle,
  documentText,
  person,
  home
} from 'ionicons/icons';

export interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  horarios: string[];
}

export interface Tratamiento {
  id: string;
  nombre: string;
  descripcion: string;
  medico: string;
  especialidad: string;
  fechaInicio: string;
  fechaFin?: string;
  duracionEstimada: number; // en días
  estado: 'activo' | 'finalizado' | 'pausado';
  medicamentos: Medicamento[];
  progreso: number; // porcentaje 0-100
  notas?: string;
  proximaCita?: string;
  categoria: 'cronica' | 'aguda' | 'preventiva' | 'rehabilitacion';
}

@Component({
  selector: 'app-tratamientos',
  templateUrl: './tratamientos.page.html',
  styleUrls: ['./tratamientos.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonCheckbox,
    IonIcon,
    IonSegment,
    IonSegmentButton,
    IonBadge,
    IonChip,
    IonGrid,
    IonRow,
    IonCol,
    IonModal,
    IonButtons,
    IonSearchbar,
    IonProgressBar
  ]
})
export class TratamientosPage implements OnInit {

  tratamientos: Tratamiento[] = [];
  tratamientosFiltrados: Tratamiento[] = [];
  segmentoSeleccionado: 'activos' | 'finalizados' | 'todos' = 'activos';
  busqueda = '';
  filtroCategoria = 'todas';

  isModalOpen = false;
  tratamientoSeleccionado: Tratamiento | null = null;

  categorias = [
    { value: 'todas', label: 'Todas las categorías' },
    { value: 'cronica', label: 'Enfermedad Crónica' },
    { value: 'aguda', label: 'Enfermedad Aguda' },
    { value: 'preventiva', label: 'Tratamiento Preventivo' },
    { value: 'rehabilitacion', label: 'Rehabilitación' }
  ];

  constructor(
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {
        addIcons({
      medical,
      time,
      calendar,
      checkmarkCircle,
      ellipse,
      search,
      filter,
      eye,
      stopCircle,
      playCircle,
      documentText,
      person,
      home
    });
  }

  ngOnInit() {
    this.cargarTratamientos();
  }

  cargarTratamientos() {
    // Simulamos algunos tratamientos de ejemplo
    const tratamientosEjemplo: Tratamiento[] = [
      {
        id: '1',
        nombre: 'Hipertensión Arterial',
        descripcion: 'Tratamiento para control de presión arterial alta',
        medico: 'Dr. García López',
        especialidad: 'Cardiología',
        fechaInicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        duracionEstimada: 365,
        estado: 'activo',
        medicamentos: [
          {
            nombre: 'Losartán',
            dosis: '50mg',
            frecuencia: 'diaria',
            horarios: ['08:00']
          },
          {
            nombre: 'Hidroclorotiazida',
            dosis: '25mg',
            frecuencia: 'diaria',
            horarios: ['08:00']
          }
        ],
        progreso: 8,
        categoria: 'cronica',
        proximaCita: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        notas: 'Control de presión arterial semanal'
      },
      {
        id: '2',
        nombre: 'Antibioterapia Respiratoria',
        descripcion: 'Tratamiento para infección respiratoria',
        medico: 'Dra. Martínez',
        especialidad: 'Medicina General',
        fechaInicio: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        fechaFin: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        duracionEstimada: 10,
        estado: 'activo',
        medicamentos: [
          {
            nombre: 'Amoxicilina',
            dosis: '875mg',
            frecuencia: 'cada 12 horas',
            horarios: ['08:00', '20:00']
          }
        ],
        progreso: 50,
        categoria: 'aguda',
        notas: 'Tomar con alimentos'
      },
      {
        id: '3',
        nombre: 'Vitaminas Preventivas',
        descripcion: 'Suplemento vitamínico preventivo',
        medico: 'Dr. Ramírez',
        especialidad: 'Medicina Preventiva',
        fechaInicio: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        fechaFin: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        duracionEstimada: 90,
        estado: 'finalizado',
        medicamentos: [
          {
            nombre: 'Vitamina D3',
            dosis: '1000 UI',
            frecuencia: 'diaria',
            horarios: ['09:00']
          },
          {
            nombre: 'Complejo B',
            dosis: '1 cápsula',
            frecuencia: 'diaria',
            horarios: ['09:00']
          }
        ],
        progreso: 100,
        categoria: 'preventiva'
      },
      {
        id: '4',
        nombre: 'Fisioterapia Post-Quirúrgica',
        descripcion: 'Rehabilitación después de cirugía de rodilla',
        medico: 'Lic. Torres',
        especialidad: 'Fisioterapia',
        fechaInicio: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        duracionEstimada: 60,
        estado: 'activo',
        medicamentos: [
          {
            nombre: 'Ibuprofeno',
            dosis: '400mg',
            frecuencia: 'cada 8 horas',
            horarios: ['08:00', '16:00', '24:00']
          }
        ],
        progreso: 33,
        categoria: 'rehabilitacion',
        proximaCita: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        notas: 'Ejercicios de fortalecimiento diarios'
      }
    ];

    // Cargar de localStorage si existe, sino usar ejemplos
    const stored = localStorage.getItem('medialert_tratamientos');
    if (stored) {
      this.tratamientos = JSON.parse(stored);
    } else {
      this.tratamientos = tratamientosEjemplo;
      this.guardarTratamientos();
    }

    this.filtrarTratamientos();
  }

  guardarTratamientos() {
    localStorage.setItem('medialert_tratamientos', JSON.stringify(this.tratamientos));
  }

  filtrarTratamientos() {
    let filtrados = [...this.tratamientos];

    // Filtrar por segmento
    if (this.segmentoSeleccionado === 'activos') {
      filtrados = filtrados.filter(t => t.estado === 'activo' || t.estado === 'pausado');
    } else if (this.segmentoSeleccionado === 'finalizados') {
      filtrados = filtrados.filter(t => t.estado === 'finalizado');
    }

    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const busquedaLower = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(t =>
        t.nombre.toLowerCase().includes(busquedaLower) ||
        t.descripcion.toLowerCase().includes(busquedaLower) ||
        t.medico.toLowerCase().includes(busquedaLower) ||
        t.especialidad.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtrar por categoría
    if (this.filtroCategoria !== 'todas') {
      filtrados = filtrados.filter(t => t.categoria === this.filtroCategoria);
    }

    this.tratamientosFiltrados = filtrados;
  }

  onSegmentChanged(event: any) {
    this.segmentoSeleccionado = event.detail.value;
    this.filtrarTratamientos();
  }

  onBusquedaChanged() {
    this.filtrarTratamientos();
  }

  onFiltroChanged() {
    this.filtrarTratamientos();
  }

  verDetalles(tratamiento: Tratamiento) {
    this.tratamientoSeleccionado = tratamiento;
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.tratamientoSeleccionado = null;
  }

  async mostrarAcciones(tratamiento: Tratamiento) {
    const actionSheet = await this.actionSheetController.create({
      header: `Acciones para ${tratamiento.nombre}`,
      buttons: [
        {
          text: 'Ver Detalles',
          icon: 'eye',
          handler: () => {
            this.verDetalles(tratamiento);
          }
        },
        {
          text: tratamiento.estado === 'activo' ? 'Pausar Tratamiento' : 'Reanudar Tratamiento',
          icon: tratamiento.estado === 'activo' ? 'stopCircle' : 'playCircle',
          handler: () => {
            this.toggleEstadoTratamiento(tratamiento);
          }
        },
        {
          text: 'Finalizar Tratamiento',
          icon: 'checkmarkCircle',
          handler: () => {
            this.finalizarTratamiento(tratamiento);
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async toggleEstadoTratamiento(tratamiento: Tratamiento) {
    const nuevoEstado = tratamiento.estado === 'activo' ? 'pausado' : 'activo';
    tratamiento.estado = nuevoEstado;
    this.guardarTratamientos();
    this.filtrarTratamientos();

    const alert = await this.alertController.create({
      header: 'Estado Actualizado',
      message: `El tratamiento ha sido ${nuevoEstado === 'activo' ? 'reanudado' : 'pausado'}.`,
      buttons: ['OK']
    });
    await alert.present();
  }

  async finalizarTratamiento(tratamiento: Tratamiento) {
    const alert = await this.alertController.create({
      header: 'Finalizar Tratamiento',
      message: `¿Estás seguro de que deseas finalizar el tratamiento "${tratamiento.nombre}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Finalizar',
          handler: () => {
            tratamiento.estado = 'finalizado';
            tratamiento.fechaFin = new Date().toISOString();
            tratamiento.progreso = 100;
            this.guardarTratamientos();
            this.filtrarTratamientos();
          }
        }
      ]
    });

    await alert.present();
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'activo': return 'success';
      case 'pausado': return 'warning';
      case 'finalizado': return 'medium';
      default: return 'primary';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'pausado': return 'Pausado';
      case 'finalizado': return 'Finalizado';
      default: return estado;
    }
  }

  getCategoriaTexto(categoria: string): string {
    const cat = this.categorias.find(c => c.value === categoria);
    return cat ? cat.label : categoria;
  }

  getCategoriaColor(categoria: string): string {
    switch (categoria) {
      case 'cronica': return 'danger';
      case 'aguda': return 'warning';
      case 'preventiva': return 'success';
      case 'rehabilitacion': return 'tertiary';
      default: return 'primary';
    }
  }

  calcularDiasTranscurridos(fechaInicio: string): number {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diferencia = ahora.getTime() - inicio.getTime();
    return Math.floor(diferencia / (1000 * 60 * 60 * 24));
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getTratamientosActivos(): number {
    return this.tratamientos.filter(t => t.estado === 'activo').length;
  }

  getTratamientosFinalizados(): number {
    return this.tratamientos.filter(t => t.estado === 'finalizado').length;
  }
}
