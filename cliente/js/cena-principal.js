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
        y: 667,
      },
      {
        numero: 7,
        x: 220,
        y: 667,
      },
      {
        numero: 8,
        x: 80,
        y: 328
      },
      {
        numero: 9,
        x: 80,
        y: 464,
      },
      {
        numero: 10,
        x: 80,
        y: 607,
      },
      {
        numero: 11,
        x: 363,
        y: 331
      },
      {
        numero: 12,
        x: 363,
        y: 472
      },
      {
        numero: 13,
        x: 363,
        y: 611,
      },
      {
        numero: 14,
        x: 224,
        y: 331,
      },
      {
        numero: 15,
        x: 221,
        y: 607,
      },
      {
        numero: 16,
        x: 145,
        y: 391,
      },
      {
        numero: 17,
        x: 145,
        y: 472,
      },
      {
        numero: 18,
        x: 145,
        y: 550,
      },
      {
        numero: 19,
        x: 302,
        y: 391,
      },
      {
        numero: 20,
        x: 302,
        y: 472,
      },
      {
        numero: 21,
        x: 302,
        y: 550,
      },
      {
        numero: 22,
        x: 224,
        y: 391,
      },
      {
        numero: 23,
        x: 224,
        y: 550,
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
