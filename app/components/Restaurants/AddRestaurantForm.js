import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Input, Icon, Avatar, Image, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as  Location from "expo-location";
import { map, size, filter } from "lodash";
import Modal from "../Modal";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
    const { toastRef, setIsLoading, navigation } = props;
    const [restaurantName, setRestaurantName] = useState("");
    const [restaurantAddress, setRestaurantAddress] = useState("");
    const [restaurantDescription, setRestaurantDescription] = useState("");
    const [imagesSelected, setImagesSelected] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [locationRestaurant, setLocationRestaurant] = useState(null);

    // TODO: GUARDAR EN MODELO SAVE FIREBASE DB
    const addRestaurant = () => {
        if (!restaurantName || !restaurantAddress || !restaurantDescription) {
            toastRef.current.show("Todos los campos del formulario son obligatorios");
            } else if (size(imagesSelected) === 0) {
                toastRef.current.show("El restaurante tiene que tener almenos una foto");
            } else if (!locationRestaurant) {
                toastRef.current.show("Tienes que localizar el restaurnate en el mapa");
            } else {
                setIsLoading(true);
                uploadImageStorage()
                    .then((response) => {
                        db.collection("restaurants")
                        .add({
                            name: restaurantName,
                            address: restaurantAddress,
                            description: restaurantDescription,
                            location: locationRestaurant,
                            images: response,
                            rating: 0,
                            ratingTotal: 0,
                            quantityVoting: 0,
                            createAt: new Date(),
                            createBy: firebase.auth().currentUser.uid,
                        })
                        .then(() => {
                            setIsLoading(false);
                            navigation.navigate("restaurants");
                        })
                        .catch(() => {
                            setIsLoading(false);
                            toastRef.current.show(
                                "Error al subir el restaurante, intentelo más tarde"
                            );
                        });
                });
        }
    };

    // TODO: SUBIR IMAGENES
    const uploadImageStorage = async () => {
        const imageBlob = [];

        await Promise.all(
            map(imagesSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async (result) => {
                await firebase
                    .storage()
                    .ref(`restaurants/${result.metadata.name}`)
                    .getDownloadURL()
                    .then((photoUrl) => {
                        imageBlob.push(photoUrl);
                    });
                });
            })
        );

        return imageBlob;
    };

    return (
        <ScrollView style={styles.scrollView}>
            <ImageRestaurant imageRestaurant={imagesSelected[0]} />
            <FormAdd
                setRestaurantName={setRestaurantName}
                setRestaurantAddress={setRestaurantAddress}
                setRestaurantDescription={setRestaurantDescription}
                setIsVisible={setIsVisible}
                locationRestaurant={locationRestaurant}
            />
            <UploadImage
                toastRef={toastRef}
                imagesSelected={imagesSelected}
                setImagesSelected={setImagesSelected}
            />
            <Button
                title="Crear restaurante"
                onPress={addRestaurant}
                buttonStyle={styles.btnAddRestaurant}
            />
            <Map isVisible={isVisible} setIsVisible={setIsVisible} setLocationRestaurant={setLocationRestaurant} toastRef={toastRef} />
        </ScrollView>
    );
}

function ImageRestaurant(props) {
    const { imageRestaurant } = props;

    return (
        <View style={styles.viewPhoto}>
            <Image
                source={imageRestaurant ? { uri: imageRestaurant } : require("../../../assets/img/no-image.png")}
                style={{ width: widthScreen, height: 200}}
            />
        </View>
    );
}

function FormAdd(props) {
    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisible, locationRestaurant } = props;

    return (
        <View style={styles.viewForm}>
            <Input
                placeholder="Nombre del restaurante"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantName(e.nativeEvent.text)}
            />
            <Input
                placeholder="Direccion"
                containerStyle={styles.input}
                onChange={(e) => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#00a680" : "#c2c2c2",
                    onPress: () => setIsVisible(true)
                }}
            />
            <Input
                placeholder="Descripccion del restaurante"
                multiline
                inputContainerStyle={styles.textArea}
                containerStyle={styles.input}
                onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props) {
    const { isVisible, setIsVisible, setLocationRestaurant, toastRef } = props;
    const [location, setLocation] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );

            const statusPermissions = resultPermissions.permissions.location.status;

            if (statusPermissions !== "granted") {
                toastRef.current.show("Tienes que aceptar los permisos de localizacion para crear un restaurante", 3000);
            } else {
                const loc = await Location.getCurrentPositionAsync({});
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                });
            }

        })();
    }, []);

    const configLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localizacion guardada correctamente");
        setIsVisible(false);
    }

    return (
        <Modal isVisible={isVisible} setIsVisible={setIsVisible} >
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                            coordinate={{
                                latitude: location.latitude,
                                longitude: location.longitude,
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button
                        title="Guardar ubicacion"
                        containerStyle={styles.viewMapBtnContainerSave}
                        buttonStyle={styles.viewMapBtnSave}
                        onPress={configLocation}
                    />
                    <Button
                        title="Cancelar ubicacion"
                        containerStyle={styles.viewMapBtnContainerCancel}
                        buttonStyle={styles.viewMapBtnCancel}
                        onPress={() => setIsVisible(false)}
                    />
                </View>
            </View>
        </Modal>
    );
}

function UploadImage(props) {
    const { toastRef, imagesSelected, setImagesSelected } = props;

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        if (resultPermissions === "denied") {
            toastRef.current.show("Es necesario aceptar los permisos de la galeria.", 3000);
        } else {
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (result.cancelled) {
                toastRef.current.show("Has cerrado la galeria sin seleccionar ninguna imagen", 3000);
            } else {
                setImagesSelected([
                    ...imagesSelected,
                    result.uri
                ]);
            }

        }
    }

    const removeImage = (image) => {
        const arrImage = imagesSelected;

        Alert.alert(
            "Eliminar imagen",
            "¿Estas seguro que quieres eliminar la imagen?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "ELiminar",
                    onPress: () => {
                        setImagesSelected(
                            filter(arrImage, (imageURL) => imageURL !== image)
                        );
                    }
                }
            ],
            { cancelable: false }
        )
    }

    return (
        <View style={styles.viewImage}>
            {size(imagesSelected) < 4 && (
                <Icon
                    type="material-community"
                    name="camera"
                    color="#7a7a7a"
                    containerStyle={styles.containerIcon}
                    onPress={imageSelect}
                />
            )}
            {map(imagesSelected, (image, i) => (
                <Avatar
                    key={i}
                    style={styles.miniatureStyle}
                    source={{ uri: image }}
                    onPress={() => removeImage(image)}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%",
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0,
    },
    btnAddRestaurant: {
        backgroundColor: "#00a680",
        margin: 20,
    },
    viewImage: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
    },
    containerIcon:{
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        height: 70,
        width: 70,
        backgroundColor: "#e3e3e3",
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10,
    },
    viewPhoto: {
        alignItems: "center",
        height: 200,
        marginBottom: 20,
    },
    mapStyle: {
        width: "100%",
        height: 550,
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop:10,
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5,
    },
    viewMapBtnCancel: {
        backgroundColor: "#a60d0d",
    },
    viewMapBtnContainerSave: {
        paddingRight: 5,
    },
    viewMapBtnSave: {
        backgroundColor: "#00a680",
    }
});