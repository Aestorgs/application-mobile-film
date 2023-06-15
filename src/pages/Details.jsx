import React from "react";
import { Button, Image, ScrollView, StyleSheet, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/AntDesign";
import * as SQlite from "expo-sqlite";

// affichage pour le details d'un film

const db = SQlite.openDatabase("database.db");

export const Details = ({ route }) => {
  const { item } = route.params;
  const [detail, useDetail] = React.useState({});
  const [show, useShow] = React.useState([]);

  React.useEffect(() => {
    fetch(`https://api.tvmaze.com/shows/${item.show.id}?embed=cast`)
      .then((res) => res.json())
      .then((data) => {
        useDetail(data);
      })
      .catch((err) => console.log(err));
  }, []);

  React.useEffect(() => {
    db.transaction((tx) =>
      tx.executeSql("CREATE TABLE favo (idShow int(100) NOT NULL)")
    );
  });

  const handleAdd = () => {
    db.transaction((tx) =>
      tx.executeSql(
        "INSERT INTO favo (idShow) VALUES (?)",
        [parseInt(detail.id)],
        (obj, res) =>
          useShow((prev) => [
            ...prev,
            { idShow: parseInt(detail.id), rowid: res.insertId },
          ]),
        (obj, err) => console.error(err)
      )
    );
  };

  const sanitizedSummary = detail.summary
    ? detail.summary.replace(/<\/?p>|<\/?b>/g, "")
    : "";

  return (
    <ScrollView>
      <Image
        style={styles.img}
        source={
          detail.image
            ? { uri: detail.image?.medium || detail.image?.original }
            : require("../img/imgNotFound.png")
        }
      />
      <Text style={styles.titre}> Titre : {detail.name}</Text>
      <MaterialIcons
        onPress={handleAdd}
        style={{ marginLeft: 180 }}
        name="hearto"
        size={30}
        color={"555"}
      >
        <Button title=""></Button>
      </MaterialIcons>
      {<Text style={styles.notes}> Notes : {detail.rating?.average} / 10</Text>}
      {<Text style={styles.genres}> Types : {detail.genres}</Text>}
      {<Text style={styles.p}>{sanitizedSummary}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  img: {
    marginTop: 10,
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
  notes: {
    fontSize: 20,
    padding: 10,
    fontWeight: "bold",
  },
  genres: {
    fontSize: 20,
    padding: 10,
    fontWeight: "bold",
  },
  p: {
    fontSize: 20,
    padding: 10,
    fontWeight: "normal",
  },
});
