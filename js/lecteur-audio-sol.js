// JavaScript Document
jQuery(function ($) {

  var audioEl;
  var advId = null;
  var playing = false;
  var debug = false;
  var activeClip = null;

  var audioSettings = {
    'volumeStep': 0.02,
    'volumeStart': 0.8,
    'autoplay': true
  };

  var playerLabels = {
    'playerActivate': "Partir la lecture",
    'playerStart': "Jouer l'audio",
    'playerPause': "Mettre audio en veille",
    'playerResume': "Repartir audio",
    'playerStop': "Arrêter l'audio",
    'muteStart': "Désactiver le son",
    'muteStop': "Activer le son",
    'volumeIncrease': "Augmenter le volume",
    'volumeDecrease': "Diminuer le volume"
  }

  function init() {
    audioEl = new Audio();
    audioEl.volume = audioSettings.volumeStart;
    activeClip = null;
    addPlayers();
  }

  function desactivateClip() {
    // arrête tout et réinitialise les valeurs 
    $('.play-stop-control', activeClip).unbind('click');
    $('.play-stop-control', activeClip).text(playerLabels.playerActivate);
    $('.play-stop-control', activeClip).bind('click', activateClip);
    $('.duration-played', activeClip).text('0');
    $('.duration-clip', activeClip).text('0');
    $('.range', activeClip).val(0);
    $('.clip-duration', activeClip).hide();
    activeClip = null;
  }

  function activateClip(event) {
    var src;
    var msg;
    if (activeClip) desactivateClip();
    console.log($(this).parents('article'));
    activeClip = $(this).parents('article').eq(0);
    if (audioEl.canPlayType("audio/mpeg")) {
      src = $('audio', activeClip).children('source[type="audio/mpeg"]').eq(0).attr('src');
      msg = 'Je vais jouer le mp3';
    } else if (audioEl.canPlayType('audio/ogg; codec="vorbis"')) {
      src = $('audio', activeClip).children('source[type="audio/ogg"]').eq(0).attr('src');
      msg = 'Je vais jouer le ogg/vorbis';
    }
    if (debug) console.log(msg + ': ' + src);
    audioEl.src = src;

    $('.play-stop-control', activeClip).unbind('click');
    audioEl.addEventListener('loadedmetadata', attachInitPlayerEvents, false);
    if (audioSettings.autoplay) {
      if (debug) console.log('Autoplay.');
      audioEl.addEventListener('loadeddata', startAudio, false);
    }
    else {
      $('.play-stop-control', activeClip).text(playerLabels.playerStart);
      $('.play-stop-control', activeClip).bind('click', startAudio);
    }
    playing = true;
  }

  function addPlayers() {
    /* si pas de serveur Web, faire ceci localement, sinon faire avec XHR */
    var player = '<div class="player">' +
      '  <div class="play-stop-control"></div>' +
      '  <div class="clip-progress">' +
      '    <input type="range" min="0" value="0" class="range"/>' +
      '    <div class="clip-duration">' +
      '      <span class="duration-played"></span> / <span class="duration-clip"></span>' +
      '    </div>' +
      '  </div>' +
      '  <div class="volume-control">' +
      '    <span class="increase-volume"></span>' +
      '     <span>-</span>  ' +
      '    <span class="volume-state"></span>' +
      '     <span>-</span>  ' +
      '    <span class="decrease-volume"></span>' +
      '  </div>' +
      '  <div class="mute-control"></div>' +
      '  <div class="clip-status"></div>' +
      '</div>';
    $(player).insertAfter('audio');

    $('.play-stop-control').text(playerLabels.playerActivate);

    // durées mises à zéro
    $('.clip-duration').hide();
    $('.duration-played').text('0');
    $('.duration-clip').text('0');

    // volume et mute
    $('.increase-volume').text(playerLabels.volumeIncrease);
    $('.decrease-volume').text(playerLabels.volumeDecrease);
    $('.mute-control').text(playerLabels.muteStart);
    updateVolumeStateInfo();

    // événements pour l'objet global a
    $('.mute-control').bind('click', startMute);
    $('.increase-volume').bind('click', increaseVolume);
    $('.decrease-volume').bind('click', decreaseVolume);
    $('.play-stop-control').bind('click', activateClip);

  }

  function attachInitPlayerEvents() {
    $('.duration-clip', activeClip).text(audioEl.duration.toFixed(2) + 's ');
    $('.play-stop-control', activeClip).bind('click', startAudio);
    $('.range', activeClip).bind('change', seekAt);
    $('.clip-duration', activeClip).show();
    updateAdvancementInfo();
  }

  function seekAt(event) {
    if (debug) console.log($(this).val());
    audioEl.currentTime = $(this).val();
  }

  function startAudio() {
    // activer lecture du clip
    audioEl.play();
    if (debug) console.log('Le clip joue.');
    $('.play-stop-control', activeClip).text(playerLabels.playerPause);
    $('.play-stop-control', activeClip).unbind('click');
    $('.play-stop-control', activeClip).bind('click', pauseAudio);
    startSeekingAdvancement();
    $('.player', activeClip).show();
    // basculer lien pour 'Arrêter audio'
  }

  function pauseAudio() {
    // arrêter lecture du clip
    audioEl.pause();
    if (debug) console.log('Le clip est en veille.');
    pauseAudioAction();
    // basculer lien pour 'Jouer audio'
  }

  function pauseAudioAction() {
    $('.play-stop-control', activeClip).text(playerLabels.playerResume);
    $('.play-stop-control', activeClip).unbind('click');
    $('.play-stop-control', activeClip).bind('click', startAudio);
    updateAdvancementInfo();
    stopSeekingAdvancement();
  }

  function stopAudioAction() {
    $('.play-stop-control', activeClip).text(playerLabels.playerStart);
    $('.play-stop-control', activeClip).unbind('click');
    $('.play-stop-control', activeClip).bind('click', startAudio);
    updateAdvancementInfo();
    stopSeekingAdvancement();
  }

  function startMute() {
    // désactiver le son
    audioEl.muted = true;
    if (debug) console.log('Le son est désactivé.');
    $('.mute-control').text(playerLabels.muteStop);
    $('.mute-control').unbind('click');
    $('.mute-control').bind('click', stopMute);
    // basculer lien pour 'Activer le son'
  }

  function stopMute() {
    // activer le son
    audioEl.muted = false;
    if (debug) console.log('Le son est activé.');
    $('.mute-control').text(playerLabels.muteStart);
    $('.mute-control').unbind('click');
    $('.mute-control').bind('click', startMute);
    // basculer lien pour 'Désactiver le son'
  }

  function increaseVolume() {
    // augmenter le volume
    audioEl.volume = Math.min(audioEl.volume + audioSettings.volumeStep, 1.0);
    updateVolumeStateInfo();
    if (debug) console.log('Augmente volume.');
    // changer indicateur d'état
  }

  function decreaseVolume() {
    // diminuer le volume
    audioEl.volume = Math.max(audioEl.volume - audioSettings.volumeStep, 0.0);
    if (debug) console.log('Diminue volume.');
    updateVolumeStateInfo();
    // changer indicateur d'état
  }

  function updateVolumeStateInfo() {
    $('.volume-state').text(audioEl.volume.toFixed(2));
  }

  function updateAdvancementInfo() {
    var time;
    if (audioEl.ended) {
      if (debug) console.log('Player ended.');
      time = 0;
    } else time = audioEl.currentTime;
    $('.duration-played', activeClip).text(time.toFixed(2) + 's');
    $('.range', activeClip).val(time.toFixed(2));
  }

  function startSeekingAdvancement() {
    $('.range', activeClip).attr("max", audioEl.duration.toFixed(2));
    if (advId == null) {
      seekingAdvancement();
    }
  }

  function seekingAdvancement() {
    updateAdvancementInfo();
    if (audioEl.currentTime < audioEl.duration) {
      advId = setTimeout(seekingAdvancement, 1000);
    } else {
      stopAudioAction();
    }
  }

  function stopSeekingAdvancement() {
    if (advId != null) {
      clearTimeout(advId);
      advId = null;
    }
  }

  $(document).ready(function () {
    // faire des choses
    if (debug) console.log('Je commence');
    init();
  });
});
