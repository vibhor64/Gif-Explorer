import { Image, StyleSheet, Text, View } from 'react-native';

export default function Gif({ item }) {

    console.log(item)
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: item }}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: 400,
        width: 400,
        margin: 10,
        backgroundColor: '#63501a',
    },
    gif: {
        flex: 1,
        height: 400,
        width: 400,
        margin: 10,
        backgroundColor: '#8f1d78',
        zIndex: 10
    }
});
