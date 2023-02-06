import React from "react";
import {
  Button,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

//affichage de l'accueil 

import { TouchableOpacity } from "react-native";

export const Home = ({ navigation, item }) => {
  const [film, setFilm] = React.useState([]);
  const [values, setValues] = React.useState("");

  const films = () => {
    fetch(`https://api.tvmaze.com/search/shows?q=${values}`)
      .then((res) => res.json())
      .then((data) => setFilm(data))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <View>
        <TextInput
          style={styles.search}
          placeholder="Search ..."
          onChangeText={(text) => setValues(text)}
          value={values}
        />
      </View>
      <View style={styles.button}>
        <Button title="Search" onPress={films}></Button>
      </View>
      <FlatList
        data={film}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate("Details", { item })}
            >
              <View style={styles.flatList}>
                <Image
                  style={styles.img}
                  source={
                    item.show.image
                      ? { uri: item.show.image.original }
                      : require("../img/imgNotFound.png")
                  }
                />
                <Text style={styles.name}>{item.show.name}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  search: {
    padding: 10,
    backgroundColor: "white",
    textAlign: "center",
  },
  button: {
    backgroundColor: "blue",
  },
  img: {
    resizeMode: "contain",
    width: 150,
    height: 150,
  },
  name: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
  flatList: {
    padding: 10,
    justifycontent: "center",
    alignItems: "center",
  },
});
