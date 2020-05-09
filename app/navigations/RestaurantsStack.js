import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/Restaurants";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
    return(
        <Stack.Navigator>
            <Stack.Screen
                name="restaurants"
                component={Restaurants}
                options={{ title: "Restaurantes" }}
            />
            <Stack.Screen
                name="add-restaurant"
                component={Restaurants}
                options={{ title: "Añadir Restaurantes" }}
            />
        </Stack.Navigator>
    )
}