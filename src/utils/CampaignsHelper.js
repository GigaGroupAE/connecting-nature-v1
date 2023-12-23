import { axiosInstance } from "../../axiosInstance"

export const fetchCampaigns = async () => {
  const response = await axiosInstance.get(
    "/campaigns/get-multiple-by-query?status=executed"
  )
  return response.data.campaigns
}
export const fetchArchivedCampaigns = async () => {
  const response = await axiosInstance.get("/archives/getArchiveCampaigns")
  return response.data.newcampaigns
}
export const getRemainingTime = (endTime) => {
  const currentDate = new Date()
  const endDate = new Date(endTime)
  const timeDifference = endDate - currentDate

  if (timeDifference <= 0) {
    return "Campaign ended"
  }

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} left`
  }

  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  )
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} left`
  }

  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
  return `${minutes} minute${minutes > 1 ? "s" : ""} left`
}
