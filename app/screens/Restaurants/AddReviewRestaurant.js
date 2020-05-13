import React, { useState, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import { AirbnbRating, Button, Input, Tile } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
    const { navigation, route } = props;
    const toastRef = useRef();
    const { idRestaurant } = route.params;
    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const addReview = () => {
        if (!rating) {
            toastRef.current.show("No has dado ninguna puntucacion");
        } else if (!title) {
            toastRef.current.show("El titulo es obligatorio");
        } else if (!review) {
            toastRef.current.show("El comentario es obligatorio");
        } else {
            setIsLoading(true);
            const user = firebase.auth().currentUser;
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant,
                title,
                review,
                rating,
                createAt: new Date(),
            };

            db.collection("reviews").add(payload)
                .then(() => {
                    updateRestaurant();
                })
                .catch(() => {
                    toastRef.current.show("Error al enviar la review");
                    setIsLoading(false);
                });
        }
    }

    // TODO: SELECT firebase
    const updateRestaurant = () => {
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get()
            .then((response) => {
                const restaurantData = response.data();
                const ratingTotal = restaurantData.ratingTotal + rating;
                const quantityVoting = restaurantData.quantityVoting + 1;
                const ratingResult = ratingTotal / quantityVoting;

                // TODO: UPDATE FIREBASE
                restaurantRef.update({
                    rating: ratingResult,
                    ratingTotal,
                    quantityVoting
                })
                    .then(() => {
                        setIsLoading(false);
                        navigation.goBack();
                    });
            })
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating
                    count={5}
                    reviews={["Pesimo", "Deficiente", "Normal", "Muy Bueno", "Excelente"]}
                    defaultRating={0}
                    size={35}
                    onFinishRating={(value) => setRating(value)}
                />
            </View>
            <View style={styles.forReview}>
                <Input
                    placeholder="Titulo"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input
                    placeholder="Comentario"
                    multiline
                    containerStyle={styles.input}
                    inputContainerStyle={styles.textArea}
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Enviar comentario"
                    containerStyle={styles.btnContainer}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                />
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9} />
            <Loading isVisible={isLoading} text="Enviando comentario" />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2",
    },
    forReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnContainer: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    }
});
