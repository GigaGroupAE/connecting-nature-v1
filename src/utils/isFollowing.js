//utility function to check if the loggedInuser is following other user

export const isFollowing = (followingList, phoneNumber) =>
  followingList?.some((user) => user.phoneNumber === phoneNumber);
