const TOKEN = 'ODA5ODQ0NzE0NDMzMjgyMTA5.YCbAqg.DaVzhkq9KJDuurf9ZJ3ep5o6v7E';  
const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs')
client.serii = require('./serii.json')
client.nume = require('./nume.json')
const config = require('./package-lock.json')
const prefix = "sh!"
client.on('ready', () => {
  console.log('The client is ready!')
})

client.on('message', msg=>{
  const args = msg.content.slice(prefix.length).trim().split(' ');
  //Partea Anime
  if (msg.content.startsWith(prefix + "add")){
    let keyword = args.slice(1,2);
    let categ = args.slice(2,3);
    let link = args.slice(3);
    let nume2 = categ;
    let categ2 = categ[0].toUpperCase();
    for (var o = 1; o<nume2.length; o++){
    categ2 = categ2 + categ[o];
    }
      client.serii [args.slice(1,2)] = {
        categorie: categ2,
        image: link
      }
      msg.react("✔️")
      fs.writeFile('./serii.json', JSON.stringify(client.serii, null, 4), err =>{
        if (err) throw err;
      });
  }
  
  if (msg.content.startsWith(prefix + "start") || msg.content.startsWith(prefix + "Start")){
    let nume_Serie = args.slice(2).join(' ');
    const filter = m => m.author.id === msg.author.id;
    const collector = msg.channel.createMessageCollector(filter, { time: 30000 });
    let destination = client.channels.cache.get('815665995623956540');
    let verifica = args.slice(1,2);
    let ok = false;
    let b = client.nume;
    for (var j = 0; j < b.length; j++){
      if (verifica[0] == b[j]){
        ok = true;
      }
      
    }
    console.log(verifica);
    console.log(ok);
    if (ok == true){
      
    msg.reply(" ai timp 30 de secunde să scrii etapele episodului, începând de acum!")
    msg.react("✔️");
    collector.on('collect', (m, col) =>{  
      let etape = m.content.trim().split(' ');
      for (let i = 0; i < etape.length; i++) {
        etape[i] = etape[i][0].toUpperCase() + etape[i].substr(1) + " :white_check_mark:";
    }
    let category = client.serii[args.slice(1,2)].categorie;
    let imagine = client.serii[args.slice(1,2)].image;
    let etape_v2 = etape;
    let timp = msg.createdAt;
    client.nume [args.slice(1,2)] = {
      nume: args.slice(1,2)
    }
    client.serii [args.slice(1,2)] = {
        episod: nume_Serie,
        etaps: etape_v2,
        time: timp,
        categorie: category,
        image: imagine
    }
    fs.writeFile('./nume.json', JSON.stringify(client.nume, null, 4), err =>{
      if (err) throw err;
    });
    fs.writeFile('./serii.json', JSON.stringify(client.serii, null, 4), err=>{
      if(err) throw err;
    });
      let proiect = new Discord.MessageEmbed()
      .setTitle(nume_Serie)
      .setTimestamp(msg.createdAt)
      .setThumbnail(imagine[0])
      .setColor('#c75c5c')
      .addFields(
        {name: "Categorie", value: category},
        {name: "Progres", value: etape}
        );
      destination.send(proiect);
      console.log(imagine[0])
      collector.stop();
    })
  }
  else {
    msg.reply("nu găsesc seria în baza de date. Uită-te la keyword folosind comanda `sh!cuvinte`.");
  }
  }
  if (msg.content.startsWith(prefix+"show")){
    let words = args.slice(1);
    let words_copy2 = words;
    let check = false;
    let words_copy;
    a = client.nume;
    for (var x = 0; x < words_copy2.length; x++){
      words[x] = words[x].toLowerCase();
    }
    for (var i=0; i < a.length; i++) {
      for(var j = 0; j <words.length; j++){
      if (words.includes(a[i])){
        check = true;
        words_copy = a[i];
      }
    }
    }
    if (check == true){
      msg.react("✔️");
      let _messaj = client.serii[words_copy].episod;
      let _etape = client.serii[words_copy].etaps;
      let _timp = client.serii[words_copy].time;
      let _category = client.serii[words_copy].categorie;
      let _thumbnail = client.serii[words_copy].image[0];
      let test = new Discord.MessageEmbed()
      .setTitle(_messaj)
      .addFields(
        {name: "Categorie", value: _category},
      {name: "Progres",value: _etape}
      )
      .setThumbnail(_thumbnail)
      .setColor('#c75c5c')
      .setTimestamp(_timp)
      msg.channel.send(test);
    }
    else {
      msg.reply("nu găsesc seria pe care o cauți. Folosește comanda `sh!cuvinte` și caută cuvântul din numele seriei pe care o cauți și caut-o după cuvântul ales.")
    }
  }
  if (msg.content.startsWith(prefix+"cuvinte")){
    let lista = "`", nume_copy;
    nume_copy = client.nume;
    for (var x = 0; x< nume_copy.length; x++){
      lista = lista + nume_copy[x] + "`"+ " " + "`";
    }
    let cuvinte_cheie = new Discord.MessageEmbed()
    .setTitle("Keyworduri înregistrate")
    .addField("Keywords:", lista);
    msg.channel.send(cuvinte_cheie);
  }
   switch(args[0]){
        case "help":
        case "Help":
          msg.react("✔️");
          let embedHelp = new Discord.MessageEmbed()
          .addFields(
            {name: "sh!show <numele seriei>", value: "Această comandă va căuta o serie respectivă după numele inserat. Aceasta va căuta prin mesajul tău keywordul seriei trecut în baza de date. Scrie numele seriei căutate cu litere mici."},
            {name: "sh!cuvinte", value: "Această comandă îți va arăta baza de date cu keywordurile înregistrate."}
          )
          .setColor('#c75c5c')
          .setTitle('Care sunt comenzile?')
          msg.channel.send(embedHelp); 
          break;
          case"ajutor-staff":
          case"Ajutor-Staff":
          msg.react("✔️");
          let ajut = new Discord.MessageEmbed()
          .addFields(
            {name: "sh!add <keyword> <categorie> <link thumbnail>", value: "Citiţi până la capăt. Aşa se adaugă serii noi în baza de date. Prima oară se setează un cuvânt cheie (aveţi grijă să fie unul foarte folosit și să fie FĂRĂ MAJUSCULe, doar cu litere mici), după aceea se scrie categoria (manga sau anime), iar după aceea se lasă linkul pentru thumbnail (să vă asiguraţi că la finalul linkului scrie .jpg, .jpeg etc.). NU PUNEŢI VIRGULĂ ÎNTRE ELE.\nExemplu:\nsh!add megalo anime <link-imagine>"},
            {name: "sh!start <keyword> <numele şi numărul episodului>", value: "Citiţi până la capăt.\nAşa se postează o serie. Prima oară se foloseşte keywordul care accesează seria, iar apoi se setează numele seriei şi numărul episodului/capitolului. Iar apoi, va apărea un mesaj în care trebuie să scrieţi etapele parcurse până în momentul respectiv, de la început.\nExemplu:\nsh!start jujutsu Jujutsu Kaisen #20\n{apare mesajul de 30 de secunde}\ntraducere verificare typesetting"},
            {name: "sh!cuvinte", value: "Această comandă îți va arăta baza de date cu keywordurile înregistrate."},
            {name: "sh!show <numele seriei>", value: "Această comandă va căuta o serie respectivă după numele inserat. Aceasta va căuta prin mesajul tău keywordul seriei trecut în baza de date. Scrie numele seriei căutate cu litere mici."},
            {name: "ATENŢIE!!!", value: "Botul când postează progresul seriei, el doar îţi prelucrează mesajele. Dacă greşeşti numele seriei, atunci va fi postat greşit, la fel şi pentru etapele episodului. :)"}
          )
          .setColor('#c75c5c')
          .setTitle('Care sunt comenzile?')
          msg.author.send(ajut);
          break;
    //sfarsit args[0]
  }
})
client.login(TOKEN);

