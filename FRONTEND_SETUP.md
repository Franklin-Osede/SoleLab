# Setup Frontend Angular - SoleLab

## 🚀 Inicio Rápido

### 1. Crear Proyecto Angular

```bash
# Instalar Angular CLI si no lo tienes
npm install -g @angular/cli

# Crear nuevo proyecto
ng new solelab-frontend
cd solelab-frontend

# Seleccionar:
# - Routing: Yes
# - Stylesheet: CSS o SCSS
```

### 2. Instalar Dependencias

```bash
# Three.js para visualización 3D
npm install three @types/three

# HTTP Client (ya viene con Angular)
# RxJS (ya viene con Angular)

# Angular Material (opcional, para UI)
ng add @angular/material
```

### 3. Configurar Proxy para API

Crear `proxy.conf.json` en la raíz del proyecto:

```json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false,
    "changeOrigin": true
  }
}
```

Actualizar `angular.json`:

```json
{
  "projects": {
    "solelab-frontend": {
      "architect": {
        "serve": {
          "options": {
            "proxyConfig": "proxy.conf.json"
          }
        }
      }
    }
  }
}
```

### 4. Estructura de Carpetas

```
src/
├── app/
│   ├── core/
│   │   ├── services/
│   │   │   ├── design.service.ts
│   │   │   └── api.service.ts
│   │   └── models/
│   │       └── design.model.ts
│   ├── features/
│   │   ├── design/
│   │   │   ├── components/
│   │   │   │   ├── design-form/
│   │   │   │   ├── design-card/
│   │   │   │   └── design-gallery/
│   │   │   └── pages/
│   │   │       ├── generate/
│   │   │       └── designs/
│   │   └── three-viewer/
│   │       └── components/
│   │           └── sneaker-viewer/
│   ├── shared/
│   │   ├── components/
│   │   └── pipes/
│   └── app.component.ts
├── assets/
└── environments/
    ├── environment.ts
    └── environment.prod.ts
```

### 5. Servicio de API

Crear `src/app/core/services/design.service.ts`:

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Design, GenerateDesignRequest } from '../models/design.model';

@Injectable({
  providedIn: 'root'
})
export class DesignService {
  private apiUrl = '/api/v1/designs';

  constructor(private http: HttpClient) {}

  generateDesign(request: GenerateDesignRequest): Observable<Design> {
    return this.http.post<Design>(this.apiUrl, request);
  }

  getDesign(id: string): Observable<Design> {
    return this.http.get<Design>(`${this.apiUrl}/${id}`);
  }

  getUserDesigns(userId: string): Observable<Design[]> {
    return this.http.get<Design[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAllDesigns(): Observable<Design[]> {
    return this.http.get<Design[]>(this.apiUrl);
  }
}
```

### 6. Modelos

Crear `src/app/core/models/design.model.ts`:

```typescript
export interface Design {
  id: string;
  userId: string;
  imageUrl: string;
  style: string;
  colors: string[];
  prompt: string;
  metadataUri?: string;
  tokenId?: number;
  createdAt: string;
}

export interface GenerateDesignRequest {
  userId: string;
  basePrompt: string;
  style: 'futuristic' | 'retro' | 'minimalist' | 'sporty' | 'luxury' | 'streetwear';
  colors: string[];
}
```

### 7. Componente de Generación

Crear `src/app/features/design/pages/generate/generate.component.ts`:

```typescript
import { Component } from '@angular/core';
import { DesignService } from '../../../../core/services/design.service';
import { GenerateDesignRequest } from '../../../../core/models/design.model';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent {
  request: GenerateDesignRequest = {
    userId: '', // TODO: Obtener del auth
    basePrompt: '',
    style: 'futuristic',
    colors: ['#FF0000']
  };

  loading = false;
  error: string | null = null;

  constructor(private designService: DesignService) {}

  generate() {
    this.loading = true;
    this.error = null;

    this.designService.generateDesign(this.request).subscribe({
      next: (design) => {
        console.log('Design generated:', design);
        this.loading = false;
        // Navegar a página de diseño
      },
      error: (err) => {
        this.error = err.error?.message || 'Error generating design';
        this.loading = false;
      }
    });
  }
}
```

### 8. Three.js Viewer

Crear `src/app/features/three-viewer/components/sneaker-viewer/sneaker-viewer.component.ts`:

```typescript
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-sneaker-viewer',
  templateUrl: './sneaker-viewer.component.html',
  styleUrls: ['./sneaker-viewer.component.css']
})
export class SneakerViewerComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationId?: number;

  ngOnInit() {
    this.initThree();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.renderer.dispose();
  }

  private initThree() {
    const canvas = this.canvasRef.nativeElement;
    
    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 0, 5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // TODO: Cargar modelo 3D del sneaker
    // Por ahora, un cubo de ejemplo
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);

    // Lights
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    this.scene.add(light);
  }

  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());
    this.renderer.render(this.scene, this.camera);
  }
}
```

### 9. Routing

Actualizar `src/app/app-routing.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenerateComponent } from './features/design/pages/generate/generate.component';

const routes: Routes = [
  { path: '', redirectTo: '/generate', pathMatch: 'full' },
  { path: 'generate', component: GenerateComponent },
  { path: 'designs', loadChildren: () => import('./features/design/design.module').then(m => m.DesignModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

## 📝 Próximos Pasos

1. **Autenticación**
   - JWT tokens
   - Auth guard
   - User service

2. **UI/UX**
   - Angular Material components
   - Responsive design
   - Loading states
   - Error handling

3. **Three.js Avanzado**
   - Cargar modelos 3D reales
   - Interactividad (rotar, zoom)
   - Animaciones

4. **Blockchain Integration**
   - Web3 provider
   - MetaMask connection
   - NFT display

## 🚀 Comandos

```bash
# Desarrollo
ng serve

# Build
ng build

# Tests
ng test

# Lint
ng lint
```

