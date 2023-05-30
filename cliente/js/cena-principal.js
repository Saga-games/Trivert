export default class principal extends Phaser.Scene {
  constructor() {
    super("principal");

    this.tabuleiro = [
      {
        numero: 0,
        x: 15,
        y: 260,
      },
      {
        numero: 1,
        x: 15,
        y: 465,
      },
      {
        numero: 2,
        x: 15,
        y: 667,
      },
      {
        numero: 3,
        x: 220,
        y: 260,
      },
      {
        numero: 4,
        x: 423,
        y: 260,
      },
      {
        numero: 5,
        x: 423,
        y: 465,
      },
      {
        numero: 6,
        x: 423,
        y: 669,
      },
      {
        numero: 7,
        x: 220,
        y: 668,
      },
      {
        numero: 8,
        x: 79,
        y: 325,
      },
      {
        numero: 9,
        x: 79,
        y: 464,
      },
      {
        numero: 10,
        x: 79,
        y: 605,
      },
      {
        numero: 11,
        x: 359,
        y: 325,
      },
      {
        numero: 12,
        x: 360,
        y: 465,
      },
      {
        numero: 13,
        x: 360,
        y: 604,
      },
      {
        numero: 14,
        x: 220,
        y: 325,
      },
      {
        numero: 15,
        x: 220,
        y: 607,
      },
      {
        numero: 16,
        x: 141,
        y: 385,
      },
      {
        numero: 17,
        x: 139,
        y: 464,
      },
      {
        numero: 18,
        x: 141,
        y: 545,
      },
      {
        numero: 19,
        x: 299,
        y: 385,
      },
      {
        numero: 20,
        x: 299,
        y: 465,
      },
      {
        numero: 21,
        x: 298,
        y: 544,
      },
      {
        numero: 22,
        x: 220,
        y: 385,
      },
      {
        numero: 23,
        x: 220,
        y: 545,
      },
    ];
  }

  preload() {
    this.load.image("tabuleiro.png", "./assets/tabuleiro.png");

    this.load.spritesheet("peao", "./assets/peao.png", {
      frameWidth: 64,
      frameHeight: 64,
    });

    this.load.spritesheet("tela-cheia", "./assets/tela-cheia.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }

  create() {
    this.imagem = this.add.image(225, 400, "tabuleiro.png");

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

          this.verificar_vencedor();
        });
    });

    /* Mudar a posição com a peça escolhida pelo oponente */
    this.game.socket.on("estado-notificar", (estado) => {
      if (estado.cor === "verde") {
        this.tabuleiro[estado.numero].botao.setFrame(1);
      } else if (estado.cor === "vermelho") {
        this.tabuleiro[estado.numero].botao.setFrame(2);
      }

      this.verificar_vencedor() || this.destravar();
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
          console.log(stream);

          /* Consulta ao(s) servidor(es) ICE */
          this.game.localConnection = new RTCPeerConnection(
            this.game.ice_servers
          );

          /* Associação de mídia com conexão remota */
          stream
            .getTracks()
            .forEach((track) =>
              this.game.localConnection.addTrack(track, stream)
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
      this.game.remoteConnection = new RTCPeerConnection(this.ice_servers);

      /* Associação de mídia com conexão remota */
      this.game.midias
        .getTracks()
        .forEach((track) =>
          this.game.remoteConnection.addTrack(track, this.game.midias)
        );

      /* Contraoferta de candidatos ICE */
      this.game.remoteConnection.onicecandidate = ({ candidate }) => {
        candidate &&
          this.game.socket.emit("candidate", this.game.sala, candidate);
      };

      /* Associação com o objeto HTML de áudio */
      let midias = this.game.midias;
      this.game.remoteConnection.ontrack = ({ streams: [midias] }) => {
        this.game.audio.srcObject = this.game.midias;
      };

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

  verificar_vencedor() {
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

    if (ganhou) return true;
  }
}
