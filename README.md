# Introduzione

Questo documento ha lo scopo di fornire le informazioni principali per configurare e eseguire il frontend del software _Time Sheet_. 

### 1 Configurazione ed esecuzione del frontend dell'applicativo

Se hai deciso di installare il frontend nel web server tomcat (o in qualunque altro web server) dovrai estrarre il contenuto del file zip `frontend.zip` nella cartella ROOT di Tomcat. (Se si usa un hosting scompattare il pacchetto nella root folder in modo )  
Nota: Tomcat ha una cartella ROOT dove sono presenti le pagine di amministrazione. Rinominare questa cartella e creare una nuova cartella ROOT dove scompattare il pacchetto zip. Rinominando la ROOT di tomcat le pagine di amministrazione risponderanno al path ${hostname}/folder_name.  

Una volta scompattata la cartella si dovrà modificare il contenuto del file `/assets/config/env.js`. Sostituire l'indirizzo di default del backend ('http://127.0.0.1:8080/') con quello da te utilizzato:

```javascript
(function(window) {
  window["env"] = window["env"] || {};

  // Environment variables
  window["env"]["apiUrl"] = "http://127.0.0.1:8080/"; <---- CHANGE THIS URL
  window["env"]["debug"] = true;
})(this);
```

Se si vuole installare un certificato SSL per il frontend seguire la guida ufficiale di Tomcat.  
