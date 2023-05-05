export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
  }

  preload() {
    this.load.image("tabuleirotech2.png", "./assets/tabuleirotech2.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add
      .image(225, 400, "tabuleirotech2.png")

  }

  upload() {}
}