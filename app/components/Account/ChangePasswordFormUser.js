import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

export default function ChangePasswordFormUser(props) {
    const { setShowModal, toastRef } = props;
    const [showPassword, setShowPassword] = useState(defaultValue("show"));
    const [formData, setFormData] = useState(defaultValue("form"));
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({
            ...formData,
            [type]: e.nativeEvent.text,
        });
    }

    const onSubmit = async () => {
        let isSetError = true;

        setError({});

        let errorTemp = {};

        if (!formData.password || !formData.newPassword || !formData.repeatNewPassword) {
            errorTemp = {
                password: !formData.password  && "La contraseña no puede estar vacia",
                newPassword: !formData.newPassword && "La contraseña no puede estar vacia",
                repeatNewPassword: !formData.repeatNewPassword && "La contraseña no puede estar vacia",
            };
        } else if (formData.newPassword !== formData.repeatNewPassword) {
            errorTemp = {
                newPassword: "Las contraseñas no son iguales",
                repeatNewPassword: "Las contraseñas no son iguales",
            };
        } else if (size(formData.newPassword) < 6) {
            errorTemp = {
                newPassword: "Las contraseñas tiene que ser mayor a 6 caracteres",
                repeatNewPassword: "Las contraseñas tiene que ser mayor a 6 caracteres",
            };
        } else {
            setIsLoading(true);
            await reauthenticate(formData.password)
                .then( async () => {
                    await firebase.auth().currentUser.updatePassword(formData.newPassword)
                        .then(() => {
                            isSetError = false;
                            setIsLoading(false);
                            setShowModal(false);
                            // logout
                            firebase.auth().signOut();
                        })
                        .catch(() => {
                            errorTemp = {
                                other: "Error al actualizar las contraseñas",
                            };
                            setIsLoading(false);
                        })
                })
                .catch(() => {
                    errorTemp = {
                        password: "Las contraseña no es correcta",
                    };
                    setIsLoading(false);
                });
        }

        isSetError && setError(errorTemp);
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Contraseña actual"
                containerStyle={styles.input}
                password
                secureTextEntry={showPassword.password ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword.password ? "eye-off-outline" : "eye-outline"}
                        color="#c2c2c2"
                        onPress={() => setShowPassword({...showPassword, password: !showPassword.password})}
                    />
                }
                onChange={(e) => onChange(e, "password")}
                errorMessage={error.password}
            />
            <Input
                placeholder="Nueva Contraseña"
                containerStyle={styles.input}
                password
                secureTextEntry={showPassword.newPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword.newPassword ? "eye-off-outline" : "eye-outline"}
                        color="#c2c2c2"
                        onPress={() => setShowPassword({...showPassword, newPassword: !showPassword.newPassword})}
                    />
                }
                onChange={(e) => onChange(e, "newPassword")}
                errorMessage={error.newPassword}
            />
            <Input
                placeholder="Repetir Nueva Contraseña"
                containerStyle={styles.input}
                password
                secureTextEntry={showPassword.repeatNewPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword.repeatNewPassword ? "eye-off-outline" : "eye-outline"}
                        color="#c2c2c2"
                        onPress={() => setShowPassword({...showPassword, repeatNewPassword: !showPassword.repeatNewPassword})}
                    />
                }
                onChange={(e) => onChange(e, "repeatNewPassword")}
                errorMessage={error.repeatNewPassword}
            />
            <Button
                title="Cambiar contraseña"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
            <Text>{error.other}</Text>
        </View>
    );
}

function defaultValue(type) {
    const condition = type === "form";

    return {
        password: condition ? "" : false,
        newPassword: condition ? "" : false,
        repeatNewPassword: condition ? "" : false,
    }
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#00a680",
    }
});
