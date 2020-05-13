import React from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import { size } from "lodash";
import { useNavigation } from "@react-navigation/native";

export default function ListRestaurants(props) {
    const { restaurants, handleLoadMore, isLoading } = props;
    const navigation = useNavigation();

    return (
        <View>
            {restaurants ? (
                <FlatList
                    data={restaurants}
                    renderItem={restaurant => (
                        <Restaurant restaurant={restaurant} navigation={navigation} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                    onEndReached={handleLoadMore}
                />
            ) : (
                <View style={styles.loaderRestaurants}>
                    <ActivityIndicator size="large" />
                    <Text>Cargando restaurantes</Text>
                </View>
            )}
        </View>
    )
}

function Restaurant(props) {
    const { restaurant, navigation } = props;
    const { id, images, name, description, address } = restaurant.item;
    const imageRestaurant = images[0];

    const goRestaurant = () => {
        navigation.navigate("restaurant", {
            id,
            name
        });
    }

    return (
        <TouchableOpacity onPress={goRestaurant}>
            <View style={styles.viewRestaurant}>
                <View style={styles.restaurantImage}>
                    <Image
                        resizeMode="cover"
                        PlaceholderContent={<ActivityIndicator color="#fff" />}
                        style={styles.imageRestaurant}
                        source={
                            imageRestaurant
                            ? { uri: imageRestaurant }
                            : require("../../../assets/img/no-image.png")
                        }
                    />
                </View>
                <View>
                    <Text style={styles.restaurantName}>{name}</Text>
                    <Text style={styles.restaurantAddress}>{address}</Text>
                    <Text style={styles.restaurantDescription}>{description.substr(0, 60)}...</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

function FooterList(props) {
    const { isLoading } = props;

    if(isLoading) {
        return (
            <View style={styles.loaderRestaurants}>
                <ActivityIndicator size="large" />
            </View>
        )
    } else {

        return (
            <View style={styles.notFountRestaurants}>
                <Text>No quedan restaurantes por cargar</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: "center",
    },
    viewRestaurant: {
        flexDirection: "row",
        margin: 10,
    },
    restaurantImage: {
        marginRight: 15,
    },
    imageRestaurant: {
        width: 80,
        height: 80,
    },
    restaurantName: {
        fontWeight: "bold",
    },
    restaurantAddress: {
        paddingTop: 2,
        color: "grey",
    },
    restaurantDescription: {
        paddingTop: 2,
        color: "grey",
        width: 300,
    },
    notFountRestaurants: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    }
});
