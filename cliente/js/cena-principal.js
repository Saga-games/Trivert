export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
    this.tabuleiro = [
      {
        numero: 0,
        x: 15,
        y: 260,
      },
      {
        numero: 1,
        x: 15,
        y: 465,
      },
      {
        numero: 2,
        x: 15,
        y: 667,
      },
      {
        numero: 3,
        x: 220,
        y: 260,
      },
      {
        numero: 4,
        x: 423,
        y: 260,
      },
      {
        numero: 5,
        x: 423,
        y: 465,
      },
      {
        numero: 6,
        x: 423,
        y: 669,
      },
      {
        numero: 7,
        x: 220,
        y: 668,
      },
      {
        numero: 8,
        x: 79,
        y: 325,
      },
      {
        numero: 9,
        x: 79,
        y: 464,
      },
      {
        numero: 10,
        x: 79,
        y: 605,
      },
      {
        numero: 11,
        x: 359,
        y: 325,
      },
      {
        numero: 12,
        x: 360,
        y: 465,
      },
      {
        numero: 13,
        x: 360,
        y: 604,
      },
      {
        numero: 14,
        x: 220,
        y: 325,
      },
      {
        numero: 15,
        x: 220,
        y: 607,
      },
      {
        numero: 16,
        x: 141,
        y: 385,
      },
      {
        numero: 17,
        x: 139,
        y: 464,
      },
      {
        numero: 18,
        x: 141,
        y: 545,
      },
      {
        numero: 19,
        x: 299,
        y: 385,
      },
      {
        numero: 20,
        x: 299,
        y: 465,
      },
      {
        numero: 21,
        x: 298,
        y: 544,
      },
      {
        numero: 22,
        x: 220,
        y: 385,
      },
      {
        numero: 23,
        x: 220,
        y: 545,
      }
    ];
  }

  preload() {
    this.load.image("tabuleiro.png", "./assets/tabuleiro.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add.image(225, 400, "tabuleiro.png");

    this.tabuleiro.forEach((posicao) => {
      posicao.botao = this.add
        .text(posicao.x, posicao.y, "X")
        .setInteractive()
        .on("pointerdown", () => {
          if (this.game.jogadores.primeiro === this.game.socket.id) {
            this.tabuleiro[posicao.numero].peca = "verde";
          } else {
            this.tabuleiro[posicao.numero].peca = "vermelha";
          }
          this.game.socket.emit(
            "estado-publicar",
            this.game.sala,
            this.tabuleiro
          );
        });
    });

    this.game.socket.on("estado-notificar", (estado) => {
      this.tabuleiro = estado;
      this.tabuleiro.forEach((posicao) => {
        console.log("%s: %s", posicao.numero, posicao.peca);
      });
    });
  }

  update() {}
}
