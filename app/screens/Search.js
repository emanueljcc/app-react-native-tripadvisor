import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator } from "react-native";
import { SearchBar, ListItem, Icon } from "react-native-elements";
import { FireSQL } from "firesql";

// TODO: SINTAXYS SQL EN firebase
import firebase from "firebase/app";

const fireSQL = new FireSQL(firebase.firestore(),{ includeId: "id" });

export default function Search(props) {
    const { navigation } = props;
    const [search, setSearch] = useState("");
    const [restaurants, setRestaurants] = useState([]);

    // TODO: SINTAXYS SQL EN firebase
    useEffect(() => {

        if(search) {
            fireSQL.query(`SELECT * FROM restaurants WHERE name LIKE '${search}%'`)
                .then(response => {
                    setRestaurants(response);
                })
        } else {
            setRestaurants([]);
        }

    }, [search]);

    return (
        <View>
            <SearchBar
                placeholder="Busca tu restaurante..."
                onChangeText={(e) => setSearch(e)}
                containerStyle={styles.searchBar}
                value={search}
            />
            {restaurants.length === 0 ? (
                <NotFoundRestaurants />
            ) : (
                <>
                    {restaurants.length > 0 ? (
                        <FlatList
                            data={restaurants}
                            renderItem={(restaurant) => <Restaurant
                                                            restaurant={restaurant}
                                                            navigation={navigation}
                                                        />}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <ActivityIndicator color="#00a680"/>
                    )}
                </>
            )}
        </View>
    );
}

{/* <ActivityIndicator color="#00a680"/> */}

function NotFoundRestaurants() {
    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Image
                source={require("../../assets/img/not-result-found.png")}
                resizeMode="cover"
                style={{ width: 200, height: 200 }}
            />
        </View>
    );
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { id, name, images } = restaurant.item;

    return (
        <ListItem
            title={name}
            leftAvatar={{
                source: images[0] ? { uri: images[0] } : require("../../assets/img/no-image.png")
            }}
            rightIcon={
                <Icon
                    type="material-community"
                    name="chevron-right"
                />
            }
            onPress={() => navigation.navigate("restaurants", {
                                screen: "restaurant",
                                params: {
                                    id,
                                    name
                                }
                            })}
        />
    );
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20,
    },
});