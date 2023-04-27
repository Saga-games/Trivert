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
      .image(400, 225, "capadojogo.png")
      .setInteractive()
      .on("pointerdown", () => {
        this.imagem.destroy();
        this.texto.destroy();
        this.game.scene.start("principal");
      });

  }

  upload() {}
}