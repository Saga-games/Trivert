export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
  }

  preload() {
    this.load.image("tabuleiro.png", "./assets/tabuleiro.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add.image(225, 400, "tabuleiro.png");

    this.tabuleiro = [
      {
        x: 10,
        y: 300,
      },
      {
        x: 60,
        y: 300,
      },
      {
        x: 110,
        y: 300,
      },
    ];
    this.tabuleiro.forEach((posicao) => {
      posicao.botao = this.add
        .text(posicao.x, posicao.y, "X")
        .setInteractive()
        .on("pointerdown", () => {
          if (this.game.jogadores.primeiro === this.game.socket.id) {
            posicao.peca = "verde";
          } else {
            posicao.peca = "vermelha";
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
      console.log(this.tabuleiro);
    });
  }

  upload() {}
}
