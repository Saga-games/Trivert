export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  preload() {
    this.load.image("capadojogo.png", "./assets/capadojogo.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add
      .image(225, 400, "capadojogo.png")
      .setInteractive()
      .on("pointerdown", () => {
        this.game.scene.stop("abertura");
        this.game.scene.start("salas");
      });
  }
}
