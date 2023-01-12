import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { Calendar } from "react-native-calendars";
import { useCallback } from "react";
import { collectDate, deleteDate } from "../reducers/book";
import {
  Modal,
  TextInput,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Alert,
} from "react-native";

import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";
import { render } from "react-dom";
const moment = require("moment");

const jsonAnimation = require("../assets/loading_animation.json");
const BACKEND_ADDRESS = "http://192.168.1.6";

export default function BookingScreen() {
  const dispatch = useDispatch();

  const hours = [
    "09:00",
    "9:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
    "19:00",
  ];

  const [modalVisibleCalendar, setModalVisibleCalendar] = useState(false);
  const arrayA = [];
  const arrayOfToken = [];
  const arrayDateForCalendar = [];
  const [arrCalendarDate, setArrCalendarDate] = useState([]);
  const [modalVisibleAlert, setModalVisibleAlert] = useState(false);
  const [newCommentaire, setNewCommentaire] = useState("");
  const [newHeureDepose, setNewHeureDepose] = useState("");
  const [newHeureRecuperation, setNewHeureRecuperation] = useState("");
  const [counter, setCounter] = useState(6);
  const [counterWeek, setCounterWeek] = useState(1);
  const [heureDePose, setHeureDePose] = useState("");
  const [heureDeRecuperation, setHeureDeRecuperation] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [bookings, setBookings] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [allBooking, setAllBooking] = useState([{}]);
  const [duplicata, setDuplicata] = useState([]);
  const [modalVisible3, setModalVisible3] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [arrayOfUserToken, setArrayOfUserToken] = useState([]);
  const [setDuplicataUserToken, setSetDuplicataUserToken] = useState([]);
  const [commentaireFetchedModify, setCommentaireFetchedModify] = useState("");
  const [heureDePoseFetchedModify, setHeureDePoseFetchedModify] = useState("");
  const [
    heureDeRecuperationFetchedModify,
    setHeureDeRecuperationFetchedModify,
  ] = useState("");
  const [selectedIdBooking, setSelectedIdBooking] = useState("");

  const objectA = {};
  const reserverAction = () => {
    setModalVisible(!modalVisible);
  };
  const userToken = useSelector((state) => state.user.value.data.token);

  let obj = {
    date: [],
  };
  const array = [];
  const [arrayOfDate, setArrayOfDate] = useState([]);
  const arrayB = [];
  const [fontsLoaded] = useFonts({
    SemiBold: require("../assets/styles/SemiBold.ttf"),
    Bold: require("../assets/styles/Montserrat-Bold.ttf"),
  });

  //Appel pour forcer le rendu du composant

  const hoursA = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];
  const hoursB = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ];

  const modifyAction = () => {
    if (newHeureDepose && newHeureRecuperation) {
      fetch(
        `${BACKEND_ADDRESS}:3000/bookings/dataBooking/${userToken}/${selectedDate}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heureDeDepose: newHeureDepose,
            heureDeRecuperation: newHeureRecuperation,
            commentaire: newCommentaire,
          }),
        }
      )
        .then((response) => response.json())
        .then((json) => {
          // console.log(json);
        });
      Alert.alert("Modification effectuée");

      // setModalVisible2(!modalVisible2);

      setModalVisible3(!modalVisible3);
      setNewHeureDepose("");
      setNewHeureRecuperation("");
      setNewCommentaire("");
    } else {
      Alert.alert("Veuillez remplir tous les champs");
    }
  };

  const actualiser = () => {
    fetch(`${BACKEND_ADDRESS}:3000/bookings/allBookingPerUser/${userToken}`)
      .then((response) => response.json())
      .then((json) => {
        for (let i = 0; i < json.data.length; i++) {
          console.log(json.data[i].date.slice("T", 10), "test");
          setBookings((bookings) => [
            ...bookings,
            json.data[i].date.slice("T", 10),
          ]);
          arrayDateForCalendar.push(json.data[i].date);
        }
        setArrCalendarDate(arrayDateForCalendar);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      actualiser();
    }, 1000);
  }, []);

  const repeatedValues = [];
  const modifiYApperance = () => {
    fetch(
      `${BACKEND_ADDRESS}:3000/bookings/booking/info/${userToken}/${selectedDate}`
    )
      .then((response) => response.json())
      .then((json) => {
        console.log("json.data", json.data);
        setCommentaireFetchedModify(json.data.commentaire);
        setHeureDePoseFetchedModify(json.data.heureDeDepose);
        setHeureDeRecuperationFetchedModify(json.data.heureDeRecuperation);
      });
  };

  const afficher = () => {
    const valueCounts = {};

    for (const property in allBooking) {
      // console.log('allBooking',allBooking,"property",allBooking[property]);
      if (!(allBooking[property] in valueCounts)) {
        valueCounts[allBooking[property]] = 1;
      } else {
        valueCounts[allBooking[property]] += 1;
      }
      if (valueCounts[allBooking[property]] >= 2) {
        repeatedValues.push({ date: allBooking[property], id: property });
      }
    }
  };

  const todayDate = moment().format("YYYY-MM-DD");
  for (let i = counter - 7; i < counter; i++) {
    array.push(moment().add(i, "days").format("YYYY-MM-DD"));
  }

  const bookResa = () => {
    if (heureDePose && heureDeRecuperation) {
      setModalVisible(!modalVisible);
      //count the number of booking

      fetch(`${BACKEND_ADDRESS}:3000/bookings/count/${selectedDate}`)
        .then((response) => response.json())
        .then((json) => {
          // console.log(json.data);
          if (json.data < 2) {
            fetch(`${BACKEND_ADDRESS}:3000/bookings/add/${userToken}`, {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                date: selectedDate,
                heureDeDepose: heureDePose,
                heureDeRecuperation: heureDeRecuperation,
                commentaire: commentaire,
              }),
            })
              .then((response) => response.json())
              .then((json) => {
                if (json.result) {
                  setHeureDePose("");
                  setHeureDeRecuperation("");
                  setCommentaire("");
                  Alert.alert(
                    "Réservation effectuée",
                    "Vous avez réservé une place pour votre chien",
                    [
                      {
                        text: "Parfait",
                        onPress: () => {
                          console.log("OK Pressed");
                          actualiser();
                        },
                        style: "cancel",
                      },
                    ]
                  );
                } else {
                  Alert.alert(`Réservation non efféctuée`);
                  setHeureDePose("");
                  setHeureDeRecuperation("");
                  setCommentaire("");
                }
              });
          } else {
            Alert.alert("Il n'y a plus de place disponible");
            setHeureDePose("");
            setHeureDeRecuperation("");
            setCommentaire("");
          }
        });
    } else {
      Alert.alert("Veuillez remplir les champs");
      setHeureDePose("");
      setHeureDeRecuperation("");
      setCommentaire("");
    }
  };
  const numberWeek = moment().week();

  const takeTheElements = () => {};
  const deleteResa = () => {
    fetch(
      `${BACKEND_ADDRESS}` +
        `:3000/bookings/delete/${userToken}/${selectedDate}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.result) {
          bookings.splice(bookings.indexOf(selectedDate), 1);
          actualiser();
          Alert.alert(
            "Réservation annulée",
            "Vous avez annulé votre réservation",
            [
              {
                text: "Parfait",
                onPress: () => {
                  actualiser();
                },
                style: "cancel",
              },
            ]
          );
        } else {
          Alert.alert(`${json.message}`);
        }
      });
  };

  const arrayList = array.map((item) => {
    const date = new Date(item);
    const options = {
      weekday: "long",
      month: "numeric",
      day: "numeric",
    };
    const day = date.toLocaleDateString("fr-FR", options);
    if (todayDate > item) {
      let reserverOrAlert = (
        <TouchableOpacity
          style={styles.buttonNonDispo}
          onPress={() => {
            Alert.alert(
              "Réservation impossible",
              "Vous ne pouvez pas réserver pour une date antérieure à celle du jour",
              [{ text: "Compris" }],
              { cancelable: false }
            );
          }}
        >
          <Text style={styles.textButtonNonDispo}>Passé</Text>
        </TouchableOpacity>
      );
      return (
        <>
          <View style={styles.viewDate}>
            <Text onPress={() => {}} style={styles.text}>
              {day}
            </Text>
            {reserverOrAlert}
          </View>
        </>
      );
    } else {
      if (!bookings.includes(item)) {
        let reserverOrAlert = (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              reserverAction();
              setSelectedDate(item);
            }}
          >
            <Text style={styles.textButton}>Réserver</Text>
          </TouchableOpacity>
        );
        return (
          <>
            <View style={styles.viewDate}>
              <Text onPress={() => {}} style={styles.text}>
                {day}
              </Text>
              {reserverOrAlert}
            </View>
          </>
        );
      } else {
        let reserverOrAlert = (
          <TouchableOpacity
            style={styles.buttonDejaReserver}
            onPress={() => {
              setModalVisible2(!modalVisible2);
              setSelectedDate(item);
            }}
          >
            <Text style={styles.textButtonNonDispo}>Réservé</Text>
          </TouchableOpacity>
        );
        return (
          <>
            <View style={styles.viewDate}>
              <Text onPress={() => {}} style={styles.text}>
                {day}
              </Text>
              {reserverOrAlert}
            </View>
          </>
        );
      }
    }
  });

  // });

  return (
    <>
      {/* 
// */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleCalendar}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalCalendar}
        >
          <View style={styles.viewModalCalendar}>
            <View style={styles.viewModalCalendar}>
              <TouchableOpacity
                onPress={() => {
                  console.log("test");
                  setModalVisibleCalendar(!modalVisibleCalendar);
                }}
              >
                <FontAwesome
                  name="times"
                  size={34}
                  color="white"
                  style={styles.iconCloseAlert}
                />
              </TouchableOpacity>
              <Text style={styles.labelModalResa}>
                Voici le calendrier des réservations
              </Text>

              <Calendar
                style={styles.calendar}
                minDate={new Date()}
                onDayPress={(day) => {
                  console.log("selected day", day);
                  setArrCalendarDate(day);
                }}
              />
              <TouchableOpacity
                style={styles.buttonModalAnnuler}
                onPress={() => {
                  console.log(arrCalendarDate);
                  setModalVisibleCalendar(!modalVisibleCalendar);
                }}
              >
                <Text style={styles.textButtonModalAnnuler}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* //

 */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleAlert}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modal}
        >
          <View style={styles.viewModal}>
            <TouchableOpacity
              onPress={() => {
                console.log("test");
                setModalVisibleAlert(!modalVisibleAlert);
              }}
            >
              <FontAwesome
                name="times"
                size={34}
                color="white"
                style={styles.iconCloseAlert}
              />
            </TouchableOpacity>
            <Text style={styles.labelModal}>
              Voulez vous recevoir une alerte pour cette date :{" "}
            </Text>

            <Text style={styles.textModal}>{selectedDate}</Text>

            <TouchableOpacity
              style={styles.buttonModalValider}
              onPress={() => {
                bookResa();
              }}
            >
              <Text style={styles.textButtonModal}>Valider</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.buttonModalAnnuler}
              onPress={() => {
                setModalVisibleAlert(!modalVisibleAlert);
              }}
            >
              <Text style={styles.textButtonModalAnnuler}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/*
       */}

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <KeyboardAvoidingView
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modal}
        >
          <View style={styles.viewModal}>
            <TouchableOpacity
              onPress={() => {
                console.log("test");
                setModalVisible(!modalVisible);
              }}
            >
              <FontAwesome
                name="times"
                size={24}
                color="black"
                style={styles.iconClose}
              />
            </TouchableOpacity>

            <Text style={styles.textModal}>{selectedDate}</Text>
            <Text style={styles.labelModal}>Horaire de dépose</Text>
            <SelectDropdown
              dropdownIconPosition="right"
              dropdownStyle={styles.dropdownStyleDropDown}
              rowStyle={styles.rowStyleDropDown}
              rowTextStyle={styles.rowTextStyleDropDown}
              renderDropdownIcon={() => {
                return (
                  <FontAwesome
                    name="angle-down"
                    size={24}
                    color="black"
                    style={styles.iconDropDown}
                  />
                );
              }}
              buttonTextStyle={styles.buttonTextStyleDropDown}
              buttonStyle={styles.buttonStyleDropDown}
              defaultButtonText="Choisissez une heure"
              style={styles.dropDown}
              onSelect={(selectedItem, index) => {
                setHeureDePose(selectedItem);
              }}
              data={hours}
            ></SelectDropdown>
            {/* <TextInput
              onChangeText={(heureDePose) => setHeureDePose(heureDePose)}
              value={heureDePose}
              style={styles.inputModal}
              placeholder="Heure de dépose"
            /> */}

            <Text style={styles.labelModal}>Horaire de récupération</Text>
            <SelectDropdown
              onSelect={(selectedItem, index) => {
                setHeureDeRecuperation(selectedItem);
              }}
              renderDropdownIcon={() => {
                return (
                  <FontAwesome
                    name="angle-down"
                    size={24}
                    color="black"
                    style={styles.iconDropDown}
                  />
                );
              }}
              dropdownIconPosition="right"
              dropdownStyle={styles.dropdownStyleDropDown}
              rowStyle={styles.rowStyleDropDown}
              rowTextStyle={styles.rowTextStyleDropDown}
              buttonTextStyle={styles.buttonTextStyleDropDown}
              buttonStyle={styles.buttonStyleDropDown}
              defaultButtonText="Choisissez une heure"
              style={styles.dropDown}
              data={hours}
            ></SelectDropdown>
            {/* <TextInput
              onChangeText={(heureDeRecuperation) =>
                setHeureDeRecuperation(heureDeRecuperation)
              }
              style={styles.inputModal}
              placeholder="Heure de récupération"
            /> */}

            <Text style={styles.labelModal}>Commentaire</Text>
            <TextInput
              onChangeText={(commentaire) => setCommentaire(commentaire)}
              style={styles.inputModalTextArea}
              placeholder="Optionnel"
            />
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={() => {
                bookResa();
              }}
            >
              <Text style={styles.textButtonModal}>Valider</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/*
      
      2 eme modale
      */}

      <Modal animationType="slide" transparent={true} visible={modalVisible2}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modal}
        >
          <View style={styles.viewModalM}>
            <TouchableOpacity
              style={styles.iconCloseTouchable}
              onPress={() => {
                setModalVisible2(!modalVisible2);
                console.log("test");
              }}
            >
              <FontAwesome name="times" size={34} color="white" />
            </TouchableOpacity>
            <Text style={styles.textResaM}>Réservation du</Text>
            <Text style={styles.textResaM}> {selectedDate}</Text>

            <View style={styles.containerButtonsM}>
              <TouchableOpacity
                style={styles.modify}
                onPress={() => {
                  setModalVisible3(!modalVisible3);
                  setModalVisible2(!modalVisible2);
                  modifiYApperance();
                }}
              >
                <Text style={styles.textModaMl}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delete}
                onPress={() => {
                  deleteResa();
                  setModalVisible2(!modalVisible2);
                }}
              >
                <Text style={styles.textModalS}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/*
    3eme modale
    */}

      <Modal animationType="slide" transparent={true} visible={modalVisible3}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modal}
        >
          <View style={styles.viewModalM}>
            <TouchableOpacity
              style={styles.iconCloseTouchable}
              onPress={() => {
                console.log("test");
                setModalVisible3(!modalVisible3);
              }}
            >
              <FontAwesome name="times" size={34} color="white" />
            </TouchableOpacity>

            <View style={styles.containerButtonsM}>
              <Text style={styles.textModificationTitle}>Modification </Text>
              <Text style={styles.textModalHd}>Heure de dépose </Text>
              <SelectDropdown
                dropdownIconPosition="right"
                dropdownStyle={styles.dropdownStyleDropDown}
                rowStyle={styles.rowStyleDropDown}
                rowTextStyle={styles.rowTextStyleDropDown}
                renderDropdownIcon={() => {
                  return (
                    <FontAwesome
                      name="angle-down"
                      size={24}
                      color="black"
                      style={styles.iconDropDown}
                    />
                  );
                }}
                buttonTextStyle={styles.buttonTextStyleDropDown}
                buttonStyle={styles.buttonStyleDropDown}
                defaultButtonText={heureDePoseFetchedModify}
                style={styles.dropDown}
                onSelect={(selectedItem, index) => {
                  setNewHeureDepose(selectedItem);
                }}
                data={hours}
              ></SelectDropdown>

              {/* <TextInput
                placeholder={heureDePoseFetchedModify}
                onChangeText={(text) => {
                  setNewHeureDepose(text);
                }}
                value={newHeureDepose}
                style={styles.inputModal}
              ></TextInput> */}

              <Text style={styles.textModalHd}>Heure de récupération </Text>
              <SelectDropdown
                dropdownIconPosition="right"
                dropdownStyle={styles.dropdownStyleDropDown}
                rowStyle={styles.rowStyleDropDown}
                rowTextStyle={styles.rowTextStyleDropDown}
                renderDropdownIcon={() => {
                  return (
                    <FontAwesome
                      name="angle-down"
                      size={24}
                      color="black"
                      style={styles.iconDropDown}
                    />
                  );
                }}
                buttonTextStyle={styles.buttonTextStyleDropDown}
                buttonStyle={styles.buttonStyleDropDown}
                defaultButtonText={heureDeRecuperationFetchedModify}
                style={styles.dropDown}
                onSelect={(selectedItem, index) => {
                  setNewHeureRecuperation(selectedItem);
                }}
                data={hours}
              ></SelectDropdown>

              <Text style={styles.textModalHd}>Commentaire </Text>
              <TextInput
                placeholder={commentaireFetchedModify}
                // placeholder={allDataFromFetchModify.heureDeRecuperation.toString()}
                onChangeText={(text) => {
                  setNewCommentaire(text);
                }}
                value={newCommentaire}
                // placeholder= {allDataFromFetchModify[0].heure_depose}

                style={styles.inputModalCommentaire}
              />
            </View>
            <View style={styles.containerButtonsM}>
              <TouchableOpacity
                style={styles.modify}
                onPress={() => {
                  modifyAction();
                }}
              >
                <Text style={styles.textModaMl}>Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.delete}
                onPress={() => {
                  setModalVisible3(!modalVisible3);
                  setModalVisible2(!modalVisible2);
                }}
              >
                <Text style={styles.textModalS}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <SafeAreaView style={styles.container}>
        <TouchableOpacity
          style={styles.buttonCalendar}
          onPress={() => {
            setModalVisibleCalendar(!modalVisibleCalendar);
          }}
        >
          <FontAwesome
            name="calendar"
            size={24}
            color="white"
            style={styles.iconPlus}
          />
        </TouchableOpacity>
        {/* <Popover
          style={styles.popover}
          from={
            <TouchableOpacity>
              <Image
                style={styles.profilPicture}
                source={require("../assets/oussama1.jpg")}
              ></Image>
            </TouchableOpacity>
          }
        >

          <TouchableOpacity
            style={styles.buttonPopover}
            onPress={() => {
              navigation.navigate("Profil");
            }}
          >
           
            <Text style={styles.textPopover}>Modifer</Text>
            <FontAwesome
              name="user"
              size={44}
              color="black"
              style={styles.iconPopover}
            />
          </TouchableOpacity>
          <TouchableOpacity
          style={styles.buttonPopover}
          >
            <FontAwesome

              name="sign-out"
              size={44}
              color="black"
              style={styles.iconPopover}
            />
            <Text style={styles.textPopover}>Déconnexion</Text>
          </TouchableOpacity>
        </Popover> */}

        <Text
          onPress={() => {
            console.log(setDuplicataUserToken);
          }}
          style={styles.weekTitle}
        >
          Semaine {numberWeek + counterWeek}{" "}
        </Text>

        <View style={styles.flexContainer}>
          <FontAwesome
            name="chevron-left"
            size={24}
            color="black"
            onPress={() => {
              setCounterWeek(counterWeek - 1);
              setCounter(counter - 7);
            }}
          />
          <Text style={styles.intervalWeek}>
            {moment()
              .add(counter - 7, "days")
              .format("ll")
              .toString()
              .replace(",", "")
              .slice(0, 6)}{" "}
            -{" "}
            {moment()
              .add(counter - 1, "days")
              .format("ll")
              .replace(",", "")
              .slice(0, 6)}{" "}
          </Text>
          <FontAwesome
            name="chevron-right"
            size={24}
            color="black"
            onPress={() => {
              setCounter(counter + 7);

              setCounterWeek(counterWeek + 1);
            }}
          />
        </View>
        <ScrollView style={styles.scroll}>{arrayList}</ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  rowStyleDropDown: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    height: 60,
    borderRadius: 10,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 5,
  },

  rowTextStyleDropDown: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "SemiBold",
    marginBottom: 20,
  },
  profilPicture: {
    zIndex: 1,
    width: 70,
    height: 70,
    marginRight: "70%",
    borderRadius: 50,
  },
  popover: {
    zIndex: 1,
    width: 200,
    height: 100,
    backgroundColor: "white",
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  textResaM: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  dropDown: {},
  flexContainer: {
    marginTop: 20,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  completTexte: {
    fontSize: 18,
    color: "#F12054",
    fontWeight: "bold",
    textAlign: "center",
  },

  buttonComplet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "transparent",
    borderRadius: 13,
  },

  buttonDejaReserver: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "#F12054",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  dropdownStyleDropDown: {
    backgroundColor: "white",
    borderRadius: 10,
  },

  buttonPopover: {
    backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    marginHorizontal: "5%",
    marginVertical: 10,

    padding: 10,
  },

  buttonNonDispo: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "#cacaca",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textButtonNonDispo: {
    fontFamily: "SemiBold",
    color: "#fff",
    fontWeight: "bold",

    fontSize: 16,
  },

  textComplet: {
    textAlign: "right",
    marginLeft: "auto",
    marginRight: 10,
    color: "#F12054",
    fontWeight: "bold",
    fontFamily: "SemiBold",
    fontSize: 16,
  },

  viewModalM: {
    width: "90%",
    borderRadius: 10,
    paddingVertical: 20,
    backgroundColor: "#008486",
  },

  viewModal: {
    width: "90%",
    backgroundColor: "#008486",
    padding: 20,
    borderRadius: 10,
  },

  viewModalCalendar: {
    height: "100%",
    width: "100%",
    backgroundColor: "#008486",
    padding: 20,
    borderRadius: 10,
  },
  modify: {
    backgroundColor: "#F12054",
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%",
    paddingVertical: 10,
    marginBottom: 20,
  },
  textModalHd: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },

  textModaMl: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  buttonCalendar: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,

    backgroundColor: "#008486",
    borderRadius: 10,
    zIndex: 2,
    position: "absolute",
    bottom: 10,
    right: 20,
    padding: 15,
    borderRadius: 50,
  },
  textModalS: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },

  delete: {
    backgroundColor: "#F12054",
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",
    width: "50%",
    paddingVertical: 10,
    marginBottom: 20,
  },
  selectD: {
    color: "#fff",
    backgroundColor: "#F12054",
  },
  modalCalendar: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  inputModal: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",

    width: "40%",
    marginBottom: 20,
  },
  inputModalCommentaire: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",

    width: "80%",
    marginBottom: 20,
  },
  textModificationTitle: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },

  textModal: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
  inputModalTextArea: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginLeft: "auto",
    marginRight: "auto",

    width: "100%",
    marginBottom: 20,
  },
  intervalWeek: {
    fontFamily: "SemiBold",
    color: "rgb(124, 124, 124)",
    fontWeight: "700",
    fontSize: 16,
  },

  labelModalResa: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    marginBottom: 10,
    marginTop: 10,
  },
  labelModal: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
    marginBottom: 10,
    marginTop: 10,
  },
  buttonModalAnnuler: {
    marginTop: 20,
    backgroundColor: "#F12054",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonStyleDropDown: {
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonModalValider: {
    marginBottom: 10,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  buttonModal: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  textButtonModalAnnuler: {
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  textButtonModal: {
    fontWeight: "bold",
    color: "#008486",
    textAlign: "center",
    fontSize: 16,
  },
  iconClose: {
    backgroundColorw: "#fff",

    weight: "light",
    size: 30,
    color: "#fff",
    position: "absolute",
    top: 10,
    right: 10,
  },

  iconCloseAlert: {
    textAlign: "right",
    width: "100%",
    fontSize: 30,
    color: "#fff",
  },

  iconCloseTouchable: {
    fontSize: 30,

    color: "#fff",
    position: "absolute",
    top: 10,
    right: 10,
  },

  weekTitle: {
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Bold",
  },

  lottie: {
    width: 200,
    height: 200,
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -100,
    marginTop: -100,

    zIndex: 1000,
    opacity: 1,
  },

  container: {
    marginTop: 0,
    marginBottom: 0,
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    marginTop: 20,
    marginBottom: 0,
    flex: 1,
    borderRadius: 23,
    backgroundColor: "rgba(207,219,213,0.4)",
    height: "100%",
    width: "100%",
  },
  view: {
    borderWidth: 1,
    top: 120,
    width: "90%",
    paddingVertical: 23,
    borderRadius: 23,
    padding: 12,
  },
  viewDate: {
    marginRight: "auto",
    marginLeft: "auto",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center",
    width: "90%",
    paddingVertical: 23,
    borderRadius: 23,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonDisable: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    backgroundColor: "#D3D3D3",
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },

  flexButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginTop: 20,
  },
  buttonTextStyleDropDown: {
    color: "#008486",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 14,
  },

  text: {
    fontFamily: "Bold",
    textTransform: "capitalize",
    textAlign: "center",
    fontSize: 16,
  },

  buttonBell: {
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
    borderRadius: 13,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
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
  textButton: {
    color: "#fff",
    fontWeight: "bold",

    fontSize: 16,
  },
  textPopover: {
    padding: 10,
    color: "black",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
  },
});
