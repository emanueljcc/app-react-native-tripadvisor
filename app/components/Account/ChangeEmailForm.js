import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Input, Button, Icon } from "react-native-elements";
import * as firebase from "firebase";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props) {
    const { email, setShowModal, toastRef, setReloadUserInfo } = props;
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState(defaultValue());
    const [error, setError] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({
            ...formData,
            [type]: e.nativeEvent.text,
        });
    }

    const onSubmit = () => {
        setError({});
        if (!formData.email || email === formData.email) {
            setError({
                email: "El email no cambiado",
            });
        } else if (!validateEmail(formData.email)) {
            setError({
                email: "El email no es valido",
            });
        } else if (!formData.password){
            setError({
                password: "La contraseña no puede estar vacia",
            });
        } else {
            setIsLoading(true);
            reauthenticate(formData.password)
                .then(response => {

                    // TODO: CAMBIAR EMAIL FIREBASE
                    firebase.auth().currentUser.updateEmail(formData.email)
                        .then(() => {
                            setIsLoading(false);
                            setReloadUserInfo(true);
                            toastRef.current.show("Email actualizado correctamente");
                            setShowModal(false);
                        })
                        .catch(() => {
                            setError({
                                email: "Error al actualizar el email"
                            });
                            setIsLoading(false);
                        })

                })
                .catch(() => {
                    setIsLoading(false);
                    setError({
                        password: "La contraseña no es correcta",
                    });
                });
        }
    }

    return (
        <View style={styles.view}>
            <Input
                placeholder="Correo electronico"
                containerStyle={styles.input}
                defaultValue={email}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                onChange={(e) => onChange(e, "email")}
                errorMessage={error.email}
            />
            <Input
                placeholder="Contraseña"
                containerStyle={styles.input}
                password
                secureTextEntry={showPassword ? false : true}
                rightIcon={
                    <Icon
                        type="material-community"
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        iconStyle={styles.iconForm}
                        onPress={() => setShowPassword(!showPassword)}
                    />
                }
                onChange={(e) => onChange(e, "password")}
                errorMessage={error.password}
            />
            <Button
                title="Cambiar email"
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
    );
}

function defaultValue() {
    return {
        email: "",
        password: "",
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
    },
    iconForm: {
        color: "#c1c1c1",
    }
});
