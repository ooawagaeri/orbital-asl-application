import * as React from 'react';
import { Alert, Text, View, StyleSheet, Image, TextInput, Button, FlatList } from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import {useState, useCallback, useRef} from "react";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import './Global.js'

function TranslatorScreen() {
    const [ans, setAns] = useState('')
    const [letters, setLetters] = useState([])
    const [isWord,setIsWord] = useState(null)
    var holdLetters =[]
    var holdImage = []

    // POST user response and return is_correct
    function checkAns() {
        fetch(TRANSLATOR_API + ans,{
            method:"GET"
        })
        .then(response => response.json())
        .then(responseJson => {
            // setImage(responseJson)
            holdImage = responseJson
            sortLetter(ans,holdImage)
            if (holdImage.length === 0) {
                setIsWord(false)
            } else {
                setIsWord(true)
            }
        })
        .catch(error => Alert.alert("error", error.message))
    }

    function sortLetter(ans,image) {
        holdLetters=[]
        for (var i = 0; i < ans.length; i++) {
            for (var j = 0; j < image.length; j++) {
                if (ans[i].toUpperCase() === image[j].name){
                    holdLetters.push({id:i,title: image[j].name, url: image[j].image})
                }
            }
        }
        setLetters(holdLetters)
        console.log({holdLetters})
    }

    function Slide({ data }) {
        return (
            <View
                style={{
                    height:350,
                    width:300,
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                <Image resizeMode={"contain"} source={{ uri: data.url }} style={{width: 300, height:300}}/>
                <Text style={{fontSize: 24 }}>{data.title}</Text>
            </View>
        );
    }

    function Pagination({ index }) {
        return (
            <View style={styles.pagination} pointerEvents="none">
                {letters.map((_, i) => {
                    return (
                        <View
                            key={i}
                            style={[
                                styles.paginationDot,
                                index === i
                                    ? styles.paginationDotActive
                                    : styles.paginationDotInactive,
                            ]}
                        />
                    );
                })}
                <MaterialCommunityIcons name="gesture-swipe-horizontal" size={24} color="black" />
            </View>
        );
    }

    function Carousel() {
        const [index, setIndex] = useState(0);
        const indexRef = useRef(index);
        indexRef.current = index;
        const onScroll = useCallback((event) => {
            const slideSize = event.nativeEvent.layoutMeasurement.width;
            const index = event.nativeEvent.contentOffset.x / slideSize;
            const roundIndex = Math.round(index);
            const distance = Math.abs(roundIndex - index);
            const isNoMansLand = distance > 0.4;
            if (roundIndex !== indexRef.current && !isNoMansLand) {
                setIndex(roundIndex);
            }
        }, []);
        return (
            <View style={{flex:1,height:300,width:300}}>
                <FlatList data={letters}
                          keyExtractor={(item, index)=> item.id.toString()}
                          style={{ flex: 1 }}
                          renderItem={renderItem}
                          horizontal={true}
                          pagingEnabled={true}
                          showsHorizontalScrollIndicator={false}
                          onScroll={onScroll}
                />
                <Pagination index={index}/>
            </View>
        )}

    const renderItem = useCallback(function renderItem({ item }) {
        return <Slide data={item} />;
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={["#feb157","#ffd26c"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.top}>
                <Text style={styles.header}>DICTIONARY LOOKUP</Text>
                <View style={styles.rectangle}/>
                <Text style={styles.prompt}>Key in the word to translate into ASL!{"\n"}Swipe the pictures!</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setAns}
                    value={ans}
                    placeholder="Letter/Word"
                />
                <View style={styles.submitButton}>
                    <Button title="Submit" onPress={() => checkAns()}/>
                </View>
                {(ans === '') ? (<Text style={styles.markingNull}>No word submitted</Text>)
                    : (isWord === false) ? (<Text style={styles.noSuchWord}>No such word</Text>)
                        : <Carousel/>
                }
            </LinearGradient>
        </View>
    )}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    header: {
        marginTop: 50,
        width: 350,
        padding: 0,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "left",
        fontSize: 30,
        fontWeight: "bold",
    },
    rectangle: {
        marginTop:10,
        width:330,
        height:10,
        backgroundColor:'white',
        alignSelf:'flex-start',
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,

    },
    prompt: {
        width: 350,
        padding: 10,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "transparent",
        color: "#20232a",
        textAlign: "center",
        fontSize: 15,
    },
    top: {
        flex: 1,
        borderWidth: 0,
        borderBottomLeftRadius: 50,
        borderBottomRightRadius: 50,
        alignItems:'center',
    },
    input: {
        marginTop: 10,
        marginBottom: 0,
        width: 350,
        padding: 10,
        borderWidth: 4,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
    },
    submitButton: {
        marginBottom:20
    },
    pagination: {
        bottom: 120,
        width: "100%",
        justifyContent: "center",
        flexDirection: "row",
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 2,
        backgroundColor:'#eaeaea',
    },
    paginationDotActive: { backgroundColor: "lightblue" },
    paginationDotInactive: { backgroundColor: "gray" },
    markingNull: {
        width: 250,
        padding: 8,
        borderWidth: 0,
        borderColor: "#eaeaea",
        borderRadius: 50,
        backgroundColor: "#eaeaea",
        color: "#20232a",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
    noSuchWord: {
        width: 250,
        padding: 8,
        borderWidth: 0,
        borderColor: "#ff3232",
        borderRadius: 50,
        backgroundColor: "#ff3232",
        color: "#eaeaea",
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
})

export default TranslatorScreen
