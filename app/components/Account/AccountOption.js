import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ListItem } from "react-native-elements";
import { map } from "lodash";
import Modal from "../Modal";
import ChangeDisplayNameForm from "./ChangeDisplayNameForm";
import ChangeEmailForm from "./ChangeEmailForm";
import ChangePasswordFormUser from "./ChangePasswordFormUser";

export default function AccountOptions(props) {
    const { userInfo, toastRef, setReloadUserInfo } = props;
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);
    const provider = userInfo && userInfo.providerData[0].providerId;
    console.log(provider)

    const selectedComponent = (key) => {
        switch (key) {
            case "displayName":
                setRenderComponent(
                    <ChangeDisplayNameForm
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm
                        email={userInfo.email}
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                        setReloadUserInfo={setReloadUserInfo}
                    />
                );
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordFormUser
                        setShowModal={setShowModal}
                        toastRef={toastRef}
                    />
                );
                setShowModal(true);
                break;

            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }

    const menuOptions = generateOptions(selectedComponent);
    return (
        <View>
            {map(menuOptions, (menu, i) => (
                <ListItem
                    key={i}
                    title={menu.title}
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft,
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight,
                    }}
                    containerStyle={styles.menuItems}
                    onPress={menu.onPress}
                    disabled={
                        menu.type === "displayName" && provider === "facebook.com"
                        ? false
                        : provider === "password"
                            ? false
                            : true
                    }
                />
            ))}
            {renderComponent && (
                <Modal
                    isVisible={showModal}
                    setIsVisible={setShowModal}
                >
                    {renderComponent}
                </Modal>
            )}
        </View>
    );
}

function generateOptions (selectedComponent) {
    return [
        {
            title: "Cambiar nombre y apellidos",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("displayName"),
            type: "displayName"
        },
        {
            title: "Cambiar email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("email"),
            type: "email"
        },
        {
            title: "Cambiar contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("password"),
            type: "password"
        }
    ]
}

const styles = StyleSheet.create({
    menuItems: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    }
});