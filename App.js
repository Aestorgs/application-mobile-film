import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "./src/pages/Home";
import MaterialIcons from "react-native-vector-icons/AntDesign";
import { Details } from "./src/pages/Details";
import { Favoris } from "./src/pages/Favoris";

// utilisation des routes
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <MaterialIcons
                name="hearto"
                size={30}
                color={"555"}
                onPress={() => navigation.navigate("Favoris", {})}
              />
            ),
          })}
        />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen name="Favoris" component={Favoris} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
