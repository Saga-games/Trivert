export default class abertura extends Phaser.Scene {
  constructor() {
    super("abertura");
  }

  preload() {
    this.load.image("capadojogo1.png", "./assets/capadojogo1.png");
  }

  create() {
    /* Imagem de fundo */
    this.imagem = this.add
      .image(225, 400, "capadojogo1.png")
      .setInteractive()
      .on("pointerdown", () => {
        this.imagem.destroy();
        this.game.scene.start("principal");
      });

  }

  upload() {}
}