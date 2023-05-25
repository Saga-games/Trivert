import config from "./config.js";

import abertura from "./cena-abertura.js";
import salas from "./cena-salas.js";
import principal from "./cena-principal.js";
import fim_do_jogo from "./cena-fim-de-jogo.js";
//import final_feliz from "./cena-final-feliz.js";

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.socket = io();
    this.socket.on("connect", () => {
      console.log("Conectado ao servidor para troca de mensagens.");
    });

    /* Lista de servidor(es) ICE */
    this.ice_servers = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };

    /* Associação de objeto HTML de áudio e objeto JS */
    this.audio = document.querySelector("audio");

    this.scene.add("abertura", abertura);
    this.scene.add("salas", salas);
    this.scene.add("principal", principal);
    this.scene.add("fim-do-jogo", fim_do_jogo);
    //this.scene.add("final-feliz", final_feliz);

    this.scene.start("abertura");
  }
}

window.onload = () => {
  window.game = new Game();
};
