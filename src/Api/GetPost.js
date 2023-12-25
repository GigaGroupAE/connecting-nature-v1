import axios from "axios"
import { axiosInstance } from "../../axiosInstance"

const LIMIT = "12"

export const fetchPosts = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/posts/posts-pagination?page=${pageParam}&limit=${LIMIT}`
  )
  return response.data
}

export const fetchStories = async ({ pageParam = 1 }) => {
  const response = await axiosInstance.get(
    `/story/getstories?page=${pageParam}&limit=${LIMIT}`
  )
  return response.data
}

export const fetchRecentCampaigns = async () => {
  const response = await axiosInstance.get("/campaigns/mostrecentcampaign")
  return response.data?.campaigns
}

export const fetchPostsByCampaign = async ({ pageParam = 1, campaignId }) => {
  const response = await axiosInstance.get(
    `/posts/getPostByCampaign/${campaignId}?page=${pageParam}&limit=${LIMIT}`
  )
  return response.data
}

export const fetchUserPosts = async (userPhoneNumber, pageParam = 1) => {
  const response = await axiosInstance.get(
    `/posts/get-user-posts/${userPhoneNumber}?page=${pageParam}`
  )
  return response.data
}
