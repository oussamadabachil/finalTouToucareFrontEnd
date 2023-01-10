import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import React, { Component } from "react";

export default function HeaderProfile() {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => {
          pickImage();
        }}
      >
        {imageDeProfil}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({});
