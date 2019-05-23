/**
 * Providing a controller interface for users to switch between effects
 */
function Controller () {
  this.visualisers = {}
  this.visualiser = null
}

Controller.prototype.init = function (audioAnalyser, view) {
  // add html to display song's name
  // let audioname = $('<div></div>')
  // audioname.attr('id', 'audioname')
  // $('body').append(audioname)

  // add html to instruct user to drop a sound file
  let instructions = $('<div></div>')
  instructions.attr('id', 'instructions')
  instructions.append('<div>Drop a sound file to start</div>')
  $('body').append(instructions)

  // function to handle drop event
  function onDrop (e) {
    e.stopPropagation()
    e.preventDefault()

    let droppedFiles = e.target.files || e.dataTransfer.files
    // remove file extension string from file name
    // audioname.text(droppedFiles[0].name.replace(/\.[^/.]+$/, ''))

    let reader = new FileReader()
    reader.readAsArrayBuffer(droppedFiles[0])

    // read and analyse audio file
    reader.onload = function (fileEvent) {
      // remove instructions after file is loaded
      $('#instructions').fadeOut(function () {
        $(this).remove()
      })

      let data = fileEvent.target.result
      audioAnalyser.makeAudio(data)
      // call visualiser's render() function
      view.render(audioAnalyser, view)
    }

    // reader.readAsDataURL(droppedFiles[0])
  }

  // function to handle dragover event
  function onDrag (e) {
    e.stopPropagation()
    e.preventDefault()
    return false
  }

  // bind events with handler functions
  document.body.addEventListener('drop', onDrop, false)
  document.body.addEventListener('dragover', onDrag, false)

  this.visualisers = {
    'Bar': new Bar(),
    'Tricentric': new Tricentric(),
    'Silk': new Silk()
  }

  // add selector html
  let selector = $('<div></div>')
  selector.attr('id', 'selector')
  $('body').append(selector)

  let list = $('<ul></ul>')
  $('#selector').append(list)

  let visKeys = Object.keys(this.visualisers)
  for (let i = 0; i < visKeys.length; i++) {
    let li = $('<li>' + visKeys[i] + '</li>')
    li.attr('id', 'vis_' + visKeys[i])
    li.attr('class', 'visualiser')
    list.append(li)
  }

  let that = this

  // for each visualiser class
  $('.visualiser').each(function () {
    // when a visualiser is selected
    $(this).on('click', function () {
      let chosenVis = $(this).text()
      // if a different visualiser is chosen
      if (!that.visualiser || that.visualiser.name !== chosenVis) {
        // add class for CSS use
        $(this).siblings().removeClass('active')
        $(this).addClass('active')

        // destroy previous visualiser
        if (that.visualiser) {
          that.visualiser.destroy(view)
        }

        // visualiser = new Visualiser()
        that.visualiser = that.visualisers[ chosenVis ]
        // generate the effects and render
        that.visualiser.make(audioAnalyser, view)

        view.visualiser = that.visualiser
      }
    })
  })

  // stop animations of text when mouse moves on body
  $('body').mousemove(function () {
    $('#selector').stop().animate({ opacity: 1 }, 150, function () {
      setTimeout(function () {
        $('#selector').stop().animate({ opacity: 0 }, 5000)
      }, 2000)
    })

    $('#audioname').stop().animate({ opacity: 1 }, 150, function () {
      setTimeout(function () {
        $('#audioname').stop().animate({ opacity: 0.1 }, 12500)
      }, 7000)
    })
  })

  // load the Bar visualiser when the page is initialised
  $('#vis_Bar').trigger('click')
}
