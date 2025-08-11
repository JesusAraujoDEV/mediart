# Testing Suite - Mediart

Este directorio contiene toda la configuración y tests del proyecto Mediart.

## Estructura

```
test/
├── package.json              # Dependencias de testing
├── vitest.config.ts          # Configuración de Vitest
├── setup.ts                  # Configuración global de tests
├── .eslintrc.js             # Configuración de ESLint
├── README.md                # Esta documentación
├── components/              # Tests de componentes
│   └── NavigationStudio.test.ts
├── pages/                   # Tests de páginas
├── composables/             # Tests de composables
├── utils/                   # Tests de utilidades
└── server/                  # Tests del backend (futuro)
```

## Instalación

```bash
cd test
npm install
```

## Comandos Disponibles

### Testing
```bash
# Ejecutar tests en modo watch
npm run test

# Ejecutar tests una vez
npm run test:run

# Ejecutar tests con UI interactiva
npm run test:ui

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en modo watch
npm run test:watch
```

### Linting y Type Checking
```bash
# Ejecutar linter
npm run lint

# Ejecutar linter y auto-fix
npm run lint:fix

# Verificar tipos TypeScript
npm run type-check
```

## Escribiendo Tests

### Test de Componente Vue
```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent)
    expect(wrapper.find('.my-class').exists()).toBe(true)
  })
})
```

### Test de Composable
```typescript
import { describe, it, expect } from 'vitest'
import { useMyComposable } from '~/composables/useMyComposable'

describe('useMyComposable', () => {
  it('returns expected values', () => {
    const { value, increment } = useMyComposable()
    expect(value.value).toBe(0)
    increment()
    expect(value.value).toBe(1)
  })
})
```

## Mocks Disponibles

En `setup.ts` están configurados mocks para:

- `localStorage`
- `fetch`
- `window.matchMedia`
- `IntersectionObserver`
- `ResizeObserver`
- `URL.createObjectURL`
- Nuxt composables (`useRuntimeConfig`, `useFetch`, `useRouter`, `useRoute`)
- Nuxt components (`Icon`)

## Aliases Configurados

- `@` o `~` → `../client`
- `client` → `../client`
- `server` → `../server`

## Pre-commit Hooks

El proyecto está configurado con Husky y lint-staged para ejecutar automáticamente:

1. **ESLint** - Verificar código
2. **Tests** - Ejecutar tests unitarios

Esto se ejecuta antes de cada commit.

## CI/CD

GitHub Actions ejecuta automáticamente:

- Linting
- Type checking
- Tests unitarios
- Coverage reports

En cada push a `main` o `develop` y en pull requests.

## Coverage

Para ver el reporte de coverage:

1. Ejecuta `npm run test:coverage`
2. Abre `coverage/index.html` en tu navegador

## Best Practices

1. **Nombres descriptivos**: Usa nombres claros para tests
2. **Arrange-Act-Assert**: Estructura tus tests en 3 partes
3. **Mocks específicos**: Mock solo lo necesario
4. **Test isolation**: Cada test debe ser independiente
5. **Coverage objetivo**: Mantén al menos 80% de coverage

## Troubleshooting

### Error: "Cannot find module"
- Verifica que el path del import sea correcto
- Usa `~` o `@` para imports relativos al proyecto

### Error: "localStorage is not defined"
- Los mocks están en `setup.ts`
- Asegúrate de que `vitest.config.ts` incluya el setup file

### Tests lentos
- Usa `vi.mock()` para mockear módulos pesados
- Evita tests de integración en tests unitarios 