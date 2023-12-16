import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [selectedStory, setSelectedStory] = useState("");
  const [Stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgloading, setImgloading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarTitle, setSnackbarTitle] = useState("Some Error occured");
  const [showmembers, setShowMembers] = useState(false);
  const [videoAutherName, setvideoAutherName] = useState("");
  const [reactions, setreactions] = useState(null);
  const [comment, setcomment] = useState(null);
  const [campaignViewShortImage, setcampaignViewShortImage] = useState(null);
  const [campaignPosts, setcampaignPosts] = useState([]);

  //mini window video player
  const [showMiniWindow, setShowMiniWindow] = useState(false);
  const [videoURI, setVideoURI] = useState(
    "https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4"
  );

  const [videoDescription, setVideoDescription] = useState("");
  const setVideoDescriptionHandler = (str) => {
    if (str.length > 22) {
      const newStr = str.slice(0, 15) + "...";
      setVideoDescription(newStr);
    } else {
      return setVideoDescription(str);
    }
  };

  const showSnackbar = (title) => {
    setSnackbarTitle(title);
    setSnackbarVisible(true);
  };

  const hideSnackbar = () => {
    setLoading(false);
    setSnackbarVisible(false);
  };

  const [group, setgroup] = useState(null);

  //tasks
  const [tasks, setTasks] = useState(null);
  const [campaignId, setCampaignId] = useState(null);

  //group privileges
  const [currentUserprivilege, setCurrentUserPrivilege] = useState(null);
  let counter = 0;
  const setPrivilege = (user, members) => {
    //find the user from members list and get it's privilege
    let privilege;
    for (const m of members) {
      if (m.member._id === user) {
        privilege = m.privilege;
        break;
      }
    }
    setCurrentUserPrivilege(privilege);
  };

  //active campaign to be used in the teams section
  const [activeCampaign, setActiveCampaign] = useState(null);

  //socket
  const [globalSocket, setGlobalSocket] = useState(null);
  return (
    <StateContext.Provider
      value={{
        reactions,
        setreactions,
        comment,
        setcomment,
        videoAutherName,
        setvideoAutherName,
        showmembers,
        setShowMembers,
        imgloading,
        setImgloading,
        loading,
        setLoading,
        snackbarVisible,
        snackbarTitle,
        showSnackbar,
        hideSnackbar,
        group,
        setgroup,
        showMiniWindow,
        setShowMiniWindow,
        videoURI,
        setVideoURI,
        videoDescription,
        setVideoDescriptionHandler,
        tasks,
        setTasks,
        campaignId,
        setCampaignId,
        setPrivilege,
        currentUserprivilege,
        activeCampaign,
        setActiveCampaign,
        globalSocket,
        setGlobalSocket,
        Stories,
        setStories,
        selectedStory,
        setSelectedStory,
        campaignViewShortImage,
        setcampaignViewShortImage,
        campaignPosts,
        setcampaignPosts,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
