import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, } from 'react-native';
import { IconButton, Title, Text, Button, Appbar } from 'react-native-paper'
const io = require('socket.io-client');



export default class Remote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionError: null,
            currentSlide: 0,
            paused: false,
            presentationName: "Presentation",
            slideNotes: ""
        }
    }
    handleBarCodeScanned = ({ type, data }) => {
        this.setState({ url: data, initialized: true })
    };


    changeSlide = (e) => {
        this.socket.emit("ChangeSlide", e)
    }


    async componentDidMount() {
        console.log("mounted")
        this.socket = io(this.props.url, {
            transports: ['websocket']
        });

        this.socket.on('connect', () => {
            console.log("connected")
        });
        this.socket.on("Slide", (msg) => {
            this.setState({ currentSlide: msg.A, slideNotes: msg.B || "" })
        })
        this.socket.on("pause", (msg) => {
            this.setState({ paused: msg })
        })
        this.socket.on("title", (title)=>{
            this.setState({presentationName:title})
        })
    }
    pause = () => {
        this.socket.emit("pause", !this.state.paused);
        this.setState({ paused: !this.state.paused })
    }

    render() {
        return (
            <View>
                <StatusBar style="light" />
                <Appbar.Header statusBarHeight={25}>
                    <Appbar.Content
                        title={this.state.presentationName}
                    />

                    <Appbar.Action icon={this.state.paused ? "play" : "pause"} onPress={() => this.pause()} />
                </Appbar.Header>

                <View style={styles.container}>
                    <View style={styles.buttonGroup}>
                        <IconButton
                            icon="chevron-up"
                            size={40}
                            color="white"
                            style={styles.button}
                            onPress={() => this.changeSlide("up")}
                        />
                        <View style={styles.leftRight}>
                            <IconButton
                                icon="chevron-left"
                                size={40}
                                color="white"
                                style={styles.button}
                                onPress={() => this.changeSlide("left")}
                            />
                            <IconButton
                                icon="chevron-right"
                                size={40}
                                color="white"
                                style={styles.button}
                                onPress={() => this.changeSlide("right")}
                            />
                        </View>

                        <IconButton
                            icon="chevron-down"
                            size={40}
                            color="white"
                            style={styles.button}
                            onPress={() => this.changeSlide("down")}
                        />
                    </View>
                    <View style={{ alignItems: "center" }}>
                        <Title>Current Slide</Title>
                        <Text style={{ fontSize: 40 }}>{this.state.currentSlide}</Text>
                    </View>
                    <View style={{ alignItems: 'center', }}>
                        <Title>Notes for the presentation</Title>
                        <Text style={{ width: 300 }}>{this.state.slideNotes}</Text>
                    </View>
                    <Button onPress={() => console.log("Pressed")} style={styles.pointerButton} color="white">
                        Pointer
          </Button>
                </View>
            </View>
        )
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