# Architecture Clean Architecture - Nuxt 3

Ce projet implémente une architecture Clean Architecture adaptée à Nuxt 3, inspirée des meilleures pratiques de séparation des préoccupations et d'inversion de dépendances.

## Structure du projet

```
wink-technical-test/
├── adapters/                    # Adapters pour intégrations externes
│   ├── api/
│   │   ├── ApiAdapter.ts       # Implémentation concrète
│   │   └── types.ts            # Interface IApiAdapter
│   └── __mocks__/
│       └── ApiAdapter.mock.ts  # Mock pour tests
│
├── repositories/                # Repositories pour logique métier
│   └── company/
│       ├── CompanyRepository.ts # Logique métier Company
│       └── types.ts            # Types du repository
│
├── composables/                # ViewModels (logique de présentation)
│   ├── company/
│   │   └── useCompanyRegistration.ts
│   └── repositories/
│       └── useCompanyRepository.ts
│
├── components/                 # Composants Vue (UI pure)
│   └── company/
│       ├── CompanyRegistrationForm.vue
│       └── CompanyLogoUpload.vue
│
├── plugins/                    # Injection de dépendances
│   ├── adapters.provider.ts   # Provide les adapters
│   └── msw.client.ts          # Configuration MSW
│
├── mocks/                      # Handlers MSW
│   └── handlers/
│       ├── companies.ts
│       └── index.ts
│
├── pages/                      # Pages Nuxt
│   └── register/
│       └── company.vue
│
└── types/                      # Types TypeScript
    ├── company.ts
    └── nuxt.d.ts
```

## Principes architecturaux

### 1. Séparation des préoccupations

- **View (Component)** : UI uniquement, pas de logique métier
- **ViewModel (Composable)** : État et logique de présentation
- **Repository** : Logique métier pure
- **Adapter** : Intégrations externes (API, services)

### 2. Dependency Inversion

- Les composants dépendent des composables
- Les composables dépendent des repositories
- Les repositories dépendent des adapters (via interfaces)
- Injection de dépendances via `nuxtApp.provide()` et `inject()`

### 3. Type Safety

- Interfaces TypeScript partout
- Pas de `any`
- Types stricts

## Flux de données

```
Component (Vue)
    ↓ utilise
Composable (ViewModel)
    ↓ utilise
Repository (Logique métier)
    ↓ utilise
Adapter (Interface)
    ↓ implémente
ApiAdapter (Concret)
    ↓ appelle
API (MSW mockée)
```

## Exemple d'utilisation

### Dans un composant

```vue
<template>
  <CompanyRegistrationForm />
</template>

<script setup lang="ts">
import CompanyRegistrationForm from '~/components/company/CompanyRegistrationForm.vue'
</script>
```

### Dans un composable

```typescript
const { state, registerCompany, setName } = useCompanyRegistration()
```

### Dans un repository

```typescript
const repository = useCompanyRepository()
const company = await repository.createCompany(data)
```

## MSW (Mock Service Worker)

MSW est utilisé pour mocker les appels API. Les handlers sont définis dans `mocks/handlers/` et interceptent toutes les requêtes vers `/api/*`.

Pour démarrer MSW :
1. Le plugin `msw.client.ts` s'initialise automatiquement
2. Les handlers sont chargés depuis `mocks/handlers/index.ts`
3. Les requêtes sont interceptées et mockées

## Tests

L'architecture est conçue pour être facilement testable :

- **Adapters** : Mockables via `MockApiAdapter`
- **Repositories** : Testables sans DOM, logique métier pure
- **Composables** : Testables avec mocks des repositories
- **Components** : Testables avec mocks des composables

## Notes importantes

- Les composables sont auto-importés par Nuxt 3
- Les plugins sont chargés automatiquement au démarrage
- MSW fonctionne uniquement côté client (browser)
- L'injection de dépendances se fait via `nuxtApp.provide()` et `nuxtApp.$apiAdapter`

