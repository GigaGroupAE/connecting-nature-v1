import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Color from '../../../assets/colors/Color';
import { useQuery } from 'react-query';
import {
  getSavedDecorations,
  removeSavedDecorations,
} from '../../utils/Decorate';
import { useUserState } from '../../slices/userSlice';
import {
  descriptionTextStyle,
  itemTitle,
  mainContainer,
  tagContainer,
  tagText,
} from '../Decorations/ModalStyle';
import { screenHeight, screenWidth } from '../../utils/ScreenDimensions';
import { BASE_URL } from '../../../CONSTANTS';
import CheckedBox from '../../components/SVG/CheckedBox';
import UnCheckedBox from '../../components/SVG/unCheckedBox';
import { AntDesign } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import ThreeDotsVerticalSvg from '../../components/SVG/dotsThreeVertical';
import AffordableSkeletonLoad from '../Decorations/AffordableSkeletonLoad';
import NoDataIndicater from '../NoDataIndicater';
import NoItemIndicater from '../../components/NoItemIndicater';

const SavedDecoration = () => {
  const navigation = useNavigation();
  const userState = useUserState();
  const [isSelectionOpen, setisSelectionOpen] = useState(false);
  const [modalOptions, setmodalOptions] = useState(false);
  const [selectedItems, setselectedItems] = useState([]);
  const [deleteAll, setdeleteAll] = useState([]);
  const { data, isLoading, refetch } = useQuery('savedDecorate', () =>
    getSavedDecorations(userState?.id),
  );

  useEffect(() => {
    if (data) {
      const ids = data?.map((e) => e?._id);
      setdeleteAll(ids);
    }
  }, []);

  const handleSelectItme = () => {
    setmodalOptions(!modalOptions);
  };
  const handleCheckItems = () => {
    setmodalOptions(false);
    setisSelectionOpen(true);
  };

  const handleAddItem = (item) => {
    const isAlreadyAdded = selectedItems?.some((e) => e === item?._id);
    if (isAlreadyAdded) {
      setselectedItems((pre) => pre?.filter((p) => p !== item?._id));
    } else {
      setselectedItems([...selectedItems, item?._id]);
    }
  };

  const handleRemoveItems = async () => {
    try {
      const data = await removeSavedDecorations(userState?.id, selectedItems);
      setselectedItems([]);
      setisSelectionOpen(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      const data = await removeSavedDecorations(userState?.id, deleteAll);
      setselectedItems([]);
      setisSelectionOpen(false);
      setmodalOptions(false);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const Header = () => {
    return (
      <View style={styles.headerContainer}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flex: 2,
            alignItems: 'center',
          }}
        >
          <Pressable
            android_ripple={{ color: Color.VeryLightGrey, borderless: true }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign
              name="arrowleft"
              size={24}
              color={Color.Black}
              style={{ alignSelf: 'center', alignItems: 'center' }}
            />
          </Pressable>

          {selectedItems?.length === 0 ? (
            <Text style={styles.title}>Saved Decoration</Text>
          ) : (
            <Text
              style={styles.title}
            >{`${selectedItems?.length} Selected`}</Text>
          )}
        </View>

        {selectedItems?.length === 0 ? (
          <Pressable onPress={handleSelectItme}>
            <ThreeDotsVerticalSvg />
          </Pressable>
        ) : (
          <TouchableOpacity onPress={handleRemoveItems}>
            <Text
              style={{
                ...styles.title,
                color: Color.Purple,
                fontFamily: 'Roboto_400Regular',
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      {isLoading ? (
        <AffordableSkeletonLoad />
      ) : (
        <View
          style={{
            flex: 1,
          }}
        >
          {data?.length === 0 ? (
            <NoItemIndicater
              title="Currently No Saved Items Available"
              description="Currently, there are no saved items in this section. Once you save your items it will be listed here. Where you can see again in the future or delete."
              image={require('../../../assets/campaignICon.png')}
              buttonTitle="Start Decoration"
              buttonColor={Color.Purple}
            />
          ) : (
            <FlatList
              data={data}
              renderItem={({ item }) => {
                const shortTitle =
                  item?.title?.length > 15
                    ? item?.title?.slice(0, 17) + '...'
                    : item?.title;

                const shortCategorieText =
                  item?.categorie?.length > 15
                    ? item?.categorie.slice(0, 15) + '...'
                    : item?.categorie;

                const isAlreadyAdded = selectedItems?.some(
                  (e) => e === item?._id,
                );

                return (
                  <Pressable
                    style={mainContainer}
                    // onPress={() => handleItemPress(item)}
                    onLongPress={() => setisSelectionOpen(!isSelectionOpen)}
                  >
                    <View style={styles.leftContainer}>
                      {isSelectionOpen && (
                        <TouchableOpacity onPress={() => handleAddItem(item)}>
                          {isAlreadyAdded ? <CheckedBox /> : <UnCheckedBox />}
                        </TouchableOpacity>
                      )}
                      <Image
                        source={{
                          uri: `${BASE_URL}/images/${item?.images[0]?.name}`,
                        }}
                        style={styles.productImage}
                      />
                      <View
                        style={{
                          height: '80%',
                          gap: 5,
                        }}
                      >
                        <Text style={itemTitle}>{shortTitle}</Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Text
                            style={{
                              ...descriptionTextStyle,
                              fontSize: screenHeight * 0.016,
                            }}
                          >
                            Type.
                          </Text>
                          <Text style={descriptionTextStyle}>
                            {shortCategorieText}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.rightContainer}>
                      <Text style={itemTitle}>{item?.price} PKR</Text>
                      <View style={tagContainer}>
                        <Text style={tagText}>{item?.tag}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      )}

      {modalOptions && (
        <View style={styles.savedContainer}>
          <TouchableOpacity onPress={handleCheckItems}>
            <Text style={styles.titleSaved}>Select Items</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeleteAll}>
            <Text style={styles.titleSaved}>Delete All</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SavedDecoration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  selectedImages: {
    width: screenWidth * 0.14,
    height: screenHeight * 0.14,
    borderRadius: 8,
    marginLeft: 10,
  },
  leftContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  productImage: {
    width: screenWidth * 0.18,
    height: screenHeight * 0.053,
    resizeMode: 'cover',
    borderRadius: screenHeight * 0.01,
  },

  savedContainer: {
    backgroundColor: Color.White,
    position: 'absolute',
    right: screenWidth * 0.1,
    width: screenWidth * 0.43,
    paddingHorizontal: screenWidth * 0.03,
    paddingVertical: screenHeight * 0.015,
    top: screenHeight * 0.05,
    borderRadius: screenHeight * 0.01,
    shadowColor: Color.Black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    gap: 16,
  },
  titleSaved: {
    fontFamily: 'Roboto_500Medium',
    fontSize: screenHeight * 0.016,
  },

  headerContainer: {
    backgroundColor: Color.White,
    alignContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 2,
    borderColor: Color.VeryLightGrey,
    justifyContent: 'space-between',
  },
  title: {
    color: Color.Black,
    fontSize: 17,
    fontFamily: 'Roboto_600SemiBold',
    marginLeft: 10,
    marginTop: 2,
    lineHeight: 30,
    textAlignVertical: 'center',
  },
});
