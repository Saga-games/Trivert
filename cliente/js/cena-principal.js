export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
    this.tabuleiro = [
      {
        numero: 0,
        x: 10,
        y: 300,
      },
      {
        numero: 1,
        x: 60,
        y: 300,
      },
      {
        numero: 2,
        x: 110,
        y: 300,
      },
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
