import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";

export default function UserGuest(){
    // llamar TODO: navigation
    const navigation = useNavigation();

    return (
        <ScrollView centerContent style={styles.viewBody}>
            <Image
                source={require("../../../assets/img/UserGuest.jpg")}
                resizeMode="contain"
                style={styles.image}
            />
            <Text style={styles.title}>Consulta tu perfil de App Restaurantes</Text>
            <Text style={styles.description}>
                ¿Como describirias tu mejor restaurante? Busca y visualiza lis mejores restaurantes de una forma sencilla, vota cual te ha gustado mas y comneta como ha sido  tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button
                    buttonStyle={styles.btnStyle}
                    containerStyle={styles.btnContainer}
                    title="Ver tu perfil"
                    onPress={() => navigation.navigate("login")}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    viewBody: {
        marginLeft: 30,
        marginRight: 30,
    },
    image: {
        height: 300,
        width: "100%",
        marginBottom: 40,
    },
    title: {
        fontWeight: "bold",
        fontSize: 19,
        marginBottom: 10,
        textAlign: "center",
    },
    description: {
        textAlign: "center",
        marginBottom: 20,
    },
    btnStyle: {
        backgroundColor: "#00a680"
    },
    btnContainer: {
        width: "70%",
    },
    viewBtn: {
        flex: 1,
        alignItems: "center"
    }
});