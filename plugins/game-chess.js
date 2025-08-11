import { Chess } from 'chess.js';

const handler = async (m, { conn, args }) => {
  const chatId = m.chat;
  conn.chess = conn.chess || {};
  
  // Inicializar datos de ajedrez para este chat si no existen
  if (!conn.chess[chatId]) {
    conn.chess[chatId] = {
      gameData: null,
      fen: null,
      currentTurn: null,
      players: [],
      hasJoined: []
    };
  }
  const chessData = conn.chess[chatId];
  const { gameData, fen, currentTurn, players, hasJoined } = chessData;

  const feature = args[0]?.toLowerCase();

  // Comando: eliminar juego
  if (feature === 'eliminar' || feature === 'delete') {
    if (!gameData) return conn.reply(chatId, '❌ No hay ninguna partida en curso para eliminar.', m);
    delete conn.chess[chatId];
    return conn.reply(chatId, '🏳️ *El juego de ajedrez se detuvo.*', m);
  }

  // Comando: crear juego
  if (feature === 'crear' || feature === 'create') {
    if (gameData) return conn.reply(chatId, '⚠️ *Ya hay un juego en progreso o esperando jugadores.*', m);
    chessData.gameData = { status: 'espera', black: null, white: null };
    chessData.fen = null;
    chessData.currentTurn = null;
    chessData.players = [];
    chessData.hasJoined = [];
    return conn.reply(chatId, '🎮 *Empezó la partida de ajedrez.*\nEsperando que se unan otros jugadores.', m);
  }

  // Comando: unirse al juego
  if (feature === 'unirse' || feature === 'join') {
    if (!gameData || gameData.status !== 'espera') {
      return conn.reply(chatId, '⚠️ *Actualmente no hay ningún juego esperando jugadores.*', m);
    }
    if (players.includes(m.sender)) {
      return conn.reply(chatId, '🙅‍♂️ *Ya te has unido a este juego.*', m);
    }
    if (players.length >= 2) {
      return conn.reply(chatId, '👥 *Los jugadores ya son suficientes.*\nEl juego comenzará automáticamente.', m);
    }
    chessData.players.push(m.sender);
    chessData.hasJoined.push(m.sender);

    if (chessData.players.length === 2) {
      chessData.gameData.status = 'listos';

      // Asignar aleatoriamente blanco y negro
      const [p1, p2] = chessData.players;
      if (Math.random() < 0.5) {
        chessData.gameData.white = p1;
        chessData.gameData.black = p2;
      } else {
        chessData.gameData.white = p2;
        chessData.gameData.black = p1;
      }
      chessData.currentTurn = chessData.gameData.white;

      const mentions = chessData.hasJoined;
      return conn.reply(chatId,
        `🙌 *2 jugadores listos:*\n${mentions.map(id => `- @${id.split('@')[0]}`).join('\n')}\n\n*Blanco:* @${chessData.gameData.white.split('@')[0]}\n*Negro:* @${chessData.gameData.black.split('@')[0]}\n\nUsa *chess start* para iniciar la partida.`,
        m,
        { mentions }
      );
    } else {
      return conn.reply(chatId, '🙋‍♂️ *Te has unido al juego de ajedrez.*\nEsperando que se unan otros jugadores.', m);
    }
  }

  // Comando: iniciar juego
  if (feature === 'iniciar' || feature === 'start') {
    if (!gameData || gameData.status !== 'listos') {
      return conn.reply(chatId, '⚠️ *No se puede iniciar el juego. Espera a que se unan dos jugadores.*', m);
    }
    chessData.gameData.status = 'jugando';

    const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
    chessData.fen = initialFen;

    const encodedFen = encodeURIComponent(initialFen);
    const whitePlayer = chessData.gameData.white;
    const blackPlayer = chessData.gameData.black;
    const currentTurnPlayer = chessData.currentTurn;

    const turnMessage = `🎲 *Turno:* Blanco @${whitePlayer.split('@')[0]}`;

    const flipParam = m.sender === blackPlayer ? '' : '&flip=true';
    const boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`;

    try {
      await conn.sendFile(chatId, boardUrl, 'board.jpg', turnMessage, m, false, { mentions: [whitePlayer, blackPlayer] });
    } catch (e) {
      // fallback imagen
      const fallbackUrl = `https://chessboardimage.com/${encodedFen + (m.sender === blackPlayer ? '' : '-flip')}.png`;
      await conn.sendFile(chatId, fallbackUrl, 'board.png', turnMessage, m, false, { mentions: [whitePlayer, blackPlayer] });
    }
    return;
  }

  // Comando: movimiento [from] [to]
  if (args.length >= 2 && !['crear', 'create', 'unirse', 'join', 'iniciar', 'start', 'eliminar', 'delete', 'help'].includes(feature)) {
    if (!gameData || gameData.status !== 'jugando') {
      return conn.reply(chatId, '⚠️ *El juego aún no ha comenzado.*', m);
    }
    if (currentTurn !== m.sender) {
      return conn.reply(chatId,
        `⏳ *Es turno de ${currentTurn === gameData.white ? 'blanco' : 'negro'} (@${currentTurn.split('@')[0]})*`,
        m,
        { contextInfo: { mentionedJid: [currentTurn] } }
      );
    }

    const chess = new Chess(fen);

    if (chess.isGameOver()) {
      delete conn.chess[chatId];
      const winner = chess.turn() === 'w' ? gameData.black : gameData.white; // quien ganó
      let endMessage = '';

      if (chess.isCheckmate()) {
        endMessage = `⚠️ *Jaque mate.*\n🏳️ *El juego se terminó.*\n*Ganador:* @${winner.split('@')[0]}`;
      } else if (chess.isDraw()) {
        endMessage = `⚠️ *Empate.*\n🏳️ *El juego se terminó.*\n*Jugadores:* ${hasJoined.map(p => `- @${p.split('@')[0]}`).join('\n')}`;
      } else {
        endMessage = `⚠️ *El juego terminó.*`;
      }
      return conn.reply(chatId, endMessage, m, { contextInfo: { mentionedJid: hasJoined } });
    }

    const from = args[0].toLowerCase();
    const to = args[1].toLowerCase();

    // Intentar hacer el movimiento
    const move = chess.move({ from, to, promotion: 'q' });
    if (!move) {
      return conn.reply(chatId, '❌ *Movimiento inválido.*', m);
    }

    chessData.fen = chess.fen();

    // Cambiar turno
    const currentIndex = players.indexOf(currentTurn);
    const nextIndex = (currentIndex + 1) % 2;
    chessData.currentTurn = players[nextIndex];

    const encodedFen = encodeURIComponent(chess.fen());
    const currentColor = chessData.currentTurn === gameData.white ? 'Blanco' : 'Negro';
    const turnMessage = `🎲 *Turno:* ${currentColor} @${chessData.currentTurn.split('@')[0]}`;

    const flipParamMove = m.sender === gameData.black ? '' : '&flip=true';
    const boardUrlMove = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParamMove}`;

    try {
      await conn.sendFile(chatId, boardUrlMove, 'board.jpg', turnMessage, m, false, { mentions: [chessData.currentTurn] });
    } catch (e) {
      const fallbackMoveUrl = `https://chessboardimage.com/${encodedFen + (m.sender === gameData.black ? '' : '-flip')}.png`;
      await conn.sendFile(chatId, fallbackMoveUrl, 'board.png', turnMessage, m, false, { mentions: [chessData.currentTurn] });
    }
    return;
  }

  // Comando: ayuda
  if (feature === 'help') {
    return conn.reply(chatId, `
🌟 *Comandos de ajedrez:*

*chess create* - Crear una nueva partida
*chess join* - Unirse a una partida en espera
*chess start* - Iniciar la partida cuando haya 2 jugadores
*chess delete* - Eliminar la partida actual
*chess [from] [to]* - Mover una pieza, ejemplo: chess e2 e4

Ejemplo:
- Usa *chess create* para iniciar un juego.
- Usa *chess join* para unirte.
- Usa *chess start* para comenzar.
    `, m);
  }

  // Comando inválido
  return conn.reply(chatId, '❓ Comando inválido. Usa *chess help* para ver los comandos disponibles.', m);
};

handler.help = ['chess [from to]', 'chess create', 'chess join', 'chess start', 'chess delete', 'chess help'];
handler.tags = ['game'];
handler.command = /^(chess|chatur)$/i;

export default handler;
