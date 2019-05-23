/**
 * Allowing visualisers to create spectrums for further use
 */
function Spectrum () {
  this.SpectrumMaxExp = 5
  this.SpectrumMinExp = 3
  // represents amplitude of signal
  this.SpectrumHeight = 255
  // the higher the more accurate but more resource consuming
  this.SpectrumBarCount = 64
}

Spectrum.prototype.spectrumEase = function (v) {
  return Math.pow(v, 2.55)
}

// a quick transformation of the array from time domain to frequency domain
Spectrum.prototype.exponentialTransform = function (array) {
  let transformedArray = []
  for (let i = 0; i < array.length; i++) {
    let exp = this.SpectrumMaxExp + (this.SpectrumMinExp - this.SpectrumMaxExp) * (i / array.length)
    transformedArray[i] = Math.max(Math.pow(array[i] / this.SpectrumHeight, exp) * this.SpectrumHeight, 1)
  }
  return transformedArray
}

// called by visualisers to get raw data
Spectrum.prototype.getVisualBins = function (dataArray, NumOfElements, SpectrumStart, SpectrumEnd) {
  let SamplePoints = []
  let LastSpot = 0
  this.SpectrumBarCount = NumOfElements
  for (let i = 0; i < this.SpectrumBarCount; i++) {
    let Bin = Math.round(this.spectrumEase(i / this.SpectrumBarCount) * (SpectrumEnd - SpectrumStart) + SpectrumStart)
    if (Bin <= LastSpot) {
      Bin = LastSpot + 1
    }
    LastSpot = Bin
    SamplePoints[i] = Bin
  }

  let MaxSamplePoints = []
  for (let i = 0; i < this.SpectrumBarCount; i++) {
    let CurSpot = SamplePoints[i]
    let NextSpot = SamplePoints[i + 1]
    if (NextSpot == null) {
      NextSpot = SpectrumEnd
    }

    let CurMax = dataArray[CurSpot]
    let MaxSpot = CurSpot
    let Dif = NextSpot - CurSpot
    for (let j = 1; j < Dif; j++) {
      let NewSpot = CurSpot + j
      if (dataArray[NewSpot] > CurMax) {
        CurMax = dataArray[NewSpot]
        MaxSpot = NewSpot
      }
    }
    MaxSamplePoints[i] = MaxSpot
  }

  let newDataArray = []
  for (let i = 0; i < this.SpectrumBarCount; i++) {
    let NextMaxSpot = MaxSamplePoints[i]
    let LastMaxSpot = MaxSamplePoints[i - 1]
    if (LastMaxSpot == null) {
      LastMaxSpot = SpectrumStart
    }
    let LastMax = dataArray[LastMaxSpot]
    let NextMax = dataArray[NextMaxSpot]

    newDataArray[i] = (LastMax + NextMax) / 2
    if (isNaN(newDataArray[i])) {
      newDataArray[i] = 0
    }
  }

  return this.exponentialTransform(newDataArray)
}
