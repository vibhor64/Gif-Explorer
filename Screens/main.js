// Crafted by - Vibhor Sharma
// Contact: vibhor05sharma@gmail.com

import { FlatList, Image, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';
import * as Sharing from 'expo-sharing';

export default function Main() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [query, setQuery] = useState('');
    const [gifs, setGifs] = useState([]);
    const [staticImages, setStaticImages] = useState([]);
    const [toggledGifs, setToggledGifs] = useState(new Set()); 
    const [offset, setOffset] = useState(0);
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const API_KEY = 'UPtB1DNME9gXzmoBy7m75UcSLJSzlJP8';
    const LIMIT = 10; // Number of GIFs per API call

    // Fetch GIFs from Giphy
    const fetchGIFS = async () => {
        let url = `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=${LIMIT}&offset=${offset}`;

        if (query !== "") {
            url = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${LIMIT}&offset=${offset}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();

            const newGifs = data.data.map(gif => ({
                gifUrl: gif.images.original.url,  // Full animated GIF
                staticImageUrl: gif.images.fixed_height_small_still.url,  // Static image URL (first frame)
                id: gif.id,  // ID for each GIF
                title: gif.title,  // Optional: Title for the GIF
            }));

            setStaticImages(prevStaticImages => [
                ...prevStaticImages,
                ...newGifs.map(gif => gif.staticImageUrl)  // Storing static image URLs
            ]);

            setGifs(prevGifs => [...prevGifs, ...data.data]);
            setOffset(prevOffset => prevOffset + LIMIT);
            console.log(data)
        } catch (error) {
            console.error('Error fetching GIFs:', error);
        }
    };

    // Handle search on keystroke
    const handleSearch = (searchTerm) => {
        setQuery(searchTerm);
        setGifs([]);
        setOffset(0);
    }

    // Fetch initial GIFs
    useEffect(() => {
        fetchGIFS();
    }, []);

    // Debounce search query
    useEffect(() => {
        // Set a timer to update debouncedQuery after the user stops typing
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 700); // Adjust debounce delay (in ms) as needed

        // Cleanup the timer if the user types within the delay period
        return () => {
            clearTimeout(handler);
        };
    }, [query]);

    // Trigger search when debouncedQuery changes
    useEffect(() => {
        if (debouncedQuery) {
            fetchGIFS();
        }
    }, [debouncedQuery]);

    // Toggle dark mode
    const toggleMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    // Array of GIF URLs for testing
    const gifUrls = [
        'https://media1.tenor.com/m/Jo0PbgBIZzAAAAAC/chill-guy-my-new-character.gif',
        'https://media1.tenor.com/m/OqAR3wsHrSgAAAAC/im-cool-i%27m-cool.jpg',
        'https://media1.tenor.com/m/CnFEvrWLntsAAAAC/imfine-cool',
        'https://media1.tenor.com/m/D6o8j6Dir40AAAAC/i%27m-fine-karen-mott.gif',
        'https://media1.tenor.com/m/B9OjyPMq5pIAAAAC/fine-this-is-fine.gif',
        'https://media1.tenor.com/m/qFQmBewtKosAAAAC/detective-pikachu.gif',
        'https://media1.tenor.com/m/Jo0PbgBIZzAAAAAC/chill-guy-my-new-character.gif',
        'https://media1.tenor.com/m/OqAR3wsHrSgAAAAC/im-cool-i%27m-cool.jpg',
        'https://media1.tenor.com/m/CnFEvrWLntsAAAAC/imfine-cool',
        'https://media1.tenor.com/m/D6o8j6Dir40AAAAC/i%27m-fine-karen-mott.gif',
        'https://media1.tenor.com/m/B9OjyPMq5pIAAAAC/fine-this-is-fine.gif',
        'https://media1.tenor.com/m/qFQmBewtKosAAAAC/detective-pikachu.gif',
        'https://media1.tenor.com/m/Jo0PbgBIZzAAAAAC/chill-guy-my-new-character.gif',
        'https://media1.tenor.com/m/OqAR3wsHrSgAAAAC/im-cool-i%27m-cool.jpg',
        'https://media1.tenor.com/m/CnFEvrWLntsAAAAC/imfine-cool',
        'https://media1.tenor.com/m/D6o8j6Dir40AAAAC/i%27m-fine-karen-mott.gif',
        'https://media1.tenor.com/m/B9OjyPMq5pIAAAAC/fine-this-is-fine.gif',
        'https://media1.tenor.com/m/qFQmBewtKosAAAAC/detective-pikachu.gif',
        'https://media1.tenor.com/m/Jo0PbgBIZzAAAAAC/chill-guy-my-new-character.gif',
        'https://media1.tenor.com/m/OqAR3wsHrSgAAAAC/im-cool-i%27m-cool.jpg',
        'https://media1.tenor.com/m/CnFEvrWLntsAAAAC/imfine-cool',
        'https://media1.tenor.com/m/D6o8j6Dir40AAAAC/i%27m-fine-karen-mott.gif',
        'https://media1.tenor.com/m/B9OjyPMq5pIAAAAC/fine-this-is-fine.gif',
        'https://media1.tenor.com/m/qFQmBewtKosAAAAC/detective-pikachu.gif',
    ];

    // Render each GIF component
    const renderGif = ({ item }) => {
        console.log('Rendering GIF:', item.images.original.url);
    
        // Check if the current GIF ID is in the toggled set
        const isStatic = toggledGifs.has(item.id);
    
        // Determine the source URL based on the toggle state
        const imageUrl = isStatic
            ? item.images.fixed_height_small_still.url  // Static image URL
            : item.images.original.url;  // Animated GIF URL
    
        // Toggle the GIF's state when pressed
        const handlePress = () => {
            setToggledGifs(prevState => {
                const newState = new Set(prevState);
                if (newState.has(item.id)) {
                    newState.delete(item.id);  // Remove from set (animated version)
                } else {
                    newState.add(item.id);  // Add to set (static version)
                }
                return newState;
            });
        };
    
        return (
            <TouchableOpacity
                style={styles.gifContainer}
                onPress={handlePress}  // Toggle on press
                onLongPress={() => downloadImage(imageUrl)}  // Handle image download
            >
                <Image
                    source={{ uri: imageUrl }}  // Use the toggled URL (static or gif)
                    style={styles.gif}
                    resizeMode="contain"
                    onError={() => console.error('Failed to load GIF:', item.status)}
                />
            </TouchableOpacity>
        );
    };
    
    // Handle image download
    const downloadImage = async (imageUrl) => {
        try {
            // Request permission to save media to the gallery
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'You need to grant storage permissions to download the file.');
                return;
            }

            // Get the local URI
            const fileUri = FileSystem.documentDirectory + imageUrl.split('/').pop();

            // Download the file
            const downloadResumable = FileSystem.createDownloadResumable(
                imageUrl,
                fileUri
            );
            const { uri } = await downloadResumable.downloadAsync();

            // Save to the gallery
            const asset = await MediaLibrary.createAssetAsync(uri);
            await MediaLibrary.createAlbumAsync('Downloads', asset, false);
            Alert.alert('Download Complete', 'Image saved to gallery!');

            // Share the downloaded image
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(uri);
            } else {
                Alert.alert('Sharing not available', 'Sharing is not available on this device.');
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', 'Failed to download or share the image.');
        }
    };


    {
        return (
            <View style={[styles.container, { backgroundColor: isDarkMode ? '#0E1117' : '#ffffff' }]}>

                {/* Header */}
                <Text style={{ fontSize: 40, fontWeight: 'bold', zIndex: 2, color: isDarkMode ? '#ffffff' : '#0E1117' }}>GIF Sonic</Text>
                <TextInput
                    placeholder='Search'
                    style={{ width: 300, height: 40, backgroundColor: '#fff', marginTop: 10, borderRadius: 10, paddingLeft: 10, borderWidth: 2, borderColor: '#b8b8b8' }}
                    value={query}
                    onChangeText={(text) => {
                        // setQuery(text);
                        handleSearch(text);
                    }}
                />
                <Image source={require('../assets/sonic.png')}
                    style={styles.logo}
                />

                {/* Dark Mode */}
                <View style={styles.darkmode}>
                    {/* <Text style={{ color: isDarkMode ? '#ffffff' : '#0E1117', fontWeight: 'bold' }}>Toggle Theme</Text> */}
                    <Image source={require('../assets/light.png')} style={{ width: 20, height: 20, marginLeft: -10 }} />
                    <Switch value={isDarkMode} onValueChange={toggleMode} style={{ marginLeft: 0 }} trackColor={{ false: '#0E1117', true: '#b8b8b8' }} thumbColor={'#ffffff'} />
                    <Image source={require('../assets/dark.png')} style={{ width: 20, height: 20, marginLeft: 5 }} />
                </View>

                {/* Quick Test - saves plenty of time */}
                {/* <FlatList
                    data={gifUrls}
                    // keyExtractor={(item, index) => `${item}-${index}`} // Create unique keys
                    keyExtractor={(item) => item.id}

                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.gifContainer} onLongPress={() => downloadImage(item)}>
                            <Image source={{ uri: item }} 
                            style={styles.gif}
                            resizeMode="contain"
                            onError={() => console.error('Failed to load GIF:', item )}
                            />
                        </TouchableOpacity>
                    )}
                    style={styles.list}
                    numColumns={2}
                /> */}

                <FlatList
                    data={gifs}
                    keyExtractor={(item) => item.id}
                    onEndReached={() => fetchGIFS()}
                    onEndReachedThreshold={0.5}
                    renderItem={renderGif}
                    style={styles.list}
                    numColumns={2}
                />
            </View>
        );
    }
}

// Styles
const styles = StyleSheet.create({
    container: {
        // flex: 1,
        height: '100%',
        width: '100%',
        backgroundColor: '#fff',
        alignItems: 'center',
        marginTop: 80
        // justifyContent: 'center',
    },
    logo: {
        position: 'absolute',
        top: -59,
        right: 20,
        width: 180,
        height: 180,
        resizeMode: 'contain'
    },
    darkmode: {
        position: 'relative',
        marginBottom: 30,
        top: 10,
        left: 0,
        width: 150,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        flexDirection: 'row',
        // paddingHorizontal: 20,
    },
    list: {
        flex: 1,
        height: 500,
        width: 380,
        // backgroundColor: '#adadad',
    },
    gif: {
        width: 170,
        height: 170,
        margin: 5,
        // borderWidth: 10,
        borderColor: '#fff',
        backgroundColor: '#919191',
    },
    gifContainer: {
        flex: 1,
        zIndex: 10,
        padding: 8,
        margin: 8,
        alignItems: 'center',
    },
});
