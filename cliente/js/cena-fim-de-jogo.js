export default class fim_do_jogo extends Phaser.Scene {
  constructor() {
    super("fim-do-jogo");
  }

  preload() {
    this.load.image("cenafimdejogo.png", "./assets/cenafimdejogo.png");
  }

  create() {
    this.imagem = this.add
      .image(225, 400, "cenafimdejogo.png")
      .setTint(0xff0000)
      .setInteractive()
      .on("pointerdown", () => {
        this.imagem.destroy();
        this.texto.destroy();
        this.game.scene.start("principal");
      });

  }

  upload() {}
}