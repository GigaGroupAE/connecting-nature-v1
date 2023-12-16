import { useNavigation } from "@react-navigation/native";
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Pressable } from "react-native"
import { AntDesign } from 'react-native-vector-icons';

//theme
import { theme } from "../../theme";


const TeamsScreenHeader = ({pageTitle,btnTitle,btnOnPress}) => {
    const navigation = useNavigation()
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign
                        name="arrowleft"
                        size={28}
                        color={'#707070'}
                    />
                </TouchableOpacity>
                <Text style={styles.title}> {pageTitle}</Text>


            </View>
            <TouchableOpacity onPress={btnOnPress}>

                <Text style={styles.btnRight}>{btnTitle}</Text>
            </TouchableOpacity>

        </View>
    )
}

export default TeamsScreenHeader


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Dimensions.get('screen').width * 0.03,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'rgba(154, 154, 154, 0.5)'
    },
    title: {
        color: '#707070',
        fontFamily: theme.fonts.family.semiBold,
        fontSize: theme.fonts.size.h4,
        marginLeft: Dimensions.get('screen').width * 0.02
    },
    btnRight: {
        color: '#4582C3',
        fontFamily: theme.fonts.family.regular,
    }
})