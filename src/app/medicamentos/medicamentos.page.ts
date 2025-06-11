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
  IonInput,
  IonIcon,
  IonFab,
  IonFabButton,
  IonModal,
  IonButtons,
  IonTextarea,
  IonDatetime,
  IonChip,
  IonBadge,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonNote,
  AlertController,
  ToastController,
  ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  medkit,
  add,
  create,
  trash,
  eye,
  search,
  filter,
  save,
  close,
  home,
  warning,
  calendar,
  information,
  document,
  checkmark,
  ellipsisHorizontal
} from 'ionicons/icons';

export interface Medicamento {
  id: string;
  nombre: string;
  principioActivo: string;
  concentracion: string;
  formaFarmaceutica: string;
  fabricante: string;
  lote?: string;
  fechaVencimiento: string;
  categoria: 'analgesico' | 'antibiotico' | 'antiinflamatorio' | 'cardiovascular' | 'digestivo' | 'respiratorio' | 'hormonal' | 'vitamina' | 'otro';
  indicaciones: string;
  contraindicaciones?: string;
  efectosSecundarios?: string;
  dosisRecomendada?: string;
  notasPersonales?: string;
  activo: boolean;
  fechaCreacion: string;
  fechaModificacion: string;
}

@Component({
  selector: 'app-medicamentos',
  templateUrl: './medicamentos.page.html',
  styleUrls: ['./medicamentos.page.scss'],
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
    IonInput,
    IonIcon,
    IonFab,
    IonFabButton,
    IonModal,
    IonButtons,
    IonTextarea,
    IonDatetime,
    IonChip,
    IonBadge,
    IonSearchbar,
    IonGrid,
    IonRow,
    IonCol,
    IonNote
  ]
})
export class MedicamentosPage implements OnInit {

  medicamentos: Medicamento[] = [];
  medicamentosFiltrados: Medicamento[] = [];

  isModalOpen = false;
  editando = false;
  medicamentoSeleccionado: Medicamento | null = null;

  busqueda = '';
  filtroCategoria = 'todas';
  filtroEstado = 'todos';

  nuevoMedicamento: Partial<Medicamento> = {};

  categorias = [
    { value: 'todas', label: 'Todas las categorías' },
    { value: 'analgesico', label: 'Analgésico' },
    { value: 'antibiotico', label: 'Antibiótico' },
    { value: 'antiinflamatorio', label: 'Antiinflamatorio' },
    { value: 'cardiovascular', label: 'Cardiovascular' },
    { value: 'digestivo', label: 'Digestivo' },
    { value: 'respiratorio', label: 'Respiratorio' },
    { value: 'hormonal', label: 'Hormonal' },
    { value: 'vitamina', label: 'Vitamina/Suplemento' },
    { value: 'otro', label: 'Otro' }
  ];

  formasFarmaceuticas = [
    'Tableta',
    'Cápsula',
    'Jarabe',
    'Suspensión',
    'Gotas',
    'Crema',
    'Pomada',
    'Gel',
    'Inyección',
    'Supositorio',
    'Parche',
    'Inhalador',
    'Otro'
  ];

  constructor(
    private alertController: AlertController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController
  ) {
    addIcons({
      medkit,
      add,
      create,
      trash,
      eye,
      search,
      filter,
      save,
      close,
      home,
      warning,
      calendar,
      information,
      document,
      checkmark,
      ellipsisHorizontal
    });
  }

  ngOnInit() {
    this.cargarMedicamentos();
    this.resetearFormulario();
  }

  cargarMedicamentos() {
    // Datos de ejemplo
    const medicamentosEjemplo: Medicamento[] = [
      {
        id: '1',
        nombre: 'Ibuprofeno',
        principioActivo: 'Ibuprofeno',
        concentracion: '400mg',
        formaFarmaceutica: 'Tableta',
        fabricante: 'Laboratorios XYZ',
        lote: 'ABC123',
        fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        categoria: 'antiinflamatorio',
        indicaciones: 'Dolor e inflamación',
        contraindicaciones: 'Úlceras pépticas, alergia al ibuprofeno',
        efectosSecundarios: 'Molestias gastrointestinales, mareos',
        dosisRecomendada: '400mg cada 8 horas',
        activo: true,
        fechaCreacion: new Date().toISOString(),
        fechaModificacion: new Date().toISOString()
      },
      {
        id: '2',
        nombre: 'Amoxicilina',
        principioActivo: 'Amoxicilina',
        concentracion: '500mg',
        formaFarmaceutica: 'Cápsula',
        fabricante: 'Farmacia ABC',
        fechaVencimiento: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        categoria: 'antibiotico',
        indicaciones: 'Infecciones bacterianas',
        contraindicaciones: 'Alergia a penicilinas',
        efectosSecundarios: 'Diarrea, náuseas, erupciones cutáneas',
        dosisRecomendada: '500mg cada 8 horas',
        activo: true,
        fechaCreacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        fechaModificacion: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        nombre: 'Vitamina D3',
        principioActivo: 'Colecalciferol',
        concentracion: '1000 UI',
        formaFarmaceutica: 'Cápsula',
        fabricante: 'NutriLab',
        fechaVencimiento: new Date(Date.now() + 730 * 24 * 60 * 60 * 1000).toISOString(),
        categoria: 'vitamina',
        indicaciones: 'Deficiencia de vitamina D, fortalecimiento óseo',
        dosisRecomendada: '1 cápsula diaria',
        notasPersonales: 'Tomar preferiblemente con comida',
        activo: true,
        fechaCreacion: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        fechaModificacion: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    // Cargar de localStorage si existe, sino usar ejemplos
    const stored = localStorage.getItem('medialert_medicamentos');
    if (stored) {
      this.medicamentos = JSON.parse(stored);
    } else {
      this.medicamentos = medicamentosEjemplo;
      this.guardarMedicamentos();
    }

    this.filtrarMedicamentos();
  }

  guardarMedicamentos() {
    localStorage.setItem('medialert_medicamentos', JSON.stringify(this.medicamentos));
  }

  filtrarMedicamentos() {
    let filtrados = [...this.medicamentos];

    // Filtrar por búsqueda
    if (this.busqueda.trim()) {
      const busquedaLower = this.busqueda.toLowerCase();
      filtrados = filtrados.filter(m =>
        m.nombre.toLowerCase().includes(busquedaLower) ||
        m.principioActivo.toLowerCase().includes(busquedaLower) ||
        m.fabricante.toLowerCase().includes(busquedaLower) ||
        m.indicaciones.toLowerCase().includes(busquedaLower)
      );
    }

    // Filtrar por categoría
    if (this.filtroCategoria !== 'todas') {
      filtrados = filtrados.filter(m => m.categoria === this.filtroCategoria);
    }

    // Filtrar por estado
    if (this.filtroEstado === 'activos') {
      filtrados = filtrados.filter(m => m.activo);
    } else if (this.filtroEstado === 'inactivos') {
      filtrados = filtrados.filter(m => !m.activo);
    }

    // Ordenar por nombre
    filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

    this.medicamentosFiltrados = filtrados;
  }

  onBusquedaChanged() {
    this.filtrarMedicamentos();
  }

  onFiltroChanged() {
    this.filtrarMedicamentos();
  }

  abrirModal(medicamento?: Medicamento) {
    if (medicamento) {
      this.editando = true;
      this.medicamentoSeleccionado = medicamento;
      this.nuevoMedicamento = { ...medicamento };
    } else {
      this.editando = false;
      this.medicamentoSeleccionado = null;
      this.resetearFormulario();
    }
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.medicamentoSeleccionado = null;
    this.resetearFormulario();
  }

  resetearFormulario() {
    this.nuevoMedicamento = {
      nombre: '',
      principioActivo: '',
      concentracion: '',
      formaFarmaceutica: '',
      fabricante: '',
      lote: '',
      fechaVencimiento: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      categoria: 'otro',
      indicaciones: '',
      contraindicaciones: '',
      efectosSecundarios: '',
      dosisRecomendada: '',
      notasPersonales: '',
      activo: true
    };
  }

  async guardarMedicamento() {
    if (!this.nuevoMedicamento.nombre ||
        !this.nuevoMedicamento.principioActivo ||
        !this.nuevoMedicamento.concentracion ||
        !this.nuevoMedicamento.fabricante) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor completa todos los campos obligatorios: nombre, principio activo, concentración y fabricante.',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const ahora = new Date().toISOString();

    if (this.editando && this.medicamentoSeleccionado) {
      // Actualizar medicamento existente
      const index = this.medicamentos.findIndex(m => m.id === this.medicamentoSeleccionado!.id);
      this.medicamentos[index] = {
        ...this.nuevoMedicamento as Medicamento,
        id: this.medicamentoSeleccionado.id,
        fechaCreacion: this.medicamentoSeleccionado.fechaCreacion,
        fechaModificacion: ahora
      };
    } else {
      // Crear nuevo medicamento
      const nuevo: Medicamento = {
        ...this.nuevoMedicamento as Medicamento,
        id: Date.now().toString(),
        fechaCreacion: ahora,
        fechaModificacion: ahora
      };
      this.medicamentos.push(nuevo);
    }

    this.guardarMedicamentos();
    this.filtrarMedicamentos();
    this.cerrarModal();

    const toast = await this.toastController.create({
      message: `Medicamento ${this.editando ? 'actualizado' : 'agregado'} correctamente`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async mostrarAcciones(medicamento: Medicamento) {
    const actionSheet = await this.actionSheetController.create({
      header: `Acciones para ${medicamento.nombre}`,
      buttons: [
        {
          text: 'Ver Detalles',
          icon: 'eye',
          handler: () => {
            this.verDetalles(medicamento);
          }
        },
        {
          text: 'Editar',
          icon: 'create',
          handler: () => {
            this.abrirModal(medicamento);
          }
        },
        {
          text: medicamento.activo ? 'Desactivar' : 'Activar',
          icon: medicamento.activo ? 'close' : 'checkmark',
          handler: () => {
            this.toggleEstado(medicamento);
          }
        },
        {
          text: 'Eliminar',
          icon: 'trash',
          role: 'destructive',
          handler: () => {
            this.eliminarMedicamento(medicamento);
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

  verDetalles(medicamento: Medicamento) {
    this.medicamentoSeleccionado = medicamento;
    // Aquí podrías abrir un modal de solo lectura con todos los detalles
  }

  async toggleEstado(medicamento: Medicamento) {
    medicamento.activo = !medicamento.activo;
    medicamento.fechaModificacion = new Date().toISOString();
    this.guardarMedicamentos();
    this.filtrarMedicamentos();

    const toast = await this.toastController.create({
      message: `Medicamento ${medicamento.activo ? 'activado' : 'desactivado'}`,
      duration: 2000,
      color: medicamento.activo ? 'success' : 'warning',
      position: 'bottom'
    });
    await toast.present();
  }

  async eliminarMedicamento(medicamento: Medicamento) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar "${medicamento.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.medicamentos = this.medicamentos.filter(m => m.id !== medicamento.id);
            this.guardarMedicamentos();
            this.filtrarMedicamentos();

            this.toastController.create({
              message: 'Medicamento eliminado correctamente',
              duration: 2000,
              color: 'success',
              position: 'bottom'
            }).then(toast => toast.present());
          }
        }
      ]
    });

    await alert.present();
  }

  getCategoriaTexto(categoria: string): string {
    const cat = this.categorias.find(c => c.value === categoria);
    return cat ? cat.label : categoria;
  }

  getCategoriaColor(categoria: string): string {
    switch (categoria) {
      case 'analgesico': return 'success';
      case 'antibiotico': return 'danger';
      case 'antiinflamatorio': return 'warning';
      case 'cardiovascular': return 'primary';
      case 'digestivo': return 'secondary';
      case 'respiratorio': return 'tertiary';
      case 'hormonal': return 'medium';
      case 'vitamina': return 'success';
      default: return 'medium';
    }
  }

  estaVencido(fechaVencimiento: string): boolean {
    return new Date(fechaVencimiento) < new Date();
  }

  diasParaVencer(fechaVencimiento: string): number {
    const hoy = new Date();
    const vencimiento = new Date(fechaVencimiento);
    const diferencia = vencimiento.getTime() - hoy.getTime();
    return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getMedicamentosActivos(): number {
    return this.medicamentos.filter(m => m.activo).length;
  }

  getMedicamentosVencidos(): number {
    return this.medicamentos.filter(m => this.estaVencido(m.fechaVencimiento)).length;
  }

  getMedicamentosPorVencer(): number {
    return this.medicamentos.filter(m => {
      const dias = this.diasParaVencer(m.fechaVencimiento);
      return dias > 0 && dias <= 30;
    }).length;
  }

  get fechaMinima(): string {
    return new Date().toISOString().split('T')[0];
  }
}
