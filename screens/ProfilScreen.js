import React from "react";

import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
  Pressable,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import { modify, addImage } from "../reducers/user";
import UserProfile from "./UserProfile";
import DogProfile from "./DogProfile";
import * as ImagePicker from "expo-image-picker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useSelector, useDispatch } from "react-redux";

const BACKEND_ADDRESS = "http://192.168.1.6";

export default function ProfilScreen({ navigation }) {
  const dispatch = useDispatch();
  const [image, setImage] = useState(null);
  const [urlData, setUrlData] = useState("");
  const userId = useSelector((state) => state.user.value.data._id);
  const userImage = useSelector((state) => state.user.value.data.image);
  const userImageP = useSelector((state) => state.user.value.imagePicture);

  let imageDeProfil;

  const formData = new FormData();
  let result;

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Vous avez refusé l'accès à votre librairie");
    } else if (permissionResult.granted) {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      console.log("result test", result.uri);

      if (!result.canceled) {
        setImage(result.uri);
        //modifier l'image dans le state

        // dispatch(addPhoto(userImage));
        // console.log("userImage", userImage);

        const formData = new FormData();
        formData.append("photoFromFront", {
          uri: result.uri,
          name: "photo.jpg",
          type: "image/jpeg",
        });
        fetch(`${BACKEND_ADDRESS}:3000/photos/upload`, {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.result) {
              fetch(`${BACKEND_ADDRESS}:3000/photos/update`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  id: userId,
                  image: data.url,
                }),
              })
                .then((res) => res.json())
                .then((newData) => {
                  dispatch(addImage(data.url));
                  console.log("data", newData);
                  console.log("userImageP", userImageP);

                });
            }
          });
      }
    }
  };

  if (image) {
    imageDeProfil = (
      <Image
        source={{ uri: userImageP }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: "#FFC547",
        }}
      />
    );
  } else if (userImage) {
    imageDeProfil = (
      <Image
        source={{ uri: userImage }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: "#FFC547",
        }}
      />
    );
  } else {
    imageDeProfil = (
      <Image
        source={{ uri: userImageP }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: "#FFC547",
        }}
      />
    );
  }

  /*Check si le switch est actif ou non*/
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled((previousState) => !previousState);
  };
  const user = useSelector((state) => state.user.value);

  return (
    <SafeAreaView style={styles.background}>
      <ScrollView style={styles.scrollViewMax}>
        <View style={styles.main}>
          <View style={styles.close}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Accueil")}
              style={styles.closeModal}
              activeOpacity={0.8}
            >
              <FontAwesomeIcon icon={faCircleXmark} size={35} color="#365B58" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={() => {
                pickImage();
              }}
            >
              {imageDeProfil}
            </TouchableOpacity>

            <View>
              <Text style={styles.titleHead}>Bienvenue </Text>
              <Text style={styles.titleHead}>
                {user.data.chien} et {user.data.prenom} !
              </Text>
            </View>
          </View>
          <View style={styles.switchContainer}>
            <Switch
              style={styles.switch}
              trackColor={{ false: "#767577", true: "#008486" }}
              thumbColor={isEnabled ? "#FFC547" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
            {isEnabled ? <DogProfile /> : <UserProfile />}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleHead: {
    textAlign: "left",
    lineHeight: 32,
    marginLeft: 22,
    fontFamily: "Bold",
    fontSize: 19,
    width: "100%",
  },

  background: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
  header: {
    flex: 0.35,
    backgroundColor: "#008486",
    paddingTop: 9,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  imageDeProfil: {
    width: "100%",
    height: 200,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconProfil: {
    left: "330%",
  },
  icon: {
    position: "absolute",
    left: 52,
    top: 52,
  },
  headerContainer: {
    marginTop: 20,
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    flexShrink: "",
    marginBottom: 20,
  },
  profilPicture: {
    width: 80,
    height: 80,
    borderRadius: 100,
  },

  main: {
    flex: 1,
    backgroundColor: "white",
    flex: 4,
    paddingTop: 5,
    paddingBottom: 5,
  },
  photoNameContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profilContainer: {
    elevation: 2,
    height: 100,
    width: 100,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
  },
  welcome: {
    alignSelf: "center",
    justifyContent: "center",
    maxWidth: 200,
  },
  profilNameText: {
    fontFamily: "Bold",
    fontSize: 21,
    fontWeight: "bold",
    right: "10%",
    fontFamily: "Montserrat_600",
    paddingHorizontal: 5,
    color: "#365B58",
  },
  close: {
    marginRight: 10,
    flexDirection: "row",
    alignSelf: "flex-end",
  },

  switchContainer: {
    padding: 12,
    // marginLeft:"90
  },

  switch: {
    textAlign: "right",
    marginLeft: "80%",
    marginBottom: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  singleInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderTopColor: "lightgray",
    borderTopWidth: 1,
  },
  textInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    left: "100%",
    fontSize: 18,
    fontWeight: "400",
  },
  inputStyleEdit: {
    left: "100%",
    fontSize: 18,
    fontWeight: "400",
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
  },
  footer: {
    flex: 1,
  },
  boutonContainer: {
    alignItems: "center",
  },
  textButton: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "#008486",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPressed: {
    width: 150,
    height: 45,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "#008486",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonPressed2: {
    width: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "fff",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#008486",
  },
  superBoutonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  container: {
    elevation: 2,
    height: 100,
    width: 100,
    backgroundColor: "#efefef",
    position: "relative",
    borderRadius: 999,
    overflow: "hidden",
  },
  scrollViewMax: {
    width: "100%",
  },
});
