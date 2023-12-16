import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Notifications from 'expo-notifications';

// Show notifications in both background or foreground
Notifications.setNotificationHandler({
    handleNotification: async () => {
        return {
            shouldShowAlert: true
        };
    }
})


// This is required for the IOS
const SendingPushNotificationsFromApp = () => {
    const [pushToken, setPushToken] = useState("");
    useEffect(() => {
        const backgroundSubscription = Notifications.addNotificationResponseReceivedListener(
            (notifications) => {
                console.log("Background Notification Clicked", notifications);
            }
        );
        const foregroundSubscription = Notifications.addNotificationReceivedListener(
            (notification) => {
                console.log(notification);
            }
        );

        return () => {
            backgroundSubscription.remove();
            foregroundSubscription.remove();
        }
    }, []);

    const handleButtonPress = () => {
        fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip, deflate',
                'Content-Type': "application/json",
            },
            body: JSON.stringify({
                to: pushToken,
                data: { name: "Umar", city: "Faisalabad" },
                title: "This is the title of server push notification",
                body: "Some body content for the expo server data"
            })
        })
    }

    useEffect(() => {
        //Getting expo push token
        Notifications.getExpoPushTokenAsync()
            .then(resp => {
                setPushToken(resp.data);
            })
            .catch((err) => {
                console.log(err);
                return null;
            })
        //exlint-disable-next-line
    }, []);

    return (
        <View>
            <Text>7. Sending a push Notification using Expo from the App</Text>
            <Button onPress={handleButtonPress} title="Push Notification" />
        </View>
    );
}

export default SendingPushNotificationsFromApp;