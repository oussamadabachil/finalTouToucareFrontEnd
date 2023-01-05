import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet, Pressable, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';

const BACKEND_ADDRESS = 'http://192.168.1.133';

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const userToken = useSelector((state) => state.user.value.data.token)
  const IMAGE_PATH = `https://res.cloudinary.com/dpapzrkqw/image/upload/v1671611852/toutouCare/${userToken}`;
  let imageDeProfile;

  const formData = new FormData();
  let result = false;

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (!permissionResult.granted) {
      alert("Vous avez refusé l'accès à votre librairie")
    } else if (permissionResult.granted) {
        result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImage(result.assets[0].uri);
        formData.append('photoFromFront', {
          uri: result.uri,
          name: 'photo.jpg',
          type: 'image/jpeg',
        });
        fetch(`${BACKEND_ADDRESS}:3000/photos/upload/${userToken}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            "Content-Type": "application/json"
          },
          body: formData,
        }).then((response) => response.json())
      }
    }
  }

  if (image) {
    imageDeProfile = <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
  } else {
    imageDeProfile = <Image source={{ uri: IMAGE_PATH }} style={{ width: 100, height: 100 }} />
  }

  return (
    <View style={imageUploaderStyles.container}>
      <Pressable onPress={pickImage} style={imageUploaderStyles.container}>
        {imageDeProfile}
      </Pressable>
    </View> 
  );
}
const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:100,
        width:100,
        backgroundColor:'#efefef',
        position:'relative',
        borderRadius:999,
        overflow:'hidden',
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:6,
        bottom:30,
        backgroundColor:'lightgrey',
        width:'80%',
        height:'25%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    }
})