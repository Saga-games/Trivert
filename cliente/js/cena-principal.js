export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
  }

  preload() {
    this.load.image("tabuleiro.png", "./assets/tabuleiro.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add
      .image(225, 400, "tabuleiro.png")

  }

  upload() {}
}