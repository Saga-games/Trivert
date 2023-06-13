export default class salas extends Phaser.Scene {
  constructor() {
    super("salas");
  }

  preload() {
    this.load.image("capadojogo.png", "./assets/capadojogo.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add
      .image(225, 400, "capadojogo.png")
      .setTint("0x333333")
      .setInteractive()
      .on("pointerdown", () => {
        this.imagem.destroy();
        this.game.scene.start("principal");
      });

    this.mensagem = this.add.text(100, 75, "Escolha uma sala:", {
      fontFamily: "monospace",
      font: "32px Courier",
      fill: "#ffffff",
    });

    this.salas = [
      {
        numero: 0,
        x: 150,
        y: 125,
        botao: undefined,
      },
      {
        numero: "1",
        x: 150,
        y: 175,
        botao: undefined,
      },
      {
        numero: "2",
        x: 150,
        y: 225,
        botao: undefined,
      },
      {
        numero: "3",
        x: 150,
        y: 275,
        botao: undefined,
      },
      {
        numero: "4",
        x: 150,
        y: 325,
        botao: undefined,
      },
      {
        numero: "5",
        x: 150,
        y: 375,
        botao: undefined,
      },
      {
        numero: "6",
        x: 150,
        y: 425,
        botao: undefined,
      },
      {
        numero: "7",
        x: 150,
        y: 475,
        botao: undefined,
      },
      {
        numero: "8",
        x: 150,
        y: 525,
        botao: undefined,
      },
      {
        numero: "9",
        x: 150,
        y: 575,
        botao: undefined,
      },
    ];

    this.salas.forEach((item) => {
      item.botao = this.add
        .text(item.x, item.y, "[Sala " + item.numero + "]", {
          fontFamily: "monospace",
          font: "32px Courier",
          fill: "#cccccc",
        })
        .setInteractive()
        .on("pointerdown", () => {
          this.salas.forEach((item) => {
            item.botao.destroy();
          });
          this.game.sala = item.numero;
          this.game.socket.emit("entrar-na-sala", this.game.sala);
        });
    });

    this.game.socket.on("jogadores", (jogadores) => {
      console.log(jogadores);
      if (jogadores.segundo) {
        this.mensagem.destroy();
        this.game.jogadores = jogadores;
        this.game.scene.stop("salas");
        this.game.scene.start("principal");
      } else if (jogadores.primeiro) {
        this.mensagem.setText("Aguardando...");
        this.salas.forEach((sala) => {
          sala.botao.destroy();

          /* Captura de áudio */
          navigator.mediaDevices
            .getUserMedia({ video: false, audio: true })
            .then((stream) => {
              this.game.midias = stream;
            })
            .catch((error) => console.log(error));
        });
      }
    });
  }
}
