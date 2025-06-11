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
  IonButtons,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonDatetime,
  IonCheckbox,
  IonSegment,
  IonSegmentButton,
  IonNote,
  IonBadge,
  IonChip,
  IonSpinner,
  LoadingController,
  ToastController,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  document,
  download,
  calendar,
  medical,
  analytics,
  list,
  home,
  checkmark,
  close,
  print,
  share,
  time,
  pulse,
  medkit,
  clipboard,
  eye,
  arrowBack,
  settings
} from 'ionicons/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Interfaces de otros módulos
interface Recordatorio {
  id: string;
  medicamento: string;
  dosis: string;
  horarios: string[];
  frecuencia: string;
  fechaInicio: string;
  fechaFin?: string;
  activo: boolean;
}

interface Medicamento {
  id: string;
  nombre: string;
  principioActivo: string;
  concentracion: string;
  formaFarmaceutica: string;
  fabricante: string;
  fechaVencimiento: string;
  categoria: string;
  indicaciones: string;
  activo: boolean;
}

interface DosisRegistrada {
  id: string;
  medicamento: string;
  dosis: string;
  fecha: string;
  hora: string;
  estado: 'tomada' | 'perdida' | 'retrasada' | 'pendiente';
  notas?: string;
}

interface Tratamiento {
  id: string;
  nombre: string;
  medicamentos: string[];
  doctor: string;
  fechaInicio: string;
  fechaFin?: string;
  estado: 'activo' | 'pausado' | 'finalizado';
}

export interface TipoInforme {
  id: string;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
  requiereFechas: boolean;
  requireMedicamentos: boolean;
}

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
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
    IonButtons,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonDatetime,
    IonCheckbox,
    IonSegment,
    IonSegmentButton,
    IonNote,
    IonBadge,
    IonChip,
    IonSpinner
  ]
})
export class InformesPage implements OnInit {

  vistaActual = 'tipos';
  tipoInformeSeleccionado: TipoInforme | null = null;

  // Parámetros para generar informes
  fechaInicio = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  fechaFin = new Date().toISOString();
  medicamentosSeleccionados: string[] = [];
  incluirGraficos = true;
  incluirEstadisticas = true;

  // Datos cargados de otros módulos
  recordatorios: Recordatorio[] = [];
  medicamentos: Medicamento[] = [];
  dosisRegistradas: DosisRegistrada[] = [];
  tratamientos: Tratamiento[] = [];

  generandoInforme = false;

  tiposInformes: TipoInforme[] = [
    {
      id: 'adherencia',
      nombre: 'Informe de Adherencia',
      descripcion: 'Análisis detallado del cumplimiento de tratamientos y dosis',
      icono: 'pulse',
      color: 'success',
      requiereFechas: true,
      requireMedicamentos: false
    },
    {
      id: 'medicamentos',
      nombre: 'Inventario de Medicamentos',
      descripcion: 'Lista completa de medicamentos con fechas de vencimiento',
      icono: 'medkit',
      color: 'primary',
      requiereFechas: false,
      requireMedicamentos: false
    },
    {
      id: 'historial-dosis',
      nombre: 'Historial de Dosis',
      descripcion: 'Registro cronológico de todas las dosis tomadas',
      icono: 'clipboard',
      color: 'secondary',
      requiereFechas: true,
      requireMedicamentos: true
    },
    {
      id: 'recordatorios',
      nombre: 'Calendario de Recordatorios',
      descripcion: 'Horarios y frecuencias programadas de medicamentos',
      icono: 'calendar',
      color: 'tertiary',
      requiereFechas: false,
      requireMedicamentos: true
    },
    {
      id: 'tratamientos',
      nombre: 'Resumen de Tratamientos',
      descripcion: 'Estado y progreso de tratamientos médicos',
      icono: 'medical',
      color: 'warning',
      requiereFechas: true,
      requireMedicamentos: false
    },
    {
      id: 'estadisticas',
      nombre: 'Estadísticas Generales',
      descripcion: 'Análisis estadístico completo de la medicación',
      icono: 'analytics',
      color: 'danger',
      requiereFechas: true,
      requireMedicamentos: false
    }
  ];

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
        addIcons({
      document,
      download,
      calendar,
      medical,
      analytics,
      list,
      home,
      checkmark,
      close,
      print,
      share,
      time,
      pulse,
      medkit,
      clipboard,
      eye,
      arrowBack,
      settings
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // Cargar datos de localStorage de otros módulos
    const recordatoriosData = localStorage.getItem('medialert_recordatorios');
    if (recordatoriosData) {
      this.recordatorios = JSON.parse(recordatoriosData);
    }

    const medicamentosData = localStorage.getItem('medialert_medicamentos');
    if (medicamentosData) {
      this.medicamentos = JSON.parse(medicamentosData);
    }

    const dosisData = localStorage.getItem('medialert_dosis');
    if (dosisData) {
      this.dosisRegistradas = JSON.parse(dosisData);
    }

    const tratamientosData = localStorage.getItem('medialert_tratamientos');
    if (tratamientosData) {
      this.tratamientos = JSON.parse(tratamientosData);
    }
  }

  seleccionarTipoInforme(tipo: TipoInforme) {
    this.tipoInformeSeleccionado = tipo;
    this.vistaActual = 'configuracion';

    // Preseleccionar todos los medicamentos si es requerido
    if (tipo.requireMedicamentos) {
      this.medicamentosSeleccionados = this.medicamentos.map(m => m.id);
    }
  }

  volver() {
    if (this.vistaActual === 'configuracion') {
      this.vistaActual = 'tipos';
      this.tipoInformeSeleccionado = null;
    }
  }

  onMedicamentoSeleccionado(medicamentoId: string, event: any) {
    if (event.detail.checked) {
      if (!this.medicamentosSeleccionados.includes(medicamentoId)) {
        this.medicamentosSeleccionados.push(medicamentoId);
      }
    } else {
      this.medicamentosSeleccionados = this.medicamentosSeleccionados.filter(id => id !== medicamentoId);
    }
  }

  seleccionarTodosMedicamentos() {
    this.medicamentosSeleccionados = this.medicamentos.map(m => m.id);
  }

  deseleccionarTodosMedicamentos() {
    this.medicamentosSeleccionados = [];
  }

  async generarInforme() {
    if (!this.tipoInformeSeleccionado) return;

    this.generandoInforme = true;
    const loading = await this.loadingController.create({
      message: 'Generando informe PDF...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      switch (this.tipoInformeSeleccionado.id) {
        case 'adherencia':
          await this.generarInformeAdherencia();
          break;
        case 'medicamentos':
          await this.generarInformeMedicamentos();
          break;
        case 'historial-dosis':
          await this.generarInformeHistorialDosis();
          break;
        case 'recordatorios':
          await this.generarInformeRecordatorios();
          break;
        case 'tratamientos':
          await this.generarInformeTratamientos();
          break;
        case 'estadisticas':
          await this.generarInformeEstadisticas();
          break;
      }

      const toast = await this.toastController.create({
        message: 'Informe generado y descargado exitosamente',
        duration: 3000,
        color: 'success',
        position: 'bottom'
      });
      await toast.present();

    } catch (error) {
      console.error('Error generando informe:', error);

      const alert = await this.alertController.create({
        header: 'Error',
        message: 'No se pudo generar el informe. Intenta nuevamente.',
        buttons: ['OK']
      });
      await alert.present();
    } finally {
      this.generandoInforme = false;
      await loading.dismiss();
    }
  }

  private async generarInformeAdherencia() {
    const doc = new jsPDF();

    // Header
    this.agregarHeader(doc, 'Informe de Adherencia al Tratamiento');

    let yPosition = 40;

    // Información del periodo
    doc.setFontSize(12);
    doc.text(`Periodo: ${this.formatearFecha(this.fechaInicio)} - ${this.formatearFecha(this.fechaFin)}`, 20, yPosition);
    yPosition += 20;

    // Calcular estadísticas de adherencia
    const dosisEnPeriodo = this.obtenerDosisEnPeriodo();
    const totalDosis = dosisEnPeriodo.length;
    const dosesTomadas = dosisEnPeriodo.filter(d => d.estado === 'tomada').length;
    const dosisPerdidas = dosisEnPeriodo.filter(d => d.estado === 'perdida').length;
    const dosisRetrasadas = dosisEnPeriodo.filter(d => d.estado === 'retrasada').length;

    const porcentajeAdherencia = totalDosis > 0 ? Math.round((dosesTomadas / totalDosis) * 100) : 0;

    // Resumen de adherencia
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Adherencia', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Adherencia General: ${porcentajeAdherencia}%`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total de Dosis Programadas: ${totalDosis}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Dosis Tomadas: ${dosesTomadas}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Dosis Perdidas: ${dosisPerdidas}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Dosis Retrasadas: ${dosisRetrasadas}`, 20, yPosition);
    yPosition += 20;

    // Tabla detallada por medicamento
    const datosPorMedicamento = this.calcularAdherenciaPorMedicamento(dosisEnPeriodo);

    autoTable(doc, {
      startY: yPosition,
      head: [['Medicamento', 'Programadas', 'Tomadas', 'Perdidas', 'Adherencia %']],
      body: datosPorMedicamento.map(item => [
        item.medicamento,
        item.programadas.toString(),
        item.tomadas.toString(),
        item.perdidas.toString(),
        `${item.adherencia}%`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    // Footer
    this.agregarFooter(doc);

    // Descargar
    doc.save(`MediAlert_Adherencia_${this.formatearFechaArchivo(new Date())}.pdf`);
  }

  private async generarInformeMedicamentos() {
    const doc = new jsPDF();

    this.agregarHeader(doc, 'Inventario de Medicamentos');

    // Preparar datos para la tabla
    const medicamentosActivos = this.medicamentos.filter(m => m.activo);
    const datosTabla = medicamentosActivos.map(med => [
      med.nombre,
      med.principioActivo,
      med.concentracion,
      med.formaFarmaceutica,
      med.fabricante,
      this.formatearFecha(med.fechaVencimiento),
      this.estaVencido(med.fechaVencimiento) ? 'VENCIDO' :
        this.diasParaVencer(med.fechaVencimiento) <= 30 ? 'POR VENCER' : 'VIGENTE'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Medicamento', 'Principio Activo', 'Concentración', 'Forma', 'Fabricante', 'Vencimiento', 'Estado']],
      body: datosTabla,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 },
      columnStyles: {
        6: {
          cellWidth: 25,
          halign: 'center'
        }
      }
    });

    this.agregarFooter(doc);
    doc.save(`MediAlert_Medicamentos_${this.formatearFechaArchivo(new Date())}.pdf`);
  }

  private async generarInformeHistorialDosis() {
    const doc = new jsPDF();

    this.agregarHeader(doc, 'Historial de Dosis');

    let yPosition = 40;

    // Información del periodo
    doc.setFontSize(12);
    doc.text(`Periodo: ${this.formatearFecha(this.fechaInicio)} - ${this.formatearFecha(this.fechaFin)}`, 20, yPosition);
    yPosition += 20;

    const dosisEnPeriodo = this.obtenerDosisEnPeriodo()
      .filter(d => this.medicamentosSeleccionados.length === 0 ||
                   this.medicamentosSeleccionados.some(id => {
                     const med = this.medicamentos.find(m => m.id === id);
                     return med && d.medicamento === med.nombre;
                   }))
      .sort((a, b) => new Date(b.fecha + 'T' + b.hora).getTime() - new Date(a.fecha + 'T' + a.hora).getTime());

    const datosTabla = dosisEnPeriodo.map(dosis => [
      this.formatearFecha(dosis.fecha),
      dosis.hora,
      dosis.medicamento,
      dosis.dosis,
      this.obtenerEstadoTexto(dosis.estado),
      dosis.notas || '-'
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Fecha', 'Hora', 'Medicamento', 'Dosis', 'Estado', 'Notas']],
      body: datosTabla,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    this.agregarFooter(doc);
    doc.save(`MediAlert_HistorialDosis_${this.formatearFechaArchivo(new Date())}.pdf`);
  }

  private async generarInformeRecordatorios() {
    const doc = new jsPDF();

    this.agregarHeader(doc, 'Calendario de Recordatorios');

    const recordatoriosActivos = this.recordatorios.filter(r => r.activo);
    const recordatoriosFiltrados = this.medicamentosSeleccionados.length > 0 ?
      recordatoriosActivos.filter(r => {
        const med = this.medicamentos.find(m => m.nombre === r.medicamento && this.medicamentosSeleccionados.includes(m.id));
        return !!med;
      }) : recordatoriosActivos;

    const datosTabla = recordatoriosFiltrados.map(rec => [
      rec.medicamento,
      rec.dosis,
      rec.horarios.join(', '),
      rec.frecuencia,
      this.formatearFecha(rec.fechaInicio),
      rec.fechaFin ? this.formatearFecha(rec.fechaFin) : 'Indefinido'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [['Medicamento', 'Dosis', 'Horarios', 'Frecuencia', 'Inicio', 'Fin']],
      body: datosTabla,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    this.agregarFooter(doc);
    doc.save(`MediAlert_Recordatorios_${this.formatearFechaArchivo(new Date())}.pdf`);
  }

  private async generarInformeTratamientos() {
    const doc = new jsPDF();

    this.agregarHeader(doc, 'Resumen de Tratamientos');

    let yPosition = 40;

    // Información del periodo
    doc.setFontSize(12);
    doc.text(`Periodo: ${this.formatearFecha(this.fechaInicio)} - ${this.formatearFecha(this.fechaFin)}`, 20, yPosition);
    yPosition += 20;

    const datosTabla = this.tratamientos.map(trat => [
      trat.nombre,
      trat.medicamentos.join(', '),
      trat.doctor,
      this.formatearFecha(trat.fechaInicio),
      trat.fechaFin ? this.formatearFecha(trat.fechaFin) : 'En curso',
      this.obtenerEstadoTratamientoTexto(trat.estado)
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Tratamiento', 'Medicamentos', 'Doctor', 'Inicio', 'Fin', 'Estado']],
      body: datosTabla,
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 9 }
    });

    this.agregarFooter(doc);
    doc.save(`MediAlert_Tratamientos_${this.formatearFechaArchivo(new Date())}.pdf`);
  }

  private async generarInformeEstadisticas() {
    const doc = new jsPDF();

    this.agregarHeader(doc, 'Estadísticas Generales');

    let yPosition = 40;

    // Estadísticas generales
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen General', 20, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');

    const totalMedicamentos = this.medicamentos.filter(m => m.activo).length;
    const totalRecordatorios = this.recordatorios.filter(r => r.activo).length;
    const totalTratamientos = this.tratamientos.length;
    const dosisEnPeriodo = this.obtenerDosisEnPeriodo();
    const porcentajeAdherencia = this.calcularAdherenciaGeneral(dosisEnPeriodo);

    doc.text(`Total de Medicamentos Activos: ${totalMedicamentos}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Recordatorios Configurados: ${totalRecordatorios}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Tratamientos: ${totalTratamientos}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Adherencia General: ${porcentajeAdherencia}%`, 20, yPosition);
    yPosition += 20;

    // Estadísticas por categoría de medicamento
    const categorias = this.obtenerEstadisticasPorCategoria();

    autoTable(doc, {
      startY: yPosition,
      head: [['Categoría', 'Cantidad', 'Porcentaje']],
      body: categorias.map(cat => [
        cat.categoria,
        cat.cantidad.toString(),
        `${cat.porcentaje}%`
      ]),
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185] },
      styles: { fontSize: 10 }
    });

    this.agregarFooter(doc);
    doc.save(`MediAlert_Estadisticas_${this.formatearFechaArchivo(new Date())}.pdf`);
  }

  // Métodos auxiliares
  private agregarHeader(doc: jsPDF, titulo: string) {
    // Logo/Título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MediAlert', 20, 20);

    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text(titulo, 20, 30);

    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado el: ${this.formatearFecha(new Date().toISOString())}`, 150, 20);

    // Línea separadora
    doc.line(20, 35, 190, 35);
  }

    private agregarFooter(doc: jsPDF) {
    const pageCount = (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text('MediAlert - Sistema de Gestión de Medicamentos', 20, 285);
      doc.text(`Página ${i} de ${pageCount}`, 170, 285);
    }
  }

  private obtenerDosisEnPeriodo(): DosisRegistrada[] {
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);

    return this.dosisRegistradas.filter(dosis => {
      const fechaDosis = new Date(dosis.fecha);
      return fechaDosis >= inicio && fechaDosis <= fin;
    });
  }

  private calcularAdherenciaPorMedicamento(dosis: DosisRegistrada[]) {
    const medicamentosStats: any = {};

    dosis.forEach(d => {
      if (!medicamentosStats[d.medicamento]) {
        medicamentosStats[d.medicamento] = {
          medicamento: d.medicamento,
          programadas: 0,
          tomadas: 0,
          perdidas: 0,
          adherencia: 0
        };
      }

      medicamentosStats[d.medicamento].programadas++;
      if (d.estado === 'tomada') {
        medicamentosStats[d.medicamento].tomadas++;
      } else if (d.estado === 'perdida') {
        medicamentosStats[d.medicamento].perdidas++;
      }
    });

        Object.values(medicamentosStats).forEach((stats: any) => {
      stats.adherencia = stats.programadas > 0 ?
        Math.round((stats.tomadas / stats.programadas) * 100) : 0;
    });

    return Object.values(medicamentosStats) as any[];
  }

  private calcularAdherenciaGeneral(dosis: DosisRegistrada[]): number {
    if (dosis.length === 0) return 0;
    const tomadas = dosis.filter(d => d.estado === 'tomada').length;
    return Math.round((tomadas / dosis.length) * 100);
  }

  private obtenerEstadisticasPorCategoria() {
    const categorias: any = {};
    const total = this.medicamentos.filter(m => m.activo).length;

    this.medicamentos.filter(m => m.activo).forEach(med => {
      if (!categorias[med.categoria]) {
        categorias[med.categoria] = 0;
      }
      categorias[med.categoria]++;
    });

    return Object.entries(categorias).map(([categoria, cantidad]) => ({
      categoria: this.getCategoriaTexto(categoria),
      cantidad: cantidad as number,
      porcentaje: total > 0 ? Math.round(((cantidad as number) / total) * 100) : 0
    }));
  }

  private formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  private formatearFechaArchivo(fecha: Date): string {
    return fecha.toISOString().split('T')[0].replace(/-/g, '');
  }

  private obtenerEstadoTexto(estado: string): string {
    switch (estado) {
      case 'tomada': return 'Tomada';
      case 'perdida': return 'Perdida';
      case 'retrasada': return 'Retrasada';
      case 'pendiente': return 'Pendiente';
      default: return estado;
    }
  }

  private obtenerEstadoTratamientoTexto(estado: string): string {
    switch (estado) {
      case 'activo': return 'Activo';
      case 'pausado': return 'Pausado';
      case 'finalizado': return 'Finalizado';
      default: return estado;
    }
  }

  private getCategoriaTexto(categoria: string): string {
    const categorias: any = {
      'analgesico': 'Analgésico',
      'antibiotico': 'Antibiótico',
      'antiinflamatorio': 'Antiinflamatorio',
      'cardiovascular': 'Cardiovascular',
      'digestivo': 'Digestivo',
      'respiratorio': 'Respiratorio',
      'hormonal': 'Hormonal',
      'vitamina': 'Vitamina/Suplemento',
      'otro': 'Otro'
    };
    return categorias[categoria] || categoria;
  }

  private estaVencido(fechaVencimiento: string): boolean {
    return new Date(fechaVencimiento) < new Date();
  }

  private diasParaVencer(fechaVencimiento: string): number {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  get fechaMinima(): string {
    return new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }

  get fechaMaxima(): string {
    return new Date().toISOString().split('T')[0];
  }
}
