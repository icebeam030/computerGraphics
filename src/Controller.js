/**
 * Providing a controller interface for users to switch between effects
 */
function Controller () {
  this.visualiser = null
}

Controller.prototype.init = function (audioAnalyser, view) {
  let that = this

  // function to handle drop event
  function onDrop (e) {
    e.stopPropagation()
    e.preventDefault()

    let droppedFiles = e.target.files || e.dataTransfer.files

    // remove file extension string from file name
    $('#audioname').text(droppedFiles[0].name.replace(/\.[^/.]+$/, ''))

    // remove instructions after file is loaded
    $('#instructions').fadeOut(function () {
      $(this).remove()
    })

    audioAnalyser.makeAudio(droppedFiles[0])

    // call visualiser's render() function
    view.render(audioAnalyser, view)
  }

  // function to handle dragover event
  function onDrag (e) {
    e.stopPropagation()
    e.preventDefault()
  }

  // bind events with handler functions
  document.body.addEventListener('drop', onDrop, false)
  document.body.addEventListener('dragover', onDrag, false)

  // initialise visualisers
  let bar = new Bar()
  let silk = new Silk()
  let tricentric = new Tricentric()

  // activate Bar effect on page load
  this.visualiser = bar
  this.visualiser.make(audioAnalyser, view)
  view.visualiser = this.visualiser

  function onKeyDown (e) {
    switch (e.which) {
      // press Space to play/pause music
      case 32:
        if (audioAnalyser.paused) {
          audioAnalyser.audio.play()
          audioAnalyser.paused = false
        } else {
          audioAnalyser.audio.pause()
          audioAnalyser.paused = true
        }
        break
      // press 1, 2, 3 to switch between visualisers
      case 49:
        if (that.visualiser) {
          that.visualiser.destroy(view)
        }
        that.visualiser = bar
        that.visualiser.make(audioAnalyser, view)
        view.visualiser = that.visualiser
        break
      case 50:
        if (that.visualiser) {
          that.visualiser.destroy(view)
        }
        that.visualiser = tricentric
        that.visualiser.make(audioAnalyser, view)
        view.visualiser = that.visualiser
        break
      case 51:
        if (that.visualiser) {
          that.visualiser.destroy(view)
        }
        that.visualiser = silk
        that.visualiser.make(audioAnalyser, view)
        view.visualiser = that.visualiser
        break
    }
  }

  document.addEventListener('keydown', onKeyDown, false)

  // stop animations of text when mouse moves
  $('body').mousemove(function () {
    $('#hint').stop().animate({ opacity: 1 }, 150, function () {
      setTimeout(function () {
        $('#hint').stop().animate({ opacity: 0 }, 5000)
      }, 2000)
    })

    $('#audioname').stop().animate({ opacity: 1 }, 150, function () {
      setTimeout(function () {
        $('#audioname').stop().animate({ opacity: 0.1 }, 5000)
      }, 2000)
    })
  })
}
