import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SocialIcon } from "react-native-elements";
import * as firebase from "firebase";
import * as Facebook from "expo-facebook";
import { FacebookApi } from "../../utils/social";
import { useNavigation } from "@react-navigation/native";
import Loading from "../Loading";

export default function LoginFacebook(props) {
    const { toastRef } = props;
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const login = async () => {
        await Facebook.initializeAsync(FacebookApi.application_id);

        const { type, token } = await Facebook.logInWithReadPermissionsAsync({
            permissions: FacebookApi.permissions,
        });

        if (type === "success") {
            const credentials = firebase.auth.FacebookAuthProvider.credential(token);
            setLoading(true);
            firebase.auth().signInWithCredential(credentials)
            .then(() => {
                setLoading(false);
                navigation.navigate("account");
            })
            .catch(() => {
                setLoading(false);
                toastRef.current.show("Credenciales incorrectas");
            });

        } else if(type === "cancel") {
            toastRef.current.show("Inicio de sesion cancelado");
        } else {
            toastRef.current.show("Error desconocido, intentelo mas tarde");
        }

    }

    return (
        <>
            <SocialIcon
                title="Iniciar sesion con Facebook"
                button
                type="facebook"
                onPress={login}
            />
            <Loading isVisible={loading} text="Iniciando sesion" />
        </>
    );
}

const styles = StyleSheet.create({})
