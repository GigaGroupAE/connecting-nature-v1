//utility function to check if the loggedInuser is following other user

export const isFollowing = (followingList, phoneNumber) =>
  followingList?.some((user) => user.phoneNumber === phoneNumber);

export const shortenText = (text, maxLength) => {
  if (!text || text.length <= maxLength) {
    return text;
  } else {
    return text.slice(0, maxLength) + '...';
  }
};
