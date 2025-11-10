import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  Design, 
  GenerateDesignRequest, 
  GenerateDesignResponse,
  DesignFilters,
  PaginatedDesignsResponse
} from '../models/design.model';

/**
 * Design Service
 * 
 * RAZÓN DE DISEÑO:
 * - Maneja todas las operaciones relacionadas con diseños
 * - Centraliza lógica de API de diseños
 * - Facilita reutilización y testing
 */
@Injectable({
  providedIn: 'root'
})
export class DesignService {
  constructor(private apiService: ApiService) {}

  /**
   * Genera un nuevo diseño
   */
  generateDesign(request: GenerateDesignRequest): Observable<GenerateDesignResponse> {
    return this.apiService.post<GenerateDesignResponse>('/designs', request);
  }

  /**
   * Obtiene un diseño por ID
   */
  getDesignById(id: string): Observable<Design> {
    return this.apiService.get<Design>(`/designs/${id}`);
  }

  /**
   * Obtiene todos los diseños de un usuario
   */
  getUserDesigns(userId: string): Observable<Design[]> {
    return this.apiService.get<Design[]>(`/designs/user/${userId}`);
  }

  /**
   * Obtiene todos los diseños (con paginación y filtros)
   */
  getAllDesigns(filters?: DesignFilters): Observable<PaginatedDesignsResponse> {
    return this.apiService.get<PaginatedDesignsResponse>('/designs', filters);
  }
}

