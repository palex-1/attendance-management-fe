# Introduzione

Questo documento ha lo scopo di fornire le informazioni principali per configurare e eseguire il frontend del software _Time Sheet_. 

### 1 Configurazione ed esecuzione del frontend dell'applicativo

Se hai deciso di installare il frontend nel web server tomcat dovrai estrarre il contenuto del file zip `frontend.zip` nella cartella ROOT di Tomcat. (Se si usa un hosting scompattare il pacchetto nella root folder in modo )  
Nota: Tomcat ha una cartella ROOT dove sono presenti le pagine di amministrazione. Rinominare questa cartella e creare una nuova cartella ROOT dove scompattare il pacchetto zip. Rinominando la ROOT di tomcat le pagine di amministrazione risponderanno al path ${hostname}/folder_name.  

Una volta scompattata la cartella si dovrà editare il contenuto del file `/assets/config/externalized-configs.json`. Inserire qui l'indirizzo dove può essere raggiunto il backend (IMPORTANTE: non modificare il formato. Lasciare lo / finale):

```json
{
    "serverPath": "http://localhost:8080/"
}
```

Se si vuole installare un certificato SSL per il frontend seguire la guida ufficiale di Tomcat.  
