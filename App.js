import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { IconButton, Title, Text, Button, ActivityIndicator, Appbar } from 'react-native-paper'
import { BarCodeScanner } from 'expo-barcode-scanner';
const io = require('socket.io-client');
import Remote from './components/Remote.component'

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: false,
      url: null,
      initialized: false,
    }
  }
  handleBarCodeScanned = ({ type, data }) => {
    this.setState({url:data,initialized: true})
    console.log(data)
  };

  async componentDidMount() {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({ permission: status === "granted" })
  }
  render() {
    if (!this.state.permission) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
          <ActivityIndicator
            size="large"
          />
        </View>
      )
    } else if (this.state.url === null) {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />

          <BarCodeScanner
            onBarCodeScanned={this.handleBarCodeScanned}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      );
    } else if (this.state.url && !this.state.initialized) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
          <ActivityIndicator
            size="large"
          />
        </View>
      )
    } 
    else {
      console.log("else")
      return (
        <Remote url={this.state.url}/>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "red",
    width: 70,
    height: 70,
    borderRadius: 50
  },
  leftRight: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  buttonGroup: {
    alignItems: 'center',
    marginTop: 10
  },
  pointerButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    backgroundColor: "#6d99b4",
  },
  pauseButton: {
    position: "absolute",
    top: 30,
    right: 10,
  }
});
/*  */