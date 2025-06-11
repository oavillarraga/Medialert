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
  IonDatetime,
  IonTextarea,
  IonFab,
  IonFabButton,
  IonProgressBar,
  IonNote,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  clipboard,
  time,
  calendar,
  checkmarkCircle,
  closeCircle,
  warning,
  add,
  statsChart,
  checkmark,
  close,
  hourglass,
  document,
  medkit,
  today,
  analytics,
  home
} from 'ionicons/icons';

export interface RegistroDosis {
  id: string;
  medicamento: string;
  dosis: string;
  fechaHoraProgramada: string;
  fechaHoraRegistro?: string;
  estado: 'pendiente' | 'tomada' | 'omitida' | 'retrasada';
  notas?: string;
  recordatorioId: string; // vinculado al módulo de recordatorios
}

export interface EstadisticasDiarias {
  fecha: string;
  totalDosis: number;
  dosisTomadas: number;
  dosisOmitidas: number;
  dosisRetrasadas: number;
  adherencia: number; // porcentaje
}

@Component({
  selector: 'app-registro-dosis',
  templateUrl: './registro-dosis.page.html',
  styleUrls: ['./registro-dosis.page.scss'],
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
    IonDatetime,
    IonTextarea,
    IonFab,
    IonFabButton,
    IonProgressBar,
    IonNote
  ]
})
export class RegistroDosisPage implements OnInit {

  registros: RegistroDosis[] = [];
  registrosHoy: RegistroDosis[] = [];
  registrosFiltrados: RegistroDosis[] = [];

  segmentoSeleccionado: 'hoy' | 'historial' | 'estadisticas' = 'hoy';
  fechaSeleccionada: string = new Date().toISOString();

  isModalOpen = false;
  registroSeleccionado: RegistroDosis | null = null;
  notasRegistro = '';

  estadisticasSemanal: EstadisticasDiarias[] = [];
  adherenciaPromedio = 0;

  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {
        addIcons({
      clipboard,
      time,
      calendar,
      checkmarkCircle,
      closeCircle,
      warning,
      add,
      statsChart,
      checkmark,
      close,
      hourglass,
      document,
      medkit,
      today,
      analytics,
      home
    });
  }

  ngOnInit() {
    this.cargarDatos();
    this.generarRegistrosParaHoy();
  }

  cargarDatos() {
    // Cargar registros existentes
    const stored = localStorage.getItem('medialert_registros_dosis');
    if (stored) {
      this.registros = JSON.parse(stored);
    }

    this.actualizarVistas();
    this.calcularEstadisticas();
  }

  generarRegistrosParaHoy() {
    // Obtener recordatorios activos del localStorage
    const recordatorios = JSON.parse(localStorage.getItem('medialert_recordatorios') || '[]');
    const hoy = new Date();
    const fechaHoy = hoy.toISOString().split('T')[0];

    recordatorios.forEach((recordatorio: any) => {
      if (recordatorio.activo) {
        recordatorio.horarios.forEach((horario: string) => {
          const [hora, minuto] = horario.split(':');
          const fechaHoraProgramada = new Date(hoy);
          fechaHoraProgramada.setHours(parseInt(hora), parseInt(minuto), 0, 0);

          // Verificar si ya existe un registro para esta dosis hoy
          const existeRegistro = this.registros.some(r =>
            r.recordatorioId === recordatorio.id &&
            r.fechaHoraProgramada.split('T')[0] === fechaHoy &&
            r.fechaHoraProgramada.includes(horario)
          );

          if (!existeRegistro) {
            const nuevoRegistro: RegistroDosis = {
              id: `${recordatorio.id}_${fechaHoy}_${horario}`,
              medicamento: recordatorio.nombreMedicamento,
              dosis: recordatorio.dosis,
              fechaHoraProgramada: fechaHoraProgramada.toISOString(),
              estado: 'pendiente',
              recordatorioId: recordatorio.id
            };

            this.registros.push(nuevoRegistro);
          }
        });
      }
    });

    this.guardarRegistros();
    this.actualizarVistas();
  }

  guardarRegistros() {
    localStorage.setItem('medialert_registros_dosis', JSON.stringify(this.registros));
  }

  actualizarVistas() {
    const hoy = new Date().toISOString().split('T')[0];

    // Registros de hoy
    this.registrosHoy = this.registros
      .filter(r => r.fechaHoraProgramada.split('T')[0] === hoy)
      .sort((a, b) => new Date(a.fechaHoraProgramada).getTime() - new Date(b.fechaHoraProgramada).getTime());

    // Registros filtrados por fecha seleccionada
    const fechaFiltro = this.fechaSeleccionada.split('T')[0];
    this.registrosFiltrados = this.registros
      .filter(r => r.fechaHoraProgramada.split('T')[0] === fechaFiltro)
      .sort((a, b) => new Date(a.fechaHoraProgramada).getTime() - new Date(b.fechaHoraProgramada).getTime());
  }

  onSegmentChanged(event: any) {
    this.segmentoSeleccionado = event.detail.value;
    if (this.segmentoSeleccionado === 'estadisticas') {
      this.calcularEstadisticas();
    }
  }

  onFechaChanged() {
    this.actualizarVistas();
  }

  async marcarDosis(registro: RegistroDosis, estado: 'tomada' | 'omitida') {
    registro.estado = estado;
    registro.fechaHoraRegistro = new Date().toISOString();

    // Si es una dosis tomada después de la hora programada, marcar como retrasada
    const ahora = new Date();
    const horaPrograma = new Date(registro.fechaHoraProgramada);
    const diferencia = ahora.getTime() - horaPrograma.getTime();
    const minutosRetraso = Math.floor(diferencia / (1000 * 60));

    if (estado === 'tomada' && minutosRetraso > 30) {
      registro.estado = 'retrasada';
    }

    this.guardarRegistros();
    this.actualizarVistas();
    this.calcularEstadisticas();

    const toast = await this.toastController.create({
      message: `Dosis marcada como ${estado === 'tomada' ? 'tomada' : 'omitida'}`,
      duration: 2000,
      color: estado === 'tomada' ? 'success' : 'warning',
      position: 'bottom'
    });
    await toast.present();
  }

  async agregarNotas(registro: RegistroDosis) {
    this.registroSeleccionado = registro;
    this.notasRegistro = registro.notas || '';
    this.isModalOpen = true;
  }

  guardarNotas() {
    if (this.registroSeleccionado) {
      this.registroSeleccionado.notas = this.notasRegistro;
      this.guardarRegistros();
    }
    this.cerrarModal();
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.registroSeleccionado = null;
    this.notasRegistro = '';
  }

  calcularEstadisticas() {
    const hoy = new Date();
    const estadisticas: EstadisticasDiarias[] = [];

    // Calcular estadísticas de los últimos 7 días
    for (let i = 6; i >= 0; i--) {
      const fecha = new Date(hoy);
      fecha.setDate(fecha.getDate() - i);
      const fechaStr = fecha.toISOString().split('T')[0];

      const registrosDia = this.registros.filter(r =>
        r.fechaHoraProgramada.split('T')[0] === fechaStr
      );

      const totalDosis = registrosDia.length;
      const dosisTomadas = registrosDia.filter(r => r.estado === 'tomada').length;
      const dosisRetrasadas = registrosDia.filter(r => r.estado === 'retrasada').length;
      const dosisOmitidas = registrosDia.filter(r => r.estado === 'omitida').length;

      const adherencia = totalDosis > 0 ?
        Math.round(((dosisTomadas + dosisRetrasadas) / totalDosis) * 100) : 0;

      estadisticas.push({
        fecha: fechaStr,
        totalDosis,
        dosisTomadas,
        dosisOmitidas,
        dosisRetrasadas,
        adherencia
      });
    }

    this.estadisticasSemanal = estadisticas;

    // Calcular adherencia promedio
    const adherencias = estadisticas.filter(e => e.totalDosis > 0).map(e => e.adherencia);
    this.adherenciaPromedio = adherencias.length > 0 ?
      Math.round(adherencias.reduce((a, b) => a + b, 0) / adherencias.length) : 0;
  }

  getEstadoColor(estado: string): string {
    switch (estado) {
      case 'tomada': return 'success';
      case 'retrasada': return 'warning';
      case 'omitida': return 'danger';
      case 'pendiente': return 'medium';
      default: return 'primary';
    }
  }

  getEstadoTexto(estado: string): string {
    switch (estado) {
      case 'tomada': return 'Tomada';
      case 'retrasada': return 'Retrasada';
      case 'omitida': return 'Omitida';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  }

  getEstadoIcon(estado: string): string {
    switch (estado) {
      case 'tomada': return 'checkmarkCircle';
      case 'retrasada': return 'warning';
      case 'omitida': return 'closeCircle';
      case 'pendiente': return 'hourglass';
      default: return 'help';
    }
  }

  formatearHora(fechaHora: string): string {
    return new Date(fechaHora).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  formatearFechaCorta(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short'
    });
  }

  getDosisHoyPendientes(): number {
    return this.registrosHoy.filter(r => r.estado === 'pendiente').length;
  }

  getDosisHoyTomadas(): number {
    return this.registrosHoy.filter(r => r.estado === 'tomada' || r.estado === 'retrasada').length;
  }

  getAdherenciaHoy(): number {
    const total = this.registrosHoy.length;
    const tomadas = this.getDosisHoyTomadas();
    return total > 0 ? Math.round((tomadas / total) * 100) : 0;
  }

  async confirmarAccion(registro: RegistroDosis, accion: 'tomada' | 'omitida') {
    const alert = await this.alertController.create({
      header: 'Confirmar acción',
      message: `¿Confirmas que quieres marcar la dosis de ${registro.medicamento} como ${accion}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.marcarDosis(registro, accion);
          }
        }
      ]
    });

    await alert.present();
  }

  esDosisVencida(registro: RegistroDosis): boolean {
    if (registro.estado !== 'pendiente') return false;

    const ahora = new Date();
    const horaPrograma = new Date(registro.fechaHoraProgramada);
    const diferencia = ahora.getTime() - horaPrograma.getTime();
    const minutosRetraso = Math.floor(diferencia / (1000 * 60));

    return minutosRetraso > 60; // Consideramos vencida después de 1 hora
  }
}
