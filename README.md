# SkillQuest

Un portfolio giocabile costruito con Angular: tre missioni interattive per esplorare logica, stato reattivo e validazione dei form.

## Avvio locale

Richiede Node.js 22.12 o successivo della serie 22 e npm.

```sh
npm ci
npm start
```

Apri http://localhost:4200.

## Comandi

```sh
npm run build
npm test -- --watch=false
```

La build statica viene generata in `dist/skillquest/browser`.

## Le missioni

| Missione | Esperienza | Ricompensa |
| --- | --- | --- |
| Caccia al bug | Correggere un incremento TypeScript | 100 XP |
| Radar delle skill | Filtrare il catalogo e trovare RxJS | 150 XP |
| Pronti al lancio | Compilare un form con dati validi | 200 XP |

Ogni ricompensa viene assegnata una volta sola. I progressi sono salvati in localStorage e possono essere azzerati con **Ricomincia**. Se lo storage non è disponibile, il gioco continua in memoria. I campi del form sono dimostrativi: nessun invio a un server e nessun salvataggio dei dati personali.

## Scelte tecniche

- Componenti standalone Angular, TypeScript strict e SCSS.
- Signals e computed per stato, filtri, livello e punti.
- Servizio `Progress` separato dalla UI con validazione dei dati persistiti.
- Reactive Forms con messaggi di errore accessibili.
- Layout responsive, navigazione da tastiera, feedback live e supporto a movimento ridotto.
- Test per premi duplicati, dati corrotti, validazione e interazione tra missioni.
- CI GitHub Actions con test e build a ogni push e pull request.

## Personalizzazione

Le missioni sono definite in `src/app/progress.ts`; i contenuti si trovano in `src/app/app.html`. Questa prima versione contiene esperienze dimostrative, senza attribuire competenze o progetti personali non ancora forniti.

Prossimi passi: schede dei progetti reali, profilo personale e nuove missioni.
