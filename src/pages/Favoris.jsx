import * as SQlite from "expo-sqlite";
import React from "react";
import { Button, FlatList, Image, StyleSheet, Text, View } from "react-native";
import MaterialIcons from "react-native-vector-icons/AntDesign";

// affichage de favoris pour un film 
export const Favoris = () => {
  const db = SQlite.openDatabase("database.db");
  const [favoris, useFavoris] = React.useState([]);

  React.useEffect(() => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT rowid, * FROM favo",
        null,
        (obj, res) => {
          res.rows._array.map((fav) => {
            fetch(`https://api.tvmaze.com/shows/${fav.idShow}?embed=cast`)
              .then((res) => res.json())
              .then((data) => {
                useFavoris((prev) => [...prev, data]);
              })
              .catch((err) => console.log(err));
          });
        },
        (obj, err) => console.error(err)
      )
    );
  }, []);

  const handleRemove = (id) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT rowid, * FROM favo",
        null,
        (obj, res) => {
          res.rows._array.map((fav) => {
            db.transaction((tx) =>
              tx.executeSql(
                "DELETE FROM favo WHERE idShow = ?",
                [id],
                (obj, res) => {
                  console.log(res);
                  useFavoris((prev) =>
                    prev.filter((item) => item.idShow !== id)
                  );
                },
                (obj, err) => console.error(err)
              )
            );
          });
        },
        (obj, err) => console.error(err)
      )
    );
  };

  return (
    <FlatList
      data={favoris}
      keyExtractor={(a) => a.id}
      renderItem={({ item }) => {
        return (
          <View>
            <Image
              style={styles.img}
              source={
                item.image
                  ? { uri: item.image.original }
                  : require("../img/imgNotFound.png")
              }
            />
            <Text style={styles.titre}>{item.name}</Text>
            <MaterialIcons
              onPress={() => handleRemove(item.id)}
              style={{ marginLeft: 180 }}
              name="heart"
              size={30}
              color={"555"}
            >
              <Button title=""></Button>
            </MaterialIcons>
          </View>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  img: {
    marginTop: 20,
    display: "flex",
    resizeMode: "contain",
    width: 400,
    height: 400,
  },
  titre: {
    fontSize: 20,
    padding: 10,
    textAlign: "center",
    fontWeight: "bold",
  },
});
