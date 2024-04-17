//utility function to check if the loggedInuser is following other user

export const isFollowing = (followingList, phoneNumber) =>
  followingList?.some((user) => user.phoneNumber === phoneNumber);

export const shortenText = (text, maxWords) => {
  if (!text) {
    return text;
  }

  const words = text.split(' ');

  if (words.length <= maxWords) {
    return text;
  } else {
    return words.slice(0, maxWords).join(' ') + '...';
  }
};
