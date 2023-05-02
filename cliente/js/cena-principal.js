export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");
  }

  preload() {
    this.load.image("tabuleirotech.png", "./assets/tabuleirotech.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add
      .image(400, 225, "tabuleirotech.png")

  }

  upload() {}
}