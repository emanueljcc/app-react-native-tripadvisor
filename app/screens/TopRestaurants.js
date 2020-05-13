import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../components/Loading";

import { firebaseApp } from "../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListTopRestaurants from "../components/Ranking/ListTopRestaurants";

const db = firebase.firestore(firebaseApp);

export default function TopRestaurants(props) {
    const { navigation } = props;

    const toastRef = useRef();

    const [restaurants, setRestaurants] = useState([]);

    // TODO: select firebase orderby
    useEffect(() => {

        db.collection("restaurants")
            .orderBy("rating", "desc")
            .limit(5)
            .get()
                .then((response) => {

                    const restaurantsArr = [];

                    response.forEach(doc => {
                        const data = doc.data();
                        data.id = doc.id;
                        restaurantsArr.push(data);
                    });

                    setRestaurants(restaurantsArr);
                })

    }, []);

    return (
        <View>
            {restaurants.length === 0 ? (
                <Loading isVisible text="Cargando TopRanking"/>
            ) : (
                <ListTopRestaurants
                    restaurants={restaurants}
                    navigation={navigation}
                />
            )}
            <Toast ref={toastRef} position="center" opacity={0.9} />
        </View>
    );
}