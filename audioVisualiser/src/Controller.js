/**
 * Providing a controller interface for users to switch between effects
 */
function Controller () {
  this.visualisers = {}
  this.visualiser = null
}

Controller.prototype.init = function (audioAnalyser, view) {
  // add html to display song's name
  let audioname = $('<div></div>')
  audioname.attr('id', 'audioname')
  $('body').append(audioname)

  let that = this

  // function to handle drop event
  function onDrop (e) {
    e.stopPropagation()
    e.preventDefault()

    let droppedFiles = e.target.files || e.dataTransfer.files

    // remove file extension string from file name
    audioname.text(droppedFiles[0].name.replace(/\.[^/.]+$/, ''))

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

  this.visualisers = {
    'Bar': new Bar(),
    'Tricentric': new Tricentric(),
    'Silk': new Silk()
  }

  function onKeyDown (e) {
    switch (e.which) {
      // press p to play/pause music
      case 80:
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
        that.visualiser = that.visualisers['Bar']
        that.visualiser.make(audioAnalyser, view)
        view.visualiser = that.visualiser
        break
      case 50:
        if (that.visualiser) {
          that.visualiser.destroy(view)
        }
        that.visualiser = that.visualisers['Tricentric']
        that.visualiser.make(audioAnalyser, view)
        view.visualiser = that.visualiser
        break
      case 51:
        if (that.visualiser) {
          that.visualiser.destroy(view)
        }
        that.visualiser = that.visualisers['Silk']
        that.visualiser.make(audioAnalyser, view)
        view.visualiser = that.visualiser
        break
    }
  }

  document.addEventListener('keydown', onKeyDown, false)

  // activate Bar effect on page load
  this.visualiser = this.visualisers['Bar']
  this.visualiser.make(audioAnalyser, view)
  view.visualiser = this.visualiser

  // add class for CSS use
  // $(this).siblings().removeClass('active')
  // $(this).addClass('active')

  // stop animations of text when mouse moves
  // $('body').mousemove(function () {
  //   $('#audioname').stop().animate({ opacity: 1 }, 150, function () {
  //     setTimeout(function () {
  //       $('#audioname').stop().animate({ opacity: 0.1 }, 12500)
  //     }, 7000)
  //   })
  // })
}
