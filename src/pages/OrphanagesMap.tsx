import React from "react";
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Feather } from "@expo/vector-icons";

import mapMarker from "../images/map-marker.png";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RectButton } from "react-native-gesture-handler";
import api from "../services/api";

interface IOrphanages{
    id: number,
    name: string,
    latitude: number,
    longitude: number,
}

export default function OrphanagesMap(){
    const [ orphanages, setOrphanages ] = React.useState<IOrphanages[]>([]);
    const navigation = useNavigation();

    useFocusEffect(()=>{
        const request = async() => {
            const result = await api.get("orphanages");
            setOrphanages(result.data);
        }
        request();
    })
    function hangleNavigateToOrphanageDetails(id: number){
        navigation.navigate("OrphanageDetails", { id });
    }
    function handleNavigateToCreateOrphanage(){
        navigation.navigate("SelectMapPosition");
    }
    return(
        <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map} 
        initialRegion={{
          latitude: -12.9477901,
          longitude: -38.4145221,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
      >
        {orphanages.map(orphanage => {
            return (
                <Marker
                    key={orphanage.id}
                    icon={mapMarker}
                    coordinate={{
                    latitude: orphanage.latitude,
                    longitude: orphanage.longitude,
                    }}
                    calloutAnchor={{
                    x: 2.7,
                    y: 0.8,
                    }}
              >
                <Callout tooltip onPress={()=>{hangleNavigateToOrphanageDetails(orphanage.id)}}>
                  <View style={styles.calloutContainer}>
                    <Text style={styles.calloutText}>{orphanage.name}</Text>
                  </View>
                </Callout>
              </Marker>
            )
        })}
      </MapView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>

        <RectButton style={styles.createOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
          <Feather name="plus" size={20} color="#FFF"/>
        </RectButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },

  calloutContainer: {
    width: 160,
    height: 48,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    justifyContent: "center",

  },

  calloutText: {
    color: "#0089a5",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
  },

  footer:{
    position: "absolute",
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: "#FFF",
    borderRadius: 28,
    height: 56,
    paddingLeft:24,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 3,
  },

  footerText:{
    fontFamily: "Nunito_700Bold",
    color: "#8fa7b5",

  },

  createOrphanageButton:{
    width: 56,
    height: 56,
    backgroundColor: "#15c3d6",
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
});
