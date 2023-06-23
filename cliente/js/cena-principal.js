export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");

    this.tabuleiro = [
      {
        numero: 0,
        x: 27,
        y: 268,
      },
      {
        numero: 1,
        x: 27,
        y: 471,
      },
      {
        numero: 2,
        x: 27,
        y: 675,
      },
      {
        numero: 3,
        x: 224,
        y: 268,
      },
      {
        numero: 4,
        x: 423,
        y: 268,
      },
      {
        numero: 5,
        x: 423,
        y: 472,
      },
      {
        numero: 6,
        x: 423,
        y: 675,
      },
      {
        numero: 7,
        x: 224,
        y: 675,
      },
      {
        numero: 8,
        x: 83,
        y: 331,
      },
      {
        numero: 9,
        x: 86,
        y: 472,
      },
      {
        numero: 10,
        x: 83,
        y: 611,
      },
      {
        numero: 11,
        x: 363,
        y: 331,
      },
      {
        numero: 12,
        x: 363,
        y: 472,
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
        x: 224,
        y: 611,
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
      },
    ];
  }

  preload() {
    this.load.image("tabuleiro.png", "./assets/tabuleiro.png");

    this.load.spritesheet("peao", "./assets/peao.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("9-0", "./assets/9-0.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("tela-cheia", "./assets/tela-cheia.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.audio("musicafundo", "./assets/musicafundo.mp3");
  }

  create() {
    this.trilha = this.sound.add("musicafundo");
    this.trilha.play();

    this.imagem = this.add.image(225, 400, "tabuleiro.png");

    this.pecas_disponiveis = this.add.sprite(225, 200, "9-0", 9);

    this.tela_cheia = this.add
      .sprite(225, 50, "tela-cheia", 0)
      .setInteractive()
      .on("pointerdown", () => {
        if (this.scale.isFullscreen) {
          this.tela_cheia.setFrame(0);
          this.scale.stopFullscreen();
        } else {
          this.tela_cheia.setFrame(1);
          this.scale.startFullscreen();
        }
      })
      .setScrollFactor(0);

    this.tabuleiro.forEach((posicao) => {
      posicao.botao = this.add
        .sprite(posicao.x, posicao.y, "peao")
        .setFrame(0)
        .setInteractive()
        .on("pointerdown", () => {
          this.pecas_disponiveis.setFrame(
            this.pecas_disponiveis.frame.name - 1
          );
          this.travar();

          if (this.game.jogadores.primeiro === this.game.socket.id) {
            this.tabuleiro[posicao.numero].botao.setFrame(1);
            this.game.socket.emit("estado-publicar", this.game.sala, {
              numero: posicao.numero,
              cor: "verde",
            });
          } else {
            this.tabuleiro[posicao.numero].botao.setFrame(2);
            this.game.socket.emit("estado-publicar", this.game.sala, {
              numero: posicao.numero,
              cor: "vermelho",
            });
          }

          this.remover_peca();
        });
    });

    /* Mudar a posição com a peça escolhida pelo oponente */
    this.game.socket.on("estado-notificar", (estado) => {
      if (estado.cor === "verde") {
        this.tabuleiro[estado.numero].botao.setFrame(1);
      } else if (estado.cor === "vermelho") {
        this.tabuleiro[estado.numero].botao.setFrame(2);
      }

      this.remover_peca() || this.destravar();
    });

    /* Destravar a partida para jogador 1 */
    if (this.game.jogadores.primeiro === this.game.socket.id) {
      this.destravar();
    } else {
      this.travar();

      /* Captura de áudio */
      navigator.mediaDevices
        .getUserMedia({ video: false, audio: true })
        .then((stream) => {
          /* Consulta ao(s) servidor(es) ICE */
          this.game.localConnection = new RTCPeerConnection(
            this.game.ice_servers
          );

          /* Oferta de candidatos ICE */
          this.game.localConnection.onicecandidate = ({ candidate }) => {
            candidate &&
              this.game.socket.emit("candidate", this.game.sala, candidate);
          };

          /* Associação com o objeto HTML de áudio */
          this.game.localConnection.ontrack = ({ streams: [stream] }) => {
            this.game.audio.srcObject = stream;
          };

          /* Associação de mídia com conexão remota */
          stream
            .getTracks()
            .forEach((track) =>
              this.game.localConnection.addTrack(track, stream)
            );

          /* Oferta de mídia */
          this.game.localConnection
            .createOffer()
            .then((offer) =>
              this.game.localConnection.setLocalDescription(offer)
            )
            .then(() => {
              this.game.socket.emit(
                "offer",
                this.game.sala,
                this.game.localConnection.localDescription
              );
            });

          this.game.midias = stream;
        })
        .catch((error) => console.log(error));
    }

    /* Recebimento de oferta de mídia */
    this.game.socket.on("offer", (description) => {
      this.game.remoteConnection = new RTCPeerConnection(this.game.ice_servers);

      /* Contraoferta de candidatos ICE */
      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        candidate &&
          this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      /* Associação com o objeto HTML de áudio */
      this.game.remoteConnection.ontrack = ({ streams: [stream] }) => {
        this.game.audio.srcObject = stream;
      };

      /* Associação de mídia com conexão remota */
      this.game.midias
        .getTracks()
        .forEach((track) =>
          this.game.remoteConnection.addTrack(track, this.game.midias)
        );

      /* Contraoferta de mídia */
      this.game.remoteConnection
        .setRemoteDescription(description)
        .then(() => this.game.remoteConnection.createAnswer())
        .then((answer) =>
          this.game.remoteConnection.setLocalDescription(answer)
        )
        .then(() => {
          this.game.socket.emit(
            "answer",
            this.game.sala,
            this.game.remoteConnection.localDescription
          );
        });
    });

    /* Recebimento de contraoferta de mídia */
    this.game.socket.on("answer", (description) => {
      this.game.localConnection.setRemoteDescription(description);
    });

    /* Recebimento de candidato ICE */
    this.game.socket.on("candidate", (candidate) => {
      let conn = this.game.localConnection || this.game.remoteConnection;
      conn.addIceCandidate(new RTCIceCandidate(candidate));
    });

    this.game.socket.on("cena-notificar", (cena) => {
      this.game.scene.stop("principal")
      this.game.scene.start(cena)
    })
  }

  /* Travar todo o tabuleiro e escurecer os objetos */
  travar() {
    this.imagem.setTint("0x666666");

    /* Desativar todas as posições */
    this.tabuleiro.forEach((peca) => {
      peca.botao.disableInteractive();
      peca.botao.setTint("0x666666");
    });
  }

  /* Destravar todo o tabuleiro exceto as posições com peça */
  destravar() {
    this.imagem.setTint("0xffffff");

    this.tabuleiro.forEach((peca) => {
      peca.botao.setTint("0xffffff");

      /* Ativar somente as posições sem peça (frame 0) */
      if (peca.botao.frame.name === 0) {
        peca.botao.setInteractive();
      }
    });
  }

  remover_peca() {
    let possibilidades = [
      [0, 1, 2],
      [0, 3, 4],
      [4, 5, 6],
      [2, 7, 6],
      [8, 9, 10],
      [10, 15, 13],
      [13, 12, 11],
      [11, 14, 8],
      [16, 17, 18],
      [18, 23, 21],
      [21, 20, 19],
      [19, 22, 16],
      [1, 9, 17],
      [7, 23, 15],
      [5, 12, 20],
      [3, 14, 22],
    ];

    let ganhou = false;
    let perdeu = false;
    possibilidades.forEach((linha) => {
      /* Se o Set() tem apenas um elemento houve ganhador */
      if (
        new Set([
          this.tabuleiro[linha[0]].botao.frame.name,
          this.tabuleiro[linha[1]].botao.frame.name,
          this.tabuleiro[linha[2]].botao.frame.name,
        ]).size === 1 &&
        this.tabuleiro[linha[0]].botao.frame.name !== 0
      ) {
        this.imagem.setTint("0xff0000");
        this.game.scene.stop("principal");
        this.game.scene.start("fim-do-jogo");
        ganhou = true;
        return;
      }
    });

    if (this.pecas_disponiveis.frame.name === 0) {
      //this.game.socket.emit("cena-publicar", this.game.sala, "fim-do-jogo")
      this.game.scene.stop("principal");
      this.game.scene.start("fim-do-jogo");
    };

    if (ganhou || perdeu) return true;
  }
}
