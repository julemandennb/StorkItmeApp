import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';


export async function storeSaveInfo(key:string, data:string) {
    try {
        if (Platform.OS === 'web') {
            await AsyncStorage.setItem(key, data);
        } else { // mobile
            await SecureStore.setItemAsync(key, data);
        }
    } catch (error) {
        console.error("Error saving data:", error); 
    }
}

export async function storeGetInfo(key:string) {
    try {
        if (Platform.OS === 'web') {
            return await AsyncStorage.getItem(key);
        }
        else { // mobile
            return await SecureStore.getItemAsync(key);
        }
    } catch (error) {
        console.error("Error retrieving data:", error);
        return null;
    }
}

export async function storeRemoveItem(key:string)
{
    if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(key);
    } else { // mobile
        await SecureStore.deleteItemAsync(key);
    }
}
