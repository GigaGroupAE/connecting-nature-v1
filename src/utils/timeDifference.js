export const calculateTimeDifference = (someDate) => {
  try {
    let presentDate = new Date()
    let ourDate = new Date(someDate)
    var diff = (presentDate.getTime() - ourDate.getTime()) / 1000
    diff /= 60
    let minutes = Math.abs(Math.round(diff))

    if (minutes < 1) {
      return "Just now"
    } else if (minutes < 60) {
      return `${minutes}m ago`
    } else if (minutes < 1440) {
      let hours = Math.floor(minutes / 60)
      return `${hours}h ago`
    } else if (minutes < 43800) {
      let days = Math.floor(minutes / 1440)
      return `${days}d ago`
    } else if (minutes < 525600) {
      let months = Math.floor(minutes / 43800)
      return `${months} month ago`
    } else {
      let years = Math.floor(minutes / 525600)
      return `${years}y ago`
    }
  } catch (error) {
    console.log("error in date")
    return ""
  }
}

function appropriateMessage(minutes) {
  if (minutes < 60) {
    //this block handle minutes
    return `${minutes}m ago`
  } else if (minutes < 1440) {
    //this block handle hours
    //since a day has 1440 minutes
    let hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  } else if (minutes < 43800) {
    //since a month has 43800 minutes
    //this block handle days
    let days = Math.floor(minutes / 1440)
    return `${days}d ago`
  } else {
    //this block handle months
    let months = Math.floor(minutes / 43800)
    return `${months} month ago`
  }
}
