# 🎯 STARTGG_GRAPHQL.md — Reglas del Leaky Bucket y Esquema Exacto de Start.gg GraphQL v2

> **Endpoint Oficial:** `https://api.start.gg/gql/alpha`  
> **Regla de Oro Anti-Bloqueo (Leaky Bucket):** **MÁXIMO 1 petición cada 1000ms (1 req/seg).** Queda **PROHIBIDO** usar `Promise.all()` para llamadas a Start.gg. Todas las peticiones pasan por la cola secuencial con prioridad en el Backend.

---

## 1. Doble Modalidad de Autenticación hacia Start.gg

1. **Modo Lectura sin Cuenta Vinculada (Solo con URL / Slug o ID del Torneo):**
   * Si el Organizador o Tester fue creado de manera cerrada y **NO vinculó cuenta de Start.gg**, pega únicamente la URL del torneo (ej. `https://www.start.gg/tournament/tijuana-fight-fest-2026/events`).
   * El Backend extrae el `slug` (`tournament/tijuana-fight-fest-2026`) y envía la petición GraphQL usando el header `Authorization: Bearer ${process.env.STARTGG_SYSTEM_API_TOKEN}`.
2. **Modo OAuth2 Vinculado (Opcional para Escritura):**
   * Si el usuario vinculó su cuenta de Start.gg, el Backend usa `user.startggAccessToken` para ejecutar mutaciones en su nombre (ej. `markSetInProgress`).

---

## 2. Mapeo Exacto de Estados de un Set en Start.gg (`startggSetState`)

En la API de Start.gg, el campo `set.state` devuelve un **entero (`Int`)**, NO un string:
* **`1` (`CREATED` / Ready to Call):** Ambos oponentes ya están definidos o pendientes de llamarse. *(Nota: Siempre verificar además que `slots[0].entrant != null` y `slots[1].entrant != null` para descartar `TBD` o `Byes`).*
* **`2` (`ACTIVE` / In Progress):** La partida fue marcada como en curso en Start.gg.
* **`3` (`COMPLETED`):** El Juez ya anotó el marcador final (ej. `3-1` o `DQ`) y guardó el resultado en Start.gg.
  * **Detección de DQ en Start.gg:** Cuando un juez aplica DQ a un participante en Start.gg, el `set.state` pasa a `3` (`COMPLETED`) y el puntaje (`standing.stats.score.value`) del jugador descalificado viene como **`-1`** (o `displayScore` contiene `"DQ"`).

---

## 3. Queries GraphQL v2 Oficiales (Prohibido inventar campos fuera de esta estructura)

### Query 1: Obtener Torneo, Eventos y Videojuegos por Slug (URL)
```graphql
query GetTournamentBySlug($slug: String!) {
  tournament(slug: $slug) {
    id
    name
    slug
    events {
      id
      name
      slug
      state
      teamRosterSize {
        minPlayers
        maxPlayers
      }
      videogame {
        id
        name
        slug
      }
    }
  }
}
```

### Query 2: Obtener Inscritos (Entrants y Jugadores Físicos) de un Evento Paginados
*(Respeta el límite de complejidad de Start.gg pidiendo máximo `perPage: 50` por segundo en la cola)*
```graphql
query GetEventEntrants($eventId: ID!, $page: Int!, $perPage: Int!) {
  event(id: $eventId) {
    id
    entrants(query: { page: $page, perPage: $perPage }) {
      pageInfo {
        total
        totalPages
      }
      nodes {
        id
        name
        isDisqualified
        participants {
          id
          gamerTag
          prefix
          user {
            id
          }
        }
      }
    }
  }
}
```

### Query 3: Sincronización de Sets (Partidas Listas, En Curso y Recién Terminadas por el Juez)
```graphql
query GetEventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
  event(id: $eventId) {
    id
    state
    sets(
      page: $page
      perPage: $perPage
      sortType: STANDARD
    ) {
      pageInfo {
        totalPages
      }
      nodes {
        id
        state
        fullRoundText
        round
        winnerId
        displayScore
        completedAt
        slots {
          id
          slotIndex
          entrant {
            id
            name
          }
          standing {
            placement
            stats {
              score {
                value
              }
            }
          }
        }
      }
    }
  }
}
```
